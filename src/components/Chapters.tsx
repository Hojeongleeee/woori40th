import { CHAPTERS } from '../config'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * 사계절 4개 챕터 — 하나의 향수 컬렉션.
 * 포스터 팔레트대로 카드는 흰 종이 + 검정 활자로 통일하고,
 * 이 사이트의 중심 이벤트인 Chapter 03(창립제)만 솔리드 앰버로 뒤집어 강조한다.
 */
export default function Chapters() {
  return (
    <section
      id="chapters"
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-paper via-cream to-honey px-6 py-24 sm:py-32"
    >
      <Halftone colorClass="text-marigold" opacity={0.5} variant="screenUp" coarse />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="mb-4 font-en text-xs font-semibold uppercase tracking-[0.34em] text-ink">
            The Collection · Four Chapters
          </p>
          <h2 className="text-3xl text-ink sm:text-4xl">사계절, 네 개의 챕터</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-stone">
            봄의 첫 향에서 겨울의 잔향까지 — 네 번의 무대가 마치 하나의 향수가 됩니다.
          </p>
          <div className="mx-auto mt-6 h-px w-14 bg-ink" />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.no} delay={i * 80} className="h-full">
              {/* 창립제 카드만 솔리드 앰버 — 포스터의 "검정 위 앰버" 대비를 그대로 */}
              <article
                className={`group relative flex h-full flex-col overflow-hidden border p-5 transition-all duration-300 hover:-translate-y-1 ${
                  c.current
                    ? 'border-ink bg-marigold shadow-[0_22px_50px_-26px_rgba(18,17,16,0.55)] sm:scale-[1.03]'
                    : 'border-ink/15 bg-paper/70 backdrop-blur-sm hover:border-ink/35 hover:bg-paper'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-en text-sm font-semibold uppercase tracking-[0.22em] ${
                      c.current ? 'text-ink' : 'text-stone'
                    }`}
                  >
                    {c.season}
                  </span>
                  {c.current ? (
                    <span className="inline-flex items-center gap-1.5 bg-ink px-2 py-0.5 text-xs font-semibold text-marigold">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-marigold/60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-marigold" />
                      </span>
                      지금 이 무대
                    </span>
                  ) : (
                    <span className="text-sm text-stone/70">{c.seasonKo}</span>
                  )}
                </div>

                {/* 숫자 · 제목/역할을 한 줄로 묶어 컴팩트하게 */}
                <div className="mt-2.5 flex items-center gap-3">
                  <span
                    className={`wordmark text-4xl ${c.current ? 'text-ink' : 'text-ink/25'}`}
                  >
                    {c.no}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-en text-lg font-semibold leading-tight tracking-wide text-ink">
                      {c.subtitle}
                    </h3>
                    <p className={`mt-0.5 text-sm ${c.current ? 'text-ink/70' : 'text-stone'}`}>
                      {c.roleKo}
                    </p>
                  </div>
                </div>

                <p
                  className={`mt-3 flex-1 text-[0.9rem] leading-relaxed ${
                    c.current ? 'text-ink/80' : 'text-graphite/85'
                  }`}
                >
                  {c.note}
                </p>

                {/* 키워드 */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.keywords.map((k) => (
                    <span
                      key={k}
                      className={`px-2 py-0.5 text-xs font-medium ${
                        c.current ? 'bg-ink text-marigold' : 'bg-ink/[0.07] text-graphite'
                      }`}
                    >
                      {k}
                    </span>
                  ))}
                </div>

                {/* 향 계열 */}
                <p
                  className={`mt-3 flex items-center gap-2 border-t pt-2.5 text-sm ${
                    c.current ? 'border-ink/25 text-ink/75' : 'border-ink/10 text-stone'
                  }`}
                >
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ background: c.current ? '#121110' : c.accent }}
                  />
                  {c.scent}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-10 text-center text-2xl font-semibold leading-snug text-ink sm:text-3xl">
            <span className="bg-ink px-2 py-0.5 text-marigold">Chapter 03,</span> 우리 40주년
            창립제에 초대합니다.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
