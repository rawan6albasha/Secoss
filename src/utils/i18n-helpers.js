// src/utils/i18n-helpers.js
// ✅ دوال مساعدة مركزية للتعامل مع النصوص ثنائية اللغة

/**
 * جلب النص المناسب حسب اللغة الحالية
 * @param {string|object} value - النص أو الكائن {ar: '', en: ''}
 * @param {string} currentLang - اللغة الحالية (ar|en)
 * @param {string} fallbackLang - لغة الاحتياط
 * @returns {string} النص النهائي للعرض
 */

// src/utils/i18n-helpers.js

/**
 * ✅ دالة لجلب النص بلغة المستخدم مع fallback ذكي
 * @param {string|object} value - نص بسيط أو كائن {ar: '', en: ''}
 * @param {string} currentLang - اللغة الحالية 'ar' أو 'en'
 * @returns {string} النص المناسب للعرض
 */
// src/utils/i18n-helpers.js

/**
 * ✅ دالة آمنة لجلب النص بلغة المستخدم مع fallback ذكي
 * تتعامل مع: نصوص، كائنات {ar, en}, كائنات متداخلة، مصفوفات، قيم فارغة
 */
export const getLocalizedText = (value, currentLang = 'ar') => {
  // حالة الفراغ
  if (value == null) return '';
  
  // إذا كان نصاً بسيطاً
  if (typeof value === 'string') {
    return value.trim();
  }
  
  // إذا كان مصفوفة (نأخذ أول عنصر)
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    return getLocalizedText(value[0], currentLang);
  }
  
  // إذا كان كائناً
  if (typeof value === 'object') {
    // أولاً: جرب اللغة المطلوبة
    const primary = value[currentLang];
    if (primary != null) {
      if (typeof primary === 'string') return primary.trim();
      if (typeof primary === 'object') {
        // معالجة متداخلة: { ar: { ar, en }, en: { ar, en } }
        return getLocalizedText(primary, currentLang);
      }
      return String(primary).trim();
    }
    
    // ثانياً: Fallback للغة الأخرى
    const otherLang = currentLang === 'ar' ? 'en' : 'ar';
    const fallback = value[otherLang];
    if (fallback != null) {
      if (typeof fallback === 'string') return fallback.trim();
      if (typeof fallback === 'object') {
        return getLocalizedText(fallback, currentLang);
      }
      return String(fallback).trim();
    }
    
    // ثالثاً: جرب أي قيمة متوفرة في الكائن
    const anyVal = Object.values(value).find(v => v != null);
    if (anyVal != null) {
      if (typeof anyVal === 'string') return anyVal.trim();
      if (typeof anyVal === 'object') {
        return getLocalizedText(anyVal, currentLang);
      }
      return String(anyVal).trim();
    }
  }
  
  // حالة غير متوقعة: حوّل لأي شيء لنص
  return String(value).trim();
};

/**
 * ✅ دالة لعرض النص مع مؤشر اللغة (لأغراض التصحيح)
 */
export const getLocalizedTextWithLang = (value, currentLang = 'ar') => {
  if (value == null) return { text: '', lang: 'none' };
  
  if (typeof value === 'string') {
    return { text: value.trim(), lang: 'single' };
  }
  
  if (typeof value === 'object') {
    const ar = getLocalizedText(value?.ar, 'ar');
    const en = getLocalizedText(value?.en, 'en');
    
    if (currentLang === 'ar') {
      if (ar) return { text: ar, lang: 'ar' };
      if (en) return { text: en, lang: 'en-fallback' };
    } else {
      if (en) return { text: en, lang: 'en' };
      if (ar) return { text: ar, lang: 'ar-fallback' };
    }
    
    if (ar || en) return { text: ar || en, lang: 'both' };
  }
  
  return { text: String(value), lang: 'unknown' };
};

/**
 * ✅ دالة لدمج المحتوى الافتراضي مع المحتوى المعدل
 */
export const getMergedContent = (defaults, userContent = {}, currentLang = 'ar') => {
  // إذا كان المستخدم عدّل المحتوى، نستخدمه
  if (userContent && typeof userContent === 'object') {
    const userText = getLocalizedText(userContent, currentLang);
    if (userText) return userText;
  }
  
  // إذا لم يكن هناك محتوى مستخدم، نعود للقيم الافتراضية
  if (defaults && typeof defaults === 'object') {
    const defaultText = getLocalizedText(defaults, currentLang);
    if (defaultText) return defaultText;
  }
  
  return '';
};

/**
 * ✅ دالة للتحقق مما إذا كان المحتوى قد عُدّل من قبل المستخدم
 */
export const isContentEdited = (defaults, userContent) => {
  if (!userContent || !defaults) return false;
  return userContent.ar !== defaults?.ar || userContent.en !== defaults?.en;
};

/**
 * ✅ دوال الحفظ/الجلب من localStorage (للتجربة - استبدل بـ API في الإنتاج)
 */
export const saveEditedContent = (pageKey, section, newContent) => {
  try {
    const key = `editedContent_${pageKey}_${section}`;
    localStorage.setItem(key, JSON.stringify(newContent));
    return true;
  } catch (error) {
    console.error('Failed to save edited content:', error);
    return false;
  }
};

export const getEditedContent = (pageKey, section) => {
  try {
    const key = `editedContent_${pageKey}_${section}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get edited content:', error);
    return null;
  }
};

/**
 * ✅ دالة لعرض النص مع مؤشر اللغة (لأغراض التصحيح/العرض المتقدم)
 * @returns {object} { text: string, lang: 'ar'|'en'|'both' }
 */
// export const getLocalizedTextWithLang = (value, currentLang = "ar") => {
//   if (value === null || value === undefined) {
//     return { text: "", lang: "none" };
//   }

//   if (typeof value === "string") {
//     return { text: value, lang: "single" };
//   }

//   if (typeof value === "object") {
//     const ar = value.ar?.trim();
//     const en = value.en?.trim();

//     if (currentLang === "ar") {
//       if (ar) return { text: ar, lang: "ar" };
//       if (en) return { text: en, lang: "en-fallback" };
//     } else {
//       if (en) return { text: en, lang: "en" };
//       if (ar) return { text: ar, lang: "ar-fallback" };
//     }

//     if (ar || en) {
//       return { text: ar || en || "", lang: "both" };
//     }
//   }

//   return { text: String(value), lang: "unknown" };
// };

/**
 * هوك مخصص للاستخدام في المكونات
 * @returns {Function} دالة جاهزة لترجمة القيم
 */
export const useLocalizedText = () => {
  const { i18n } = require("react-i18next");
  const currentLang =
    i18n?.language || localStorage.getItem("i18nextLng") || "ar";

  return (value, fallbackLang = "ar") =>
    getLocalizedText(value, currentLang, fallbackLang);
};

/**
 * تنسيق التاريخ حسب اللغة
 */
// ✅ دالة آمنة لجلب أول حرف من نص متعدد اللغات
// src/utils/i18n-helpers.js - أضف هذه الدالة

/**
 * ✅ دالة آمنة لجلب أول حرف من نص (يدعم النصوص متعددة اللغات)
 * @param {string|object} value - النص أو الكائن {ar: '', en: ''}
 * @param {string} lang - اللغة الحالية (ar|en)
 * @returns {string} الحرف الأول أو الرمز الافتراضي
 */
export const getInitial = (value, lang = "ar") => {
  if (!value) return "👤";

  // إذا كان كائناً متعدد اللغات، استخرج النص المناسب
  const text =
    typeof value === "object"
      ? value[lang] || value.ar || value.en || Object.values(value)[0]
      : String(value);

  // ارجع الحرف الأول مع تحويل لأحرف كبيرة
  return text?.charAt(0)?.toUpperCase() || "👤";
};

/**
 * ✅ دالة مساعدة لعرض الاسم الكامل مع دعم اللغات
 */
export const getDisplayName = (value, lang = "ar") => {
  return getLocalizedText(value, lang) || "مستخدم";
};

export const formatDate = (dateString, lang = "ar") => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * تنسيق الوقت النسبي
 */
export const formatTimeAgo = (timestamp, t, lang = "ar") => {
  if (!timestamp) return "";
  const now = new Date();
  const then = new Date(timestamp);
  const diffMinutes = Math.floor((now - then) / (1000 * 60));

  if (diffMinutes < 1)
    return t?.("time.now") || (lang === "ar" ? "الآن" : "Now");
  if (diffMinutes < 60)
    return t?.("time.minutesAgo", { count: diffMinutes }) || `${diffMinutes}د`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24)
    return t?.("time.hoursAgo", { count: diffHours }) || `${diffHours}س`;

  const diffDays = Math.floor(diffHours / 24);
  return t?.("time.daysAgo", { count: diffDays }) || `${diffDays}ي`;
};

// في src/utils/i18n-helpers.js
export const renderSelectOptions = (options, currentLang = "ar") => {
  return (
    options?.map((opt, index) => {
      const value =
        typeof opt === "object"
          ? opt.id || opt.value || opt.key || JSON.stringify(opt)
          : String(opt);

      const label = getLocalizedText(opt, currentLang);

      return { value, label, key: `${value}-${index}` };
    }) || []
  );
};

// في src/utils/i18n-helpers.js
/**
 * تحويل مصفوفة نصوص أو كائنات إلى خيارات تدعم اللغتين
 * @param {Array} items - المصفوفة الأصلية
 * @param {Object} options - خيارات التحويل
 * @returns {Array} مصفوفة خيارات بصيغة {value, label: {ar, en}}
 */
export const toBilingualOptions = (
  items,
  { valueKey = "id", labelKey = "name", defaultEn = null } = {},
) => {
  return (
    items?.map((item) => {
      // إذا كان نصاً بسيطاً
      if (typeof item === "string" || typeof item === "number") {
        return {
          value: String(item),
          label: { ar: String(item), en: defaultEn || String(item) },
        };
      }

      // إذا كان كائناً
      if (typeof item === "object" && item !== null) {
        const value = item[valueKey] || item.id || item.value || String(item);
        const label = item[labelKey] || item.label || item.name || item;

        // إذا كان label بالفعل {ar, en}
        if (typeof label === "object" && label?.ar && label?.en) {
          return { value, label };
        }

        // إذا كان label نصاً واحداً
        return {
          value,
          label: { ar: String(label), en: defaultEn || String(label) },
        };
      }

      return {
        value: String(item),
        label: { ar: String(item), en: String(item) },
      };
    }) || []
  );
};


// export const getMergedContent = (defaults, userContent = {}, currentLang = 'ar') => {
//   // إذا كان المستخدم عدّل المحتوى، نستخدمه
//   if (userContent && typeof userContent === 'object') {
//     // أولاً: جرب اللغة المطلوبة من محتوى المستخدم
//     if (userContent[currentLang]?.trim()) {
//       return userContent[currentLang].trim();
//     }
//     // ثانياً: Fallback للغة الأخرى من محتوى المستخدم
//     const otherLang = currentLang === 'ar' ? 'en' : 'ar';
//     if (userContent[otherLang]?.trim()) {
//       return userContent[otherLang].trim();
//     }
//   }
  
//   // إذا لم يكن هناك محتوى مستخدم، نعود للقيم الافتراضية
//   if (defaults && typeof defaults === 'object') {
//     if (defaults[currentLang]?.trim()) {
//       return defaults[currentLang].trim();
//     }
//     const otherLang = currentLang === 'ar' ? 'en' : 'ar';
//     if (defaults[otherLang]?.trim()) {
//       return defaults[otherLang].trim();
//     }
//   }
  
//   return '';
// };

// export const isContentEdited = (defaults, userContent) => {
//   if (!userContent) return false;
//   return userContent.ar !== defaults?.ar || userContent.en !== defaults?.en;
// };

/**
 * ✅ دالة لحفظ محتوى معدل (للاستخدام مع API أو localStorage)
 */
// export const saveEditedContent = (pageKey, section, newContent) => {
//   // للتجربة: حفظ في localStorage
//   const key = `editedContent_${pageKey}_${section}`;
//   localStorage.setItem(key, JSON.stringify(newContent));
  
//   // للإنتاج: استبدل هذا باستدعاء API
//   // return api.updatePageContent({ pageKey, section, content: newContent });
// };

/**
 * ✅ دالة لجلب محتوى معدل (من localStorage أو API)
 */
// export const getEditedContent = (pageKey, section) => {
//   // للتجربة: جلب من localStorage
//   const key = `editedContent_${pageKey}_${section}`;
//   const stored = localStorage.getItem(key);
//   return stored ? JSON.parse(stored) : null;
  
//   // للإنتاج: استبدل هذا باستدعاء API
//   // return api.getPageContent({ pageKey, section });
// };

// تصدير شامل
export default {
  getLocalizedText,
  useLocalizedText,
  formatDate,
  formatTimeAgo,
  getInitial,
  renderSelectOptions,
  toBilingualOptions,
  getEditedContent,
  saveEditedContent, 
  isContentEdited, 
  getMergedContent,
};
