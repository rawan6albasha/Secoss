// src/store/slices/boardSlice.js
import { createSlice } from '@reduxjs/toolkit';

// ✅ الحالة الابتدائية - بيانات فقط
const initialState = {
  boards: [],        // مصفوفة المجالس
  loading: false,    // حالة التحميل
  error: null,       // حالة الأخطاء
};

// ✅ دالة مساعدة داخلية لتطبيع الحقول ثنائية اللغة
const normalizeLocalizedField = (value) => {
  if (value === null || value === undefined) return { ar: '', en: '' };
  if (typeof value === 'string') return { ar: value, en: value };
  if (typeof value === 'object') {
    return {
      ar: value.ar || value.en || '',
      en: value.en || value.ar || '',
    };
  }
  return { ar: String(value), en: String(value) };
};

// ✅ دالة لتطبيع عضو واحد (يدعم نص أو كائن)
const normalizeMember = (member) => {
  if (member === null || member === undefined) return { ar: '', en: '' };
  if (typeof member === 'string') return { ar: member, en: member };
  if (typeof member === 'object' && member !== null) {
    return {
      ar: member.ar || member.en || '',
      en: member.en || member.ar || '',
    };
  }
  return { ar: String(member), en: String(member) };
};

// ✅ دالة لتطبيع مصفوفة الأعضاء
const normalizeMembers = (members) => {
  if (!Array.isArray(members)) return [];
  return members.map(normalizeMember);
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    // === إضافة مجلس جديد ===
    addBoard: (state, action) => {
      const payload = action.payload;
      state.boards.unshift({
        id: Date.now(),
        // تطبيع الحقول ثنائية اللغة
        year: normalizeLocalizedField(payload.year),
        period: normalizeLocalizedField(payload.period),
        president: normalizeLocalizedField(payload.president),
        vicePresident: normalizeLocalizedField(payload.vicePresident),
        secretary: normalizeLocalizedField(payload.secretary),
        treasurer: normalizeLocalizedField(payload.treasurer),
    // ✅ معالجة الأعضاء ثنائي اللغة
    members: normalizeMembers(payload.members),
    images: Array.isArray(payload.images) ? payload.images : [],
    ...payload,  });
},
    // === تحديث مجلس موجود ===
    updateBoard: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.boards.findIndex((b) => b.id === id);
      if (index !== -1) {
        state.boards[index] = {
          ...state.boards[index],
          // تطبيع الحقول ثنائية اللغة عند التحديث
          year: updatedData.year !== undefined 
            ? normalizeLocalizedField(updatedData.year) 
            : state.boards[index].year,
          period: updatedData.period !== undefined 
            ? normalizeLocalizedField(updatedData.period) 
            : state.boards[index].period,
          president: updatedData.president !== undefined 
            ? normalizeLocalizedField(updatedData.president) 
            : state.boards[index].president,
          vicePresident: updatedData.vicePresident !== undefined 
            ? normalizeLocalizedField(updatedData.vicePresident) 
            : state.boards[index].vicePresident,
          secretary: updatedData.secretary !== undefined 
            ? normalizeLocalizedField(updatedData.secretary) 
            : state.boards[index].secretary,
          treasurer: updatedData.treasurer !== undefined 
            ? normalizeLocalizedField(updatedData.treasurer) 
            : state.boards[index].treasurer,
          images: updatedData.images !== undefined 
            ? (Array.isArray(updatedData.images) ? updatedData.images : []) 
            : state.boards[index].images,     // ✅ معالجة الأعضاء عند التحديث
      members: updatedData.members !== undefined ? normalizeMembers(updatedData.members) : state.boards[index].members,
      images: updatedData.images !== undefined ? (Array.isArray(updatedData.images) ? updatedData.images : []) : state.boards[index].images,
      ...updatedData,
    };
      }
    },

    // === حذف مجلس ===
    deleteBoard: (state, action) => {
      state.boards = state.boards.filter((b) => b.id !== action.payload);
    },

    // === تعيين المجالس (عند الجلب من API) ===
    setBoards: (state, action) => {
      // تطبيع البيانات القادمة من الخارج
      state.boards = (action.payload || []).map((board) => ({
        ...board,
        year: normalizeLocalizedField(board.year),
        period: normalizeLocalizedField(board.period),
        president: normalizeLocalizedField(board.president),
        vicePresident: normalizeLocalizedField(board.vicePresident),
        secretary: normalizeLocalizedField(board.secretary),
        treasurer: normalizeLocalizedField(board.treasurer),
        members: Array.isArray(board.members) ? board.members : [],
        images: Array.isArray(board.images) ? board.images : [],
      }));
      state.loading = false;
    },

    // === بدء التحميل ===
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // === تعيين خطأ ===
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
  },
});

export const {
  addBoard,
  updateBoard,
  deleteBoard,
  setBoards,
  setLoading,
  setError,
} = boardSlice.actions;

export default boardSlice.reducer;