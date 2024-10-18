document.addEventListener('DOMContentLoaded', () => {
  // מאזין ללחיצה על הכפתור
  document.getElementById('copy-content').addEventListener('click', () => {
    // שליחת הודעה ל-content script כדי להפעיל את פונקציית ההעתקה
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "copyContent" }, (response) => {
        if (response && response.status === "success") {
          // הצגת הודעה על הצלחה
          alert("התוכן הועתק בהצלחה ל-Clipboard!");
        } else {
          console.error("שגיאה בהעתקה.");
        }
      });
    });
  });
});
