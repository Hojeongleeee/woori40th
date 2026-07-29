/**
 * Woori 40th 창립제 초대장 — 참가 신청 수신용 Google Apps Script
 * ------------------------------------------------------------------
 * 이 스크립트를 구글 시트에 붙여넣고 "웹앱"으로 배포하면,
 * 초대장 사이트의 신청 폼에서 보낸 데이터가 시트에 한 줄씩 쌓입니다.
 *
 * 시트 컬럼(자동 생성): 신청시각 | 이름 | 핸드폰번호 | 기수 | 동의여부 | 공연도움
 *
 * ※ 이미 만들어진 시트라면 부족한 열 제목은 자동으로 덧붙습니다.
 *   (스크립트를 수정한 뒤 반드시 "새 버전으로 배포" 해야 반영됩니다)
 *
 * 자세한 배포 방법은 프로젝트 루트의 GOOGLE_SHEET_SETUP.md 를 참고하세요.
 */

// 데이터가 쌓일 시트(탭) 이름. 없으면 자동으로 만들어집니다.
var SHEET_NAME = '신청';
var HEADERS = ['신청시각', '이름', '핸드폰번호', '기수', '동의여부', '공연도움'];

// 어느 버전이 배포됐는지 브라우저로 확인하기 위한 표식.
// 웹앱 주소를 열었을 때 이 값이 안 보이면 옛 코드가 배포된 상태입니다.
var VERSION = 'v4-check';

/**
 * POST 요청 처리 — 초대장 폼에서 호출됩니다.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    // 동시 제출로 인한 행 꼬임/중복 방지
    lock.waitLock(30000);
    locked = true;

    var data = parseBody_(e);
    var name = String(data.name || '').trim();
    var phoneRaw = String(data.phoneFormatted || data.phone || '').trim();
    var phoneDigits = String(data.phone || phoneRaw).replace(/[^0-9]/g, '');
    var cohort = String(data.cohort || '').trim();
    var agree = data.agree ? 'Y' : 'N';
    var helpPerform = data.helpPerform ? 'Y' : 'N';

    // 필수값 검증
    if (!name || !phoneDigits || !cohort || !data.agree) {
      return json_({ result: 'error', message: '필수 항목이 누락되었습니다.' });
    }

    var sheet = getSheet_();

    // 중복(같은 휴대폰 번호) 확인
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      var existing = String(values[i][2] || '').replace(/[^0-9]/g, '');
      if (existing && existing === phoneDigits) {
        return json_({ result: 'duplicate' });
      }
    }

    var now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    // 저장은 하이픈 포함 보기 좋은 형태로
    sheet.appendRow([now, name, phoneRaw || phoneDigits, cohort, agree, helpPerform]);

    return json_({ result: 'success' });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  } finally {
    // 잠금을 못 잡았는데 해제하면 또 예외가 나므로 잡았을 때만 푼다
    if (locked) lock.releaseLock();
  }
}

/**
 * GET 요청 — 배포 확인 + 신청 수 조회 + 접수 여부 확인.
 *
 *   ?action=count           → { result: 'ok', count: 12 }
 *   ?action=check&phone=... → { result: 'ok', exists: true, count: 12 }
 *   (파라미터 없음)          → 위 값에 version·headers 를 덧붙인 확인용 응답
 *
 * ※ check 가 왜 필요한가
 *   브라우저에서 doPost 로 보낸 요청은 시트에 잘 저장되는데, Apps Script 가
 *   응답을 넘겨주는 googleusercontent 주소를 브라우저가 다시 읽을 때 404 가
 *   나는 경우가 있다. 그러면 저장은 됐는데 화면에는 실패로 보인다.
 *   그래서 사이트는 제출 뒤 이 GET 으로 "정말 들어갔는지" 를 확인한다.
 *
 * 개인정보는 내보내지 않는다. check 는 이미 알고 있는 번호에 대해
 * 예/아니오만 돌려주고, 명단이나 다른 사람의 정보는 절대 나가지 않는다.
 */
function doGet(e) {
  var params = (e && e.parameter) || {};
  var action = params.action || '';
  var count = countApplications_();

  if (action === 'count') {
    return json_({ result: 'ok', count: count });
  }

  if (action === 'check') {
    var digits = String(params.phone || '').replace(/[^0-9]/g, '');
    return json_({
      result: 'ok',
      exists: digits ? phoneExists_(digits) : false,
      count: count,
    });
  }

  return json_({
    result: 'ok',
    message: 'Woori 40th endpoint alive',
    version: VERSION,
    count: count,
    headers: HEADERS,
  });
}

/* ------------------------- 내부 유틸 ------------------------- */

/** 헤더 한 줄을 뺀 신청 건수. 시트가 아직 없으면 0. */
function countApplications_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return 0;
  return Math.max(0, sheet.getLastRow() - 1);
}

/** 이 번호로 접수된 신청이 있는지 (숫자만 비교). */
function phoneExists_(digits) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return false;

  // 핸드폰번호 = 3번째 열
  var values = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0] || '').replace(/[^0-9]/g, '') === digits) return true;
  }
  return false;
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  var raw = e.postData.contents;
  try {
    return JSON.parse(raw);
  } catch (_) {
    // application/x-www-form-urlencoded 형태로 온 경우 대비
    return (e.parameter || {});
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  // 헤더가 없으면 추가
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return sheet;
  }

  // 이미 쓰던 시트라면, 비어 있는 열 제목만 채운다.
  // (직접 바꿔 둔 제목은 건드리지 않는다)
  var width = Math.max(sheet.getLastColumn(), HEADERS.length);
  var header = sheet.getRange(1, 1, 1, width).getValues()[0];
  var changed = false;
  for (var c = 0; c < HEADERS.length; c++) {
    if (!String(header[c] || '').trim()) {
      header[c] = HEADERS[c];
      changed = true;
    }
  }
  if (changed) {
    sheet.getRange(1, 1, 1, width).setValues([header]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
