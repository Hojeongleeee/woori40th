import { useEffect, useState } from 'react'

/**
 * 스크롤 어디서든 신청 섹션(#apply)으로 이동하는 플로팅 버튼.
 * 히어로를 조금 지나면 부드럽게 등장하고,
 * 신청 섹션이 화면에 보이면 사라집니다.
 */
export default function FloatingApplyButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const applySection = document.getElementById('apply')

    const onScroll = () => {
      const scrolledEnough = window.scrollY > window.innerHeight * 0.6
      let applyInView = false
      if (applySection) {
        const rect = applySection.getBoundingClientRect()
        applyInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0
      }
      setVisible(scrolledEnough && !applyInView)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <a
      href="#apply"
      className={`fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-gold/40 bg-gradient-to-r from-gold to-golddeep px-5 py-3 text-sm font-semibold text-ink shadow-[0_10px_30px_-8px_rgba(201,146,47,0.55)] ring-1 ring-white/20 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_14px_36px_-8px_rgba(201,146,47,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream ${
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
      </span>
      참가 신청하기
    </a>
  )
}
