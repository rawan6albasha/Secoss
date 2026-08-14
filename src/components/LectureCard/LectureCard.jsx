// src/components/LectureCard/LectureCard.jsx
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion'
import { 
  FaFilePdf, FaClock, FaHeart, FaComment, FaEye, 
  FaBookmark, FaBookmark as FaBookmarkSolid 
} from 'react-icons/fa'
import { getLocalizedText, formatDate } from '../../utils/i18n-helpers'
import Tag from './../ui/Tag'
import Button from './../ui/Button'

const LectureCard = ({ lecture, onBookmark, isBookmarked = false }) => {
  const { t, i18n } = useTranslation()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const currentLang = i18n.language || 'ar'
  const isRTL = currentLang === 'ar'

  // === إعدادات حالة المحاضرة مع دعم الثيم ===
  const statusConfig = {
    APPROVED: { 
      bg: isDark ? 'bg-green-900/30' : 'bg-green-50', 
      text: isDark ? 'text-green-400' : 'text-green-700', 
      label: t('status.approved') 
    },
    PENDING: { 
      bg: isDark ? 'bg-yellow-900/30' : 'bg-amber-50', 
      text: isDark ? 'text-yellow-400' : 'text-amber-700', 
      label: t('status.pending') 
    },
    REJECTED: { 
      bg: isDark ? 'bg-red-900/30' : 'bg-red-50', 
      text: isDark ? 'text-red-400' : 'text-red-700', 
      label: t('status.rejected') 
    }
  }

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('[role="button"]')) return
    navigate(`/lecture-detail/${lecture?.id}`)
  }

  // === أنيميشن البطاقة ===
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { 
      y: -4, 
      transition: { duration: 0.2 },
      boxShadow: isDark 
        ? '0 20px 40px -10px rgba(0,0,0,0.5)' 
        : '0 20px 40px -10px rgba(0,0,0,0.1)'
    }
  }

  return (
    <motion.article 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={handleCardClick}
      className={`
        group rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300
        flex flex-col h-full 
        
        /* ✅ توحيد الارتفاع: حد أدنى ثابت للبطاقة */
        min-h-[480px] 
        
        ${isDark 
          ? 'bg-gray-800 border-gray-700 hover:border-brand-secondary/30' 
          : 'bg-white border-slate-100 hover:border-brand-primary/20 hover:shadow-xl'
        }
        focus-within:ring-2 focus-within:ring-brand-secondary focus-within:ring-offset-2
        ${isRTL ? 'rtl' : 'ltr'}
      `}
      role="article"
      aria-labelledby={`lecture-title-${lecture?.id}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={currentLang}
    >
      {/* === الشريط العلوي: الحالة + زر المفضلة === */}
      <div className="flex items-center justify-between p-4 pb-2">
        {lecture?.status && lecture.status !== 'APPROVED' && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`
              px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
              ${statusConfig[lecture.status]?.bg} ${statusConfig[lecture.status]?.text}
            `}
          >
            {statusConfig[lecture.status]?.label}
          </motion.span>
        )}
        
        {onBookmark && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onBookmark(lecture?.id) }}
            className={`
              p-2 rounded-full transition-all duration-200
              ${isBookmarked 
                ? (isDark ? 'text-amber-400 bg-amber-900/30 hover:bg-amber-900/50' : 'text-amber-500 bg-amber-50 hover:bg-amber-100')
                : (isDark ? 'text-gray-500 hover:text-amber-400 hover:bg-gray-700' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50')
              }
            `}
            aria-label={isBookmarked ? t('lectures.unbookmark') : t('lectures.bookmark')}
            aria-pressed={isBookmarked}
          >
            {isBookmarked ? <FaBookmarkSolid size={16} /> : <FaBookmark size={16} />}
          </motion.button>
        )}
      </div>

      {/* === منطقة المرفق: صورة أو أيقونة PDF === */}
      <div className="px-4">
        <motion.div 
          className={`
            aspect-video w-full rounded-2xl overflow-hidden border relative
            ${isDark 
              ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 group-hover:border-brand-secondary/30' 
              : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-100 group-hover:border-brand-primary/30'
            }
          `}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {lecture?.attachmentType === 'pdf' ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
              <motion.div 
                className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm
                  ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-gradient-to-br from-red-50 to-red-100 text-red-500'}
                `}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <FaFilePdf size={24} />
              </motion.div>
              <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                {t('lectures.pdfAttachment')}
              </span>
            </div>
          ) : (
            <>
              <img 
                src={lecture?.attachmentUrl || '/images/placeholder-lecture.jpg'} 
                alt={getLocalizedText(lecture?.title, currentLang) || t('lectures.placeholderAlt')}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/20 to-transparent" />
            </>
          )}
        </motion.div>
      </div>

      {/* === المحتوى النصي === */}
      <div className="flex-1 flex flex-col p-4 pt-3">
        {/* معلومات المحاضر والتاريخ === */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div 
            className={`
              w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center border overflow-hidden
              ${isDark 
                ? 'bg-brand-secondary/20 border-brand-secondary/30' 
                : 'bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 border-brand-secondary/20'
              }
            `}
            whileHover={{ scale: 1.1 }}
          >
            {lecture?.author?.avatar ? (
              <img 
                src={lecture.author.avatar} 
                alt={getLocalizedText(lecture?.speaker, currentLang)} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className={`font-bold text-sm ${isDark ? 'text-brand-secondary' : 'text-brand-primary'}`}>
                {getLocalizedText(lecture?.speaker, currentLang)?.charAt(0) || 'م'}
              </span>
            )}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {getLocalizedText(lecture?.speaker, currentLang)}
            </h4>
            <p className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
              <FaClock size={10} /> 
              <time dateTime={lecture?.createdAt}>
                {formatDate(lecture?.createdAt, currentLang)}
              </time>
            </p>
          </div>
        </div>

        {/* العنوان === */}
        <h3 
          id={`lecture-title-${lecture?.id}`}
          className={`font-bold text-lg mb-2 leading-snug transition-colors line-clamp-2
                     ${isDark ? 'text-white group-hover:text-brand-secondary' : 'text-slate-900 group-hover:text-brand-primary'}`}
        >
          {getLocalizedText(lecture?.title, currentLang)}
        </h3>
        
        {/* الملخص (محدد بـ 3 أسطر لتوحيد الطول) === */}
        <p className={`text-sm line-clamp-3 leading-relaxed mb-4 flex-1 ${isDark ? 'text-gray-300' : 'text-slate-500'}`}>
          {getLocalizedText(lecture?.summary, currentLang) || t('lectures.noSummary')}
        </p>

        {/* الوسوم === */}
        {lecture?.category && (
          <div className="mb-4">
            <Tag variant="accentSoft" className="text-[10px] px-2.5 py-1">
              {getLocalizedText(lecture.category, currentLang)}
            </Tag>
          </div>
        )}
      </div>

      {/* === الفوتر: الإحصائيات والإجراءات === */}
      {/* ✅ mt-auto تضمن بقاء الفوتر في أسفل البطاقة دائماً */}
      <div className={`mt-auto px-4 pb-4 pt-2 border-t ${isDark ? 'border-gray-700' : 'border-slate-100'}`}>
        <div className="flex items-center justify-between">
          {/* الإحصائيات === */}
          <div className={`flex items-center gap-3 text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className={`flex items-center gap-1.5 transition-colors cursor-default ${isDark ? 'hover:text-red-400' : 'hover:text-red-500'}`} 
              title={t('lectures.likes')}
            >
              <FaHeart size={12} /> {lecture?.likes || 0}
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className={`flex items-center gap-1.5 transition-colors cursor-default ${isDark ? 'hover:text-brand-secondary' : 'hover:text-brand-primary'}`} 
              title={t('lectures.comments')}
            >
              <FaComment size={12} /> {lecture?.commentsCount || 0}
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className={`flex items-center gap-1.5 transition-colors cursor-default ${isDark ? 'hover:text-brand-secondary' : 'hover:text-brand-secondary'}`} 
              title={t('lectures.views')}
            >
              <FaEye size={12} /> {lecture?.views || 0}
            </motion.span>
          </div>

          {/* زر مشاهدة سريع === */}
          <Button
            variant="ghost"
            size="sm"
            className={`!px-3 !py-1.5 text-xs ${isDark ? 'text-brand-secondary hover:bg-brand-secondary/20' : 'text-brand-primary hover:bg-brand-primary/10'}`}
            onClick={(e) => { e.stopPropagation(); navigate(`/lecture-detail/${lecture?.id}`) }}
            iconPosition="end"
          >
            {t('lectures.viewDetails')}
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

export default LectureCard