// src/pages/Profile/AcademicLinks.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { getLocalizedText } from '../../utils/i18n-helpers';
import Button from '../../components/ui/Button';

// === أيقونات المنصات الأكاديمية الشائعة ===
const PLATFORM_ICONS = {
  researchgate: '🔬',
  google_scholar: '🎓',
  orcid: '🆔',
  linkedin: '💼',
  twitter: '🐦',
  website: '🌐',
  custom: '🔗',
};

const AcademicLinks = ({ 
  links = [], 
  isEditing, 
  onChange, 
  isDark = false,
  isOwnProfile = false 
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n?.language || 'ar';
  const [newLink, setNewLink] = useState({ platform: 'custom', label: '', url: '' });
  const [isAdding, setIsAdding] = useState(false);

  // === إضافة رابط جديد ===
  const handleAddLink = () => {
    if (newLink.label.trim() && newLink.url.trim()) {
      onChange(prev => ({
        ...prev,
        socialLinks: [...(prev.socialLinks || []), { ...newLink, id: Date.now() }]
      }));
      setNewLink({ platform: 'custom', label: '', url: '' });
      setIsAdding(false);
    }
  };

  // === حذف رابط ===
  const handleDeleteLink = (id) => {
    onChange(prev => ({
      ...prev,
      socialLinks: prev.socialLinks?.filter(link => link.id !== id)
    }));
  };

  // === تحديث رابط ===
  const handleUpdateLink = (id, field, value) => {
    onChange(prev => ({
      ...prev,
      socialLinks: prev.socialLinks?.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    }));
  };

  // === عرض الروابط في وضع القراءة ===
  if (!isEditing || !isOwnProfile) {
    if (!links?.length) return null;
    
    return (
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-5 transition-colors ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}
      >
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          <span>🔗</span>
          {t('profile.academicLinks') || 'روابط أكاديمية'}
        </h3>
        <div className="space-y-2">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200
                ${isDark 
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-brand-secondary' 
                  : 'hover:bg-gray-50 text-gray-700 hover:text-brand-primary'
                }
              `}
            >
              <span className="text-lg">{PLATFORM_ICONS[link.platform] || PLATFORM_ICONS.custom}</span>
              <span className="text-sm font-medium truncate flex-1">
                {getLocalizedText(link.label, currentLang) || link.label}
              </span>
              <svg className="w-4 h-4 opacity-50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      </motion.section>
    );
  }

  // === وضع التعديل - لصاحب البروفايل فقط ===
  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 transition-colors ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}
    >
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
        <span>🔗</span>
        {t('profile.academicLinks') || 'روابط أكاديمية'}
      </h3>
      
      {/* قائمة الروابط القابلة للتعديل */}
      <div className="space-y-3 mb-4">
        <AnimatePresence>
          {links.map((link) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-3 rounded-lg border transition-colors ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                {/* اختيار المنصة */}
                <select
                  value={link.platform}
                  onChange={(e) => handleUpdateLink(link.id, 'platform', e.target.value)}
                  className={`
                    px-2 py-1 rounded text-xs font-bold outline-none transition-colors
                    ${isDark 
                      ? 'bg-gray-600 border-gray-500 text-gray-100' 
                      : 'bg-white border-gray-300 text-gray-800'
                    }
                  `}
                >
                  {Object.entries(PLATFORM_ICONS).map(([key, icon]) => (
                    <option key={key} value={key}>{icon} {t(`platforms.${key}`) || key}</option>
                  ))}
                </select>
                
                {/* زر الحذف */}
                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className={`p-1 rounded transition ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-error hover:bg-error/10'}`}
                  title={t('common.delete') || 'حذف'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleUpdateLink(link.id, 'label', e.target.value)}
                  placeholder={t('profile.linkLabel') || 'اسم الرابط'}
                  className={`
                    px-3 py-2 rounded-lg text-sm outline-none transition-colors
                    ${isDark 
                      ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400 focus:border-brand-secondary' 
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-brand-primary'
                    }
                  `}
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                  placeholder={t('profile.linkUrl') || 'https://...'}
                  className={`
                    px-3 py-2 rounded-lg text-sm outline-none transition-colors
                    ${isDark 
                      ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400 focus:border-brand-secondary' 
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-brand-primary'
                    }
                  `}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* زر/نموذج إضافة رابط جديد === */}
      <AnimatePresence>
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-3 rounded-lg border mb-3 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <select
                value={newLink.platform}
                onChange={(e) => setNewLink(prev => ({ ...prev, platform: e.target.value }))}
                className={`px-2 py-2 rounded text-xs font-bold outline-none ${isDark ? 'bg-gray-600 text-gray-100' : 'bg-white text-gray-800'}`}
              >
                {Object.entries(PLATFORM_ICONS).map(([key, icon]) => (
                  <option key={key} value={key}>{icon} {key}</option>
                ))}
              </select>
              <input
                type="text"
                value={newLink.label}
                onChange={(e) => setNewLink(prev => ({ ...prev, label: e.target.value }))}
                placeholder={t('profile.linkLabel') || 'الاسم'}
                className={`px-3 py-2 rounded text-sm outline-none ${isDark ? 'bg-gray-600 text-gray-100' : 'bg-white text-gray-800'}`}
              />
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                placeholder={t('profile.linkUrl') || 'الرابط'}
                className={`px-3 py-2 rounded text-sm outline-none ${isDark ? 'bg-gray-600 text-gray-100' : 'bg-white text-gray-800'}`}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleAddLink} className={isDark ? 'bg-brand-secondary text-gray-900' : ''}>
                {t('common.add') || 'إضافة'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                {t('common.cancel') || 'إلغاء'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsAdding(true)}
            className={`w-full justify-start ${isDark ? 'text-brand-secondary hover:bg-gray-700' : 'text-brand-primary hover:bg-brand-light/30'}`}
          >
            <span className="me-2">+</span> {t('profile.addLink') || 'إضافة رابط جديد'}
          </Button>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default AcademicLinks;