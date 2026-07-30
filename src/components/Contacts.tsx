import type { ReactNode } from 'react'
import { CONTACTS, CREDITS, EVENT } from '../config'
import { MessageIcon, PhoneIcon } from './Icons'

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
          <p className="mt-4 text-xs leading-relaxed text-cream/40 break-keep">{CREDITS.note}</p>
        </div>
      </details>
    </div>
  )
}

/** 기수 · 이름(· 직책) + 번호, 그리고 전화 / 문자 버튼. */
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

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="flex items-baseline gap-1.5 text-sm">
          <span className="shrink-0 text-cream/45">{cohort}</span>
          <span className="font-medium text-cream">{name}</span>
          {title && <span className="text-xs text-marigold/80">{title}</span>}
        </p>
        {/* select-all — 눌러서 한 번에 집히니 번호를 손으로 옮겨 적지 않아도 된다 */}
        <p className="mt-0.5 select-all text-xs tabular-nums tracking-wide text-cream/50">
          {phone}
        </p>
      </div>

      <div className="flex shrink-0 gap-1.5">
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
