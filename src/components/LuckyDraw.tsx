import { LUCKY_DRAW } from '../config'
import { GiftIcon, SparkleIcon, TrophyIcon } from './Icons'
import Reveal from './Reveal'
import Halftone from './Halftone'

/**
 * 럭키 드로우 — 창립제 당일 경품 추첨.
 * 1~3등(각 1명) 경품과 선착순 선물 안내. 골드 톤으로 '행운·푸짐함'을 강조.
 * 경품 이미지는 config LUCKY_DRAW.prizes[].image 에 경로를 넣으면 표시됩니다.
 */
export default function LuckyDraw() {
  return (
    <section
      id="lucky-draw"
      className="anchor-offset relative overflow-hidden bg-marigold px-6 py-16 sm:py-20"
    >
      {/* 포스터의 앰버 필드를 정면으로 — 검정 도트가 위로 흩어진다 */}
      <Halftone colorClass="text-ink" opacity={0.12} variant="screenUp" coarse />
      <div className="aura absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 bg-white/25" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="mb-4 flex items-center justify-center gap-2 font-en text-xs font-semibold uppercase tracking-[0.34em] text-ink">
            <SparkleIcon className="h-4 w-4" />
            {LUCKY_DRAW.kicker}
          </p>
          <h2 className="text-3xl text-ink sm:text-4xl">{LUCKY_DRAW.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/75">
            {LUCKY_DRAW.lead}
          </p>
          <div className="mx-auto mt-6 h-px w-14 bg-ink" />
        </Reveal>

        {/* 1~3등 경품 — 1등을 검정 카드로 강조 */}
        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-3 sm:gap-5">
          {LUCKY_DRAW.prizes.map((p, i) => {
            const isFirst = i === 0
            return (
              <Reveal
                key={p.label}
                delay={i * 100}
                className={`group flex flex-col overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                  isFirst
                    ? 'border-ink bg-ink shadow-[0_22px_50px_-26px_rgba(18,17,16,0.6)]'
                    : 'border-ink/25 bg-paper/70 backdrop-blur-sm hover:border-ink/50 hover:bg-paper'
                }`}
              >
                {/* 경품 이미지 (비어 있으면 플레이스홀더) */}
                <div className={`relative aspect-[4/3] overflow-hidden ${isFirst ? 'bg-white/[0.04]' : 'bg-ink/[0.03]'}`}>
                  <span
                    className={`dots-lg absolute inset-0 ${isFirst ? 'text-marigold/20' : 'text-marigold/40'}`}
                    aria-hidden
                  />
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={`${p.label} 경품`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1.5 text-center sm:gap-2">
                      <TrophyIcon className={`relative h-7 w-7 sm:h-9 sm:w-9 ${isFirst ? 'text-marigold' : 'text-ink/40'}`} />
                      <span className={`relative hidden text-xs sm:block ${isFirst ? 'text-cream/50' : 'text-stone'}`}>
                        경품 이미지 준비 중
                      </span>
                    </div>
                  )}
                  <span
                    className={`absolute left-2 top-2 px-2 py-0.5 font-en text-xs font-bold sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-sm ${
                      isFirst ? 'bg-marigold text-ink' : 'bg-ink text-marigold'
                    }`}
                  >
                    {p.rank}
                  </span>
                </div>

                <div className="flex flex-1 flex-col items-center p-3 text-center sm:p-5">
                  <span className={`text-base font-bold sm:text-lg ${isFirst ? 'text-marigold' : 'text-ink'}`}>
                    {p.label}
                  </span>
                  <span className={`mt-0.5 text-xs font-medium tracking-wider ${isFirst ? 'text-cream/60' : 'text-stone'}`}>
                    {p.winners}
                  </span>
                  <p className={`mt-1 text-xs sm:mt-2 sm:text-sm ${isFirst ? 'text-cream/85' : 'text-graphite'}`}>
                    {p.name}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* 선착순 선물 */}
        <Reveal delay={140} className="mx-auto mt-8 max-w-2xl">
          <div className="flex flex-col items-center gap-4 border border-ink/30 bg-paper/60 p-6 text-center backdrop-blur-sm sm:flex-row sm:justify-center sm:text-left">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-marigold">
              <GiftIcon className="h-6 w-6" />
            </span>
            <p className="text-sm leading-relaxed text-graphite">
              <span className="font-semibold text-ink">선착순 {LUCKY_DRAW.doorPrizeCount}명</span>에게는{' '}
              {LUCKY_DRAW.doorPrize}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
