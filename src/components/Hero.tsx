import { EVENT, PROJECT } from '../config'
import { ArrowDownIcon, CalendarIcon, ClockIcon, MapPinIcon } from './Icons'
import Halftone from './Halftone'

/**
 * 히어로 — Woori 40th Homecoming Party - <Scent of Memory>.
 * 산뜻한 탑노트(아쿠아/민트)로 프로젝트 전체를 여는 첫 인상.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-mist via-aqua to-cream px-6 pt-24 pb-16 text-center"
    >
      {/* 하프톤 도트 블룸 (탑노트 골드) */}
      <Halftone colorClass="text-gold" opacity={0.5} variant="bloom" />

      {/* 음악 동호회 무드 — 흐릿한 높은음자리표 실루엣 (은은한 배경) */}
      <svg
        aria-hidden
        viewBox="0 0 200 480"
        className="pointer-events-none absolute right-[-2.5rem] top-1/2 z-0 h-[82%] w-auto -translate-y-1/2 rotate-[12deg] text-espresso/[0.07] blur-[2px] sm:right-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M82 434 C70 430 72 410 88 410 C96 410 100 416 100 424 C100 384 100 344 100 300 C100 240 100 160 100 110 C100 74 104 46 122 48 C142 50 148 78 134 100 C124 116 108 128 108 150 C108 180 150 214 150 250 C150 292 122 320 88 320 C50 320 22 290 22 250 C22 214 50 188 84 188 C112 188 132 210 132 240 C132 272 116 300 96 300" />
        <circle cx="70" cy="446" r="8" fill="currentColor" stroke="none" />
      </svg>

      <div className="relative z-10 flex flex-col items-center">
        {/* 킥커 */}
        <p className="mb-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.42em] text-latte">
          <span className="h-px w-7 bg-latte/40" />
          {PROJECT.project}
          <span className="h-px w-7 bg-latte/40" />
        </p>

        {/* 메인 타이틀 — Scent of Memory */}
        <h1 className="font-en text-ink">
          <span className="block text-[3.4rem] font-normal italic leading-[0.9] sm:text-7xl md:text-8xl">
            Scent
          </span>
          <span className="mt-1 block text-[2.1rem] font-light leading-none tracking-[0.06em] text-latte sm:text-4xl md:text-5xl">
            of&nbsp;<span className="text-gold-gradient italic">Memory</span>
          </span>
        </h1>

        {/* 슬로건 */}
        <p className="mt-9 font-en text-lg italic tracking-wide text-espresso sm:text-xl">
          {PROJECT.slogan}
        </p>
        <p className="mt-2 text-sm tracking-wide text-latte">{PROJECT.sloganKo}</p>

        {/* 프로젝트 한 줄 */}
        <p className="mt-8 max-w-md text-[0.95rem] font-light leading-relaxed text-espresso/90">
          {PROJECT.tagline}
          <br />
          우리 40주년 Homecoming에 당신을 초대합니다.
        </p>

        {/* 창립제(Homecoming) 핵심 정보 + 참가 신청 */}
        <div className="mt-9 w-full max-w-sm rounded-2xl border border-gold/30 bg-white/55 p-6 text-left shadow-[0_18px_40px_-24px_rgba(28,18,12,0.4)] backdrop-blur-sm">
          <p className="font-en text-xs uppercase tracking-[0.28em] text-golddeep">
            {EVENT.chapter} · {EVENT.title}
          </p>
          <dl className="mt-4 space-y-2.5">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-4 w-4 shrink-0 text-golddeep" />
              <dt className="sr-only">일시</dt>
              <dd className="text-sm font-medium text-espresso">{EVENT.dateLabel}</dd>
            </div>
            <div className="flex items-center gap-3">
              <ClockIcon className="h-4 w-4 shrink-0 text-golddeep" />
              <dt className="sr-only">시간</dt>
              <dd className="text-sm text-espresso">
                {EVENT.timeLabel}
                <span className="text-espresso/55"> ({EVENT.doorsLabel})</span>
              </dd>
            </div>
            <div className="flex items-center gap-3">
              <MapPinIcon className="h-4 w-4 shrink-0 text-golddeep" />
              <dt className="sr-only">장소</dt>
              <dd className="text-sm text-espresso">{EVENT.placeLabel}</dd>
            </div>
          </dl>
          <a
            href="#apply"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-golddeep py-3.5 text-base font-semibold text-ink shadow-[0_14px_30px_-12px_rgba(201,146,47,0.6)] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-espresso"
          >
            사전 신청하기
            <span className="rounded-full bg-ink/90 px-2 py-0.5 text-xs font-bold text-cream">필수</span>
          </a>
        </div>

        {/* 스크롤 유도 */}
        <a
          href="#about"
          className="group mt-10 flex flex-col items-center gap-2 text-latte transition-colors hover:text-golddeep"
          aria-label="아래로 스크롤"
        >
          <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDownIcon className="h-5 w-5 animate-[float_2.4s_ease-in-out_infinite]" />
        </a>
      </div>
    </section>
  )
}
