// src/pages/Profile/ProfileSidebar.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGraduationCap, FaAward, FaTrash, FaPlus } from 'react-icons/fa';
import { getLocalizedText } from '../../utils/i18n-helpers';

// === مكون حقل قابل للتعديل - مع معالجة القيم ثنائية اللغة ===
const EditableField = ({ label, value, isEditing, onChange, placeholder }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n?.language || 'ar';
  const isRTL = currentLang === 'ar';

  // ✅ استخراج النص من الكائن ثنائي اللغة
  const getTextValue = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      return val[currentLang] || val.ar || val.en || '';
    }
    return String(val);
  };

  return (
    <div className="mb-3 last:mb-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      {isEditing ? (
        <input
          // ✅ استخدام النص المستخرج كقيمة أولية
          value={getTextValue(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200
            text-sm text-gray-800 outline-none transition-all
            focus:border-brand-primary focus:ring-2 focus:ring-brand-secondary/40
            ${isRTL ? 'text-right' : 'text-left'}
          `}
        />
      ) : (
        <p className="text-sm font-bold text-gray-800">
          {/* ✅ عرض النص المترجم في وضع القراءة */}
          {getLocalizedText(value, currentLang) || '—'}
        </p>
      )}
    </div>
  );
};

// === مكون عنصر شهادة ===
const CertificateItem = ({ cert, isEditing, onDelete, index }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n?.language || 'ar';

  return (
    <div className="
      flex items-center justify-between gap-2 p-3 rounded-xl 
      bg-gray-50 border border-gray-100 mb-2 last:mb-0
    ">
      <span className="text-xs font-bold text-gray-800 truncate">
        {/* ✅ معالجة الشهادة إذا كانت كائناً */}
        {getLocalizedText(cert, currentLang)}
      </span>
      {isEditing && (
        <button
          onClick={() => onDelete(index)}
          className="
            p-1.5 text-error hover:bg-error/10 rounded-lg 
            transition-colors flex-shrink-0
          "
          aria-label="حذف الشهادة"
        >
          <FaTrash size={10} />
        </button>
      )}
    </div>
  );
};

const ProfileSidebar = ({ user, isEditing, onChange }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n?.language || 'ar';
  const [newCert, setNewCert] = useState("");

  const handleChange = (field) => (value) => {
    onChange(prev => ({ ...prev, [field]: value }));
  };

  const addCertificate = () => {
    if (newCert.trim()) {
      onChange(prev => ({
        ...prev,
        certificates: [...(prev.certificates || []), newCert],
      }));
      setNewCert("");
    }
  };

  const deleteCertificate = (index) => {
    onChange(prev => ({
      ...prev,
      certificates: prev.certificates?.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      {/* Academic Info */}
      <section className="
        bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm
      ">
        <h3 className="
          text-lg font-black text-gray-900 mb-5 flex items-center gap-2
        ">
          <FaGraduationCap className="text-brand-secondary" size={18} />
          {t('profile.academicInfo') || 'المعلومات الأكاديمية'}
        </h3>
        
        <EditableField
          label={t('profile.work') || 'العمل'}
          value={user.work}
          isEditing={isEditing}
          onChange={handleChange('work')}
          placeholder={t('profile.workPlaceholder') || 'مكان العمل'}
        />
        <EditableField
          label={t('profile.specialization') || 'الاختصاص'}
          value={user.specialization}
          isEditing={isEditing}
          onChange={handleChange('specialization')}
          placeholder={t('profile.specializationPlaceholder') || 'التخصص'}
        />
      </section>

      {/* Certificates */}
      <section className="
        bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm
      ">
        <h3 className="
          text-lg font-black text-gray-900 mb-5 flex items-center gap-2
        ">
          <FaAward className="text-warning" size={18} />
          {t('profile.certificates') || 'الشهادات'}
        </h3>
        
        <div>
          {user.certificates?.length > 0 ? (
            user.certificates.map((cert, index) => (
              <CertificateItem
                key={index}
                cert={cert}
                index={index}
                isEditing={isEditing}
                onDelete={deleteCertificate}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">
              {t('profile.noCertificates') || 'لا توجد شهادات مضافة'}
            </p>
          )}
          
          {isEditing && (
            <div className="flex gap-2 mt-4">
              <input
                placeholder={t('profile.addCertificate') || 'أضف شهادة...'}
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                className="
                  flex-1 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200
                  text-xs text-gray-800 outline-none transition-all
                  focus:border-brand-primary focus:ring-2 focus:ring-brand-secondary/40
                "
                onKeyDown={(e) => e.key === 'Enter' && addCertificate()}
              />
              <button
                onClick={addCertificate}
                disabled={!newCert.trim()}
                className="
                  px-3 py-2.5 bg-brand-secondary text-gray-900 rounded-xl
                  font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed
                  hover:opacity-90 transition-opacity flex items-center justify-center
                "
              >
                <FaPlus size={12} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProfileSidebar;