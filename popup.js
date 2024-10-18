document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('copy-content').addEventListener('click', () => {
    console.log("לחיצה על כפתור העתקה"); // הודעת פלט לבדיקת הלחיצה על הכפתור

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "copyContent" }, (response) => {
        if (response && response.status === "success") {
          console.log("ההעתקה הושלמה בהצלחה");
        } else {
          console.error("שגיאה בהעתקה.");
        }
      });
    });
  });
});
