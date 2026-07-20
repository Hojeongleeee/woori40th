/** 한국 휴대폰 번호 검증 & 포맷 유틸 */

/** 숫자만 추출 */
export function onlyDigits(v: string): string {
  return v.replace(/\D/g, '')
}

/**
 * 입력 중 자동 하이픈 포맷 (010-1234-5678 형태)
 * 011/016/017/018/019 (10자리)도 지원.
 */
export function formatPhone(v: string): string {
  const d = onlyDigits(v).slice(0, 11)
  if (d.length < 4) return d
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

/** 유효한 한국 휴대폰 번호인지 (010/011/016/017/018/019 + 10~11자리) */
export function isValidPhone(v: string): boolean {
  const d = onlyDigits(v)
  return /^01[016789]\d{7,8}$/.test(d)
}

/** 이름: 공백 제외 최소 1자, 최대 40자 */
export function isValidName(v: string): boolean {
  const t = v.trim()
  return t.length >= 1 && t.length <= 40
}

/** 기수: 비어있지 않으면 통과 */
export function isValidCohort(v: string): boolean {
  return v.trim().length >= 1
}
