// src/utils/contentTypes.js

import SITE_CONFIG from "../config/siteConfig";

/**
 * ✅ جلب الأنواع الرئيسية مع دمج المخصصة من التخزين المحلي
 * @param {string} contentType - 'lecture' أو 'news'
 * @param {string} currentLang - 'ar' أو 'en'
 */
export const getMainTypes = (contentType, currentLang = 'ar') => {
  const config = SITE_CONFIG.contentTypes?.[contentType];
  if (!config) return [];
  
  const baseTypes = config.mainCategories || config.mainTypes || [];
  
  // جلب الأنواع المخصصة من التخزين المحلي
  const customKey = config.customCategoriesKey || config.customMainTypesKey;
  const customTypes = JSON.parse(localStorage.getItem(customKey) || '[]');
  
  // دمج الأنواع الأساسية مع المخصصة
  return [...baseTypes, ...customTypes].map(type => ({
    ...type,
    label: typeof type.label === 'object' 
      ? (type.label[currentLang] || type.label.ar || type.label.en || type.id)
      : type.label,
  }));
};

/**
 * ✅ جلب الأنواع الفرعية لنوع رئيسي محدد
 * @param {string} mainTypeId - معرف النوع الرئيسي
 * @param {string} currentLang - 'ar' أو 'en'
 */
export const getSubTypes = (mainTypeId, currentLang = 'ar') => {
  const subTypesConfig = SITE_CONFIG.contentTypes?.news?.subTypes;
  if (!subTypesConfig || !subTypesConfig[mainTypeId]) return [];
  
  const baseSubTypes = subTypesConfig[mainTypeId] || [];
  
  // جلب الأنواع الفرعية المخصصة
  const customKey = SITE_CONFIG.contentTypes.news.customSubTypesKey;
  const customSubTypes = JSON.parse(localStorage.getItem(`${customKey}_${mainTypeId}`) || '[]');
  
  // دمج وتوطين
  return [...baseSubTypes, ...customSubTypes].map(type => ({
    ...type,
    label: typeof type.label === 'object'
      ? (type.label[currentLang] || type.label.ar || type.label.en || type.id)
      : type.label,
  }));
};

/**
 * ✅ إضافة نوع مخصص جديد
 * @param {string} contentType - 'lecture' أو 'news'
 * @param {string} mainTypeId - للنوع الفرعي فقط
 * @param {object} newType - { id, label: { ar, en }, editable: true }
 */
export const addCustomType = (contentType, newType, mainTypeId = null) => {
  const config = SITE_CONFIG.contentTypes?.[contentType];
  if (!config) return false;
  
  const customKey = mainTypeId 
    ? `${config.customSubTypesKey}_${mainTypeId}`
    : (config.customCategoriesKey || config.customMainTypesKey);
  
  const existing = JSON.parse(localStorage.getItem(customKey) || '[]');
  
  // التحقق من عدم التكرار
  if (existing.some(t => t.id === newType.id)) {
    return false;
  }
  
  // إضافة النوع الجديد
  localStorage.setItem(customKey, JSON.stringify([...existing, { ...newType, editable: true }]));
  return true;
};

/**
 * ✅ حذف نوع مخصص
 * @param {string} contentType - 'lecture' أو 'news'
 * @param {string} typeId - معرف النوع للحذف
 * @param {string} mainTypeId - للنوع الفرعي فقط
 */
export const removeCustomType = (contentType, typeId, mainTypeId = null) => {
  const config = SITE_CONFIG.contentTypes?.[contentType];
  if (!config) return false;
  
  const customKey = mainTypeId
    ? `${config.customSubTypesKey}_${mainTypeId}`
    : (config.customCategoriesKey || config.customMainTypesKey);
  
  const existing = JSON.parse(localStorage.getItem(customKey) || '[]');
  const filtered = existing.filter(t => t.id !== typeId);
  
  localStorage.setItem(customKey, JSON.stringify(filtered));
  return true;
};

/**
 * ✅ تحديث نوع مخصص
 * @param {string} contentType - 'lecture' أو 'news'
 * @param {string} typeId - معرف النوع للتحديث
 * @param {object} updates - الحقول المحدثة
 * @param {string} mainTypeId - للنوع الفرعي فقط
 */
export const updateCustomType = (contentType, typeId, updates, mainTypeId = null) => {
  const config = SITE_CONFIG.contentTypes?.[contentType];
  if (!config) return false;
  
  const customKey = mainTypeId
    ? `${config.customSubTypesKey}_${mainTypeId}`
    : (config.customCategoriesKey || config.customMainTypesKey);
  
  const existing = JSON.parse(localStorage.getItem(customKey) || '[]');
  const index = existing.findIndex(t => t.id === typeId);
  
  if (index === -1) return false;
  
  existing[index] = { ...existing[index], ...updates };
  localStorage.setItem(customKey, JSON.stringify(existing));
  return true;
};

export const normalizeNewsItem = (news) => {
  if (!news) return null;
  
  // دالة مساعدة لتطبيع حقل نصي
  const normalizeText = (val, defaultAr = '', defaultEn = '') => {
    if (!val) return { ar: defaultAr, en: defaultEn };
    if (typeof val === 'string') return { ar: val, en: val };
    if (typeof val === 'object') {
      return {
        ar: val.ar || val.en || defaultAr,
        en: val.en || val.ar || defaultEn,
      };
    }
    return { ar: String(val), en: String(val) };
  };
  
  return {
    ...news,
    // === نصوص ثنائية اللغة ===
    title: normalizeText(news?.title),
    description: normalizeText(news?.description),
    content: normalizeText(news?.content),
    authorName: normalizeText(news?.authorName, 'مستخدم', 'User'),
    type: normalizeText(news?.type, 'عام', 'General'),
    subType: news?.subType ? normalizeText(news.subType) : null,
    
    // === وسوم ثنائية اللغة ===
    tags: (news?.tags || []).map(tag => normalizeText(tag)),
    
    // === حقول أخرى مع قيم افتراضية ===
    id: news?.id || `news-${Date.now()}`,
    status: news?.status || 'APPROVED',
    year: news?.year || new Date().getFullYear(),
    date: news?.date || new Date().toISOString(),
    views: news?.views || 0,
    likes: news?.likes || 0,
    commentsCount: news?.commentsCount || 0,
    shares: news?.shares || 0,
    featured: news?.featured || false,
    image: news?.image || news?.attachmentUrl || null,
    createdAt: news?.createdAt || new Date().toISOString(),
    updatedAt: news?.updatedAt || new Date().toISOString(),
  };
};