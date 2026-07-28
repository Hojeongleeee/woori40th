import { useEffect, useRef, useState } from 'react'
import { NAVER_MAP_URL, VENUE_MAP } from '../config'
import { MapPinIcon } from './Icons'

/* 네이버 지도 API v3 는 전역 window.naver 에 붙고,
   인증 실패 시 window.navermap_authFailure 를 호출한다. */
declare global {
  interface Window {
    naver?: {
      maps?: {
        LatLng: new (lat: number, lng: number) => unknown
        Map: new (el: HTMLElement, opts: Record<string, unknown>) => unknown
        Marker: new (opts: Record<string, unknown>) => unknown
        Position: Record<string, unknown>
        Service: {
          geocode: (
            opts: { query: string },
            cb: (
              status: string,
              res: { v2: { addresses: { x: string; y: string }[] } },
            ) => void,
          ) => void
          Status: { OK: string }
        }
      }
    }
    navermap_authFailure?: () => void
  }
}

/** 스크립트는 페이지당 한 번만 붙인다. */
let scriptPromise: Promise<void> | null = null

function loadNaverMaps(clientId: string, authParam: string): Promise<void> {
  if (window.naver?.maps) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src =
      'https://oapi.map.naver.com/openapi/v3/maps.js' +
      `?${authParam}=${encodeURIComponent(clientId)}&submodules=geocoder`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('네이버 지도 스크립트를 불러오지 못했습니다.'))
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}

type Status = 'nokey' | 'loading' | 'ready' | 'failed'

/**
 * 창립제 장소 지도.
 * config.ts 의 VENUE_MAP.naverClientId 가 비어 있거나 인증에 실패하면
 * (주로 Web 서비스 URL 미등록) 지도 대신 주소 + 네이버 지도 링크를 보여준다.
 */
export default function VenueMap({ className = '' }: { className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>(VENUE_MAP.naverClientId ? 'loading' : 'nokey')

  useEffect(() => {
    if (!VENUE_MAP.naverClientId) return
    let cancelled = false
    const fail = () => {
      if (!cancelled) setStatus('failed')
    }

    // 키가 잘못됐거나 도메인이 등록되지 않은 경우 네이버가 이 콜백을 부른다.
    window.navermap_authFailure = fail

    loadNaverMaps(VENUE_MAP.naverClientId, VENUE_MAP.authParam)
      .then(() => {
        const maps = window.naver?.maps
        if (cancelled || !boxRef.current || !maps) {
          fail()
          return
        }

        const draw = (lat: number, lng: number) => {
          if (cancelled || !boxRef.current) return
          const center = new maps.LatLng(lat, lng)
          const map = new maps.Map(boxRef.current, {
            center,
            zoom: VENUE_MAP.zoom,
            scaleControl: false,
            mapDataControl: false,
            logoControlOptions: { position: maps.Position.BOTTOM_LEFT },
          })
          new maps.Marker({ position: center, map, title: VENUE_MAP.placeName })
          setStatus('ready')
        }

        if (VENUE_MAP.coords) {
          draw(VENUE_MAP.coords.lat, VENUE_MAP.coords.lng)
          return
        }

        // 좌표가 없으면 주소로 검색해서 마커를 찍는다.
        maps.Service.geocode({ query: VENUE_MAP.address }, (s, res) => {
          if (cancelled) return
          const hit = res?.v2?.addresses?.[0]
          if (s !== maps.Service.Status.OK || !hit) {
            fail()
            return
          }
          draw(Number(hit.y), Number(hit.x))
        })
      })
      .catch(fail)

    return () => {
      cancelled = true
      if (window.navermap_authFailure === fail) delete window.navermap_authFailure
    }
  }, [])

  const showMap = status === 'loading' || status === 'ready'

  return (
    <div className={className}>
      <div className="border border-cream/15 bg-soot">
        {showMap ? (
          <div
            ref={boxRef}
            className="h-64 w-full sm:h-80"
            role="img"
            aria-label={`${VENUE_MAP.placeName} 위치 지도`}
          />
        ) : (
          /* 키 미설정 · 인증 실패 시 대체 화면 */
          <div className="relative flex h-64 flex-col items-center justify-center gap-3 overflow-hidden px-6 text-center sm:h-80">
            <span className="dots-lg pointer-events-none absolute inset-0 text-marigold/15" aria-hidden />
            <span className="relative grid h-12 w-12 place-items-center rounded-full border border-marigold/40 text-marigold">
              <MapPinIcon className="h-6 w-6" />
            </span>
            <p className="relative font-medium text-cream">{VENUE_MAP.placeName}</p>
            <p className="relative text-sm text-cream/70">{VENUE_MAP.address}</p>
            <p className="relative text-xs text-cream/45">{VENUE_MAP.addressNote}</p>
          </div>
        )}
      </div>

      {/* 지도 아래 주소 + 바로가기 (대체 화면에는 이미 주소가 있으므로 버튼만) */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
        {showMap && <span className="text-cream/70">{VENUE_MAP.address}</span>}
        <a
          href={NAVER_MAP_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 bg-marigold px-3 py-1.5 text-xs font-semibold text-ink transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
        >
          <MapPinIcon className="h-3.5 w-3.5" />
          네이버 지도에서 보기
        </a>
      </div>
    </div>
  )
}
