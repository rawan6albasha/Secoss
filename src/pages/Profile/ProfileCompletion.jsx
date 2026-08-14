import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from 'framer-motion';

const ProfileCompletion = ({ user, isDark }) => {
  const { t } = useTranslation();
  
  // حساب نسبة الاكتمال
  const calculateProgress = () => {
    const fields = [
      user?.name, user?.degree, user?.work, 
      user?.specialization, user?.bio, user?.avatar,
      user?.certificates?.length > 0
    ];
    const filled = fields.filter(f => f).length;
    return Math.round((filled / fields.length) * 100);
  };
  
  const progress = calculateProgress();
  
  const getMessage = (p) => {
    if (p >= 100) return { text: t('profile.complete'), color: 'text-success' };
    if (p >= 70) return { text: t('profile.almostThere'), color: 'text-warning' };
    return { text: t('profile.completeProfile'), color: 'text-brand-primary' };
  };
  
  const { text, color } = getMessage(progress);

  return (
    <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-brand-light/30 border-brand-secondary/30'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {t('profile.completion') || 'اكتمال البروفايل'}
        </span>
        <span className={`text-xs font-black ${color}`}>{progress}%</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${progress >= 100 ? 'bg-brand-secondary' : 'bg-brand-primary'}`}
        />
      </div>
      <p className={`text-[10px] mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{text}</p>
    </div>
  );
};
export default ProfileCompletion;