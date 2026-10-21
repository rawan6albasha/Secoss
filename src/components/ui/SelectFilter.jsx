// src/components/ui/SelectFilter/SelectFilter.jsx
import { useTranslation } from 'react-i18next';
import { useTheme } from './../../context/ThemeContext';
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

// === أدوات مركزية ===
import { getLocalizedText } from './../../utils/i18n-helpers';

const SelectFilter = ({
  label,
  options = [],
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  isDark: propIsDark,
}) => {
  const { t, i18n } = useTranslation();
  const { isDark: themeIsDark } = useTheme();
  const isDark = propIsDark ?? themeIsDark;
  
  const currentLang = i18n?.language || 'ar';
  const isRTL = currentLang === 'ar';

  // === دالة آمنة لاستخراج نص ===
  const toText = (val, fallback = '') => {
    if (val == null) return fallback;
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') {
      if (val[currentLang]) return String(val[currentLang]);
      const other = currentLang === 'ar' ? 'en' : 'ar';
      if (val[other]) return String(val[other]);
      const first = Object.values(val).find(v => v != null);
      return first != null ? String(first) : fallback;
    }
    return String(val);
  };

  const getVal = (opt) => {
    if (opt == null) return '';
    if (typeof opt === 'string' || typeof opt === 'number') return String(opt);
    if (typeof opt === 'object') {
      return String(opt.value ?? opt.id ?? opt.key ?? toText(opt));
    }
    return String(opt);
  };

  const getLbl = (opt) => {
    if (opt?.label) return toText(opt.label);
    return toText(opt);
  };

  const labelStr = toText(label);
  const placeholderStr = toText(placeholder) || (currentLang === 'ar' ? 'اختر...' : 'Select...');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col gap-1.5 ${isRTL ? 'rtl' : 'ltr'} ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={currentLang}
    >
      {/* === تسمية الحقل === */}
      {label && (
        <label className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-gray-300' : 'text-slate-500'}`}>
          {labelStr}
        </label>
      )}

      {/* === حاوية الـ Select === */}
      <div className="relative group">
        <motion.select
          whileFocus={{ scale: 1.01 }}
          value={value ?? ''}
          onChange={(e) => {
            if (!disabled) {
              onChange(e.target.value);
            }
          }}
          disabled={disabled}
          dir={isRTL ? 'rtl' : 'ltr'}
          className={`
            w-full px-4 py-3 pr-11 rounded-xl text-sm font-medium outline-none transition-all duration-200 cursor-pointer appearance-none
            ${isDark 
              ? 'bg-gray-800 border-gray-600 text-white focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 hover:bg-gray-750 hover:border-gray-500' 
              : 'bg-white border-slate-300 text-slate-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/40 hover:bg-slate-50 hover:border-slate-400'
            }
            ${disabled 
              ? (isDark ? 'bg-gray-800/50 text-gray-500 border-gray-700 cursor-not-allowed' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed') 
              : ''
            }
            ${isRTL ? 'text-right' : 'text-left'}
          `}
          aria-label={labelStr}
        >
          {/* خيار الافتراضي === */}
          <option value="" className={isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-slate-400'} disabled>
            {placeholderStr}
          </option>
          
          {/* الخيارات === */}
          {options?.map((opt, idx) => {
            const v = getVal(opt);
            const l = getLbl(opt);
            const isSelected = String(v) === String(value);
            return (
              <option 
                key={`${v}-${idx}`} 
                value={String(v)}
                className={`
                  ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-slate-900'}
                  ${isSelected ? (isDark ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-brand-primary/10 text-brand-primary') : ''}
                `}
              >
                {String(l)}
              </option>
            );
          })}
        </motion.select>
        
        {/* === أيقونة السهم === */}
        <div className={`
          absolute inset-y-0 flex items-center pointer-events-none z-10 transition-colors
          ${isRTL ? 'left-4' : 'right-4'}
          ${disabled 
            ? (isDark ? 'text-gray-600' : 'text-slate-300') 
            : (isDark ? 'text-brand-secondary group-hover:text-brand-secondaryHover' : 'text-brand-primary group-hover:text-brand-primaryHover')
          }
        `}>
          <FaChevronDown size={14} className={`transition-transform duration-200 ${disabled ? '' : 'group-hover:rotate-180'}`} />
        </div>

      </div>
    </motion.div>
  );
};

export default SelectFilter;