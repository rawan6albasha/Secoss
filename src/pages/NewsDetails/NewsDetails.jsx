// src/pages/NewsDetails/NewsDetails.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaClock, FaUser, FaTag } from 'react-icons/fa';

// === أدوات مركزية ===
import { getLocalizedText, formatDate } from '../../utils/i18n-helpers';
import BackButton from '../../components/BackButton';
import ShareButtons from '../../components/ui/ShareButtons';
import { useTheme } from '../../context/ThemeContext';

const NewsDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { items } = useSelector(state => state.news);
  const { isDark } = useTheme();
  
  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';

  const newsItem = items?.find(n => n.id === Number(id) || n.id === id);

  if (!newsItem) {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-bold">
            {t('news.notFound') || 'عذراً، لم يتم العثور على هذا الخبر'}
          </p>
          <BackButton className="mt-4" />
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = getLocalizedText(newsItem.title, currentLang);

  return (
    <section className={`
      min-h-screen py-8 sm:py-12 px-4 sm:px-6 transition-colors duration-300
      ${isDark ? 'bg-gray-900' : 'bg-gray-50'}
      ${isRTL ? 'font-arabic rtl' : 'font-sans ltr'}
    `}>
      <article className="
        max-w-4xl mx-auto rounded-3xl border shadow-brand-hover overflow-hidden transition-colors duration-300
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}
      ">
        
        {/* زر الرجوع */}
        <div className={`p-4 sm:p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <BackButton />
        </div>

        {/* صورة الخبر */}
        {newsItem.image && (
          <div className="relative">
            <img
              src={newsItem.image}
              alt={getLocalizedText(newsItem.title, currentLang)}
              className="w-full h-64 sm:h-96 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {/* المحتوى */}
        <div className="p-6 sm:p-10">
          {/* الهيدر */}
          <header className={`mb-8 pb-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <h1 className="
              text-2xl sm:text-4xl font-black mb-4
              leading-tight
              ${isDark ? 'text-white' : 'text-gray-900'}
            ">
              {getLocalizedText(newsItem.title, currentLang)}
            </h1>
            
            {/* معلومات الخبر */}
            <div className={`flex flex-wrap items-center gap-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
              <span className="flex items-center gap-1.5">
                <FaClock size={14} className="text-brand-primary" />
                {formatDate(newsItem.date, currentLang)}
              </span>
              
              {newsItem.type && (
                <span className="flex items-center gap-1.5">
                  <FaTag size={14} className="text-brand-secondary" />
                  {getLocalizedText(newsItem.type, currentLang)}
                </span>
              )}
              
              {newsItem.author && (
                <span className="flex items-center gap-1.5">
                  <FaUser size={14} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                  {getLocalizedText(newsItem.author, currentLang)}
                </span>
              )}
            </div>
          </header>

          {/* الوصف المختصر */}
          {newsItem.description && (
            <blockquote className="
              text-lg leading-relaxed mb-8 italic
              border-s-4 border-brand-secondary ps-4 sm:ps-6
              py-4 px-4 sm:px-6 rounded-e-xl
              ${isDark ? 'bg-brand-secondary/10 text-gray-200' : 'bg-brand-light/20 text-gray-600'}
            ">
              {getLocalizedText(newsItem.description, currentLang)}
            </blockquote>
          )}
          
          {/* المحتوى الرئيسي */}
          <div className="
            text-base sm:text-lg leading-relaxed max-w-none
            ${isDark ? 'text-gray-200 prose-invert' : 'text-gray-800 prose-gray'}
            [&>p]:mb-4 [&>p:last-child]:mb-0
            [&>ul]:list-disc [&>ul]:ps-6 [&>ul]:mb-4
            [&>ol]:list-decimal [&>ol]:ps-6 [&>ol]:mb-4
          ">
            {getLocalizedText(newsItem.content, currentLang)}
          </div>

          {/* المشاركة */}
          <div className="
            mt-10 pt-6 border-t
            flex flex-col sm:flex-row items-center justify-between gap-4
            ${isDark ? 'border-gray-700' : 'border-gray-100'}
          ">
            <ShareButtons 
              url={shareUrl} 
              title={shareTitle}
              variant="horizontal"
              showLabel={true}
              iconSize={22}
              isDark={isDark}
            />
            
            {/* معلومات إضافية */}
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
              {t('news.shareNote') || 'شارك هذا الخبر مع زملائك'}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default NewsDetails;