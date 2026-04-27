// src/components/ui/ThemeToggle/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ className = '', variant = 'button' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          p-2.5 rounded-xl transition-all duration-300
          text-gray-600 hover:text-brand-primary
          hover:bg-brand-light/50 dark:text-gray-300
          dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-brand-secondary/40
          ${className}
        `}
        title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <FaSun size={18} className="text-yellow-500" /> : <FaMoon size={18} />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl
        text-xs font-bold border border-gray-200 dark:border-gray-600
        text-gray-600 dark:text-gray-300
        hover:text-brand-primary hover:border-brand-secondary
        hover:bg-brand-light/50 dark:hover:bg-gray-700
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-brand-secondary/40
        ${className}
      `}
      title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <FaSun size={14} className="text-yellow-500" /> : <FaMoon size={14} />}
      <span className="hidden sm:inline">{isDark ? 'فاتح' : 'داكن'}</span>
    </button>
  );
};

export default ThemeToggle;