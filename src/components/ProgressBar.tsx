import { useAppliedCount } from '../hooks/useAppliedCount'

/**
 * 화면 최상단에 항상 고정되는 마감 현황 바.
 * 구글 시트의 실제 신청 수를 좌석 수로 나눈 값이며,
 * 못 불러오면 config.ts 의 FILLED_PERCENT 로 대체됩니다.
 */
export default function ProgressBar() {
  const { percent: pct } = useAppliedCount()

  return (
    <div className="fixed inset-x-0 top-0 z-40">
      {/* 최상단 진행 라인 */}
      <div className="h-[3px] w-full bg-ink/40">
        <div
          className="h-full bg-marigold transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* 정보 바 */}
      <div className="border-b border-marigold/20 bg-ink/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <a
            href="#top"
            className="font-en text-sm font-semibold tracking-wide text-cream sm:text-base"
            aria-label="맨 위로"
          >
            WOORI <span className="text-marigold">40th</span>
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-xs text-cream/60 sm:inline">선착순 사전신청</span>
            <div
              className="h-1.5 w-20 overflow-hidden rounded-full bg-white/15 sm:w-32"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="신청 마감 현황"
            >
              <div
                className="h-full rounded-full bg-marigold"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-cream sm:text-sm">
              {pct}% 마감
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
