// src/pages/Profile/ProfileHeader.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserEdit, FaSave, FaPlus, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getLocalizedText } from '../../utils/i18n-helpers';
import Button from '../../components/ui/Button';

const ProfileHeader = ({ 
  user, 
  isEditing, 
  setIsEditing, 
  onSave, 
  canPublish, 
  onNewPost 
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n?.language || 'ar';
  const isRTL = currentLang === 'ar';

  // === دبغ للتأكد من تحديث الحالة ===
  React.useEffect(() => {
    console.log('🔧 ProfileHeader - isEditing:', isEditing);
  }, [isEditing]);

  const handleToggleEdit = () => {
    console.log('✏️ Toggle edit clicked, new state:', !isEditing);
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    console.log('💾 Save clicked');
    onSave?.();
    setIsEditing(false);
  };

  return (
    <header className={` bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6 lg:mb-8
  ${isRTL ? 'text-right' : 'text-left'} `}>
      {/* Gradient Header */}
      <div className="h-24 sm:h-32 bg-gradient-to-r from-brand-secondary to-brand-primary" />
      
      {/* Content */}
      <div className="px-4 sm:px-8 pb-6 -mt-12 sm:-mt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6">
          
          {/* === User Info === */}
          <div className={`flex items-end gap-4 sm:gap-6 `}>
            {/* Avatar */}
            <div className="
              w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white 
              flex items-center justify-center text-3xl sm:text-4xl font-black
              text-brand-primary shadow-lg border-4 border-white
            ">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={getLocalizedText(user.name, currentLang)}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <span>{getLocalizedText(user?.name, currentLang)?.charAt(0) || '👤'}</span>
              )}
            </div>
            
            {/* Name & Degree */}
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-xl sm:text-3xl font-black text-gray-900 leading-tight">
                {getLocalizedText(user?.name, currentLang)}
              </h1>
              <p className="text-sm sm:text-base font-bold text-brand-secondary mt-1">
                {getLocalizedText(user?.degree, currentLang)} 
              </p>
            </div>
          </div> 

          {/* === Action Buttons === */}
          <div className={`flex gap-3 flex-wrap items-center ${isRTL ? 'sm:ml-auto' : 'sm:mr-auto'}`}>
            
            {/* زر الإعدادات */}
            <Link 
              to="/profile/settings"
              className="
                p-2.5 text-gray-500 hover:text-brand-primary hover:bg-brand-light/30 
                rounded-xl transition-colors
              "
              title={t('profile.settings') || 'إعدادات الحساب'}
            >
              <FaCog size={18} />
            </Link>

            {/* زر التعديل / الحفظ */}
            {!isEditing ? (
              <Button
                variant="secondary"
                size="md"
                onClick={handleToggleEdit}
                className="whitespace-nowrap"
              >
                <FaUserEdit size={14} /> 
                <span className="hidden sm:inline">{t('profile.edit') || 'تعديل الملف'}</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                className="whitespace-nowrap"
              >
                <FaSave size={14} /> 
                <span className="hidden sm:inline">{t('common.save') || 'حفظ'}</span>
              </Button>
            )}
            
            {/* زر نشر جديد */}
            {canPublish && (
              <Button
                variant="accent"
                size="md"
                onClick={onNewPost}
                className="whitespace-nowrap"
              >
                <FaPlus size={14} /> 
                <span className="hidden sm:inline">{t('profile.newPost') || 'نشر جديد'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;