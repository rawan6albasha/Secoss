// src/components/CommentsSystem/CommentsSystem.jsx
import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from "framer-motion";
import { FaComment, FaLock, FaSignInAlt, FaLanguage } from "react-icons/fa";

// === أدوات مركزية ===
import { getLocalizedText } from "../../utils/i18n-helpers";
import { PERMISSION_KEYS, checkPermission } from "../../config/permissions";

// === مكونات ===
import ItemComments from "../ItemComments/ItemComments";
import { updatePostComments } from "../../store/slices/lecturesSlice";

const CommentsSystem = ({
  targetId,
  postAuthorId,
  isPostOwner = false,
  isAdmin = false,
  commentsDisabled = false,
  initialComments = [],
  onCommentsToggle,
}) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const currentLang = i18n?.language || "ar";
  const isRTL = currentLang === "ar";

  const { user } = useSelector((state) => state.user);

  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});

  const handleCloseReply = useCallback((commentId) => {
    setReplyingTo(null);
    if (commentId && setReplyTexts) {
      setReplyTexts((prev) => {
        const next = { ...prev };
        delete next[commentId];
        return next;
      });
    }
  }, [setReplyTexts]);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // === الصلاحيات المبسطة ===
  const permissions = useMemo(() => {
    if (!user) {
      return {
        canComment: false,
        canEditComment: () => false,
        canDeleteComment: () => false,
      };
    }

    const { role, extraPermissions = [] } = user;
    const isCommentOwner = (commentAuthorId) => user.id === commentAuthorId;

    return {
      canComment: !commentsDisabled,
      canEditComment: (commentAuthorId) => isCommentOwner(commentAuthorId),
      canDeleteComment: (commentAuthorId) => isCommentOwner(commentAuthorId) || isAdmin,
    };
  }, [user, commentsDisabled, isAdmin]);

  // === إضافة تعليق ===
  const handleAddComment = useCallback(() => {
    if (!newComment.trim() || !user) return;

    const comment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: newComment.trim(),
      author: { id: user.id, name: user.name, avatar: user.avatar, role: user.role },
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    const updated = [comment, ...comments];
    setComments(updated);
    setNewComment("");
    dispatch(updatePostComments({ postId: targetId, comments: updated }));
  }, [newComment, user, comments, targetId, dispatch]);

  // === إضافة رد ===
  const handleAddReply = useCallback((parentId, text) => {
    if (!text?.trim() || !user) return;

    const reply = {
      id: `rpl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: text.trim(),
      author: { id: user.id, name: user.name, avatar: user.avatar, role: user.role },
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    const updated = comments.map((cmt) =>
      cmt.id === parentId ? { ...cmt, replies: [...(cmt.replies || []), reply] } : cmt
    );

    setComments(updated);
    setReplyTexts((prev) => {
      const next = { ...prev };
      delete next[parentId];
      return next;
    });
    setReplyingTo(null);
    dispatch(updatePostComments({ postId: targetId, comments: updated }));
  }, [user, comments, targetId, dispatch]);

  // === حذف تعليق ===
  const handleDelete = useCallback((commentId, isReply = false, parentId = null) => {
    let updated;
    if (isReply && parentId) {
      updated = comments.map((cmt) =>
        cmt.id === parentId ? { ...cmt, replies: cmt.replies?.filter((r) => r.id !== commentId) } : cmt
      );
    } else {
      updated = comments.filter((cmt) => cmt.id !== commentId);
    }
    setComments(updated);
    dispatch(updatePostComments({ postId: targetId, comments: updated }));
  }, [comments, targetId, dispatch]);

  // === تعديل تعليق ===
  const handleEdit = useCallback((commentId, newText) => {
    const updated = comments.map((cmt) =>
      cmt.id === commentId ? { ...cmt, text: newText, edited: true } : cmt
    );
    setComments(updated);
    dispatch(updatePostComments({ postId: targetId, comments: updated }));
  }, [comments, targetId, dispatch]);

  const toggleComments = () => onCommentsToggle?.(!commentsDisabled);

  // === عدم العرض إذا لم يسجل الدخول ===
  if (!user) {
    return (
      <section className={`mt-8  pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <FaComment className="text-brand-secondary" />
            {getLocalizedText(t("comments.title") || "المناقشات الأكاديمية", currentLang)}
          </h3>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border text-center ${isDark ? 'bg-brand-secondary/10 border-brand-secondary/30' : 'bg-brand-secondary/5 border-brand-secondary/20'}`}
        >
          <div className={`flex items-center justify-center gap-2 text-sm ${isDark ? 'text-brand-secondary' : 'text-brand-primary'}`}>
            <FaSignInAlt />
            <span>{getLocalizedText(t("comments.loginToComment") || "💬 للمشاركة في النقاش العلمي، يرجى تسجيل الدخول", currentLang)}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/login")}
            className={`mt-3 px-4 py-2 rounded-lg font-bold text-xs transition ${isDark ? 'bg-brand-secondary text-white hover:bg-brand-secondaryHover' : 'bg-brand-primary text-white hover:bg-brand-primaryHover'}`}
          >
            {getLocalizedText(t("comments.login") || "تسجيل الدخول", currentLang)}
          </motion.button>
        </motion.div>
      </section>
    );
  }

  // === التعليقات مغلقة ===
  if (commentsDisabled) {
    return (
      <section className={`mt-8  pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <FaLock className={isDark ? 'text-gray-500' : 'text-gray-400'} />
            {getLocalizedText(t("comments.title") || "المناقشات الأكاديمية", currentLang)}
          </h3>
          {permissions.canDisableComments && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={toggleComments}
              className={`text-xs font-bold transition flex items-center gap-1 ${isDark ? 'text-brand-secondary hover:text-brand-secondaryHover' : 'text-brand-primary hover:text-brand-primaryHover'}`}
            >
              🔓 {getLocalizedText(t("comments.enable") || "تفعيل التعليقات", currentLang)}
            </motion.button>
          )}
        </div>
        <div className={`p-4 rounded-xl border text-center text-sm ${isDark ? 'bg-gray-800/50 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
          🔕 {getLocalizedText(t("comments.disabled") || "تم إيقاف التعليقات على هذا المنشور", currentLang)}
        </div>
      </section>
    );
  }

  return (
    <section className={`mt-8 mx-8 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* Header === */}
      <div className="mx-4 flex items-center justify-between mb-4">
        <h3 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <FaComment className="text-brand-secondary" />
          {getLocalizedText(t("comments.title") || "المناقشات الأكاديمية", currentLang)}
          <span className={`text-sm px-3 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
            {comments.length}
          </span>
        </h3>

        {permissions.canDisableComments && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={toggleComments}
            className={`text-xs font-bold transition flex items-center gap-1 ${isDark ? 'text-gray-400 hover:text-brand-secondary' : 'text-gray-500 hover:text-brand-primary'}`}
          >
            {commentsDisabled ? "🔓" : "🔕"} {commentsDisabled ? t("comments.enable") : t("comments.disable")}
          </motion.button>
        )}
      </div>

      {/* منطقة إضافة تعليق === */}
      <AnimatePresence>
        {permissions.canComment ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-6 mb-10 mx-4"
          >
            {/* Avatar المستخدم === */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 border-2 border-white shadow-lg">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                getLocalizedText(user.name, currentLang)?.charAt(0)?.toUpperCase() || "👤"
              )}
            </div>

            <div className="flex-1">
              {/* حقل الإدخال === */}
              <div className={`
                rounded-2xl px-5 py-3 border transition-all duration-200 shadow-sm
                ${isDark 
                  ? 'bg-gray-800/70 border-gray-700/80 focus-within:border-brand-secondary/60 focus-within:ring-2 focus-within:ring-brand-secondary/15 focus-within:bg-gray-800' 
                  : 'bg-gray-50 border-gray-200 focus-within:border-brand-primary/50 focus-within:ring-2 focus-within:ring-brand-primary/10 focus-within:bg-white'
                }
              `}>
            
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && newComment.trim()) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  placeholder={getLocalizedText(t("comments.placeholder") || "اكتب تعليقاً...", currentLang)}
                  aria-label={getLocalizedText(t("comments.placeholder") || "اكتب تعليقاً...", currentLang)}
                  className={`
                    w-full border-none appearance-none bg-transparent py-2 text-base outline-none ring-0 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-transparent
                    ${isDark ? 'text-white' : 'text-gray-800'}
                  `}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>

              {/* أزرار النشر === */}
              <AnimatePresence>
                {newComment.trim() && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-end gap-3 mt-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewComment('')}
                      className={`
                        px-6 py-3 text-sm font-semibold rounded-xl transition-colors
                        ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}
                      `}
                    >
                      {getLocalizedText(t("common.cancel") || "إلغاء", currentLang)}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddComment}
                      className={`
                        px-7 py-3 rounded-xl text-sm font-bold transition-colors shadow-lg hover:shadow-xl
                        ${isDark 
                          ? 'bg-brand-secondary text-white hover:bg-brand-secondaryHover' 
                          : 'bg-brand-primary text-white hover:bg-brand-primaryHover'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                      disabled={!newComment.trim()}
                    >
                      {getLocalizedText(t("comments.publish") || "نشر", currentLang)}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
  
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-xl border text-center text-sm mb-6 ${isDark ? 'bg-gray-800/50 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
          >
  
            ⚠️ {getLocalizedText(t("comments.noPermission") || "ليس لديك صلاحية لإضافة تعليقات", currentLang)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* قائمة التعليقات === */}
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ItemComments
                  comment={comment}
                  isReply={false}
                  parentId={null}
                  permissions={permissions}
                  onSubmitReply={(commentId, text) => handleAddReply(commentId, text)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStartReply={(commentId) => setReplyingTo(commentId)}
                  replyingTo={replyingTo}
                  replyTexts={replyTexts}
                  setReplyTexts={setReplyTexts}
                  onCloseReply={handleCloseReply}
                  navigate={(path) => (window.location.href = path)}
                  isAdmin={isAdmin}
                  currentUserId={user?.id}
                  formatTimeAgo={(ts) => {
                    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
                    if (diff < 60) return t("time.now") || "الآن";
                    if (diff < 3600) return `${Math.floor(diff / 60)}${t("time.minutesAgo_short") || "د"}`;
                    if (diff < 86400) return `${Math.floor(diff / 3600)}${t("time.hoursAgo_short") || "س"}`;
                    return `${Math.floor(diff / 86400)}${t("time.daysAgo_short") || "ي"}`;
                  }}
                  t={t}
                  onReport={(commentId) => {
                    console.log('Report comment:', commentId);
                  }}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-8 rounded-2xl border-2 border-dashed ${isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50'}`}
            >
              <p className="text-2xl mb-2">💬</p>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {getLocalizedText(t("comments.noComments") || "كن أول من يعلق!", currentLang)}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                {getLocalizedText(t("comments.noCommentsDesc") || "شارك برأيك العلمي حول هذا المنشور", currentLang)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CommentsSystem;