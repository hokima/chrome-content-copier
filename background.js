chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background script:', request);
  if (request.action === "copyContent") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "copyContent"}, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error in background script:', chrome.runtime.lastError);
            sendResponse({status: "error", message: "Failed to communicate with the page"});
          } else {
            console.log('Response from content script:', response);
            sendResponse(response);
          }
        });
      } else {
        console.error('No active tab found');
        sendResponse({status: "error", message: "No active tab"});
      }
    });
    return true;  // Will respond asynchronously
  }
});

console.log('Background script loaded');