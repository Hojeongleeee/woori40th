import type { CSSProperties } from 'react'

/**
 * 포스터의 시그니처 배경 — 하프톤 도트 블룸.
 * 여러 개의 라디얼 마스크를 겹쳐(union) 구름/꽃송이처럼 뭉친 유기적 실루엣을 만들고,
 * 가장자리로 갈수록 도트가 옅어지며 흰 여백으로 사라진다.
 *
 * variant
 *  - bloom     : 포스터처럼 중앙-우측/하단에 크게 피어나는 메인 블룸 (히어로)
 *  - side      : 오른쪽에서 은은하게 밀려드는 사이드 블룸 (라이트 섹션)
 *  - sideLeft  : 왼쪽 버전
 *  - veil      : 어두운 섹션의 전면 은은한 별밤
 *  - corner    : 모서리에서 피어오르는 작은 블룸 (푸터)
 */
const MASKS: Record<string, string> = {
  bloom: [
    'radial-gradient(43% 47% at 65% 47%, #000 0%, #000 40%, transparent 78%)',
    'radial-gradient(33% 37% at 81% 63%, #000 0%, #000 38%, transparent 80%)',
    'radial-gradient(37% 43% at 49% 69%, #000 0%, #000 36%, transparent 82%)',
    'radial-gradient(28% 32% at 39% 43%, #000 0%, transparent 80%)',
    'radial-gradient(26% 30% at 73% 29%, #000 0%, transparent 82%)',
  ].join(','),
  side: [
    'radial-gradient(52% 64% at 94% 42%, #000 0%, #000 30%, transparent 78%)',
    'radial-gradient(38% 46% at 78% 66%, #000 0%, transparent 80%)',
    'radial-gradient(24% 30% at 88% 12%, #000 0%, transparent 82%)',
  ].join(','),
  sideLeft: [
    'radial-gradient(52% 64% at 6% 44%, #000 0%, #000 30%, transparent 78%)',
    'radial-gradient(38% 46% at 22% 68%, #000 0%, transparent 80%)',
    'radial-gradient(24% 30% at 12% 88%, #000 0%, transparent 82%)',
  ].join(','),
  veil: 'radial-gradient(140% 120% at 50% 38%, #000 0%, rgba(0,0,0,0.5) 55%, transparent 88%)',
  corner: [
    'radial-gradient(64% 64% at 13% 82%, #000 0%, #000 26%, transparent 70%)',
    'radial-gradient(44% 44% at 32% 66%, #000 0%, transparent 74%)',
  ].join(','),
}

export default function Halftone({
  className = '',
  colorClass = 'text-gold',
  opacity = 0.6,
  variant = 'bloom',
  animate = true,
}: {
  className?: string
  colorClass?: string
  opacity?: number
  variant?: keyof typeof MASKS
  animate?: boolean
}) {
  const mask = MASKS[variant] ?? MASKS.bloom

  const base: CSSProperties = {
    opacity,
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  }

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* 촘촘한 도트 */}
      <div
        className={`dots absolute inset-0 ${colorClass} ${
          animate ? 'animate-[drift_30s_ease-in-out_infinite]' : ''
        }`}
        style={base}
      />
      {/* 큰 도트를 살짝 겹쳐 하프톤의 깊이감 */}
      <div
        className={`dots-lg absolute inset-0 ${colorClass} ${
          animate ? 'animate-[drift_40s_ease-in-out_infinite_reverse]' : ''
        }`}
        style={{ ...base, opacity: opacity * 0.55 }}
      />
    </div>
  )
}
