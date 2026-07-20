import Reveal from './Reveal'
import { SparkleIcon } from './Icons'

/** 배경에 흩뿌릴 반짝임 좌표(고정값) — 반짝반짝한 와인 파티 무드 */
const SPARKLES = [
  { top: '12%', left: '8%', size: 6, delay: '0s' },
  { top: '20%', left: '82%', size: 4, delay: '0.6s' },
  { top: '35%', left: '18%', size: 5, delay: '1.2s' },
  { top: '28%', left: '55%', size: 3, delay: '0.3s' },
  { top: '52%', left: '88%', size: 5, delay: '0.9s' },
  { top: '65%', left: '12%', size: 4, delay: '1.5s' },
  { top: '72%', left: '68%', size: 6, delay: '0.2s' },
  { top: '80%', left: '38%', size: 3, delay: '1.1s' },
  { top: '45%', left: '40%', size: 4, delay: '1.8s' },
  { top: '15%', left: '38%', size: 3, delay: '0.8s' },
  { top: '60%', left: '48%', size: 3, delay: '1.4s' },
  { top: '85%', left: '82%', size: 4, delay: '0.5s' },
]

const REASONS = [
  {
    title: '40년에 단 한 번',
    desc: '창립 40주년은 다시 오지 않습니다. 오늘의 우리를 오래 기억할 하룻밤.',
  },
  {
    title: '반짝이는 와인 파티',
    desc: '환하고 예쁜 공간에서 와인 한 잔과 함께, 고급스럽지만 편안한 저녁.',
  },
  {
    title: '세 세대가 한자리에',
    desc: '오래된 선배부터 지금의 기수까지, 세 노트가 하나의 향으로 어우러집니다.',
  },
]

/**
 * 왜 와야 하는가 — 깊고 따뜻한 밤, 반짝이는 40주년 와인 파티.
 */
export default function WhyCome() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cocoa via-espresso to-cocoa px-6 py-24 text-center sm:py-32">
      {/* 반짝임 */}
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold shadow-[0_0_12px_2px_rgba(230,180,90,0.7)] animate-[shimmer_3.5s_ease-in-out_infinite]"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}
      <div className="aura absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 bg-gold/15" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-gold">
            <SparkleIcon className="h-4 w-4" /> Why you should come
          </p>
          <h2 className="font-serif text-3xl leading-snug text-cream sm:text-4xl md:text-5xl">
            반짝반짝 환하고 예쁜 공간에서 즐기는
            <span className="mt-2 block text-gold-gradient">40주년 와인 파티</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-cream/70 sm:text-base">
            잔이 부딪히는 소리, 은은한 향, 오랜만에 마주한 얼굴들. 무겁지 않게, 그러나
            오래 기억될 하룻밤을 준비했습니다.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {REASONS.map((r, i) => (
            <Reveal
              key={r.title}
              delay={i * 100}
              className="rounded-2xl border border-gold/20 bg-white/[0.04] p-6 text-left backdrop-blur-sm transition-colors hover:border-gold/40 hover:bg-white/[0.07]"
            >
              <span className="font-en text-3xl text-gold/70">0{i + 1}</span>
              <h3 className="mt-3 font-serif text-xl text-cream">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/65">{r.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
