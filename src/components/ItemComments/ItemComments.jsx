// src/components/CommentsSystem/ItemComments/ItemComments.jsx
import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRegHeart, FaHeart, FaReply, FaTrash, FaEdit, 
  FaClock, FaFlag, FaEllipsisH, FaCheck, FaTimes 
} from 'react-icons/fa';

// === أدوات مركزية ===
import { getLocalizedText, getInitial } from './../../utils/i18n-helpers';
import Avatar from './../ui/Avatar';
import ActionMenu from './../ui/ActionMenu';

const ItemComments = ({ 
  comment, 
  isReply = false, 
  parentId = null,
  permissions,
  onEdit, onDelete, onStartReply, onSubmitReply, onReport,
  replyingTo, replyTexts, setReplyTexts,
  navigate, isAdmin, currentUserId, onCloseReply,
  formatTimeAgo, t: tProp,
}) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme(); // ✅ استخراج حالة الثيم
  const currentLang = i18n?.language || 'ar';
  const translate = tProp || t;
  const isRTL = currentLang === 'ar';

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment?.text || '');
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(comment?.likes || 0);

  // === صلاحيات ===
  const canDelete = useMemo(() => 
    permissions?.canDeleteComment?.(comment?.author?.id), 
    [permissions, comment?.author?.id]
  );
  const canEdit = useMemo(() => 
    permissions?.canEditComment?.(comment?.author?.id), 
    [permissions, comment?.author?.id]
  );
  const isCommentOwner = comment?.author?.id === currentUserId;

  // === التعامل مع الإعجاب ===
  const handleLike = useCallback((e) => {
    e?.stopPropagation();
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? Math.max(0, prev - 1) : prev + 1);
  }, [isLiked]);

  // === حفظ التعديل ===
  const handleSaveEdit = useCallback(() => {
    if (editText.trim() && onEdit && comment?.id) {
      onEdit(comment.id, editText);
      setIsEditing(false);
    }
  }, [editText, onEdit, comment?.id]);

  // === بدء الرد ===
  const handleStartReply = useCallback(() => {
    if (onStartReply && comment?.id) {
      onStartReply(comment.id);
    }
  }, [onStartReply, comment?.id]);

  // === إرسال الرد ===
  const handleSubmitReply = useCallback(() => {
    const text = replyTexts?.[comment?.id]?.trim();
    if (text && onSubmitReply && comment?.id) {
      onSubmitReply(comment.id, text);
      if (setReplyTexts) {
        setReplyTexts(prev => {
          const next = { ...prev };
          delete next[comment.id];
          return next;
        });
      }
    }
  }, [onSubmitReply, comment?.id, replyTexts, setReplyTexts]);

  const handleReplyTextChange = useCallback((text) => {
    if (setReplyTexts && comment?.id) {
      setReplyTexts(prev => ({ ...prev, [comment.id]: text }));
    }
  }, [comment?.id, setReplyTexts]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitReply();
    }
  }, [handleSubmitReply]);

  // === حذف تعليق ===
  const handleDelete = useCallback(() => {
    if (window.confirm(translate?.('comments.confirmDelete') || 'هل أنت متأكد من حذف هذا التعليق؟')) {
      onDelete?.(comment.id, isReply, parentId);
    }
  }, [onDelete, comment.id, isReply, parentId, translate]);

  // === إبلاغ عن تعليق ===
  const handleReport = useCallback(() => {
    if (onReport) {
      onReport(comment.id);
    } else {
      alert(translate?.('comments.reported') || '✅ تم إرسال البلاغ، شكرًا لمساهمتك');
    }
  }, [onReport, comment.id, translate]);

  // === قيم مساعدة مع دعم ثنائي اللغة ===
  const authorName = useMemo(() => 
    getLocalizedText(comment?.author?.name, currentLang), 
    [comment?.author?.name, currentLang]
  );
  
  const commentText = useMemo(() => 
    getLocalizedText(comment?.text, currentLang), 
    [comment?.text, currentLang]
  );
  
  const timeAgo = useMemo(() => 
    formatTimeAgo?.(comment?.timestamp, translate, currentLang) || 
    getLocalizedText(comment?.timestamp, currentLang), 
    [comment?.timestamp, formatTimeAgo, translate, currentLang]
  );

  // === مؤشر توفر الترجمة (للهجين) ===
  const hasTranslation = comment?.text?.ar && comment?.text?.en && comment?.text?.ar !== comment?.text?.en;
  const otherLang = currentLang === 'ar' ? 'en' : 'ar';

  if (!comment) return null;

  // === بناء قائمة الإجراءات ديناميكياً ===
  const buildActions = useCallback(() => {
    const actions = [];

    // ✅ زر الرد (للتعليقات الرئيسية فقط)
    if (!isReply && permissions?.canComment) {
      actions.push({
        label: translate?.('comments.reply') || 'رد',
        icon: FaReply,
        onClick: handleStartReply,
      });
    }

    // ✅ زر التعديل (لصاحب التعليق فقط)
    if (canEdit && isCommentOwner) {
      actions.push({
        label: translate?.('common.edit') || 'تعديل',
        icon: FaEdit,
        onClick: () => setIsEditing(true),
        className: isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700',
      });
    }

    // ✅ زر الحذف (للصاحب أو الأدمن)
    if (canDelete && (isCommentOwner || isAdmin)) {
      actions.push({
        label: translate?.('common.delete') || 'حذف',
        icon: FaTrash,
        onClick: handleDelete,
        danger: true,
      });
    }

    // ✅ زر الإبلاغ (لغير صاحب التعليق)
    if (!isCommentOwner) {
      actions.push({
        label: translate?.('comments.report') || 'الإبلاغ',
        icon: FaFlag,
        onClick: handleReport,
        className: isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800',
      });
    }

    return actions.filter(Boolean);
  }, [
    isReply, permissions, canEdit, canDelete, isCommentOwner, isAdmin,
    handleStartReply, handleDelete, handleReport, translate, isDark
  ]);

  // === زر تفاعل بسيط ===
  const ActionButton = ({ onClick, icon: Icon, label, active = false, danger = false }) => (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
        transition-all duration-200 cursor-pointer border-none
        ${danger 
          ? (isDark ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300' : 'text-red-600 hover:bg-red-50 hover:text-red-700')
          : active 
            ? (isDark ? 'text-brand-secondary bg-brand-secondary/20 hover:bg-brand-secondary/30' : 'text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20')
            : (isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800')
        }
      `}
      type="button"
      aria-label={label}
    >
      {Icon && <Icon size={16} className={active ? 'fill-current' : ''} />}
      {label && <span>{label}</span>}
    </motion.button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-6 ${isReply ? 'ms-16' : ''} ${isRTL ? 'rtl' : 'ltr'} mb-8 group`}
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={currentLang}
    >
      
      {/* === Avatar === */}
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
        <Avatar 
          user={comment?.author}
          size={isReply ? 'sm' : 'md'}
          showBadge={comment?.author?.role === 'ADMIN'}
          showBorder={true}
          showShadow={true}
          variant="gradient"
        />
      </motion.div>
      
      <div className="flex-1 min-w-0">
        {/* === صندوق التعليق/الرد === */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.2 }}
          className={`
            rounded-3xl px-6 py-5 transition-all duration-200
            ${isDark 
              ? 'bg-gray-800/50 hover:bg-gray-800 hover:shadow-gray-700/30' 
              : 'bg-gray-50 hover:bg-white hover:shadow-lg'
            }
          `}
        >
          
          {/* Header: الاسم + الوقت + قائمة الإجراءات === */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <motion.span 
                whileHover={{ scale: 1.02 }}
                className={`font-bold text-base cursor-pointer transition-colors ${isDark ? 'text-white hover:text-brand-secondary' : 'text-gray-900 hover:text-brand-primary'}`}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (comment?.author?.id && navigate) navigate(`/profile/${comment.author.id}`); 
                }}
              >
                {authorName}
              </motion.span>
              
              {/* شارة الأدمن === */}
              {comment?.author?.role === 'ADMIN' && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-[10px] bg-brand-primary text-white px-2.5 py-1 rounded-full font-bold"
                >
                  👑
                </motion.span>
              )}
              
              {/* الوقت === */}
              <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-500'}`}>
                <FaClock size={12} />
                {timeAgo}
              </span>
              
              {/* مؤشر التعديل === */}
              {comment?.edited && (
                <span className={`text-xs px-2 py-1 rounded ${isDark ? 'text-gray-400 bg-gray-700' : 'text-gray-400 bg-white'}`}>
                  {translate?.('comments.edited') || 'معدّل'}
                </span>
              )}

              {/* مؤشر توفر الترجمة (للهجين) === */}
              {hasTranslation && !isReply && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1 ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-slate-100 text-slate-500'}`}
                  title={translate?.('comments.hasTranslation')?.replace('{lang}', otherLang === 'ar' ? 'العربية' : 'English') || `متوفر بـ ${otherLang === 'ar' ? 'العربية' : 'الإنجليزية'}`}
                >
                  <FaFlag size={10} className="rotate-90" /> {otherLang === 'ar' ? 'ع' : 'EN'}
                </motion.span>
              )}
            </div>

            {/* === ActionMenu === */}
            <ActionMenu
              actions={buildActions()}
              triggerIcon={<FaEllipsisH size={18} />}
              menuPosition={isRTL ? 'left' : 'right'}
              menuAlign="top"
              tooltip={translate?.('comments.moreOptions') || 'خيارات إضافية'}
              zIndex={9999}
              triggerClassName={`
                p-2 rounded-xl transition-all duration-200
                ${isDark 
                  ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }
              `}
              menuClassName={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
            />
          </div>
          
          {/* نص التعليق أو نموذج التعديل === */}
          <AnimatePresence mode="wait">
            {isEditing && canEdit ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <textarea 
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className={`
                    w-full p-4 rounded-xl border text-sm resize-y min-h-32 outline-none transition-all leading-relaxed
                    ${isDark 
                      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20' 
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
                    }
                  `}
                  autoFocus
                  dir={isRTL ? 'rtl' : 'ltr'}
                  placeholder={translate?.('comments.editPlaceholder') || 'عدّل تعليقك...'}
                />
                <div className="flex gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSaveEdit}
                    disabled={!editText.trim()}
                    className={`
                      px-6 py-2.5 rounded-xl text-sm font-bold transition-colors
                      ${isDark 
                        ? 'bg-brand-secondary text-white hover:bg-brand-secondaryHover disabled:bg-gray-700 disabled:text-gray-500' 
                        : 'bg-brand-primary text-white hover:bg-brand-primaryHover disabled:bg-gray-200 disabled:text-gray-400'
                      }
                    `}
                    type="button"
                  >
                    <FaCheck className="inline me-1" size={12} /> {translate?.('common.save') || 'حفظ'}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setIsEditing(false); setEditText(comment?.text || ''); }}
                    className={`
                      px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors
                      ${isDark 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }
                    `}
                    type="button"
                  >
                    <FaTimes className="inline me-1" size={12} /> {translate?.('common.cancel') || 'إلغاء'}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.p 
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-base whitespace-pre-wrap break-words leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
                dir="auto"
              >
                {commentText}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* === أزرار التفاعل === */}
        {!isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 mt-4 ms-3"
          >
            {/* زر الإعجاب === */}
            <ActionButton 
              onClick={handleLike}
              icon={isLiked ? FaHeart : FaRegHeart}
              label={likes > 0 ? `${likes}` : translate?.('comments.like') || 'إعجاب'}
              active={isLiked}
            />
            
            {/* زر الرد (للتعليقات الرئيسية فقط) === */}
            {!isReply && permissions?.canComment && (
              <ActionButton 
                onClick={handleStartReply}
                icon={FaReply}
                label={translate?.('comments.reply') || 'رد'}
              />
            )}
          </motion.div>
        )}
  
        {/* === نموذج الرد === */}
        <AnimatePresence>
          {replyingTo === comment?.id && permissions?.canComment && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-4 mt-6 ms-3"
            >
              <Avatar 
                user={{ 
                  id: currentUserId, 
                  name: currentUserId === comment?.author?.id ? authorName : translate?.('comments.you') || 'أنت',
                  avatar: currentUserId === comment?.author?.id ? comment?.author?.avatar : undefined 
                }}
                size="sm"
                showStatus={true}
                isOnline={true}
              />
              <div className="flex-1">
                <motion.div 
                  className={`rounded-2xl px-5 py-4 border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                >
                  <input 
                    type="text"
                    value={replyTexts?.[comment?.id] || ''}
                    onChange={(e) => handleReplyTextChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={translate?.('comments.replyPlaceholder') || 'اكتب ردك...'}
                    className={`
                      w-full bg-transparent text-sm outline-none placeholder-gray-400 py-2
                      ${isDark ? 'text-white' : 'text-gray-800'}
                    `}
                    autoFocus
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </motion.div>
                <div className="flex gap-3 mt-4 ms-3">
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmitReply}
                    disabled={!replyTexts?.[comment?.id]?.trim()}
                    className={`
                      px-6 py-2.5 rounded-xl text-sm font-bold transition-colors
                      ${isDark 
                        ? 'bg-brand-secondary text-white hover:bg-brand-secondaryHover disabled:bg-gray-700 disabled:text-gray-500' 
                        : 'bg-brand-primary text-white hover:bg-brand-primaryHover disabled:bg-gray-200 disabled:text-gray-400'
                      }
                    `}
                    type="button"
                  >
                    {translate?.('common.send') || 'إرسال'}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onCloseReply?.(comment?.id)}
                    className={`
                      px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors
                      ${isDark 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }
                    `}
                    type="button"
                  >
                    {translate?.('common.cancel') || 'إلغاء'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === عرض الردود المتداخلة === */}
        {comment?.replies?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-8 space-y-8 ms-4 border-s-2 ps-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              className={`text-sm font-semibold flex items-center gap-2 transition-colors ${isDark ? 'text-brand-secondary hover:text-brand-secondaryHover' : 'text-brand-primary hover:text-brand-primaryHover'}`}
              type="button"
            >
              <FaReply size={14} />
              {comment.replies.length} {translate?.('comments.viewReplies') || 'عرض الردود'}
            </motion.button>
            
            {comment.replies.map((reply) => (
              <motion.div 
                key={reply.id}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group"
              >
                <ItemComments
                  comment={reply}
                  isReply={true}
                  parentId={comment.id}
                  permissions={permissions}
                  onEdit={onEdit} 
                  onDelete={onDelete}
                  onReport={onReport}
                  onStartReply={onStartReply} 
                  onSubmitReply={onSubmitReply}
                  replyingTo={replyingTo} 
                  replyTexts={replyTexts} 
                  setReplyTexts={setReplyTexts}
                  onCloseReply={onCloseReply} 
                  navigate={navigate}
                  isAdmin={isAdmin} 
                  currentUserId={currentUserId}
                  formatTimeAgo={formatTimeAgo} 
                  t={tProp}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ItemComments;