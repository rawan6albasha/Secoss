// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setUser as reduxSetUser, logout as reduxLogout } from '../store/slices/userSlice';
import { 
  login as apiLogin, 
  register as apiRegister, 
  logout as apiLogout, 
  getUserFromStorage 
} from '../utils/auth';
import PERMISSIONS from '../config/permissions';
import { changeLanguage } from '../i18n/config';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const reduxUser = useSelector(state => state.user);
  
  const [loading, setLoading] = useState(true);
  const [error, setErrorState] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem('i18nextLng') || 'ar');

  // === تحميل الجلسة عند البدء ===
  useEffect(() => {
    const stored = getUserFromStorage();
    if (stored?.user && stored?.token) {
      dispatch(reduxSetUser({ user: stored.user, token: stored.token }));
      // مزامنة اللغة مع إعدادات المستخدم
      if (stored.user.preferredLanguage) {
        changeLanguage(stored.user.preferredLanguage);
        setLanguage(stored.user.preferredLanguage);
      }
    }
    setLoading(false);
  }, [dispatch]);

  // === تسجيل الدخول ===
  const login = useCallback(async (email, password) => {
    setErrorState(null);
    setLoading(true);
    
    try {
      const result = await apiLogin(email, password);
      
      if (result.success) {
        dispatch(reduxSetUser({ user: result.user, token: result.token }));
        // حفظ تفضيل اللغة إذا موجود
        if (result.user.preferredLanguage) {
          changeLanguage(result.user.preferredLanguage);
          setLanguage(result.user.preferredLanguage);
        }
        return { success: true, user: result.user };
      }
      
      setErrorState(result.message || t('permissions.loginFailed'));
      return { success: false, message: result.message };
      
    } catch (err) {
      console.error('💥 login() exception:', err);
      setErrorState(t('common.error'));
      return { success: false, message: t('errors.connection') };
      
    } finally {
      setLoading(false);
    }
  }, [dispatch, t]);

  // === تسجيل مستخدم جديد ===
  const register = useCallback(async (userData) => {
    setErrorState(null);
    setLoading(true);
    
    try {
      const result = await apiRegister(userData);
      
      if (result.success) {
        dispatch(reduxSetUser({ user: result.user, token: result.token }));
        if (result.user.preferredLanguage) {
          changeLanguage(result.user.preferredLanguage);
          setLanguage(result.user.preferredLanguage);
        }
        return { success: true, user: result.user };
      }
      
      setErrorState(result.message || t('errors.registrationFailed'));
      return { success: false, message: result.message };
      
    } catch (err) {
      console.error('💥 register() exception:', err);
      setErrorState(t('common.error'));
      return { success: false, message: t('errors.connection') };
      
    } finally {
      setLoading(false);
    }
  }, [dispatch, t]);

  // === تسجيل الخروج ===
  const logout = useCallback(() => {
    apiLogout();
    dispatch(reduxLogout());
    // إعادة اللغة للافتراضي
    changeLanguage('ar');
    setLanguage('ar');
  }, [dispatch]);

  // === ✅ التحقق من الصلاحيات (مركزي) ===
  const checkPermission = useCallback((permission) => {
    const stored = getUserFromStorage();
    const user = stored?.user;
    
    if (!permission || !user) return false;
    
    // استخدام الدالة المركزية من permissions.js
    return PERMISSIONS.checkPermission(
      user.role, 
      permission, 
      user.extraPermissions || []
    );
  }, []);

  // === تغيير اللغة ===
  const changeAppLanguage = useCallback((lng) => {
    changeLanguage(lng);
    setLanguage(lng);
    // تحديث تفضيل اللغة في التخزين إذا كان المستخدم مسجل
    const stored = getUserFromStorage();
    if (stored?.user) {
      const updatedUser = { ...stored.user, preferredLanguage: lng };
      dispatch(reduxSetUser({ user: updatedUser, token: stored.token }));
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [dispatch]);

  // === قيمة الـ Context (مركزية) ===
  const contextValue = useMemo(() => ({
    // حالة المصادقة
    user: reduxUser?.user,
    token: reduxUser?.token,
    isAuthenticated: !!reduxUser?.token,
    loading,
    error,
    
    // إجراءات
    login,
    register,
    logout,
    
    // صلاحيات
    checkPermission,
    hasPermission: (key) => PERMISSIONS.checkPermission(
      reduxUser?.user?.role, 
      key, 
      reduxUser?.user?.extraPermissions || []
    ),
    PERMISSION_KEYS: PERMISSIONS.keys,
    
    // لغة
    language,
    changeLanguage: changeAppLanguage,
    t,
    
    // أدوات
    clearError: () => setErrorState(null),
  }), [
    reduxUser, loading, error, language,
    login, register, logout, checkPermission, changeAppLanguage, t
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// === هوك مخصص للاستخدام ===
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// === هوك سريع للتحقق من الصلاحيات ===
export const useAuthPermission = (permissionKey) => {
  const { checkPermission } = useAuth();
  return checkPermission(permissionKey);
};