import { useEffect, useSyncExternalStore } from 'react'
import { EVENT, FILLED_PERCENT } from '../config'
import {
  ensureCountLoaded,
  getCountSnapshot,
  subscribeCount,
} from '../lib/sheet'

/** 0~100 범위로 안전하게 자르기 */
function clamp(n: number): number {
  return Math.max(0, Math.min(100, n))
}

/**
 * 구글 시트의 실제 신청 수를 좌석 수(EVENT.seats) 대비 진행률로 환산합니다.
 *
 * 아직 못 불러왔거나(로딩 중·엔드포인트 미설정·네트워크 오류) Apps Script 가
 * 옛 버전이라 count 를 안 돌려주면 config 의 FILLED_PERCENT 로 대체합니다.
 * 그래서 `live` 가 false 면 화면에 인원수는 감추고 퍼센트만 보여줍니다.
 */
export function useAppliedCount() {
  const count = useSyncExternalStore(
    subscribeCount,
    getCountSnapshot,
    () => null,
  )

  useEffect(() => {
    ensureCountLoaded()
  }, [])

  const seats = EVENT.seats
  const live = count !== null
  const percent = live ? clamp(Math.round((count / seats) * 100)) : clamp(FILLED_PERCENT)

  return { count, seats, percent, live }
}
