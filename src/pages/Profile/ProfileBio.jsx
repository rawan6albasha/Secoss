// src/pages/Profile/ProfileBio.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../../utils/i18n-helpers';

const ProfileBio = ({ bio, isEditing, onChange }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n?.language || 'ar';

  // ✅ دالة مساعدة لاستخراج النص
  const getTextValue = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      return val[currentLang] || val.ar || val.en || '';
    }
    return String(val);
  };

  return (
    <section className="
      bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm
    ">
      <h3 className="text-lg font-black text-gray-900 mb-4">
        {t('profile.bio') || 'السيرة الذاتية'}
      </h3>
      
      {isEditing ? (
        <textarea
          // ✅ استخدام النص المستخرج كقيمة أولية
          value={getTextValue(bio)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('profile.bioPlaceholder') || 'اكتب نبذة عنك...'}
          className="
            w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200
            text-sm text-gray-800 outline-none resize-y min-h-24
            transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-secondary/40
          "
          rows={4}
        />
      ) : (
        <p className="text-sm text-gray-600 leading-relaxed italic">
          {/* ✅ عرض النص المترجم في وضع القراءة */}
          {getLocalizedText(bio, currentLang) || t('profile.noBio') || 'لا توجد سيرة ذاتية حالياً'}
        </p>
      )}
    </section>
  );
};

export default ProfileBio;