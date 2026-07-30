import { EVENT, NAVER_MAP_URL } from '../config'
import { MapPinIcon } from './Icons'
import FeeNotice from './FeeNotice'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * Chapter 03 · Autumn — Homecoming(창립제) 소개.
 * 프로젝트에서 이 사이트가 초대하는 중심 이벤트로 전환하는 지점.
 * 가을·우디 톤의 깊은 잔향 위에서.
 */
export default function Homecoming() {
  /* subs 는 한 줄씩 따로 렌더한다. 시각·주소를 한 문자열로 이어 붙이면
     좁은 화면에서 "…입장 시" / "작)" 처럼 엉뚱한 데서 끊긴다. */
  const info = [
    { label: '일시', value: EVENT.dateLabel, subs: [EVENT.timeLabel, `(${EVENT.doorsLabel})`] },
    { label: '장소', value: EVENT.placeLabel, subs: [EVENT.placeNote, EVENT.placeAccess], map: true },
    { label: '대상', value: '선배 · 활동 기수 누구나', subs: ['동아리와의 추억 하나면 충분해요'] },
  ]

  return (
    <section
      id="homecoming"
      className="anchor-offset relative overflow-hidden bg-ink px-6 py-24 sm:py-32"
    >
      {/* 이 섹션은 위아래로 글이 꽉 차서, 도트를 진하게 깔면 본문을 갉아먹는다.
          농도를 낮추고 가장자리로 밀어 둔 뒤(sideLeft), 글이 앉는 가운데는
          잉크 스크림으로 한 번 더 눌러 읽기를 방해하지 않게 한다. */}
      <Halftone colorClass="text-marigold" opacity={0.2} variant="sideLeft" coarse />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(78%_62%_at_50%_50%,var(--color-ink)_0%,rgba(18,17,16,0.88)_46%,transparent_82%)]"
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        <Reveal className="text-center">
          <p className="mb-4 font-en text-xs font-semibold uppercase tracking-[0.34em] text-marigold">
            {EVENT.chapter}
          </p>
          <h2 className="wordmark text-4xl text-cream sm:text-6xl">
            {EVENT.title}
          </h2>
          <p className="mt-3 text-lg text-cream/85">{EVENT.titleKo}</p>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-relaxed text-cream/80">
            {EVENT.tagline}. 사계절 컬렉션의 하트 노트가 가장 짙게 피어나는, 40주년의 중심 무대입니다.
          </p>
          <div className="mx-auto mt-6 h-px w-14 bg-marigold" />
        </Reveal>

        {/* 행사 정보 */}
        <Reveal delay={100}>
          <dl className="mt-12 grid gap-4 sm:grid-cols-3">
            {info.map((r) => (
              <div
                key={r.label}
                className="rounded-none border border-cream/15 bg-ink/75 p-5 text-center backdrop-blur-sm"
              >
                <dt className="text-xs font-medium uppercase tracking-[0.2em] text-marigold">
                  {r.label}
                </dt>
                <dd className="mt-2 font-medium text-cream">{r.value}</dd>
                {r.map && (
                  <dd className="mt-2">
                    <a
                      href={NAVER_MAP_URL}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 border border-marigold/50 px-2.5 py-1 text-xs font-semibold text-marigold transition-colors hover:bg-marigold hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
                    >
                      <MapPinIcon className="h-3.5 w-3.5" />
                      지도보기
                    </a>
                  </dd>
                )}
                {r.subs.map((s) => (
                  <dd key={s} className="mt-1.5 text-sm text-cream/65">
                    {s}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        </Reveal>

        {/* 회비 · 입금 계좌 */}
        <Reveal delay={100} className="mt-6">
          <FeeNotice variant="full" />
        </Reveal>

        {/* 좌석 한정 안내 + 참가 신청 (상단 배치) */}
        <Reveal delay={100} className="mt-10 text-center">
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-cream/75 break-keep">
            <span className="font-semibold text-marigold">
              장소 여건상 좌석이 {EVENT.seats}석으로 한정
            </span>
            되어 있어요. 자리가 마감되기 전에 서둘러 신청해 주세요.
          </p>
          <a
            href="#apply"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-marigold px-8 py-3.5 text-sm font-semibold text-ink shadow-[0_14px_32px_-12px_rgba(238,180,55,0.5)] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            사전 신청하기
            <span className="rounded-full bg-ink/90 px-2 py-0.5 text-xs font-bold text-cream">필수</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
