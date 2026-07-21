import { EVENT, PROJECT } from '../config'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * 마지막 — 행사 정보 요약 + 문의. 가장 깊은 베이스의 잔향.
 */
export default function EventSummary() {
  const rows = [
    { label: '일시', value: `${EVENT.dateLabel} ${EVENT.timeLabel}`, sub: EVENT.doorsLabel },
    { label: '장소', value: EVENT.placeLabel, sub: EVENT.placeNote },
    { label: '문의', value: EVENT.contactLabel, sub: EVENT.contactValue },
  ]

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-ink to-[#150c07] px-6 pb-14 pt-24 text-center">
      <Halftone colorClass="text-gold" opacity={0.14} variant="corner" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <Reveal>
          <p className="font-en text-sm uppercase tracking-[0.4em] text-latte">
            {EVENT.chapter} · See you there
          </p>
          <h2 className="mt-4 font-en text-5xl font-normal text-cream sm:text-6xl">
            Scent of <span className="text-gold-gradient italic">Memory</span>
          </h2>
          <p className="mt-4 font-en text-lg italic text-cream/80">“{PROJECT.slogan}”</p>
        </Reveal>

        <Reveal delay={120}>
          <dl className="mx-auto mt-12 max-w-md divide-y divide-cream/10 border-y border-cream/10 text-left">
            {rows.map((r) => (
              <div key={r.label} className="flex items-baseline gap-4 py-4">
                <dt className="w-16 shrink-0 text-sm font-medium tracking-wide text-gold">
                  {r.label}
                </dt>
                <dd className="text-cream/90">
                  <span className="block">{r.value}</span>
                  {r.sub && <span className="text-sm text-cream/50">{r.sub}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={200}>
          <a
            href="#apply"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gradient-to-r from-gold to-golddeep px-8 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            참가 신청하러 가기
          </a>
        </Reveal>

        <p className="mt-14 text-sm text-cream/35">
          © {PROJECT.club} {PROJECT.anniversary}th Homecoming Party · 《{PROJECT.collection}》
        </p>
      </div>
    </footer>
  )
}
