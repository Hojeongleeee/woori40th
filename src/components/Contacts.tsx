import { CONTACTS, CREDITS, EVENT } from '../config'

/**
 * 푸터의 문의 연락처 + 함께 준비한 분들.
 *
 * 이름을 누르면 바로 전화가 걸린다 (tel:). 번호를 눈으로 옮겨 적을 일이 없도록
 * 번호는 화면에 늘어놓지 않고 링크 뒤에 둔다 — 대신 스크린리더와
 * 마우스 오버에는 번호가 보이게 aria-label·title 을 붙였다.
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
            <dd className="mt-1.5 flex flex-wrap gap-x-2 gap-y-2">
              {group.people.map((p) => (
                <PersonLink key={p.phone} {...p} />
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

/** 기수 · 이름(· 직책) 한 덩어리. 누르면 전화가 걸린다. */
function PersonLink({
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
  const label = `${cohort} ${name}${title ? ` ${title}` : ''} — ${phone}로 전화하기`

  return (
    <a
      href={`tel:${phone.replace(/-/g, '')}`}
      aria-label={label}
      title={phone}
      className="inline-flex items-baseline gap-1.5 border border-cream/15 px-2.5 py-1.5 text-sm transition-colors hover:border-marigold/60 hover:bg-marigold/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
    >
      <span className="text-cream/45">{cohort}</span>
      <span className="font-medium text-cream underline decoration-marigold/50 decoration-1 underline-offset-4">
        {name}
      </span>
      {title && <span className="text-xs text-marigold/80">{title}</span>}
    </a>
  )
}
