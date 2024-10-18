document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copy-content');
  const statusMessage = document.getElementById('status-message');

  if (copyButton) {
    copyButton.addEventListener('click', () => {
      console.log("לחיצה על כפתור העתקה");
      statusMessage.textContent = "מנסה להעתיק...";

      chrome.runtime.sendMessage({action: "copyContent"}, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          statusMessage.textContent = "שגיאה: " + chrome.runtime.lastError.message;
        } else if (response && response.status === "success") {
          console.log("ההעתקה הושלמה בהצלחה");
          statusMessage.textContent = "התוכן הועתק בהצלחה!";
        } else {
          console.error("שגיאה בהעתקה:", response ? response.message : "לא התקבלה תגובה");
          statusMessage.textContent = "שגיאה בהעתקה: " + (response ? response.message : "לא התקבלה תגובה");
        }
      });
    });
  } else {
    console.error("כפתור העתקה לא נמצא ב-popup.html");
    statusMessage.textContent = "שגיאה: כפתור העתקה לא נמצא.";
  }
});