/**
 * 줄바꿈 점검 — 화면 폭마다 "실제 렌더된 줄"을 뽑아
 * ① 어절이 중간에서 쪼개졌는지 ② 마지막 줄에 한두 글자만 남았는지 찾는다.
 *
 *   npm run dev          # 먼저 개발 서버를 띄우고
 *   node tools/linebreaks.mjs
 *   node tools/linebreaks.mjs http://localhost:4173   # 주소 지정도 가능
 *
 * 문구를 고칠 때마다 돌려 보면 눈으로 놓치는 것을 잡아 준다.
 * 자세한 배경과 처방은 저장소 루트의 줄바꿈-점검.md 참고.
 */
import puppeteer from 'puppeteer-core'

const TARGET = process.argv[2] ?? 'http://localhost:5173/'
const CHROME =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const WIDTHS = [360, 390, 430, 640, 768, 1024, 1280, 1440]

/** 페이지 안에서 실행 — 각 텍스트 블록의 "실제 렌더된 줄"을 뽑아 문제를 판정한다. */
const AUDIT = () => {
  /* 줄 나누기: 텍스트 노드의 글자마다 Range 사각형의 top 을 읽어 같은 줄끼리 묶는다.
     inline 자식(<span>, <b>, <br>)이 섞여 있어도 그대로 동작한다. */
  function linesOf(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const chars = []
    let node
    while ((node = walker.nextNode())) {
      const t = node.nodeValue
      for (let i = 0; i < t.length; i++) chars.push({ node, i, ch: t[i] })
    }
    if (!chars.length) return null

    const range = document.createRange()
    const lines = []
    let cur = null
    for (const c of chars) {
      range.setStart(c.node, c.i)
      range.setEnd(c.node, c.i + 1)
      const r = range.getClientRects()[0]
      if (!r) {
        // 줄 끝 공백 등 — 사각형이 없으면 현재 줄에 이어 붙인다
        if (cur) cur.text += c.ch
        continue
      }
      const top = Math.round(r.top)
      if (!cur || Math.abs(top - cur.top) > 2) {
        cur = { top, text: c.ch, left: Math.round(r.left), right: Math.round(r.right) }
        lines.push(cur)
      } else {
        cur.text += c.ch
        cur.right = Math.round(r.right)
      }
    }
    return lines
  }

  /** 자식이 모두 inline 인 "텍스트 블록"만 고른다 (중복 집계 방지) */
  function isTextBlock(el) {
    if (!el.innerText || !el.innerText.trim()) return false
    for (const child of el.children) {
      const d = getComputedStyle(child).display
      if (d !== 'inline' && d !== 'inline-block' && d !== 'contents') return false
    }
    return true
  }

  function pathOf(el) {
    const parts = []
    let e = el
    while (e && e !== document.body && parts.length < 4) {
      let s = e.tagName.toLowerCase()
      if (e.id) s += '#' + e.id
      parts.unshift(s)
      e = e.parentElement
    }
    return parts.join(' > ')
  }

  function sectionOf(el) {
    const s = el.closest('section[id], footer, header')
    if (!s) return '(기타)'
    return s.id ? '#' + s.id : s.tagName.toLowerCase()
  }

  const HANGUL = /[가-힣]/
  const results = []

  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') continue
    if (el.closest('[role="dialog"]')) continue
    if (!isTextBlock(el)) continue

    const raw = el.innerText.replace(/\s+/g, ' ').trim()
    if (raw.length < 8 || raw.length > 400) continue
    if (!HANGUL.test(raw)) continue

    const lines = linesOf(el)
    if (!lines || lines.length < 2) continue

    const texts = lines.map((l) => l.text)
    const issues = []

    // 1) 어절 중간에서 끊김 — 줄 끝/다음 줄 시작이 모두 한글이고 원문에 공백이 없음
    for (let i = 0; i < texts.length - 1; i++) {
      const endCh = texts[i].replace(/\s+$/, '').slice(-1)
      const nextCh = texts[i + 1].replace(/^\s+/, '')[0]
      if (!endCh || !nextCh) continue
      const endsWithSpace = /\s$/.test(texts[i])
      if (!endsWithSpace && HANGUL.test(endCh) && HANGUL.test(nextCh)) {
        issues.push({ kind: '어절 쪼개짐', at: `${i + 1}→${i + 2}줄`, detail: `…${texts[i].slice(-6)} / ${texts[i + 1].slice(0, 6)}…` })
      }
    }

    // 2) 마지막 줄에 글자가 거의 안 남음 (고아 줄)
    const last = texts[texts.length - 1].trim()
    const avg = texts.slice(0, -1).reduce((a, t) => a + t.trim().length, 0) / (texts.length - 1)
    if (last.length > 0 && last.length <= 4 && avg >= 10) {
      issues.push({ kind: '고아 줄', at: `${texts.length}줄`, detail: `마지막 줄 "${last}" (${last.length}자)` })
    }

    if (!issues.length) continue

    results.push({
      section: sectionOf(el),
      path: pathOf(el),
      classes: (el.className || '').toString().slice(0, 120),
      breakKeep: cs.wordBreak,
      text: raw.slice(0, 90),
      lines: texts.map((t) => t.trim()),
      issues,
    })
  }

  return results
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
// Reveal 애니메이션이 스크롤 기반이라, 모션 최소화로 전부 즉시 표시시킨다
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])

let total = 0
const details = []

for (const width of WIDTHS) {
  await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 })
  await page.goto(TARGET, { waitUntil: 'networkidle2' })
  // 접혀 있는 안내(공연 모집)도 펼쳐서 함께 본다
  await page.evaluate(() => {
    document.querySelectorAll('details').forEach((d) => (d.open = true))
  })
  await new Promise((r) => setTimeout(r, 1200))

  const found = await page.evaluate(AUDIT)
  total += found.length
  console.log(`${String(width).padStart(4)}px → ${found.length}건`)
  for (const f of found) details.push({ width, ...f })
}

await browser.close()

if (!total) {
  console.log('\n문제 없음 ✅')
} else {
  console.log(`\n${'='.repeat(70)}\n상세 (총 ${total}건)\n`)
  for (const d of details) {
    console.log(`[${d.width}px] ${d.section}  word-break=${d.breakKeep}`)
    console.log(`  본문: ${d.text}`)
    console.log(`  줄  : ${d.lines.join(' ⏎ ')}`)
    for (const i of d.issues) console.log(`  → ${i.kind} (${i.at}) ${i.detail}`)
    console.log()
  }
  console.log('※ 어절 경계에서 자연스럽게 나뉜 2줄짜리 짧은 문장은 "고아 줄" 로 잡혀도 문제가 아닐 수 있다.')
}
