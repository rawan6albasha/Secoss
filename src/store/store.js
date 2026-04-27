import { configureStore } from '@reduxjs/toolkit'
import lecturesReducer from './slices/lecturesSlice'
import newsReducer from './slices/newsSlice'
import boardReducer from './slices/boardSlice'
import userReducer from './slices/userSlice'
import aboutReducer from './slices/aboutSlice'
import conditionsReducer from './slices/conditionsSlice'

const store = configureStore({
  reducer: {
    lectures: lecturesReducer,
     news: newsReducer,
     board: boardReducer,
     user: userReducer,
     about: aboutReducer,
     conditions: conditionsReducer,

  },
  // ✅ إضافة هذا يمنع تحذيرات التطوير ويحسن الأداء
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
export default store
