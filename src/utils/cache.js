// أضف هذه الدالة في ملف utils/cache.js

export const clearOldCache = () => {
  const now = Date.now();
  const TTL = 24 * 60 * 60 * 1000; // 24 ساعة
  
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('secoss_comments_')) {
      try {
        const { timestamp } = JSON.parse(localStorage.getItem(key));
        if (now - timestamp > TTL) {
          localStorage.removeItem(key);
        }
      } catch { localStorage.removeItem(key); }
    }
  });
};

