// src/store/slices/lecturesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { lectures as defaultLectures } from '../../data/lectures';

// === ثوابت ===
const STORAGE_KEY = 'secoss_lectures';

// === دوال آمنة للتعامل مع localStorage ===
const getStoredLectures = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultLectures;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultLectures;
  } catch (e) {
    console.warn('⚠️ Failed to load lectures from localStorage:', e);
    return defaultLectures;
  }
};

const saveToStorage = (lectures) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lectures));
  } catch (e) {
    console.warn('⚠️ Failed to save lectures:', e);
  }
};

// === الحالة الابتدائية ===
const initialState = {
  items: getStoredLectures(),
  status: 'idle',
  error: null,
  filters: {
    speaker: '',
    category: '',
    subCategory: '',
    year: '',
    search: '',
  },
};

// === إنشاء الـ Slice ===
const lecturesSlice = createSlice({
  name: 'lectures',
  initialState,
  
  reducers: {
    // ➕ إضافة محاضرة جديدة
    addLecture: (state, action) => {
      const payload = action.payload;
      
      const newLecture = {
        id: `lec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        authorId: payload.authorId || 'unknown',
        speaker: payload.speaker || 'مستخدم',
        
        // المحتوى المرن
        title: payload.title?.trim() || 'بدون عنوان',
        summary: payload.summary?.trim() || null,
        fullContent: payload.fullContent?.trim() || null,
        
        // الوسائط
        attachmentType: payload.attachmentType || null,
        attachmentUrl: payload.attachmentUrl || null,
        attachmentName: payload.attachmentName || null,
        fileSize: payload.fileSize || null,
        
        // التصنيفات
        category: payload.category || 'عام',
        subCategory: payload.subCategory || '',
        tags: Array.isArray(payload.tags) ? payload.tags : [],
        
        // الحالة والنظام
        status: 'PENDING',
        postType: payload.postType || 'LECTURE',
        rejectedReason: null,
        
        // التفاعل
        views: 0,
        likes: 0,
        commentsCount: 0,
        likedBy: [],
        
        // ✅ التعليقات: مصفوفة فارغة تُدار داخل المكون
        comments: [],
        commentsDisabled: false,
        
        // التواريخ
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      state.items = [newLecture, ...state.items];
      saveToStorage(state.items);
    },

    // ✏️ تحديث محتوى محاضرة
    updateLecture: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      
      if (index === -1) return;
      
      const current = state.items[index];
      
      // ✅ صلاحية التعديل: المالك فقط (وليس الأدمن) + الحالة المناسبة
      const canEdit = 
        current.authorId === updates.authorId && 
        ['PENDING', 'REJECTED'].includes(current.status);
      
      if (!canEdit) return;
      
      state.items[index] = {
        ...current,
        ...updates,
        // إذا كان مرفوضاً وتم تعديله، نعيده للمراجعة
        status: current.status === 'REJECTED' ? 'PENDING' : current.status,
        rejectedReason: null,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage(state.items);
    },

    // ✅❌ تحديث حالة المحاضرة (قبول/رفض) - للأدمن فقط
    updateLectureStatus: (state, action) => {
      const { id, status, rejectedReason } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      
      if (index === -1) return;
      
      state.items[index].status = status;
      state.items[index].rejectedReason = rejectedReason || null;
      state.items[index].updatedAt = new Date().toISOString();
      saveToStorage(state.items);
    },

    // 🔕 تفعيل/إيقاف التعليقات على منشور
    updateCommentsSettings: (state, action) => {
      const { id, commentsDisabled } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      
      if (index === -1) return;
      
      state.items[index].commentsDisabled = commentsDisabled;
      state.items[index].updatedAt = new Date().toISOString();
      saveToStorage(state.items);
    },

    // 🔄 استبدال القائمة كاملة
    setLectures: (state, action) => {
      const newList = Array.isArray(action.payload) ? action.payload : [];
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
        speaker: '',
        category: '',
        subCategory: '',
        year: '',
        search: '',
      };
    },
    
    // ❌ حذف محاضرة
    deleteLecture: (state, action) => {
      const id = action.payload;
      const before = state.items.length;
      state.items = state.items.filter(item => item.id !== id);
      if (state.items.length !== before) {
        saveToStorage(state.items);
      }
    },
    // في lecturesSlice.js - أكشن جديد لتحديث التعليقات
updatePostComments: (state, action) => {
  const { postId, comments } = action.payload;
  const index = state.items.findIndex(item => item.id === postId);
  if (index !== -1) {
    state.items[index].comments = comments;
    state.items[index].commentsCount = comments.length;
    state.items[index].updatedAt = new Date().toISOString();
    saveToStorage(state.items);
  }
},
  },
});

// ✅ تصدير الأكشنز والـ reducer
export const {
  addLecture,
  updateLecture,
  updateLectureStatus,
  updateCommentsSettings,
  setLectures,
  setFilter,
  clearFilters,
  deleteLecture,
  updatePostComments,
} = lecturesSlice.actions;

export default lecturesSlice.reducer;