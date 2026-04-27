// src/pages/Register/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaLock, FaEnvelope, FaUser, FaCheck, FaExclamationTriangle, FaEye } from 'react-icons/fa';
import Logo from './../../assets/logo1.png';

const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';

  const handleRegister = async (e) => {
    e.preventDefault();
    clearError();
    
    // تحقق محلي من صحة البيانات
    if (formData.password !== formData.confirmPassword) {
      alert(t('register.errors.passwordMismatch'));
      return;
    }
    if (formData.password.length < 6) {
      alert(t('register.errors.passwordTooShort'));
      return;
    }
    if (!formData.name.trim()) {
      alert(t('register.errors.nameRequired'));
      return;
    }
    if (!agreeTerms) {
      alert(t('register.errors.termsRequired'));
      return;
    }
    
    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password
    });
    
    if (result.success) {
      setTimeout(() => {
        navigate('/profile', { 
          replace: true,
          state: { welcome: true }
        });
      }, 100);
    }
  };

  // === أنيميشن الدخول ===
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <section 
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={currentLang}
      className={`
        flex min-h-[90vh] items-center justify-center py-8 px-4 transition-colors duration-300
        ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-brand-primary/5'}
      `}
    >
      {/* زر تبديل الثيم === */}
      <button
        onClick={toggleTheme}
        className={`
          fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50
          p-3 rounded-xl transition-all duration-200
          ${isDark 
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
            : 'bg-white text-slate-600 hover:bg-slate-100 shadow-lg'
          }
        `}
        aria-label={isDark ? t('nav.lightMode') : t('nav.darkMode')}
      >
        {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
      </button>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`
          w-full max-w-md rounded-[2.5rem] border p-8 sm:p-10 shadow-xl space-y-6
          ${isDark 
            ? 'bg-gray-800/60 border-gray-700 backdrop-blur-sm' 
            : 'bg-white/80 border-slate-100 backdrop-blur-sm'
          }
        `}
      >
        
        {/* === Header === */}
        <div className="text-center space-y-2">
          <motion.img 
            src={Logo} 
            alt={t('identity.name')} 
            className="h-14 sm:h-16 mx-auto drop-shadow-lg"
            whileHover={{ scale: 1.05 }}
          />
          <h1 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {t('register.title')}
          </h1>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            {t('register.subtitle')}
          </p>
        </div>

        {/* === عرض رسالة الخطأ === */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`
              p-3 rounded-xl text-sm font-bold flex items-center gap-2
              ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}
            `}
          >
            <FaExclamationTriangle size={14} /> {error}
          </motion.div>
        )}

        {/* === نموذج التسجيل === */}
        <form className="space-y-4" onSubmit={handleRegister}>
          
          {/* الاسم الكامل === */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
              {t('register.fullName')} *
            </label>
            <div className="relative">
              <FaUser className={`
                absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'}
                ${isDark ? 'text-gray-500' : 'text-slate-400'}
              `} size={16} />
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`
                  w-full rounded-2xl p-4 pe-10 ps-4 text-sm outline-none transition-all
                  ${isDark 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary'
                  }
                `}
                placeholder={t('register.namePlaceholder')}
                disabled={loading}
              />
            </div>
          </div>
          
          {/* البريد الإلكتروني === */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
              {t('login.email')} *
            </label>
            <div className="relative">
              <FaEnvelope className={`
                absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'}
                ${isDark ? 'text-gray-500' : 'text-slate-400'}
              `} size={16} />
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`
                  w-full rounded-2xl p-4 pe-10 ps-4 text-sm outline-none transition-all
                  ${isDark 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary'
                  }
                `}
                placeholder={t('login.emailPlaceholder')}
                disabled={loading}
                dir="ltr"
              />
            </div>
          </div>

          {/* كلمة المرور === */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
              {t('login.password')} *
            </label>
            <div className="relative">
              <FaLock className={`
                absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'}
                ${isDark ? 'text-gray-500' : 'text-slate-400'}
              `} size={16} />
              <input 
                type={showPassword ? 'text' : 'password'}
                required 
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={`
                  w-full rounded-2xl p-4 pe-10 ps-10 text-sm outline-none transition-all
                  ${isDark 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary'
                  }
                `}
                placeholder={t('login.passwordPlaceholder')}
                disabled={loading}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`
                  absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'}
                  ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-slate-400 hover:text-slate-600'}
                `}
              >
                <FaEye size={16} />
              </button>
            </div>
          </div>

          {/* تأكيد كلمة المرور === */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
              {t('register.confirmPassword')} *
            </label>
            <div className="relative">
              <FaLock className={`
                absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'}
                ${isDark ? 'text-gray-500' : 'text-slate-400'}
              `} size={16} />
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                required 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className={`
                  w-full rounded-2xl p-4 pe-10 ps-10 text-sm outline-none transition-all
                  ${isDark 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary'
                  }
                `}
                placeholder={t('register.confirmPasswordPlaceholder')}
                disabled={loading}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`
                  absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'}
                  ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-slate-400 hover:text-slate-600'}
                `}
              >
                <FaEye size={16} />
              </button>
              {/* مؤشر تطابق كلمة المرور === */}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <FaCheck className="absolute top-1/2 -translate-y-1/2 text-green-500" size={16} style={{ [isRTL ? 'left' : 'right']: '12px' }} />
              )}
            </div>
          </div>

          {/* الموافقة على الشروط === */}
          <motion.label 
            htmlFor="terms"
            className={`
              flex items-start gap-3 p-3 rounded-xl cursor-pointer transition
              ${isDark ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-slate-50 hover:bg-slate-100'}
            `}
            whileHover={{ scale: 1.01 }}
          >
            <input 
              type="checkbox" 
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-secondary focus:ring-brand-secondary"
              disabled={loading}
            />
            <span className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              {t('register.agreeTerms')}{' '}
              <a href="/conditions" className={`${isDark ? 'text-brand-secondary hover:text-brand-secondaryHover' : 'text-brand-secondary hover:text-brand-secondaryHover'} hover:underline font-bold transition`}>
                {t('register.terms')}
              </a>{' '}
              {t('register.and')}{' '}
              <a href="/privacy" className={`${isDark ? 'text-brand-secondary hover:text-brand-secondaryHover' : 'text-brand-secondary hover:text-brand-secondaryHover'} hover:underline font-bold transition`}>
                {t('register.privacy')}
              </a>
            </span>
          </motion.label>

          {/* زر التسجيل === */}
          <motion.button 
            type="submit" 
            disabled={loading || !agreeTerms}
            whileHover={{ scale: loading || !agreeTerms ? 1 : 1.02 }}
            whileTap={{ scale: loading || !agreeTerms ? 1 : 0.98 }}
            className={`
              w-full py-4 rounded-full font-black shadow-lg transition-all 
              flex items-center justify-center gap-2
              ${loading || !agreeTerms
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : isDark 
                  ? 'bg-brand-secondary text-white hover:bg-brand-secondaryHover shadow-brand-secondary/25' 
                  : 'bg-brand-secondary text-white hover:bg-brand-secondaryHover shadow-brand-secondary/25'
              }
            `}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {t('register.loading')}
              </>
            ) : (
              <>
                <FaCheck size={16} />
                {t('register.submit')}
              </>
            )}
          </motion.button>
        </form>

        {/* === رابط الدخول === */}
        <p className={`text-center text-sm font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
          {t('register.hasAccount')}{' '}
          <Link to="/login" className={`${isDark ? 'text-brand-secondary hover:text-brand-secondaryHover' : 'text-brand-secondary hover:text-brand-secondaryHover'} hover:underline transition`}>
            {t('register.loginLink')}
          </Link>
        </p>
        
        {/* === ملاحظة للمطورين === */}
        {import.meta.env.DEV && (
          <p className={`text-center text-[10px] ${isDark ? 'text-gray-500' : 'text-slate-300'}`}>
            💡 {t('register.devTip')}
          </p>
        )}
      </motion.div>
    </section>
  );
};

export default RegisterPage;