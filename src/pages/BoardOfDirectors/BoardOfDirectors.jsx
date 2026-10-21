// src/pages/BoardOfDirectors/BoardOfDirectors.jsx
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEdit, FaTrash, FaPlus, FaSave, FaTimes, 
  FaUsers, FaImages, FaMoon, FaSun 
} from 'react-icons/fa';

// === Redux ===
import { addBoard, updateBoard, deleteBoard } from '../../store/slices/boardSlice';

// === مكونات واجهة المستخدم المشتركة ✅ ===
import SectionHeader from '../../components/ui/SectionHeader';
import BackButton from '../../components/BackButton';
import Tag from '../../components/ui/Tag';
import ImageCarousel from '../../components/ui/ImageCarousel';
import ImageUploader from '../../components/ui/ImageUploader';
import LocalizedContentInput from '../../components/ui/LocalizedContentInput';
import EditableWrapper from '../../components/ui/EditableWrapper';

// === أدوات ===
import { getLocalizedText } from '../../utils/i18n-helpers';
import { SITE_CONFIG } from '../../config/siteConfig';
import { useTheme } from '../../context/ThemeContext';

const BoardOfDirectors = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();
  
  const { boards, loading, error } = useSelector(state => state.board);
  const user = useSelector(state => state.user?.user);
  const isAdmin = user?.role === 'ADMIN';

  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';

  const [isEditing, setIsEditing] = useState(false);
  const [activeBoard, setActiveBoard] = useState(null);

  // ✅ ضمان أن boards مصفوفة دائماً
  const safeBoards = useMemo(() => {
    if (!boards) return [];
    if (!Array.isArray(boards)) return [];
    return boards;
  }, [boards]);

  // === معالجة الحفظ ===
  const handleSave = useCallback(() => {
    if (activeBoard?.id) {
      dispatch(updateBoard({ id: activeBoard.id, updatedData: activeBoard }));
      setIsEditing(false);
      setActiveBoard(null);
    }
  }, [dispatch, activeBoard]);

  // === إضافة مجلس جديد ===
  const handleAddNew = useCallback(() => {
    const newBoard = {
      id: Date.now(),
      year: { ar: '2024-2026', en: '2024-2026' },
      period: { 
        ar: currentLang === 'ar' ? 'الدورة الجديدة' : 'New Term',
        en: currentLang === 'ar' ? 'New Term' : 'الدورة الجديدة'
      },
      president: { ar: '', en: '' },
      vicePresident: { ar: '', en: '' },
      secretary: { ar: '', en: '' },
      treasurer: { ar: '', en: '' },
      members: [],
      images: []
    };
    dispatch(addBoard(newBoard));
  }, [dispatch, currentLang]);

  // === أنيميشن العناصر ===
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`
        py-6 px-4 sm:px-6 lg:px-18 min-h-screen transition-colors duration-300
        ${isDark ? 'bg-gray-900' : 'bg-background'}
      `}
    >
      <div className="max-w-7xl mx-auto space-y-3">
        <BackButton />
        
        {/* === Header Section === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`
            flex flex-col lg:flex-row items-center justify-between gap-8 
            p-8 rounded-[2.5rem] border shadow-soft relative overflow-hidden
            ${isDark 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-surface border-slate-200'
            }
          `}
        >

          <SectionHeader 
            pageKey="boardOfDirectors"
            section="header"
            editable={isAdmin}
            className="mb-6 space-y-6 flex-1 z-10"
          />
          
          {/* شعار الجمعية */}
          <img 
            src={SITE_CONFIG.identity.logo} 
            alt={SITE_CONFIG.identity.name[currentLang]} 
            className={`
              w-36 lg:w-40 h-auto opacity-90 drop-shadow-sm z-10 transition-transform
              hover:scale-105
            `}
          />
        </motion.div>

        {/* === زر إضافة مجلس جديد === */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button 
              onClick={handleAddNew} 
              className={`
                flex items-center gap-3 px-8 py-4 rounded-full 
                font-bold transition-all duration-200 shadow-lg active:scale-95
                bg-brand-secondary text-white hover:bg-brand-secondaryHover
              `}
            >
              <FaPlus /> {t(SITE_CONFIG.board.actions.addNew)}
            </button>
          </motion.div>
        )}

        {/* === حالة التحميل === */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-secondary border-t-transparent" />
          </div>
        )}

        {/* === حالة الخطأ === */}
        {error && !loading && (
          <div className={`
            p-4 rounded-xl text-center
            ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}
          `}>
            <p className="font-bold">⚠️ {error}</p>
            <button 
              onClick={() => dispatch({ type: 'board/setError', payload: null })}
              className="mt-2 text-sm underline hover:no-underline"
            >
              {t('common.retry') || 'إعادة المحاولة'}
            </button>
          </div>
        )}

        {/* === قائمة مجالس الإدارة === */}
        {!loading && !error && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-8"
          >
            {safeBoards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`
                  text-center py-16 rounded-2xl border-2 border-dashed
                  ${isDark ? 'border-gray-700 text-gray-400' : 'border-slate-200 text-slate-400'}
                `}
              >
                <FaUsers size={40} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-bold mb-2">
                  {t(SITE_CONFIG.board.labels.emptyList) || 'لا توجد مجالس مسجلة حالياً'}
                </p>
                <p className="text-sm mb-4">
                  {isAdmin 
                    ? t(SITE_CONFIG.board.labels.emptyListAdmin) || 'اضغط على "إضافة مجلس جديد" للبدء'
                    : t(SITE_CONFIG.board.labels.emptyListUser) || 'سيتم عرض المجالس هنا عند إضافتها'
                  }
                </p>
              </motion.div>
            ) : (
              safeBoards.map((board) => (
                <EditableWrapper
                  key={board.id}
                  isAdmin={isAdmin}
                  onEdit={() => { setActiveBoard(board); setIsEditing(true); }}
                  className={`group relative overflow-hidden rounded-[2rem] border shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${isDark ? 'border-gray-700 bg-gray-800' : 'border-slate-200 bg-white'}`}
                  editButtonPosition="top-end"
                >
                  <div className="relative">
                    <div className="h-1.5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary" />
                    {/* أزرار الحذف (للمشرفين) */}
                    {isAdmin && (
                      <div className={`
                        absolute ${isRTL ? 'right-16' : 'left-16'} top-4 
                        flex gap-2 z-20 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-200
                      `}>
                        <button 
                          onClick={() => dispatch(deleteBoard(board.id))} 
                          className={`
                            p-2.5 rounded-xl transition-all duration-200
                            ${isDark 
                              ? 'bg-red-900/30 text-red-400 hover:bg-red-600 hover:text-white' 
                              : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                            }
                          `}
                          title={t(SITE_CONFIG.board.actions.delete)}
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    )}

                    {/* التخطيط الرئيسي */}
                    <div className="flex flex-col gap-0 lg:flex-row lg:items-stretch">
                      
                      {/* === قسم الصور === */}
                      <div className="w-full lg:w-2/5 xl:w-1/3 lg:border-e lg:border-slate-200 lg:dark:border-gray-700">
                        {(board.images?.length ?? 0) > 0 ? (
                          <div className={`
                            relative aspect-[4/3] overflow-hidden
                            ${isDark ? 'bg-gray-700' : 'bg-slate-100'}
                          `}>
                            <ImageCarousel 
                              items={(board.images || []).map(img => ({ imageUrl: img }))} 
                              SlideComponent={({ imageUrl }) => (
                                <img src={imageUrl} className="w-full h-full object-cover" alt="board activity" />
                              )}
                            />
                          </div>
                        ) : (
                          <div className={`
                            w-full aspect-[4/3]
                            flex flex-col items-center justify-center 
                            border-b-2 border-dashed lg:border-b-0 lg:border-e-2
                            ${isDark ? 'bg-gray-700/30 border-gray-600 text-gray-500' : 'bg-slate-50 border-slate-200 text-slate-300'}
                          `}>
                            <FaImages size={30} className="mb-2" />
                            <span className="text-xs font-medium">{t(SITE_CONFIG.board.labels.noImages)}</span>
                          </div>
                        )}
                      </div>

                      {/* === قسم البيانات === */}
                      <div className="w-full flex-1 space-y-7 p-6 md:p-8">
                        {/* رأس البطاقة */}
                        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5 dark:border-gray-700">
                          <div>
                            <div className="mb-3 flex items-center gap-2">
                              <Tag variant="accent" className="px-3 py-1.5">
                                <FaUsers className="me-1" /> {t(SITE_CONFIG.board.header.titleKey)}
                              </Tag>
                              <span className="text-xs font-bold text-brand-secondary">
                                {getLocalizedText(board.period, currentLang)}
                              </span>
                            </div>
                            <h2 className={`text-2xl font-black tracking-tight md:text-3xl ${isDark ? 'text-white' : 'text-slate-800'}`}>
                              {getLocalizedText(board.year, currentLang)}
                            </h2>
                          </div>
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? 'bg-brand-secondary/15 text-brand-secondary' : 'bg-brand-primary/10 text-brand-primary'}`}>
                            <FaUsers size={20} />
                          </div>
                        </div>

                        {/* شبكة المعلومات - باستخدام مكون مشترك قابل لإعادة الاستخدام */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {[
                            { label: SITE_CONFIG.board.labels.president, value: board.president, isMain: true },
                            { label: SITE_CONFIG.board.labels.vicePresident, value: board.vicePresident },
                            { label: SITE_CONFIG.board.labels.secretary, value: board.secretary },
                            { label: SITE_CONFIG.board.labels.treasurer, value: board.treasurer },
                          ].map((field, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className={`
                                rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5
                                ${isDark 
                                  ? 'bg-gray-900/50 border-gray-700 hover:border-brand-secondary/50' 
                                  : 'bg-slate-50 border-slate-100 hover:border-brand-secondary/30'
                                }
                              `}
                            >
                              <p className={`mb-1 text-[10px] font-black uppercase tracking-[0.12em] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                {t(field.label)}
                              </p>
                              <p className={`text-sm font-bold transition-colors md:text-base
                                ${field.isMain ? 'text-brand-secondary' : (isDark ? 'text-gray-200' : 'text-slate-700')}
                              `}>
                                {getLocalizedText(field.value, currentLang) || '---'}
                              </p>
                            </motion.div>
                          ))}
                        </div>

                        {/* الأعضاء */}
                        {(board.members?.length ?? 0) > 0 && (
                          <div className="pt-4">
                            <p className={`mb-3 text-[10px] font-black uppercase tracking-widest
                              ${isDark ? 'text-gray-500' : 'text-slate-400'}
                            `}>
                              {t(SITE_CONFIG.board.labels.members)}
                            </p>
                            <div className={`rounded-2xl border p-4 ${isDark ? 'border-gray-700 bg-gray-900/40' : 'border-slate-100 bg-slate-50/70'}`}>
                              <div className="flex flex-wrap gap-2">
                              {(board.members || []).map((member, i) => (
                                <Tag key={i} variant="accentSoft" className="px-4 py-1.5 text-sm rounded-lg shadow-sm">
                                  {getLocalizedText(member, currentLang)}
                                </Tag>
                              ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </EditableWrapper>
              ))
            )}
          </motion.div>
        )}

        {/* === Modal التعديل (للمشرفين) === */}
        <AnimatePresence>
          {isEditing && activeBoard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
              onClick={() => setIsEditing(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`
                  w-full max-w-4xl rounded-[2.5rem] p-6 md:p-8 shadow-2xl 
                  max-h-[90vh] overflow-y-auto
                  ${isDark ? 'bg-gray-800' : 'bg-white'}
                `}
              >
                {/* رأس المودال */}
                <div className={`flex justify-between items-center mb-6 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-slate-100'}`}>
                  <h2 className={`
                    text-xl font-black flex items-center gap-3
                    ${isDark ? 'text-white' : 'text-slate-800'}
                  `}>
                    <FaEdit className="text-brand-secondary" /> 
                    {t(SITE_CONFIG.board.actions.edit)}
                  </h2>
                  <button 
                    onClick={() => setIsEditing(false)} 
                    type="button"
                    aria-label={t(SITE_CONFIG.board.actions.cancel)}
                    className={`
                      relative z-10 p-2 rounded-xl transition-colors
                      ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}
                    `}
                  >
                     <FaTimes size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* إدارة الصور */}
                  <div className="space-y-4">
                    <label className={`block text-sm font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      {t('board.images') || 'الصور'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(activeBoard.images || []).map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                          <img src={img} className="w-full h-full object-cover" alt={`board-${idx}`} />
                          <button 
                            onClick={() => {
                              const newImages = (activeBoard.images || []).filter((_, i) => i !== idx);
                              setActiveBoard({...activeBoard, images: newImages});
                            }}
                            className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                      <ImageUploader 
                        onUpload={(data) => setActiveBoard({
                          ...activeBoard, 
                          images: [...(activeBoard.images || []), data]
                        })} 
                        labelKey={SITE_CONFIG.board.actions.addImage}
                      />
                    </div>
                  </div>
{/* حقول النص ثنائية اللغة - باستخدام المكون المشترك ✅ */}
<div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
  <LocalizedContentInput 
    label={t(SITE_CONFIG.board.labels.year)}
    value={activeBoard.year}
    showBothLanguages={true}
    onChange={(val) => setActiveBoard(prev => ({ ...prev, year: val }))}
    placeholder={{ 
      ar: t('board.placeholders.year'), 
      en: t('board.placeholders.yearEn') 
    }}
  />
  <LocalizedContentInput 
    label={t(SITE_CONFIG.board.labels.president)}
    value={activeBoard.president}
    showBothLanguages={true}
    onChange={(val) => setActiveBoard(prev => ({ ...prev, president: val }))}
    placeholder={{ 
      ar: t('board.placeholders.president'), 
      en: t('board.placeholders.presidentEn') 
    }}
  />
  <LocalizedContentInput 
    label={t(SITE_CONFIG.board.labels.vicePresident)}
    value={activeBoard.vicePresident}
    showBothLanguages={true}
    onChange={(val) => setActiveBoard(prev => ({ ...prev, vicePresident: val }))}
  />
  <LocalizedContentInput 
    label={t(SITE_CONFIG.board.labels.secretary)}
    value={activeBoard.secretary}
    showBothLanguages={true}
    onChange={(val) => setActiveBoard(prev => ({ ...prev, secretary: val }))}
  />
  <LocalizedContentInput 
    label={t(SITE_CONFIG.board.labels.treasurer)}
    value={activeBoard.treasurer}
    showBothLanguages={true}
    onChange={(val) => setActiveBoard(prev => ({ ...prev, treasurer: val }))}
  />
  
  {/* الأعضاء - مصفوفة مع إعادة ترتيب ✅ */}
  <div className="md:col-span-2">
    <LocalizedContentInput 
      label={t(SITE_CONFIG.board.labels.members)}
      value={activeBoard.members}
      onChange={(val) => setActiveBoard(prev => ({ ...prev, members: val }))}
      mode="array"
      showReorder={true}
      placeholder={{ 
        ar: t('board.placeholders.member'), 
        en: t('board.placeholders.memberEn') 
      }}
    />
  </div>
</div>
                </div>

                {/* أزرار الحفظ */}
                <div className={`flex justify-end gap-3 mt-8 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-slate-100'}`}>
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className={`
                      px-6 py-2.5 rounded-xl font-bold transition-colors
                      ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}
                    `}
                  >
                    {t(SITE_CONFIG.board.actions.cancel)}
                  </button>
                  <button 
                    onClick={handleSave} 
                    className="flex items-center gap-2 px-8 py-2.5 bg-brand-secondary text-white rounded-xl shadow-lg font-bold hover:bg-brand-secondaryHover transition-all"
                  >
                    <FaSave /> {t(SITE_CONFIG.board.actions.save)}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BoardOfDirectors;