chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyContent") {
    try {
      console.log("התקבלה בקשה להעתקת תוכן");

      // קבלת התוכן הטקסטואלי הנקי
      const textContent = document.body.innerText;

      // העתקת התוכן ללוח
      navigator.clipboard.writeText(textContent).then(() => {
        console.log("התוכן הועתק בהצלחה ל-Clipboard");
        sendResponse({ status: "success", message: "התוכן הועתק בהצלחה" });
      }).catch(err => {
        console.error('שגיאה בהעתקת התוכן: ', err);
        sendResponse({ status: "error", message: err.message });
      });
    } catch (err) {
      console.error('שגיאה כללית בהעתקה: ', err);
      sendResponse({ status: "error", message: err.message });
    }

    return true; // כדי לציין שתגובה תשלח בצורה אסינכרונית
  }
});