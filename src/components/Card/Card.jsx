// src/components/Card/Card.jsx
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext' // ✅ استيراد useTheme
import { FaClock, FaEye, FaHeart, FaComment } from 'react-icons/fa'

// === مكون المشاركة القابل لإعادة الاستخدام ===
import ShareButtons from './../ui/ShareButtons'

const Card = ({ 
  id, 
  title, 
  description, 
  image, 
  date, 
  type, 
  shareUrl, 
  loading,
  // === Props جديدة للأخبار ===
  views = 0,
  likes = 0,
  commentsCount = 0,
  isNews = false,
  isDark: propIsDark, // ✅ السماح بتمرير isDark يدوياً
}) => {
  const { i18n } = useTranslation()
  const { isDark: themeIsDark } = useTheme() // ✅ استخراج من ThemeContext
  const isDark = propIsDark ?? themeIsDark // ✅ الأولوية للـ prop إن وُجد
  const currentLang = i18n?.language || 'ar'
  const [imgLoaded, setImgLoaded] = useState(false)

  // === دالة آمنة لاستخراج نص ثنائي اللغة ===
  const getText = useMemo(() => (val, fallback = '') => {
    if (!val) return fallback
    if (typeof val === 'string') return val
    if (typeof val === 'object') {
      return val[currentLang] || val.ar || val.en || fallback
    }
    return String(val)
  }, [currentLang])

  // === Skeleton Loading ===
  if (loading) {
    return (
      <div className={`
        break-inside-avoid mb-6 rounded-3xl animate-pulse h-64
        ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
      `} />
    )
  }

  const cardUrl = shareUrl || `${window.location.origin}/${isNews ? 'news-details' : 'lecture-detail'}/${id}`
  const cardTitle = getText(title, 'بدون عنوان')
  const cardDescription = getText(description, '')
  const cardType = getText(type, '')

  return (
    <Link to={isNews ? `/news-details/${id}` : `/lecture-detail/${id}`} className="block group">
      <article 
        className={`
          break-inside-avoid mb-6 overflow-hidden rounded-3xl 
          border shadow-sm transition-all duration-300 
          hover:-translate-y-1
          ${isDark 
            ? 'bg-gray-800 border-gray-700 hover:border-brand-secondary/30 hover:shadow-gray-700/50' 
            : 'bg-white border-gray-100 hover:border-brand-primary/20 hover:shadow-brand-primary/10'
          }
        `}
      >
        {/* === الصورة === */}
        {image && (
          <div className={`relative overflow-hidden ${isNews ? '' : 'aspect-video'}`}>
            {!imgLoaded && (
              <div className={`absolute inset-0 animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            )}

            <img
              src={image}
              alt={cardTitle}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className={`
                w-full ${isNews ? 'h-auto' : 'h-full object-cover'} transition-transform duration-500
                group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}
              `}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            
            {/* شارة النوع */}
            {cardType && (
              <span className={`
                absolute top-3 start-3 px-3 py-1 rounded-full 
                text-[10px] font-bold backdrop-blur-sm shadow-sm
                ${isDark 
                  ? 'bg-brand-secondary/90 text-white' 
                  : 'bg-brand-secondary/90 text-gray-900'
                }
              `}>
                {cardType}
              </span>
            )}
          </div>
        )}

        {/* === المحتوى === */}
        <div className="p-5">
          {/* التاريخ والإحصائيات === */}
          <div className="flex items-center justify-between mb-3">
            {date && (
              <time className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
                <FaClock size={12} />
                {date}
              </time>
            )}
            
            {/* إحصائيات للأخبار فقط === */}
            {isNews && (
              <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="flex items-center gap-1" title={isDark ? 'المشاهدات' : 'Views'}>
                  <FaEye size={12} /> {views}
                </span>
                <span className="flex items-center gap-1" title={isDark ? 'الإعجابات' : 'Likes'}>
                  <FaHeart size={12} /> {likes}
                </span>
                <span className="flex items-center gap-1" title={isDark ? 'التعليقات' : 'Comments'}>
                  <FaComment size={12} /> {commentsCount}
                </span>
              </div>
            )}
          </div>

          {/* العنوان */}
          <h2 className={`
            font-bold text-lg group-hover:text-brand-primary 
            transition-colors duration-200 line-clamp-2 leading-tight
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}>
            {cardTitle}
          </h2>

          {/* الوصف */}
          {cardDescription && (
            <p className={`mt-2 text-sm line-clamp-3 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {cardDescription}
            </p>
          )}

          {/* === أزرار المشاركة === */}
          <div 
            className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ShareButtons 
              url={cardUrl}
              title={cardTitle}
              variant="horizontal"
              showLabel={false}
              iconSize={18}
              className="justify-start"
              isDark={isDark} // ✅ تمرير isDark لـ ShareButtons
            />
          </div>
        </div>
      </article>
    </Link>
  )
}

export default Card