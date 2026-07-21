import ProgressBar from './components/ProgressBar'
import FloatingApplyButton from './components/FloatingApplyButton'
import Hero from './components/Hero'
import ProjectIntro from './components/ProjectIntro'
import Chapters from './components/Chapters'
import Venue from './components/Venue'
import Homecoming from './components/Homecoming'
import Timeline from './components/Timeline'
import SpecialCorners from './components/SpecialCorners'
import Goods from './components/Goods'
import LuckyDraw from './components/LuckyDraw'
import Gallery from './components/Gallery'
import Apply from './components/Apply'
import EventSummary from './components/EventSummary'

/**
 * Woori 40th Homecoming Party - <Scent of Memory> (single-page)
 *
 * Part 1 — 프로젝트: 사계절 4개 챕터로 이어지는 하나의 향수 컬렉션.
 *   Hero → 기획 의도 → 네 개의 챕터
 * Part 2 — 창립제(Chapter 03 · Autumn · Homecoming):
 *   행사 소개 → 프로그램 → 즐길거리 → 비밀 굿즈 → 갤러리 → 참가 신청 → 푸터
 *
 * 배경은 낮의 청량함(라이트) → 블루아워/밤(딥블루)으로 하늘빛이 짙어지고,
 * 포스터의 하프톤 도트 블룸이 전 섹션을 하나로 잇는다.
 */
export default function App() {
  return (
    <>
      <ProgressBar />

      <main>
        {/* Part 1 — The Project */}
        <Hero />
        <ProjectIntro />

        {/* 중심 이벤트(창립제)를 먼저 소개한 뒤, 사계절 컬렉션 전체로 확장 */}
        <Homecoming />
        <Venue />
        <Chapters />

        {/* Part 2 — The Homecoming details (Chapter 03) */}
        <Timeline />
        <SpecialCorners />
        <Goods />
        <LuckyDraw />
        <Gallery />
        <Apply />
      </main>

      <EventSummary />
      <FloatingApplyButton />
    </>
  )
}
