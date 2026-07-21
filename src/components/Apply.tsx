import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { COHORT_OPTIONS, FILLED_PERCENT, LUCKY_DRAW } from '../config'
import type { ApplyForm } from '../types'
import { submitApplication } from '../lib/submit'
import {
  formatPhone,
  isValidCohort,
  isValidName,
  isValidPhone,
} from '../lib/validation'
import Reveal from './Reveal'
import { SparkleIcon } from './Icons'
import Halftone from './Halftone'

const pct = Math.max(0, Math.min(100, FILLED_PERCENT))

type FieldErrors = Partial<Record<keyof ApplyForm, string>>
type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; simulated?: boolean }
  | { kind: 'error'; message: string }

const EMPTY: ApplyForm = { name: '', phone: '', cohort: '', agree: false }

export default function Apply() {
  const [form, setForm] = useState<ApplyForm>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const useSelect = COHORT_OPTIONS.length > 0

  function update<K extends keyof ApplyForm>(key: K, value: ApplyForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
    if (status.kind === 'error') setStatus({ kind: 'idle' })
  }

  function validate(): boolean {
    const next: FieldErrors = {}
    if (!isValidName(form.name)) next.name = '이름을 입력해 주세요.'
    if (!form.phone.trim()) next.phone = '핸드폰 번호를 입력해 주세요.'
    else if (!isValidPhone(form.phone)) next.phone = '올바른 휴대폰 번호 형식이 아니에요.'
    if (!isValidCohort(form.cohort)) next.cohort = '기수를 입력해 주세요.'
    if (!form.agree) next.agree = '개인정보 제공에 동의해 주세요.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (status.kind === 'submitting') return
    if (!validate()) return

    setStatus({ kind: 'submitting' })
    const result = await submitApplication(form)

    if (result.ok) {
      setStatus({ kind: 'success', simulated: result.simulated })
      return
    }

    if (result.reason === 'duplicate') {
      setErrors((prev) => ({ ...prev, phone: result.message ?? '이미 신청된 번호예요.' }))
      setStatus({ kind: 'idle' })
      return
    }

    setStatus({
      kind: 'error',
      message: result.message ?? '제출 중 문제가 발생했어요. 다시 시도해 주세요.',
    })
  }

  const submitting = status.kind === 'submitting'

  return (
    <section
      id="apply"
      className="anchor-offset relative overflow-hidden bg-gradient-to-b from-ink to-[#150c07] px-6 py-24 sm:py-28"
    >
      <Halftone colorClass="text-gold" opacity={0.14} variant="sideLeft" />

      <div className="relative z-10 mx-auto max-w-xl">
        <Reveal className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.34em] text-gold">
            RSVP · Chapter 03 Homecoming
          </p>
          <h2 className="text-3xl text-cream sm:text-4xl">창립제 참가 신청</h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">
            좌석이 한정되어 있어 <span className="text-gold">선착순 사전 신청</span>을 받습니다.
            <br />
            자리가 채워지는 대로 마감되니 서둘러 주세요.
          </p>
        </Reveal>

        {/* 마감 현황 바 (항상 보이도록 상단바에도 있지만, 여기서 크게 한 번 더) */}
        <Reveal delay={100} className="mt-8">
          <div className="rounded-2xl border border-cream/10 bg-white/[0.04] p-5">
            <div className="flex items-end justify-between">
              <span className="text-sm text-cream/70">신청 마감 현황</span>
              <span className="font-en text-2xl font-semibold text-gold">{pct}%</span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold via-gold to-golddeep transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-gold/90">
              <SparkleIcon className="h-3.5 w-3.5" />
              선착순 {LUCKY_DRAW.doorPrizeCount}명에게는 <b className="font-semibold">웰컴 선물</b>을 드려요.
            </p>
          </div>
        </Reveal>

        {/* 폼 / 완료 화면 */}
        <Reveal delay={160} className="mt-8">
          {status.kind === 'success' ? (
            <SuccessCard name={form.name} simulated={status.simulated} />
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5 rounded-2xl border border-cream/10 bg-white/[0.03] p-6 sm:p-8"
            >
              <Field label="이름" htmlFor="name" required error={errors.name}>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="홍길동"
                  className={inputCls(!!errors.name)}
                  maxLength={40}
                />
              </Field>

              <Field label="핸드폰 번호" htmlFor="phone" required error={errors.phone}>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', formatPhone(e.target.value))}
                  placeholder="010-1234-5678"
                  className={inputCls(!!errors.phone)}
                  maxLength={13}
                />
              </Field>

              <Field label="기수" htmlFor="cohort" required error={errors.cohort}>
                {useSelect ? (
                  <select
                    id="cohort"
                    value={form.cohort}
                    onChange={(e) => update('cohort', e.target.value)}
                    className={inputCls(!!errors.cohort)}
                  >
                    <option value="" disabled>
                      기수를 선택해 주세요
                    </option>
                    {COHORT_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="cohort"
                    type="text"
                    value={form.cohort}
                    onChange={(e) => update('cohort', e.target.value)}
                    placeholder="예: 23기 (또는 OB, 게스트 등)"
                    className={inputCls(!!errors.cohort)}
                    maxLength={30}
                  />
                )}
              </Field>

              {/* 동의 */}
              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-cream/80">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => update('agree', e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-gold"
                  />
                  <span>
                    <b className="font-medium text-cream">개인정보 제공에 동의합니다.</b>{' '}
                    <span className="text-cream/55">
                      (이름·연락처는 창립제 신청 및 안내 목적으로만 사용되며, 행사 종료 후
                      파기됩니다.)
                    </span>
                  </span>
                </label>
                {errors.agree && <p className="mt-1.5 pl-8 text-sm text-red-300">{errors.agree}</p>}
              </div>

              {/* 전송 오류 안내 */}
              {status.kind === 'error' && (
                <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !form.agree}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-gold to-golddeep py-4 text-base font-semibold text-ink shadow-[0_12px_30px_-10px_rgba(201,146,47,0.6)] transition-all hover:shadow-[0_16px_36px_-10px_rgba(201,146,47,0.75)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {submitting ? (
                  <>
                    <Spinner /> 신청 접수 중…
                  </>
                ) : (
                  '신청 완료하기'
                )}
              </button>
              <p className="text-center text-sm text-cream/40">
                제출 시 위 개인정보 수집·이용에 동의한 것으로 간주됩니다.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- 하위 컴포넌트 ---------- */

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-cream/85">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-300">{error}</p>}
    </div>
  )
}

function inputCls(hasError: boolean): string {
  return `w-full rounded-xl border bg-ink/40 px-4 py-3 text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 ${
    hasError ? 'border-red-400/60' : 'border-cream/15'
  }`
}

function SuccessCard({ name, simulated }: { name: string; simulated?: boolean }) {
  return (
    <div className="rounded-2xl border border-gold/30 bg-gold/[0.06] p-8 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-gold to-golddeep text-ink">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12l5 5L20 6" />
        </svg>
      </div>
      <h3 className="mt-5 text-2xl text-cream">신청이 완료되었어요!</h3>
      <p className="mt-3 text-sm leading-relaxed text-cream/75">
        <b className="text-gold">{name}</b>님, 40주년 창립제에서 만나요.
        <br />
        자세한 장소와 안내는 신청해 주신 번호로 따로 연락드릴게요.
      </p>
      {simulated && (
        <p className="mt-5 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-sm text-gold/90">
          ⚙️ 테스트 모드입니다 — 실제 시트에는 저장되지 않았어요.
          <br />
          <span className="text-gold/70">
            config.ts 의 GOOGLE_SHEET_ENDPOINT 를 설정하면 실제로 저장됩니다.
          </span>
        </p>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z" />
    </svg>
  )
}
