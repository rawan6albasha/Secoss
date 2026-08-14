// src/pages/Profile/ProfileBio.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../../utils/i18n-helpers';

const ProfileBio = ({ bio, isEditing, onChange, isDark = false }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n?.language || 'ar';

  const getTextValue = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      return val[currentLang] || val.ar || val.en || '';
    }
    return String(val);
  };

  return (
    <section className={`
      rounded-2xl border p-5 shadow-sm transition-colors duration-300
      ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}
    `}>
      <h3 className={`text-lg font-bold mb-4 transition-colors ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
        {t('profile.bio') || 'نبذة عني'}
      </h3>
      {isEditing ? (
        <textarea
          value={getTextValue(bio)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('profile.bioPlaceholder') || 'اكتب نبذة عنك...'}
          className={`
            w-full px-4 py-3 rounded-xl text-sm outline-none resize-y min-h-24 transition-colors duration-200
            ${isDark 
              ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40' 
              : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-secondary/40'
            }
          `}
          rows={4}
        />
      ) : (
        <p className={`text-sm leading-relaxed transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {getLocalizedText(bio, currentLang) || t('profile.noBio') || 'لا توجد نبذة حالياً'}
        </p>
      )}
    </section>
  );
};

export default ProfileBio;