import { GOODS } from '../config'
import Reveal from './Reveal'
import Halftone from './Halftone'

/** 가을·우디를 상징하는 앰버 포인트 (오브제의 향 계열 힌트) — 다크 배경용으로 밝게 */
const AMBER_HEX = '#dca24a'

/**
 * 창립제 굿즈 — 비밀에 부친 40주년 기념 오브제.
 * 정체는 밝히지 않고, 향과 온기의 힌트만 흘려 신비롭게 남긴다.
 */
export default function Goods() {
  return (
    <section
      id="goods"
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-cocoa via-ink to-ink px-6 py-24 sm:py-32"
    >
      <Halftone colorClass="text-gold" opacity={0.16} variant="sideLeft" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <Reveal className="text-center">
          <p
            className="mb-4 text-xs font-medium uppercase tracking-[0.34em]"
            style={{ color: AMBER_HEX }}
          >
            {GOODS.kicker}
          </p>
          <h2 className="text-3xl text-cream sm:text-4xl">{GOODS.title}</h2>
          <div
            className="mx-auto mt-6 h-px w-14"
            style={{ background: `linear-gradient(90deg, transparent, ${AMBER_HEX}, transparent)` }}
          />
        </Reveal>

        <div className="mt-14 grid items-center gap-8 sm:grid-cols-2 sm:gap-10">
          {/* 봉인된 오브제 */}
          <Reveal>
            <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-3xl border border-dashed border-cream/15 bg-white/[0.04]">
              <span className="dots absolute inset-0 text-gold/15" aria-hidden />
              {/* 흐릿한 향의 광원 */}
              <span
                className="absolute h-40 w-40 rounded-full blur-2xl"
                style={{ background: `${AMBER_HEX}55` }}
              />
              <span className="absolute h-28 w-28 rounded-full bg-gold/25 blur-2xl" />
              {/* 자물쇠 */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <span
                  className="grid h-16 w-16 place-items-center rounded-full border bg-cocoa/60 backdrop-blur-sm"
                  style={{ borderColor: `${AMBER_HEX}66`, color: AMBER_HEX }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    <circle cx="12" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <span className="font-en text-6xl font-light text-cream/25">?</span>
                <span className="rounded-full border border-cream/15 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cream/70 backdrop-blur-sm">
                  Opens on the day
                </span>
              </div>
            </div>
          </Reveal>

          {/* 힌트 */}
          <Reveal delay={120}>
            <p className="text-lg font-light leading-relaxed text-cream/85">{GOODS.teaser}</p>
            <ul className="mt-6 space-y-3">
              {GOODS.hints.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm leading-relaxed text-cream/75">
                  <span
                    className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rotate-45"
                    style={{ background: AMBER_HEX }}
                  />
                  {h}
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 text-sm font-medium" style={{ color: AMBER_HEX }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c.4 3.7 1.8 5.1 5.5 5.5-3.7.4-5.1 1.8-5.5 5.5-.4-3.7-1.8-5.1-5.5-5.5 3.7-.4 5.1-1.8 5.5-5.5Z" />
              </svg>
              {GOODS.reveal}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
