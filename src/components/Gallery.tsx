import { useCallback, useEffect, useState } from 'react'
import { GALLERY_IMAGES, GALLERY_PLACEHOLDER_COUNT } from '../config'
import { CloseIcon } from './Icons'
import Reveal from './Reveal'

/**
 * 추억 사진 갤러리 — 그리드 + 라이트박스.
 * config.ts 의 GALLERY_IMAGES 배열에 이미지를 넣으면 자동으로 채워지고,
 * 비어 있으면 "추억을 기다리는 중" placeholder 를 보여줍니다.
 */
export default function Gallery() {
  const hasImages = GALLERY_IMAGES.length > 0
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const show = useCallback(
    (dir: number) =>
      setOpenIndex((cur) => {
        if (cur === null) return cur
        const next = (cur + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
        return next
      }),
    [],
  )

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
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-cocoa via-ink to-ink px-6 py-24 sm:py-32"
    >
      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-latte">
            Memories · Base Note
          </p>
          <h2 className="font-serif text-3xl text-cream sm:text-4xl">40년의 잔향</h2>
          <p className="mt-4 text-sm text-cream/60">
            오래 남아 있는 향처럼, 우리가 함께 쌓아온 순간들
          </p>
          <div className="mx-auto mt-6 h-px w-14 bg-gradient-to-r from-transparent via-latte to-transparent" />
        </Reveal>

        {hasImages ? (
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <Reveal key={img.src} delay={(i % 3) * 70}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-cream/10 bg-cocoa"
                >
                  <img
                    src={img.src}
                    alt={img.caption ?? `Woori 추억 사진 ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {img.caption && (
                    <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/90 to-transparent px-3 pb-2 pt-8 text-left text-xs text-cream/90 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {img.caption}
                    </span>
                  )}
                </button>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {Array.from({ length: GALLERY_PLACEHOLDER_COUNT }).map((_, i) => (
              <Reveal key={i} delay={(i % 4) * 60}>
                <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-cream/15 bg-white/[0.03] text-center">
                  <span className="text-2xl opacity-40">🕯️</span>
                  <span className="px-2 text-[0.7rem] leading-tight text-cream/40">
                    추억을 기다리는 중
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {!hasImages && (
          <p className="mt-8 text-center text-xs text-cream/40">
            사진은 준비되는 대로 이 자리에 하나씩 채워집니다.
          </p>
        )}
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

          <figure
            className="max-h-[85vh] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={GALLERY_IMAGES[openIndex].src}
              alt={GALLERY_IMAGES[openIndex].caption ?? '추억 사진'}
              className="max-h-[78vh] w-auto rounded-lg object-contain shadow-2xl"
            />
            {GALLERY_IMAGES[openIndex].caption && (
              <figcaption className="mt-3 text-center text-sm text-cream/80">
                {GALLERY_IMAGES[openIndex].caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
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
