// src/components/RBAC/PermissionGate.jsx
import PERMISSIONS from './../../config/permissions'; // ✅ بالفعل يستخدم المركزي

const PermissionGate = ({ requiredPermission, children, fallback = null }) => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const hasPermission = PERMISSIONS.checkPermission(
        user?.role, 
        requiredPermission, 
        user?.extraPermissions || []
    );

    if (!hasPermission) return fallback;
    return <>{children}</>;
};
export default PermissionGate