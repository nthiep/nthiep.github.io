/**
 * RSVP → Google Sheet (container-bound)
 *
 * 1. Mở sheet → Extensions → Apps Script
 * 2. Dán toàn bộ file này, Save
 * 3. Chạy hàm doGet một lần (Run) và cấp quyền cho script
 * 4. Deploy → New deployment
 *    - Type: Web app
 *    - Execute as / Chạy với tư cách: Me / Tôi
 *    - Who has access / Ai có quyền truy cập: Anyone / Bất kỳ ai
 *      (KHÔNG chọn “Bất kỳ ai có Tài khoản Google”)
 * 5. Copy URL .../exec vào wedding-invitation/.env:
 *    VITE_RSVP_WEBAPP_URL=https://script.google.com/macros/s/.../exec
 *
 * Nếu đã deploy rồi mà vẫn 403:
 * Deploy → Manage deployments → biểu tượng bút chì
 * → Version: New version → Access: Anyone → Deploy
 * rồi copy URL mới (nếu đổi) vào .env và rebuild.
 */

var SPREADSHEET_ID = '1LGQZMrvktidHzQxtFlhsT-lAJ_fVHi14eSC5qsa36DQ';
var SHEET_NAME = ''; // trống = sheet đầu tiên (gid=0)
var HEADERS = [
  'Thời gian',
  'Họ và tên',
  'Tham dự',
  'Số khách',
  'Lời chúc',
  'Ngôn ngữ',
  'ID',
];

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var sheet = getTargetSheet_();
    ensureHeaderRow_(sheet);

    var attending = data.attending === 'yes' ? 'Có' : 'Không';
    var row = [
      data.submittedAt || new Date().toISOString(),
      data.fullName || '',
      attending,
      data.guestsCount != null ? data.guestsCount : '',
      data.message || '',
      data.lang || '',
      data.id || '',
    ];

    sheet.appendRow(row);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'wedding-rsvp' });
}

function getTargetSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  if (SHEET_NAME) {
    var named = ss.getSheetByName(SHEET_NAME);
    if (!named) throw new Error('Sheet not found: ' + SHEET_NAME);
    return named;
  }
  return ss.getSheets()[0];
}

function ensureHeaderRow_(sheet) {
  var first = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var empty = first.every(function (cell) {
    return cell === '' || cell == null;
  });
  if (empty) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
