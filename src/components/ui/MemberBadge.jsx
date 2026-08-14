// src/components/ui/MemberBadge.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const MemberBadge = ({ 
  memberType = 'member', // 'member' | 'admin' | 'founder' | 'honorary'
  joinDate, 
  isDark = false,
  className = ''
}) => {
  const { t } = useTranslation();
  
  const config = {
    member: { 
      label: t('member.badge') || 'عضو', 
      color: isDark ? 'bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30' : 'bg-brand-light text-brand-primary border-brand-secondary/30',
      icon: '⭐'
    },
    admin: { 
      label: t('admin.badge') || 'إداري', 
      color: isDark ? 'bg-warning/20 text-warning border-warning/30' : 'bg-warning/10 text-warning border-warning/20',
      icon: '🛡️'
    },
    founder: { 
      label: t('founder.badge') || 'مؤسس', 
      color: isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200',
      icon: '🏆'
    },
    honorary: { 
      label: t('honorary.badge') || 'عضو شرف', 
      color: isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200',
      icon: '🎖️'
    },
  };
  
  const { label, color, icon } = config[memberType] || config.member;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${color} ${className}`}
      title={joinDate ? `${t('member.since') || 'منذ'} ${joinDate}` : undefined}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {joinDate && <span className="opacity-70 hidden sm:inline">• {joinDate}</span>}
    </motion.div>
  );
};

export default MemberBadge;