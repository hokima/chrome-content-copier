function extractArticleContent() {
  // ... (הקוד הקיים לחילוץ תוכן הכתבה נשאר ללא שינוי)
}

function copyTextToClipboard(text) {
  // יצירת אלמנט טקסט זמני
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // הוספת האלמנט לדף
  document.body.appendChild(textArea);

  // בחירת הטקסט
  textArea.select();

  try {
    // ניסיון להעתיק את הטקסט
    const successful = document.execCommand('copy');
    if (!successful) throw new Error('Copying text command was unsuccessful');
    return true;
  } catch (err) {
    console.error('שגיאה בהעתקת הטקסט: ', err);
    return false;
  } finally {
    // הסרת האלמנט הזמני מהדף
    document.body.removeChild(textArea);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyContent") {
    try {
      console.log("התקבלה בקשה להעתקת תוכן הכתבה");

      const articleText = extractArticleContent();

      if (!articleText) {
        sendResponse({ status: "error", message: "לא הצלחנו לזהות את תוכן הכתבה" });
        return true;
      }

      // שימוש בפונקציה החדשה להעתקת הטקסט
      if (copyTextToClipboard(articleText)) {
        console.log("תוכן הכתבה הועתק בהצלחה ל-Clipboard");
        sendResponse({ status: "success", message: "תוכן הכתבה הועתק בהצלחה" });
      } else {
        sendResponse({ status: "error", message: "לא הצלחנו להעתיק את התוכן ללוח" });
      }
    } catch (err) {
      console.error('שגיאה כללית בהעתקה: ', err);
      sendResponse({ status: "error", message: err.message });
    }

    return true; // כדי לציין שתגובה תשלח בצורה אסינכרונית
  }
});