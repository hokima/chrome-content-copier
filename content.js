chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyContent") {
    try {
      // ודא שכל תוכן העמוד נטען
      document.addEventListener("DOMContentLoaded", () => {
        // יצירת עותק של תוכן העמוד
        const clonedDocument = document.body.cloneNode(true);

        // הסרת אלמנטים שאינם נחוצים מהעותק בלבד (תמונות, סרטונים, פרסומות וכו')
        clonedDocument.querySelectorAll('iframe, video, img, .ad, [class*="ad"]').forEach(e => e.remove());

        // קבלת התוכן הטקסטואלי הנקי מהעותק
        const textContent = clonedDocument.innerText;

        // העתקת התוכן ללוח
        navigator.clipboard.writeText(textContent).then(() => {
          sendResponse({ status: "success" });
        }).catch(err => {
          console.error('שגיאה בהעתקת התוכן: ', err);
          sendResponse({ status: "error" });
        });
      });
    } catch (err) {
      console.error('שגיאה כללית בהעתקה: ', err);
      sendResponse({ status: "error" });
    }
    return true; // כדי לציין שתגובה תשלח בצורה אסינכרונית
  }
});
