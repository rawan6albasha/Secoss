// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from './context/ThemeContext';

import store from './store/store';
import i18n, { changeLanguage } from './i18n/config'; // ✅ استيراد إعدادات i18n
import { AuthProvider } from './context/AuthContext';
import { THEME } from './config/theme';
import { clearOldCache } from './utils/cache';

import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// === تنظيف الكاش القديم عند بدء التطبيق ===
clearOldCache();

// === تطبيق إعدادات اللغة والخطوط ===
const applyThemeSettings = () => {
  const lang = localStorage.getItem('i18nextLng') || 'ar';
  changeLanguage(lang);
  
  // تطبيق الخط حسب اللغة
  document.documentElement.style.fontFamily = THEME.getFontFamily(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
};

applyThemeSettings();

// === عرض التطبيق ===
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter  >
    <Provider store={store}>
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </I18nextProvider>
      </ThemeProvider>
    </Provider>
    </BrowserRouter>
  </StrictMode>
);