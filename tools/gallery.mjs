/**
 * src/img/old_photo/ (원본, 저장소에 없음) → public/gallery/*.jpg (웹용 1600px)
 *
 *   node tools/gallery.mjs           # 없는 것만
 *   node tools/gallery.mjs --force   # 전부 다시
 *   node tools/gallery.mjs --list    # 굽지 않고 GALLERY_IMAGES 배열만 출력
 *
 * 원본은 4032px·3MB 씩 되므로 라이트박스에 충분한 1600px JPEG 로 줄여 내보낸다.
 * 그리드용 WebP 썸네일은 이어서 `npm run thumbs` 가 만든다.
 *
 * 파일명은 "카테고리 슬러그 + 카테고리 안에서의 번호" 다. 갤러리에 보이는 순서는
 * config.ts 의 GALLERY_IMAGES 배열 순서로만 정해지므로, 순서를 바꿔도 파일명은 그대로다.
 * (vercel.json 이 사진에 1년 immutable 캐시를 걸어 두므로 파일명이 흔들리면 안 된다)
 *
 * 사진을 추가하면 카테고리 뒤에 번호가 이어 붙는다. 중간 사진을 지우면 뒤 번호가
 * 당겨지니, 지울 때는 --force 로 다시 굽고 사진 전체를 함께 커밋할 것.
 */
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { readdirSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const here = dirname(fileURLToPath(import.meta.url))
const SOURCE = resolve(here, '../src/img/old_photo')
const OUTPUT = resolve(here, '../public/gallery')

/** 라이트박스(최대 max-w-3xl @2x)에 충분한 긴 변 길이 */
const LONG_EDGE = 1600
const QUALITY = 82

/**
 * 갤러리에 나올 순서. 원본 파일명의 접두사로 묶는다.
 * label 은 config.ts 에 남길 주석용, slug 는 내보낼 파일명.
 */
const GROUPS = [
  { prefix: '고기수_', slug: 'elder', label: '고기수' },
  { prefix: '과거창립제_', slug: 'fest', label: '과거 창립제' },
  { prefix: '우리뱃지', slug: 'badge', label: '우리 뱃지' },
  { prefix: '28기부근_', slug: 'c28', label: '28기 부근' },
  { prefix: '30주년_', slug: 'anniv', label: '30주년' },
  // 아래 셋은 한 덩어리(30기대)로 본다
  { prefix: '30기_', slug: 'c30', label: '30기대 — 30기' },
  { prefix: '30기대_', slug: 'c30s', label: '30기대' },
  { prefix: '30기대(유진)_', slug: 'c30s-yj', label: '30기대 (유진)' },
]

const force = process.argv.includes('--force')
const listOnly = process.argv.includes('--list')

if (!existsSync(SOURCE)) {
  console.error(`✗ 원본 폴더가 없습니다: ${SOURCE}`)
  process.exit(1)
}

/**
 * macOS 는 파일명의 한글을 NFD(분해형)로 저장한다. 이 파일 안의 접두사 리터럴은
 * NFC(조합형)라서 정규화 없이 비교하면 '고기수_' 로 시작하는 파일을 하나도 못 찾는다.
 * 비교는 NFC 로 맞춘 이름으로 하고, 실제 파일 접근은 원래 이름(raw)으로 한다.
 */
const files = readdirSync(SOURCE)
  .filter((f) => /\.(jpe?g|png)$/i.test(f))
  .map((raw) => ({ raw, name: raw.normalize('NFC') }))

// 접두사가 겹치지 않으므로 파일 하나는 한 그룹에만 들어간다.
// 어느 그룹에도 안 걸리는 파일이 있으면 접두사 오타이므로 멈춘다.
const claimed = new Set()
const buckets = GROUPS.map((g) => {
  const prefix = g.prefix.normalize('NFC')
  const mine = files
    .filter((f) => f.name.startsWith(prefix))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko', { numeric: true }))
  for (const f of mine) {
    if (claimed.has(f.raw)) {
      console.error(`✗ ${f.name} 가 두 그룹에 걸립니다. GROUPS 의 prefix 를 확인하세요.`)
      process.exit(1)
    }
    claimed.add(f.raw)
  }
  return { ...g, files: mine }
})

const orphans = files.filter((f) => !claimed.has(f.raw))
if (orphans.length) {
  console.error(`✗ 어느 카테고리에도 속하지 않는 파일 ${orphans.length}개:`)
  for (const f of orphans) console.error(`    ${f.name}`)
  console.error(`  tools/gallery.mjs 의 GROUPS 에 접두사를 추가하세요.`)
  process.exit(1)
}

mkdirSync(OUTPUT, { recursive: true })

const pad = (n) => String(n).padStart(2, '0')
let made = 0
let skipped = 0
const lines = []

for (const bucket of buckets) {
  if (bucket.files.length === 0) continue
  lines.push(`  // ${bucket.label} (${bucket.files.length}장)`)

  bucket.files.forEach((file, i) => {
    const name = `${bucket.slug}-${pad(i + 1)}.jpg`
    const out = join(OUTPUT, name)
    lines.push(`  { src: '/gallery/${name}' },`)

    if (listOnly) return

    const src = join(SOURCE, file.raw)
    if (!force && existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) {
      skipped++
      return
    }

    // sips 는 macOS 기본 도구라 별도 설치가 없다 (render-og.mjs 가 로컬 크롬을 쓰는 것과 같은 방식)
    execFileSync(
      'sips',
      [
        '-Z', String(LONG_EDGE),
        '--setProperty', 'format', 'jpeg',
        '--setProperty', 'formatOptions', String(QUALITY),
        src,
        '--out', out,
      ],
      { stdio: 'ignore' },
    )
    made++
  })
}

if (listOnly) {
  console.log(lines.join('\n'))
  process.exit(0)
}

const total = buckets.reduce((s, b) => s + b.files.length, 0)
const bytes = buckets
  .flatMap((b) => b.files.map((_, i) => join(OUTPUT, `${b.slug}-${pad(i + 1)}.jpg`)))
  .reduce((s, p) => s + (existsSync(p) ? statSync(p).size : 0), 0)

console.log(
  `✓ ${made}장 생성, ${skipped}장 건너뜀 → ${OUTPUT}\n` +
    `  총 ${total}장 ${(bytes / 1024 / 1024).toFixed(2)}MB\n` +
    `  이어서 \`npm run thumbs\` 로 썸네일을 만들고, config.ts 의 GALLERY_IMAGES 를 갱신하세요.\n` +
    `  (배열은 \`node tools/gallery.mjs --list\` 로 뽑을 수 있습니다)`,
)
