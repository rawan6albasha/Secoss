// src/pages/News/News.jsx
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

// === أدوات مركزية ===
import { getLocalizedText, toBilingualOptions } from '../../utils/i18n-helpers';
import { PERMISSION_KEYS } from '../../config/permissions';
import { useHasPermission } from "../../hooks/usePermission";
import { getMainTypes, getSubTypes } from '../../utils/contentTypes'; // ✅ لاستخدام نفس مصدر الأنواع

// === مكونات ===
import SearchInput from '../../components/ui/SearchInput';
import SelectFilter from '../../components/ui/SelectFilter';
import InfiniteScrollFeed from '../../components/ui/InfiniteScrollFeed';
import SectionHeader from '../../components/ui/SectionHeader';
import CreatePostModal from '../../components/CreatePostModal/CreatePostModal';
import Card from '../../components/Card/Card';
import Button from '../../components/ui/Button';

// === Redux ===
import { setFilter, clearFilters } from './../../store/slices/newsSlice';

const News = () => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const currentLang = i18n?.language || 'ar';
  const isRTL = currentLang === 'ar';
  
  const { items, filters, status } = useSelector(state => state.news);
  const { user } = useSelector(state => state.user);

  // === صلاحيات ===
  const canPublishNews = useHasPermission(PERMISSION_KEYS.PUBLISH_CONTENT);
  const canManageNews = useHasPermission(PERMISSION_KEYS.MANAGE_USERS);

  // === حالة المودال ===
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  
  // === حالة لإجبار إعادة تحميل الأنواع عند الإضافة ===
  const [typesVersion, setTypesVersion] = useState(0);

  // === ✅ استخراج الأنواع من نفس المصدر المستخدم في المودال ===
  const mainTypes = useMemo(() => {
    return getMainTypes('news', currentLang);
  }, [currentLang, typesVersion]); // ✅ يعتمد على typesVersion لإعادة التحميل

  // === تحويل الأنواع لخيارات الفلتر ===
  const typesOptions = useMemo(() => {
    return mainTypes.map(mt => ({
      value: mt.id,
      label: typeof mt.label === 'object' ? mt.label[currentLang] || mt.label.ar || mt.label.en : mt.label,
    }));
  }, [mainTypes, currentLang]);

  // === استخراج السنوات للفلتر ===
  const rawYears = useMemo(() => 
    Array.from(new Set(items.map(n => n.year)))
      .filter(Boolean)
      .sort((a, b) => b - a), 
  [items]);

  const yearsOptions = useMemo(() => 
    toBilingualOptions(rawYears, { defaultEn: null }), 
  [rawYears]);

  // === ✅ فلترة الأخبار - منطق مبسط وصحيح ===
  const filteredNews = useMemo(() => {
    const getSearchValues = (value) => {
      if (Array.isArray(value)) {
        return value.flatMap(getSearchValues);
      }

      const text = getLocalizedText(value, currentLang);
      return text ? [text] : [];
    };

    return items.filter(n => {
      // البحث في العنوان والوصف والمحتوى الكامل والنوع والوسوم
      if (filters.search?.trim()) {
        const searchLower = filters.search.trim().toLowerCase();
        
        const fieldsToSearch = [
          ...getSearchValues(n.title),
          ...getSearchValues(n.description),
          ...getSearchValues(n.content),
          ...getSearchValues(n.type),
          ...getSearchValues(n.subType),
          ...getSearchValues(n.tags),
        ].map(field => field.toLowerCase());
        
        // إذا لم يطابق أي حقل ← استبعده
        if (!fieldsToSearch.some(field => field.includes(searchLower))) {
          return false;
        }
      }
      
      // 2️⃣ فلتر النوع (مقارنة بـ id وليس النص)
      if (filters.type) {
        // نقارن بـ id لأن الفلتر يخزن القيمة (مثل 'news', 'event')
        if (n.type?.id !== filters.type && n.type !== filters.type) {
          // ✅ دعم المقارنة مع النصوص المترجمة أيضاً (للتوافق مع البيانات القديمة)
          if (getLocalizedText(n.type, currentLang) !== filters.type) {
            return false;
          }
        }
      }
      
      // 3️⃣ فلتر السنة
      if (filters.year) {
        if (String(n.year) !== String(filters.year)) {
          return false;
        }
      }
      
      return true; // ✅ مرّ بكل الفلاتر
    });
  }, [items, filters, currentLang]);

  // === فتح المودال للإنشاء ===
  const handleOpenCreate = useCallback(() => {
    setEditingNews(null);
    setIsModalOpen(true);
  }, []);

  // === فتح المودال للتعديل ===
  const handleOpenEdit = useCallback((newsItem) => {
    setEditingNews(newsItem);
    setIsModalOpen(true);
  }, []);

  // === إغلاق المودال مع تحديث الأنواع ===
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingNews(null);
    // ✅ زيادة العداد لإجبار إعادة تحميل قائمة الأنواع (في حال أُضيف نوع جديد)
    setTypesVersion(prev => prev + 1);
  }, []);

  // === مسح الفلاتر ===
  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // === عرض حالة التحميل ===
  if (status === 'loading') {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-16 h-16 border-4 rounded-full ${isDark ? 'border-brand-secondary border-t-brand-primary' : 'border-brand-secondary border-t-brand-primary'}`} 
        />
      </div>
    );
  }

  return (
    <section 
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={currentLang}
      className={`
        min-h-screen transition-colors duration-300
        ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-background to-slate-50'}
        py-8 px-4 sm:px-6 lg:px-8
      `}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* === الهيدر + زر النشر === */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <SectionHeader
            pageKey="news"
            section="header"
            editable={canManageNews}
            className="w-full"
          />
          
          {/* زر نشر خبر جديد - للأدمن فقط === */}
          {canPublishNews && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleOpenCreate}
                icon={FaPlus}
                size="md"
                variant="primary"
                className={`rounded-xl shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5 hover:shadow-xl ${
                  isDark ? 'bg-brand-secondary hover:bg-brand-secondaryHover focus:ring-brand-secondary/40' : ''
                }`}
              >
                {t('news.publishNew')}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* === الفلاتر === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`
            flex flex-col gap-4 p-5 rounded-2xl border shadow-sm mb-6
            ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}
          `}
        >
          <div className="flex flex-wrap gap-4 items-end">
            {/* فلتر النوع === */}
            <div className="flex-1 min-w-36">
              <SelectFilter
                label={t('news.filterType')}
                options={typesOptions} // ✅ الآن من نفس مصدر المودال
                value={filters.type}
                onChange={value => dispatch(setFilter({ key: 'type', value }))}
                placeholder={t('news.selectType')}
                isDark={isDark}
              />
            </div>

            {/* فلتر السنة === */}
            <div className="flex-1 min-w-36">
              <SelectFilter
                label={t('news.filterYear')}
                options={yearsOptions} 
                value={filters.year}
                onChange={value => dispatch(setFilter({ key: 'year', value }))}
                placeholder={t('news.selectYear')}
                isDark={isDark}
              />
            </div>
            
            {/* حقل البحث === */}
            <div className="flex-1 min-w-48">
              <SearchInput
                value={filters.search}
                onChange={value => dispatch(setFilter({ key: 'search', value }))}
                placeholder={t('news.searchPlaceholder')}
                isDark={isDark}
              />
            </div>
            
            {/* زر مسح الفلاتر === */}
            {(filters.type || filters.year || filters.search) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearFilters}
                className={`
                  px-4 py-2.5 rounded-xl text-sm font-bold transition
                  ${isDark 
                    ? 'text-red-400 bg-red-900/30 hover:bg-red-900/50' 
                    : 'text-red-600 bg-red-50 hover:bg-red-100'
                  }
                `}
              >
                {t('common.clear')}
              </motion.button>
            )}
          </div>
          
          {/* عرض عدد النتائج === */}
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            {filteredNews.length} {t('news.resultsFound', { count: filteredNews.length })}
          </div>
        </motion.div>

        {/* === عرض الأخبار - Masonry Layout === */}
        <AnimatePresence mode="wait">
          {filteredNews.length > 0 ? (
            <motion.div
              key={`news-grid-${filters.type}-${filters.year}-${filters.search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InfiniteScrollFeed 
                items={filteredNews.map(news => (
                  <Card 
                    key={news.id} 
                    id={news.id}
                    title={news.title}
                    description={news.description}
                    image={news.image}
                    date={news.date}
                    type={news.type}
                    isNews={true}
                    views={news.views}
                    likes={news.likes}
                    commentsCount={news.commentsCount}
                    isDark={isDark}
                    // === للصلاحيات ===
                    canEdit={canManageNews || (news.authorId === user?.id)}
                    canDelete={canManageNews || (news.authorId === user?.id)}
                    onEdit={handleOpenEdit}
                  />
                ))} 
                perPage={6}
                isDark={isDark}
              />
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`py-16 text-center rounded-2xl border-2 border-dashed ${isDark ? 'border-gray-700 bg-gray-800/40' : 'border-slate-200 bg-slate-50'}`}
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="text-4xl mb-4"
              >
                🔍
              </motion.div>
              <p className={`font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('news.noResults')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearFilters}
                className={`mt-4 px-6 py-2.5 rounded-xl text-sm font-bold transition ${isDark ? 'text-brand-secondary hover:bg-brand-secondary/20' : 'text-brand-primary hover:bg-brand-primary/10'}`}
              >
                {t('news.clearFilters')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* === مودال النشر/التعديل === */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingPost={editingNews}
        postType="NEWS"
        // ✅ تمرير دالة لتحديث الأنواع عند الإضافة الناجحة
        onTypeAdded={() => setTypesVersion(prev => prev + 1)}
      />
    </section>
  );
};

export default News;