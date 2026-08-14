// src/pages/About/About.jsx
import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaSave, FaTimes, FaImage, FaMagic, 
  FaMoon, FaSun, FaUsers, FaLightbulb, FaEdit,
  FaLanguage
} from 'react-icons/fa';

// === Redux ===
import { updateSection, deleteSection, addSection } from '../../store/slices/aboutSlice';

// === مكونات مشتركة ===
import SectionHeader from '../../components/ui/SectionHeader';
import InfoBubble from '../../components/ui/InfoBubble';
import EditableWrapper from '../../components/ui/EditableWrapper';
import LocalizedContentInput from '../../components/ui/LocalizedContentInput';

// === أدوات ===
import { SITE_CONFIG } from '../../config/siteConfig';


// === أنيميشن العناصر ===
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const About = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();
  
  const { sections } = useSelector((state) => state.about);
  const user = useSelector((state) => state.user?.user);
  const isAdmin = user?.role === 'ADMIN';

  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';

  // === حالة تعديل الأقسام (فقاعات المحتوى) فقط ===
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  // === إضافة قسم جديد ===
  const handleAddNew = useCallback(() => {
    const newSection = {
      id: Date.now(),
      title: { ar: t('about.sectionTitlePlaceholder.ar'), en: t('about.sectionTitlePlaceholder.en') },
      content: [{ ar: t('about.contentItemPlaceholder.ar'), en: t('about.contentItemPlaceholder.en') }],
      type: 'list-bullet'
    };
    dispatch(addSection(newSection));
  }, [dispatch, t]);

  // === حفظ تعديل قسم ===
  const handleSaveSection = useCallback(() => {
    if (activeSection?.id) {
      dispatch(updateSection({ 
        id: activeSection.id, 
        updatedData: activeSection 
      }));
      setIsEditing(false);
      setActiveSection(null);
    }
  }, [dispatch, activeSection]);

  return (
    <section 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`
        py-8 md:py-12 min-h-screen transition-colors duration-300
        ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-background to-slate-50'}
      `}
    >
      <div className="container mx-auto px-4 lg:px-20">
        
        {/* === الحاوية الرئيسية === */}
        <EditableWrapper
          isAdmin={isAdmin}
          onEdit={() => {}}  // ✅ SectionHeader يدير التعديل داخلياً
          className="relative overflow-hidden rounded-[2.5rem] border shadow-2xl backdrop-blur-sm"
          editButtonPosition="top-end"
          editButtonLabel={t('about.editHeader')}
        >
          <div className={`
            relative p-6 md:p-10 lg:p-16
            ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-slate-200'}
          `}>
            
            {/* === عناصر زخرفية خلفية === */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className={`
                absolute -top-32 -left-32 w-72 h-72 rounded-full blur-3xl opacity-30
                ${isDark ? 'bg-brand-primary/20' : 'bg-brand-primary/10'}
              `} />
              <div className={`
                absolute -bottom-32 -right-32 w-72 h-72 rounded-full blur-3xl opacity-30
                ${isDark ? 'bg-brand-secondary/20' : 'bg-brand-secondary/10'}
              `} />
            </div>


            {/* === قسم الهيدر - باستخدام المكون المشترك ✅ === */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 mb-12 lg:mb-16"
            >
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                
                {/* ✅ SectionHeader يدير العرض والتعديل داخلياً */}
                <SectionHeader 
                  pageKey="about"              // 🔑 مفتاح المحتوى في SITE_CONFIG
                  section="header"             // 📦 قسم المحتوى
                  editable={isAdmin}           // ✅ السماح بالتعديل للمشرفين
                  className="w-full"           // 🎨 أنماط إضافية
                />
                
              </div>
              
              {/* === الشعار مع تأثيرات === */}
              <motion.div 
                className="relative group shrink-0"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`
                  absolute -inset-6 rounded-full bg-gradient-to-tr opacity-0 group-hover:opacity-100 transition duration-500 blur-2xl
                  ${isDark ? 'from-brand-secondary/40 to-brand-primary/40' : 'from-brand-secondary/20 to-brand-primary/20'}
                `} />
                
                <div className={`
                  relative p-1.5 rounded-full
                  ${isDark ? 'bg-gradient-to-br from-brand-secondary to-brand-primary' : 'bg-gradient-to-br from-accent to-accentSoft'}
                `}>
                  <div className={`p-1.5 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <img 
                      src={SITE_CONFIG.identity.logo} 
                      alt={SITE_CONFIG.identity.name[currentLang]} 
                      className="w-40 md:w-48 lg:w-52 h-auto drop-shadow-lg" 
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* === فاصل زخرفي === */}
            <div className={`
              relative h-px my-10
              ${isDark ? 'bg-gradient-to-r from-transparent via-gray-600 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-300 to-transparent'}
            `}>
              <div className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-16 h-16 rounded-full flex items-center justify-center
                ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-slate-200'}
              `}>
                <FaUsers className={isDark ? 'text-brand-secondary' : 'text-brand-primary'} size={20} />
              </div>
            </div>

            {/* === الأقسام الديناميكية (InfoBubbles) === */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 md:gap-8"
            >
              {sections.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`
                    text-center py-12 rounded-2xl border-2 border-dashed
                    ${isDark ? 'border-gray-700 text-gray-400' : 'border-slate-200 text-slate-400'}
                  `}
                >
                  <FaUsers size={40} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-bold mb-2">{t('about.noSections')}</p>
                  {isAdmin && (
                    <button 
                      onClick={handleAddNew}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-secondary text-white text-sm font-bold hover:bg-brand-secondaryHover transition"
                    >
                      <FaPlus size={14} /> {t('about.addBubble')}
                    </button>
                  )}
                </motion.div>
              ) : (
                sections.map((section, index) => (
                  <motion.div key={section.id} variants={itemVariants}>
                    <InfoBubble
                      data={section}
                      isAdmin={isAdmin}
                      variant={index % 2 === 0 ? 'primary' : 'accent'}
                      onUpdate={(id) => {
                        const sec = sections.find(s => s.id === id);
                        if (sec) {
                          setActiveSection(sec);
                          setIsEditing(true);
                        }
                      }}
                      onDelete={(id) => {
                        if (window.confirm(t('about.deleteConfirm'))) {
                          dispatch(deleteSection(id));
                        }
                      }}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* === شريط إجراءات المشرف === */}
            {isAdmin && sections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`
                  mt-12 pt-8 border-t flex flex-wrap gap-4 justify-center
                  ${isDark ? 'border-gray-700' : 'border-slate-200'}
                `}
              >
                <button 
                  onClick={handleAddNew}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all border-2
                    hover:-translate-y-0.5 active:translate-y-0
                    ${isDark 
                      ? 'border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white' 
                      : 'border-accent text-accent hover:bg-accent hover:text-white'
                    }
                  `}
                >
                  <FaPlus size={14} /> {t('about.addBubble')}
                </button>
              </motion.div>
            )}
          </div>
        </EditableWrapper>
      </div>

      {/* === مودال تعديل القسم (للفقاعات) === */}
      <AnimatePresence>
        {isEditing && activeSection && (
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
                  {t('about.editSection')}
                </h2>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className={`p-2.5 rounded-xl transition ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                  aria-label={t('about.cancel')}
                >
                  <FaTimes size={18} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* عنوان القسم === */}
                <LocalizedContentInput 
                  label={t('about.sectionTitle')}
                  value={activeSection.title}
                  onChange={(val) => setActiveSection(prev => ({ ...prev, title: val }))}
                  placeholder={{ 
                    ar: t('about.sectionTitlePlaceholder.ar'), 
                    en: t('about.sectionTitlePlaceholder.en') 
                  }}
                />

                {/* محتوى القسم (قائمة) === */}
                <LocalizedContentInput 
                  label={t('about.contentItems')}
                  value={activeSection.content}
                  onChange={(val) => setActiveSection(prev => ({ ...prev, content: val }))}
                  mode="array"
                  showReorder={true}
                  placeholder={{ 
                    ar: t('about.contentItemPlaceholder.ar'), 
                    en: t('about.contentItemPlaceholder.en') 
                  }}
                />

                {/* نوع العرض === */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    {t('about.displayType')}
                  </label>
                  <select
                    value={activeSection.type || 'list-bullet'}
                    onChange={(e) => setActiveSection(prev => ({ ...prev, type: e.target.value }))}
                    className={`
                      w-full p-3 rounded-xl border outline-none transition-all text-sm
                      ${isDark 
                        ? 'bg-gray-700/50 border-gray-600 text-white focus:border-brand-secondary' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-brand-secondary'
                      }
                    `}
                  >
                    <option value="list-bullet">{t('about.displayTypes.bullet')}</option>
                    <option value="list-number">{t('about.displayTypes.number')}</option>
                    <option value="paragraph">{t('about.displayTypes.paragraph')}</option>
                  </select>
                </div>
              </div>

              {/* أزرار الحفظ === */}
              <div className={`flex justify-end gap-3 mt-8 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-slate-100'}`}>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className={`px-6 py-2.5 rounded-xl font-bold transition ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                >
                  {t('about.cancel')}
                </button>
                <button 
                  onClick={handleSaveSection} 
                  className="flex items-center gap-2 px-7 py-2.5 bg-brand-secondary text-white rounded-xl shadow-lg font-bold hover:bg-brand-secondaryHover transition-all hover:shadow-brand-secondary/25"
                >
                  <FaSave size={14} /> {t('about.saveChanges')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;