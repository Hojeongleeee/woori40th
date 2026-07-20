import { useEffect, useRef } from 'react'

/**
 * 스크롤로 요소가 화면에 들어오면 `is-visible` 클래스를 붙여
 * 부드러운 페이드 인 + 상승 애니메이션을 트리거합니다.
 * (실제 전환 스타일은 index.css 의 `.reveal` 유틸에 정의)
 *
 * 한 번 보이면 계속 보이도록(관찰 해제) 처리합니다.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number
  rootMargin?: string
}) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // IntersectionObserver 미지원 또는 모션 최소화 → 즉시 표시
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? '0px 0px -8% 0px',
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options?.threshold, options?.rootMargin])

  return ref
}
