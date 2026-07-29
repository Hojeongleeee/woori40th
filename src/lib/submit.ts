import {
  GOOGLE_SHEET_ENDPOINT,
  SIMULATE_SUBMIT_WHEN_NO_ENDPOINT,
} from '../config'
import type { ApplyForm, SubmitResult } from '../types'
import { endpointConfigured, fetchStatus, setCount } from './sheet'
import { onlyDigits } from './validation'

/* 저장 확인 폴링 — 이 간격으로 최대 이 횟수만큼 시트를 다시 확인한다. */
const CONFIRM_TRIES = 8
const CONFIRM_DELAY_MS = 1200

/**
 * 신청 데이터를 구글 시트(Apps Script 웹앱)로 전송합니다.
 *
 * ── 왜 응답을 안 읽고 GET 으로 확인하나
 * Apps Script 웹앱은 POST 를 받으면 script.googleusercontent.com 의 일회용
 * 주소로 302 를 내려준다. 브라우저가 그 주소를 다시 요청해 응답을 읽어야 하는데,
 * 이 두 번째 요청이 404 로 떨어지는 일이 있다. 그러면 시트에는 멀쩡히 저장됐는데
 * 화면에는 "실패" 가 뜨고, 사용자가 다시 넣으면 중복으로 막힌다. 실제로 그랬다.
 *
 * 그래서 흐름을 이렇게 바꿨다.
 *   1) 같은 번호가 이미 있는지 GET 으로 미리 확인 (중복 안내)
 *   2) POST 는 no-cors 로 던지고 응답은 읽지 않는다 (요청 자체는 정상 도달)
 *   3) 저장됐는지는 다시 GET 으로 확인한다 — GET 은 안정적으로 읽힌다
 *
 * 옛 배포(v3 이하)는 ?action=check 를 모르므로 exists 가 없다.
 * 그때는 신청 수가 늘었는지로 대신 판단한다.
 */
export async function submitApplication(form: ApplyForm): Promise<SubmitResult> {
  // 엔드포인트 미설정 → 테스트 모드
  if (!endpointConfigured()) {
    if (SIMULATE_SUBMIT_WHEN_NO_ENDPOINT) {
      await delay(900)
      console.info('[Woori40th] (테스트 모드) 전송될 데이터:', buildPayload(form))
      return { ok: true, simulated: true }
    }
    return {
      ok: false,
      reason: 'server',
      message: '아직 신청 서버가 연결되지 않았어요. 잠시 후 다시 시도해 주세요.',
    }
  }

  const phone = onlyDigits(form.phone)

  // 1) 제출 전 상태 — 중복 확인 + 신청 수 기준점
  const before = await fetchStatus(phone)
  if (before.exists === true) {
    return {
      ok: false,
      reason: 'duplicate',
      message: '이미 같은 번호로 신청되어 있어요.',
    }
  }

  // 2) 전송 — 응답은 읽지 않는다 (읽으려다 실패하면 저장됐는지 알 수 없게 된다)
  try {
    await fetch(GOOGLE_SHEET_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(buildPayload(form)),
    })
  } catch {
    return {
      ok: false,
      reason: 'network',
      message:
        '전송 중 네트워크 문제가 발생했어요. 잠시 후 다시 시도하거나 준비위원회로 문의해 주세요.',
    }
  }

  // 3) 정말 들어갔는지 확인
  for (let i = 0; i < CONFIRM_TRIES; i++) {
    await delay(CONFIRM_DELAY_MS)
    const now = await fetchStatus(phone)

    const saved =
      now.exists === true ||
      // 옛 배포 대비 — 신청 수가 늘었으면 들어간 것으로 본다
      (now.exists === undefined &&
        now.count !== null &&
        before.count !== null &&
        now.count > before.count)

    if (saved) {
      if (now.count !== null) setCount(now.count)
      return { ok: true }
    }
  }

  return {
    ok: false,
    reason: 'server',
    message:
      '접수 확인이 늦어지고 있어요. 이미 접수됐을 수 있으니 다시 넣기 전에 준비위원회로 확인해 주세요.',
  }
}

function buildPayload(form: ApplyForm) {
  return {
    name: form.name.trim(),
    phone: onlyDigits(form.phone), // 숫자만 저장(중복 판별 일관성)
    phoneFormatted: form.phone.trim(),
    cohort: form.cohort.trim(),
    agree: form.agree,
    helpPerform: form.helpPerform, // 공연 도움 의사 (선택)
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
