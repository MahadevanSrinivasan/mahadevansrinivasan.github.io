// This function handles GET requests. It's good practice to have it.
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({"status": "error", "message": "This script only accepts POST requests."}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
    }
    
    if (sheet.getLastRow() === 0) {
        var headers = ["Date", "Status", "Payment Made", "Note"];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    var rows = data.map(function(item) {
      return [ new Date(item.date), item.status, item.paymentMade, item.note || "" ];
    });
    
    if (rows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    }
    
    lock.releaseLock();

    return ContentService
      .createTextOutput(JSON.stringify({"status": "success", "rows": rows.length}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
