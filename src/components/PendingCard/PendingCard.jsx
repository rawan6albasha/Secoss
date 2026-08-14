// src/components/PendingCard/PendingCard.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaEdit, FaRedo, FaCheck, FaTimes, 
  FaFilePdf, FaImage, FaClock, FaExclamationCircle // ✅ التصحيح: FaExclamationCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Tag from '../ui/Tag';
import { getLocalizedText } from '../../utils/i18n-helpers';

const PendingCard = ({ 
  post, 
  isOwner = false, 
  isAdminView = false,
  onEdit, 
  onResubmit,
  onApprove,
  onReject,
  isDark = false
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n?.language || 'ar';
  const isRTL = currentLang === 'ar';

  const isRejected = post?.status === 'REJECTED';
  const isPending = post?.status === 'PENDING';

  // === ألوان الحالة حسب الثيم ===
  const statusColors = isRejected 
    ? {
        bg: isDark ? 'bg-red-900/20' : 'bg-red-50/50',
        border: isDark ? 'border-red-800/50' : 'border-red-200',
        text: isDark ? 'text-red-300' : 'text-red-700',
        badge: 'error',
        icon: '❌',
        label: t('status.rejected') || 'مرفوض',
      }
    : {
        bg: isDark ? 'bg-amber-900/20' : 'bg-amber-50/50',
        border: isDark ? 'border-amber-800/50' : 'border-amber-200',
        text: isDark ? 'text-amber-300' : 'text-amber-700',
        badge: 'warning',
        icon: '🕐',
        label: t('status.pending') || 'قيد المراجعة',
      };

  // === كلاسات مشتركة ===
  const cardClasses = `
    p-4 sm:p-5 rounded-2xl border shadow-sm transition-all duration-300
    ${statusColors.bg} ${statusColors.border}
    hover:shadow-md ${isDark ? 'hover:border-gray-600' : 'hover:border-gray-300'}
  `;

  const textPrimary = `font-black text-base sm:text-lg truncate transition-colors ${isDark ? 'text-gray-100' : 'text-gray-900'}`;
  const textSecondary = `text-xs transition-colors ${isDark ? 'text-gray-400' : 'text-slate-500'}`;
  const textPreview = `text-sm line-clamp-2 mb-3 transition-colors ${isDark ? 'text-gray-300' : 'text-slate-600'}`;
  const inputLike = `px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5`;

  return (
    <article dir={isRTL ? 'rtl' : 'ltr'} className={cardClasses}>
      
      {/* === Header === */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h4 className={textPrimary}>
            {getLocalizedText(post?.title, currentLang)}
          </h4>
          <div className={`flex items-center gap-2 mt-1 ${textSecondary}`}>
            <span className="truncate">{getLocalizedText(post?.category, currentLang)}</span>
            <span>•</span>
            <time dateTime={post?.createdAt}>
              {new Date(post?.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US')}
            </time>
          </div>
        </div>
        
        {/* Badge الحالة */}
        <Tag variant={statusColors.badge} className="text-[10px] whitespace-nowrap flex-shrink-0">
          <span className="me-1">{statusColors.icon}</span>
          {statusColors.label}
        </Tag>
      </div>

      {/* === Preview === */}
      {post?.summary && (
        <p className={textPreview}>
          {getLocalizedText(post.summary, currentLang)}
        </p>
      )}
      
      {/* المرفق: صورة */}
      {post?.attachmentType === 'image' && post?.attachmentUrl && (
        <div className={`relative mb-3 rounded-xl overflow-hidden border transition-colors ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <img 
            src={post.attachmentUrl} 
            alt={getLocalizedText(post?.title, currentLang)} 
            className="w-full h-32 object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
          <div className={`absolute top-2 end-2 px-2 py-1 rounded-md text-[10px] font-bold backdrop-blur-sm ${isDark ? 'bg-black/50 text-white' : 'bg-black/30 text-white'}`}>
            <FaImage size={10} className="inline me-1" />
            {t('common.image') || 'صورة'}
          </div>
        </div>
      )}
      
      {/* المرفق: PDF */}
      {post?.attachmentType === 'pdf' && (
        <div className={`
          flex items-center gap-2.5 p-3 rounded-xl mb-3 transition-colors
          ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}
        `}>
          <div className={`p-2 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-50'}`}>
            <FaFilePdf className={`text-lg ${isDark ? 'text-red-400' : 'text-red-500'}`} />
          </div>
          <span className={`text-xs font-medium truncate transition-colors ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
            {getLocalizedText(post?.attachmentName, currentLang) || (t('common.pdf') || 'ملف PDF')}
          </span>
          {post?.fileSize && (
            <span className={`text-[10px] ms-auto ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
              {post.fileSize}
            </span>
          )}
        </div>
      )}

      {/* === سبب الرفض === */}
      {isRejected && post?.rejectedReason && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            p-3 rounded-xl mb-3 flex items-start gap-2 transition-colors
            ${isDark ? 'bg-red-900/30 border border-red-800/50' : 'bg-red-100 border border-red-200'}
          `}
        >
          {/* ✅ التصحيح: FaExclamationCircle بدلاً من FaAlertCircle */}
          <FaExclamationCircle className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
          <p className={`text-xs font-medium ${isDark ? 'text-red-200' : 'text-red-700'}`}>
            <span className="font-black me-1">{t('profile.rejectReason') || 'سبب الرفض'}:</span>
            {getLocalizedText(post.rejectedReason, currentLang)}
          </p>
        </motion.div>
      )}

      {/* === Actions === */}
      <div className={`
        flex items-center justify-between pt-3 border-t gap-2 flex-wrap transition-colors
        ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'}
      `}>
        
        {/* أزرار صاحب المنشور */}
        {isOwner && ['PENDING', 'REJECTED'].includes(post?.status) && (
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={onEdit}
              className={`
                ${inputLike}
                ${isDark 
                  ? 'bg-gray-700 text-gray-200 hover:bg-brand-secondary hover:text-gray-900' 
                  : 'bg-white text-brand-secondary hover:bg-brand-secondary/10 border border-gray-200'
                }
              `}
            >
              <FaEdit size={11} /> {t('common.edit') || 'تعديل'}
            </button>
            
            {isRejected && (
              <button 
                onClick={onResubmit}
                className={`
                  ${inputLike}
                  ${isDark 
                    ? 'bg-gray-700 text-gray-200 hover:bg-brand-secondary/80 hover:text-gray-900' 
                    : 'bg-white text-brand-secondary hover:bg-brand-secondary/10 border border-gray-200'
                  }
                `}
              >
                <FaRedo size={11} /> {t('common.resubmit') || 'إعادة إرسال'}
              </button>
            )}
          </div>
        )}
        
        {/* أزرار الأدمن */}
        {isAdminView && isPending && (
          <div className="flex gap-2 ms-auto">
            <button 
              onClick={onApprove}
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                bg-brand-secondary text-white hover:bg-brand-secondaryHover transition-all shadow-sm hover:shadow
              "
            >
              <FaCheck size={11} /> {t('common.approve') || 'قبول'}
            </button>
            <button 
              onClick={onReject}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                ${isDark 
                  ? 'bg-red-900/50 text-red-200 hover:bg-red-800' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                }
              `}
            >
              <FaTimes size={11} /> {t('common.reject') || 'رفض'}
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default PendingCard;