// src/pages/MeetingReports/MeetingReports.jsx
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PERMISSION_KEYS } from '../../config/permissions';
import { useHasPermission } from '../../hooks/usePermission';
import { getLocalizedText } from '../../utils/i18n-helpers';

// === مكونات ===
import SectionHeader from '../../components/ui/SectionHeader';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const MeetingReports = () => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const currentLang = i18n?.language || 'ar';
  const isRTL = currentLang === 'ar';
  
  const { user } = useSelector(state => state.user);
  const allReports = useSelector(state => state.meetingReports?.items) || [];
  
  // === صلاحيات ===
  const isMember = user?.isMember;
  const canManageReports = useHasPermission(PERMISSION_KEYS.MANAGE_MEETINGS);
  
  // === حالة ===
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === فلترة التقارير حسب صلاحية المستخدم ===
  const visibleReports = useMemo(() => {
    if (!isMember) return [];
    // الأعضاء العاديون يرون فقط التقارير المنشورة
    if (!canManageReports) {
      return allReports.filter(r => r.status === 'PUBLISHED');
    }
    // الإداريون يرون كل التقارير
    return allReports;
  }, [allReports, isMember, canManageReports]);

  // === حماية الوصول ===
  if (!isMember) {
    return (
      <section className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <EmptyState 
          icon="🔐" 
          message={t('members.restricted') || 'هذا المحتوى متاح لأعضاء المنظمة فقط'}
          actionText={t('common.back') || 'العودة'}
          onAction={() => window.history.back()}
          isDark={isDark}
        />
      </section>
    );
  }

  return (
    <section className={`
      min-h-screen transition-colors duration-300
      ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-background to-slate-50'}
      py-8 px-4 sm:px-6 lg:px-8
    `}>
      <div className="max-w-5xl mx-auto">
        
        {/* الهيدر */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SectionHeader
            eyebrow={t('members.section') || 'منطقة الأعضاء'}
            title={t('meetings.title') || 'تقارير الاجتماعات'}
            description={t('meetings.description') || 'اطلع على محاضر وقرارات اجتماعات المنظمة'}
          />
          
          {/* زر إضافة تقرير - للإداريين فقط */}
          {canManageReports && (
            <div className="mt-4 flex justify-end">
              <Button 
                variant="accent" 
                onClick={() => { setSelectedReport(null); setIsModalOpen(true); }}
                className={isDark ? 'bg-brand-secondary text-gray-900' : ''}
              >
                <span className="me-2">+</span> {t('meetings.addReport') || 'إضافة تقرير'}
              </Button>
            </div>
          )}
        </motion.div>

        {/* قائمة التقارير */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 space-y-4"
        >
          {visibleReports.length > 0 ? (
            visibleReports.map((report) => (
              <motion.article
                key={report.id}
                whileHover={{ y: -2 }}
                className={`
                  p-5 rounded-2xl border cursor-pointer transition-all
                  ${isDark 
                    ? 'bg-gray-800 border-gray-700 hover:border-brand-secondary/50' 
                    : 'bg-white border-slate-200 hover:border-brand-primary/50 hover:shadow-md'
                  }
                `}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        report.status === 'PUBLISHED' 
                          ? (isDark ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-brand-secondary/10 text-brand-secondary')
                          : (isDark ? 'bg-warning/20 text-warning' : 'bg-warning/10 text-warning')
                      }`}>
                        {report.status === 'PUBLISHED' ? (t('common.published') || 'منشور') : (t('common.draft') || 'مسودة')}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(report.date).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US')}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      {getLocalizedText(report.title, currentLang)}
                    </h3>
                    <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {getLocalizedText(report.summary, currentLang)}
                    </p>
                  </div>
                  <svg className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                {/* وسوم التقرير */}
                {report.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {report.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className={`px-2 py-0.5 rounded text-[10px] ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        #{getLocalizedText(tag, currentLang)}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))
          ) : (
            <EmptyState 
              icon="📋" 
              message={t('meetings.noReports') || 'لا توجد تقارير حالياً'}
              isDark={isDark}
            />
          )}
        </motion.div>

        {/* مودال عرض التقرير === */}
        {selectedReport && (
          <ReportModal 
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            isDark={isDark}
            canEdit={canManageReports}
          />
        )}
      </div>
    </section>
  );
};

// === مودال عرض التقرير (مبسط) ===
const ReportModal = ({ report, onClose, isDark, canEdit }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n?.language || 'ar';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6
          ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-slate-200'}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className={`text-xl font-black ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {getLocalizedText(report.title, currentLang)}
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(report.date).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US')}
            </p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        {/* Content */}
        <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {getLocalizedText(report.content, currentLang)}
          </p>
        </div>
        
        {/* Attachments */}
        {report.attachments?.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('meetings.attachments') || 'المرفقات'}:
            </p>
            <div className="space-y-2">
              {report.attachments.map((att, i) => (
                <a 
                  key={i}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-2 rounded-lg text-sm ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <span>📎</span>
                  <span className="truncate">{att.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Actions */}
        {canEdit && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
            <Button variant="secondary" size="sm">{t('common.edit') || 'تعديل'}</Button>
            <Button variant="danger" size="sm">{t('common.delete') || 'حذف'}</Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MeetingReports;