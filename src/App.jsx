// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// === Components ===
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';

// === Pages ===
import Home from './pages/Home/Home';
import ConditionsOfAffiliation from './pages/ConditionsOfAffiliation/ConditionsOfAffiliation';
import BoardOfDirectors from './pages/BoardOfDirectors/BoardOfDirectors';
import About from './pages/About/About';
import Lectures from './pages/Lectures/Lectures';
import Lecturers from './pages/Lecturers/Lecturers';
import Login from './pages/Login/Login';
import NewsDetails from './pages/NewsDetails/NewsDetails';
import News from './pages/News/news';
import LectureDetail from './pages/LectureDetail/LectureDetail';
import RegisterPage from './pages/auth/RegisterPage';
import Profile from './pages/Profile/Profile';
import DashboardPage from './pages/DashboardPage';

// === RBAC & Auth ===
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import RoleGuard from './components/RBAC/RoleGuard';
import { roles, PERMISSION_KEYS } from './config/permissions';
import AccountSettings from './pages/Profile/AccountSettings';
import { useTheme } from './context/ThemeContext';
import MemberGuard from './components/RBAC/MemberGuard';
import MeetingReports from './pages/MeetingReports/MeetingReports';

function App() {
  const { i18n } = useTranslation();
  const { user } = useSelector(state => state.user);
  const { isDark } = useTheme();
  
  const currentLang = i18n.language || 'ar';
  const isRTL = currentLang === 'ar';

  return (
    <div 
      className={`
        min-h-screen flex flex-col transition-colors duration-300
        ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-background text-gray-900'}
        ${isRTL ? 'font-arabic rtl' : 'font-sans ltr'}
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={currentLang}
    >
      {/* خلفية زخرفية ناعمة للوضع الداكن */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-44 -right-24 w-72 h-72 bg-brand-primary/8 rounded-full blur-3xl" />
        </div>
      )}
      
      <Navbar />
      
      {/* Main Content === */}
      <main className="
        flex-1 w-full max-w-7xl mx-auto 
        px-4 sm:px-6 lg:px-8 py-6 lg:py-8
        relative z-10
      ">
        <Breadcrumbs />
        
        <Routes>
          {/* Public Routes === */}
          <Route path="/" element={<Home />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/lecture-detail/:id" element={<LectureDetail />} />
          <Route path="/conditions" element={<ConditionsOfAffiliation />} />
          <Route path="/board" element={<BoardOfDirectors />} />
          <Route path="/about" element={<About />} />
          <Route path="/lecturers" element={<Lecturers />} />
          <Route path="/news" element={<News />} />
          <Route path="/news-details/:id" element={<NewsDetails />} />
          
          {/* Authentication === */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes === */}
          <Route 
            path="/profile/:userId?" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/settings" 
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Dashboard === */}
          <Route 
            path="/admin/dashboard" 
            element={
              <RoleGuard requiredRoles={[roles.ADMIN]} requiredPermission={PERMISSION_KEYS.MANAGE_USERS}>
                <DashboardPage />
              </RoleGuard>
            } 
          />
          <Route 
  path="/members/meetings" 
  element={
    <ProtectedRoute>
      <MemberGuard>
        <MeetingReports />
      </MemberGuard>
    </ProtectedRoute>
  } 
/>
          
          {/* 404 Fallback === */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;