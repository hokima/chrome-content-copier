document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copy-content');

  if (copyButton) {
    copyButton.addEventListener('click', () => {
      console.log("לחיצה על כפתור העתקה"); // הודעת פלט לבדיקת הלחיצה על הכפתור

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "copyContent" }, (response) => {
            if (response && response.status === "success") {
              console.log("ההעתקה הושלמה בהצלחה");
              alert("התוכן הועתק בהצלחה!");
            } else {
              console.error("שגיאה בהעתקה.");
              alert("אירעה שגיאה בהעתקת התוכן.");
            }
          });
        } else {
          console.error("לא נמצא טאב פעיל.");
        }
      });
    });
  } else {
    console.error("כפתור העתקה לא נמצא ב-popup.html");
  }
});
