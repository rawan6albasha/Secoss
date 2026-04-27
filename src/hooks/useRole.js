import useAuth from './useAuth'; // استيراد الهوك الذي أنشأناه سابقاً

const useRole = (requiredRole) => {
    const { user } = useAuth(); // استخدام الهوك لجلب بيانات المستخدم
    
    // فحص ذكي: إذا لم يكن هناك مستخدم، يرجع false
    // إذا وجد مستخدم، يقارن دوره بالدور المطلوب
    return user?.role === requiredRole; 
};

export default useRole;