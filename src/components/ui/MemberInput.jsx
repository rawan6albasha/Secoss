// src/components/ui/MemberInput
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { FaPlus, FaTrash, FaLanguage } from 'react-icons/fa';

const MemberInput = ({ members = [], onChange }) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const [newMember, setNewMember] = useState({ ar: '', en: '' });
  const [showEnglish, setShowEnglish] = useState(false);

  // === إضافة عضو جديد ===
  const handleAddMember = () => {
    if (!newMember.ar?.trim() && !newMember.en?.trim()) return;
    
    const member = {
      ar: newMember.ar?.trim() || '',
      en: newMember.en?.trim() || '',
    };
    
    onChange?.([...(members || []), member]);
    setNewMember({ ar: '', en: '' });
    setShowEnglish(false);
  };

  // === حذف عضو ===
  const handleRemoveMember = (index) => {
    const updated = [...(members || [])];
    updated.splice(index, 1);
    onChange?.(updated);
  };

  // === تحديث حقل عضو جديد ===
  const handleNewMemberChange = (lang, value) => {
    setNewMember(prev => ({ ...prev, [lang]: value }));
  };

  // === عرض اسم العضو مع fallback ===
  const getMemberName = (member, lang) => {
    if (typeof member === 'string') return member;
    if (member?.[lang]?.trim()) return member[lang];
    const other = lang === 'ar' ? 'en' : 'ar';
    if (member?.[other]?.trim()) return member[other];
    return Object.values(member || {}).find(v => v?.trim()) || '---';
  };

  const currentLang = i18n.language || 'ar';

  return (
    <div className="space-y-4">
      {/* === قائمة الأعضاء الحاليين === */}
      {members?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {members.map((member, index) => (
            <span
              key={index}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm
                ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-slate-100 text-slate-700'}
                border border-brand-secondary/20
              `}
            >
              {getMemberName(member, currentLang)}
              <button
                onClick={() => handleRemoveMember(index)}
                className="text-red-500 hover:text-red-600 transition"
                aria-label="حذف العضو"
              >
                <FaTrash size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* === إضافة عضو جديد === */}
      <div className={`
        p-4 rounded-2xl border space-y-3
        ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-slate-50/50 border-slate-200'}
      `}>
        {/* الحقل العربي (دائمًا ظاهر) */}
        <div className="space-y-1">
          <input
            type="text"
            value={newMember.ar}
            onChange={(e) => handleNewMemberChange('ar', e.target.value)}
            placeholder="اسم العضو بالعربية"
            className={`
              w-full p-3 rounded-xl border outline-none transition-all text-right
              ${isDark 
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-brand-secondary' 
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-brand-secondary'
              }
            `}
            dir="rtl"
            onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
          />
        </div>

        {/* زر إظهار الحقل الإنجليزي */}
        <button
          type="button"
          onClick={() => setShowEnglish(!showEnglish)}
          className={`
            flex items-center gap-2 text-xs font-bold transition-colors
            ${showEnglish ? 'text-brand-secondary' : 'text-gray-400 hover:text-brand-secondary'}
          `}
        >
          <FaLanguage size={12} />
          {showEnglish ? 'إخفاء الإنجليزية' : 'إضافة الاسم بالإنجليزية'}
        </button>

        {/* الحقل الإنجليزي (ظاهر عند الطلب) */}
        {showEnglish && (
          <div className="space-y-1 animate-fadeIn">
            <input
              type="text"
              value={newMember.en}
              onChange={(e) => handleNewMemberChange('en', e.target.value)}
              placeholder="Member name in English"
              className={`
                w-full p-3 rounded-xl border outline-none transition-all text-left
                ${isDark 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-brand-secondary' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-brand-secondary'
                }
              `}
              dir="ltr"
              onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
            />
          </div>
        )}

        {/* زر الإضافة */}
        <button
          type="button"
          onClick={handleAddMember}
          disabled={!newMember.ar?.trim() && !newMember.en?.trim()}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
            ${(!newMember.ar?.trim() && !newMember.en?.trim())
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              : 'bg-brand-secondary text-white hover:bg-brand-secondaryHover shadow-lg'
            }
          `}
        >
          <FaPlus size={12} /> إضافة العضو
        </button>
      </div>

      {/* ملاحظة مساعدة */}
      <p className="text-[10px] text-gray-400 italic">
        💡 يمكنك إضافة الاسم بالعربية فقط، أو بالعربية والإنجليزية معاً
      </p>
    </div>
  );
};

export default MemberInput;