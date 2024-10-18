console.log('Content script is loading...');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  
  if (request.action === "ping") {
    console.log('Ping received, sending response');
    sendResponse({status: "success", message: "Content script is active"});
    return true;
  }
  
  if (request.action === "copyContent") {
    try {
      const textContent = document.body.innerText;
      const textArea = document.createElement("textarea");
      textArea.value = textContent;
      document.body.appendChild(textArea);
      textArea.select();
      
      const success = document.execCommand('copy');
      
      document.body.removeChild(textArea);

      if (success) {
        console.log("Content copied successfully");
        sendResponse({ status: "success", message: "התוכן הועתק בהצלחה" });
      } else {
        console.error('Failed to copy content');
        sendResponse({ status: "error", message: "לא הצלחנו להעתיק את התוכן" });
      }
    } catch (err) {
      console.error('Error in content script:', err);
      sendResponse({ status: "error", message: err.message });
    }
    return true; // Indicates that the response will be sent asynchronously
  }
});

console.log('Content script loaded successfully');