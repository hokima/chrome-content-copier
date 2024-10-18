document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copy-content');
  const statusMessage = document.getElementById('status-message');

  function updateStatus(message, isError = false) {
    console.log(`Status update: ${message}`);
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? 'red' : 'black';
  }

  function handleCopyRequest() {
    updateStatus("מנסה להעתיק...");
    copyButton.disabled = true;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        updateStatus("לא נמצא טאב פעיל", true);
        copyButton.disabled = false;
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, { action: "copyContent" }, (response) => {
        console.log('Response received:', response);
        if (chrome.runtime.lastError) {
          console.error('Runtime error:', chrome.runtime.lastError);
          updateStatus(`שגיאה: ${chrome.runtime.lastError.message}`, true);
        } else if (response && response.status === "success") {
          updateStatus("התוכן הועתק בהצלחה!");
        } else {
          updateStatus(`שגיאה בהעתקה: ${response && response.message ? response.message : "לא התקבלה תגובה"}`, true);
        }
        copyButton.disabled = false;
      });
    });
  }

  if (copyButton) {
    copyButton.addEventListener('click', handleCopyRequest);
    console.log('Copy button event listener added');
  } else {
    console.error('Copy button not found in popup.html');
    updateStatus("שגיאה: כפתור העתקה לא נמצא.", true);
  }

  // Check if the content script is loaded
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "ping" }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn('Content script might not be loaded:', chrome.runtime.lastError);
          updateStatus("אזהרה: ייתכן שהתוסף לא נטען כראוי. נסה לרענן את הדף.", true);
        } else {
          console.log('Content script is loaded and responsive');
        }
      });
    }
  });
});

console.log('Popup script loaded');

