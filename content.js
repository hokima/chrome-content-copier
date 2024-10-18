// הסרת כל האלמנטים שאינם נחוצים כגון פרסומות, סרטונים ותמונות
document.querySelectorAll('iframe, video, img, .ad, [class*="ad"]').forEach(e => e.remove());

// קבלת התוכן הטקסטואלי הנקי מהעמוד
const textContent = document.body.innerText;

// העתקת התוכן ללוח
navigator.clipboard.writeText(textContent).then(() => {
  alert("התוכן הועתק בהצלחה ל-Clipboard!");
}).catch(err => {
  console.error('שגיאה בהעתקת התוכן: ', err);
});
