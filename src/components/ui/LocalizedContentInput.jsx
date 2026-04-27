// ============================================================================
// 📁 الملف: src/components/ui/LocalizedContentInput/LocalizedContentInput.jsx
// 📝 الوصف: مكون إدخال محتوى ثنائي اللغة (عربي/إنجليزي) قابل لإعادة الاستخدام
// 🎯 الميزات:
//   - دعم الحقول المفردة والمصفوفات (قوائم العناصر)
//   - حقل التحرير يتبع لغة الواجهة تلقائياً
//   - عرض اللغة الأخرى كمعاينة قابلة للتعديل
//   - إعادة ترتيب العناصر (للمصفوفات)
//   - دعم الوضع الداكن/الفاتح عبر ThemeContext
// ============================================================================

import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { FaLanguage, FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaSave } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// 🎛️ تعريف المكون والـ Props
// ============================================================================
const LocalizedContentInput = ({
  label,              // 🏷️ تسمية الحقل للعرض
  value,              // 💾 القيمة: نص | { ar, en } | Array<{ ar, en }>
  onChange,           // 🔄 دالة الاستدعاء عند تغيير القيمة: (newValue) => void
  mode = 'single',    // ⚙️ وضع المكون: 'single' (حقل مفرد) | 'array' (قائمة عناصر)
  placeholder = {     // 💬 نصوص العناصر النائبة لكل لغة
    ar: 'أدخل النص...', 
    en: 'Enter text...' 
  },
  showReorder = false, // 🔃 إظهار أزرار إعادة الترتيب (للمصفوفات فقط)
  className = '',     // 🎨 كلاسات Tailwind إضافية
  required = false,   // ⭐ هل الحقل مطلوب؟
}) => {
  
  // ============================================================================
  // 🌐 استخراج الأدوات من الـ Hooks
  // ============================================================================
  const { t, i18n } = useTranslation();           // 🔄 نظام الترجمة
  const { isDark } = useTheme();                  // 🌓 حالة الوضع الداكن/الفاتح
  const currentLang = i18n.language || 'ar';      // 🌍 اللغة الحالية للواجهة
  const isRTL = currentLang === 'ar';             // ↔️ هل الاتجاه من اليمين لليسار؟
  
  // ============================================================================
  // 🗃️ حالات المكون (useState) - جميعها في الأعلى حسب قواعد React
  // ============================================================================
  
  // 📦 عنصر جديد يُضاف للمصفوفة (لوضع 'array')
  const [newArrayItem, setNewArrayItem] = useState({ ar: '', en: '' });
  
  // ✏️ تتبع العنصر قيد التعديل في المصفوفة (لوضع 'array')
  const [editingIndex, setEditingIndex] = useState(null);
  
  // 💾 القيمة المؤقتة للعنصر قيد التعديل
  const [editTempValue, setEditTempValue] = useState({ ar: '', en: '' });
  
  // 🔤 تتبع ما إذا كان حقل اللغة الأخرى في وضع المفرد قيد التحرير
  const [isEditingOther, setIsEditingOther] = useState(false);
  
  // 💾 القيمة المؤقتة للغة الأخرى في وضع المفرد
  const [otherLangTemp, setOtherLangTemp] = useState('');

  // ============================================================================
  // ⚙️ الدوال المساعدة (useCallback) - جميعها في الأعلى حسب قواعد React
  // ============================================================================

  /**
   * ✅ دالة آمنة لاستخراج نص من قيمة قد تكون:
   * - نص بسيط: "مرحبا"
   * - كائن ثنائي اللغة: { ar: "مرحبا", en: "Hello" }
   * - كائن متداخل: { ar: { ar: "مرحبا", en: "Hello" }, en: "" }
   * - مصفوفة: نأخذ أول عنصر
   * - أي قيمة أخرى: نحولها لنص
   * 
   * @param {*} val - القيمة المدخلة
   * @param {string} lang - اللغة المطلوبة: 'ar' أو 'en'
   * @returns {string} النص المستخرج
   */
  const safeGetText = useCallback((val, lang) => {
    // حالة الفراغ أو القيم غير المعرفة
    if (val == null) return '';
    
    // إذا كانت قيمة نصية بسيطة، نرجعها مباشرة
    if (typeof val === 'string') return val;
    
    // إذا كانت كائناً (محتمل أن يكون { ar, en })
    if (typeof val === 'object') {
      // أولاً: نجرب استخراج النص من اللغة المطلوبة
      const primary = val[lang];
      if (primary != null) {
        if (typeof primary === 'string') return primary.trim();
        // إذا كان الكائن متداخلاً، نعاود الاستدعاء بشكل تكراري
        if (typeof primary === 'object' && primary !== null) {
          return safeGetText(primary, lang);
        }
        return String(primary);
      }
      
      // ثانياً: Fallback للغة الأخرى إذا لم توجد القيمة في اللغة المطلوبة
      const other = lang === 'ar' ? 'en' : 'ar';
      const fallback = val[other];
      if (fallback != null) {
        if (typeof fallback === 'string') return fallback.trim();
        if (typeof fallback === 'object' && fallback !== null) {
          return safeGetText(fallback, lang);
        }
        return String(fallback);
      }
      
      // ثالثاً: نجرب أي قيمة متوفرة في الكائن
      const anyVal = Object.values(val).find(v => v != null);
      if (anyVal != null) {
        if (typeof anyVal === 'string') return anyVal.trim();
        if (typeof anyVal === 'object' && anyVal !== null) {
          return safeGetText(anyVal, lang);
        }
        return String(anyVal);
      }
    }
    
    // حالة غير متوقعة: نحول أي قيمة لنص
    return String(val);
  }, []);

  // ============================================================================
  // ✏️ دوال تعديل عنصر في المصفوفة (لوضع 'array')
  // ============================================================================

  /**
   * 🎯 بدء تعديل عنصر موجود في المصفوفة
   * @param {number} index - فهرس العنصر في المصفوفة
   * @param {object} item - قيمة العنصر { ar, en }
   */
  const startEditingItem = useCallback((index, item) => {
    setEditingIndex(index);
    setEditTempValue({
      ar: safeGetText(item, 'ar'),
      en: safeGetText(item, 'en'),
    });
  }, [safeGetText]);

  /**
   * 💾 حفظ تغييرات عنصر بعد التعديل
   * يُحدِّث المصفوفة الأصلية عبر دالة onChange
   */
  const saveEditingItem = useCallback(() => {
    // تحقق من صحة الحالة قبل المتابعة
    if (editingIndex === null || !Array.isArray(value)) return;
    
    // نسخ المصفوفة لتجنب التعديل المباشر على الحالة
    const updated = [...value];
    updated[editingIndex] = {
      ar: editTempValue.ar?.trim() || '',
      en: editTempValue.en?.trim() || '',
    };
    
    // استدعاء دالة التغيير لإبلاغ المكون الأب
    onChange?.(updated);
    
    // إعادة تعيين حالات التحرير
    setEditingIndex(null);
    setEditTempValue({ ar: '', en: '' });
  }, [editingIndex, editTempValue, value, onChange]);

  /**
   * ❌ إلغاء تعديل عنصر والعودة للقيمة الأصلية
   */
  const cancelEditingItem = useCallback(() => {
    setEditingIndex(null);
    setEditTempValue({ ar: '', en: '' });
  }, []);

  /**
   * 🔄 تحديث قيمة مؤقتة أثناء تحرير عنصر
   * @param {string} lang - اللغة التي يتم تعديلها: 'ar' أو 'en'
   * @param {string} val - القيمة الجديدة
   */
  const handleEditTempChange = useCallback((lang, val) => {
    setEditTempValue(prev => ({ ...prev, [lang]: val }));
  }, []);

  // ============================================================================
  // 🔄 تطبيع القيمة المدخلة لضمان تناسق الشكل { ar, en }
  // ============================================================================
  const normalizedValue = useMemo(() => {
    // دالة مساعدة لتطبيع عنصر واحد إلى الشكل القياسي { ar, en }
    const normalizeItem = (item) => ({
      ar: safeGetText(item, 'ar'),
      en: safeGetText(item, 'en'),
    });

    // === وضع المصفوفات ('array') ===
    if (mode === 'array') {
      // إذا لم تكن القيمة مصفوفة، نحولها لمصفوفة بعنصر واحد أو مصفوفة فارغة
      if (!Array.isArray(value)) {
        return value != null ? [normalizeItem(value)] : [];
      }
      // تطبيع كل عنصر في المصفوفة
      return value.map(normalizeItem);
    }
    
    // === وضع الحقول المفردة ('single') ===
    // إذا كانت القيمة مصفوفة بالخطأ، نأخذ أول عنصر فقط
    if (Array.isArray(value)) {
      return value.length > 0 ? normalizeItem(value[0]) : { ar: '', en: '' };
    }
    // تطبيع القيمة المفردة
    return normalizeItem(value);
  }, [value, mode, safeGetText]);

  // ============================================================================
  // 🔄 دوال معالجة التغييرات للحقول المفردة
  // ============================================================================

  /**
   * ✏️ معالجة تغيير قيمة حقل مفرد
   * @param {string} lang - اللغة التي تم تعديلها
   * @param {string} val - القيمة الجديدة
   */
  const handleSingleChange = useCallback((lang, val) => {
    onChange?.({ ...normalizedValue, [lang]: val });
  }, [normalizedValue, onChange]);

  // ============================================================================
  // ➕ دوال معالجة إضافة/حذف/ترتيب عناصر المصفوفة
  // ============================================================================

  /**
   * ➕ إضافة عنصر جديد للمصفوفة
   * يتم التحقق من أن الحقل ليس فارغاً قبل الإضافة
   */
  const handleAddArrayItem = useCallback(() => {
    // تجاهل إذا كان كلا الحقلين فارغين
    if (!newArrayItem.ar?.trim() && !newArrayItem.en?.trim()) return;
    
    // إنشاء عنصر جديد بالقيم المدخلة
    const newItem = { 
      ar: newArrayItem.ar?.trim() || '', 
      en: newArrayItem.en?.trim() || '' 
    };
    
    // التأكد من أن normalizedValue مصفوفة قبل النشر
    const currentArray = Array.isArray(normalizedValue) ? normalizedValue : [];
    
    // إضافة العنصر الجديد وإبلاغ المكون الأب
    onChange?.([...currentArray, newItem]);
    
    // إعادة تعيين حقل الإدخال الجديد
    setNewArrayItem({ ar: '', en: '' });
  }, [newArrayItem, normalizedValue, onChange]);

  /**
   * 🗑️ حذف عنصر من المصفوفة حسب الفهرس
   * @param {number} index - فهرس العنصر المراد حذفه
   */
  const handleRemoveArrayItem = useCallback((index) => {
    // التحقق من أن القيمة مصفوفة قبل المتابعة
    if (!Array.isArray(normalizedValue)) return;
    
    // نسخ المصفوفة وحذف العنصر
    const updated = [...normalizedValue];
    updated.splice(index, 1);
    
    // إبلاغ المكون الأب بالتغيير
    onChange?.(updated);
  }, [normalizedValue, onChange]);

  /**
   * 🔃 إعادة ترتيب عناصر المصفوفة (تحريك لأعلى/أسفل)
   * @param {number} index - فهرس العنصر الحالي
   * @param {number} direction - اتجاه التحريك: -1 (أعلى) أو +1 (أسفل)
   */
  const handleMoveArrayItem = useCallback((index, direction) => {
    // التحقق من أن القيمة مصفوفة
    if (!Array.isArray(normalizedValue)) return;
    
    // حساب الفهرس الجديد والتحقق من حدود المصفوفة
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= normalizedValue.length) return;
    
    // تبديل مواقع العنصرين
    const updated = [...normalizedValue];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    // إبلاغ المكون الأب
    onChange?.(updated);
  }, [normalizedValue, onChange]);

  // ============================================================================
  // 🌐 دوال تحرير اللغة الأخرى في وضع المفرد ('single')
  // ============================================================================

  /**
   * ✏️ بدء تحرير حقل اللغة الأخرى في وضع المفرد
   * @param {object} currentValue - القيمة الحالية { ar, en }
   * @param {string} otherLang - اللغة الأخرى: 'ar' أو 'en'
   */
  const startEditingOther = useCallback((currentValue, otherLang) => {
    // تحميل القيمة الحالية في الحالة المؤقتة
    setOtherLangTemp(currentValue?.[otherLang] || '');
    // تفعيل وضع التحرير
    setIsEditingOther(true);
  }, []);

  /**
   * 💾 حفظ تغييرات اللغة الأخرى في وضع المفرد
   * @param {object} currentValue - القيمة الحالية { ar, en }
   * @param {string} otherLang - اللغة الأخرى: 'ar' أو 'en'
   */
  const saveEditingOther = useCallback((currentValue, otherLang) => {
    // تحديث القيمة عبر دالة onChange مع الحفاظ على اللغة الأخرى
    onChange?.({ ...currentValue, [otherLang]: otherLangTemp.trim() });
    // الخروج من وضع التحرير
    setIsEditingOther(false);
    setOtherLangTemp('');
  }, [otherLangTemp, onChange]);

  /**
   * ❌ إلغاء تحرير اللغة الأخرى والعودة للقيمة الأصلية
   */
  const cancelEditingOther = useCallback(() => {
    setIsEditingOther(false);
    setOtherLangTemp('');
  }, []);

  // ============================================================================
  // 🏷️ نصوص الواجهة والـ Styling
  // ============================================================================
  
  // تسميات اللغات للعرض في الواجهة
  const langLabels = {
    ar: t('localizedInput.arabic'),
    en: t('localizedInput.english'),
  };

  // أنماط الحقول الأساسية (مشتركة بين input و textarea)
  const inputBaseClasses = `
    w-full p-3 rounded-xl border outline-none transition-all text-sm
    focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary
  `;
  
  // أنماط الحقول حسب الوضع الداكن/الفاتح
  const inputClasses = isDark 
    ? `${inputBaseClasses} bg-gray-800/50 border-gray-700 text-white placeholder-gray-500` 
    : `${inputBaseClasses} bg-slate-50/50 border-slate-200 text-slate-900 placeholder-slate-400`;

  // ============================================================================
  // 🎨 عرض المكون: وضع الحقول المفردة ('single')
  // ============================================================================
  if (mode === 'single') {
    const otherLang = currentLang === 'ar' ? 'en' : 'ar';
    // ضمان أن singleValue كائن { ar, en } وليس مصفوفة
    const singleValue = Array.isArray(normalizedValue) 
      ? (normalizedValue[0] || { ar: '', en: '' }) 
      : normalizedValue;
    
    return (
      <div className={`space-y-4 ${className}`}>
        
        {/* 🏷️ تسمية الحقل مع مؤشر الحقل المطلوب */}
        <label className={`text-xs font-bold block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
        
        {/* === الحقل النشط (لغة الواجهة الحالية) - قابل للتعديل دائماً === */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold ${isDark ? 'text-brand-secondary' : 'text-brand-primary'}`}>
              {langLabels[currentLang]} ✏️
            </span>
          </div>
          <input
            type="text"
            value={singleValue[currentLang] || ''}
            onChange={(e) => handleSingleChange(currentLang, e.target.value)}
            placeholder={placeholder[currentLang]}
            className={`${inputClasses} ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}
            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
            lang={currentLang}
          />
        </div>
        
        {/* === الحقل الثانوي (اللغة الأخرى) - قابل للتعديل عند النقر === */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              {langLabels[otherLang]} 
            </span>
            
            {/* 🔘 زر تبديل وضع التحرير للغة الأخرى */}
            {!isEditingOther && (
              <button
                type="button"
                onClick={() => startEditingOther(singleValue, otherLang)}
                className={`
                  text-[10px] font-bold transition-colors
                  ${isDark 
                    ? 'text-brand-secondary hover:text-brand-secondaryHover' 
                    : 'text-brand-primary hover:text-brand-primaryHover'
                  }
                `}
              >
                {/* تغيير نص الزر حسب وجود قيمة مسبقة */}
                {singleValue[otherLang]?.trim() ? '✏️ تعديل' : '➕ إضافة'}
              </button>
            )}
          </div>

          {/* === وضع العرض (للقراءة) - يظهر عند عدم التحرير === */}
          {!isEditingOther ? (
            <div 
              className={`
                w-full p-3 rounded-xl text-sm cursor-pointer transition-all
                ${isDark 
                  ? 'bg-gray-800/30 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-600'
                }
                ${currentLang === 'ar' ? 'text-right' : 'text-left'}
              `}
              // النقر على الحقل يفعّل وضع التحرير
              onClick={() => startEditingOther(singleValue, otherLang)}
              dir={otherLang === 'ar' ? 'rtl' : 'ltr'}
              lang={otherLang}
              title={t('localizedInput.clickToEditOther') || 'انقر لإضافة/تعديل النص'}
            >
              {safeGetText(singleValue[otherLang], otherLang) || (
                <span className="italic opacity-60">
                  {t('localizedInput.emptyOther') || 'انقر لإضافة النص بالإنجليزية...'}
                </span>
              )}
            </div>
          ) : (
            /* === وضع التحرير - يظهر عند النقر على الحقل الثانوي === */
            <div className="space-y-2">
              <input
                type="text"
                value={otherLangTemp}
                onChange={(e) => setOtherLangTemp(e.target.value)}
                placeholder={placeholder[otherLang]}
                className={`${inputClasses} ${currentLang === 'ar' ? 'text-left' : 'text-right'}`}
                dir={otherLang === 'ar' ? 'rtl' : 'ltr'}
                lang={otherLang}
                autoFocus  // تركيز تلقائي عند فتح وضع التحرير
              />
              
              {/* 🔘 أزرار الحفظ والإلغاء */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => saveEditingOther(singleValue, otherLang)} 
                  className="px-3 py-1.5 rounded-lg bg-brand-secondary text-white text-xs font-bold hover:bg-brand-secondaryHover transition flex items-center gap-1"
                >
                  <FaSave size={10} /> {t('localizedInput.save')}
                </button>
                <button
                  type="button"
                  onClick={cancelEditingOther}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`}
                >
                  {t('localizedInput.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 💡 ملاحظة مساعدة للمستخدم */}
        <p className={`text-[10px] italic ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
          💡 {t('localizedInput.note') || 'يمكنك إضافة النص باللغة الأخرى بالنقر على الحقل أعلاه'}
        </p>
      </div>
    );
  }

  // ============================================================================
  // 🎨 عرض المكون: وضع المصفوفات ('array') للقوائم
  // ============================================================================
  
  // ضمان أن arrayValue مصفوفة قبل العرض
  const arrayValue = Array.isArray(normalizedValue) ? normalizedValue : [];
  
  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* 🏷️ تسمية الحقل */}
      <label className={`text-xs font-bold block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>

      {/* === عرض العناصر الحالية في المصفوفة === */}
      {arrayValue.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {arrayValue.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}    // أنيميشن الدخول
                animate={{ opacity: 1, y: 0 }}     // أنيميشن الظهور
                exit={{ opacity: 0, y: -10 }}      // أنيميشن الخروج
                className={`
                  p-3 rounded-xl transition-all cursor-pointer
                  ${isDark ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-slate-50 hover:bg-slate-100'}
                  ${editingIndex === index ? 'ring-2 ring-brand-secondary' : ''}  // تمييز العنصر قيد التعديل
                  ${isRTL ? 'flex-row-reverse' : ''}  // دعم الاتجاه من اليمين لليسار
                `}
                // النقر على العنصر يفتحه للتعديل (إذا لم يكن عنصر آخر قيد التعديل)
                onClick={() => editingIndex === null && startEditingItem(index, item)}
              >
                {/* === وضع العرض العادي للعنصر (ليس قيد التعديل) === */}
                {editingIndex !== index ? (
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    
                    {/* 🔃 أزرار إعادة الترتيب (تظهر فقط إذا كان showReorder=true) */}
                    {showReorder && (
                      <div className={`flex flex-col gap-0.5 ${isRTL ? 'order-last' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleMoveArrayItem(index, -1); }}
                          disabled={index === 0}  // تعطيل زر "أعلى" للعنصر الأول
                          className={`
                            p-1 rounded transition flex items-center justify-center
                            ${index === 0 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : isDark ? 'text-gray-400 hover:text-brand-secondary' : 'text-slate-400 hover:text-brand-secondary'
                            }
                          `}
                          title={t('localizedInput.moveUp')}
                        >
                          <FaArrowUp size={9} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleMoveArrayItem(index, 1); }}
                          disabled={index === arrayValue.length - 1}  // تعطيل زر "أسفل" للعنصر الأخير
                          className={`
                            p-1 rounded transition flex items-center justify-center
                            ${index === arrayValue.length - 1 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : isDark ? 'text-gray-400 hover:text-brand-secondary' : 'text-slate-400 hover:text-brand-secondary'
                            }
                          `}
                          title={t('localizedInput.moveDown')}
                        >
                          <FaArrowDown size={9} />
                        </button>
                      </div>
                    )}

                    {/* 📝 نص العنصر مع معاينة اللغة الأخرى */}
                    <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
                        {safeGetText(item, currentLang) || t('localizedInput.empty')}
                      </span>
                      {/* مؤشر تفاعلي يشير أن العنصر قابل للتعديل */}
                      <span className={`block text-[10px] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                        {t('localizedInput.clickToEdit') || '👆 انقر للتعديل'}
                      </span>
                      {/* معاينة قيمة اللغة الأخرى */}
                      {safeGetText(item, currentLang === 'ar' ? 'en' : 'ar') && (
                        <span className={`block text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                          {langLabels[currentLang === 'ar' ? 'en' : 'ar']}: {safeGetText(item, currentLang === 'ar' ? 'en' : 'ar')}
                        </span>
                      )}
                    </div>

                    {/* 🗑️ زر حذف العنصر */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleRemoveArrayItem(index); }}
                      className={`
                        p-1.5 rounded-lg transition flex items-center justify-center
                        ${isDark ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-400 hover:text-red-600 hover:bg-red-50'}
                      `}
                      aria-label={t('localizedInput.delete')}
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                ) : (
                  /* === وضع التحرير للعنصر (يظهر عند النقر عليه) === */
                  <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                    
                    {/* رأس وضع التحرير مع أزرار الحفظ/الإلغاء */}
                    <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-gray-600' : 'border-slate-200'}`}>
                      <span className={`text-xs font-bold ${isDark ? 'text-brand-secondary' : 'text-brand-primary'}`}>
                        ✏️ {t('localizedInput.editingItem')}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={saveEditingItem}  // ✅ حفظ التغييرات
                          className="px-2 py-1 rounded bg-brand-secondary text-white text-xs font-bold hover:bg-brand-secondaryHover transition"
                        >
                          {t('localizedInput.save')}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditingItem}  // ❌ إلغاء التغييرات
                          className={`px-2 py-1 rounded text-xs font-bold transition ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          {t('localizedInput.cancel')}
                        </button>
                      </div>
                    </div>

                    {/* حقل اللغة النشطة (لغة الواجهة الحالية) */}
                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold ${isDark ? 'text-brand-secondary' : 'text-brand-primary'}`}>
                        {langLabels[currentLang]} ✏️
                      </span>
                      <input
                        type="text"
                        value={editTempValue[currentLang]}
                        onChange={(e) => handleEditTempChange(currentLang, e.target.value)}
                        placeholder={placeholder[currentLang]}
                        className={`${inputClasses} ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}
                        dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                        lang={currentLang}
                        autoFocus  // تركيز تلقائي على الحقل النشط
                      />
                    </div>

                    {/* حقل اللغة الأخرى (قابل للتعديل أيضاً) */}
                    <div className="space-y-1">
                      <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        {langLabels[currentLang === 'ar' ? 'en' : 'ar']}
                      </span>
                      <input
                        type="text"
                        value={editTempValue[currentLang === 'ar' ? 'en' : 'ar']}
                        onChange={(e) => handleEditTempChange(currentLang === 'ar' ? 'en' : 'ar', e.target.value)}
                        placeholder={placeholder[currentLang === 'ar' ? 'en' : 'ar']}
                        className={`${inputClasses} ${currentLang === 'ar' ? 'text-left' : 'text-right'}`}
                        dir={currentLang === 'ar' ? 'ltr' : 'rtl'}
                        lang={currentLang === 'ar' ? 'en' : 'ar'}
                      />
                    </div>

                    {/* 💡 ملاحظة مساعدة */}
                    <p className={`text-[10px] italic ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                      {t('localizedInput.editNote')}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* === قسم إضافة عنصر جديد للمصفوفة === */}
      <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-slate-50/50 border-slate-200'}`}>
        
        {/* حقل إدخال العنصر الجديد (اللغة النشطة) */}
        <div className="space-y-1.5">
          <span className={`text-[10px] font-bold ${isDark ? 'text-brand-secondary' : 'text-brand-primary'}`}>
            {langLabels[currentLang]} ✏️
          </span>
          <input
            type="text"
            value={newArrayItem[currentLang] || ''}
            onChange={(e) => setNewArrayItem(prev => ({ ...prev, [currentLang]: e.target.value }))}
            placeholder={placeholder[currentLang]}
            className={`${inputClasses} ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}
            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
            lang={currentLang}
            onKeyDown={(e) => e.key === 'Enter' && handleAddArrayItem()}  // دعم زر Enter للإضافة السريعة
          />
        </div>

        {/* معاينة اللغة الأخرى (للقراءة فقط) */}
        <div className="space-y-1.5 opacity-70">
          <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
            {langLabels[currentLang === 'ar' ? 'en' : 'ar']} (للقراءة)
          </span>
          <input
            type="text"
            value={newArrayItem[currentLang === 'ar' ? 'en' : 'ar'] || ''}
            onChange={(e) => setNewArrayItem(prev => ({ ...prev, [currentLang === 'ar' ? 'en' : 'ar']: e.target.value }))}
            placeholder={placeholder[currentLang === 'ar' ? 'en' : 'ar']}
            className={`
              w-full p-3 rounded-xl text-sm select-none
              ${isDark ? 'bg-gray-800/30 text-gray-400' : 'bg-slate-100 text-slate-500'}
              ${currentLang === 'ar' ? 'text-left' : 'text-right'}
            `}
            dir={currentLang === 'ar' ? 'ltr' : 'rtl'}
            lang={currentLang === 'ar' ? 'en' : 'ar'}
/>
        </div>

        {/* 🔘 زر إضافة العنصر الجديد */}
        <button
          type="button"
          onClick={handleAddArrayItem}
          disabled={!newArrayItem[currentLang]?.trim() && !newArrayItem[currentLang === 'ar' ? 'en' : 'ar']?.trim()}
          className={`
            flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-all
            ${(!newArrayItem[currentLang]?.trim() && !newArrayItem[currentLang === 'ar' ? 'en' : 'ar']?.trim())
              ? isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : isDark ? 'bg-brand-secondary text-white hover:bg-brand-secondaryHover shadow-lg shadow-brand-secondary/20' : 'bg-brand-secondary text-white hover:bg-brand-secondaryHover shadow-lg shadow-brand-secondary/20'
            }
          `}
        >
          <FaPlus size={12} /> {t('localizedInput.add')}
        </button>
      </div>

      {/* 💡 ملاحظة مساعدة عامة */}
      <p className={`text-[10px] italic ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
        💡 {t('localizedInput.note')}
      </p>
    </div>
  );
};

// ============================================================================
// 📤 تصدير المكون للاستخدام في الملفات الأخرى
// ============================================================================
export default LocalizedContentInput;