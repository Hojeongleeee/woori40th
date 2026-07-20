/**
 * Woori 40th 창립제 초대장 — 참가 신청 수신용 Google Apps Script
 * ------------------------------------------------------------------
 * 이 스크립트를 구글 시트에 붙여넣고 "웹앱"으로 배포하면,
 * 초대장 사이트의 신청 폼에서 보낸 데이터가 시트에 한 줄씩 쌓입니다.
 *
 * 시트 컬럼(자동 생성): 신청시각 | 이름 | 핸드폰번호 | 기수 | 동의여부
 *
 * 자세한 배포 방법은 프로젝트 루트의 GOOGLE_SHEET_SETUP.md 를 참고하세요.
 */

// 데이터가 쌓일 시트(탭) 이름. 없으면 자동으로 만들어집니다.
var SHEET_NAME = '신청';
var HEADERS = ['신청시각', '이름', '핸드폰번호', '기수', '동의여부'];

/**
 * POST 요청 처리 — 초대장 폼에서 호출됩니다.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // 동시 제출로 인한 행 꼬임/중복 방지
    lock.waitLock(30000);

    var data = parseBody_(e);
    var name = String(data.name || '').trim();
    var phoneRaw = String(data.phoneFormatted || data.phone || '').trim();
    var phoneDigits = String(data.phone || phoneRaw).replace(/[^0-9]/g, '');
    var cohort = String(data.cohort || '').trim();
    var agree = data.agree ? 'Y' : 'N';

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
    sheet.appendRow([now, name, phoneRaw || phoneDigits, cohort, agree]);

    return json_({ result: 'success' });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * GET 요청 — 배포가 잘 됐는지 브라우저로 확인용.
 */
function doGet() {
  return json_({ result: 'ok', message: 'Woori 40th endpoint alive' });
}

/* ------------------------- 내부 유틸 ------------------------- */

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
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
