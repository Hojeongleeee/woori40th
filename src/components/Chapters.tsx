import { CHAPTERS } from '../config'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * 사계절 4개 챕터 — 하나의 향수 컬렉션.
 * 각 카드는 계절/향을 상징하는 포인트 컬러로 개성을 살리되,
 * 레이아웃·타이포는 통일해 하나의 브랜드로 읽히도록 구성.
 * Chapter 03(창립제)은 이 사이트의 중심 이벤트로 강조된다.
 */
export default function Chapters() {
  return (
    <section
      id="chapters"
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-mist via-cream to-[#e5d4b4] px-6 py-24 sm:py-32"
    >
      <Halftone colorClass="text-gold" opacity={0.3} variant="sideLeft" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.34em] text-latte">
            The Collection · Four Chapters
          </p>
          <h2 className="text-3xl text-espresso sm:text-4xl">사계절, 네 개의 챕터</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-latte">
            봄의 첫 향에서 겨울의 잔향까지 — 네 번의 무대가 마치 하나의 향수가 됩니다.
          </p>
          <div className="mx-auto mt-6 h-px w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.no} delay={i * 80} className="h-full">
              <article
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
                  c.current
                    ? 'bg-gradient-to-b from-white/80 to-gold/12 ring-2 ring-gold/45 shadow-[0_22px_50px_-26px_rgba(201,146,47,0.45)] sm:scale-[1.03]'
                    : 'bg-white/20 opacity-90 ring-1 ring-latte/12 hover:bg-white/35 hover:opacity-100'
                }`}
              >
                {/* 상단 계절 색 — 은은하게 번지는 가로선 (창립제는 진하게) */}
                <span
                  className={`absolute inset-x-0 top-0 ${c.current ? 'h-1' : 'h-0.5'}`}
                  style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }}
                />

                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-en text-sm uppercase tracking-[0.22em] ${
                      c.current ? 'font-semibold text-golddeep' : 'text-latte'
                    }`}
                  >
                    {c.season}
                  </span>
                  {c.current ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-golddeep ring-1 ring-gold/30">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-golddeep/60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-golddeep" />
                      </span>
                      지금 이 무대
                    </span>
                  ) : (
                    <span className="text-sm text-latte/70">{c.seasonKo}</span>
                  )}
                </div>

                {/* 숫자 · 제목/역할을 한 줄로 묶어 컴팩트하게 */}
                <div className="mt-2.5 flex items-center gap-3">
                  <span
                    className="font-en text-4xl font-semibold leading-none"
                    style={{ color: c.accent }}
                  >
                    {c.no}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-en text-lg font-semibold leading-tight tracking-wide text-espresso">
                      {c.subtitle}
                    </h3>
                    <p className="mt-0.5 text-sm text-latte">{c.roleKo}</p>
                  </div>
                </div>

                <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-espresso/85">
                  {c.note}
                </p>

                {/* 키워드 */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.keywords.map((k) => (
                    <span
                      key={k}
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{ color: c.accent, background: `${c.accent}1f` }}
                    >
                      {k}
                    </span>
                  ))}
                </div>

                {/* 향 계열 */}
                <p className="mt-3 flex items-center gap-2 border-t border-espresso/10 pt-2.5 text-sm text-latte">
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ background: c.accent }}
                  />
                  {c.scent}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-10 text-center text-2xl font-semibold leading-snug text-espresso sm:text-3xl">
            <span className="text-golddeep">Chapter 03 · Homecoming(창립제)</span>에 당신을 초대합니다.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
