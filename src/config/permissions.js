// src/config/permissions.js
import roles from './roles';
import rolePermissions from './rolePermissions';

// === ✅ إعادة تصدير الأدوار كـ named exports (لحل مشكلة الاستيراد) ===
export { roles };
export { default as rolePermissions } from './rolePermissions';

// === تعريف مفاتيح الصلاحيات (مصدر واحد للحقيقة) ===
export const PERMISSION_KEYS = {
  // === تعليقات ===
  CREATE_COMMENT: 'create_comment',
  EDIT_OWN_COMMENT: 'edit_own_comment',
  DELETE_OWN_COMMENT: 'delete_own_comment',
  DELETE_ANY_COMMENT: 'delete_any_comment',
  DISABLE_COMMENTS: 'disable_comments',
  
  // === محتوى ===
  PUBLISH_CONTENT: 'publish_content',
  EDIT_CONTENT: 'edit_content',
  DELETE_CONTENT: 'delete_content',
  
  // === مستخدمين ===
  MANAGE_USERS: 'manage_users',
  BAN_USER: 'ban_user',
  
  // === عام ===
  READ: 'read',
};

// === دالة التحقق المركزية (تستخدم في كل المكان) ===
export const checkPermission = (userRole, requiredPermission, extraPermissions = []) => {
  if (!userRole) return false;
  
  // الأدمن لديه كل الصلاحيات تلقائيًا
  if (userRole === roles.ADMIN) return true;
  
  // جمع صلاحيات الدور + الصلاحيات الإضافية
  const allPermissions = [
    ...(rolePermissions[userRole] || []),
    ...(Array.isArray(extraPermissions) ? extraPermissions : [])
  ];
  
  return allPermissions.includes(requiredPermission);
};

// === دالة مساعدة لإنشاء كائن الصلاحيات للمكونات ===
// تستخدم في مكونات مثل CommentsSystem بدلاً من useMemo محلي
export const getCommentPermissions = (user, { postAuthorId, isPostOwner, isAdmin, commentsDisabled } = {}) => {
  if (!user) {
    return {
      canComment: false,
      canEditComment: () => false,
      canDeleteComment: () => false,
      canDisableComments: false,
    };
  }
  
  const { id: userId, role: userRole, extraPermissions = [] } = user;
  
  return {
    // ✅ إنشاء تعليق
    canComment: !commentsDisabled && checkPermission(userRole, PERMISSION_KEYS.CREATE_COMMENT, extraPermissions),
    
    // ✅ تعديل تعليق (يملكه أو أدمن)
    canEditComment: (commentAuthorId) => 
      userId === commentAuthorId && checkPermission(userRole, PERMISSION_KEYS.EDIT_OWN_COMMENT, extraPermissions),
    
    // ✅ حذف تعليق (يملكه، أو صاحب المنشور، أو أدمن)
    canDeleteComment: (commentAuthorId) => {
      if (userId === commentAuthorId) {
        return checkPermission(userRole, PERMISSION_KEYS.DELETE_OWN_COMMENT, extraPermissions);
      }
      if (isPostOwner || isAdmin) {
        return checkPermission(userRole, PERMISSION_KEYS.DELETE_ANY_COMMENT, extraPermissions);
      }
      return false;
    },
    
    // ✅ إيقاف/تفعيل التعليقات (صاحب المنشور أو أدمن)
    canDisableComments: (isPostOwner || isAdmin) && 
      checkPermission(userRole, PERMISSION_KEYS.DISABLE_COMMENTS, extraPermissions),
  };
};

// === تصدير شامل للاستخدام المرن (كـ default export) ===
const PERMISSIONS = {
  keys: PERMISSION_KEYS,
  roles,
  rolePermissions,
  checkPermission,
  getCommentPermissions,
};

export default PERMISSIONS;