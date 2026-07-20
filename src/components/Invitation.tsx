import { EVENT } from '../config'
import Reveal from './Reveal'

/**
 * 초대의 말 — 탑에서 미들로 넘어가는 온화한 전환(아쿠아 → 크림).
 */
export default function Invitation() {
  return (
    <section
      id="invitation"
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-[#dcebe8] via-[#eef0e4] to-cream px-6 py-24 sm:py-32"
    >
      <div className="aura absolute -right-16 top-10 h-64 w-64 bg-mint/15" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-latte">
            Invitation
          </p>
          <h2 className="font-serif text-3xl text-espresso sm:text-4xl">전하고 싶은 말</h2>
          <div className="mx-auto mt-6 h-px w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 space-y-6 font-serif text-lg leading-loose text-espresso/90 sm:text-xl">
            <p>
              1기부터 이어져 온 우리 동아리가
              <br className="hidden sm:block" /> 어느덧 <span className="text-gold-gradient font-semibold">40주년</span>을
              맞았습니다.
            </p>
            <p>
              동아리에서 보낸 시간이 행복한 추억으로 남은 선배들과, 지금도 그 추억을
              만들어가고 있는 현재 기수들이 함께 모였습니다. 지나온, 그리고 앞으로 채워갈
              인생의 한 페이지를 함께 나누고자 이 자리를 마련했습니다.
            </p>
            <p className="text-espresso">
              동아리와의 작은 추억 하나라도 꺼낼 수 있는 분이라면,
              <br className="hidden sm:block" /> 누구나 진심으로 환영합니다.
            </p>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-12 font-serif text-sm italic tracking-wide text-latte">
            — {EVENT.contactLabel} 드림
          </p>
        </Reveal>
      </div>
    </section>
  )
}
