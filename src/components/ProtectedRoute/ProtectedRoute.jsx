// src/components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate, useLocation, useNavigate } from 'react-router-dom';  // ✅ إضافة useNavigate
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { user, isAuthenticated, loading, checkPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();  // ✅ تعريف دالة التنقل
  
  // أثناء التحميل: عرض مؤشر تحميل
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-secondary/20 border-t-brand-secondary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // غير مسجل → إعادة للتسجيل
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // يحتاج دور محدد (مثل ADMIN)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/profile" replace />;
  }
  
  // يحتاج صلاحية محددة
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
          <p className="text-4xl mb-4">🔒</p>
          <p className="text-slate-600 font-bold mb-2">ليس لديك صلاحية للوصول لهذه الصفحة</p>
          <p className="text-sm text-slate-400 mb-4">الصلاحية المطلوبة: {requiredPermission}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => navigate(-1)}  // ✅ التصحيح: navigate بدلاً من Navigate
              className="px-4 py-2 text-brand-secondary font-bold hover:underline transition"
            >
              العودة للخلف
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="px-4 py-2 bg-brand-secondary text-white rounded-lg font-bold text-sm hover:bg-brand-secondaryHover transition"
            >
              الذهاب للبروفايل
            </button>
          </div>
          
        </div>
      </div>
    );
  }
  
  // كل شيء جيد → عرض المحتوى
  return children;
};

export default ProtectedRoute;