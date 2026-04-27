// src/store/slices/aboutSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// === دوال مساعدة لتطبيع المحتوى ثنائي اللغة ===
const normalizeLocalizedField = (value) => {
  if (value === null || value === undefined) return { ar: '', en: '' };
  if (typeof value === 'string') return { ar: value, en: value };
  if (typeof value === 'object' && value !== null) {
    return {
      ar: value.ar || value.en || '',
      en: value.en || value.ar || '',
    };
  }
  return { ar: String(value), en: String(value) };
};

const normalizeContentArray = (content) => {
  if (!Array.isArray(content)) return [];
  return content.map(item => normalizeLocalizedField(item));
};

// === Async Thunk لجلب البيانات من API ===
export const fetchAboutData = createAsyncThunk(
  'about/fetchAboutData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/about');
      return response.data.sections || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'حدث خطأ في جلب البيانات');
    }
  }
);

// === الحالة الابتدائية ===
const initialState = {
  sections: [
    {
      id: 1,
      title: { ar: "مادة 3 – تهدف الجمعية إلى:", en: "Article 3 – The Association Aims To:" },
      content: normalizeContentArray([
        "النهوض بالأبحاث المتعلقة بالعلوم الاقتصادية.",
        "خدمة القضايا المتعلقة باقتصاديات الأقطار العربية.",
        "توثيق الروابط بين جميع العاملين في حقل العلوم الاقتصادية.",
        "النهوض بالمستوى العلمي والمهني للاقتصاديين."
      ]),
      type: "list-number",
    },
    {
      id: 2,
      title: { ar: "وللجمعية أن تستعمل في سبيل تحقيق أهدافها:", en: "The Association May Use To Achieve Its Goals:" },
      content: normalizeContentArray([
        "تنظيم محاضرات وندوات ومناقشات تتعلق بتلك العلوم.",
        "نشر المؤلفات والبحوث وإصدار المجلات الاقتصادية.",
        "إنشاء مكتبة ومراكز للأبحاث والدراسات الاقتصادية."
      ]),
      type: "list-bullet",
    }
  ],
  headerContent: {
    eyebrow: { ar: 'من نحن', en: 'About Us' },
    title: { ar: 'جمعية العلوم الاقتصادية السورية', en: 'Syrian Economic Sciences Association' },
    description: { 
      ar: 'صرح علمي تأسس عام 1965 ليجمع الكفاءات الاقتصادية ويقود قاطرة البحث العلمي في سورية.',
      en: 'A scientific institution founded in 1965 to gather economic expertise and lead scientific research in Syria.'
    },
  },
  status: 'idle',
  error: null
};

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    // === إضافة قسم جديد ===
    addSection: (state, action) => {
      const payload = action.payload;
      state.sections.push({
        id: Date.now(),
        title: normalizeLocalizedField(payload.title),
        content: normalizeContentArray(payload.content),
        type: payload.type || 'list-bullet',
        image: payload.image || null,
      });
    },

    // === تحديث قسم موجود ===
    updateSection: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.sections.findIndex(s => s.id === id);
      if (index !== -1) {
        state.sections[index] = {
          ...state.sections[index],
          title: updatedData.title !== undefined 
            ? normalizeLocalizedField(updatedData.title) 
            : state.sections[index].title,
          content: updatedData.content !== undefined 
            ? normalizeContentArray(updatedData.content) 
            : state.sections[index].content,
          type: updatedData.type || state.sections[index].type,
          image: updatedData.image !== undefined 
            ? updatedData.image 
            : state.sections[index].image,
        };
      }
    },

    // === حذف قسم ===
    deleteSection: (state, action) => {
      state.sections = state.sections.filter(s => s.id !== action.payload);
    },

    // === تحديث محتوى الهيدر ===
    updateHeaderContent: (state, action) => {
      state.headerContent = {
        ...state.headerContent,
        ...action.payload,
        eyebrow: action.payload.eyebrow !== undefined 
          ? normalizeLocalizedField(action.payload.eyebrow) 
          : state.headerContent.eyebrow,
        title: action.payload.title !== undefined 
          ? normalizeLocalizedField(action.payload.title) 
          : state.headerContent.title,
        description: action.payload.description !== undefined 
          ? normalizeLocalizedField(action.payload.description) 
          : state.headerContent.description,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAboutData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // تطبيع البيانات القادمة من API
        state.sections = (action.payload || []).map(section => ({
          ...section,
          title: normalizeLocalizedField(section.title),
          content: normalizeContentArray(section.content),
        }));
      })
      .addCase(fetchAboutData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { 
  addSection, 
  updateSection, 
  deleteSection, 
  updateHeaderContent 
} = aboutSlice.actions;

export default aboutSlice.reducer;