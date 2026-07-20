# Woori 40th 창립제 초대장

밴드동아리 **Woori** 창립 40주년 창립제 초대장 — 스크롤형 한 페이지 웹앱.
컨셉은 **"40년의 추억을 담은 하나의 향수"**. 위에서 아래로
탑노트(신세대·아쿠아) → 미들노트(중간 기수·라떼) → 베이스노트(선배들의 추억·앰버/우디)로
색감과 무드가 점점 깊고 따뜻해집니다.

- **스택:** React 19 + Vite + TypeScript + Tailwind CSS v4
- **모바일 우선**, 정적 호스팅(Vercel/Netlify) 배포용
- 참가 신청은 **구글 시트**에 저장 (Apps Script 웹앱)

---

## 빠른 시작

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 정적 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
npm run typecheck
```

---

## 내가 바꿀 것들은 전부 여기 → `src/config.ts`

한 파일에 모아뒀습니다. 이것만 고치면 됩니다.

| 값 | 설명 |
| --- | --- |
| `FILLED_PERCENT` | 상단·신청 섹션의 **"OO% 마감" 바** 수치 (수동 값, 0~100) |
| `GOOGLE_SHEET_ENDPOINT` | 구글 시트 저장용 주소 (배포 방법: [`GOOGLE_SHEET_SETUP.md`](./GOOGLE_SHEET_SETUP.md)) |
| `EVENT` | 날짜/시간/장소/문의 등 행사 정보 |
| `GALLERY_IMAGES` | 추억 사진 목록 (아래 참고) |
| `NOTES` / `TIMELINE` / `CORNERS` | 세 노트 소개, 프로그램, 특별 코너 문구 |
| `COHORT_OPTIONS` | 비워두면 기수 자유 입력, 값을 넣으면 드롭다운 |

### 추억 사진 채우기

1. 이미지 파일을 `public/gallery/` 폴더에 넣습니다. (폴더는 새로 만들어도 됨)
2. `src/config.ts` 의 `GALLERY_IMAGES` 배열에 한 줄씩 추가합니다.

```ts
export const GALLERY_IMAGES: GalleryImage[] = [
  { src: '/gallery/1986-first-stage.jpg', caption: '1기 첫 무대, 1986' },
  { src: '/gallery/mt-2003.jpg', caption: 'MT의 밤, 2003' },
]
```

- 배열이 비어 있으면 **"추억을 기다리는 중" placeholder** 가 표시됩니다.
- 사진을 넣으면 자동으로 그리드가 채워지고, 클릭하면 **크게 보기(라이트박스)** 가 동작합니다.
- 외부 URL(`https://...`)도 그대로 넣을 수 있습니다.

---

## 참가 신청 → 구글 시트

신청 폼(이름·핸드폰·기수·동의)이 제출되면 구글 시트에 한 줄씩 쌓입니다.
설정 방법은 **[`GOOGLE_SHEET_SETUP.md`](./GOOGLE_SHEET_SETUP.md)** 에 한국어로 정리해 뒀습니다.

- 엔드포인트를 넣기 전에는 **테스트 모드**로 폼 흐름만 확인할 수 있습니다.
- 서버 코드: [`google-apps-script/Code.gs`](./google-apps-script/Code.gs)
- 중복(같은 번호) 신청은 서버에서 걸러지고, 사용자에게 안내됩니다.

---

## 배포 (Vercel / Netlify)

정적 사이트라 어디든 가볍게 올라갑니다.

**Vercel**
- 저장소를 연결하면 자동 인식됩니다. (Framework: Vite)
- Build Command: `npm run build` · Output Directory: `dist`

**Netlify**
- Build Command: `npm run build` · Publish Directory: `dist`

> 배포 후 신청이 안 되면, `GOOGLE_SHEET_ENDPOINT` 를 실제 주소로 바꿨는지 확인하세요.

---

## 폴더 구조

```
src/
├─ config.ts              # ★ 여기만 고치면 됩니다 (행사정보·마감%·시트주소·갤러리)
├─ types.ts
├─ App.tsx                # 섹션 조립
├─ index.css              # Tailwind v4 테마(팔레트·폰트·애니메이션)
├─ hooks/useReveal.ts     # 스크롤 페이드인
├─ lib/
│  ├─ submit.ts           # 구글 시트 전송
│  └─ validation.ts       # 휴대폰/이름/기수 검증
└─ components/
   ├─ ProgressBar.tsx     # 상단 고정 "마감 %" 바
   ├─ FloatingApplyButton.tsx
   ├─ Hero.tsx            # 1. 히어로 (탑노트)
   ├─ Invitation.tsx      # 2. 초대의 말
   ├─ ThreeNotes.tsx      # 3. 세 개의 노트
   ├─ WhyCome.tsx         # 4. 왜 와야 하는가
   ├─ Timeline.tsx        # 5. 프로그램 타임라인
   ├─ SpecialCorners.tsx  # 6. 특별 코너
   ├─ Gallery.tsx         # 7. 추억 사진 갤러리 (라이트박스)
   ├─ Apply.tsx           # 8. 참가 신청 폼
   └─ EventSummary.tsx    # 마지막 요약 + 문의
```
