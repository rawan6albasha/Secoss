// src/components/ui/ShareButtons/ShareButtons.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaWhatsapp, FaTelegramPlane, FaLinkedin, FaFacebookF, FaLink, FaCopy,
  FaTwitter, FaYoutube, FaInstagram, FaEnvelope,
} from 'react-icons/fa';

const ShareButtons = ({ 
  url, 
  title, 
  className = '',
  variant = 'horizontal', // 'horizontal' | 'vertical' | 'dropdown'
  mode = 'share',         // ✅ 'share' | 'profile' ← جديد
  showLabel = true,
  iconSize = 20,
  socialLinks = [],       // ✅ مصفوفة روابط للملفات الشخصية (لوضع profile)
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n?.language || 'ar';
  const isRTL = currentLang === 'ar';
  const [copied, setCopied] = useState(false);

  const shareUrl = encodeURIComponent(url || window.location.href);
  const shareTitle = encodeURIComponent(title || '');

  // === روابط المشاركة التقليدية ===
  const shareLinks = [
    { 
      id: 'whatsapp', 
      Icon: FaWhatsapp, 
      color: '#25D366', 
      url: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
      label: t('social.whatsapp') || 'واتساب'
    },
    { 
      id: 'telegram', 
      Icon: FaTelegramPlane, 
      color: '#0088cc', 
      url: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`,
      label: t('social.telegram') || 'تيليجرام'
    },
    { 
      id: 'linkedin', 
      Icon: FaLinkedin, 
      color: '#0077b5', 
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      label: t('social.linkedin') || 'لينكدإن'
    },
    { 
      id: 'facebook', 
      Icon: FaFacebookF, 
      color: '#1877F2', 
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      label: t('social.facebook') || 'فيسبوك'
    },
  ];

  // === ✅ روابط الملفات الشخصية (لوضع profile) ===
  const profileLinks = socialLinks.length > 0 ? socialLinks.map(link => {
    const iconMap = {
      FaFacebookF, FaTwitter, FaLinkedin, FaYoutube, 
      FaInstagram, FaTelegramPlane, FaEnvelope, FaWhatsapp
    };
    return {
      ...link,
      Icon: iconMap[link.icon] || FaLink,
      label: t(link.labelKey) || link.label || link.id,
    };
  }) : [
    // روابط افتراضية إذا لم تُمرر
    { id: 'facebook', Icon: FaFacebookF, color: '#1877F2', href: '#', label: t('social.facebook') },
    { id: 'twitter', Icon: FaTwitter, color: '#1DA1F2', href: '#', label: t('social.twitter') },
    { id: 'linkedin', Icon: FaLinkedin, color: '#0077b5', href: '#', label: t('social.linkedin') },
    { id: 'youtube', Icon: FaYoutube, color: '#FF0000', href: '#', label: t('social.youtube') },
  ];

  // === نسخ الرابط ===
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // === أنماط الأيقونات المشتركة ===
  const iconBaseClasses = `
    p-2.5 rounded-xl transition-all duration-200
    hover:scale-110 hover:shadow-lg
    flex items-center justify-center
    focus:outline-none focus:ring-2 focus:ring-brand-secondary/40
  `;

  // === ✅ وضع العرض: ملف شخصي (للفوتر) ===
  if (mode === 'profile') {
    return (
      <div className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} items-center gap-2 ${className}`}>
        {profileLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconBaseClasses} hover:bg-white/20 bg-white/10`}
            style={{ color: link.color || '#fff' }}
            title={link.label}
            aria-label={link.label}
          >
            <link.Icon size={iconSize} />
          </a>
        ))}
      </div>
    );
  }

  // === العرض حسب المتغير (للمشاركة) ===
  if (variant === 'dropdown') {
    return (
      <div className={`relative group ${className}`}>
        <button className="
          flex items-center gap-2 px-4 py-2 text-sm font-bold
          text-gray-600 dark:text-gray-300 hover:text-brand-primary hover:bg-gray-50 dark:hover:bg-gray-700
          rounded-xl transition-colors
        ">
          <FaLink size={iconSize} />
          {showLabel && <span>{t('common.share') || 'مشاركة'}</span>}
        </button>
        
        {/* القائمة المنسدلة */}
        <div className={`
          absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2
          bg-white dark:bg-gray-800 rounded-2xl shadow-brand-hover border border-gray-100 dark:border-gray-700
          py-2 z-30 min-w-48
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200
        `}>
          {shareLinks.map(({ id, Icon, color, url, label }) => (
            <a
              key={id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex items-center gap-3 px-4 py-2.5 text-sm
                ${isRTL ? 'text-right' : 'text-left'}
                hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
              `}
              style={{ color }}
              title={label}
            >
              <Icon size={16} />
              <span className="text-gray-700 dark:text-gray-200 font-medium">{label}</span>
            </a>
          ))}
          <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
          <button
            onClick={handleCopyLink}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 text-sm
              ${isRTL ? 'text-right' : 'text-left'}
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200
            `}
          >
            {copied ? <FaLink size={16} className="text-success" /> : <FaCopy size={16} />}
            <span className="font-medium">{copied ? (t('common.copied') || 'تم النسخ!') : (t('common.copyLink') || 'نسخ الرابط')}</span>
          </button>
        </div>
      </div>
    );
  }

  // === العرض الأفقي أو العمودي (للمشاركة) ===
  return (
    <div className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} items-center gap-2 ${className}`}>
      {showLabel && variant !== 'vertical' && (
        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 me-2">
          {t('news.share') || 'مشاركة:'}
        </span>
      )}
      
      {/* أيقونات المشاركة */}
      {shareLinks.map(({ id, Icon, color, url, label }) => (
        <a
          key={id}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${iconBaseClasses} hover:bg-gray-50 dark:hover:bg-gray-700`}
          style={{ color }}
          title={label}
          aria-label={label}
        >
          <Icon size={iconSize} />
        </a>
      ))}
      
      {/* زر نسخ الرابط */}
      <button
        onClick={handleCopyLink}
        className={`${iconBaseClasses} hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-brand-primary`}
        title={t('common.copyLink') || 'نسخ الرابط'}
        aria-label={t('common.copyLink') || 'نسخ الرابط'}
      >
        {copied ? <FaLink size={iconSize} className="text-success" /> : <FaCopy size={iconSize} />}
      </button>
      
      {showLabel && variant === 'vertical' && (
        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2 text-center">
          {t('news.share') || 'مشاركة'}
        </span>
      )}
    </div>
  );
};

export default ShareButtons;