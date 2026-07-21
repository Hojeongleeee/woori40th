import { FILLED_PERCENT } from '../config'

/** 0~100 범위로 안전하게 자르기 */
const pct = Math.max(0, Math.min(100, FILLED_PERCENT))

/**
 * 화면 최상단에 항상 고정되는 마감 현황 바.
 * 수치는 config.ts 의 FILLED_PERCENT 하나로 제어됩니다.
 */
export default function ProgressBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-40">
      {/* 최상단 진행 라인 */}
      <div className="h-[3px] w-full bg-ink/30">
        <div
          className="h-full bg-gradient-to-r from-gold via-gold to-golddeep transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* 정보 바 */}
      <div className="border-b border-white/10 bg-ink/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <a
            href="#top"
            className="font-en text-sm tracking-wide text-cream/90 sm:text-base"
            aria-label="맨 위로"
          >
            Woori <span className="text-gold-gradient italic">40th</span>
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
                className="h-full rounded-full bg-gradient-to-r from-gold to-golddeep"
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
