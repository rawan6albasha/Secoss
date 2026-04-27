// src/components/ui/SearchInput/SearchInput.jsx
import { useTranslation } from 'react-i18next';
import { useTheme } from './../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder, 
  isDark: propIsDark,
  className = '',
  autoFocus = false,
  onClear,
}) => {
  const { t, i18n } = useTranslation();
  const { isDark: themeIsDark } = useTheme();
  const isDark = propIsDark ?? themeIsDark;
  
  const currentLang = i18n?.language || 'ar';
  const isRTL = currentLang === 'ar';

  const defaultPlaceholder = currentLang === 'ar' 
    ? 'ابحث عن محاضرة...' 
    : 'Search for a lecture...';
  
  const placeholderText = placeholder || defaultPlaceholder;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full max-w-md ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={currentLang}
    >
      {/* === أيقونة البحث === */}
      <span className={`
        absolute inset-y-0 flex items-center z-10
        ${isRTL ? 'right-4' : 'left-4'}
        ${isDark ? 'text-brand-secondary' : 'text-brand-primary'}
      `}>
        <FaSearch size={16} />
      </span>

      {/* === حقل الإدخال === */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholderText}
        autoFocus={autoFocus}
        dir={isRTL ? 'rtl' : 'ltr'}
        lang={currentLang}
        className={`
          w-full rounded-xl border pl-11 pr-11 py-3 text-sm font-medium outline-none transition-all duration-200
          ${isDark 
            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 focus:bg-gray-750' 
            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/40 focus:bg-white'
          }
          ${isRTL ? 'text-right' : 'text-left'}
          hover:border-brand-primary/50
        `}
        aria-label={placeholderText}
      />

      {/* === زر المسح === */}
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              onChange('');
              onClear?.();
            }}
            className={`
              absolute inset-y-0 flex items-center z-10 transition-colors
              ${isRTL ? 'left-4' : 'right-4'}
              ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}
              rounded-full p-1
            `}
            aria-label={t('common.clear') || 'مسح'}
            type="button"
          >
            <FaTimes size={14} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* === تلميح الاختصار === */}
      <span className={`
        absolute -bottom-6 text-[10px] hidden sm:block transition-colors
        ${isDark ? 'text-gray-500' : 'text-slate-400'}
        ${isRTL ? 'left-0' : 'right-0'}
      `}>
        {currentLang === 'ar' ? 'اضغط / للبحث السريع' : 'Press / to search'}
      </span>
    </motion.div>
  );
};

export default SearchInput;