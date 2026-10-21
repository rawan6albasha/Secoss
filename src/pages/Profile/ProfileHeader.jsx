// src/pages/Profile/ProfileHeader.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getLocalizedText } from '../../utils/i18n-helpers';
import Button from '../../components/ui/Button';
import MemberBadge from '../../components/ui/MemberBadge';

const ProfileHeader = ({ 
  user, 
  isEditing, 
  setIsEditing, 
  onSave, 
  canPublish, 
  onNewPost,
  isOwnProfile = true,
  isDark = false // ✅ استقبال isDark كـ prop
}) => {
  const { t } = useTranslation();

  const handleToggleEdit = () => setIsEditing(!isEditing);
  const handleSave = () => { onSave?.(); setIsEditing(false); };
const copyProfileLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    // عرض Toast نجاح (انظر النقطة 7)
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
 const isMember=true;
  return (
    <header className={`
      rounded-3xl border shadow-sm overflow-hidden mb-6 lg:mb-8 transition-colors duration-300
      ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}
    `}>
      {/* Gradient Banner */}
      <div className={`h-24 sm:h-32 bg-gradient-to-r ${isDark ? 'from-brand-primary/80 via-brand-primary/60 to-brand-secondary/80' : 'from-brand-primary via-brand-primary to-brand-secondary'}`} />
      
      <div className="px-4 sm:px-8 pb-6 -mt-12 sm:-mt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6">
          
          {/* User Info */}
          <div className="flex items-end gap-4 sm:gap-6">
            {/* Avatar */}
            <div className={`
              w-24 h-24 sm:w-32 sm:h-32 rounded-2xl 
              flex items-center justify-center text-3xl sm:text-4xl font-black
              shadow-lg border-4 transition-colors duration-300
              ${isDark ? 'bg-gray-800 text-brand-secondary border-gray-700' : 'bg-white text-brand-primary border-white'}
            `}>
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={getLocalizedText(user.name)}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <span>{getLocalizedText(user?.name)?.charAt(0) || '👤'}</span>
              )}
            </div>
            
            {/* Name & Degree */}
            <div>
              <h1 className={`text-xl sm:text-3xl font-black leading-tight transition-colors ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                {getLocalizedText(user?.name)}
              </h1>
              <p className={`text-sm sm:text-base font-bold mt-1 transition-colors ${isDark ? 'text-brand-secondary/90' : 'text-brand-secondary'}`}>
                {getLocalizedText(user?.degree)}
              </p>
               {isMember && (
    <div className="mt-2">
      <MemberBadge 
        memberType={user?.role === 'ADMIN' ? 'admin' : user?.role === 'FOUNDER' ? 'founder' : 'member'}
        joinDate={user?.memberSince}
        isDark={isDark}
      />
    </div>
  )}
              {!isOwnProfile && (
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  {t('profile.viewingOther') }
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isOwnProfile && (
            <div className="flex gap-2 sm:gap-3 flex-wrap items-center">
              
              {/* زر الإعدادات */}
     


              {/* زر التعديل / الحفظ */}
              {!isEditing ? (
                <Button variant="secondary" size="md" onClick={handleToggleEdit} className={`whitespace-nowrap ${isDark ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  <span className="hidden sm:inline">{t('common.edit') }</span>
                </Button>
              ) : (
                <Button variant="primary" size="md" onClick={handleSave} className="whitespace-nowrap">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  <span className="hidden sm:inline">{t('common.save') }</span>
                </Button>
              )}
              
              {/* زر نشر جديد */}
              {canPublish && (
                <Button variant="accent" size="md" onClick={onNewPost} className={`whitespace-nowrap ${isDark ? 'bg-brand-secondary text-white hover:bg-brand-secondaryHover' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <span className="hidden sm:inline">{t('post.newPost') || 'جديد'}</span>
                </Button>
              )}
                       <Link 
                to="/profile/settings"
                className={`
                  p-2.5 rounded-xl transition-colors duration-200
                  ${isDark ? 'text-gray-400 hover:text-brand-secondary hover:bg-gray-700' : 'text-gray-500 hover:text-brand-primary hover:bg-brand-light/30'}
                `}
                title={t('profile.settings')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>

            </div>
          )}
                            <button
      onClick={copyProfileLink}
      className={`
        p-2.5 rounded-xl transition-colors duration-200 flex items-center gap-1.5
        ${isDark ? 'text-gray-400 hover:text-brand-secondary hover:bg-gray-700' : 'text-gray-500 hover:text-brand-primary hover:bg-brand-light/30'}
      `}
      title={t('profile.copyLink') }
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    </button>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;