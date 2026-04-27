// src/store/slices/newsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { newsData as defaultNews } from '../../data/news';
import { normalizeNewsItem } from '../../utils/contentTypes'; // ✅ دالة التطبيع

// === ثوابت ===
const STORAGE_KEY = 'secoss_news';

// === دوال آمنة للتعامل مع localStorage ===
const getStoredNews = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultNews.map(normalizeNewsItem);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeNewsItem) : defaultNews.map(normalizeNewsItem);
  } catch (e) {
    console.warn('⚠️ Failed to load news from localStorage:', e);
    return defaultNews.map(normalizeNewsItem);
  }
};

const saveToStorage = (news) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(news));
  } catch (e) {
    console.warn('⚠️ Failed to save news:', e);
  }
};

// === الحالة الابتدائية ===
const initialState = {
  items: getStoredNews(),
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' (للتوافق مع المكونات)
  error: null,
  filters: {
    type: '',
    year: '',
    search: '',
  },
};

// === إنشاء الـ Slice ===
const newsSlice = createSlice({
  name: 'news',
  initialState,
  
  reducers: {
    // ➕ إضافة خبر جديد
    addNews: (state, action) => {
      const payload = action.payload;
      
      // ✅ تطبيع البيانات لضمان الهيكلية الصحيحة
      const normalized = normalizeNewsItem({
        id: `news-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        authorId: payload.authorId || 'unknown',
        authorName: payload.authorName || 'مستخدم',
        
        // === المحتوى ثنائي اللغة ===
        title: payload.title?.ar?.trim() || payload.title?.en?.trim()
          ? { ar: payload.title?.ar?.trim() || '', en: payload.title?.en?.trim() || '' }
          : { ar: '', en: '' },
        description: payload.description?.ar?.trim() || payload.description?.en?.trim()
          ? { ar: payload.description?.ar?.trim() || '', en: payload.description?.en?.trim() || '' }
          : null,
        content: payload.content?.ar?.trim() || payload.content?.en?.trim()
          ? { ar: payload.content?.ar?.trim() || '', en: payload.content?.en?.trim() || '' }
          : null,
        
        // === الوسائط ===
        image: payload.image || payload.attachmentUrl || null,
        
        // === التصنيفات ===
        type: payload.type || 'عام',
        subType: payload.subType || null,
        year: payload.year || new Date().getFullYear(),
        
        // === الحالة والنظام ===
        status: payload.status || 'APPROVED', // ✅ الأخبار تُنشر فوراً للأدمن
        postType: 'NEWS',
        
        // === التفاعل ===
        views: 0,
        likes: 0,
        commentsCount: 0,
        shares: 0,
        featured: payload.featured || false,
        tags: Array.isArray(payload.tags) ? payload.tags : [],
        
        // === التواريخ ===
        date: payload.date || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // ✅ الإضافة في بداية القائمة لتظهر أولاً
      state.items = [normalized, ...state.items];
      saveToStorage(state.items);
    },

    // ✏️ تحديث خبر موجود
    updateNews: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      
      if (index === -1) return;
      
      const current = state.items[index];
      
      // ✅ صلاحية التعديل: المالك فقط + الحالة المناسبة
      const canEdit = 
        current.authorId === updates.authorId && 
        ['APPROVED', 'PENDING'].includes(current.status); // ✅ الأخبار قابلة للتعديل حتى بعد النشر
      
      if (!canEdit) return;
      
      // ✅ تطبيع التحديثات ثنائية اللغة
      const normalizedUpdates = {
        ...updates,
        title: updates.title ? normalizeNewsItem({ title: updates.title }).title : current.title,
        description: updates.description ? normalizeNewsItem({ description: updates.description }).description : current.description,
        content: updates.content ? normalizeNewsItem({ content: updates.content }).content : current.content,
        updatedAt: new Date().toISOString(),
      };
      
      state.items[index] = {
        ...current,
        ...normalizedUpdates,
      };
      
      saveToStorage(state.items);
    },

    // 🔄 تحديث حالة الخبر (للمشرفين)
    updateNewsStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      
      if (index === -1) return;
      
      state.items[index].status = status;
      state.items[index].updatedAt = new Date().toISOString();
      saveToStorage(state.items);
    },

    // 🔄 استبدال القائمة كاملة (لجلب البيانات من "السيرفر" لاحقاً)
    setNews: (state, action) => {
      const newList = Array.isArray(action.payload) ? action.payload.map(normalizeNewsItem) : [];
      state.items = newList;
      saveToStorage(newList);
    },

    // 🎛️ تحديث فلتر واحد
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      if (state.filters.hasOwnProperty(key)) {
        state.filters[key] = value;
      }
    },

    // 🗑️ مسح جميع الفلاتر
    clearFilters: (state) => {
      state.filters = {
        type: '',
        year: '',
        search: '',
      };
    },
    
    // ❌ حذف خبر
    deleteNews: (state, action) => {
      const id = action.payload;
      const before = state.items.length;
      state.items = state.items.filter(item => item.id !== id);
      if (state.items.length !== before) {
        saveToStorage(state.items);
      }
    },

    // 🔄 تحديث التفاعل (إعجاب، مشاهدة، إلخ)
    updateNewsInteraction: (state, action) => {
      const { id, field, value } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      
      if (index === -1) return;
      
      if (['views', 'likes', 'commentsCount', 'shares'].includes(field)) {
        state.items[index][field] = value;
        state.items[index].updatedAt = new Date().toISOString();
        saveToStorage(state.items);
      }
    },
  },
});

// ✅ تصدير الـ Actions والـ Reducer
export const {
  addNews,
  updateNews,
  updateNewsStatus,
  setNews,
  setFilter,
  clearFilters,
  deleteNews,
  updateNewsInteraction,
} = newsSlice.actions;

export default newsSlice.reducer;