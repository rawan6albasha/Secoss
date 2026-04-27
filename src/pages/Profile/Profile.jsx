// src/pages/Profile/Profile.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { PERMISSION_KEYS } from '../../config/permissions';
import { useHasPermission } from './../../hooks/usePermission';
import { getLocalizedText } from '../../utils/i18n-helpers';

import { updateUserProfile } from "./../../store/slices/userSlice";
import { updateLectureStatus, deleteLecture } from "./../../store/slices/lecturesSlice";

// === المكونات الفرعية ===
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
import ProfileBio from './ProfileBio';
import ProfileTabs from './ProfileTabs';
import CreatePostModal from "../../components/CreatePostModal/CreatePostModal";
import PostFullView from "../../components/PostFullView/PostFullView";
import EmptyState from "../../components/ui/EmptyState";
import PendingCard from "../../components/PendingCard/PendingCard"

const Profile = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  
  const { user: currentUser } = useSelector(state => state.user);
  const allLectures = useSelector((state) => state.lectures.items);
  
  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';

  // === صلاحيات ===
  const canPublish = useHasPermission(PERMISSION_KEYS.PUBLISH_CONTENT);
  const canManageUsers = useHasPermission(PERMISSION_KEYS.MANAGE_USERS);

  // === الحالة المحلية ===
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("published");
  const [tempData, setTempData] = useState({ ...currentUser });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // مزامنة البيانات
  useEffect(() => {
    setTempData({ ...currentUser });
  }, [currentUser]);

  // === حفظ التعديلات ===
  const handleSaveAll = useCallback(() => {
    dispatch(updateUserProfile(tempData));
    setIsEditing(false);
  }, [dispatch, tempData]);

  // === فلترة المنشورات ===
  const myPosts = useMemo(
    () => allLectures.filter((post) => post.authorId === currentUser?.id),
    [allLectures, currentUser?.id]
  );

  const publishedPosts = useMemo(
    () => myPosts.filter((post) => post.status === "APPROVED"),
    [myPosts]
  );

  const pendingPosts = useMemo(
    () => myPosts.filter((post) => ["PENDING", "REJECTED"].includes(post.status)),
    [myPosts]
  );

  const adminReviewList = useMemo(
    () => canManageUsers 
      ? allLectures.filter((post) => post.status === "PENDING")
      : [],
    [allLectures, canManageUsers]
  );

  // === إجراءات المراجعة ===
  const handleReviewAction = useCallback((id, newStatus) => {
    let rejectedReason = '';
    if (newStatus === 'REJECTED') {
      rejectedReason = prompt(t('profile.rejectReason') || '⚠️ سبب الرفض:') || '';
    }
    dispatch(updateLectureStatus({ id, status: newStatus, rejectedReason: rejectedReason || undefined }));
  }, [dispatch, t]);

  if (!currentUser) {
    return (
      <div className="min-h-60vh flex items-center justify-center bg-gray-50">
        <div className="w-20 h-20 border-4 border-brand-secondary border-t-brand-primary rounded-full animate-spin mb-4" />
        <p className="text-gray-500">{t('common.loading') || 'جاري التحميل...'}</p>
      </div>
    );
  }

  return (
    <section className={`
      min-h-screen bg-gray-50 ${isRTL ? 'font-arabic rtl' : 'font-sans ltr'}
      px-4 sm:px-6 py-8 lg:py-12
    `}>
      <div className="max-w-7xl mx-auto">
        
        {/* === الهيدر === */}
<ProfileHeader
  user={currentUser}              // ✅ المستخدم الحالي
  isEditing={isEditing}           // ✅ الحالة المحلية
  setIsEditing={setIsEditing}     // ✅ دالة التحديث (مهمة جداً!)
  onSave={handleSaveAll}          // ✅ دالة الحفظ
  canPublish={canPublish}         // ✅ صلاحية النشر
  onNewPost={() => { setEditingPost(null); setIsModalOpen(true); }} // ✅ فتح المودال
/>

        {/* === الشبكة الرئيسية === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* الشريط الجانبي */}
          <aside className="lg:col-span-1 space-y-6">
            <ProfileSidebar
              user={tempData}
              isEditing={isEditing}
              onChange={setTempData}
            />
          </aside>

          {/* المحتوى الرئيسي */}
          <main className="lg:col-span-2 space-y-6">
            
            {/* السيرة الذاتية */}
            <ProfileBio
              bio={tempData.bio}
              isEditing={isEditing}
              onChange={(bio) => setTempData(prev => ({ ...prev, bio }))}
            />

            {/* تبويبات المنشورات */}
            <ProfileTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              publishedCount={publishedPosts.length}
              pendingCount={pendingPosts.length}
              isAdmin={canManageUsers}
              adminCount={adminReviewList.length}
            />

            {/* محتوى التبويبات */}
            <div className="space-y-4">
              {activeTab === "published" && (
                publishedPosts.length > 0 ? (
                  publishedPosts.map(post => (
                    <PostFullView 
                      key={post.id} 
                      post={post}
                      isOwner={post.authorId === currentUser?.id}
                      isAdmin={canManageUsers}
                      onEdit={post.authorId === currentUser?.id ? () => { 
                        setEditingPost(post); 
                        setIsModalOpen(true); 
                      } : undefined}
                      onDelete={(id) => dispatch(deleteLecture(id))}
                    />
                  ))
                ) : (
                  <EmptyState message={t('profile.noPublished') || 'لا توجد منشورات مقبولة'} icon="📝" />
                )
              )}

              {activeTab === "pending" && (
                pendingPosts.length > 0 ? (
                  pendingPosts.map(post => (
                    <PendingCard 
                      key={post.id}
                      post={post}
                      isOwner={post.authorId === currentUser?.id}
                      onEdit={() => { setEditingPost(post); setIsModalOpen(true); }}
                      onResubmit={() => dispatch(updateLectureStatus({ id: post.id, status: 'PENDING' }))}
                    />
                  ))
                ) : (
                  <EmptyState message={t('profile.noPending') || 'لا توجد طلبات قيد المراجعة'} icon="🕐" />
                )
              )}

              {activeTab === "admin" && canManageUsers && (
                adminReviewList.length > 0 ? (
                  adminReviewList.map(post => (
                    <PendingCard 
                      key={post.id}
                      post={post}
                      isAdminView={true}
                      onApprove={() => handleReviewAction(post.id, 'APPROVED')}
                      onReject={() => handleReviewAction(post.id, 'REJECTED')}
                    />
                  ))
                ) : (
                  <EmptyState message={t('profile.allReviewed') || '✨ كل الطلبات تمت مراجعتها!'} icon="✅" />
                )
              )}
            </div>
          </main>
        </div>

        {/* مودال إنشاء/تعديل منشور */}
        {isModalOpen && (
          <CreatePostModal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setEditingPost(null); }}
            editPost={editingPost}
          />
        )}
      </div>
    </section>
  );
};

export default Profile;