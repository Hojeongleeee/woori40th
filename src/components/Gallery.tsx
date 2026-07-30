import { useCallback, useEffect, useRef, useState } from 'react'
import { GALLERY_IMAGES } from '../config'
import { CloseIcon } from './Icons'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * 추억 사진 갤러리 — 3×3 페이지를 좌우로 넘겨 보는 캐러셀 + 라이트박스.
 *
 * 사진이 계속 늘어날 예정이라 세로로 길어지지 않도록 9장씩 끊어 가로로 넘긴다.
 * 넘기는 건 브라우저의 가로 스크롤 + scroll-snap 에 맡겨서 (transform 이 아니라)
 * 모바일에서 손가락 스와이프가 그대로 동작하고, 화살표는 그 스크롤을 움직인다.
 * 사진은 config.ts 의 GALLERY_IMAGES 배열에서 가져옵니다.
 */

/** 한 페이지에 보여줄 사진 수 (3×3) */
const PAGE_SIZE = 9

/**
 * 그리드 한 칸의 실제 표시 너비.
 * 섹션이 px-6(좌우 24px) 안의 max-w-5xl(1024px)이고 3열 gap 은 12px(sm 부터 16px).
 * 브라우저가 이 값 × 화면 배율에 맞는 썸네일을 골라 받는다.
 */
const SIZES =
  '(min-width: 1120px) 331px, (min-width: 640px) calc((100vw - 80px) / 3), calc((100vw - 72px) / 3)'

/**
 * '/gallery/01.jpg' → '/gallery/thumb/01-330.webp'
 * tools/thumbs.mjs 가 굽는 파일명 규칙. 너비를 바꾸려면 그쪽 WIDTHS 도 함께 고칠 것.
 */
function thumb(src: string, width: number) {
  return src.replace(/\/([^/]+)\.jpe?g$/i, `/thumb/$1-${width}.webp`)
}

/**
 * 원본을 미리 받아 둔다. 브라우저 캐시에 올려두는 게 목적이라 결과는 버린다.
 * 이미 받은 사진이면 캐시에서 끝나므로 여러 번 불러도 괜찮다.
 */
function preload(src: string) {
  const img = new Image()
  img.src = src
}

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  /** 라이트박스에 띄운 원본이 도착했는지 */
  const [full, setFull] = useState(false)

  const pages: (typeof GALLERY_IMAGES)[] = []
  for (let i = 0; i < GALLERY_IMAGES.length; i += PAGE_SIZE) {
    pages.push(GALLERY_IMAGES.slice(i, i + PAGE_SIZE))
  }

  /** 라이트박스에서 보던 사진의 위치를 닫을 때 참고하기 위한 거울 */
  const openRef = useRef<number | null>(null)
  useEffect(() => {
    openRef.current = openIndex
  }, [openIndex])

  /**
   * 라이트박스 닫기.
   * 다른 묶음의 사진까지 넘겨봤다면 그 묶음을 펼쳐 둔 채로 닫는다 —
   * 23번 사진을 보다 닫았는데 1번 묶음이 떠 있으면 위치를 잃어버린다.
   */
  const close = useCallback(() => {
    const cur = openRef.current
    const el = trackRef.current
    if (cur !== null && el && el.clientWidth > 0) {
      const target = Math.floor(cur / PAGE_SIZE)
      if (Math.round(el.scrollLeft / el.clientWidth) !== target) {
        el.scrollTo({ left: target * el.clientWidth, behavior: 'auto' })
      }
    }
    setOpenIndex(null)
  }, [])

  const show = useCallback(
    (dir: number) =>
      setOpenIndex((cur) => {
        if (cur === null) return cur
        return (cur + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
      }),
    [],
  )

  /**
   * 라이트박스가 열리면 앞뒤 사진의 원본을 미리 받아 ← → 가 곧바로 반응하게 한다.
   * 지금 보고 있는 사진이 먼저 도착해야 하므로 한 박자(400ms) 늦게 시작한다.
   */
  // 다른 사진으로 넘어가면 다시 기다리는 상태로
  useEffect(() => {
    setFull(false)
  }, [openIndex])

  useEffect(() => {
    if (openIndex === null || GALLERY_IMAGES.length < 2) return
    const n = GALLERY_IMAGES.length
    const id = setTimeout(() => {
      for (const d of [1, -1]) preload(GALLERY_IMAGES[(openIndex + d + n) % n].src)
    }, 400)
    return () => clearTimeout(id)
  }, [openIndex])

  const goTo = useCallback((p: number, smooth = true) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: p * el.clientWidth, behavior: smooth ? 'smooth' : 'auto' })
  }, [])

  // 스와이프/스크롤로 넘어간 페이지를 점 표시에 반영
  const syncPage = useCallback(() => {
    const el = trackRef.current
    if (!el || el.clientWidth === 0) return
    setPage(Math.round(el.scrollLeft / el.clientWidth))
  }, [])

  // 창 크기가 바뀌면 px 기준 위치가 어긋나므로 현재 페이지로 다시 맞춘다
  useEffect(() => {
    const onResize = () => goTo(page, false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [page, goTo])

  // 키보드 조작 (Esc 닫기, ← → 이동)
  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') show(1)
      else if (e.key === 'ArrowLeft') show(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openIndex, close, show])

  return (
    <section
      id="gallery"
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-honey via-cream to-paper px-6 py-24 sm:py-32"
    >
      <Halftone colorClass="text-marigold" opacity={0.4} variant="screenDown" coarse />

      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="mb-4 font-en text-xs font-semibold uppercase tracking-[0.34em] text-ink">
            Memories · Base Note
          </p>
          <h2 className="text-3xl text-ink sm:text-4xl">40년의 잔향</h2>
          <p className="mt-4 text-sm text-graphite">
            오래 남아 있는 향처럼, 우리가 함께 쌓아온 순간들
          </p>
          <div className="mx-auto mt-6 h-px w-14 bg-ink" />
        </Reveal>

        <Reveal delay={80}>
          {/* 가로로 넘기는 3×3 페이지 */}
          <div
            ref={trackRef}
            onScroll={syncPage}
            className="no-scrollbar mt-14 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
            role="group"
            aria-label="추억 사진 모음 — 좌우로 넘겨 보세요"
          >
            {pages.map((group, p) => (
              <div
                key={p}
                className="grid w-full shrink-0 snap-start grid-cols-3 gap-3 sm:gap-4"
                aria-label={`${p + 1}번째 묶음`}
              >
                {group.map((img, j) => {
                  const i = p * PAGE_SIZE + j
                  return (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() => setOpenIndex(i)}
                      // 누르기 전에 원본을 받기 시작해 라이트박스가 덜 기다리게 한다.
                      // (마우스는 hover, 터치는 손을 떼기 전, 키보드는 포커스 시점)
                      onPointerEnter={() => preload(img.src)}
                      onPointerDown={() => preload(img.src)}
                      onFocus={() => preload(img.src)}
                      className="group relative block aspect-square w-full overflow-hidden border border-ink/15 bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      {/*
                        WebP 썸네일을 받고, WebP 를 못 읽는 구형 브라우저만 원본 jpg 로 내려간다.
                        (source 의 type 을 지원하지 않으면 브라우저가 img 로 넘어간다)
                      */}
                      <picture>
                        <source
                          type="image/webp"
                          srcSet={`${thumb(img.src, 330)} 330w, ${thumb(img.src, 660)} 660w`}
                          sizes={SIZES}
                        />
                        <img
                          src={img.src}
                          alt={img.caption ?? `Woori 추억 사진 ${i + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </picture>
                      {img.caption && (
                        <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/90 to-transparent px-3 pb-2 pt-8 text-left text-sm text-cream/90 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          {img.caption}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* 페이지 이동 — 화살표 + 점 */}
          {pages.length > 1 && (
            <div className="mt-7 flex items-center justify-center gap-5">
              <PageArrow
                dir="prev"
                disabled={page === 0}
                onClick={() => goTo(page - 1)}
              />

              <div className="flex items-center gap-2">
                {pages.map((_, p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goTo(p)}
                    aria-label={`${p + 1}번째 묶음 보기`}
                    aria-current={p === page}
                    className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${
                      p === page ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25 hover:bg-ink/50'
                    }`}
                  />
                ))}
              </div>

              <PageArrow
                dir="next"
                disabled={page === pages.length - 1}
                onClick={() => goTo(page + 1)}
              />
            </div>
          )}
        </Reveal>
      </div>

      {/* 라이트박스 */}
      {openIndex !== null && GALLERY_IMAGES[openIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="사진 크게 보기"
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-cream/20 bg-white/5 text-cream transition-colors hover:bg-white/15"
            aria-label="닫기"
          >
            <CloseIcon className="h-6 w-6" />
          </button>

          {GALLERY_IMAGES.length > 1 && (
            <>
              <NavButton side="left" onClick={() => show(-1)} />
              <NavButton side="right" onClick={() => show(1)} />
            </>
          )}

          {/* 원본이 아직 안 왔을 때 — 빈 화면 대신 (미리 받아 둔 사진이면 뜨지 않는다) */}
          {!full && (
            <span className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-cream/25 border-t-cream/80" />
            </span>
          )}

          <figure className="max-h-[85vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img
              key={GALLERY_IMAGES[openIndex].src}
              src={GALLERY_IMAGES[openIndex].src}
              alt={GALLERY_IMAGES[openIndex].caption ?? '추억 사진'}
              onLoad={() => setFull(true)}
              // 캐시에 이미 있으면 onLoad 가 안 붙을 수 있어 complete 로 한 번 더 본다
              ref={(el) => {
                if (el?.complete) setFull(true)
              }}
              className={`max-h-[78vh] w-auto rounded-none object-contain shadow-2xl transition-opacity duration-300 ${
                full ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <figcaption className="mt-3 text-center text-sm text-cream/80">
              {GALLERY_IMAGES[openIndex].caption ?? (
                <span className="text-cream/45">
                  {openIndex + 1} / {GALLERY_IMAGES.length}
                </span>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}

/** 페이지 넘김 화살표 (갤러리 아래 컨트롤 줄) */
function PageArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? '이전 사진 묶음' : '다음 사진 묶음'}
      className="grid h-10 w-10 place-items-center rounded-full border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-25"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dir === 'prev' ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  )
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-cream/20 bg-white/5 text-cream transition-colors hover:bg-white/15 ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
      aria-label={side === 'left' ? '이전 사진' : '다음 사진'}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {side === 'left' ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  )
}
