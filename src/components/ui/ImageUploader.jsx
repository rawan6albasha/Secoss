// src/components/ui/ImageUploader/ImageUploader.jsx
import { useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { FaPlus, FaImage, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const ImageUploader = ({ 
  onUpload, 
  onError,  // ✅ callback للأخطاء بدلاً من alert
  labelKey = 'common.uploadImage',
  className = '',
  maxSizeMB = 5,
  acceptedTypes = 'image/*',
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
  
  const label = t(labelKey);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      const errorMsg = t('common.errors.invalidImage') || 'يرجى اختيار صورة صحيحة';
      onError?.(errorMsg);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
      e.target.value = ''; // إعادة تعيين الحقل
      return;
    }
    
    // ✅ التحقق من الحجم
    if (file.size > maxSizeMB * 1024 * 1024) {
      const errorMsg = t('common.errors.imageTooLarge', { size: maxSizeMB }) 
        || `حجم الصورة يجب أن يكون أقل من ${maxSizeMB}MB`;
      onError?.(errorMsg);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
      e.target.value = '';
      return;
    }
    
    // ✅ قراءة ورفع الصورة
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload?.(reader.result);
      setUploadStatus('success');
      setTimeout(() => setUploadStatus(null), 2000);
    };
    reader.onerror = () => {
      const errorMsg = t('common.errors.uploadFailed') || 'فشل في رفع الصورة';
      onError?.(errorMsg);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
    };
    reader.readAsDataURL(file);
    
    // إعادة تعيين الحقل للسماح برفع نفس الملف مرة أخرى
    e.target.value = '';
  }, [onUpload, onError, t, maxSizeMB]);

  return (
    <label 
      className={`
        relative w-full aspect-square rounded-2xl 
        border-2 border-dashed transition-all duration-200 cursor-pointer
        flex flex-col items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-brand-secondary/50
        ${isHovered 
          ? 'border-brand-secondary bg-brand-light/30 dark:bg-brand-secondary/10' 
          : isDark ? 'border-gray-600 hover:border-brand-secondary' : 'border-gray-300 hover:border-brand-secondary'
        }
        ${uploadStatus === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
        ${uploadStatus === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && document.querySelector(`[for="${label}"]`)?.click()}
      aria-label={label}
      role="button"
    >
      {/* أيقونة الحالة === */}
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center
        transition-all duration-200
        ${uploadStatus === 'success' 
          ? 'bg-green-500 text-white' 
          : uploadStatus === 'error'
            ? 'bg-red-500 text-white'
            : isHovered 
              ? 'bg-brand-secondary text-white' 
              : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
        }
      `}>
        {uploadStatus === 'success' ? (
          <FaCheck size={18} />
        ) : uploadStatus === 'error' ? (
          <FaExclamationTriangle size={18} />
        ) : isHovered ? (
          <FaImage size={18} />
        ) : (
          <FaPlus size={18} />
        )}
      </div>
      
      {/* النص === */}
      <span className={`
        text-[10px] font-bold text-center px-2 transition-colors
        ${uploadStatus === 'success' 
          ? 'text-green-600 dark:text-green-400' 
          : uploadStatus === 'error'
            ? 'text-red-600 dark:text-red-400'
            : isHovered 
              ? 'text-brand-secondary' 
              : isDark ? 'text-gray-400' : 'text-gray-500'
        }
      `}>
        {uploadStatus === 'success' 
          ? t('common.uploadSuccess') || 'تم الرفع!' 
          : uploadStatus === 'error'
            ? t('common.uploadError') || 'خطأ!'
            : label
        }
      </span>
      
      {/* حقل الإدخال المخفي === */}
      <input 
        type="file" 
        className="hidden" 
        onChange={handleFileChange} 
        accept={acceptedTypes}
        aria-hidden="true"
        tabIndex={-1}
      />
      
      {/* تلميح الحجم === */}
      <span className={`
        absolute -bottom-5 text-[9px] 
        ${isDark ? 'text-gray-500' : 'text-slate-400'}
      `}>
        {t('common.maxSize', { size: maxSizeMB }) || `أقصى حجم: ${maxSizeMB}MB`}
      </span>
    </label>
  );
};

export default ImageUploader;