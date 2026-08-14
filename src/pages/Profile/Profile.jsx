// src/pages/Profile/Profile.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

import { PERMISSION_KEYS } from '../../config/permissions';
import { useHasPermission } from './../../hooks/usePermission';
import { getLocalizedText } from '../../utils/i18n-helpers';

import { updateUserProfile } from "./../../store/slices/userSlice";
import { updateLectureStatus, deleteLecture } from "./../../store/slices/lecturesSlice";

// === المكونات ===
import Button from "../../components/ui/Button";
import Tag from "../../components/ui/Tag";
import EmptyState from "../../components/ui/EmptyState";
import CreatePostModal from "../../components/CreatePostModal/CreatePostModal";
import PostFullView from "../../components/PostFullView/PostFullView";
import PendingCard from "../../components/PendingCard/PendingCard";
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
import ProfileBio from './ProfileBio';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme(); // ✅ نفس الطريقة المستخدمة في News.jsx
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  
  const { user: currentUser } = useSelector(state => state.user);
  const allLectures = useSelector((state) => state.lectures.items);
  
  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';

  // === تحديد: هل هذا ملفي أم ملف مستخدم آخر؟ ===
  const isOwnProfile = !userId || userId === currentUser?.id;
  const isMember=true;
  // === صلاحيات ===
  const canPublish = useHasPermission(PERMISSION_KEYS.PUBLISH_CONTENT);
  const canManageUsers = useHasPermission(PERMISSION_KEYS.MANAGE_USERS);
  const canEdit = isOwnProfile;

  // === الحالة المحلية ===
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("published");
  const [tempData, setTempData] = useState({ ...currentUser });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // مزامنة البيانات
  useEffect(() => {
    setTempData({ ...currentUser });
    setIsEditing(false);
  }, [currentUser, userId]);

  // === حفظ التعديلات ===
  const handleSaveAll = useCallback(() => {
    dispatch(updateUserProfile(tempData));
    setIsEditing(false);
  }, [dispatch, tempData]);

  // === فلترة المنشورات ===
  const targetUserId = userId || currentUser?.id;
  
  const userPosts = useMemo(
    () => allLectures.filter((post) => post.authorId === targetUserId),
    [allLectures, targetUserId]
  );

  const publishedPosts = useMemo(
    () => userPosts.filter((post) => post.status === "APPROVED"),
    [userPosts]
  );

  const pendingPosts = useMemo(
    () => userPosts.filter((post) => ["PENDING", "REJECTED"].includes(post.status)),
    [userPosts]
  );

  const adminReviewList = useMemo(
    () => canManageUsers && isOwnProfile
      ? allLectures.filter((post) => post.status === "PENDING" && post.authorId !== currentUser?.id)
      : [],
    [allLectures, canManageUsers, isOwnProfile, currentUser?.id]
  );

  // === إجراءات المراجعة ===
  const handleReviewAction = useCallback((id, newStatus) => {
    let rejectedReason = '';
    if (newStatus === 'REJECTED') {
      rejectedReason = prompt(t('profile.rejectReason') || '⚠️ سبب الرفض:') || '';
    }
    dispatch(updateLectureStatus({ id, status: newStatus, rejectedReason: rejectedReason || undefined }));
  }, [dispatch, t]);

  // === تبويبات البروفايل ===
  const tabs = useMemo(() => {
    const baseTabs = [
      { id: 'published', label: t('profile.published') || 'المنشورات', count: publishedPosts.length },
    ];
    if (isOwnProfile) {
      baseTabs.push({ id: 'pending', label: t('profile.pending') || 'قيد المراجعة', count: pendingPosts.length });
    }
    if (canManageUsers && isOwnProfile) {
      baseTabs.push({ id: 'admin', label: t('profile.adminReview') || 'المراجعات', count: adminReviewList.length });
    }
    return baseTabs;
  }, [isOwnProfile, canManageUsers, publishedPosts.length, pendingPosts.length, adminReviewList.length, t]);

  // === عرض حالة التحميل ===
  if (!currentUser) {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-16 h-16 border-4 rounded-full ${isDark ? 'border-brand-secondary border-t-brand-primary' : 'border-brand-secondary border-t-brand-primary'}`} 
        />
      </div>
    );
  }

  // === المستخدم المعروض ===
  const displayedUser = isOwnProfile ? currentUser : { 
    ...currentUser, 
    id: userId,
    name: { ar: 'مستخدم', en: 'User' },
    degree: { ar: 'عضو', en: 'Member' },
    work: '',
    specialization: '',
    bio: '',
    certificates: [],
  };

  return (
    <section 
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={currentLang}
      className={`
  min-h-screen transition-colors duration-300 relative
  ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-background to-slate-50'}
  ${displayedUser?.isMember ? (isDark ? 'ring-1 ring-brand-secondary/20' : 'ring-1 ring-brand-primary/10') : ''}
  py-8 px-4 sm:px-6 lg:px-8
`}
    >
      {/* شريط جانبي مميز للأعضاء === */}
  {displayedUser?.isMember && (
    <div className={`
      absolute top-0 start-0 w-1 h-full
      ${isDark ? 'bg-gradient-to-b from-brand-secondary to-brand-primary' : 'bg-gradient-to-b from-brand-primary to-brand-secondary'}
      rounded-full opacity-50
    `} />
  )}
      <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">
        
        {/* === الهيدر === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ProfileHeader
            user={displayedUser}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onSave={handleSaveAll}
            canPublish={canPublish}
            onNewPost={() => { setEditingPost(null); setIsModalOpen(true); }}
            isOwnProfile={isOwnProfile}
            isDark={isDark} // ✅ تمرير isDark للمكون
          />
        </motion.div>

        {/* === الشبكة الرئيسية === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* الشريط الجانبي */}
          <aside className="lg:col-span-1 space-y-6">
            <ProfileSidebar
              user={tempData}
              isEditing={isEditing}
              onChange={setTempData}
              isDark={isDark} // ✅ تمرير isDark
              canEdit={canEdit}
            />
          </aside>

          {/* المحتوى الرئيسي */}
          <main className="lg:col-span-2 space-y-6">
            
            {/* السيرة الذاتية */}
            <ProfileBio
              bio={tempData.bio}
              isEditing={isEditing}
              onChange={(bio) => setTempData(prev => ({ ...prev, bio }))}
              isDark={isDark} // ✅ تمرير isDark
            />

            {/* تبويبات المنشورات */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                rounded-2xl border shadow-sm transition-colors duration-300
                ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}
              `}
            >
              {/* Tabs Navigation */}
              <div className={`flex gap-1 p-2 border-b overflow-x-auto transition-colors ${isDark ? 'border-gray-700' : 'border-slate-200'}`}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all
                      ${activeTab === tab.id 
                        ? (isDark ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-brand-light text-brand-primary') 
                        : (isDark ? 'text-gray-400 hover:text-brand-secondary hover:bg-gray-700' : 'text-gray-500 hover:text-brand-primary hover:bg-gray-50')
                      }
                    `}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`ms-2 px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === tab.id ? (isDark ? 'bg-brand-secondary text-white' : 'bg-brand-primary text-white') : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600')}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-5">
                <AnimatePresence mode="wait">
                  {activeTab === "published" && (
                    <motion.div
                      key="published"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {publishedPosts.length > 0 ? (
                        publishedPosts.map(post => (
                          <PostFullView 
                            key={post.id} 
                            post={post}
                            isOwner={isOwnProfile}
                            isAdmin={canManageUsers}
                            onEdit={isOwnProfile ? () => { setEditingPost(post); setIsModalOpen(true); } : undefined}
                            onDelete={(id) => dispatch(deleteLecture(id))}
                            isDark={isDark} // ✅ تمرير isDark
                          />
                        ))
                      ) : (
                        <EmptyState 
                          message={t('profile.noPublished') || 'لا توجد منشورات'} 
                          icon="📝"
                          actionText={isOwnProfile && canPublish ? t('profile.createFirst') : undefined}
                          onAction={isOwnProfile && canPublish ? () => setIsModalOpen(true) : undefined}
                          isDark={isDark}
                        />
                      )}
                    </motion.div>
                  )}

                  {activeTab === "pending" && isOwnProfile && (
                    <motion.div
                      key="pending"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {pendingPosts.length > 0 ? (
                        pendingPosts.map(post => (
                          <PendingCard 
                            key={post.id}
                            post={post}
                            onEdit={() => { setEditingPost(post); setIsModalOpen(true); }}
                            onResubmit={() => dispatch(updateLectureStatus({ id: post.id, status: 'PENDING' }))}
                            isDark={isDark}
                          />
                        ))
                      ) : (
                        <EmptyState message={t('profile.noPending') || 'لا توجد مسودات'} icon="🕐" isDark={isDark} />
                      )}
                    </motion.div>
                  )}

                  {activeTab === "admin" && canManageUsers && isOwnProfile && (
                    <motion.div
                      key="admin"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {adminReviewList.length > 0 ? (
                        adminReviewList.map(post => (
                          <PendingCard 
                            key={post.id}
                            post={post}
                            isAdminView={true}
                            onApprove={() => handleReviewAction(post.id, 'APPROVED')}
                            onReject={() => handleReviewAction(post.id, 'REJECTED')}
                            isDark={isDark}
                          />
                        ))
                      ) : (
                        <EmptyState message={t('profile.allReviewed') || '✅ لا توجد طلبات جديدة'} icon="✨" isDark={isDark} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </main>
        </div>

        {/* مودال إنشاء/تعديل منشور */}
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingPost(null); }}
          editPost={editingPost}
          isDark={isDark} // ✅ تمرير isDark للمودال
        />
      </div>
    </section>
  );
};

export default Profile;