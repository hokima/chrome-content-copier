chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyContent") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: () => {
            return document.body.innerText;
          }
        }, (results) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({status: "error", message: "Failed to execute content script"});
          } else if (results && results[0]) {
            const textContent = results[0].result;
            navigator.clipboard.writeText(textContent).then(() => {
              sendResponse({status: "success", message: "התוכן הועתק בהצלחה"});
            }).catch(err => {
              sendResponse({status: "error", message: err.message});
            });
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