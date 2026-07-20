import { NOTES } from '../config'
import Reveal from './Reveal'

/** 노트별(탑/미들/베이스) 카드 스타일 — 위에서 아래로 점점 깊고 따뜻하게 */
const NOTE_STYLES = [
  {
    card: 'bg-white/70 border-mint/40 text-espresso',
    kicker: 'text-mintdeep',
    body: 'text-espresso/80',
    badge: 'from-mint to-mintdeep text-white',
    line: 'from-mint/60',
  },
  {
    card: 'bg-cream/70 border-sand/60 text-espresso',
    kicker: 'text-[#a6763e]',
    body: 'text-espresso/80',
    badge: 'from-sand to-latte text-white',
    line: 'from-sand/70',
  },
  {
    card: 'bg-ink/85 border-gold/30 text-cream backdrop-blur-sm',
    kicker: 'text-gold',
    body: 'text-cream/75',
    badge: 'from-gold to-golddeep text-ink',
    line: 'from-latte/50',
  },
] as const

/**
 * 세 개의 노트 — 컨셉의 핵심.
 * 배경이 크림(탑) → 샌드(미들) → 코코아(베이스)로 깊어지며
 * 스크롤 흐름 자체가 향의 변화가 되도록 구성.
 */
export default function ThreeNotes() {
  return (
    <section
      id="notes"
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-cream via-[#d7c09a] to-cocoa px-6 py-24 sm:py-32"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <Reveal className="text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-latte">
            The Three Notes
          </p>
          <h2 className="font-serif text-3xl text-espresso sm:text-4xl">세 개의 노트</h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-espresso/70">
            향수가 시간이 지나며 향이 변해가듯, 세 세대가 어우러져 하나의 향을 이룹니다.
            <br className="hidden sm:block" /> 스크롤을 내릴수록 향은 깊고 따뜻해집니다.
          </p>
          <div className="mx-auto mt-6 h-px w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </Reveal>

        <div className="mt-14">
          {NOTES.map((note, i) => {
            const s = NOTE_STYLES[i]
            const isLast = i === NOTES.length - 1
            return (
              <Reveal
                key={note.key}
                delay={i * 90}
                className="relative flex gap-4 pb-8 last:pb-0 sm:gap-7"
              >
                {/* 향이 흘러내리는 스파인 */}
                <div className="flex flex-col items-center pt-1">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${s.badge} font-en text-lg font-semibold shadow-lg`}
                  >
                    {i + 1}
                  </span>
                  {!isLast && (
                    <span
                      className={`mt-2 w-px flex-1 bg-gradient-to-b ${s.line} to-transparent`}
                    />
                  )}
                </div>

                {/* 카드 */}
                <div
                  className={`mb-1 flex-1 rounded-2xl border p-6 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.5)] sm:p-8 ${s.card}`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className={`font-en text-sm font-semibold uppercase tracking-[0.2em] ${s.kicker}`}>
                      {note.kicker}
                    </span>
                    <span className="text-xs opacity-60">· {note.kickerKo}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl">{note.title}</h3>
                  <p className={`mt-1 text-sm font-medium ${s.kicker}`}>{note.generation}</p>
                  <p className={`mt-4 text-[0.95rem] leading-relaxed ${s.body}`}>{note.body}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
