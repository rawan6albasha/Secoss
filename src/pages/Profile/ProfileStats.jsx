import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from 'framer-motion';

// === مكون جديد: ProfileStats.jsx ===
const ProfileStats = ({ stats = {}, isDark }) => {
  const { t } = useTranslation();
  
  const items = [
    { label: t('profile.posts'), value: stats.posts || 0, icon: '📝', color: 'brand' },
    { label: t('profile.likes'), value: stats.likes || 0, icon: '❤️', color: 'error' },
    { label: t('profile.views'), value: stats.views || 0, icon: '👁️', color: 'info' },
    { label: t('profile.followers'), value: stats.followers || 0, icon: '👥', color: 'success' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {items.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -4, scale: 1.02 }}
          className={`
            p-4 rounded-2xl border text-center cursor-default transition-colors
            ${isDark ? 'bg-gray-800 border-gray-700 hover:border-brand-secondary/50' : 'bg-white border-slate-200 hover:border-brand-primary/50'}
          `}
        >
          <span className="text-2xl mb-2 block">{item.icon}</span>
          <p className={`text-xl font-black ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{item.value}</p>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</p>
        </motion.div>
      ))}
    </div>
  );
};
export default ProfileStats;