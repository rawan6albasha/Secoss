// src/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(SITE_CONFIG.themeSettings.storageKey);
    if (stored) return stored;
    
    if (SITE_CONFIG.themeSettings.defaultMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return SITE_CONFIG.themeSettings.defaultMode;
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDarkMode = theme === 'dark';
    
    setIsDark(isDarkMode);
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    if (SITE_CONFIG.themeSettings.allowToggle) {
      localStorage.setItem(SITE_CONFIG.themeSettings.storageKey, theme);
    }
    
    // تحديث لون شريط الحالة في الموبايل
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isDarkMode ? '#0F172A' : '#FFFFFF');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeMode = (mode) => {
    if (['light', 'dark', 'system'].includes(mode)) {
      setTheme(mode);
    }
  };

  const value = useMemo(() => ({
    theme,
    isDark,
    toggleTheme,
    setThemeMode,
    colors: SITE_CONFIG.theme.colors,
  }), [theme, isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;