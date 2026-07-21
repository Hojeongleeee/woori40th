import { TIMELINE } from '../config'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * 프로그램 타임라인 — 세로 타임라인. 베이스 노트의 깊은 우디 톤 위에서.
 */
export default function Timeline() {
  return (
    <section
      id="program"
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-cocoa to-espresso px-6 py-24 sm:py-32"
    >
      <Halftone colorClass="text-gold" opacity={0.16} variant="side" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <Reveal className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.34em] text-gold">
            Program
          </p>
          <h2 className="text-3xl text-cream sm:text-4xl">오늘의 흐름</h2>
          <p className="mt-4 text-sm text-cream/60">층층이 쌓인 향수와 같은 두 시간</p>
          <div className="mx-auto mt-6 h-px w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </Reveal>

        <ol className="relative mt-14 ml-2 border-l border-latte/30 pl-8 sm:ml-4 sm:pl-10">
          {TIMELINE.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 80}
              className="relative pb-11 last:pb-0"
            >
              {/* 노드 */}
              <span className="absolute -left-[41px] top-0.5 grid h-6 w-6 place-items-center rounded-full border border-gold/50 bg-espresso sm:-left-[51px]">
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-gold to-golddeep" />
              </span>

              <div className="flex flex-wrap items-baseline gap-3">
                <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-0.5 text-xs font-semibold text-gold">
                  {item.time}
                </span>
                <h3 className="text-xl text-cream sm:text-2xl">{item.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-cream/65">{item.desc}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
