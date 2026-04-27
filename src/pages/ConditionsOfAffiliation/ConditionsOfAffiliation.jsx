// src/pages/ConditionsOfAffiliation/ConditionsOfAffiliation.jsx
import { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTrash, FaFileUpload, FaPlus, FaSave, FaTimes, 
  FaMoon, FaSun, FaImages, FaEdit 
} from 'react-icons/fa';

// === Redux ===
import { 
  addImage, 
  deleteImage, 
  deleteArticle, 
  addArticle, 
  updateArticle 
} from '../../store/slices/conditionsSlice';

// === مكونات مشتركة ===
import SectionHeader from '../../components/ui/SectionHeader';
import InfoBubble from '../../components/ui/InfoBubble';
import EditableWrapper from '../../components/ui/EditableWrapper';
import LocalizedContentInput from '../../components/ui/LocalizedContentInput';
import ImageUploader from '../../components/ui/ImageUploader';

// === أدوات ===
import { SITE_CONFIG } from '../../config/siteConfig';
import { getLocalizedText } from '../../utils/i18n-helpers';
import ImageCarousel from '../../components/ui/ImageCarousel';

// === أنيميشن العناصر ===
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const ConditionsOfAffiliation = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();
  
  const { articles, carouselImages } = useSelector((state) => state.conditions);
  const user = useSelector((state) => state.user?.user);
  const isAdmin = user?.role === 'ADMIN';

  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';

  const [isEditing, setIsEditing] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);

  // === إضافة مادة جديدة ===
  const handleAddArticle = useCallback(() => {
    const newArticle = {
      id: Date.now(),
      title: { 
        ar: t('conditions.articleTitlePlaceholder.ar'), 
        en: t('conditions.articleTitlePlaceholder.en') 
      },
      content: [{ 
        ar: t('conditions.articleContentPlaceholder.ar'), 
        en: t('conditions.articleContentPlaceholder.en') 
      }],
      type: 'list-bullet'
    };
    dispatch(addArticle(newArticle));
  }, [dispatch, t]);

  // === حفظ تعديل مادة ===
  const handleSaveUpdate = useCallback(() => {
    if (activeArticle?.id) {
      dispatch(updateArticle({ 
        id: activeArticle.id, 
        updatedData: activeArticle 
      }));
      setIsEditing(false);
      setActiveArticle(null);
    }
  }, [dispatch, activeArticle]);

  // === حذف صورة ===
  const handleDeleteImage = useCallback((id) => {
    if (window.confirm(t('conditions.deleteImage'))) {
      dispatch(deleteImage(id));
    }
  }, [dispatch, t]);

  // === حذف مادة ===
  const handleDeleteArticle = useCallback((id) => {
    if (window.confirm(t('conditions.deleteConfirm'))) {
      dispatch(deleteArticle(id));
    }
  }, [dispatch, t]);

  // === استخراج نصوص الهيدر ===
  const headerTexts = useMemo(() => ({
    eyebrow: t('conditions.eyebrow'),
    title: t('conditions.title'),
    description: t('conditions.description'),
  }), [t]);

  return (
    <section 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`
        py-12 min-h-screen transition-colors duration-300
        ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-background to-slate-50'}
      `}
    >
      <div className="container mx-auto px-4 lg:px-20">
        
        {/* === الحاوية الرئيسية === */}
        <div className={`
          relative overflow-hidden rounded-[2.5rem] border p-8 md:p-16 shadow-soft
          ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-slate-200'}
        `}>
          
          {/* عناصر زخرفية === */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`
              absolute -top-32 -left-32 w-72 h-72 rounded-full blur-3xl opacity-30
              ${isDark ? 'bg-brand-primary/20' : 'bg-brand-primary/10'}
            `} />
          </div>


          {/* === قسم الهيدر === */}
          <div className="relative mb-12">
            <SectionHeader 
              pageKey="conditions"
              section="header"
              editable={isAdmin}
              className="text-right"
            />
          </div>

          {/* === الكاروسيل وإدارة الصور === */}
          <div className="mb-16 max-w-4xl mx-auto">
            <div className={`
              rounded-[2rem] border-4 shadow-xl overflow-hidden
              ${isDark ? 'border-gray-700 bg-gray-800' : 'border-slate-100 bg-white'}
            `}>
              {carouselImages?.length > 0 ? (
                <ImageCarousel 
                  items={carouselImages} 
                  SlideComponent={({ imageUrl, alt }) => (
                    <div className="flex h-full w-full items-center justify-center bg-white dark:bg-gray-900">
                      <img 
                        src={imageUrl} 
                        alt={getLocalizedText(alt, currentLang)} 
                        className="h-full w-full object-contain p-4" 
                      />
                    </div>
                  )} 
                />
              ) : (
                <div className={`
                  flex h-64 items-center justify-center
                  ${isDark ? 'text-gray-400' : 'text-slate-400'}
                `}>
                  <div className="text-center">
                    <FaImages size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">{t('conditions.noImages')}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* إدارة الصور للمشرفين === */}
            {isAdmin && (
              <EditableWrapper
                isAdmin={isAdmin}
                onEdit={() => {}}
                className="mt-6"
                editButtonPosition="top-end"
                showButton ={false}
              >
                <div className={`
                  p-4 border-2 border-dashed rounded-2xl flex flex-wrap gap-4 items-center
                  ${isDark ? 'border-gray-600 bg-gray-700/30' : 'border-slate-200 bg-slate-50'}
                `}>
                  {carouselImages?.map((img) => (
                    <div key={img.id} className="relative w-20 h-24 border rounded-lg overflow-hidden group/item">
                      <img src={img.imageUrl} className="w-full h-full object-cover" alt={getLocalizedText(img.alt, currentLang)} />
                      <button 
                        onClick={() => handleDeleteImage(img.id)} 
                        className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover/item:opacity-100 transition flex items-center justify-center rounded-lg"
                        aria-label={t('conditions.deleteImage')}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                  <ImageUploader 
                    onUpload={(data) => dispatch(addImage({ 
                      imageUrl: data, 
                      alt: { ar: 'صورة وثيقة', en: 'Document Image' } 
                    }))} 
                    label={t('conditions.uploadLabel')}
                    className="w-max"
                  />
                </div>
              </EditableWrapper>
            )}
          </div>

          {/* === المواد القانونية === */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-8"
          >
            {articles?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`
                  text-center py-12 rounded-2xl border-2 border-dashed
                  ${isDark ? 'border-gray-700 text-gray-400' : 'border-slate-200 text-slate-400'}
                `}
              >
                <FaFileUpload size={40} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-bold mb-2">{t('conditions.noArticles')}</p>
                <p className="text-sm mb-4">{t('conditions.addFirst')}</p>
                {isAdmin && (
                  <button 
                    onClick={handleAddArticle}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-secondary text-white text-sm font-bold hover:bg-brand-secondaryHover transition"
                  >
                    <FaPlus size={14} /> {t('conditions.addArticle')}
                  </button>
                )}
              </motion.div>
            ) : (
              articles.map((article, index) => (
                <motion.div key={article.id} variants={itemVariants}>
                  <InfoBubble
                    data={{
                      ...article,
                      title: getLocalizedText(article.title, currentLang),
                      content: article.content?.map(item => getLocalizedText(item, currentLang)) || []
                    }}
                    isAdmin={isAdmin}
                    variant={index % 2 === 0 ? 'primary' : 'accent'}
                    onUpdate={() => {
                      setActiveArticle(article);
                      setIsEditing(true);
                    }}
                    onDelete={() => handleDeleteArticle(article.id)}
                  />
                </motion.div>
              ))
            )}
          </motion.div>

          {/* === زر إضافة مادة (للمشرفين) === */}
          {isAdmin && articles?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 flex justify-center border-t pt-10"
            >
              <button 
                onClick={handleAddArticle} 
                className={`
                  flex items-center gap-2 px-8 py-4 rounded-full font-bold transition shadow-lg hover:-translate-y-0.5
                  ${isDark 
                    ? 'bg-brand-secondary text-white hover:bg-brand-secondaryHover' 
                    : 'bg-brand-secondary text-white hover:bg-brand-secondaryHover'
                  }
                `}
              >
                <FaPlus size={14} /> {t('conditions.addArticle')}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* === مودال تعديل المادة === */}
      <AnimatePresence>
        {isEditing && activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto
                ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-slate-200'}
              `}
            >
              {/* رأس المودال === */}
              <div className={`flex justify-between items-center mb-6 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-slate-100'}`}>
                <h2 className={`text-xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <span className="p-2 rounded-lg bg-brand-secondary/20 text-brand-secondary">
                    <FaEdit size={16} />
                  </span>
                  {t('conditions.editArticle')}
                </h2>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className={`p-2.5 rounded-xl transition ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                  aria-label={t('conditions.cancel')}
                >
                  <FaTimes size={18} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* عنوان المادة === */}
                <LocalizedContentInput 
                  label={t('conditions.articleTitle')}
                  value={activeArticle.title}
                  onChange={(val) => setActiveArticle(prev => ({ ...prev, title: val }))}
                  placeholder={{ 
                    ar: t('conditions.articleTitlePlaceholder.ar'), 
                    en: t('conditions.articleTitlePlaceholder.en') 
                  }}
                />

                {/* محتوى المادة (قائمة) === */}
                <LocalizedContentInput 
                  label={t('conditions.articleContent')}
                  value={activeArticle.content}
                  onChange={(val) => setActiveArticle(prev => ({ ...prev, content: val }))}
                  mode="array"
                  showReorder={true}
                  placeholder={{ 
                    ar: t('conditions.articleContentPlaceholder.ar'), 
                    en: t('conditions.articleContentPlaceholder.en') 
                  }}
                />

                {/* نوع العرض === */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    {t('conditions.displayType')}
                  </label>
                  <select
                    value={activeArticle.type || 'list-bullet'}
                    onChange={(e) => setActiveArticle(prev => ({ ...prev, type: e.target.value }))}
                    className={`
                      w-full p-3 rounded-xl border outline-none transition-all text-sm
                      ${isDark 
                        ? 'bg-gray-700/50 border-gray-600 text-white focus:border-brand-secondary' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-brand-secondary'
                      }
                    `}
                  >
                    <option value="list-bullet">{t('conditions.displayTypes.bullet')}</option>
                    <option value="list-number">{t('conditions.displayTypes.number')}</option>
                    <option value="paragraph">{t('conditions.displayTypes.paragraph')}</option>
                  </select>
                </div>
              </div>

              {/* أزرار الحفظ === */}
              <div className={`flex justify-end gap-3 mt-8 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-slate-100'}`}>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className={`px-6 py-2.5 rounded-xl font-bold transition ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                >
                  {t('conditions.cancel')}
                </button>
                <button 
                  onClick={handleSaveUpdate} 
                  className="flex items-center gap-2 px-7 py-2.5 bg-brand-secondary text-white rounded-xl shadow-lg font-bold hover:bg-brand-secondaryHover transition-all hover:shadow-brand-secondary/25"
                >
                  <FaSave size={14} /> {t('conditions.save')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ConditionsOfAffiliation;