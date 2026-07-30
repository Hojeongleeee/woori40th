import { useEffect, useRef, useState } from 'react'
import { VENUE } from '../config'
import { CameraIcon } from './Icons'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * Venue — 창립제가 열릴 장소를 네 구역으로 소개.
 * 구역마다 사진이 여러 장이면 그 자리에서 천천히 넘어갑니다(크로스페이드).
 * 사진은 config VENUE.photos[].images 에서 가져옵니다.
 */
export default function Venue() {
  return (
    <section
      id="venue"
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-paper via-cream to-paper px-6 py-24 sm:py-32"
    >
      <Halftone colorClass="text-marigold" opacity={0.45} variant="sideLeft" coarse />

      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="mb-4 font-en text-xs font-semibold uppercase tracking-[0.34em] text-ink">
            {VENUE.kicker}
          </p>
          <h2 className="text-3xl text-ink sm:text-4xl">{VENUE.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone">{VENUE.lead}</p>
          <div className="mx-auto mt-6 h-px w-14 bg-ink" />
        </Reveal>

        <div className="mt-14 grid gap-x-5 gap-y-10 sm:grid-cols-2">
          {VENUE.photos.map((photo, i) => (
            <Reveal key={photo.title} delay={(i % 2) * 90}>
              <figure>
                <Slideshow images={photo.images} label={photo.title} index={i} />
                <figcaption className="mt-3.5">
                  <p className="flex items-start gap-2 font-medium text-ink">
                    <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-marigold" />
                    {photo.title}
                  </p>
                  <p className="mt-1.5 pl-3.5 text-sm leading-relaxed text-graphite/85 break-keep">
                    {photo.caption}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- 구역별 사진 롤링 ---------- */

/** 기본 전환 간격. 구역마다 조금씩 어긋나게 해 네 칸이 동시에 넘어가지 않도록 한다. */
const ROTATE_MS = 4200

function Slideshow({
  images,
  label,
  index,
}: {
  images: readonly string[]
  label: string
  index: number
}) {
  const [active, setActive] = useState(0)
  /** 점을 눌러 직접 넘겼을 때 타이머를 처음부터 다시 돌리기 위한 값 */
  const [restart, setRestart] = useState(0)
  const reduced = usePrefersReducedMotion()

  const [boxRef, inView] = useSeenOnce<HTMLDivElement>()

  // 화면 밖에서는 회전도, 다음 장 받기도 하지 않는다 — 스크롤해 내려오기 전에
  // 타이머가 먼저 돌아버리면 안 보이는 사진까지 미리 받게 된다.
  const rolling = images.length > 1 && !reduced && inView
  const rotateMs = ROTATE_MS + index * 400

  /**
   * 지금 DOM 에 올려 둔 사진들. 처음에는 첫 장만 올린다.
   *
   * 한 구역의 사진을 전부 겹쳐 두면 opacity-0 이라도 브라우저는 "화면 안"으로 보고
   * loading="lazy" 를 무시한 채 전부 받아버린다 (네 구역 합쳐 11장 2.5MB).
   * 그래서 넘어갈 차례가 가까워졌을 때 다음 장을 붙인다.
   */
  const [mounted, setMounted] = useState<number[]>([0])

  useEffect(() => {
    if (!rolling) return
    const id = setInterval(() => setActive((cur) => (cur + 1) % images.length), rotateMs)
    return () => clearInterval(id)
  }, [rolling, images.length, rotateMs, restart])

  useEffect(() => {
    const add = (i: number) => setMounted((m) => (m.includes(i) ? m : [...m, i]))

    // 점을 눌러 건너뛴 장은 즉시 올려야 화면이 비지 않는다
    add(active)
    if (!rolling) return

    // 다음 장은 넘어가기 한 박자 전에 미리 — 크로스페이드가 빈 화면에서 시작하지 않게
    const next = (active + 1) % images.length
    const id = setTimeout(() => add(next), Math.max(0, rotateMs - 1200))
    return () => clearTimeout(id)
  }, [active, rolling, images.length, rotateMs])

  if (images.length === 0) return <Placeholder />

  return (
    <div
      ref={boxRef}
      className="relative aspect-[4/3] overflow-hidden border border-ink/20 bg-cream/70 shadow-[0_18px_44px_-30px_rgba(18,17,16,0.5)]"
    >
      {images.map((src, i) =>
        mounted.includes(i) ? (
          <img
            key={src}
            src={src}
            alt={i === active ? label : ''}
            aria-hidden={i !== active}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null,
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2.5 right-2.5 flex gap-1.5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => {
                setActive(i)
                setRestart((n) => n + 1)
              }}
              aria-label={`${label} 사진 ${i + 1}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${
                i === active ? 'w-5 bg-paper' : 'w-1.5 bg-paper/50 hover:bg-paper/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Placeholder() {
  return (
    <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-2 overflow-hidden border border-ink/20 bg-cream/70 text-center shadow-[0_18px_44px_-30px_rgba(18,17,16,0.5)]">
      <span className="dots-lg absolute inset-0 text-marigold/55" aria-hidden />
      <span className="relative grid h-11 w-11 place-items-center rounded-full border border-ink/35 text-ink/65">
        <CameraIcon className="h-6 w-6" />
      </span>
      <span className="relative text-xs font-medium text-graphite">장소 사진 준비 중</span>
    </div>
  )
}

/**
 * 요소가 화면에 한 번이라도 들어왔는지. 한 번 들어오면 계속 true.
 * (useReveal 과 달리 클래스가 아니라 값이 필요해서 따로 둔다)
 */
function useSeenOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return

    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }

    // 살짝 앞당겨 관찰해 스크롤이 닿는 순간에는 첫 장이 이미 준비돼 있게 한다
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setSeen(true)
      },
      { rootMargin: '250px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])

  return [ref, seen] as const
}

/** 모션 최소화를 켠 사용자에게는 자동 전환 대신 첫 장만 보여준다. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
