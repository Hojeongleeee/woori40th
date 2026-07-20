/** 신청 폼 입력 값 */
export interface ApplyForm {
  name: string
  phone: string
  cohort: string
  agree: boolean
}

/** 제출 결과 */
export type SubmitResult =
  | { ok: true; simulated?: boolean }
  | { ok: false; reason: 'duplicate' | 'validation' | 'network' | 'server'; message?: string }
