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
    <footer className="relative overflow-hidden bg-ink px-6 pb-14 pt-24 text-center">
      <Halftone colorClass="text-marigold" opacity={0.26} variant="corner" coarse />

      <div className="relative z-10 mx-auto max-w-2xl">
        <Reveal>
          <p className="font-en text-xs font-semibold uppercase tracking-[0.4em] text-marigold">
            {EVENT.chapter} · See you there
          </p>
          {/* 포스터 타이틀 락업 — 디도네 이니셜 + 굵은 산세리프 */}
          <h2 className="mt-5 text-cream">
            <span className="block text-5xl leading-[0.9] sm:text-6xl">
              <span className="font-script text-[1.3em] leading-[0]">S</span>
              <span className="wordmark -ml-[0.04em]">cent</span>
              <span className="wordmark"> of</span>
            </span>
            <span className="mt-2 block text-5xl leading-[0.9] text-marigold sm:text-6xl">
              <span className="font-script text-[1.3em] leading-[0]">M</span>
              <span className="wordmark -ml-[0.04em]">emory</span>
            </span>
          </h2>
          <p className="mt-6 font-script text-xl text-cream/80 sm:text-2xl">“{PROJECT.slogan}”</p>
        </Reveal>

        <Reveal delay={120}>
          <dl className="mx-auto mt-12 max-w-md divide-y divide-cream/10 border-y border-cream/10 text-left">
            {rows.map((r) => (
              <div key={r.label} className="flex items-baseline gap-4 py-4">
                <dt className="w-16 shrink-0 text-sm font-medium tracking-wide text-marigold">
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
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-marigold px-8 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
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
