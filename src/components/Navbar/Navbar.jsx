// src/components/Navbar/Navbar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaSignOutAlt, FaLanguage, FaSun, FaMoon } from 'react-icons/fa';

// === Imports مركزية ===
import { logout as reduxLogout } from '../../store/slices/userSlice';
import { getLocalizedText } from '../../utils/i18n-helpers';
import { getUserLanguage } from '../../utils/auth';
import { changeLanguage } from '../../i18n/config';

// === مكونات UI قابلة لإعادة الاستخدام ✅ مسارات صحيحة ===
import Avatar from '../ui/Avatar.jsx';
import ActionMenu from '../ui/ActionMenu.jsx';
import Button from '../ui//Button.jsx';

// === Theme Context ===
import { useTheme } from '../../context/ThemeContext';

// === التكوين المركزي ===
import { SITE_CONFIG } from '../../config/siteConfig';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isDark, toggleTheme } = useTheme();
  const { user, token } = useSelector((state) => state.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const currentLang = i18n.language || getUserLanguage() || 'ar';
  const isRTL = currentLang === 'ar';

  // === تأثير التمرير ===
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // === منع التمرير عند فتح قائمة الموبايل ===
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // === تبديل اللغة ===
  const toggleLanguage = useCallback(() => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    changeLanguage(newLang);
  }, [currentLang]);

  // === تسجيل الخروج ===
  const handleLogout = useCallback(() => {
    dispatch(reduxLogout());
    navigate('/login');
  }, [dispatch, navigate]);

  // === ✅ روابط التنقل - جميعها في مصفوفة واحدة ===
  const navPages = useMemo(() => 
    SITE_CONFIG?.navigation?.main?.map(item => ({
      label: t(`nav.${item.key}`) || item.key,
      to: item.path,
      icon: item.icon,
    })) || [
      { label: t('nav.home') || 'الرئيسية', to: '/', icon: '🏠' },
      { label: t('nav.conditions') || 'شروط العضوية', to: '/conditions', icon: '📋' },
      { label: t('nav.lecturers') || 'المحاضرون', to: '/lecturers', icon: '👨‍🏫' },
      { label: t('nav.board') || 'مجلس الإدارة', to: '/board', icon: '👥' },
      { label: t('nav.about') || 'حول', to: '/about', icon: 'ℹ️' },
      { label: t('nav.news') || 'الأخبار', to: '/news', icon: '📰' },
      { label: t('nav.lectures') || 'المحاضرات', to: '/lectures', icon: '🎓' },
    ],
  [t]);

  // === ✅ تقسيم الصفحات للعرض (سطح المكتب فقط) ===
  // const desktopPages = useMemo(() => navPages.slice(0, 4), [navPages]);
  // const dropdownPages = useMemo(() => navPages.slice(4), [navPages]);

  // === فئة الرابط النشط ===
  const getNavLinkClass = useCallback((isActive) => `
    px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200
    ${isActive 
      ? 'text-brand-primary bg-brand-light dark:bg-brand-primary/10 font-black' 
      : 'text-gray-600 dark:text-gray-300 hover:text-brand-primary hover:bg-gray-50 dark:hover:bg-gray-800'
    }
  `, []);

  // === ✅ إجراءات قائمة المستخدم ===
  const getUserMenuActions = useCallback(() => [
    {
      label: isDark ? (t('nav.lightMode') || 'الوضع الفاتح') : (t('nav.darkMode') || 'الوضع الداكن'),
      icon: isDark 
        ? <FaSun size={14} className="text-yellow-500" /> 
        : <FaMoon size={14} className="text-brand-primary" />,
      onClick: (e) => { e?.stopPropagation?.(); toggleTheme(); },
      closeOnClick: false,
    },
    {
      label: t('nav.toggleLanguage') || 'تبديل اللغة',
      badge: currentLang === 'ar' ? 'EN' : 'ع',
      icon: <FaLanguage size={14} className="text-brand-primary" />,
      onClick: (e) => { e?.stopPropagation?.(); toggleLanguage(); },
      closeOnClick: false,
    },
    { divider: true },
    {
      label: t('nav.profile') || 'بروفايلي',
      icon: '👤',
      onClick: () => navigate('/profile'),
      closeOnClick: true,
    },
    {
      label: t('nav.logout') || 'تسجيل خروج',
      icon: <FaSignOutAlt size={14} />,
      onClick: handleLogout,
      danger: true,
      closeOnClick: true,
    },
  ], [isDark, toggleTheme, toggleLanguage, currentLang, t, navigate, handleLogout]);

  return (
    <header 
      dir={isRTL ? 'rtl' : 'ltr'} 
      lang={currentLang}
      className={`
        sticky top-0 left-0 right-0 z-[100] transition-all duration-300 border-b
        ${scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-brand py-2' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-3'
        }
        ${isRTL ? 'font-arabic' : 'font-sans'}
      `}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
        
        {/* === الشعار من SITE_CONFIG ✅ === */}
        <NavLink to="/" className="flex items-center gap-3 group" aria-label={t('nav.home')}>
          <div className="relative">
            <img 
              src={SITE_CONFIG.identity.logo} 
              alt={SITE_CONFIG.identity.name[currentLang]} 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-brand-hover transition-transform group-hover:scale-105" 
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-secondary rounded-full border-2 border-white dark:border-gray-900" aria-hidden="true" />
          </div>
          <div className={`hidden sm:flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
            <strong className="font-black text-gray-900 dark:text-white text-sm leading-tight">
              {SITE_CONFIG.identity.name[currentLang]}
            </strong>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
              {SITE_CONFIG.identity.name[currentLang === 'ar' ? 'en' : 'ar']}
            </span>
          </div>
        </NavLink>

        {/* === روابط سطح المكتب === */}
        <nav className="hidden lg:flex items-center gap-1" role="navigation">
          {navPages.map((page) => (
            <NavLink key={page.to} to={page.to} className={({ isActive }) => getNavLinkClass(isActive)}>
              {page.label}
            </NavLink>
          ))}

        </nav>

        {/* === أدوات المستخدم === */}
        <div className="flex items-center gap-2">
          {token && user ? (
            <div className="hidden md:flex items-center gap-2">
              <Avatar 
                user={user}
                size="sm"
                showStatus={true}
                isOnline={true}
                showBadge={user?.role === 'ADMIN'}
                variant="gradient"
                tooltip={true}
                className="cursor-default"
              />
              <ActionMenu
                actions={getUserMenuActions()}
                triggerIcon={
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                }
                triggerClassName="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                menuPosition="right"
                menuAlign="top"
                tooltip={getLocalizedText(user?.name, currentLang)}
                menuClassName="min-w-56"
              />
            </div>
          ) : (
            <div className="hidden md:flex gap-2 items-center">
              <Button onClick={() => navigate('/login')} variant="ghost" className="text-sm font-bold px-4 py-2">
                {t('nav.login')}
              </Button>
              <Button onClick={() => navigate('/register')} variant="primary" className="text-sm font-bold px-4 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white">
                {t('nav.join')}
              </Button>
            </div>
          )}

          {/* زر الموبايل */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="lg:hidden p-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={menuOpen ? (t('common.close') || 'إغلاق') : (t('nav.toggleMenu') || 'القائمة')}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* === قائمة الموبايل ✅ تستخدم navPages مباشرة === */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              
              {/* ✅ جميع الروابط في الموبايل - بدون secondaryPages */}
              <nav className="space-y-1" role="navigation">
                {navPages.map((page) => (
                  <NavLink 
                    key={page.to} 
                    to={page.to} 
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-4 py-3 text-base font-bold rounded-xl transition-colors ${
                        isActive 
                          ? 'text-brand-primary bg-brand-light dark:bg-brand-primary/10' 
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    <span aria-hidden="true" className="text-lg">{page.icon}</span>
                    {page.label}
                  </NavLink>
                ))}
              </nav>
              
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />
              
              {/* حالة المستخدم + القائمة */}
              {token && user ? (
                <>
                  <div className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Avatar 
                      user={user}
                      size="md"
                      showStatus={true}
                      isOnline={true}
                      showBadge={user?.role === 'ADMIN'}
                      variant="gradient"
                    />
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="text-[10px] text-brand-primary font-black uppercase">{user.role}</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-40">
                        {getLocalizedText(user.name, currentLang)}
                      </p>
                    </div>
                  </div>
                  
                  <ActionMenu
                    actions={getUserMenuActions()}
                    triggerIcon={
                      <span className="text-sm font-bold text-brand-primary flex items-center gap-1">
                        ⚙️ {t('nav.settings') || 'الإعدادات'}
                      </span>
                    }
                    triggerClassName="w-full justify-center bg-brand-light/30 dark:bg-gray-700 hover:bg-brand-light/50 py-3"
                    menuPosition="center"
                    menuAlign="bottom"
                    menuClassName="min-w-56"
                  />
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => { navigate('/login'); setMenuOpen(false); }} variant="ghost" className="text-sm font-bold py-3">
                    {t('nav.login')}
                  </Button>
                  <Button onClick={() => { navigate('/register'); setMenuOpen(false); }} variant="primary" className="text-sm font-bold py-3 bg-brand-primary hover:bg-brand-primaryHover text-white">
                    {t('nav.join')}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;