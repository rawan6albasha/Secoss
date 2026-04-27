// src/components/PostFullView/PostFullView.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from "framer-motion";

// === أيقونات ===
import {
  FaHeart, FaRegHeart, FaComment, FaShare, FaBookmark,
  FaFilePdf, FaChevronDown, FaChevronUp, FaEdit, FaTrash,
  FaCheck, FaTimes, FaWhatsapp, FaTelegramPlane,
  FaLinkedin, FaFacebookF, FaDownload, FaPrint, FaFlag,
  FaLanguage, FaGlobe
} from "react-icons/fa";

// === Redux Actions ===
import {
  updateLectureStatus,
  updateLecture,
  deleteLecture,
  updateCommentsSettings,
} from "../../store/slices/lecturesSlice";

// === مكونات وأدوات ===
import Tag from "../ui/Tag";
import CommentsSystem from "../CommentsSystem/CommentsSystem";
import PermissionGate from "../RBAC/PermissionGate";
import RoleGuard from "../RBAC/RoleGuard";
import roles from "./../../config/roles";
import { getLocalizedText, getInitial } from "../../utils/i18n-helpers";
import ActionMenu from "../ui/ActionMenu";
import Avatar from "../ui/Avatar";
import ShareButtons from "../ui/ShareButtons";

const PostFullView = ({
  post,
  isOwner = false,
  isAdmin = false,
  currentUserId = null,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onRefresh,
  onReport,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const { user } = useSelector((state) => state.user);
  
  const currentLang = i18n?.language || 'ar';
  const isRTL = currentLang === 'ar';

  // === حالة العرض المحلي ===
  const [showFullContent, setShowFullContent] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes || 0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // مزامنة الإعجاب
  useEffect(() => {
    if (post?.likedBy?.includes(user?.id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    setLikesCount(post?.likes || 0);
  }, [post, user]);

  // === التعامل مع الإعجاب ===
  const toggleLike = useCallback((e) => {
    e?.stopPropagation();
    if (!user) {
      alert(t('post.loginToLike') || "يرجى تسجيل الدخول للإعجاب");
      return;
    }
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount((prev) => newLikedState ? prev + 1 : Math.max(0, prev - 1));
  }, [isLiked, user, t]);

  // === الذهاب لبروفايل الكاتب ===
  const goToAuthorProfile = useCallback((e, authorId) => {
    e?.stopPropagation();
    if (authorId) navigate(`/profile/${authorId}`);
  }, [navigate]);

  // === إجراءات الإدارة ===
  const handleAdminAction = useCallback((action, e) => {
    e?.stopPropagation();
    if (action === "approve") {
      if (onApprove) onApprove(post.id);
      else dispatch(updateLectureStatus({ id: post.id, status: "APPROVED" }));
      onRefresh?.();
    } else if (action === "reject") {
      const reason = prompt(t('post.rejectReason') || "⚠️ سبب الرفض:");
      if (reason !== null) {
        if (onReject) onReject(post.id, reason);
        else dispatch(updateLectureStatus({ id: post.id, status: "REJECTED", rejectedReason: reason }));
        onRefresh?.();
      }
    } else if (action === "delete") {
      if (confirm(t('post.confirmDelete') || "هل أنت متأكد من حذف هذا المنشور نهائياً؟")) {
        dispatch(deleteLecture(post.id));
        onDelete?.(post.id);
        onRefresh?.();
      }
    }
  }, [post, dispatch, onApprove, onReject, onDelete, onRefresh, t]);

  // === مشاركة المنشور ===
  const handleShare = useCallback((platform, e) => {
    e?.stopPropagation();
    setShowShareMenu(false);
    const shareUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(getLocalizedText(post?.title, currentLang));
    const urls = {
      whatsapp: `https://wa.me/?text=${title}%20${shareUrl}`,
      telegram: `https://t.me/share/url?url=${shareUrl}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    };
    if (platform === "copy") {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert(t('post.linkCopied') || "✅ تم نسخ الرابط!"))
        .catch(() => alert(t('post.copyFailed') || "❌ فشل نسخ الرابط"));
    } else {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  }, [post, currentLang, t]);

  // === تحميل المنشور ===
  const handleDownload = useCallback((e) => {
    e?.stopPropagation();
    if (post?.attachmentUrl) {
      const link = document.createElement('a');
      link.href = post.attachmentUrl;
      link.download = getLocalizedText(post?.attachmentName, currentLang) || 'file';
      link.click();
    }
  }, [post, currentLang]);

  // === طباعة المنشور ===
  const handlePrint = useCallback((e) => {
    e?.stopPropagation();
    window.print();
  }, []);

  // === تعديل المنشور ===
  const handleEdit = useCallback((e) => {
    e?.stopPropagation();
    if (onEdit) onEdit(post);
    else navigate(`/profile?edit=${post.id}`);
  }, [onEdit, post, navigate]);

  // === حذف المنشور ===
  const handleDelete = useCallback((e) => {
    e?.stopPropagation();
    if (confirm(t('post.confirmDelete') || "هل أنت متأكد من حذف هذا المنشور نهائياً؟")) {
      dispatch(deleteLecture(post.id));
      onDelete?.(post.id);
      onRefresh?.();
    }
  }, [post, dispatch, onDelete, onRefresh, t]);

  // === إبلاغ عن المنشور ===
  const handleReportPost = useCallback((e) => {
    e?.stopPropagation();
    if (onReport) {
      onReport(post.id);
    } else {
      alert(t('post.reported') || "✅ تم إرسال البلاغ، شكرًا لمساهمتك");
    }
  }, [onReport, post.id, t]);

  // === الصلاحيات ===
  const permissions = useMemo(() => {
    const canEditPost = isOwner && !isAdmin && ["PENDING", "REJECTED"].includes(post?.status);
    const canDeletePost = isOwner || isAdmin;
    const canToggleComments = isOwner || isAdmin;
    
    return {
      canEditPost,
      canDeletePost,
      canToggleComments,
      canEdit: canEditPost,
      canDelete: canDeletePost,
    };
  }, [isOwner, isAdmin, post?.status]);

  // === بناء قائمة الإجراءات ===
  const buildPostActions = useCallback(() => {
    const actions = [];

    actions.push(
      {
        label: t('post.share') || 'مشاركة',
        icon: FaShare,
        onClick: (e) => handleShare('copy', e),
      },
      {
        label: t('post.download') || 'تحميل',
        icon: FaDownload,
        onClick: handleDownload,
        visible: !!post?.attachmentUrl,
      },
      {
        label: t('post.print') || 'طباعة',
        icon: FaPrint,
        onClick: handlePrint,
        shortcut: 'Ctrl+P',
      }
    );

    if (permissions.canEditPost || permissions.canDeletePost || isAdmin) {
      actions.push({ divider: true });
    }

    if (permissions.canEditPost && onEdit) {
      actions.push({
        label: t('common.edit') || 'تعديل',
        icon: FaEdit,
        onClick: handleEdit,
      });
    }

    if (permissions.canDeletePost) {
      actions.push({
        label: t('common.delete') || 'حذف',
        icon: FaTrash,
        onClick: handleDelete,
        danger: true,
      });
    }

    if (!isOwner) {
      actions.push({
        label: t('post.report') || 'الإبلاغ',
        icon: FaFlag,
        onClick: handleReportPost,
        className: 'text-gray-600',
      });
    }

    return actions;
  }, [permissions, isOwner, post, handleShare, handleDownload, handlePrint, handleEdit, handleDelete, handleReportPost, onEdit, t]);

  if (!post) {
    return (
      <div className={`
        p-8 text-center rounded-3xl border font-arabic
        ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-100 text-gray-500'}
      `}>
        ⚠️ {t('post.dataNotAvailable') || 'بيانات المنشور غير متاحة'}
      </div>
    );
  }

  const getStatusStyle = (status) => {
    const styles = {
      APPROVED: { bg: 'bg-green-500/15', text: 'text-green-600', label: t('status.approved') || 'منشور' },
      PENDING: { bg: 'bg-yellow-500/15', text: 'text-yellow-600', label: t('status.pending') || 'قيد المراجعة' },
      REJECTED: { bg: 'bg-red-500/15', text: 'text-red-600', label: t('status.rejected') || 'مرفوض' },
    };
    return styles[status] || styles.PENDING;
  };
  const statusStyle = getStatusStyle(post.status);

  // === مؤشر توفر الترجمة ===
  const hasTranslation = post?.title?.ar && post?.title?.en && post?.title?.ar !== post?.title?.en;
  const otherLang = currentLang === 'ar' ? 'en' : 'ar';
  const hasContentInOtherLang = post?.fullContent?.[otherLang]?.trim();

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-3xl border shadow-sm transition-all duration-200
        ${isDark 
          ? 'bg-gray-800 border-gray-700 hover:shadow-gray-700/50' 
          : 'bg-white border-gray-100 hover:shadow-lg'
        }
      `}
    >
      
      {/* ========== Header ========== */}
      <header className={`p-4 sm:p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex items-start justify-between gap-4">
          
          {/* معلومات الكاتب */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={(e) => goToAuthorProfile(e, post.authorId)}
            whileHover={{ scale: 1.02 }}
          >
            <Avatar 
              user={{
                id: post.authorId,
                name: post.speaker,
                avatar: post.author?.avatar,
                role: post.author?.role,
              }}
              size="md"
              showBadge={post.author?.role === 'ADMIN'}
              showBorder={true}
              showShadow={true}
              variant="gradient"
            />
            
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3
                className={`font-black text-base cursor-pointer transition-colors ${isDark ? 'text-white hover:text-brand-secondary' : 'text-gray-900 hover:text-brand-primary'}`}
                onClick={(e) => { e.stopPropagation(); goToAuthorProfile(e, post.authorId); }}
              >
                {getLocalizedText(post.speaker, currentLang)}
              </h3>
              <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>{getLocalizedText(post.category, currentLang)}</span>
                <span>•</span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* الحالة + قائمة الإجراءات */}
          <div className="flex items-center gap-2">
            {/* شارة الحالة */}
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
              {statusStyle.label}
            </span>

            {/* مؤشر توفر الترجمة (للمؤلف فقط) === */}
            {isOwner && hasContentInOtherLang && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 rounded-full text-[10px] font-bold bg-brand-secondary/20 text-brand-secondary flex items-center gap-1"
                title={t('post.hasTranslation') || 'متوفر ترجمة للغة الأخرى'}
              >
                <FaLanguage size={10} /> {otherLang === 'ar' ? 'ع' : 'EN'}
              </motion.span>
            )}

            {/* قائمة الإجراءات */}
            <ActionMenu
              actions={buildPostActions()}
              menuPosition={isRTL ? 'left' : 'right'}
              menuAlign="top"
              tooltip={t('post.moreOptions') || 'خيارات إضافية'}
              zIndex={9999}
              menuClassName="overflow-visible"
            />
          </div>
        </div>

        {/* رسالة الرفض */}
        {post.status === "REJECTED" && post.rejectedReason && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`
              mt-3 p-3 rounded-xl border text-xs font-bold
              ${isDark ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-600'}
            `}
          >
            ⚠️ {t('post.rejectReason') || 'سبب الرفض'}: {post.rejectedReason}
          </motion.div>
        )}
      </header>

      {/* ========== Content ========== */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* العنوان مع مؤشر الترجمة === */}
        <div className="flex items-start justify-between gap-2">
          <h1 className={`font-black text-2xl leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {getLocalizedText(post.title, currentLang)}
          </h1>
          {/* مؤشر توفر الترجمة للزوار === */}
          {hasTranslation && !isOwner && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`
                px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1
                ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-500'}
              `}
              title={t('post.availableIn')?.replace('{lang}', otherLang === 'ar' ? 'العربية' : 'English') || `متوفر بـ ${otherLang === 'ar' ? 'العربية' : 'الإنجليزية'}`}
            >
              <FaGlobe size={10} /> {otherLang === 'ar' ? 'ع' : 'EN'}
            </motion.span>
          )}
        </div>

        {/* الوصف المختصر === */}
        {post.summary && (
          <p className={`
            text-base leading-relaxed italic border-s-4 border-brand-secondary ps-4
            ${isDark ? 'text-gray-300' : 'text-gray-600'}
          `}>
            {getLocalizedText(post.summary, currentLang)}
          </p>
        )}

        {/* المرفق: صورة === */}
        {post.attachmentType === "image" && post.attachmentUrl && (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl overflow-hidden border cursor-pointer group"
            onClick={(e) => { e.stopPropagation(); window.open(post.attachmentUrl, "_blank"); }}
          >
            <img
              src={post.attachmentUrl}
              alt={getLocalizedText(post.title, currentLang)}
              className="w-full h-auto max-h-96 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </motion.div>
        )}

        {/* المرفق: PDF === */}
        {post.attachmentType === "pdf" && post.attachmentUrl && (
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className={`
              flex items-center gap-4 p-4 rounded-2xl border
              ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}
            `}
          >
            <div className={`
              w-16 h-16 rounded-xl flex items-center justify-center
              ${isDark ? 'bg-red-900/30' : 'bg-red-50'}
            `}>
              <FaFilePdf size={24} className="text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {getLocalizedText(post.attachmentName, currentLang) || (t('post.pdfFile') || 'ملف PDF')}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{post.fileSize || ''}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className={`
                px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2
                ${isDark 
                  ? 'bg-brand-secondary text-white hover:bg-brand-secondaryHover' 
                  : 'bg-brand-secondary text-white hover:bg-brand-secondaryHover'
                }
              `}
            >
              <FaDownload size={14} /> {t('post.download') || 'تحميل'}
            </motion.button>
          </motion.div>
        )}

        {/* المقال الكامل === */}
        {post.fullContent && (
          <div>
            <div className={`
              text-base leading-relaxed whitespace-pre-wrap
              ${!showFullContent ? 'line-clamp-4' : ''}
              ${isDark ? 'text-gray-200' : 'text-gray-800'}
            `}>
              {getLocalizedText(post.fullContent, currentLang)}
            </div>
            {post.fullContent?.length > 200 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => { e.stopPropagation(); setShowFullContent(!showFullContent); }}
                className={`
                  mt-2 font-bold text-sm flex items-center gap-1 transition-all
                  bg-transparent border-none cursor-pointer
                  ${isDark ? 'text-brand-secondary hover:text-brand-secondaryHover' : 'text-brand-primary hover:text-brand-primaryHover'}
                `}
              >
                {showFullContent ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                {showFullContent ? (t('post.showLess') || 'عرض أقل') : (t('post.showMore') || 'عرض المزيد')}
              </motion.button>
            )}
            
            {/* إشعار الترجمة المتاحة === */}
            {hasContentInOtherLang && !isOwner && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`
                  mt-3 p-3 rounded-xl text-xs flex items-center gap-2
                  ${isDark ? 'bg-gray-700/30 text-gray-400' : 'bg-slate-50 text-slate-500'}
                `}
              >
                <FaLanguage size={12} />
                <span>
                  {t('post.translationAvailable')?.replace('{lang}', otherLang === 'ar' ? 'العربية' : 'English') 
                    || `💡 هذا المحتوى متاح أيضاً بـ ${otherLang === 'ar' ? 'العربية' : 'الإنجليزية'}`}
                </span>
              </motion.div>
            )}
          </div>
        )}

        {/* الوسوم === */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag, idx) => (
              <Tag key={idx} variant="muted" className="text-[10px]">
                #{getLocalizedText(tag, currentLang)}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* ========== Stats ========== */}
      <div className={`
        px-4 sm:px-6 py-3 border-y flex items-center justify-between text-xs
        ${isDark ? 'border-gray-700 bg-gray-800/50 text-gray-400' : 'border-gray-100 bg-gray-50/80 text-gray-500'}
      `}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FaHeart size={12} className="text-red-500" /> {likesCount}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
            className={`flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer ${isDark ? 'hover:text-brand-secondary' : 'hover:text-brand-primary'}`}
          >
            <FaComment size={12} /> {post.commentsCount || 0} {t('post.comments') || 'تعليق'}
          </motion.button>
        </div>
        <span className="flex items-center gap-1">
          👁️ {post.views || 0} {t('post.views') || 'مشاهدة'}
        </span>
      </div>

      {/* ========== Action Buttons ========== */}
      <div className="p-2 flex items-center justify-around gap-2 border-b flex-wrap">
        {/* زر الإعجاب === */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleLike}
          className={`
            flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all flex-1 min-w-24 justify-center border-none cursor-pointer
            ${isLiked 
              ? (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600')
              : (isDark ? 'bg-transparent text-gray-400 hover:bg-gray-700' : 'bg-transparent text-gray-500 hover:bg-gray-50')
            }
          `}
        >
          {isLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
          <span className="hidden sm:inline">{t('post.like') || 'إعجاب'}</span>
        </motion.button>

        {/* زر عرض التعليقات === */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
          className={`
            flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-colors flex-1 min-w-24 justify-center border-none cursor-pointer
            ${isDark ? 'text-gray-400 hover:text-brand-secondary hover:bg-gray-700' : 'text-gray-500 hover:text-brand-primary hover:bg-gray-50'}
          `}
        >
          <FaComment size={18} />
          <span className="hidden sm:inline">{t('post.comment') || 'تعليق'}</span>
        </motion.button>

        {/* زر المشاركة === */}
        <div className="relative flex-1 min-w-24">
          <ShareButtons
            url={window.location.href}
            title={getLocalizedText(post?.title, currentLang)}
            variant="dropdown"
            showLabel={true}
            iconSize={20}
            className="w-full justify-center"
          />
        </div>

        {/* زر الحفظ === */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            px-3 py-3 rounded-xl transition-colors min-w-auto flex-none border-none cursor-pointer
            ${isDark ? 'text-gray-400 hover:text-brand-secondary hover:bg-gray-700' : 'text-gray-500 hover:text-brand-primary hover:bg-gray-50'}
          `}
          title={t('post.save') || 'حفظ'}
        >
          <FaBookmark size={18} />
        </motion.button>
      </div>

      {/* ========== Comments System ========== */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CommentsSystem
              targetId={post.id}
              postAuthorId={post.authorId}
              isPostOwner={isOwner}
              isAdmin={isAdmin}
              commentsDisabled={post.commentsDisabled}
              initialComments={post.comments || []}
              onCommentsToggle={(enabled) => {
                dispatch(updateCommentsSettings({ id: post.id, commentsDisabled: !enabled }));
                onRefresh?.();
              }}
              onReport={handleReportPost}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== أزرار الأدمن العائمة ========== */}
      {isAdmin && post.status === "PENDING" && (
        <PermissionGate requiredPermission="manage_posts">
          <RoleGuard requiredRoles={[roles.ADMIN]}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleAdminAction("reject", e)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all border-none cursor-pointer
                  ${isDark ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}
                `}
              >
                <FaTimes size={14} /> {t('common.reject') || 'رفض'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleAdminAction("approve", e)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all border-none cursor-pointer
                  ${isDark ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}
                `}
              >
                <FaCheck size={14} /> {t('common.approvePublish') || 'قبول ونشر'}
              </motion.button>
            </motion.div>
          </RoleGuard>
        </PermissionGate>
      )}
    </motion.article>
  );
};

export default PostFullView;