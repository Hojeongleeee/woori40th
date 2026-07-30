/**
 * public/gallery/*.jpg → public/gallery/thumb/*.webp (그리드용 썸네일)
 *
 *   node tools/thumbs.mjs           # 새로 추가·수정된 사진만
 *   node tools/thumbs.mjs --force   # 전부 다시
 *
 * 갤러리 원본은 1600px 인데 3×3 그리드의 한 칸은 데스크톱 약 330px,
 * 모바일은 약 106px 밖에 안 된다. 원본을 그대로 내보내면 한 페이지(9장)에
 * 2.3MB 를 받아 106px 칸을 채우게 되므로, 표시 크기에 맞춘 WebP 를 따로 굽는다.
 * 원본은 라이트박스(크게 보기)에서만 쓴다.
 *
 * render-og.mjs 와 같은 방식으로 로컬 도구를 그대로 쓴다 (빌드 의존성 없음).
 * 사진을 추가·교체했다면 이 스크립트를 다시 돌려 thumb/ 까지 함께 커밋할 것.
 * cwebp 가 PATH 에 없으면 CWEBP 환경변수로 경로를 넘기면 된다.
 */
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join, parse } from 'node:path'
import { readdirSync, mkdirSync, statSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const here = dirname(fileURLToPath(import.meta.url))
const SOURCE = resolve(here, '../public/gallery')
const OUTPUT = join(SOURCE, 'thumb')

/** Gallery.tsx 의 srcset 과 짝을 맞춘 너비. 바꾸면 그쪽도 함께 고쳐야 한다. */
const WIDTHS = [330, 660]
const QUALITY = 80

const CWEBP = process.env.CWEBP ?? 'cwebp'
const force = process.argv.includes('--force')

try {
  execFileSync(CWEBP, ['-version'], { stdio: 'ignore' })
} catch {
  console.error(
    `✗ cwebp 를 찾을 수 없습니다 (${CWEBP}).\n` +
      `  brew install webp 로 설치하거나 CWEBP 환경변수로 경로를 넘겨주세요.`,
  )
  process.exit(1)
}

mkdirSync(OUTPUT, { recursive: true })

const sources = readdirSync(SOURCE)
  .filter((f) => /\.jpe?g$/i.test(f))
  .sort()

if (sources.length === 0) {
  console.error(`✗ ${SOURCE} 에 jpg 가 없습니다.`)
  process.exit(1)
}

let made = 0
let skipped = 0
let bytesIn = 0
let bytesOut = 0

for (const file of sources) {
  const src = join(SOURCE, file)
  const srcStat = statSync(src)
  bytesIn += srcStat.size

  for (const width of WIDTHS) {
    const out = join(OUTPUT, `${parse(file).name}-${width}.webp`)

    // 원본이 더 최신일 때만 다시 굽는다 (재실행이 싸도록)
    if (!force && existsSync(out) && statSync(out).mtimeMs >= srcStat.mtimeMs) {
      bytesOut += statSync(out).size
      skipped++
      continue
    }

    execFileSync(
      CWEBP,
      ['-quiet', '-q', String(QUALITY), '-resize', String(width), '0', src, '-o', out],
      { stdio: 'inherit' },
    )
    bytesOut += statSync(out).size
    made++
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(2)
console.log(
  `✓ 썸네일 ${made}개 생성, ${skipped}개 건너뜀 → ${OUTPUT}\n` +
    `  원본 ${sources.length}장 ${mb(bytesIn)}MB · 썸네일 ${mb(bytesOut)}MB`,
)
