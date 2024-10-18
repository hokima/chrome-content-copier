chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveSelector") {
    chrome.storage.sync.get('selectors', (data) => {
      const selectors = data.selectors || {};
      if (!selectors[request.url]) {
        selectors[request.url] = [];
      }
      selectors[request.url].push(request.selector);
      chrome.storage.sync.set({selectors: selectors}, () => {
        console.log("Selector saved for", request.url);
      });
    });
  }
});