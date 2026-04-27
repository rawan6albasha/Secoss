// src/utils/auth.js
import { checkPermission, roles } from '../config/permissions';

// === إعدادات البيئة ===
export const API_MODE = import.meta.env?.VITE_API_MODE || 'mock';
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api';

// === مفاتيح التخزين (مركزية) ===
export const STORAGE_KEYS = {
  USER: 'secoss_user',
  TOKEN: 'secoss_token',
  LANGUAGE: 'i18nextLng',
};

// === دوال التخزين المحلي ===
export const saveUserToStorage = (user, token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    if (user?.preferredLanguage) {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, user.preferredLanguage);
    }
  } catch (e) {
    console.warn('⚠️ Failed to save user to localStorage:', e);
  }
};

export const getUserFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!raw || !token) return null;
    return { user: JSON.parse(raw), token };
  } catch (e) {
    console.warn('⚠️ Failed to get user from localStorage:', e);
    return null;
  }
};

export const clearAuthStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

export const getUserLanguage = () => {
  return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'ar';
};

// === بيانات المستخدمين للمحاكاة ===
const mockUsers = [
  {
    id: 'admin-001',
    name: { ar: 'د. أحمد محمد الخليل', en: 'Dr. Ahmed Mohammed Al-Khalil' },
    email: 'admin@secoss.org',
    password: 'admin123',
    role: roles.ADMIN,
    avatar: 'https://ui-avatars.com/api/?name=أحمد+محمد&background=10b981&color=fff&size=128',
    degree: { ar: 'دكتوراه في الاقتصاد السياسي', en: 'PhD in Political Economy' },
    specialization: { ar: 'السياسات الاقتصادية والتنمية', en: 'Economic Policies & Development' },
    work: { ar: 'جامعة دمشق - كلية الاقتصاد', en: 'Damascus University - Faculty of Economics' },
    bio: { 
      ar: 'خبير اقتصادي بأكثر من 20 عاماً من الخبرة.',
      en: 'Economic expert with over 20 years of experience.'
    },
    certificates: [
      { ar: 'شهادة التدريس الجامعي المتقدم', en: 'Advanced University Teaching Certificate' },
      { ar: 'زمالة الجمعية الاقتصادية العربية', en: 'Fellowship of the Arab Economic Association' }
    ],
    extraPermissions: ['publish_news', 'publish_events', 'manage_all', 'moderate_comments'],
    preferredLanguage: 'ar',
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: 'user-001',
    name: { ar: 'د. سارة علي الحسن', en: 'Dr. Sara Ali Al-Hassan' },
    email: 'sara.hassan@example.com',
    password: 'user123',
    role: roles.USER,
    avatar: 'https://ui-avatars.com/api/?name=سارة+علي&background=3b82f6&color=fff&size=128',
    degree: { ar: 'ماجستير في الاقتصاد المالي', en: 'Master in Financial Economics' },
    specialization: { ar: 'الأسواق المالية والاستثمار', en: 'Financial Markets & Investment' },
    work: { ar: 'مصرف سوريا المركزي', en: 'Central Bank of Syria' },
    bio: {
      ar: 'باحثة متخصصة في تحليل الأسواق المالية.',
      en: 'Researcher specializing in financial market analysis.'
    },
    certificates: [
      { ar: 'شهادة التحليل الفني للأسواق', en: 'Technical Market Analysis Certificate' }
    ],
    extraPermissions: [],
    preferredLanguage: 'ar',
    createdAt: '2023-06-20T09:00:00Z',
  },
];

// === دوال مساعدة ===
export const findUserById = (id) => mockUsers.find(u => u.id === id);
export const findUserByEmail = (email) => mockUsers.find(u => u.email === email);

export const isAuthenticated = () => !!localStorage.getItem(STORAGE_KEYS.TOKEN);

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ✅ استخدام النظام المركزي للتحقق من الصلاحيات
export const hasRole = (user, role) => {
  if (!user) return false;
  return user.role === role || user.role === roles.ADMIN;
};

export const hasPermission = (user, permission) => {
  if (!user) return false;
  return checkPermission(user.role, permission, user.extraPermissions || []);
};

// === دالة تسجيل الدخول الموحدة ===
export const login = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, API_MODE === 'real' ? 800 : 500));

  if (API_MODE === 'real') {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (data.success && data.user && data.token) {
        saveUserToStorage(data.user, data.token);
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: data.message || 'فشل تسجيل الدخول' };
    } catch (err) {
      console.error('Real API login error:', err);
      return { success: false, message: 'خطأ في الاتصال بالخادم' };
    }
  } else {
    // محاكاة تسجيل الدخول
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPass } = user;
      const token = `mock-token-${user.id}-${Date.now()}`;
      saveUserToStorage(userWithoutPass, token);
      return { success: true, user: userWithoutPass, token };
    }
    return { success: false, message: 'بيانات الدخول غير صحيحة' };
  }
};

// === دالة تسجيل مستخدم جديد ===
export const register = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, API_MODE === 'real' ? 800 : 600));

  if (API_MODE === 'real') {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      
      if (data.success && data.user && data.token) {
        saveUserToStorage(data.user, data.token);
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: data.message || 'فشل إنشاء الحساب' };
    } catch (err) {
      console.error('Real API register error:', err);
      return { success: false, message: 'خطأ في الاتصال بالخادم' };
    }
  } else {
    // محاكاة التسجيل
    const existing = findUserByEmail(userData.email);
    if (existing) {
      return { success: false, message: 'هذا البريد الإلكتروني مستخدم مسبقاً' };
    }
    
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: { ar: userData.name, en: userData.name },
      email: userData.email,
      role: roles.USER,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=10b981&color=fff&size=128`,
      degree: { ar: "عضو جديد", en: "New Member" },
      specialization: { ar: "غير محدد", en: "Not specified" },
      work: { ar: "غير محدد", en: "Not specified" },
      bio: {
        ar: "مرحباً! أنا عضو جديد في جمعية العلوم الاقتصادية.",
        en: "Hello! I'm a new member of the Secoss Association."
      },
      certificates: [],
      socialLinks: {},
      extraPermissions: [],
      preferredLanguage: userData.preferredLanguage || 'ar',
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    const { password: _, ...userWithoutPass } = newUser;
    const token = `mock-token-${newUser.id}-${Date.now()}`;
    
    saveUserToStorage(userWithoutPass, token);
    return { success: true, user: userWithoutPass, token };
  }
};

export const logout = () => {
  clearAuthStorage();
  return { success: true };
};

// === تصدير شامل ===
export default {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  hasRole,
  hasPermission,
  findUserById,
  findUserByEmail,
  saveUserToStorage,
  clearAuthStorage,
  getUserFromStorage,
  getUserLanguage,
  API_MODE,
  API_BASE_URL,
  STORAGE_KEYS,
  roles,
};