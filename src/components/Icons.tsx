import type { ReactElement, SVGProps } from 'react'

/* 특별 코너 / 장식용 얇은 라인 아이콘 모음 (stroke 기반, currentColor) */

type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps) => ({
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h1.7l1-1.6A1 1 0 0 1 10 5h4a1 1 0 0 1 .85.4l1 1.6h1.65A1.5 1.5 0 0 1 19 8.5v8A1.5 1.5 0 0 1 17.5 18h-11A1.5 1.5 0 0 1 5 16.5" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  )
}

export function BottleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 3h4v2.2M10 3v2.2M10 5.2h4M10.5 5.2c0 1.6-2 2-2 4.3v8A1.5 1.5 0 0 0 10 19h4a1.5 1.5 0 0 0 1.5-1.5v-8c0-2.3-2-2.7-2-4.3" />
      <path d="M8.5 12.5h7" />
    </svg>
  )
}

export function PlateIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3.4" />
    </svg>
  )
}

export function WineIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7.5 4h9l-.6 4.2A4.5 4.5 0 0 1 12 12a4.5 4.5 0 0 1-3.9-3.8L7.5 4Z" />
      <path d="M12 12v6M9 20h6" />
    </svg>
  )
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5c.4 3.7 1.8 5.1 5.5 5.5-3.7.4-5.1 1.8-5.5 5.5-.4-3.7-1.8-5.1-5.5-5.5 3.7-.4 5.1-1.8 5.5-5.5Z" />
    </svg>
  )
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M4 9.5h16M8 3.5v4M16 3.5v4" />
    </svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21c4.5-4.2 6.5-7.3 6.5-10.3A6.5 6.5 0 0 0 5.5 10.7C5.5 13.7 7.5 16.8 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </svg>
  )
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4.5v1A3.5 3.5 0 0 0 8 10.5M17 6h2.5v1a3.5 3.5 0 0 1-3.5 3.5" />
      <path d="M12 14v3M9 20h6l-.5-3h-5L9 20Z" />
    </svg>
  )
}

export function GiftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="9.5" width="16" height="10.5" rx="1.5" />
      <path d="M3.5 9.5h17M12 9.5V20" />
      <path d="M12 9.5C11 6.5 9.5 5.5 8 5.5a2 2 0 0 0 0 4M12 9.5c1-3 2.5-4 4-4a2 2 0 0 1 0 4" />
    </svg>
  )
}

export function MemoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4.5" y="4" width="15" height="16" rx="2" />
      <path d="M8 8.5h8M8 12h8M8 15.5h5" />
    </svg>
  )
}

export function ImagesIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="8" y="4" width="11.5" height="11.5" rx="1.8" />
      <circle cx="11.6" cy="8" r="1.1" />
      <path d="M8 13l3-2.6 4.2 3.4" />
      <path d="M4.5 8.5v9A2 2 0 0 0 6.5 19.5h9" />
    </svg>
  )
}

export function DiceIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4.5" y="4.5" width="15" height="15" rx="3" />
      <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** config 의 icon 키 → 컴포넌트 매핑 */
export const CORNER_ICONS: Record<string, (p: IconProps) => ReactElement> = {
  camera: CameraIcon,
  bottle: BottleIcon,
  plate: PlateIcon,
  wine: WineIcon,
  memo: MemoIcon,
  images: ImagesIcon,
  dice: DiceIcon,
}
