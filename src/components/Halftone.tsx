import type { CSSProperties } from 'react'

/**
 * 포스터의 시그니처 배경 — 하프톤 도트 스크린.
 *
 * 포스터(ref/poster_image.png)는 매리골드 앰버 도트가 아래쪽에서 빽빽하게 깔리고
 * 위로 갈수록 성글어지다 흰 여백으로 사라지는 "스크린 그라데이션"이 기본 결이다.
 * 그 위로 도트가 뭉친 유기적인 구름/찢긴 띠가 겹쳐 깊이를 만든다.
 *
 * variant
 *  - screenUp   : 아래가 빽빽 → 위로 사라짐 (포스터의 기본 결)
 *  - screenDown : 위가 빽빽 → 아래로 사라짐
 *  - bloom      : 중앙-우측/하단에 크게 피어나는 구름 (히어로)
 *  - side       : 오른쪽에서 밀려드는 사이드 블룸
 *  - sideLeft   : 왼쪽 버전
 *  - veil       : 어두운 섹션의 전면 은은한 스크린
 *  - corner     : 모서리에서 피어오르는 작은 블룸 (푸터)
 */
const MASKS: Record<string, string> = {
  screenUp:
    'linear-gradient(to top, #000 0%, #000 22%, rgba(0,0,0,0.62) 52%, rgba(0,0,0,0.22) 76%, transparent 96%)',
  screenDown:
    'linear-gradient(to bottom, #000 0%, #000 20%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 76%, transparent 96%)',
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
  colorClass = 'text-marigold',
  opacity = 0.6,
  variant = 'bloom',
  animate = true,
  coarse = false,
}: {
  className?: string
  colorClass?: string
  opacity?: number
  variant?: keyof typeof MASKS
  animate?: boolean
  /** 도트를 굵게 — 포스터 실물처럼 도트가 또렷하게 보이는 결 */
  coarse?: boolean
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
        className={`${coarse ? 'dots-lg' : 'dots'} absolute inset-0 ${colorClass} ${
          animate ? 'animate-[drift_30s_ease-in-out_infinite]' : ''
        }`}
        style={base}
      />
      {/* 큰 도트를 살짝 겹쳐 하프톤의 깊이감 */}
      <div
        className={`${coarse ? 'dots-xl' : 'dots-lg'} absolute inset-0 ${colorClass} ${
          animate ? 'animate-[drift_40s_ease-in-out_infinite_reverse]' : ''
        }`}
        style={{ ...base, opacity: opacity * 0.55 }}
      />
    </div>
  )
}

/**
 * 포스터의 찢긴 앰버 띠 — 도트 필드 사이로 솔리드 앰버가 가로로 번지는 결.
 * 도트 레이어 아래에 깔아 두면 포스터 특유의 "인쇄된" 밀도가 생긴다.
 */
export function PosterBands({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <span className="absolute -left-[10%] top-[42%] h-[11%] w-[120%] -rotate-1 bg-marigold/40 blur-xl" />
      <span className="absolute -right-[15%] top-[58%] h-[7%] w-[95%] rotate-[1.5deg] bg-marigold/28 blur-xl" />
      <span className="absolute -left-[8%] bottom-[10%] h-[14%] w-[115%] rotate-[0.6deg] bg-marigold/38 blur-2xl" />
    </div>
  )
}
