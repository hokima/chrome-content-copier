chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyContent") {
    try {
      console.log("התקבלה בקשה להעתקת תוכן");

      // קבלת התוכן הטקסטואלי הנקי
      const textContent = document.body.innerText;

      // העתקת התוכן ללוח
      navigator.clipboard.writeText(textContent).then(() => {
        console.log("התוכן הועתק בהצלחה ל-Clipboard");
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
