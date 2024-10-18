function extractArticleContent() {
  // רשימת סלקטורים אפשריים לתוכן הכתבה
  const possibleSelectors = [
    'article',
    '.article-body',
    '.entry-content',
    '#content-main',
    '.post-content',
    '[itemprop="articleBody"]',
    '.story-body',
    // הוסף סלקטורים נוספים לפי הצורך
  ];

  let articleContent = null;

  // חיפוש תוכן הכתבה לפי הסלקטורים
  for (const selector of possibleSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      articleContent = element;
      break;
    }
  }

  // אם לא נמצא תוכן ספציפי, ננסה לזהות את הכתבה לפי מבנה הדף
  if (!articleContent) {
    articleContent = identifyArticleByStructure();
  }

  if (!articleContent) {
    console.error('לא הצלחנו לזהות את תוכן הכתבה');
    return null;
  }

  // ניקוי התוכן
  return cleanArticleContent(articleContent);
}

function identifyArticleByStructure() {
  // זיהוי הפסקה הארוכה ביותר בדף שאינה בתוך אלמנטים שאנחנו רוצים להתעלם מהם
  const paragraphs = Array.from(document.getElementsByTagName('p')).filter(p => {
    const parent = p.closest('nav, header, footer, .comments, .related-articles, .sidebar');
    return !parent;
  });

  if (paragraphs.length === 0) return null;

  const longestParagraph = paragraphs.reduce((longest, current) => 
    current.textContent.length > longest.textContent.length ? current : longest
  );

  // מציאת המכיל הקרוב ביותר שמכיל את הפסקה הארוכה ביותר
  let container = longestParagraph;
  while (container.parentElement && container.parentElement !== document.body) {
    container = container.parentElement;
    if (container.matches('article, .article, .post, .content')) break;
  }

  return container;
}

function cleanArticleContent(content) {
  // יצירת עותק של התוכן כדי לא לשנות את ה-DOM המקורי
  const cleanContent = content.cloneNode(true);

  // הסרת אלמנטים לא רצויים
  const elementsToRemove = cleanContent.querySelectorAll(
    'script, style, nav, header, footer, .ads, .comments, .sidebar, .related-articles, .article-footer'
  );
  elementsToRemove.forEach(el => el.remove());

  // הסרת קישורים לעמודים אחרים באתר
  const links = cleanContent.getElementsByTagName('a');
  for (let i = links.length - 1; i >= 0; i--) {
    const link = links[i];
    if (link.hostname === window.location.hostname && !link.hash) {
      link.replaceWith(...link.childNodes);
    }
  }

  // ניקוי רווחים מיותרים וקווים ריקים
  let text = cleanContent.innerText;
  text = text.replace(/(\r\n|\n|\r)/gm, "\n") // החלפת כל סוגי שבירות השורה ל-\n
           .replace(/\n\s*\n/g, "\n\n") // הסרת שורות ריקות מיותרות
           .replace(/^\s+|\s+$/g, ''); // הסרת רווחים בתחילת ובסוף הטקסט

  return text;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyContent") {
    try {
      console.log("התקבלה בקשה להעתקת תוכן הכתבה");

      const articleText = extractArticleContent();

      if (!articleText) {
        sendResponse({ status: "error", message: "לא הצלחנו לזהות את תוכן הכתבה" });
        return true;
      }

      // העתקת התוכן ללוח
      navigator.clipboard.writeText(articleText).then(() => {
        console.log("תוכן הכתבה הועתק בהצלחה ל-Clipboard");
        sendResponse({ status: "success", message: "תוכן הכתבה הועתק בהצלחה" });
      }).catch(err => {
        console.error('שגיאה בהעתקת תוכן הכתבה: ', err);
        sendResponse({ status: "error", message: err.message });
      });
    } catch (err) {
      console.error('שגיאה כללית בהעתקה: ', err);
      sendResponse({ status: "error", message: err.message });
    }

    return true; // כדי לציין שתגובה תשלח בצורה אסינכרונית
  }
});