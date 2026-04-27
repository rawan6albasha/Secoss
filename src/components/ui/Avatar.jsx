// src/components/ui/Avatar/Avatar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalizedText, getInitial } from '../../utils/i18n-helpers';

const Avatar = ({ 
  user, 
  size = 'md',           // 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
  showStatus = false,    // إظهار حالة Online/Offline
  showBadge = false,     // إظهار شارة الأدمن
  isOnline = false,
  onClick,
  className = '',
  showBorder = true,
  showShadow = true,
  variant = 'default',   // 'default', 'gradient', 'solid'
  tooltip = true,        // إظهار اسم المستخدم كـ tooltip
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  
  const currentLang = document.documentElement.lang || 'ar';
  const userName = getLocalizedText(user?.name, currentLang);
  const userAvatar = user?.avatar;
  const userRole = user?.role;
  const userId = user?.id;

  // === أحجام الـ Avatar ===
  const sizeConfig = {
    xs: { 
      container: 'w-6 h-6 text-xs', 
      status: 'w-1.5 h-1.5',
      badge: 'text-[6px]'
    },
    sm: { 
      container: 'w-9 h-9 text-sm', 
      status: 'w-2 h-2',
      badge: 'text-[8px]'
    },
    md: { 
      container: 'w-11 h-11 text-base', 
      status: 'w-2.5 h-2.5',
      badge: 'text-[10px]'
    },
    lg: { 
      container: 'w-14 h-14 text-lg', 
      status: 'w-3 h-3',
      badge: 'text-xs'
    },
    xl: { 
      container: 'w-16 h-16 text-xl', 
      status: 'w-3.5 h-3.5',
      badge: 'text-sm'
    },
    '2xl': { 
      container: 'w-20 h-20 text-2xl', 
      status: 'w-4 h-4',
      badge: 'text-base'
    },
  };

  const { container, status: statusSize, badge: badgeSize } = sizeConfig[size] || sizeConfig.md;

  // === ألوان الخلفية ===
  const getBackgroundClass = () => {
    if (variant === 'solid') return 'bg-gray-400';
    if (variant === 'gradient') return 'bg-gradient-to-br from-blue-500 to-purple-600';
    return 'bg-gradient-to-br from-blue-500 to-purple-600'; // default
  };

  // === معالجة النقر ===
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  // === معالجة خطأ الصورة ===
  const handleImageError = () => {
    setImageError(true);
  };

  const hasImage = userAvatar && !imageError;
  const initial = getInitial(userName, currentLang);

  return (
    <div className="relative inline-block">
      {/* حاوية الـ Avatar */}
      <div
        onClick={handleClick}
        className={`
          ${container} ${getBackgroundClass()}
          rounded-full flex items-center justify-center
          font-bold text-white
          ${showBorder ? 'border-2 border-white dark:border-gray-800' : ''}
          ${showShadow ? 'shadow-md dark:shadow-gray-900/50' : ''}
  ${onClick || userId ? 'cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-200' : ''}
  ${className}
        `}
    title={tooltip ? userName : undefined}
        role={userId ? 'button' : undefined}
        aria-label={userName}
      >
        {hasImage ? (
          <img 
            src={userAvatar} 
            alt={userName}
            className="w-full h-full rounded-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <span aria-hidden="true">{initial}</span>
        )}
      </div>

      {/* === مؤشر Online/Offline === */}
      {showStatus && (
        <span
          className={`
            absolute bottom-0 right-0 
            ${statusSize} rounded-full border-2 border-white
            ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
          `}
          aria-label={isOnline ? 'متصل' : 'غير متصل'}
        />
      )}

      {/* === شارة الأدمن === */}
      {showBadge && userRole === 'ADMIN' && (
        <span
          className={`
            absolute -bottom-0.5 -right-0.5
            bg-blue-600 text-white rounded-full
            ${badgeSize} font-bold
            flex items-center justify-center
            min-w-[16px] min-h-[16px]
            px-1 py-0.5
          `}
          title="مدير"
        >
          👑
        </span>
      )}
    </div>
  );
};

export default Avatar;