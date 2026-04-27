// src/components/ui/Breadcrumbs/Breadcrumbs.jsx
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { FaChevronLeft, FaHome } from 'react-icons/fa';

const Breadcrumbs = () => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';

  // === توليد عناصر الـ Breadcrumb ديناميكياً ===
  const generateBreadcrumbs = () => {
    const items = [{ 
      label: t('breadcrumbs.home'), 
      to: '/', 
      // icon: <FaHome size={12} /> 
    }];

    if (path === '/') return items;

    const pathParts = path.split('/').filter(Boolean);
    
    // حالة الصفحات التفصيلية
    if (path.startsWith('/lecture-detail')) {
      items.push({ label: t('nav.lectures'), to: '/lectures' });
      items.push({ label: t('breadcrumbs.lectureDetail'), to: path, active: true });
    } 
    else if (path.startsWith('/news-details')) {
      items.push({ label: t('nav.news'), to: '/news' });
      items.push({ label: t('breadcrumbs.newsDetail'), to: path, active: true });
    } 
    else {
      // الصفحات العادية
      pathParts.forEach((part, index) => {
        const fullPath = `/${pathParts.slice(0, index + 1).join('/')}`;
        const labelKey = `breadcrumbs.${part}`;
        const label = t(labelKey) !== labelKey ? t(labelKey) : part;
        
        items.push({
          label,
          to: fullPath,
          active: index === pathParts.length - 1,
        });
      });
    }

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  // عدم العرض في الصفحة الرئيسية
  if (path === '/' || breadcrumbs.length <= 1) return null;

  return (
    <nav 
      className={`
        rounded-3xl border p-4 sm:p-6 transition-colors duration-300
        ${isDark 
          ? 'bg-gray-800/60 border-gray-700 text-gray-300' 
          : 'bg-white/80 border-slate-200 text-slate-700'
        }
      `}
      aria-label={t('breadcrumbs.label')}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <ol className={`flex flex-wrap items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
        {breadcrumbs.map((item, index) => (
          <li key={item.to} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            
            {/* فاصل بين العناصر */}
            {index > 0 && (
              <span 
                className={`${isDark ? 'text-gray-500' : 'text-slate-400'} ${isRTL ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <FaChevronLeft size={10} />
              </span>
            )}
            
            {/* العنصر النشط أو الرابط */}
            {item.active ? (
              <span 
                className={`font-semibold flex items-center ${isDark ? 'text-white' : 'text-slate-900'}`}
                aria-current="page"
              >
                {item.icon && <span className="inline me-1">{item.icon}</span>}
                {item.label} 
              </span>
            ) : (
              <Link 
                to={item.to}
                className={`
                  font-medium transition-colors flex items-center
                  ${isDark 
                    ? 'text-gray-300 hover:text-brand-secondary' 
                    : 'text-slate-700 hover:text-brand-primary'
                  }
                `}
              >
                {<span className="inline me-1"></span>}
                {item.label} 
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;