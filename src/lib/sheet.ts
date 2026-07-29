import { GOOGLE_SHEET_ENDPOINT } from '../config'

/* ==================================================================
 *  구글 시트(Apps Script 웹앱) 연결 — 엔드포인트 확인 + 신청 수 조회
 * ------------------------------------------------------------------
 *  "신청 마감 현황" 바는 상단 고정바와 신청 섹션 두 곳에 있습니다.
 *  각자 따로 불러오면 요청이 두 번 나가므로, 여기 모듈 하나에 값을 두고
 *  두 컴포넌트가 같이 구독합니다. (useAppliedCount 훅 참고)
 * ================================================================== */

const PLACEHOLDER = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE'

export function endpointConfigured(): boolean {
  const url = GOOGLE_SHEET_ENDPOINT?.trim()
  return !!url && url !== PLACEHOLDER && /^https?:\/\//.test(url)
}

/* ---------------- 신청 수 저장소 (초경량 외부 스토어) ---------------- */

/** 아직 못 불러왔으면 null → 화면은 config 의 FILLED_PERCENT 로 대체 표시. */
let count: number | null = null
let loading = false
let started = false

const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

export function subscribeCount(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getCountSnapshot(): number | null {
  return count
}

/** 첫 번째 구독자가 붙을 때 한 번만 불러온다. */
export function ensureCountLoaded(): void {
  if (started) return
  started = true
  void refreshCount()
}

/**
 * 시트의 현재 신청 수를 가져온다.
 * 실패하면 조용히 넘어가고 기존 값(또는 fallback)을 그대로 쓴다 —
 * 마감 현황은 참고 정보라 오류를 띄울 만큼 중요하지 않다.
 */
/** 브라우저·프록시 캐시를 피하기 위한 일회용 값 (Date 대신 단조 증가 카운터) */
let nonce = 0

export type SheetStatus = {
  /** 현재 신청 수. 못 읽었으면 null */
  count: number | null
  /** 이 번호로 접수된 신청이 있는지. 옛 배포(v3 이하)는 이 값을 안 주므로 undefined */
  exists?: boolean
}

/**
 * 시트 상태 조회 (GET).
 *
 * 제출(POST)은 시트에 잘 저장되는데도 Apps Script 가 넘겨주는
 * googleusercontent 주소를 브라우저가 다시 읽을 때 404 가 나는 일이 있다.
 * 그래서 "저장됐는지" 는 응답이 아니라 이 GET 으로 확인한다.
 */
export async function fetchStatus(phone?: string): Promise<SheetStatus> {
  if (!endpointConfigured()) return { count: null }

  const params = new URLSearchParams({ action: phone ? 'check' : 'count' })
  if (phone) params.set('phone', phone)
  params.set('_', String(++nonce))

  try {
    const res = await fetch(`${GOOGLE_SHEET_ENDPOINT}?${params}`, {
      redirect: 'follow',
      cache: 'no-store',
    })
    const data: unknown = await res.json().catch(() => null)
    if (!data || typeof data !== 'object') return { count: null }

    const d = data as { count?: unknown; exists?: unknown }
    return {
      count: typeof d.count === 'number' ? d.count : null,
      exists: typeof d.exists === 'boolean' ? d.exists : undefined,
    }
  } catch {
    return { count: null }
  }
}

/** 확인된 신청 수를 저장소에 반영한다 (제출 확인 후 호출). */
export function setCount(next: number): void {
  if (next === count) return
  count = next
  emit()
}

export async function refreshCount(): Promise<void> {
  if (!endpointConfigured() || loading) return
  loading = true
  try {
    const res = await fetch(`${GOOGLE_SHEET_ENDPOINT}?action=count`, {
      redirect: 'follow',
    })
    const data: unknown = await res.json().catch(() => null)
    const next =
      data && typeof (data as { count?: unknown }).count === 'number'
        ? (data as { count: number }).count
        : null

    if (next !== null && next !== count) {
      count = next
      emit()
    }
  } catch {
    // 네트워크·CORS 문제 → fallback 유지
  } finally {
    loading = false
  }
}
