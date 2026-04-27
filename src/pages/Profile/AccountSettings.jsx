// src/pages/Profile/AccountSettings.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { FaLock, FaBell, FaLanguage, FaShieldAlt, FaSave, FaKey } from 'react-icons/fa';

import Button from "../../components/ui/Button";
import { updateUserProfile } from './../../store/slices/userSlice';

const AccountSettings = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  
  const currentLang = i18n?.language || 'ar';
  const isRTL = currentLang === 'ar';

  const [settings, setSettings] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    notifications: user?.preferences?.notifications ?? true,
    language: user?.preferences?.language || currentLang,
    twoFactor: user?.preferences?.twoFactor ?? false,
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
          twoFactor: settings.twoFactor,
        },
      }));
      
      alert(t('settings.saved') || '✅ تم حفظ الإعدادات بنجاح');
    } catch (error) {
      alert(t('settings.error') || '❌ حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  const SettingItem = ({ icon: Icon, label, children, hint }) => (
    <div className="
      flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl 
      bg-gray-50 hover:bg-gray-100 transition-colors
    ">
      <div className="p-2.5 rounded-lg bg-brand-light text-brand-primary flex-shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-bold text-gray-800">{label}</p>
          {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <section className={`
      min-h-screen bg-gray-50 ${isRTL ? 'font-arabic rtl' : 'font-sans ltr'}
      px-4 sm:px-6 py-8 lg:py-12
    `}>
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {t('settings.title') || 'إعدادات الحساب'}
          </h1>
          <p className="text-gray-500 mt-1">
            {t('settings.subtitle') || 'إدارة معلومات حسابك وتفضيلاتك'}
          </p>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-4">
          
          {/* البريد الإلكتروني */}
          <SettingItem icon={FaLock} label={t('settings.email') || 'البريد الإلكتروني'}>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
              className="
                w-full px-4 py-3 rounded-xl bg-white border border-gray-200
                text-sm text-gray-800 outline-none transition-all
                focus:border-brand-primary focus:ring-2 focus:ring-brand-secondary/40
              "
            />
          </SettingItem>

          {/* الهاتف */}
          <SettingItem icon={FaKey} label={t('settings.phone') || 'رقم الهاتف'} hint="(اختياري)">
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
              className="
                w-full px-4 py-3 rounded-xl bg-white border border-gray-200
                text-sm text-gray-800 outline-none transition-all
                focus:border-brand-primary focus:ring-2 focus:ring-brand-secondary/40
              "
            />
          </SettingItem>

          {/* الإشعارات */}
          <SettingItem icon={FaBell} label={t('settings.notifications') || 'الإشعارات'}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary"
              />
              <span className="text-sm text-gray-600">
                {t('settings.enableNotifications') || 'تفعيل إشعارات البريد'}
              </span>
            </label>
          </SettingItem>

          {/* اللغة */}
          <SettingItem icon={FaLanguage} label={t('settings.language') || 'لغة الواجهة'}>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="
                w-full px-4 py-3 rounded-xl bg-white border border-gray-200
                text-sm text-gray-800 outline-none transition-all
                focus:border-brand-primary focus:ring-2 focus:ring-brand-secondary/40
              "
            >
              <option value="ar">🇸🇾 العربية</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </SettingItem>

          {/* المصادقة الثنائية */}
          <SettingItem icon={FaShieldAlt} label={t('settings.twoFactor') || 'المصادقة الثنائية'} hint="موصى به">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactor}
                onChange={(e) => setSettings(prev => ({ ...prev, twoFactor: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary"
              />
              <span className="text-sm text-gray-600">
                {t('settings.enableTwoFactor') || 'تفعيل المصادقة الثنائية'}
              </span>
            </label>
          </SettingItem>

          {/* زر الحفظ */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button onClick={handleSave} isLoading={isSaving} variant="primary">
              <FaSave size={14} />
              {t('common.save') || 'حفظ التغييرات'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountSettings;