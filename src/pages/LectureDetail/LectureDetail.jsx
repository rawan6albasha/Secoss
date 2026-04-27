// src/pages/LectureDetail/LectureDetail.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../context/ThemeContext'; // ✅ إضافة useTheme
import { motion } from 'framer-motion';
import { FaTimes, FaCheck, FaMoon, FaSun } from 'react-icons/fa';

import { PERMISSION_KEYS } from '../../config/permissions';
import { useHasPermission } from './../../hooks/usePermission';
import PostFullView from '../../components/PostFullView/PostFullView';
import BackButton from '../../components/BackButton';
import { updateLectureStatus, deleteLecture } from '../../store/slices/lecturesSlice';

const LectureDetail = () => {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme(); // ✅ استخراج isDark و toggleTheme
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector(state => state.user);
  const allLectures = useSelector(state => state.lectures.items);
  
  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';
  
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  // === صلاحيات من النظام المركزي ===
  const canManageUsers = useHasPermission(PERMISSION_KEYS.MANAGE_USERS);

  // جلب بيانات المنشور
  useEffect(() => {
    const found = allLectures.find(l => l.id === id);
    if (found) setLecture(found);
    setLoading(false);
  }, [id, allLectures]);

  // === إجراءات المراجعة ===
  const handleAdminAction = (action) => {
    if (!lecture) return;
    
    if (action === 'approve') {
      dispatch(updateLectureStatus({ id: lecture.id, status: 'APPROVED' }));
      alert(t('lecture.approved') || '✅ تم قبول المنشور ونشره');
    } else if (action === 'reject') {
      const reason = prompt(t('lecture.rejectReason') || '⚠️ سبب الرفض:');
      if (reason !== null) {
        dispatch(updateLectureStatus({ 
          id: lecture.id, 
          status: 'REJECTED', 
          rejectedReason: reason 
        }));
        alert(t('lecture.rejected') || '❌ تم رفض المنشور');
      }
    } else if (action === 'delete' && canManageUsers) {
      if (confirm(t('lecture.confirmDelete') || 'هل أنت متأكد من حذف هذا المنشور نهائياً؟')) {
        dispatch(deleteLecture(lecture.id));
        navigate('/profile');
      }
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className={`
        min-h-[60vh] flex flex-col items-center justify-center
        ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-500'}
      `}>
        <BackButton />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-20 h-20 border-4 rounded-full mb-4 ${isDark ? 'border-brand-secondary border-t-brand-primary' : 'border-brand-secondary border-t-brand-primary'}`} 
        />
        <p>{t('common.loading') || 'جاري تحميل المنشور...'}</p>
      </div>
    );
  }

  // عرض حالة "غير موجود"
  if (!lecture) {
    return (
      <div className={`
        min-h-[60vh] flex flex-col items-center justify-center text-center p-8
        ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-500'}
      `}>
        <BackButton />
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-4xl mb-4"
        >
          🔍
        </motion.div>
        <p className="font-bold text-lg mb-4">
          {t('lecture.notFound') || 'لم يتم العثور على هذا المنشور'}
        </p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className={`
            px-6 py-3 rounded-full font-bold text-sm transition-all
            ${isDark 
              ? 'bg-brand-secondary text-white hover:bg-brand-secondaryHover' 
              : 'bg-brand-primary text-white hover:bg-brand-primaryHover'
            }
          `}
        >
          {t('common.back') || 'العودة للخلف'}
        </motion.button>
      </div>
    );
  }

  // تحديد الصلاحيات
  const isOwner = lecture.authorId === user?.id;
  const canEdit = (isOwner || canManageUsers) && ['PENDING', 'REJECTED'].includes(lecture.status);
  const canDelete = isOwner || canManageUsers;

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={currentLang}
      className={`
        min-h-screen transition-colors duration-300
        ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-background to-slate-50'}
        ${isRTL ? 'font-arabic rtl' : 'font-sans ltr'}
        px-4 sm:px-6 lg:px-8 py-6 lg:py-10
      `}
    >
      {/* زر تبديل الثيم === */}
      <button
        onClick={toggleTheme}
        className={`
          fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50
          p-2.5 rounded-xl transition-all duration-200
          ${isDark 
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }
        `}
        aria-label={isDark ? t('nav.lightMode') : t('nav.darkMode')}
      >
        {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
      </button>

      {/* ✅ وسّعنا الحاوية من max-w-3xl إلى max-w-5xl */}
      <div className="w-full max-w-5xl mx-auto">
        
        {/* زر الرجوع === */}
        <motion.div 
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 lg:mb-8"
        >
          <BackButton />
        </motion.div>

        {/* المنشور الرئيسي === */}
        <PostFullView 
          post={lecture}
          isOwner={isOwner}
          isAdmin={canManageUsers}
          currentUserId={user?.id}
          
          onApprove={(id) => {
            dispatch(updateLectureStatus({ id, status: 'APPROVED' }));
            alert(t('lecture.approved') || '✅ تم قبول المنشور');
          }}
          onReject={(id, reason) => {
            dispatch(updateLectureStatus({ id, status: 'REJECTED', rejectedReason: reason }));
            alert(t('lecture.rejected') || '❌ تم رفض المنشور');
          }}
          onDelete={(id) => {
            dispatch(deleteLecture(id));
            navigate('/profile');
          }}
          onEdit={canEdit ? () => navigate(`/profile?edit=${lecture.id}`) : undefined}
          
          onRefresh={() => {
            const updated = allLectures.find(l => l.id === lecture.id);
            if (updated) setLecture(updated);
          }}
        />

        {/* أزرار الأدمن العائمة === */}
        {canManageUsers && lecture.status === 'PENDING' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              fixed bottom-6 left-1/2 -translate-x-1/2 
              flex gap-3 z-50
            "
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAdminAction('reject')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all
                ${isDark 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-red-500 text-white hover:bg-red-600'
                }
              `}
            >
              <FaTimes size={14} /> {t('common.reject') || 'رفض'}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAdminAction('approve')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all
                ${isDark 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-green-500 text-white hover:bg-green-600'
                }
              `}
            >
              <FaCheck size={14} /> {t('common.approve') || 'قبول ونشر'}
            </motion.button>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default LectureDetail;