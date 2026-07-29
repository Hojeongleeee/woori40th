import { LUCKY_DRAW } from '../config'
import { SparkleIcon } from './Icons'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * 럭키 드로우 — 창립제 당일 경품 추첨.
 * 경품이 확정되기 전까지는 안내 문구와 후원 연락처만 보여준다.
 * (App.tsx 에서 섹션 자체를 주석 처리해 두었고, 경품이 정해지면 주석을 해제한다.)
 */
export default function LuckyDraw() {
  return (
    <section
      id="lucky-draw"
      className="anchor-offset relative overflow-hidden bg-marigold px-6 py-16 sm:py-20"
    >
      {/* 포스터의 앰버 필드를 정면으로 — 검정 도트가 위로 흩어진다 */}
      <Halftone colorClass="text-ink" opacity={0.12} variant="screenUp" coarse />
      <div className="aura absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 bg-white/25" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="mb-4 flex items-center justify-center gap-2 font-en text-xs font-semibold uppercase tracking-[0.34em] text-ink">
            <SparkleIcon className="h-4 w-4" />
            {LUCKY_DRAW.kicker}
          </p>
          <h2 className="text-3xl text-ink sm:text-4xl">{LUCKY_DRAW.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/75">
            {LUCKY_DRAW.lead}
          </p>
          <div className="mx-auto mt-6 h-px w-14 bg-ink" />
        </Reveal>

        {/* 경품 후원 안내 */}
        <Reveal delay={120} className="mx-auto mt-10 max-w-2xl">
          <p className="border border-ink/30 bg-paper/60 p-6 text-center text-sm leading-relaxed text-graphite backdrop-blur-sm break-keep">
            {LUCKY_DRAW.sponsor}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
