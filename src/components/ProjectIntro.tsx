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
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-cream via-[#f0e6d2] to-mist px-6 py-24 sm:py-32"
    >
      <Halftone colorClass="text-gold" opacity={0.32} variant="side" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.34em] text-latte">
            {INTENT.kicker}
          </p>
          <h2 className="text-3xl leading-snug text-espresso sm:text-4xl">{INTENT.title}</h2>
          <div className="mx-auto mt-6 h-px w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 space-y-6 text-left text-lg font-light leading-loose text-espresso/90 sm:text-xl">
            {INTENT.body.map((p, i) => (
              <p key={i} className={i === INTENT.body.length - 1 ? 'text-espresso' : undefined}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-12 font-en text-lg italic tracking-wide text-latte">
            “{PROJECT.slogan}”
          </p>
        </Reveal>
      </div>
    </section>
  )
}
