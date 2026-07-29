import { useEffect, useRef, useState } from 'react'
import { FEE } from '../config'
import { CheckIcon, CopyIcon, WalletIcon } from './Icons'

/**
 * 회비 · 입금 계좌 안내.
 * 창립제 소개(full)와 참가 신청 폼(compact) 두 곳에서 같은 문구를 쓰기 위해
 * 한 컴포넌트로 두고 밀도만 variant 로 조절한다. 두 섹션 모두 bg-ink 위라
 * 공연 도움 모집 박스와 같은 앰버 톤을 그대로 따른다.
 */
export default function FeeNotice({
  variant = 'full',
  className = '',
}: {
  variant?: 'full' | 'compact'
  className?: string
}) {
  const compact = variant === 'compact'

  // 배경 하프톤 도트가 비쳐 글을 갉아먹지 않도록 카드 바탕은 불투명하게 둔다
  return (
    <div
      className={`border border-marigold/30 bg-soot/90 p-5 sm:p-6 backdrop-blur-sm ${className}`}
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-marigold">
        <WalletIcon className="h-4 w-4 shrink-0" />
        {FEE.title}
      </p>

      {/* 기수별 회비 */}
      <dl className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {FEE.tiers.map((t) => (
          <div
            key={t.label}
            className="border border-cream/15 bg-ink/70 px-2 py-3 text-center"
          >
            <dt className="text-xs text-cream/60">{t.label}</dt>
            <dd className="mt-1 font-semibold text-cream">{t.amount}</dd>
          </div>
        ))}
      </dl>

      {/* 안내 문구 — 신청 폼에서는 첫 줄만 (계좌 바로 위라 길면 흐름이 끊긴다) */}
      <ul className="mt-4 space-y-2">
        {(compact ? FEE.notes.slice(0, 1) : FEE.notes).map((note) => (
          <li
            key={note}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-cream/75"
          >
            <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-marigold" />
            <span className="break-keep">{note}</span>
          </li>
        ))}
      </ul>

      <AccountBox />

      {compact && (
        <p className="mt-3 text-sm leading-relaxed text-cream/60 break-keep">
          입금하실 때는 기수를 함께 적어 주세요. (예: 회비4기서성일)
        </p>
      )}
    </div>
  )
}

/** 계좌번호 + 복사 버튼 — 모바일에서 번호를 직접 드래그하지 않도록. */
function AccountBox() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(FEE.account.number)
    } catch {
      return // 클립보드 권한이 없으면 조용히 넘어간다 (번호는 화면에 그대로 보인다)
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-marigold/40 bg-marigold/10 p-3.5">
      <div className="min-w-0">
        <p className="text-xs text-cream/60">입금 계좌</p>
        <p className="mt-0.5 break-all font-medium text-cream">
          {FEE.account.bank} {FEE.account.number}
          <span className="text-cream/70"> ({FEE.account.holder})</span>
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1.5 border border-marigold/60 px-3 py-1.5 text-xs font-semibold text-marigold transition-colors hover:bg-marigold hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
        aria-live="polite"
      >
        {copied ? (
          <>
            <CheckIcon className="h-3.5 w-3.5" />
            복사됐어요
          </>
        ) : (
          <>
            <CopyIcon className="h-3.5 w-3.5" />
            계좌번호 복사
          </>
        )}
      </button>
    </div>
  )
}
