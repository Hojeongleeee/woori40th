import type { ReactNode } from 'react'
import { EVENT } from '../config'
import { ArrowDownIcon } from './Icons'

/**
 * 히어로 — 탑노트(산뜻한 아쿠아). 40th 창립제의 첫 인상.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-mist via-aqua to-[#dcebe8] px-6 pt-20 pb-16 text-center"
    >
      {/* 향이 퍼지는 듯한 은은한 광원 */}
      <div className="aura absolute -top-24 -left-16 h-72 w-72 animate-[float_9s_ease-in-out_infinite] bg-mint/25" />
      <div className="aura absolute top-1/3 -right-20 h-80 w-80 animate-[float_11s_ease-in-out_infinite] bg-gold/20" />
      <div className="aura absolute bottom-0 left-1/4 h-64 w-64 bg-cream/50" />

      <div className="relative z-10 flex flex-col items-center">
        {/* 킥커 */}
        <p className="mb-6 flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.35em] text-latte">
          <span className="h-px w-6 bg-latte/50" />
          Est. 1985 · 40th Anniversary
          <span className="h-px w-6 bg-latte/50" />
        </p>

        {/* 메인 타이틀 */}
        <h1 className="font-en text-6xl leading-[0.95] text-ink sm:text-7xl md:text-8xl">
          Woori
          <span className="block text-gold-gradient italic">40th</span>
        </h1>

        {/* 태그라인 */}
        <p className="mt-7 max-w-md font-serif text-lg leading-relaxed text-espresso/90 sm:text-xl">
          {EVENT.tagline}
        </p>
        <p className="mt-3 text-sm tracking-wide text-latte">
          {EVENT.clubName} {EVENT.title}에 당신을 초대합니다
        </p>

        {/* 핵심 정보 요약 */}
        <div className="mt-10 flex flex-col items-center gap-2 text-sm text-espresso sm:flex-row sm:gap-0">
          <InfoItem>{EVENT.dateLabel}</InfoItem>
          <Dot />
          <InfoItem>
            {EVENT.timeLabel}
            <span className="ml-1 text-xs text-latte">({EVENT.doorsLabel})</span>
          </InfoItem>
          <Dot />
          <InfoItem>
            {EVENT.placeLabel}
            <span className="ml-1 text-xs text-latte">{EVENT.placeNote}</span>
          </InfoItem>
        </div>

        {/* 스크롤 유도 */}
        <a
          href="#invitation"
          className="group mt-14 flex flex-col items-center gap-2 text-latte transition-colors hover:text-mintdeep"
          aria-label="아래로 스크롤"
        >
          <span className="text-[0.7rem] uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDownIcon className="h-5 w-5 animate-[float_2.4s_ease-in-out_infinite]" />
        </a>
      </div>
    </section>
  )
}

function InfoItem({ children }: { children: ReactNode }) {
  return <span className="px-3 py-0.5">{children}</span>
}

function Dot() {
  return <span className="hidden h-1 w-1 rounded-full bg-latte/50 sm:inline-block" />
}
