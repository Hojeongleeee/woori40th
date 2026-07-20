import ProgressBar from './components/ProgressBar'
import FloatingApplyButton from './components/FloatingApplyButton'
import Hero from './components/Hero'
import Invitation from './components/Invitation'
import ThreeNotes from './components/ThreeNotes'
import WhyCome from './components/WhyCome'
import Timeline from './components/Timeline'
import SpecialCorners from './components/SpecialCorners'
import Gallery from './components/Gallery'
import Apply from './components/Apply'
import EventSummary from './components/EventSummary'

/**
 * Woori 40th 창립제 초대장 (single-page)
 * 위 → 아래로 탑노트(아쿠아) → 미들노트(라떼) → 베이스노트(앰버/우디)로
 * 색감과 무드가 점점 깊고 따뜻해지도록 섹션을 배치했습니다.
 */
export default function App() {
  return (
    <>
      <ProgressBar />

      <main>
        <Hero />
        <Invitation />
        <ThreeNotes />
        <WhyCome />
        <Timeline />
        <SpecialCorners />
        <Gallery />
        <Apply />
      </main>

      <EventSummary />
      <FloatingApplyButton />
    </>
  )
}
