import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CONTACTS, CREDITS, EVENT } from '../config'
import { CheckIcon, CopyIcon, MessageIcon, PhoneIcon } from './Icons'

/**
 * 푸터의 문의 연락처 + 함께 준비한 분들.
 *
 * 번호를 화면에 그대로 보여 주고, 거는 행동은 사용자가 고르게 둔다.
 * 이름 전체를 tel: 로 감싸 두면 명단을 훑다가 손가락이 스쳐도 통화 확인창이
 * 뜬다 — 밤늦게 열어 본 사람에게는 사고에 가깝다. 그래서 이름은 그냥 글자로
 * 두고, '전화'와 '문자' 버튼을 따로 뒀다.
 */
export default function Contacts() {
  return (
    <div className="mx-auto mt-12 max-w-md text-left">
      <p className="text-sm font-medium tracking-wide text-marigold">문의</p>
      <p className="mt-1.5 text-cream/90">{EVENT.contactLabel}</p>

      <dl className="mt-4 divide-y divide-cream/10 border-y border-cream/10">
        {CONTACTS.map((group) => (
          <div key={group.role} className="py-3.5">
            <dt className="text-xs font-medium tracking-wide text-cream/45">{group.role}</dt>
            <dd className="mt-2 space-y-2">
              {group.people.map((p) => (
                <PersonRow key={p.phone} {...p} />
              ))}
            </dd>
          </div>
        ))}
      </dl>

      {/* 함께 준비한 분들 — 눌러서 펼치는 크레딧 */}
      <details className="group mt-5 border border-cream/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-cream/85 [&::-webkit-details-marker]:hidden">
          {CREDITS.summary}
          <svg
            aria-hidden
            className="h-4 w-4 shrink-0 text-cream/50 transition-transform duration-300 group-open:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </summary>

        <div className="border-t border-cream/10 px-4 pb-4 pt-3.5">
          <ul className="space-y-2">
            {CREDITS.people.map((g) => (
              <li key={g.cohort} className="flex gap-3 text-sm">
                <span className="w-11 shrink-0 tabular-nums text-cream/45">{g.cohort}</span>
                <span className="text-cream/80">{g.names.join(' · ')}</span>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  )
}

/** 기수 · 이름(· 직책) + 복사 / 전화 / 문자 버튼. */
function PersonRow({
  cohort,
  name,
  title,
  phone,
}: {
  cohort: string
  name: string
  title?: string
  phone: string
}) {
  /* tel:·sms: 는 하이픈이 있어도 대부분 처리하지만, 구형 안드로이드 다이얼러가
     하이픈을 번호의 일부로 읽는 경우가 있어 숫자만 넘긴다. */
  const digits = phone.replace(/-/g, '')
  const who = `${cohort} ${name}${title ? ` ${title}` : ''}`

  const [revealed, setRevealed] = useState(false)

  /* 버튼 세 개가 한 줄에 다 안 들어가면 아래로 내려가게 flex-wrap 을 뒀다.
     이름칸을 눌러 "40기 정지윤 / 부회장" 처럼 쪼개는 것보다 낫다. */
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <div className="min-w-0">
        <p className="flex items-baseline gap-1.5 text-sm">
          <span className="shrink-0 text-cream/45">{cohort}</span>
          <span className="font-medium text-cream">{name}</span>
          {title && <span className="text-xs text-marigold/80">{title}</span>}
        </p>
        {/* 클립보드가 막힌 환경(비 HTTPS·구형 브라우저)에서만 번호를 드러낸다.
           번호를 숨긴 채 복사도 실패하면 연락할 방법이 아예 없어진다. */}
        {revealed && (
          <p className="mt-0.5 select-all text-xs tabular-nums tracking-wide text-cream/55">
            {phone}
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-1.5">
        <CopyButton phone={phone} who={who} onFail={() => setRevealed(true)} />
        <ActionButton href={`tel:${digits}`} label={`${who}에게 전화 걸기`} text="전화">
          <PhoneIcon className="h-3.5 w-3.5" strokeWidth={1.6} />
        </ActionButton>
        <ActionButton href={`sms:${digits}`} label={`${who}에게 문자 보내기`} text="문자">
          <MessageIcon className="h-3.5 w-3.5" strokeWidth={1.6} />
        </ActionButton>
      </div>
    </div>
  )
}

/**
 * 번호 복사 — 아이콘만. 옆의 '전화·문자' 와 나란히 서므로 글자까지 넣으면
 * 좁은 화면에서 버튼 줄이 통째로 아래로 밀린다. 대신 눌렀을 때만 '복사됐어요'
 * 로 넓어져 결과를 알린다. (FeeNotice 의 CopyRow 와 같은 동작)
 *
 * 아이콘만 있는 버튼이라 이름이 aria-label 에서 나온다. 눌린 결과도 라벨을
 * 바꿔서 알린다 — 라벨을 고정해 두면 aria-live 가 읽어 줄 변화가 없다.
 */
function CopyButton({ phone, who, onFail }: { phone: string; who: string; onFail: () => void }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(phone)
    } catch {
      onFail() // 복사가 막히면 번호를 화면에 띄워 직접 가져가게 한다
      return
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${who} 전화번호가 복사됐어요` : `${who} 전화번호 복사하기`}
      aria-live="polite"
      className="inline-flex min-h-[38px] items-center gap-1.5 border border-cream/15 px-2.5 text-xs text-cream/80 transition-colors hover:border-marigold/60 hover:bg-marigold/10 hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
    >
      {copied ? (
        <>
          <CheckIcon className="h-3.5 w-3.5 text-marigold" />
          <span className="text-marigold">복사됐어요</span>
        </>
      ) : (
        <CopyIcon className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

/** 전화 / 문자 — 손가락으로 누를 수 있게 최소 44px 높이를 지킨다. */
function ActionButton({
  href,
  label,
  text,
  children,
}: {
  href: string
  label: string
  text: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex min-h-[38px] items-center gap-1.5 border border-cream/15 px-2.5 text-xs text-cream/80 transition-colors hover:border-marigold/60 hover:bg-marigold/10 hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
    >
      {children}
      {text}
    </a>
  )
}
