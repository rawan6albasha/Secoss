// src/utils/theme-utils.js - للدوال فقط
// لا يحتوي على أنماط، فقط دوال مساعدة

// مثال: دالة للحصول على اسم الخط حسب اللغة
export const getFontClass = (lang = 'ar') => lang === 'ar' ? 'font-arabic' : 'font-sans';

// أو دوال للترجمة، التواريخ، إلخ
export { getLocalizedText, formatDate } from './i18n-helpers';