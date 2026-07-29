/**
 * tools/og-image.html → public/og-image.png (1200×630) 로 굽는다.
 *
 *   node tools/render-og.mjs
 *
 * 카톡·메신저 링크 미리보기에 쓰이는 이미지라 자주 바꿀 일은 없다.
 * 문구나 디자인을 고쳤다면 이 스크립트를 다시 돌려 PNG 를 갱신하고 함께 커밋할 것.
 *
 * 로컬에 설치된 크롬을 그대로 쓴다 (별도 다운로드 없음).
 * 다른 OS 라면 CHROME 환경변수로 실행 파일 경로를 넘기면 된다.
 */
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const here = dirname(fileURLToPath(import.meta.url))
const TEMPLATE = resolve(here, 'og-image.html')
const OUTPUT = resolve(here, '../public/og-image.png')

const CHROME =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()

// index.html 의 og:image:width/height 가 1200×630 이라 딱 그 크기로 뽑는다.
// (선언한 크기와 실제 크기가 다르면 미리보기가 깨지는 메신저가 있다)
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await page.goto(`file://${TEMPLATE}`, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)

await page.screenshot({ path: OUTPUT, type: 'png' })
await browser.close()

console.log(`✓ ${OUTPUT}`)
