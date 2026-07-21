import { VENUE } from '../config'
import { CameraIcon } from './Icons'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * Venue — 창립제가 열릴 장소 소개.
 * 4:3 비율의 소개 사진(3~4장)과 사진별 한 줄 캡션.
 * 사진은 config VENUE.photos[].image 에 경로를 넣으면 표시되고, 비우면 플레이스홀더.
 */
export default function Venue() {
  return (
    <section
      id="venue"
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-mist via-aqua to-mist px-6 py-24 sm:py-32"
    >
      <Halftone colorClass="text-gold" opacity={0.3} variant="sideLeft" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.34em] text-latte">
            {VENUE.kicker}
          </p>
          <h2 className="text-3xl text-espresso sm:text-4xl">{VENUE.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-latte">{VENUE.lead}</p>
          <div className="mx-auto mt-6 h-px w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </Reveal>

        <div className="mt-14 grid gap-x-5 gap-y-8 sm:grid-cols-2">
          {VENUE.photos.map((photo, i) => (
            <Reveal key={i} delay={(i % 2) * 90}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-latte/20 bg-white/45 shadow-[0_18px_44px_-30px_rgba(28,18,12,0.5)]">
                  {photo.image ? (
                    <img
                      src={photo.image}
                      alt={photo.caption || `창립제 장소 사진 ${i + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                      <span className="dots absolute inset-0 text-gold/15" aria-hidden />
                      <span className="relative grid h-11 w-11 place-items-center rounded-full border border-latte/25 text-latte/60">
                        <CameraIcon className="h-6 w-6" />
                      </span>
                      <span className="relative text-xs text-latte/60">장소 사진 준비 중</span>
                    </div>
                  )}
                </div>
                <figcaption className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-espresso/85">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {photo.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
