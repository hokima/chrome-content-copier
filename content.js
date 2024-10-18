chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyContent") {
    console.log("התקבלה בקשה להעתקת תוכן"); // הודעת פלט לבדיקת קליטת הבקשה

    try {
      // יצירת עותק של תוכן העמוד
      const clonedDocument = document.body.cloneNode(true);

      // הסרת אלמנטים שאינם נחוצים מהעותק בלבד (תמונות, סרטונים, פרסומות וכו')
      clonedDocument.querySelectorAll('iframe, video, img, .ad, [class*="ad"]').forEach(e => e.remove());
      console.log("האלמנטים הלא נחוצים הוסרו"); // הודעת פלט לבדיקת שלב הסרת האלמנטים

      // קבלת התוכן הטקסטואלי הנקי מהעותק
      const textContent = clonedDocument.innerText;

      // העתקת התוכן ללוח
      navigator.clipboard.writeText(textContent).then(() => {
        console.log("התוכן הועתק בהצלחה ל-Clipboard"); // הודעת פלט לבדיקת הצלחת ההעתקה
        alert("התוכן הועתק בהצלחה ל-Clipboard!");
        sendResponse({ status: "success" });
      }).catch(err => {
        console.error('שגיאה בהעתקת התוכן: ', err);
        sendResponse({ status: "error" });
      });
    } catch (err) {
      console.error('שגיאה כללית בהעתקה: ', err);
      sendResponse({ status: "error" });
    }

    return true; // כדי לציין שתגובה תשלח בצורה אסינכרונית
  }
});
