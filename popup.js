document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copy-content');
  const statusMessage = document.getElementById('status-message');
  const buttonText = copyButton.querySelector('.button-text');
  const buttonIcon = copyButton.querySelector('.button-icon');

  function updateStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + (isError ? 'status-error' : 'status-success');
  }

  function updateButton(isLoading) {
    copyButton.disabled = isLoading;
    buttonText.textContent = isLoading ? 'מעתיק כתבה...' : 'העתק כתבה';
    buttonIcon.textContent = isLoading ? '⏳' : '📋';
  }

  if (copyButton) {
    copyButton.addEventListener('click', () => {
      updateStatus('');
      updateButton(true);

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "copyContent" }, (response) => {
            if (chrome.runtime.lastError) {
              updateStatus("שגיאה: " + chrome.runtime.lastError.message, true);
            } else if (response && response.status === "success") {
              updateStatus("תוכן הכתבה הועתק בהצלחה!");
            } else {
              updateStatus("שגיאה בהעתקת הכתבה: " + (response ? response.message : "לא התקבלה תגובה"), true);
            }
            updateButton(false);
          });
        } else {
          updateStatus("לא נמצא טאב פעיל", true);
          updateButton(false);
        }
      });
    });
  } else {
    updateStatus("שגיאה: כפתור העתקה לא נמצא.", true);
  }
});