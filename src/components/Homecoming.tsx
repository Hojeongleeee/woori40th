import { EVENT } from '../config'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * Chapter 03 · Autumn — Homecoming(창립제) 소개.
 * 프로젝트에서 이 사이트가 초대하는 중심 이벤트로 전환하는 지점.
 * 가을·우디 톤의 깊은 잔향 위에서.
 */
export default function Homecoming() {
  const info = [
    { label: '일시', value: EVENT.dateLabel, sub: `${EVENT.timeLabel} (${EVENT.doorsLabel})` },
    { label: '장소', value: EVENT.placeLabel, sub: EVENT.placeNote },
    { label: '대상', value: '선배 · 활동 기수 누구나', sub: '동아리와의 추억 하나면 충분해요' },
  ]

  return (
    <section
      id="homecoming"
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-cocoa via-espresso to-cocoa px-6 py-24 sm:py-32"
    >
      <Halftone colorClass="text-gold" opacity={0.2} variant="side" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <Reveal className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.34em] text-gold">
            {EVENT.chapter}
          </p>
          <h2 className="font-en text-4xl font-semibold tracking-wide text-cream sm:text-5xl">
            {EVENT.title}
          </h2>
          <p className="mt-3 text-lg text-cream/85">{EVENT.titleKo}</p>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-relaxed text-cream/65">
            {EVENT.tagline}. 사계절 컬렉션의 하트 노트가 가장 짙게 피어나는, 40주년의 중심 무대입니다.
          </p>
          <div className="mx-auto mt-6 h-px w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </Reveal>

        {/* 행사 정보 */}
        <Reveal delay={100}>
          <dl className="mt-12 grid gap-4 sm:grid-cols-3">
            {info.map((r) => (
              <div
                key={r.label}
                className="rounded-2xl border border-cream/10 bg-white/[0.05] p-5 text-center backdrop-blur-sm"
              >
                <dt className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                  {r.label}
                </dt>
                <dd className="mt-2 font-medium text-cream">{r.value}</dd>
                <dd className="mt-1 text-sm text-cream/50">{r.sub}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* 좌석 한정 안내 + 참가 신청 (상단 배치) */}
        <Reveal delay={100} className="mt-10 text-center">
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-cream/75 break-keep">
            <span className="font-semibold text-gold">장소 여건상 좌석이 한정</span>되어 있어,
            사전 신청하신 분에 한해 입장하실 수 있어요. 자리가 마감되기 전에 먼저 신청해 주세요.
          </p>
          <a
            href="#apply"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-golddeep px-8 py-3.5 text-sm font-semibold text-ink shadow-[0_14px_32px_-12px_rgba(201,146,47,0.5)] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            사전 신청하기
            <span className="rounded-full bg-ink/90 px-2 py-0.5 text-xs font-bold text-cream">필수</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
