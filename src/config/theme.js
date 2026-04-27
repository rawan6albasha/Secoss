// src/config/theme.js - مصدر واحد للألوان والخطوط والمسافات
// ✅ جميع الخصائص معرفة بشكل صحيح يمكن الوصول إليها بـ THEME.colors.background.paper

export const THEME = {
  // === الألوان ===
  colors: {
    // الألوان الأساسية
    primary: {
      main: '#3498db',
      light: '#5dade2',
      dark: '#2980b9',
      contrast: '#ffffff',
    },
    secondary: {
      main: '#2ecc71',
      light: '#55d98d',
      dark: '#27ae60',
      contrast: '#ffffff',
    },
    
    // ألوان الحالة
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db',
    
    // ألوان الخلفية والنص
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
      subtle: '#ecf0f1',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
      disabled: '#bdc3c7',
      inverse: '#ffffff',
    },
    
    // الحدود والظلال
    border: {
      light: '#e0e0e0',
      main: '#bdc3c7',
      dark: '#95a5a6',
    },
    // ✅ الظلال - محددة ككائن يمكن الوصول لخصائصه
    shadow: {
      sm: '0 1px 2px rgba(0,0,0,0.05)',
      md: '0 4px 6px -1px rgba(0,0,0,0.1)',
      lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
      xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
    },
  },
  
  // === الخطوط ===
  typography: {
    fontFamily: {
      ar: "'Tajawal', 'Cairo', 'Segoe UI', Tahoma, sans-serif",
      en: "'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  // === المسافات والحواف - ✅ مفاتيح رقمية كنصوص للوصول الآمن ===
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    px: '1px',
  },
  
  // === الزوايا والحدود ===
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // === الانتقالات ===
  transition: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  
  // === نقاط التوقف (Responsive) ===
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // === دوال مساعدة ===
  getFontFamily: (lang = 'ar') => {
    return lang === 'ar' 
      ? THEME.typography.fontFamily.ar 
      : THEME.typography.fontFamily.en;
  },
  
  getColor: (path, mode = 'main') => {
    const keys = path.split('.');
    let value = THEME.colors;
    for (const key of keys) {
      value = value?.[key];
      if (!value) return null;
    }
    return typeof value === 'object' ? value[mode] : value;
  },
  

  getFontFamily: (lang = 'ar') => 
    lang === 'ar' ? THEME.typography.fontFamily.ar : THEME.typography.fontFamily.en,
  
  // دوال وصول آمنة مع قيم افتراضية
  getSpacing: (key) => THEME.spacing?.[key] || '1rem',
  getRadius: (key) => THEME.borderRadius?.[key] || '0.25rem',
  getShadow: (key) => THEME.colors?.shadow?.[key] || 'none',

};

export default THEME;