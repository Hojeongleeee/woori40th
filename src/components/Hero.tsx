import { EVENT, NAVER_MAP_URL, PROJECT } from '../config'
import { ArrowDownIcon, CalendarIcon, ClockIcon, MapPinIcon } from './Icons'
import Halftone, { PosterBands } from './Halftone'

/**
 * 히어로 — 포스터(ref/poster_image.png)를 그대로 옮긴 첫 화면.
 * 위쪽 흰 여백에서 아래로 갈수록 매리골드 도트가 빽빽해지고,
 * 타이틀은 포스터처럼 디도네 이탤릭 이니셜 + 굵은 산세리프의 조합.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-gradient-to-b from-paper via-cream to-marigold px-6 pt-24 pb-12"
    >
      {/* 포스터의 찢긴 앰버 띠 → 그 위로 하프톤 도트 스크린 */}
      <PosterBands />
      <Halftone colorClass="text-marigold" opacity={0.9} variant="screenUp" coarse />
      <Halftone colorClass="text-white" opacity={0.3} variant="bloom" />

      {/* 음악 동호회 무드 — 흐릿한 높은음자리표 실루엣 (은은한 배경) */}
      <svg
        aria-hidden
        viewBox="0 0 200 480"
        className="pointer-events-none absolute right-[-2.5rem] top-1/2 z-0 h-[70%] w-auto -translate-y-1/2 rotate-[12deg] text-ink/[0.045] blur-[1px] sm:right-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M82 434 C70 430 72 410 88 410 C96 410 100 416 100 424 C100 384 100 344 100 300 C100 240 100 160 100 110 C100 74 104 46 122 48 C142 50 148 78 134 100 C124 116 108 128 108 150 C108 180 150 214 150 250 C150 292 122 320 88 320 C50 320 22 290 22 250 C22 214 50 188 84 188 C112 188 132 210 132 240 C132 272 116 300 96 300" />
        <circle cx="70" cy="446" r="8" fill="currentColor" stroke="none" />
      </svg>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col">
        {/* 포스터 좌상단 — WOORI 40th / Homecoming Party */}
        <p className="font-en text-sm font-semibold leading-relaxed text-ink sm:text-base">
          WOORI {PROJECT.anniversary}th
          <span className="mt-1 block pl-6 sm:pl-10">Homecoming Party</span>
          <span className="mt-1.5 block pl-6 text-xs font-medium text-ink/70 sm:pl-10 sm:text-sm">
            우리동아리 {PROJECT.anniversary}주년 창립제
          </span>
        </p>

        {/* 포스터 타이틀 — 디도네 이탤릭 이니셜 + 굵은 산세리프 */}
        <h1 className="mt-10 text-right text-ink sm:mt-14">
          <span className="block text-[3.4rem] leading-[0.86] sm:text-7xl md:text-[6.5rem]">
            <span className="font-script text-[1.3em] leading-[0]">S</span>
            <span className="wordmark -ml-[0.04em]">cent</span>
            <span className="wordmark"> of</span>
          </span>
          <span className="mt-3 block text-[3.4rem] leading-[0.86] sm:text-7xl md:text-[6.5rem]">
            <span className="font-script text-[1.3em] leading-[0]">M</span>
            <span className="wordmark -ml-[0.04em]">emory</span>
          </span>
        </h1>

        {/* 포스터 좌측(챕터·슬로건·날짜) + 창립제 정보 카드 */}
        <div className="mt-10 grid gap-8 sm:mt-12 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
          <div>
            <p className="font-en text-sm font-medium tracking-wide text-ink sm:text-base">
              {EVENT.chapter.replace(' · ', ' ')}
            </p>
            <p className="mt-5 max-w-md font-script text-xl text-ink/85 sm:text-2xl">
              “{PROJECT.slogan}”
            </p>
            <p className="mt-1.5 max-w-md text-sm text-ink/70">{PROJECT.sloganKo}</p>
            {/* 포스터 중앙 — 날짜 */}
            <p className="mt-8 font-en text-xl font-medium tracking-wide text-ink sm:text-2xl">
              2026.08.22 Sat
            </p>
          </div>

          {/* 창립제 핵심 정보 + 참가 신청 */}
          {/* 장소명 옆에 "지도보기" 가 한 줄로 들어가도록 카드 폭을 조금 넉넉히 */}
          <div className="w-full max-w-sm border border-ink/20 bg-paper/85 p-6 text-left backdrop-blur-sm md:w-[21.5rem]">
            <p className="font-en text-xs font-semibold uppercase tracking-[0.26em] text-ink">
              {EVENT.title}
            </p>
            <dl className="mt-4 space-y-2.5">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-4 w-4 shrink-0 text-amber" />
                <dt className="sr-only">일시</dt>
                <dd className="text-sm font-medium text-ink">{EVENT.dateLabel}</dd>
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="h-4 w-4 shrink-0 text-amber" />
                <dt className="sr-only">시간</dt>
                <dd className="text-sm text-graphite">
                  {EVENT.timeLabel}
                  <span className="text-stone"> ({EVENT.doorsLabel})</span>
                </dd>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                <dt className="sr-only">장소</dt>
                <dd className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-graphite">
                  <a
                    href={NAVER_MAP_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {EVENT.placeLabel}
                  </a>
                  <a
                    href={NAVER_MAP_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex shrink-0 items-center gap-1 border border-ink/30 px-2 py-0.5 text-xs font-semibold text-ink transition-colors hover:bg-ink hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <MapPinIcon className="h-3 w-3" />
                    지도보기
                  </a>
                </dd>
              </div>
            </dl>
            <a
              href="#apply"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-base font-semibold text-cream transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              사전 신청하기
              <span className="rounded-full bg-marigold px-2 py-0.5 text-xs font-bold text-ink">
                필수
              </span>
            </a>
          </div>
        </div>

        {/* 포스터 하단 — HOMECOMING 워드마크 */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-8 gap-y-4 pt-12">
          <p className="wordmark text-[2.6rem] text-ink sm:text-6xl md:text-7xl">HOMECOMING</p>
          <a
            href="#about"
            className="group inline-flex items-center gap-2 pb-1 text-ink/70 transition-colors hover:text-ink"
            aria-label="아래로 스크롤"
          >
            <span className="font-en text-xs uppercase tracking-[0.3em]">Scroll</span>
            <ArrowDownIcon className="h-4 w-4 animate-[float_2.4s_ease-in-out_infinite]" />
          </a>
        </div>
      </div>
    </section>
  )
}
