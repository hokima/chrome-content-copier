chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyContent") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: () => {
            const textContent = document.body.innerText;
            return navigator.clipboard.writeText(textContent)
              .then(() => ({ status: "success", message: "התוכן הועתק בהצלחה" }))
              .catch(err => ({ status: "error", message: err.message }));
          }
        }, (results) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({status: "error", message: "Failed to execute content script"});
          } else if (results && results[0] && results[0].result) {
            sendResponse(results[0].result);
          } else {
            sendResponse({status: "error", message: "Failed to get page content"});
          }
        });
      } else {
        sendResponse({status: "error", message: "No active tab"});
      }
    });
    return true;  // Will respond asynchronously
  }
});