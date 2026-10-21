// src/components/modals/CreatePostModal/CreatePostModal.jsx
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaFilePdf, FaImage, FaLink, FaTrash, 
  FaPlus, FaEye, FaEyeSlash, FaBold, FaItalic, FaCalendar, FaChevronDown
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// === Redux Actions ===
import { addLecture, updateLecture } from '../../store/slices/lecturesSlice';
import { addNews, updateNews } from '../../store/slices/newsSlice';

// === مكونات مشتركة ===
import ImageUploader from '../ui/ImageUploader';
import Tag from '../ui/Tag';
import LocalizedContentInput from '../ui/LocalizedContentInput';

// === أدوات ===
import { getLocalizedText, toBilingualOptions } from '../../utils/i18n-helpers';
import { getMainTypes, getSubTypes, addCustomType, removeCustomType } from '../../utils/contentTypes';

const CreatePostModal = ({ 
  isOpen, 
  onClose, 
  editingPost = null, 
  onSave, 
  postType = 'LECTURE' ,// ✅ 'LECTURE' أو 'NEWS'
  onTypeAdded,
}) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const { user } = useSelector((state) => state.user);
  
  const currentLang = i18n?.language || 'ar';
  const isRTL = currentLang === 'ar';
  
  const [activeTab, setActiveTab] = useState('write');
  
  // === حالة النموذج مع دعم الأنواع المخصصة ===
  const [formData, setFormData] = useState({
    // === حقول ثنائية اللغة ===
    title: { ar: '', en: '' },
    summary: { ar: '', en: '' },
    content: { ar: '', en: '' },
    // === حقول مشتركة ===
    category: '',
    subCategory: '',
    type: '', // للأخبار: النوع الرئيسي
    subType: '', // للأخبار: النوع الفرعي
    customType: { ar: '', en: '' }, // للنوع الرئيسي المخصص
    customSubType: { ar: '', en: '' }, // للنوع الفرعي المخصص
    year: new Date().getFullYear(),
    attachmentType: null,
    tags: [],
  });
  
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tagInput, setTagInput] = useState('');
  
  const modalContentRef = useRef(null);
  const isEditing = !!editingPost;

  // === دالة مساعدة لتطبيع القيم ثنائية اللغة ===
  const normalizeBilingual = useCallback((val) => {
    if (!val) return { ar: '', en: '' };
    if (typeof val === 'string') return { ar: val, en: val };
    if (typeof val === 'object' && val !== null) {
      return {
        ar: val.ar || val.en || '',
        en: val.en || val.ar || '',
      };
    }
    return { ar: String(val), en: String(val) };
  }, []);

  // === تهيئة النموذج عند التعديل أو الفتح ===
  useEffect(() => {
    if (editingPost && isOpen) {
      setFormData({
        title: normalizeBilingual(editingPost.title),
        summary: normalizeBilingual(editingPost.summary),
        content: normalizeBilingual(editingPost.content || editingPost.fullContent),
        category: editingPost.category || '',
        subCategory: editingPost.subCategory || '',
        type: editingPost.type || '',
        subType: editingPost.subType || '',
        customType: normalizeBilingual(editingPost.customType),
        customSubType: normalizeBilingual(editingPost.customSubType),
        year: editingPost.year || new Date().getFullYear(),
        attachmentType: editingPost.attachmentType || null,
        tags: editingPost.tags || [],
      });
      if (editingPost.attachmentUrl || editingPost.image) {
        setFilePreview(editingPost.attachmentUrl || editingPost.image);
      }
    } else if (!editingPost) {
      // إعادة تعيين للنموذج الجديد
      setFormData({
        title: { ar: '', en: '' },
        summary: { ar: '', en: '' },
        content: { ar: '', en: '' },
        category: '',
        subCategory: '',
        type: '',
        subType: '',
        customType: { ar: '', en: '' },
        customSubType: { ar: '', en: '' },
        year: new Date().getFullYear(),
        attachmentType: null,
        tags: [],
      });
      setFile(null);
      setFilePreview(null);
      setTagInput('');
    }
  }, [editingPost, isOpen, normalizeBilingual]);

  // === منع السكرول للخلفية ===
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // === جلب الأنواع الديناميكية من المحتوى ===
  const mainTypes = useMemo(() => {
    const contentType = postType === 'LECTURE' ? 'lecture' : 'news';
    return getMainTypes(contentType, currentLang);
  }, [postType, currentLang]);

  const subTypes = useMemo(() => {
    if (postType !== 'NEWS' || !formData.type || formData.type === '__custom__') return [];
    return getSubTypes(formData.type, currentLang);
  }, [postType, formData.type, currentLang]);

  // === معالجة رفع الملف ===
  const handleFileSelect = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024;
    
    if (!validTypes.includes(selectedFile.type)) {
      setError(t('post.errors.invalidFileType') || 'يرجى اختيار صورة أو ملف PDF فقط');
      return;
    }
    if (selectedFile.size > maxSize) {
      setError(t('post.errors.fileTooLarge') || 'حجم الملف يتجاوز 10 ميجابايت');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview('/icons/pdf-placeholder.svg');
    }
  }, [t]);

  // === إزالة الملف ===
  const removeFile = useCallback(() => {
    setFile(null);
    setFilePreview(null);
    setFormData(prev => ({ ...prev, attachmentType: null }));
  }, []);

  // === إدارة الوسوم ===
  const addTag = useCallback(() => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  }, [tagInput, formData.tags]);

  const removeTag = useCallback((tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  }, []);

  // === تحديد نوع المرفق ===
  const getAttachmentType = useCallback((file) => {
    if (!file) return null;
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    return 'file';
  }, []);

  // === إضافة نوع مخصص ===
  const handleAddCustomType = useCallback((isSubType = false) => {
    const label = isSubType ? formData.customSubType : formData.customType;
    if (!label.ar?.trim() && !label.en?.trim()) return;
    
    const newType = {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      label: {
        ar: label.ar?.trim() || label.en?.trim() || '',
        en: label.en?.trim() || label.ar?.trim() || '',
      },
      editable: true,
    };
    
    const contentType = postType === 'LECTURE' ? 'lecture' : 'news';
    const mainTypeId = isSubType ? formData.type : null;
    
    const success = addCustomType(contentType, newType, mainTypeId);
    
    if (success) {
      if (isSubType) {
        setFormData(prev => ({ ...prev, subType: newType.id, customSubType: { ar: '', en: '' } }));
      } else {
        setFormData(prev => ({ ...prev, type: newType.id, customType: { ar: '', en: '' } }));
      }
      onTypeAdded?.();
    }
  }, [formData.customType, formData.customSubType, formData.type, postType, onTypeAdded]);

  // === حذف نوع مخصص (للمشرفين فقط) ===
  const handleRemoveType = useCallback((typeId, isSubType = false) => {
    if (user?.role !== 'ADMIN') return;
    
    const contentType = postType === 'LECTURE' ? 'lecture' : 'news';
    const mainTypeId = isSubType ? formData.type : null;
    
    const success = removeCustomType(contentType, typeId, mainTypeId);
    
    if (success) {
      if (isSubType && formData.subType === typeId) {
        setFormData(prev => ({ ...prev, subType: '' }));
      } else if (!isSubType && formData.type === typeId) {
        setFormData(prev => ({ ...prev, type: '', subType: '' }));
      }
    }
  }, [formData.type, formData.subType, postType, user?.role]);

  // === تحديد حالة النشر: أدمن = فوري، مستخدم عادي = مراجعة للمحاضرات ===
  const determineStatus = useCallback((type, userRole) => {
    if (userRole === 'ADMIN') return 'APPROVED';
    return type === 'LECTURE' ? 'PENDING' : 'APPROVED';
  }, []);

  // === إرسال النموذج ===
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError(t('post.errors.loginRequired') || 'يجب تسجيل الدخول أولاً');
      return;
    }
    if (!formData.title.ar?.trim() && !formData.title.en?.trim()) {
      setError(t('post.errors.titleRequired') || 'العنوان مطلوب');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      let attachmentUrl = null;
      let fileSize = null;
      
      if (file) {
        if (file.type.startsWith('image/')) {
          attachmentUrl = filePreview;
        } else {
          attachmentUrl = `/uploads/${Date.now()}-${file.name}`;
        }
        fileSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
      }

      // === بناء البيانات حسب نوع المنشور ===
      const postData = {
        authorId: user.id,
        speaker: user.name || user.speaker || 'مستخدم',
        
        // === نصوص ثنائية اللغة ===
        title: formData.title.ar?.trim() || formData.title.en?.trim() 
          ? { ar: formData.title.ar?.trim() || '', en: formData.title.en?.trim() || '' }
          : '',
        summary: formData.summary.ar?.trim() || formData.summary.en?.trim()
          ? { ar: formData.summary.ar?.trim() || '', en: formData.summary.en?.trim() || '' }
          : null,
        content: formData.content.ar?.trim() || formData.content.en?.trim()
          ? { ar: formData.content.ar?.trim() || '', en: formData.content.en?.trim() || '' }
          : null,
        
        // === حقول مشتركة ===
        attachmentType: file ? getAttachmentType(file) : null,
        attachmentUrl,
        attachmentName: file?.name || null,
        fileSize,
        tags: formData.tags,
        postType: postType,
        
        // === الحالة: أدمن = نشر فوري ===
        status: determineStatus(postType, user?.role),
      };

      // === حقول خاصة بالمحاضرات ===
      if (postType === 'LECTURE') {
        postData.category = formData.category || 'عام';
        postData.subCategory = formData.subCategory || '';
      }
      
      // === حقول خاصة بالأخبار ===
      if (postType === 'NEWS') {
        // التعامل مع النوع الرئيسي (مخصص أو من القائمة)
        postData.type = formData.type === '__custom__' 
          ? formData.customType 
          : formData.type;
        
        // التعامل مع النوع الفرعي (مخصص أو من القائمة)
        postData.subType = formData.subType === '__custom__'
          ? formData.customSubType
          : (formData.subType || null);
        
        postData.year = formData.year || new Date().getFullYear();
        postData.date = new Date().toISOString();
      }

      // === الإرسال حسب النوع ===
      if (isEditing && onSave) {
        // وضع التعديل
        onSave({ ...editingPost, ...postData });
      } else {
        // وضع الإنشاء الجديد
        if (postType === 'NEWS') {
          dispatch(addNews(postData));
        } else {
          dispatch(addLecture(postData));
        }
      }
      
      // إشعار النجاح
      const successMsg = isEditing 
        ? (t('post.updated') || '✅ تم تحديث المنشور بنجاح!')
        : (t('post.published') || '✅ تم إرسال منشورك بنجاح!');
      alert(successMsg);
      
      onClose();
      
    } catch (err) {
      console.error('Post submission failed:', err);
      setError(t('post.errors.submitFailed') || 'حدث خطأ أثناء الإرسال، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  }, [
    user, formData, file, filePreview, postType, isEditing, 
    editingPost, onSave, dispatch, onClose, t, getAttachmentType, determineStatus
  ]);

  // === عدم العرض إذا لم يكن المودال مفتوحاً ===
  if (!isOpen) return null;

  // === أنيميشن المودال ===
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
  };

  return createPortal(
    (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
        dir={isRTL ? 'rtl' : 'ltr'}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          ref={modalContentRef}
          className={`
            w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl relative flex flex-col overflow-hidden
            ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-slate-100'}
          `}
        >
          {/* === Header ثابت === */}
          <div className={`flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 z-10 ${isDark ? 'border-gray-700 bg-gray-800/95' : 'border-slate-100 bg-white/95'} backdrop-blur`}>
            <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isEditing 
                ? (postType === 'NEWS' ? t('news.editNews') : t('lecture.editLecture'))
                : (postType === 'NEWS' ? t('news.publishNew') : t('lecture.createLecture'))
              }
            </h2>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={`p-2 rounded-full transition ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              aria-label={t('common.close')}
            >
              <FaTimes size={18}/>
            </motion.button>
          </div>

          {/* === محتوى قابل للسكرول === */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-4 p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}`}
                >
                  <span>⚠️</span> {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* === تبويبات: كتابة / معاينة === */}
              <div className={`flex gap-2 p-1 rounded-xl w-fit ${isDark ? 'bg-gray-700' : 'bg-slate-100'}`}>
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                    activeTab === 'write' 
                      ? (isDark ? 'bg-gray-600 text-white' : 'bg-white text-slate-900 shadow-sm')
                      : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-700')
                  }`}
                >
                  ✍️ {t('post.write')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                    activeTab === 'preview' 
                      ? (isDark ? 'bg-gray-600 text-white' : 'bg-white text-slate-900 shadow-sm')
                      : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-700')
                  }`}
                >
                  👁️ {t('post.preview')}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'write' ? (
                  <motion.div
                    key="write"
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    className="space-y-6"
                  >
                    {/* === العنوان (مطلوب) - ثنائي اللغة === */}
                    <LocalizedContentInput
                      label={postType === 'NEWS' ? t('news.title') : t('lecture.title')}
                      value={formData.title}
                      showBothLanguages={true}
                      onChange={(val) => setFormData({ ...formData, title: val })}
                      placeholder={{ 
                        ar: t(postType === 'NEWS' ? 'news.titlePlaceholder.ar' : 'lecture.titlePlaceholder.ar'), 
                        en: t(postType === 'NEWS' ? 'news.titlePlaceholder.en' : 'lecture.titlePlaceholder.en') 
                      }}
                      required
                    />

                    {/* === الوصف المختصر - ثنائي اللغة === */}
                    <LocalizedContentInput
                      label={postType === 'NEWS' ? t('news.description') : t('lecture.summary')}
                      value={formData.summary}
                      showBothLanguages={true}
                      onChange={(val) => setFormData({ ...formData, summary: val })}
                      placeholder={{ 
                        ar: t(postType === 'NEWS' ? 'news.descriptionPlaceholder.ar' : 'lecture.summaryPlaceholder.ar'), 
                        en: t(postType === 'NEWS' ? 'news.descriptionPlaceholder.en' : 'lecture.summaryPlaceholder.en') 
                      }}
                      mode="textarea"
                    />

                    {/* === المحتوى الكامل - ثنائي اللغة === */}
                    <LocalizedContentInput
                      label={postType === 'NEWS' ? t('news.content') : t('lecture.content')}
                      value={formData.content}
                      showBothLanguages={true}
                      onChange={(val) => setFormData({ ...formData, content: val })}
                      placeholder={{ 
                        ar: t(postType === 'NEWS' ? 'news.contentPlaceholder.ar' : 'lecture.contentPlaceholder.ar'), 
                        en: t(postType === 'NEWS' ? 'news.contentPlaceholder.en' : 'lecture.contentPlaceholder.en') 
                      }}
                      mode="textarea"
                    />

                    {/* === حقول خاصة بالنوع === */}
                    {postType === 'LECTURE' ? (
                      <>
                        {/* التصنيفات للمحاضرات */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                              {t('lecture.mainCategory')}
                            </label>
                            
                            <div className="relative">
                              <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className={`
                                  w-full p-3 rounded-xl border outline-none transition appearance-none
                                  ${isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-brand-secondary' 
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-brand-primary'
                                  }
                                `}
                              >
                                <option value="">{t('lecture.selectCategory')}</option>
                                {mainTypes.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.label}
                                    {cat.editable && user?.role === 'ADMIN' && ' 🗑️'}
                                  </option>
                                ))}
                                <option value="__custom__">✨ {t('lecture.addCustomCategory')}</option>
                              </select>
                              
                              <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`}>
                                <FaChevronDown size={14} className={isDark ? 'text-gray-400' : 'text-slate-400'} />
                              </div>
                            </div>
                            
                            {/* حقل إضافة تصنيف مخصص === */}
                            {formData.category === '__custom__' && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-3 p-3 rounded-xl border bg-gray-50 dark:bg-gray-700/50"
                              >
                                <LocalizedContentInput
                                  label={t('lecture.customCategoryLabel')}
                                  value={formData.customType}
                                  showBothLanguages={true}
                                  onChange={(val) => setFormData({ ...formData, customType: val })}
                                  placeholder={{ 
                                    ar: 'اسم التصنيف بالعربية', 
                                    en: 'Category name in English' 
                                  }}
                                />
                                <div className="flex gap-2 mt-3">
                                  <button
                                    type="button"
                                    onClick={() => handleAddCustomType(false)}
                                    className="flex-1 py-2 rounded-lg bg-brand-primary text-white text-sm font-bold hover:bg-brand-primaryHover transition"
                                  >
                                    {t('common.add')}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, category: '' }))}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-400 hover:bg-slate-100'}`}
                                  >
                                    {t('common.cancel')}
                                  </button>
                                </div>
                              </motion.div>
                            )}
                            
                            {/* زر حذف للتصنيف المحدد إذا كان مخصصاً === */}
                            {formData.category && mainTypes.find(c => c.id === formData.category)?.editable && user?.role === 'ADMIN' && (
                              <button
                                type="button"
                                onClick={() => handleRemoveType(formData.category, false)}
                                className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                              >
                                <FaTrash size={10} /> {t('common.deleteType')}
                              </button>
                            )}
                          </div>
                          
                          <div>
                            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                              {t('lecture.subCategory')}
                            </label>
                            <input 
                              type="text"
                              className={`
                                w-full p-3 rounded-xl border outline-none transition
                                ${isDark 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-brand-secondary' 
                                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-brand-primary'
                                }
                              `}
                              value={formData.subCategory}
                              onChange={e => setFormData({...formData, subCategory: e.target.value})}
                              placeholder={t('lecture.subCategoryPlaceholder')}
                            />
                          </div>
                        </div>

                        {/* الوسوم للمحاضرات فقط */}
                        <div>
                          <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                            {t('lecture.tags')} <span className="text-slate-400 font-normal">(حتى 5)</span>
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formData.tags.map((tag, idx) => (
                              <Tag key={idx} variant="accentSoft" className="flex items-center gap-1">
                                {tag}
                                <button 
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="hover:text-red-500 transition"
                                >
                                  <FaTimes size={8} />
                                </button>
                              </Tag>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              className={`
                                flex-1 p-3 rounded-xl border outline-none transition text-sm
                                ${isDark 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-brand-secondary' 
                                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-brand-primary'
                                }
                              `}
                              value={tagInput}
                              onChange={e => setTagInput(e.target.value)}
                              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                              placeholder={t('lecture.addTag')}
                              disabled={formData.tags.length >= 5}
                            />
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={addTag}
                              disabled={formData.tags.length >= 5 || !tagInput.trim()}
                              className={`
                                px-4 py-3 rounded-xl transition
                                ${isDark 
                                  ? 'bg-brand-secondary text-white hover:bg-brand-secondaryHover' 
                                  : 'bg-brand-primary text-white hover:bg-brand-primaryHover'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed
                              `}
                            >
                              <FaPlus size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* حقول خاصة بالأخبار: النوع الرئيسي والفرعي === */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          {/* النوع الرئيسي === */}
                          <div>
                            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                              {t('news.mainType')}
                            </label>
                            
                            <div className="relative">
                              <select
                                value={formData.type}
                                onChange={(e) => {
                                  setFormData({ ...formData, type: e.target.value, subType: '' });
                                }}
                                className={`
                                  w-full p-3 rounded-xl border outline-none transition appearance-none
                                  ${isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-brand-secondary' 
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-brand-primary'
                                  }
                                `}
                              >
                                <option value="">{t('news.selectMainType')}</option>
                                {mainTypes.map((mt) => (
                                  <option key={mt.id} value={mt.id}>
                                    {mt.label}
                                    {mt.editable && user?.role === 'ADMIN' && ' 🗑️'}
                                  </option>
                                ))}
                                <option value="__custom__">✨ {t('news.addCustomType')}</option>
                              </select>
                              
                              <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`}>
                                <FaChevronDown size={14} className={isDark ? 'text-gray-400' : 'text-slate-400'} />
                              </div>
                            </div>
                            
                            {/* إضافة نوع رئيسي مخصص === */}
                            {formData.type === '__custom__' && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-3 p-3 rounded-xl border bg-gray-50 dark:bg-gray-700/50"
                              >
                                <LocalizedContentInput
                                  label={t('news.customMainTypeLabel')}
                                  value={formData.customType}
                                  showBothLanguages={true}
                                  onChange={(val) => setFormData({ ...formData, customType: val })}
                                  placeholder={{ 
                                    ar: 'اسم النوع بالعربية', 
                                    en: 'Type name in English' 
                                  }}
                                />
                                <div className="flex gap-2 mt-3">
                                  <button
                                    type="button"
                                    onClick={() => handleAddCustomType(false)}
                                    className="flex-1 py-2 rounded-lg bg-brand-primary text-white text-sm font-bold hover:bg-brand-primaryHover transition"
                                  >
                                    {t('common.add')}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: '' }))}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-400 hover:bg-slate-100'}`}
                                  >
                                    {t('common.cancel')}
                                  </button>
                                </div>
                              </motion.div>
                            )}
                            
                            {/* زر حذف للنوع الرئيسي المحدد إذا كان مخصصاً === */}
                            {formData.type && mainTypes.find(mt => mt.id === formData.type)?.editable && user?.role === 'ADMIN' && (
                              <button
                                type="button"
                                onClick={() => handleRemoveType(formData.type, false)}
                                className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                              >
                                <FaTrash size={10} /> {t('common.deleteType')}
                              </button>
                            )}
                          </div>

                          {/* النوع الفرعي (يظهر فقط إذا اختار نوع رئيسي) === */}
                          {formData.type && formData.type !== '__custom__' && (
                            <div>
                              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                {t('news.subType')}
                              </label>
                              
                              <div className="relative">
                                <select
                                  value={formData.subType || ''}
                                  onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                                  className={`
                                    w-full p-3 rounded-xl border outline-none transition appearance-none
                                    ${isDark 
                                      ? 'bg-gray-700 border-gray-600 text-white focus:border-brand-secondary' 
                                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-brand-primary'
                                    }
                                  `}
                                >
                                  <option value="">{t('news.selectSubType')}</option>
                                  {subTypes.map((st) => (
                                    <option key={st.id} value={st.id}>
                                      {st.label}
                                      {st.editable && user?.role === 'ADMIN' && ' 🗑️'}
                                    </option>
                                  ))}
                                  <option value="__custom__">✨ {t('news.addCustomSubType')}</option>
                                </select>
                                
                                <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`}>
                                  <FaChevronDown size={14} className={isDark ? 'text-gray-400' : 'text-slate-400'} />
                                </div>
                              </div>
                              
                              {/* إضافة نوع فرعي مخصص === */}
                              {formData.subType === '__custom__' && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-3 p-3 rounded-xl border bg-gray-50 dark:bg-gray-700/50"
                                >
                                  <LocalizedContentInput
                                    label={t('news.customSubTypeLabel')}
                                    value={formData.customSubType}
                                    showBothLanguages={true}
                                    onChange={(val) => setFormData({ ...formData, customSubType: val })}
                                    placeholder={{ 
                                      ar: 'اسم النوع الفرعي بالعربية', 
                                      en: 'Sub-type name in English' 
                                    }}
                                  />
                                  <div className="flex gap-2 mt-3">
                                    <button
                                      type="button"
                                      onClick={() => handleAddCustomType(true)}
                                      className="flex-1 py-2 rounded-lg bg-brand-primary text-white text-sm font-bold hover:bg-brand-primaryHover transition"
                                    >
                                      {t('common.add')}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setFormData(prev => ({ ...prev, subType: '' }))}
                                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-400 hover:bg-slate-100'}`}
                                    >
                                      {t('common.cancel')}
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                              
                              {/* زر حذف للنوع الفرعي المحدد إذا كان مخصصاً === */}
                              {formData.subType && subTypes.find(st => st.id === formData.subType)?.editable && user?.role === 'ADMIN' && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveType(formData.subType, true)}
                                  className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                                >
                                  <FaTrash size={10} /> {t('common.deleteType')}
                                </button>
                              )}
                            </div>
                          )}
                          
                          {/* السنة === */}
                          <div>
                            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                              <FaCalendar className="inline me-1" size={12} />
                              {t('news.year')}
                            </label>
                            <input 
                              type="number"
                              className={`
                                w-full p-3 rounded-xl border outline-none transition
                                ${isDark 
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-brand-secondary' 
                                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-brand-primary'
                                }
                              `}
                              value={formData.year}
                              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                              min="2000"
                              max={new Date().getFullYear() + 10}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* === رفع الملف/الصورة === */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        {postType === 'NEWS' ? t('news.image') : t('lecture.attachment')} 
                        <span className="text-slate-400 font-normal">({t('post.optional')})</span>
                      </label>
                      
                      <AnimatePresence mode="wait">
                        {filePreview ? (
                          <motion.div 
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative group"
                          >
                            {formData.attachmentType === 'image' || file?.type?.startsWith('image/') ? (
                              <img 
                                src={filePreview} 
                                alt={t('post.preview')} 
                                className={`w-full h-48 object-cover rounded-2xl border ${isDark ? 'border-gray-600' : 'border-slate-200'}`}
                              />
                            ) : (
                              <div className={`w-full h-48 rounded-2xl border flex flex-col items-center justify-center gap-3 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-slate-100 border-slate-200'}`}>
                                <FaFilePdf className="text-red-500 text-4xl" />
                                <p className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-slate-600'}`}>{file?.name}</p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>{file?.size ? `${(file.size/1024/1024).toFixed(2)} MB` : ''}</p>
                              </div>
                            )}
                            
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={removeFile}
                              className="absolute -top-2 -left-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                              aria-label={t('post.removeFile')}
                            >
                              <FaTrash size={12} />
                            </motion.button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="upload"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <ImageUploader
                              onUpload={(data) => {
                                setFilePreview(data);
                              }}
                              label={t('post.uploadFile')}
                              accept="image/*,.pdf"
                              className="!aspect-auto h-32 sm:h-36"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* === ملاحظة النظام الهجين === */}
                    <div className={`p-4 rounded-xl text-sm ${isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-slate-50 text-slate-600'}`}>
                      <FaEye className="inline me-2" size={12} />
                      {postType === 'NEWS' 
                        ? t('news.hybridNote') 
                        : t('lecture.hybridNote')
                      }
                    </div>
                  </motion.div>
                ) : (
                  /* === تبويب المعاينة === */
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* معاينة البطاقة === */}
                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-slate-50 border-slate-200'}`}>
                      
                      {/* الصورة === */}
                      {filePreview && (
                        <img 
                          src={filePreview} 
                          alt={t('news.preview')} 
                          className="w-full h-48 object-cover rounded-xl mb-4"
                        />
                      )}
                      
                      {/* العنوان === */}
                      <h3 className={`font-black text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {getLocalizedText(formData.title, currentLang) || t('news.noTitle')}
                      </h3>
                      
                      {/* الوصف === */}
                      {getLocalizedText(formData.summary, currentLang) && (
                        <p className={`text-sm mb-3 italic ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                          "{getLocalizedText(formData.summary, currentLang)}"
                        </p>
                      )}
                      
                      {/* جزء من المحتوى (أول 200 حرف) === */}
                      {getLocalizedText(formData.content, currentLang) && (
                        <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
                          {getLocalizedText(formData.content, currentLang).substring(0, 200)}
                          {getLocalizedText(formData.content, currentLang).length > 200 && '...'}
                        </div>
                      )}
                      
                      {/* الوسوم والنوع === */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {formData.type && formData.type !== '__custom__' && (
                          <Tag variant="accentSoft">{getLocalizedText(mainTypes.find(mt => mt.id === formData.type)?.label, currentLang)}</Tag>
                        )}
                        {formData.type === '__custom__' && formData.customType && (
                          <Tag variant="accentSoft">{getLocalizedText(formData.customType, currentLang)}</Tag>
                        )}
                        {formData.subType && formData.subType !== '__custom__' && (
                          <Tag variant="muted">{getLocalizedText(subTypes.find(st => st.id === formData.subType)?.label, currentLang)}</Tag>
                        )}
                        {formData.subType === '__custom__' && formData.customSubType && (
                          <Tag variant="muted">{getLocalizedText(formData.customSubType, currentLang)}</Tag>
                        )}
                        {formData.tags?.map((tag, idx) => (
                          <Tag key={idx} variant="muted">#{getLocalizedText(tag, currentLang)}</Tag>
                        ))}
                      </div>
                    </div>
                    
                    {/* ملاحظة === */}
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      💡 {t('news.previewNote') || 'هذه معاينة تقريبية. قد يختلف الشكل النهائي قليلاً عند النشر.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* === أزرار الإرسال === */}
              <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-slate-100'}`}>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose} 
                  className={`
                    flex-1 py-3 rounded-xl font-bold transition
                    ${isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }
                  `}
                >
                  {t('common.cancel')}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || (!formData.title.ar?.trim() && !formData.title.en?.trim())} 
                  className={`
                    flex-1 py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2
                    ${isDark 
                      ? 'bg-brand-secondary text-white hover:bg-brand-secondaryHover' 
                      : 'bg-brand-primary text-white hover:bg-brand-primaryHover'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {loading ? (
                    <>
                      <motion.span 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      {t('post.saving')}
                    </>
                  ) : (
                    <>
                      <FaTimes className="rotate-45" size={16} />
                      {isEditing ? t('common.save') : (postType === 'NEWS' ? t('news.publish') : t('lecture.submitForReview'))}
                    </>
                  )}
                </motion.button>
              </div>
              
              {!isEditing && (
                <p className={`text-[10px] text-center ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                  {postType === 'NEWS' 
                    ? t('news.publishNote') 
                    : (user?.role === 'ADMIN' ? t('lecture.adminPublishNote') : t('lecture.reviewNote'))
                  }
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    ),
    document.body
  );
};

export default CreatePostModal;