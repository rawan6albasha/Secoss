// src/components/ui/LanguageToggle/LanguageToggle.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaLanguage } from 'react-icons/fa';
import { SITE_CONFIG } from '../../../config/siteConfig';

const LanguageToggle = ({ variant = 'button', className = '' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || SITE_CONFIG.languages.default;
  
  const toggleLanguage = () => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const otherLang = SITE_CONFIG.languages.labels[currentLang === 'ar' ? 'en' : 'ar'];

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleLanguage}
        className={`
          p-2.5 rounded-xl transition-all duration-200
          text-gray-600 hover:text-brand-primary 
          hover:bg-brand-light/50 dark:text-gray-300 
          dark:hover:bg-gray-700 focus:outline-none focus:ring-2 
          focus:ring-brand-secondary/40
          ${className}
        `}
        title={otherLang.name}
        aria-label={`Switch to ${otherLang.name}`}
      >
        <FaLanguage size={18} className="text-brand-primary" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`
        flex items-center gap-1.5 px-3 py-2 rounded-xl
        text-xs font-bold border border-gray-200 dark:border-gray-600
        text-gray-600 dark:text-gray-300
        hover:text-brand-primary hover:border-brand-secondary
        hover:bg-brand-light/50 dark:hover:bg-gray-700
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-brand-secondary/40
        ${className}
      `}
      title={otherLang.name}
      aria-label={`Switch to ${otherLang.name}`}
    >
      <FaLanguage size={12} className="text-brand-primary" />
      <span className="hidden sm:inline font-mono">{otherLang.code}</span>
    </button>
  );
};

export default LanguageToggle;