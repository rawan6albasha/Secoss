// src/hooks/usePermissions.js
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PERMISSIONS, { getCommentPermissions } from '../config/permissions';

// هوك عام للتحقق من صلاحية واحدة
export const useHasPermission = (permissionKey) => {
  const { user } = useSelector(state => state.user);
  
  return useMemo(() => {
    if (!user) return false;
    return PERMISSIONS.checkPermission(
      user.role, 
      permissionKey, 
      user.extraPermissions || []
    );
  }, [user, permissionKey]);
};

// هوك خاص بنظام التعليقات (يُرجع كائن الصلاحيات جاهز)
export const useCommentPermissions = (options = {}) => {
  const { user } = useSelector(state => state.user);
  
  return useMemo(() => {
    return getCommentPermissions(user, options);
  }, [user, options]);
};

// تصدير الهوك الرئيسي للاستخدام العام
const usePermissions = () => {
  const { user } = useSelector(state => state.user);
  
  return {
    user,
    hasPermission: (key) => PERMISSIONS.checkPermission(
      user?.role, key, user?.extraPermissions || []
    ),
    getCommentPermissions: (opts) => getCommentPermissions(user, opts),
    PERMISSION_KEYS: PERMISSIONS.keys,
  };
};

export default usePermissions;