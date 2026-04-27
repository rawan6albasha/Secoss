// src/pages/Login/Login.jsx
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaLock, FaEnvelope, FaUserShield, FaUser, FaEye } from 'react-icons/fa';
import Logo from './../../assets/logo1.png';

const Login = () => {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';

  const handleManualLogin = async (e) => {
    e.preventDefault();
    clearError();
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }, 100);
    }
  };

  const handleQuickLogin = async (role) => {
    clearError();
    
    const testAccounts = {
      ADMIN: { email: 'admin@secoss.org', password: 'admin123' },
      MEMBER: { email: 'sara.hassan@example.com', password: 'user123' },
      GUEST: { email: 'khaled.nemri@example.com', password: 'user123' }
    };
    
    const account = testAccounts[role];
    if (account) {
      const result = await login(account.email, account.password);
      if (result.success) {
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      }
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
        flex min-h-[85vh] items-center justify-center py-10 px-4 transition-colors duration-300
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
          w-full max-w-md rounded-[2.5rem] border p-8 sm:p-10 shadow-2xl space-y-8
          ${isDark 
            ? 'bg-gray-800/60 border-gray-700 backdrop-blur-sm' 
            : 'bg-white/80 border-slate-100 backdrop-blur-sm'
          }
        `}
      >
        
        {/* === Header === */}
        <div className="text-center space-y-4">
          <motion.img 
            src={Logo} 
            alt={t('identity.name')} 
            className="h-16 sm:h-20 mx-auto drop-shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {t('login.welcomeTitle')}
          </h1>
          <p className={`text-sm font-bold ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
            {t('login.welcomeSubtitle')}
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
            <span>⚠️</span> {error}
          </motion.div>
        )}

        {/* === فورم الدخول اليدوي === */}
        <form className="space-y-5" onSubmit={handleManualLogin}>
          
          {/* حقل البريد الإلكتروني === */}
          <div className="space-y-2">
            <label className={`text-xs font-black uppercase ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
              {t('login.email')}
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
                dir={isRTL ? 'ltr' : 'ltr'}
              />
            </div>
          </div>

          {/* حقل كلمة المرور === */}
          <div className="space-y-2">
            <label className={`text-xs font-black uppercase ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
              {t('login.password')}
            </label>
            <div className="relative">
              <FaLock className={`
                absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'}
                ${isDark ? 'text-gray-500' : 'text-slate-400'}
              `} size={16} />
              <input 
                type={showPassword ? 'text' : 'password'}
                required 
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
                dir={isRTL ? 'ltr' : 'ltr'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`
                  absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'}
                  ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-slate-400 hover:text-slate-600'}
                `}
                aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
              >
                <FaEye size={16} />
              </button>
            </div>
          </div>

          {/* زر الدخول === */}
          <motion.button 
            type="submit" 
            disabled={loading || !formData.email || !formData.password}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`
              w-full py-4 rounded-full font-black shadow-xl transition-all 
              flex items-center justify-center gap-2
              ${loading || !formData.email || !formData.password
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
                {t('login.loading')}
              </>
            ) : (
              <>
                <FaUserShield size={16} />
                {t('login.submit')}
              </>
            )}
          </motion.button>
        </form>

        {/* === خيارات المطور (تظهر فقط في التطوير) === */}
        {import.meta.env.DEV && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`pt-6 space-y-4 border-t ${isDark ? 'border-gray-700' : 'border-slate-100'}`}
          >
            <p className={`text-center text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-slate-300'}`}>
              🧪 {t('login.devOptions')}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'ADMIN', label: '👑 ADMIN', color: 'red' },
                { role: 'MEMBER', label: '👤 MEMBER', color: 'emerald' },
                { role: 'GUEST', label: '👁️ GUEST', color: 'slate' }
              ].map(({ role, label, color }) => (
                <motion.button 
                  key={role}
                  type="button" 
                  onClick={() => handleQuickLogin(role)} 
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    text-[10px] font-black py-2.5 rounded-xl border-2 transition
                    ${isDark 
                      ? `border-${color}-800/50 text-${color}-400 hover:bg-${color}-900/30` 
                      : `border-${color}-200 text-${color}-600 hover:bg-${color}-50`
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {label}
                </motion.button>
              ))}
            </div>
            
            <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-slate-50'}`}>
              <p className={`text-[10px] text-center ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
                <span className="font-bold">{t('login.tip')}:</span> admin@secoss.org / admin123
              </p>
            </div>
          </motion.div>
        )}
        
        {/* === رابط التسجيل === */}
        <p className={`text-center text-sm font-bold ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
          {t('login.noAccount')}{' '}
          <Link to="/register" className={`${isDark ? 'text-brand-secondary hover:text-brand-secondaryHover' : 'text-brand-secondary hover:text-brand-secondaryHover'} hover:underline transition`}>
            {t('login.registerLink')}
          </Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Login;