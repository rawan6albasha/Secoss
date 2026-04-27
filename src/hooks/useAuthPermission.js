// src/hooks/useAuthPermission.js
import { useAuth } from '../context/AuthContext';
import usePermission from './usePermission';

export const useAuthPermission = (requiredPermissions) => {
  const { user } = useAuth();
  
  // ✅ تمرير الصلاحيات تلقائياً من المستخدم الحالي
  return usePermission(user?.extraPermissions || [], requiredPermissions);
};

