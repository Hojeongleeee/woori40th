import { CORNERS } from '../config'
import { CORNER_ICONS, SparkleIcon } from './Icons'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * 특별 코너 — 아이콘 + 짧은 설명 카드. 검정 위 앰버 포인트.
 */
export default function SpecialCorners() {
  return (
    <section
      id="corners"
      className="anchor-offset relative overflow-hidden bg-ink px-6 py-24 sm:py-32"
    >
      <Halftone colorClass="text-marigold" opacity={0.28} variant="sideLeft" coarse />

      <div className="relative z-10 mx-auto max-w-4xl">
        <Reveal className="text-center">
          <p className="mb-4 font-en text-xs font-semibold uppercase tracking-[0.34em] text-marigold">
            Special Corners
          </p>
          <h2 className="text-3xl text-cream sm:text-4xl">즐길 거리, 네 가지</h2>
          <div className="mx-auto mt-6 h-px w-14 bg-marigold" />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {CORNERS.map((corner, i) => {
            const Icon = CORNER_ICONS[corner.icon] ?? SparkleIcon
            return (
              <Reveal
                key={corner.title}
                delay={i * 80}
                className="group flex gap-5 rounded-none border border-cream/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-marigold/40 hover:bg-white/[0.07] sm:p-7"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-none border border-marigold/25 bg-gradient-to-br from-marigold/15 to-transparent text-marigold transition-colors group-hover:text-cream">
                  <Icon className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="text-xl text-cream">{corner.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">{corner.desc}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
