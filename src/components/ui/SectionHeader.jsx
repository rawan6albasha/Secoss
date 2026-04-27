// ============================================================================
// 📁 الملف: src/components/ui/SectionHeader/SectionHeader.jsx
// 📝 الوصف: هيدر قسم يدعم المحتوى القابل للتعديل (من SITE_CONFIG) والواجهة الثابتة (من i18n)
// ============================================================================

import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaSave, FaTimes, FaLightbulb, FaLanguage } from 'react-icons/fa';

// === أدوات المساعدة للترجمة ===
import { getLocalizedText, getEditedContent, saveEditedContent, isContentEdited } from '../../utils/i18n-helpers';

// === التكوين المركزي (مصدر المحتوى القابل للتعديل) ===
import { SITE_CONFIG } from '../../config/siteConfig';

// === مكون الإدخال المشترك ===
import LocalizedContentInput from './LocalizedContentInput';

const SectionHeader = ({ 
  pageKey,           
  section = 'header',
  // مفاتيح الترجمة الاحتياطية (تستخدم فقط إذا لم يوجد محتوى في SITE_CONFIG)
  eyebrowKey,        
  titleKey,
  descriptionKey,
  meta,
  editable = true,
  className = '',
  showEditButton = true,
}) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const user = useSelector(state => state.user?.user);
  const isAdmin = user?.role === 'ADMIN';
  
  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';
  const [isEditing, setIsEditing] = useState(false);
  
  // ============================================================================
  // 📦 1. استخراج المحتوى القابل للتعديل (من SITE_CONFIG)
  // ============================================================================
  // هذا هو المصدر الرئيسي للبيانات التي يريد المستخدم تعديلها
  const defaults = useMemo(() => {
    return SITE_CONFIG.pageContent?.[pageKey]?.[section]?.defaults || {};
  }, [pageKey, section]);

  // ============================================================================
  // 💾 2. استخراج التعديلات المحفوظة (من LocalStorage)
  // ============================================================================
  const editedContent = useMemo(() => {
    return getEditedContent(pageKey, section);
  }, [pageKey, section]);

  // ============================================================================
  // 👁️ 3. دمج البيانات للعرض (Priority: Edited > SITE_CONFIG > Fallback)
  // ============================================================================
  const headerTexts = useMemo(() => {
    // دالة مساعدة لجلب النص المعروض بناءً على الأولوية
    const getText = (field) => {
      // 1. هل يوجد تعديل من المشرف؟
      const userEdit = editedContent?.[field];
      if (userEdit) return getLocalizedText(userEdit, currentLang);
      
      // 2. هل يوجد قيمة افتراضية في SITE_CONFIG؟
      const siteDefault = defaults?.[field];
      if (siteDefault) return getLocalizedText(siteDefault, currentLang);
      
      // 3. هل يوجد نص ثابت في ملف الترجمة (كـ Fallback)؟
      const keyMap = { eyebrow: eyebrowKey, title: titleKey, description: descriptionKey };
      if (keyMap[field]) return t(keyMap[field]);
      
      return '';
    };

    return {
      eyebrow: getText('eyebrow'),
      title: getText('title'),
      description: getText('description'),
    };
  }, [defaults, editedContent, eyebrowKey, titleKey, descriptionKey, currentLang, t]);

  // ============================================================================
  // 🗃️ حالة محرر النموذج (تخزن الكائنات { ar, en })
  // ============================================================================
  const [editValues, setEditValues] = useState({
    eyebrow: { ar: '', en: '' },
    title: { ar: '', en: '' },
    description: { ar: '', en: '' },
  });

  // ============================================================================
  // ✏️ دالة بدء التحرير: تحميل البيانات من SITE_CONFIG
  // ============================================================================
  const startEditing = useCallback(() => {
    // دالة لتطبيع البيانات إلى { ar, en } بغض النظر عن المصدر
    const normalizeForEdit = (field) => {
      // 1. جرب التعديلات المحفوظة أولاً (إذا وجدت)
      const editVal = editedContent?.[field];
      if (editVal) return { ar: editVal.ar || '', en: editVal.en || '' };

      // 2. جرب الإعدادات الافتراضية من SITE_CONFIG (المصدر الصحيح للتعديل)
      const defaultVal = defaults?.[field];
      if (defaultVal) {
        return {
          ar: getLocalizedText(defaultVal, 'ar') || '',
          en: getLocalizedText(defaultVal, 'en') || ''
        };
      }

      // 3. Fallback: نص فارغ
      return { ar: '', en: '' };
    };

    // ملء الحقول بالقيم الصحيحة من SITE_CONFIG
    setEditValues({
      eyebrow: normalizeForEdit('eyebrow'),
      title: normalizeForEdit('title'),
      description: normalizeForEdit('description'),
    });
    
    setIsEditing(true);
  }, [defaults, editedContent]);

  // ============================================================================
  // 💾 دالة حفظ التعديلات
  // ============================================================================
  const handleSave = useCallback(() => {
    saveEditedContent(pageKey, section, editValues);
    setIsEditing(false);
    // إعادة تحميل البيانات لتظهر التحديثات فوراً
    window.location.reload(); 
  }, [editValues, pageKey, section]);

  // ============================================================================
  // ❌ دالة إلغاء التحرير
  // ============================================================================
  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  // ============================================================================
  // 🎨 أنيميشن العناصر
  // ============================================================================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // ============================================================================
  // 🖼️ عرض الوضع العادي (للمستخدمين العاديين)
  // ============================================================================
  if (!isEditing) {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`space-y-4 ${isDark ? 'text-white' : 'text-slate-900'} ${isRTL ? 'text-right' : 'text-left'} relative ${className}`}
      >
        {/* 🔘 زر التعديل: يظهر فقط للمشرفين */}
        {isAdmin && editable && showEditButton && (
          <motion.button
            variants={itemVariants}
            onClick={startEditing}
            className={`
              absolute ${isRTL ? 'left-0' : 'right-0'} top-0 z-10
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
              transition-all duration-200
              ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
            `}
          >
            <FaEdit size={12} />
            {/* تسمية الزر تأتي من i18n (Static Label) */}
            {t('sectionHeader.editButton')}
          </motion.button>
        )}

        {/* 🏷️ العنوان الصغير: محتواه من SITE_CONFIG */}
        {headerTexts.eyebrow && (
          <motion.span variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">
            <FaLightbulb size={12} />
            {headerTexts.eyebrow}
          </motion.span>
        )}

        {/* 📝 العنوان الرئيسي: محتواه من SITE_CONFIG */}
        {headerTexts.title && (
          <motion.h1 variants={itemVariants} className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight">
            {headerTexts.title}
          </motion.h1>
        )}

        {/* 📄 الوصف: محتواه من SITE_CONFIG */}
        {headerTexts.description && (
          <motion.p variants={itemVariants} className="text-sm md:text-base leading-relaxed max-w-2xl text-slate-600 dark:text-gray-300">
            {headerTexts.description}
          </motion.p>
        )}
        
        {meta && <motion.div variants={itemVariants} className="text-sm text-slate-500">{meta}</motion.div>}
      </motion.div>
    );
  }

  // ============================================================================
  // ✏️ عرض وضع التحرير (للمشرفين فقط)
  // ============================================================================
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="editing"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`space-y-5 p-5 rounded-2xl border-2 border-brand-secondary/50 ${isDark ? 'bg-gray-800/60' : 'bg-slate-50'} ${className}`}
      >
        {/* رأس النموذج */}
        <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-gray-700' : 'border-slate-200'}`}>
          <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {/* تسمية ثابتة من i18n */}
            {t('sectionHeader.editingTitle')}
          </h3>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-brand-secondary text-white text-sm font-bold">
              <FaSave className="inline me-1" size={12} /> {t('common.save')}
            </button>
            <button onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-700">
              <FaTimes className="inline me-1" size={12} /> {t('common.cancel')}
            </button>
          </div>
        </div>

        {/* 📝 حقول التعديل: تستخدم LocalizedContentInput */}
        <div className="space-y-5">
          
          {/* حقل العنوان الصغير */}
          <LocalizedContentInput 
            // 🔴 التسمية (Label) تأتي من i18n (Static)
            label={t('sectionHeader.eyebrowField')} 
            
            // 🟢 القيمة (Value) تأتي من state (الذي ملأناه من SITE_CONFIG)
            value={editValues.eyebrow} 
            
            // 💾 التغيير يحفظ في state
            onChange={(val) => setEditValues(prev => ({ ...prev, eyebrow: val }))}
            
            placeholder={{ ar: t('sectionHeader.eyebrowPlaceholder.ar'), en: t('sectionHeader.eyebrowPlaceholder.en') }}
          />
          
          {/* حقل العنوان الرئيسي */}
          <LocalizedContentInput 
            label={t('sectionHeader.titleField')} 
            value={editValues.title}
            onChange={(val) => setEditValues(prev => ({ ...prev, title: val }))}
            placeholder={{ ar: t('sectionHeader.titlePlaceholder.ar'), en: t('sectionHeader.titlePlaceholder.en') }}
            required
          />
          
          {/* حقل الوصف */}
          <LocalizedContentInput 
            label={t('sectionHeader.descriptionField')} 
            value={editValues.description}
            onChange={(val) => setEditValues(prev => ({ ...prev, description: val }))}
            placeholder={{ ar: t('sectionHeader.descriptionPlaceholder.ar'), en: t('sectionHeader.descriptionPlaceholder.en') }}
            mode="textarea"
          />
        </div>

        {/* 💡 ملاحظة مساعدة */}
        <div className={`flex items-start gap-2 p-3 rounded-xl text-xs ${isDark ? 'bg-gray-700/50 text-gray-400' : 'bg-slate-100 text-slate-500'}`}>
          <FaLanguage size={12} className="mt-0.5 flex-shrink-0" />
          <p>{t('sectionHeader.editNote')}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SectionHeader;