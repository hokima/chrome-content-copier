// פונקציה לחילוץ תוכן הכתבה
function extractArticleContent() {
  const possibleSelectors = [
    'article',
    '.article-body',
    '.entry-content',
    '#content-main',
    '.post-content',
    '[itemprop="articleBody"]',
    '.story-body'
  ];

  let articleContent = null;

  for (const selector of possibleSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      articleContent = element;
      break;
    }
  }

  if (!articleContent) {
    articleContent = document.body;
  }

  const elementsToRemove = articleContent.querySelectorAll('script, style, nav, header, footer, .ads, .comments, .sidebar');
  elementsToRemove.forEach(el => el.remove());

  return articleContent.innerText.trim();
}

// פונקציה להצגת תצוגה מקדימה
function showPreview(content) {
  const preview = document.createElement('div');
  preview.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: white;
    border: 1px solid black;
    padding: 10px;
    z-index: 9999;
    max-width: 300px;
    max-height: 400px;
    overflow: auto;
  `;
  preview.innerHTML = `
    <h3>תוכן שזוהה:</h3>
    <div>${content.substring(0, 200)}...</div>
    <button id="approve">אשר</button>
    <button id="reject">דחה</button>
  `;
  document.body.appendChild(preview);
  
  document.getElementById('approve').addEventListener('click', () => {
    copyContent(content);
    preview.remove();
  });
  
  document.getElementById('reject').addEventListener('click', () => {
    preview.remove();
    offerManualSelection();
  });
}

// פונקציה להצעת בחירה ידנית
function offerManualSelection() {
  if (confirm('האם תרצה לבחור את התוכן להעתקה באופן ידני?')) {
    enableElementSelection();
  }
}

// פונקציה לאפשר בחירת אלמנט
function enableElementSelection() {
  document.body.style.cursor = 'crosshair';
  document.body.addEventListener('click', handleElementClick, true);
}

// טיפול בלחיצה על אלמנט
function handleElementClick(event) {
  event.preventDefault();
  event.stopPropagation();
  const element = event.target;
  const selector = generateSelector(element);
  document.body.style.cursor = 'default';
  document.body.removeEventListener('click', handleElementClick, true);
  showPreview(element.innerText);
  offerSaveSelector(selector);
}

// פונקציה ליצירת סלקטור
function generateSelector(element) {
  if (element.id) return '#' + element.id;
  if (element.className) return '.' + element.className.split(' ').join('.');
  return element.tagName.toLowerCase();
}

// פונקציה להעתקת תוכן
function copyContent(content) {
  navigator.clipboard.writeText(content).then(() => {
    console.log("התוכן הועתק בהצלחה");
    chrome.runtime.sendMessage({action: "copySuccess"});
  }).catch(err => {
    console.error("שגיאה בהעתקת התוכן:", err);
    chrome.runtime.sendMessage({action: "copyError", error: err.message});
  });
}

// פונקציה להצעת שמירת סלקטור
function offerSaveSelector(selector) {
  if (confirm('האם תרצה לשמור את הסלקטור הזה לשימוש עתידי באתר זה?')) {
    chrome.runtime.sendMessage({action: "saveSelector", selector: selector, url: window.location.hostname});
  }
}

// האזנה להודעות מה-popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyContent") {
    const content = extractArticleContent();
    if (content) {
      showPreview(content);
    } else {
      offerManualSelection();
    }
    return true; // לציון שהתגובה תישלח באופן אסינכרוני
  }
});