// src/pages/Profile/AccountSettings.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

import Button from "../../components/ui/Button";
import { updateUserProfile } from './../../store/slices/userSlice';

const AccountSettings = () => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme(); // ✅ نفس الطريقة
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  
  const currentLang = i18n?.language || 'ar';

  const [settings, setSettings] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    notifications: user?.preferences?.notifications ?? true,
    language: user?.preferences?.language || currentLang,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (settings.language !== currentLang) {
        i18n.changeLanguage(settings.language);
        localStorage.setItem('i18nextLng', settings.language);
      }
      
      dispatch(updateUserProfile({
        ...user,
        email: settings.email,
        phone: settings.phone,
        preferences: {
          ...user?.preferences,
          notifications: settings.notifications,
          language: settings.language,
        },
      }));
      
      // إشعار نجاح بسيط
      const successMsg = document.createElement('div');
      successMsg.className = `fixed bottom-4 right-4 px-4 py-3 rounded-xl shadow-lg z-50 animate-[fadeIn_0.3s] ${isDark ? 'bg-brand-secondary/90 text-white' : 'bg-brand-secondary text-white'}`;
      successMsg.textContent = t('settings.saved') || '✅ تم الحفظ';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 2000);
      
    } catch (error) {
      alert(t('settings.error') || '❌ حدث خطأ');
    } finally {
      setIsSaving(false);
    }
  };

  const SettingRow = ({ label, children }) => (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-b last:border-0 transition-colors ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
      <label className={`text-sm font-bold min-w-32 transition-colors ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );

  return (
    <section className={`
      min-h-screen transition-colors duration-300
      ${isDark ? 'bg-gray-900' : 'bg-gray-50'}
      px-4 py-8 ${currentLang === 'ar' ? 'rtl font-arabic' : 'ltr font-sans'}
    `}>
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-black transition-colors ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {t('settings.title') || 'إعدادات الحساب'}
            </h1>
            <p className={`text-sm mt-1 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('settings.subtitle') || 'تحديث معلوماتك'}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className={isDark ? 'text-gray-300 hover:text-brand-secondary' : ''}>
            {t('common.back') || 'رجوع'}
          </Button>
        </div>

        {/* Form Card */}
        <div className={`
          rounded-2xl border shadow-sm p-6 space-y-1 transition-colors duration-300
          ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}
        `}>
          
          <SettingRow label={t('settings.email') || 'البريد الإلكتروني'}>
            <input type="email" value={settings.email} readOnly 
              className={`
                w-full px-3 py-2 rounded-lg text-sm transition-colors cursor-not-allowed
                ${isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
                }
              `} 
            />
            <p className={`text-[10px] mt-1 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {t('settings.emailReadonly') || 'لا يمكن تعديل البريد الإلكتروني'}
            </p>
          </SettingRow>

          <SettingRow label={t('settings.phone') || 'الهاتف'}>
            <input type="tel" value={settings.phone} 
              onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))} 
              className={`
                w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors duration-200
                ${isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/40' 
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-secondary/40'
                }
              `} 
              placeholder="+963..." 
            />
          </SettingRow>

          <SettingRow label={t('settings.notifications') || 'الإشعارات'}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={settings.notifications} 
                onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))} 
                className={`
                  w-4 h-4 rounded transition-colors
                  ${isDark 
                    ? 'border-gray-600 bg-gray-700 text-brand-secondary focus:ring-brand-secondary' 
                    : 'border-gray-300 text-brand-primary focus:ring-brand-secondary'
                  }
                `} 
              />
              <span className={`text-sm transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('settings.emailNotifications') || 'إشعارات البريد'}
              </span>
            </label>
          </SettingRow>

          <SettingRow label={t('settings.language') || 'اللغة'}>
            <select value={settings.language} 
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))} 
              className={`
                w-full sm:w-auto px-3 py-2 rounded-lg text-sm outline-none transition-colors duration-200
                ${isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/40' 
                  : 'bg-white border-gray-200 text-gray-800 focus:border-brand-primary focus:ring-1 focus:ring-brand-secondary/40'
                }
              `}
            >
              <option value="ar"> العربية</option>
              <option value="en"> English</option>
            </select>
          </SettingRow>

          {/* Save Button */}
          <div className={`pt-4 flex justify-end transition-colors ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <Button onClick={handleSave} isLoading={isSaving} variant="primary" size="md">
              {t('common.save') || 'حفظ التغييرات'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountSettings;