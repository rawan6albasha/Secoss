// src/pages/Profile/ProfileSidebar.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getLocalizedText } from '../../utils/i18n-helpers';
import Button from '../../components/ui/Button';

// === المكونات الفرعية ===
import ProfileStats from './ProfileStats';
import ProfileCompletion from './ProfileCompletion';
import AcademicLinks from './AcademicLinks';
import { useTheme } from '../../context/ThemeContext';

// === الحقول القابلة للتعديل ===
const EditableField = ({ label, value, isEditing, onChange, placeholder }) => {
  const { i18n } = useTranslation();
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
    <div className="mb-3 last:mb-0">
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-400 dark:text-gray-500 transition-colors">
        {label}
      </p>
      {isEditing ? (
        <input
          value={getTextValue(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors duration-200
            bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
            text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
            focus:border-brand-primary dark:focus:border-brand-secondary
            focus:ring-1 focus:ring-brand-secondary/40
          "
        />
      ) : (
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors">
          {getLocalizedText(value, currentLang) || '—'}
        </p>
      )}
    </div>
  );
};

const socialLinks = [
  {
    id: '1',
    platform: 'instagram',
    url: 'https://instagram.com/ahmounkez',
    label: 'Instagram'
  },
  {
    id: '2',
    platform: 'linkedin',
    url: 'https://linkedin.com/in/ahmounkez',
    label: 'LinkedIn'
  },
  {
    id: '3',
    platform: 'github',
    url: 'https://github.com/ahmounkez',
    label: 'GitHub'
  }
];

// === عنصر الشهادة ===
const CertificateItem = ({ cert, isEditing, onDelete, index }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n?.language || 'ar';

  return (
    <div className="
      flex items-center justify-between gap-2 p-2.5 rounded-lg transition-colors
      bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600
    ">
      <span className="text-xs font-medium text-gray-800 dark:text-gray-100 transition-colors">
        {getLocalizedText(cert, currentLang)}
      </span>
      {isEditing && (
        <button onClick={() => onDelete(index)} className="p-1 rounded transition text-error dark:text-red-400 hover:bg-error/10 dark:hover:bg-red-900/30">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      )}
    </div>
  );
};

// === إضافة شهادة جديدة ===
const AddCertificateInput = ({ onAdd }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  
  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
  };
  
  return (
    <div className="flex gap-2 mt-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        placeholder={t('profile.addCertificate') || 'أضف شهادة...'}
        className="
          flex-1 px-3 py-2 rounded-lg text-xs outline-none transition-colors duration-200
          bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
          text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
          focus:border-brand-primary dark:focus:border-brand-secondary
          focus:ring-1 focus:ring-brand-secondary/40
        "
      />
      <Button variant="accent" size="sm" onClick={handleAdd} disabled={!value.trim()}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      </Button>
    </div>
  );
};

// === المكون الرئيسي ===
const ProfileSidebar = ({ user, isEditing, onChange, canEdit = false }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n?.language || 'ar';
  const [newCert, setNewCert] = useState("");
    const { isDark } = useTheme(); // ✅ نفس الطريقة المستخدمة في News.jsx
   
  // ✅ الحصول على المستخدم الحالي لتحديد إذا كان هذا ملفه
  const { user: currentUser } = useSelector(state => state.user);
  const { userId } = useParams();
  const isOwnProfile = !userId || userId === currentUser?.id;
  
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
      {/* === مؤشر اكتمال البروفايل === */}
      <ProfileCompletion isDark={isDark} user={user} />
      
      {/* === إحصائيات سريعة === */}
      <ProfileStats isDark={isDark} stats={user?.stats || {}} />

      {/* === المعلومات الأكاديمية === */}
      <section className="
        rounded-2xl border p-5 shadow-sm transition-colors duration-300
        bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700
      ">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 transition-colors">
          <svg className="w-5 h-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
          {t('profile.academicInfo') || 'المعلومات'}
        </h3>
        
        <div className="space-y-3">
          <EditableField
            label={t('profile.work') || 'العمل'}
            value={user.work}
            isEditing={isEditing && canEdit}
            onChange={handleChange('work')}
            placeholder={t('profile.workPlaceholder') || 'مكان العمل'}
          />
          <EditableField
            label={t('profile.specialization') || 'الاختصاص'}
            value={user.specialization}
            isEditing={isEditing && canEdit}
            onChange={handleChange('specialization')}
            placeholder={t('profile.specializationPlaceholder') || 'التخصص'}
          />
        </div>
      </section>

      {/* === الشهادات (لصاحب البروفايل فقط) === */}
      {canEdit && isOwnProfile && (
        <section className="
          rounded-2xl border p-5 shadow-sm transition-colors duration-300
          bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700
        ">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 transition-colors">
            <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            {t('profile.certificates') || 'الشهادات'}
          </h3>
          
          <div className="space-y-2">
            {user.certificates?.map((cert, index) => (
              <CertificateItem
                key={index}
                cert={cert}
                index={index}
                isEditing={isEditing}
                onDelete={deleteCertificate}
              />
            ))}
            
            {isEditing && <AddCertificateInput onAdd={addCertificate} />}
            
            {!user.certificates?.length && (
              <p className="text-xs italic text-gray-400 dark:text-gray-500 transition-colors">
                {t('profile.noCertificates') || 'لا توجد شهادات'}
              </p>
            )}
          </div>
        </section>
      )}
{console.log(socialLinks)}
      {/* === الروابط الأكاديمية === */}
      <AcademicLinks
        links={socialLinks}
        isEditing={isEditing && isOwnProfile}
        onChange={onChange}
        isDark={isDark}
        isOwnProfile={isOwnProfile}
      />
    </>
  );
};

export default ProfileSidebar;