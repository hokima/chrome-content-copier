chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyContent") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "copyContent"}, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({status: "error", message: "Failed to communicate with the page"});
          } else {
            sendResponse(response);
          }
        });
      } else {
        sendResponse({status: "error", message: "No active tab"});
      }
    });
    return true;  // Will respond asynchronously
  }
});