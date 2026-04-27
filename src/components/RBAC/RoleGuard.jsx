// src/components/RBAC/RoleGuard.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// ✅ الاستيرادات الصحيحة
import { roles, checkPermission } from '../../config/permissions';

const RoleGuard = ({ 
  children, 
  requiredRoles = [], 
  fallback = null, 
  requiredPermission = null 
}) => {
  const { t, i18n } = useTranslation();
  const { user } = useSelector(state => state.user);
  const currentLang = i18n?.language || 'ar';
  const isRTL = currentLang === 'ar';

  // ✅ التحقق من الصلاحيات
  const hasAccess = React.useMemo(() => {
    if (!user) return false;
    if (user.role === roles?.ADMIN) return true;
    if (requiredRoles?.length > 0 && !requiredRoles.includes(user.role)) return false;
    if (requiredPermission) {
      return checkPermission(user.role, requiredPermission, user.extraPermissions || []);
    }
    return true;
  }, [user, requiredRoles, requiredPermission]);

  // === عرض حالة عدم الوصول ===
  if (!hasAccess) {
    if (fallback) return fallback;
    
    return (
      <div className={`
        p-8 text-center bg-gray-100 rounded-xl border border-gray-200
        ${isRTL ? 'font-arabic rtl' : 'font-sans ltr'}
        text-gray-500 text-base
      `}>
        {user 
          ? t?.('permissions.noAccess') || 'ليس لديك صلاحية للوصول إلى هذا المحتوى'
          : t?.('permissions.loginRequired') || 'يرجى تسجيل الدخول أولاً'
        }
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;