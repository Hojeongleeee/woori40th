import {
  GOOGLE_SHEET_ENDPOINT,
  SIMULATE_SUBMIT_WHEN_NO_ENDPOINT,
} from '../config'
import type { ApplyForm, SubmitResult } from '../types'
import { onlyDigits } from './validation'

const PLACEHOLDER = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE'

function endpointConfigured(): boolean {
  const url = GOOGLE_SHEET_ENDPOINT?.trim()
  return !!url && url !== PLACEHOLDER && /^https?:\/\//.test(url)
}

/**
 * 신청 데이터를 구글 시트(Apps Script 웹앱)로 전송합니다.
 *
 * CORS 관련 메모:
 *  - Apps Script 웹앱은 임의 헤더를 응답에 실을 수 없어 preflight(사전요청)를
 *    피해야 안전합니다. 그래서 Content-Type 을 text/plain 으로 보내
 *    "단순 요청(simple request)"으로 만듭니다.
 *  - 응답(JSON)을 읽어 중복/성공/오류를 구분합니다. 만약 브라우저가 응답 읽기를
 *    막으면(fetch 자체가 throw), 요청은 대개 시트에 기록됐을 수 있으므로
 *    네트워크 오류로 안내하고 재시도/문의를 유도합니다.
 */
export async function submitApplication(form: ApplyForm): Promise<SubmitResult> {
  // 엔드포인트 미설정 → 테스트 모드
  if (!endpointConfigured()) {
    if (SIMULATE_SUBMIT_WHEN_NO_ENDPOINT) {
      await delay(900)
      // 콘솔에 어떤 값이 전송될지 표시 (개발 편의)
      console.info('[Woori40th] (테스트 모드) 전송될 데이터:', buildPayload(form))
      return { ok: true, simulated: true }
    }
    return {
      ok: false,
      reason: 'server',
      message: '아직 신청 서버가 연결되지 않았어요. 잠시 후 다시 시도해 주세요.',
    }
  }

  try {
    const res = await fetch(GOOGLE_SHEET_ENDPOINT, {
      method: 'POST',
      // 단순 요청으로 만들어 preflight 회피
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(buildPayload(form)),
      redirect: 'follow',
    })

    // 응답 파싱 시도 (Apps Script 가 JSON 을 돌려줌)
    const data = await res.json().catch(() => null as null | Record<string, unknown>)

    if (data && typeof data.result === 'string') {
      switch (data.result) {
        case 'success':
          return { ok: true }
        case 'duplicate':
          return {
            ok: false,
            reason: 'duplicate',
            message: '이미 같은 번호로 신청되어 있어요.',
          }
        case 'error':
          return {
            ok: false,
            reason: 'server',
            message: (data.message as string) || '서버에서 오류가 발생했어요.',
          }
      }
    }

    // 응답 형식을 모르지만 HTTP 상태가 정상이면 성공으로 간주
    if (res.ok) return { ok: true }

    return { ok: false, reason: 'server', message: `서버 응답 오류 (${res.status})` }
  } catch {
    return {
      ok: false,
      reason: 'network',
      message:
        '전송 중 네트워크 문제가 발생했어요. 잠시 후 다시 시도하거나 준비위원회로 문의해 주세요.',
    }
  }
}

function buildPayload(form: ApplyForm) {
  return {
    name: form.name.trim(),
    phone: onlyDigits(form.phone), // 숫자만 저장(중복 판별 일관성)
    phoneFormatted: form.phone.trim(),
    cohort: form.cohort.trim(),
    agree: form.agree,
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
