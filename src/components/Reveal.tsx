import type { ElementType, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

interface RevealProps {
  children: ReactNode
  className?: string
  /** 지연 시간(ms) — 여러 요소를 순차 등장시킬 때 */
  delay?: number
  as?: ElementType
}

/**
 * 자식 요소를 감싸 스크롤 진입 시 페이드 인 + 상승시키는 래퍼.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
