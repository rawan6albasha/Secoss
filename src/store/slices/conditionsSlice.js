// src/store/slices/conditionsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { contractOne, contractTwo } from "../../assets/conditionsAffiliation";

// === ✅ دوال مساعدة لتطبيع المحتوى ثنائي اللغة ===

// لحقل نصي مفرد: { ar, en }
const normalizeLocalizedField = (value, defaultAr = '', defaultEn = '') => {
  if (value === null || value === undefined) {
    return { ar: defaultAr, en: defaultEn };
  }
  if (typeof value === 'string') {
    // إذا كان نصاً بسيطاً، نكرره للغتين
    return { ar: value, en: value };
  }
  if (typeof value === 'object' && value !== null) {
    // إذا كان كائناً، نضمن وجود كلا اللغتين مع fallback
    return {
      ar: value.ar || value.en || defaultAr,
      en: value.en || value.ar || defaultEn,
    };
  }
  return { ar: String(value), en: String(value) };
};

// لمصفوفة المحتوى: [{ ar, en }, ...]
const normalizeContentArray = (content) => {
  if (!Array.isArray(content)) return [];
  return content.map(item => normalizeLocalizedField(item));
};

// === الحالة الابتدائية ===
const initialState = {
  // === مصفوفة الصور للكاروسيل (مع دعم ثنائي اللغة لـ alt) ===
  carouselImages: [
    { 
      id: 'img-1', 
      imageUrl: contractOne, 
      alt: normalizeLocalizedField("عقد الجمعية 1", "عقد الجمعية 1", "Association Contract 1") 
    },
    { 
      id: 'img-2', 
      imageUrl: contractTwo, 
      alt: normalizeLocalizedField("عقد الجمعية 2", "عقد الجمعية 2", "Association Contract 2") 
    },
  ],
  
  // === مصفوفة المواد القانونية (مع دعم ثنائي اللغة) ===
  articles: [
    {
      id: 5,
      title: normalizeLocalizedField(
        "مادة 5 – تتألف الجمعية من أربعة أنواع من الأعضاء:",
        "مادة 5 – تتألف الجمعية من أربعة أنواع من الأعضاء:",
        "Article 5 – The Association consists of four types of members:"
      ),
      content: normalizeContentArray([
        "أ – أعضاء عاملون.",
        "ب – أعضاء مؤازرون.", 
        "ج – أعضاء شرف.",
        "د – أعضاء مراسلون."
      ]),
      type: "list-number",
    },
    // === يمكن إضافة المزيد من المواد هنا ===
  ],
  
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const conditionsSlice = createSlice({
  name: 'conditions',
  initialState,
  reducers: {
    // === === إدارة النصوص (المواد القانونية) === ===
    
    // إضافة مادة جديدة
    addArticle: (state, action) => {
      const payload = action.payload;
      state.articles.push({
        id: Date.now(),
        // ✅ تطبيع الحقول ثنائية اللغة تلقائياً
        title: normalizeLocalizedField(payload.title),
        content: normalizeContentArray(payload.content),
        type: payload.type || 'list-bullet',
      });
    },
    
    // تحديث مادة موجودة
    updateArticle: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.articles.findIndex(a => a.id === id);
      if (index !== -1) {
        state.articles[index] = {
          ...state.articles[index],
          // ✅ تطبيع الحقول المُحدَّثة فقط إذا وُجدت
          title: updatedData.title !== undefined 
            ? normalizeLocalizedField(updatedData.title) 
            : state.articles[index].title,
          content: updatedData.content !== undefined 
            ? normalizeContentArray(updatedData.content) 
            : state.articles[index].content,
          type: updatedData.type || state.articles[index].type,
        };
      }
    },
    
    // حذف مادة
    deleteArticle: (state, action) => {
      state.articles = state.articles.filter(a => a.id !== action.payload);
    },

    // === === إدارة صور الكاروسيل === ===
    
    // إضافة صورة جديدة
    addImage: (state, action) => {
      const payload = action.payload;
      
      // دعم تمرير كائن { imageUrl, alt } أو مجرد رابط
      const imageUrl = typeof payload === 'string' ? payload : payload.imageUrl;
      const altText = typeof payload === 'object' && payload.alt ? payload.alt : "صورة عقد";
      
      state.carouselImages.push({
        id: `img-${Date.now()}`,
        imageUrl: imageUrl,
        // ✅ تطبيع النص البديل ثنائي اللغة
        alt: normalizeLocalizedField(altText, "صورة عقد", "Contract Image"),
      });
    },
    
    // حذف صورة
    deleteImage: (state, action) => {
      state.carouselImages = state.carouselImages.filter(img => img.id !== action.payload);
    }
  }
});

export const { 
  addArticle, 
  updateArticle, 
  deleteArticle, 
  addImage, 
  deleteImage 
} = conditionsSlice.actions;

// ✅ تصدير الـ Reducer (مهم جداً لـ store)
export default conditionsSlice.reducer;