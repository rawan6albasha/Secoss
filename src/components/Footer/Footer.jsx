// src/components/Footer/Footer.jsx
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp, FaChevronLeft } from 'react-icons/fa';

// === التكوين المركزي ===
import { SITE_CONFIG } from '../../config/siteConfig';
import { useTheme } from '../../context/ThemeContext';
import ShareButtons from '../ui/ShareButtons';

// === مكون فرعي لقسم الفوتر ===
const FooterSection = ({ title, children, delay = 0, isInView, isRTL }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className="space-y-4 "
  >
    <h3 className="font-bold text-lg text-white relative inline-block">
      {title}
      <span className={`
        absolute ${isRTL ? 'right-0' : 'left-0'} -bottom-2 
        w-12 h-0.5 bg-brand-secondary rounded-full
      `} />
    </h3>
    <div className={   isRTL ? 'text-right' : 'text-left'}>{children}</div>
  </motion.div>
);

// === مكون رابط الفوتر ===
const FooterLink = ({ label, path, navigate, delay, isInView, isRTL }) => (
  
  <motion.button
    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
    animate={isInView ? { opacity: 1, x: 0 } : {}}
    transition={{ delay, duration: 0.3 }}
    onClick={() => navigate(path)}
    className={`
      group flex items-center gap-2 text-sm text-gray-300 
      hover:text-brand-secondary transition-all duration-300
      ${isRTL ? '' : 'flex-row-reverse justify-end'}
      w-full
    `}
  >
  {console.log('isRTL=',isRTL)}
    <span className={`
      w-0 group-hover:w-2 h-0.5 bg-brand-secondary 
      transition-all duration-300 rounded-full
      ${isRTL ? 'order-last' : ''}
    `} />
    <span className={` flex-1 ${isRTL ? 'text-right' : 'text-left'} `}>{label}</span>
  </motion.button>
);

// === مكون عنصر التواصل ===
const ContactItem = ({ icon: Icon, label, href, delay, isInView, isRTL }) => (
  <motion.div
    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
    animate={isInView ? { opacity: 1, x: 0 } : {}}
    transition={{ delay, duration: 0.3 }}
    className={`
      group flex items-center gap-3 text-sm text-gray-300
      hover:text-brand-secondary transition-all duration-300
      
    `}
  >
    <span className="
      w-10 h-10 rounded-xl bg-white/5 
      group-hover:bg-brand-secondary/20
      flex items-center justify-center 
      
      transition-all duration-300 flex-shrink-0
      border border-white/10 group-hover:border-brand-secondary/30
    ">
      <Icon size={16} className="text-brand-secondary" />
    </span>
    {href ? (
      <a href={href} className="hover:underline flex-1">
        {label}
      </a>
    ) : (
      <span className="flex-1">{label}</span>
    )}
  </motion.div>
);

const Footer = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });
  
  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';

  // === استخراج بيانات الفوتر ===
  const footerSections = useMemo(() => ({
    about: SITE_CONFIG.footer.sections?.find(s => s.id === 'about'),
    quickLinks: SITE_CONFIG.footer.sections?.find(s => s.id === 'quick-links'),
    contact: SITE_CONFIG.footer.sections?.find(s => s.id === 'contact'),
  }), [SITE_CONFIG.footer.sections]);

  // === إظهار زر الصعود للأعلى ===
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // === الاشتراك في النشرة ===
  const handleSubscribe = useCallback(async (e) => {
    e.preventDefault();
    if (!email?.includes('@')) return;
    await new Promise(resolve => setTimeout(resolve, 800));
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  }, [email]);

  // === الصعود للأعلى ===
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <footer
      ref={footerRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={currentLang}
      className={`
        relative mt-20 
        ${isDark 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' 
          : 'bg-gradient-to-br from-slate-900 via-brand-primary to-slate-900'
        }
        text-white overflow-hidden
      `}
    >
      {/* 🌊 موجة علوية */}
      <div className="absolute -top-1 w-full overflow-hidden leading-[0] rotate-180 pointer-events-none">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          aria-hidden="true"
        >
          <path
            d="M0,0V46.29c47.2,22,103.47,26.32,158,17.81C257.23,55.22,321,34.88,383,17.57c63-17.71,125-34.32,189-26.43C688,2.38,751,24.22,814,43.12c63,19,126,31.09,189,14.11C1034,42,1097,5,1200,0V0Z"
            fill={isDark ? '#1e293b' : '#1E40AF'}
          />
        </svg>
      </div>

      {/* === المحتوى الرئيسي === */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-10 lg:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* === عن الجمعية === */}
          {footerSections.about && (
            <FooterSection title={t(footerSections.about.titleKey)} delay={0} isInView={isInView} isRTL={isRTL}>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                {t(footerSections.about.contentKey)}
              </p>
              
              {/* الشعار */}
              <div className={`flex items-center gap-3 pt-4 border-t border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <img 
                  src={SITE_CONFIG.identity.logo} 
                  alt={SITE_CONFIG.identity.name[currentLang]}
                  className="w-12 h-12 rounded-xl shadow-lg ring-2 ring-white/20"
                />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <span className="text-base font-bold block">
                    {SITE_CONFIG.identity.name[currentLang]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {SITE_CONFIG.identity.shortName[currentLang]}
                  </span>
                </div>
              </div>
            </FooterSection>
          )}

          {/* === روابط سريعة === */}
          {footerSections.quickLinks && (
            <FooterSection title={t(footerSections.quickLinks.titleKey)} delay={0.1} isInView={isInView} isRTL={isRTL}>
              <nav className="space-y-3" aria-label="روابط الفوتر">
                {footerSections.quickLinks.links.map((link, i) => (
                  <FooterLink
                    key={link.path}
                    label={t(link.key)}
                    path={link.path}
                    navigate={navigate}
                    delay={0.1 + (i * 0.05)}
                    isInView={isInView}
                    isRTL={isRTL}
                  />
                ))}
              </nav>
            </FooterSection>
          )}

          {/* === تواصل معنا === */}
          {footerSections.contact && (
            <FooterSection title={t(footerSections.contact.titleKey)} delay={0.2} isInView={isInView} isRTL={isRTL}>
              <address className="space-y-4 not-italic">
                {footerSections.contact.items.map((item, i) => {
                  const icons = {
                    email: FaEnvelope,
                    phone: FaPhone,
                    address: FaMapMarkerAlt,
                  };
                  const Icon = icons[item.type];
                  
                  return (
                    <ContactItem
                      key={item.type}
                      icon={Icon}
                      label={item.value}
                      href={item.type === 'email' ? `mailto:${item.value}` : item.type === 'phone' ? `tel:${item.value}` : null}
                      delay={0.2 + (i * 0.05)}
                      isInView={isInView}
                      isRTL={isRTL}
                    />
                  );
                })}
              </address>
            </FooterSection>
          )}

          {/* === النشرة البريدية + التواصل الاجتماعي === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-6"
          >
            {/* النشرة البريدية */}
            <div className={`
              p-5 rounded-2xl 
              ${isDark ? 'bg-white/5' : 'bg-white/10'} 
              backdrop-blur-sm border border-white/10
            `}>
              <h3 className="font-bold text-lg text-white mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-secondary/20 flex items-center justify-center">
                  <FaEnvelope className="text-brand-secondary" size={14} />
                </span>
                {t(SITE_CONFIG.footer.newsletter.titleKey)}
              </h3>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                {t(SITE_CONFIG.footer.newsletter.descriptionKey)}
              </p>
              
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t(SITE_CONFIG.footer.newsletter.placeholderKey)}
                    disabled={subscribed}
                    className={`
                      w-full px-4 py-3 rounded-xl text-sm
                      ${isDark ? 'bg-gray-800/50' : 'bg-black/20'} 
                      border border-white/20 
                      text-white placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-brand-secondary/50
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                      ${isRTL ? 'text-right' : 'text-left'}
                    `}
                    aria-label={t(SITE_CONFIG.footer.newsletter.placeholderKey)}
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={subscribed || !email}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full px-5 py-3 rounded-xl text-sm font-bold
                    bg-gradient-to-r from-brand-secondary to-brand-secondaryHover
                    text-white shadow-lg shadow-brand-secondary/25
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                  `}
                >
                  {subscribed ? (
                    <>
                      <span>✅</span>
                      <span>{t(SITE_CONFIG.footer.newsletter.successMessage)}</span>
                    </>
                  ) : (
                    <>
                      <span>{t(SITE_CONFIG.footer.newsletter.buttonKey)}</span>
                      <FaChevronLeft className={isRTL ? 'rotate-180' : ''} size={14} />
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* وسائل التواصل الاجتماعي */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <span>{t('footer.followUs') || 'تابعنا'}</span>
                <span className="w-8 h-0.5 bg-brand-secondary rounded-full" />
              </h4>
              <ShareButtons
                mode="profile"
                variant="horizontal"
                socialLinks={SITE_CONFIG.footer.social}
                iconSize={18}
                className={isRTL ? 'justify-start' : 'justify-start'}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* === الشريط السفلي === */}
      <div className={`
        relative border-t ${isDark ? 'border-gray-800' : 'border-white/10'}
        ${isRTL ? 'text-right' : 'text-left'}
      `}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* الحقوق */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-400 text-center lg:text-right"
            >
              {t(SITE_CONFIG.footer.copyright.textKey, {
                year: SITE_CONFIG.footer.copyright.startYear + 2,
                org: t(SITE_CONFIG.footer.copyright.organizationKey)
              })}
            </motion.p>

            {/* روابط إضافية */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className={`flex items-center gap-6 text-sm text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <button 
                onClick={() => navigate('/privacy')}
                className="hover:text-brand-secondary transition-colors"
              >
                {t('footer.privacy') || 'الخصوصية'}
              </button>
              <span className="w-1 h-1 rounded-full bg-gray-600" aria-hidden="true" />
              <button 
                onClick={() => navigate('/terms')}
                className="hover:text-brand-secondary transition-colors"
              >
                {t('footer.terms') || 'الشروط'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* === زر الصعود للأعلى === */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className={`
              fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'}
              w-14 h-14 rounded-full 
              bg-gradient-to-r from-brand-secondary to-brand-secondaryHover
              text-white shadow-xl shadow-brand-secondary/30
              flex items-center justify-center
              z-50 focus:outline-none focus:ring-4 focus:ring-brand-secondary/30
            `}
            aria-label={t('common.scrollToTop') || 'الصعود للأعلى'}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;