// === في ملف حماية المسارات: src/components/RBAC/MemberGuard.jsx ===
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MemberGuard = ({ children }) => {
  const { user } = useSelector(state => state.user);
  
  // ✅ السماح فقط للأعضاء المسجلين
  if (!user?.isMember) {
    return <Navigate to="/profile" replace />;
  }
  
  return <>{children}</>;
};

export default MemberGuard;