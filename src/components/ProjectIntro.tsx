import { INTENT, PROJECT } from '../config'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * 기획 의도 — 향과 기억, 그리고 40주년 연간 프로젝트의 서사.
 */
export default function ProjectIntro() {
  return (
    <section
      id="about"
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-marigold via-cream to-paper px-6 py-24 sm:py-32"
    >
      {/* 히어로의 앰버 필드가 위에서부터 흩어지며 흰 여백으로 사라진다 */}
      <Halftone colorClass="text-marigold" opacity={0.7} variant="screenDown" coarse />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="mb-4 font-en text-xs font-semibold uppercase tracking-[0.34em] text-ink">
            {INTENT.kicker}
          </p>
          <h2 className="text-3xl leading-snug text-ink sm:text-4xl">{INTENT.title}</h2>
          <div className="mx-auto mt-6 h-px w-14 bg-ink" />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 space-y-6 text-left text-lg font-light leading-loose text-graphite/90 sm:text-xl">
            {INTENT.body.map((p, i) => (
              <p key={i} className={i === INTENT.body.length - 1 ? 'text-graphite' : undefined}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-12 font-script text-2xl text-ink sm:text-3xl">
            “{PROJECT.slogan}”
          </p>
        </Reveal>
      </div>
    </section>
  )
}
