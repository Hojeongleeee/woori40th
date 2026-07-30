import { NAVER_MAP_URL } from '../config'
import { MapPinIcon } from './Icons'

/**
 * 창립제 장소 — 네이버 지도 바로가기.
 *
 * 원래는 이 자리에 네이버 지도 v3 를 띄웠다. 지금은 인증이 통과하지 못해
 * (콘솔에 배포 도메인이 Web 서비스 URL 로 등록되지 않은 상태) 지도가 그려지지
 * 않고, 대신 핀 아이콘과 주소를 담은 사각형이 남았다. 그런데 그 사각형의
 * 내용은 바로 위 '장소' 행(EVENT.placeLabel · placeNote · placeAccess)과
 * 글자까지 같아서, 지도가 없는 동안에는 같은 주소를 두 번 읽히는 빈 상자일
 * 뿐이었다. 그래서 상자를 걷어내고 바로가기만 남긴다.
 *
 * 지도를 되살리려면 네이버 클라우드 콘솔에 배포 도메인을 등록한 뒤
 * 커밋 ec1e871 시점의 이 파일을 되돌리면 된다. VENUE_MAP 의 키·좌표 설정은
 * config.ts 에 그대로 남겨 뒀다.
 */
export default function VenueMap({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
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
  )
}
