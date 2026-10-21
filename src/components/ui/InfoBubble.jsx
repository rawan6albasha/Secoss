// src/components/ui/InfoBubble/InfoBubble.jsx
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { getLocalizedText } from '../../utils/i18n-helpers';
import EditableWrapper from './EditableWrapper';
import { FaTrash } from 'react-icons/fa';

const variantStyles = {
  primary: {
    light: "bg-white border-slate-100 hover:border-brand-secondary/30",
    dark: "border-gray-700 hover:border-brand-secondary/30",
  },
  accent: {
    light: "bg-brand-secondary/10 border-brand-secondary/20 hover:border-brand-secondary/40",
    dark: "border-gray-700 hover:border-brand-secondary/40",
  },
};

const InfoBubble = ({ 
  data, 
  isAdmin, 
  onUpdate, 
  onDelete, 
  variant = "primary",
  className = ""
}) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const currentLang = i18n.language || 'ar';

  // ✅ استخراج النصوص مع fallback
  const title = getLocalizedText(data?.title, currentLang);
  const content = (data?.content || []).map(item => getLocalizedText(item, currentLang));

  const themeClasses = variantStyles[variant]?.[isDark ? 'dark' : 'light'] || variantStyles.primary[isDark ? 'dark' : 'light'];

  return (
    <EditableWrapper 
      isAdmin={isAdmin} 
      onEdit={() => onUpdate?.(data?.id)}
      className={className}
      editButtonLabel="تعديل القسم"
    >
      <div className={`
        rounded-3xl p-6 sm:p-8 border transition-all duration-300 shadow-sm hover:shadow-cardHover
        ${themeClasses}
      `}>
        {/* العنوان === */}
        {title && (
          <h3 className={`
            mb-4 text-lg font-bold border-r-4 border-accent pr-4
            ${isDark ? 'text-white' : 'text-slate-900'}
          `}>
            {title}
          </h3>
        )}
        
        {/* المحتوى === */}
        <div className={`rounded-2xl p-5 ${isDark ? 'bg-gray-700/30' : 'bg-slate-50/50'}`}>
          <ul className={`
            ${data?.type === 'list-number' ? 'list-decimal' : 'list-disc'} 
            list-inside space-y-3 leading-relaxed
            ${isDark ? 'text-gray-300' : 'text-slate-700'}
          `}>
            {content.map((item, i) => (
              <li 
                key={i} 
                className={`
                  transition-colors
                  ${isDark ? 'hover:text-brand-secondary' : 'hover:text-brand-secondary'}
                `}
              >
                {item || '---'}
              </li>
            ))}
          </ul>
        </div>

        {/* زر الحذف للمشرفين === */}
        {isAdmin && onDelete && (
          <button 
            onClick={() => onDelete(data?.id)}
            className={`
              mt-4 text-xs font-bold transition-colors
              ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-400 hover:text-red-600'}
            `}
          >
            {t('about.deleteSection')}
          </button>
        )}
      </div>
    </EditableWrapper>
  );
};

export default InfoBubble;