// src/pages/Profile/ProfileTabs.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaHourglassHalf, FaNewspaper } from 'react-icons/fa';

const ProfileTabs = ({ 
  activeTab, 
  onTabChange, 
  publishedCount, 
  pendingCount, 
  isAdmin, 
  adminCount 
}) => {
  const { t } = useTranslation();

  const tabs = [
    { 
      id: 'published', 
      label: t('profile.published') || 'منشوراتي', 
      icon: FaEye, 
      count: publishedCount,
      color: 'text-brand-primary'
    },
    { 
      id: 'pending', 
      label: t('profile.pending') || 'قيد المراجعة', 
      icon: FaHourglassHalf, 
      count: pendingCount,
      color: 'text-warning'
    },
  ];

  if (isAdmin) {
    tabs.push({
      id: 'admin',
      label: t('profile.adminReview') || 'لوحة الإدارة',
      icon: FaNewspaper,
      count: adminCount,
      color: 'text-error'
    });
  }

  return (
    <div className="
      flex flex-wrap gap-2 sm:gap-4 border-b border-gray-100 pb-4 mb-6
    ">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm
              transition-all duration-200
              ${isActive 
                ? `bg-brand-light ${tab.color} border-b-2 border-brand-primary` 
                : 'text-gray-500 hover:text-brand-primary hover:bg-gray-50'
              }
            `}
          >
            <Icon size={14} />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`
                px-2 py-0.5 rounded-full text-[10px] font-black
                ${isActive ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-600'}
              `}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;