document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copy-content');
  const statusMessage = document.getElementById('status-message');

  copyButton.addEventListener('click', () => {
    statusMessage.textContent = "מנסה להעתיק...";
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "copyContent"});
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const statusMessage = document.getElementById('status-message');
  if (request.action === "copySuccess") {
    statusMessage.textContent = "התוכן הועתק בהצלחה!";
  } else if (request.action === "copyError") {
    statusMessage.textContent = "שגיאה בהעתקה: " + request.error;
  }
});