// src/pages/Lectures/Lectures.jsx
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from "framer-motion";

// === أدوات مركزية ===
import { getLocalizedText, toBilingualOptions } from "../../utils/i18n-helpers";
import { PERMISSION_KEYS } from "../../config/permissions";

// === مكونات ===
import Button from "../../components/ui/Button";
import SectionHeader from "../../components/ui/SectionHeader";
import LectureCard from "../../components/LectureCard/LectureCard";
import Pagination from "../../components/ui/Pagination";
import SearchInput from "../../components/ui/SearchInput";
import SelectFilter from "../../components/ui/SelectFilter";

// === Redux ===
import { clearFilters as clearReduxFilters } from "../../store/slices/lecturesSlice";
import { useHasPermission } from "../../hooks/usePermission";

const Lectures = () => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams(); // ✅ لاستخدام أفضل مع الـ URL
  
  const currentLang = i18n?.language || "ar";
  const isRTL = currentLang === "ar";
  
  // === بيانات من Redux ===
  const { items: allLectures, status, filters: reduxFilters } = useSelector((state) => state.lectures);
  const { user } = useSelector((state) => state.user);
  
  // === صلاحيات ===
  const canCreateLecture = useHasPermission(PERMISSION_KEYS.PUBLISH_CONTENT);
  const canManageLectures = useHasPermission(PERMISSION_KEYS.MANAGE_USERS);

  // === حالة الفلاتر المحلية (مهيأة من Redux أولاً) ===
  const [search, setSearch] = useState(reduxFilters?.search || "");
  const [selectedSpeaker, setSelectedSpeaker] = useState(reduxFilters?.speaker || "");
  const [selectedYear, setSelectedYear] = useState(reduxFilters?.year || "");
  const [selectedSubCategory, setSelectedSubCategory] = useState(reduxFilters?.subCategory || "");
  const [selectedMainCategory, setSelectedMainCategory] = useState(reduxFilters?.category || "");
  const syncingFromUrl = useRef(false);

  // === مزامنة URL مع الفلاتر المحلية ===
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // تحديث الحالة المحلية من الـ URL فقط إذا كانت مختلفة (لمنع الحلقات اللانهائية)
    const urlSearch = params.get("search") || "";
    const urlSpeaker = params.get("speaker") || "";
    const urlYear = params.get("year") || "";
    const urlCategory = params.get("category") || "";
    const urlSubCategory = params.get("subCategory") || "";

    if (urlSearch !== search) setSearch(urlSearch);
    if (urlSpeaker !== selectedSpeaker) setSelectedSpeaker(urlSpeaker);
    if (urlYear !== selectedYear) setSelectedYear(urlYear);
    if (urlCategory !== selectedMainCategory) setSelectedMainCategory(urlCategory);
    if (urlSubCategory !== selectedSubCategory) setSelectedSubCategory(urlSubCategory);
    syncingFromUrl.current = true;
  }, [location.search]); // ← يعتمد فقط على تغير الـ URL

  // === 3️⃣ مزامنة: المحلية ←→ URL (عند تغير الفلاتر، حدّث الـ URL) ===
  useEffect(() => {
    if (syncingFromUrl.current) {
      syncingFromUrl.current = false;
      return;
    }

    const params = new URLSearchParams();
    
    if (search) params.set("search", search);
    if (selectedSpeaker) params.set("speaker", selectedSpeaker);
    if (selectedYear) params.set("year", selectedYear);
    if (selectedMainCategory) params.set("category", selectedMainCategory);
    if (selectedSubCategory) params.set("subCategory", selectedSubCategory);
    
    if (params.toString() === location.search.replace(/^\?/, "")) return;

    // تحديث query دون إسقاط مسار النشر أو إعادة تحميل الصفحة
    setSearchParams(params, { replace: true });
  }, [search, selectedSpeaker, selectedYear, selectedMainCategory, selectedSubCategory, location.search, setSearchParams]);

  // === فلترة آمنة: نعرض فقط المحاضرات المقبولة ===
  const approvedLectures = useMemo(() => {
    if (!Array.isArray(allLectures)) return [];
    return allLectures.filter((item) => item?.status === "APPROVED");
  }, [allLectures]);

  // === استخراج الخيارات الفريدة للفلاتر ===
  const rawSpeakers = useMemo(() => 
    Array.from(new Set(approvedLectures.map((l) => l?.speaker))).filter(Boolean), 
  [approvedLectures]);

  const rawYears = useMemo(() => 
    Array.from(new Set(approvedLectures.map((l) => l?.year || l?.createdAt?.slice(0, 4))))
      .filter(Boolean)
      .sort((a, b) => Number(b) - Number(a)), 
  [approvedLectures]);

  const rawSubCategories = useMemo(() => 
    Array.from(new Set(approvedLectures.map((l) => l?.subCategory))).filter(Boolean), 
  [approvedLectures]);

  const rawMainCategories = useMemo(() => 
    Array.from(new Set(approvedLectures.map((l) => l?.category))).filter(Boolean), 
  [approvedLectures]);

  // === تحويل الخيارات لدعم اللغتين ===
  const yearsOptions = useMemo(() => 
    toBilingualOptions(rawYears, { defaultEn: null }), 
  [rawYears]);

  const speakersOptions = useMemo(() => 
    rawSpeakers.map(speaker => ({
      value: typeof speaker === 'object' ? (speaker?.id || speaker?.value || speaker) : speaker,
      label: typeof speaker === 'object' && speaker?.name 
        ? speaker.name 
        : { ar: String(speaker), en: String(speaker) },
    })), 
  [rawSpeakers]);

  const mainCategoriesOptions = useMemo(() => 
    rawMainCategories.map(cat => {
      if (typeof cat === "object" && cat?.name) {
        return { value: cat?.id || cat?.value || cat, label: cat.name };
      }
      return { value: cat, label: { ar: cat, en: cat } };
    }), 
  [rawMainCategories]);

  const subCategoriesOptions = useMemo(() => {
    let filtered = rawSubCategories;
    if (selectedMainCategory) {
      filtered = approvedLectures
        .filter(l => l?.category === selectedMainCategory)
        .map(l => l?.subCategory)
        .filter(Boolean);
    }
    return Array.from(new Set(filtered)).map(cat => {
      if (typeof cat === "object" && cat?.name) {
        return { value: cat?.id || cat?.value || cat, label: cat.name };
      }
      return { value: cat, label: { ar: cat, en: cat } };
    });
  }, [rawSubCategories, selectedMainCategory, approvedLectures]);

  // === ✅ تطبيق الفلاتر على المحاضرات (مع جميع الاعتمادات) ===
  const filteredLectures = useMemo(() => {
    const getSearchText = (value) => {
      if (value == null) return '';
      if (typeof value === 'object') return getLocalizedText(value, currentLang);
      return String(value);
    };

    return approvedLectures.filter((l) => {
      // البحث في العنوان والملخص
      const searchValue = search.toLowerCase().trim();
      const matchesSearch = searchValue
        ? [l?.title, l?.summary, l?.fullContent, l?.speaker, l?.category, l?.subCategory, ...(l?.tags || [])]
            .map(getSearchText)
            .some(value => value.toLowerCase().includes(searchValue))
        : true;
      
      // الفلاتر الأخرى
      const matchesSpeaker = selectedSpeaker ? l?.speaker === selectedSpeaker : true;
      const lectureYear = l?.year || l?.createdAt?.slice(0, 4);
      const matchesYear = selectedYear ? String(lectureYear) === String(selectedYear) : true;
      const matchesSubCat = selectedSubCategory ? l?.subCategory === selectedSubCategory : true;
      const matchesMainCat = selectedMainCategory ? l?.category === selectedMainCategory : true;
      
      return matchesSearch && matchesSpeaker && matchesYear && matchesSubCat && matchesMainCat;
    });
  }, [
    // ✅ جميع المتغيرات المستخدمة في الفلترة يجب أن تكون هنا
    approvedLectures, 
    search, 
    selectedSpeaker, 
    selectedYear, 
    selectedSubCategory, 
    selectedMainCategory
  ]);

  // === ✅ مسح الفلاتر (يعيد تعيين كل الحالات + يحدّث Redux + يحدّث URL) ===
  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedSpeaker("");
    setSelectedYear("");
    setSelectedSubCategory("");
    setSelectedMainCategory("");
    
    // مسح فلاتر Redux أيضاً
    dispatch(clearReduxFilters());
    
    // مسح الـ URL
    setSearchParams({}, { replace: true });
  }, [dispatch, setSearchParams]);

  // === أنيميشن الحاوية ===
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  // === عرض حالة التحميل ===
  if (status === "loading") {
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
        px-4 sm:px-6 py-8 lg:py-10
      `}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* === الهيدر + زر الإضافة === */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <SectionHeader 
              pageKey="lectures"
              section="header"
              editable={canManageLectures}
              className="w-full"
            />
            
            {canCreateLecture && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/profile?new=lecture')}
                  className={`${isDark ? 'bg-brand-secondary hover:bg-brand-secondaryHover' : 'bg-brand-primary hover:bg-brand-primaryHover'} text-white`}
                >
                  {t('lectures.addNew')}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* === الفلاتر === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 
            p-5 rounded-2xl border shadow-sm mb-8
            ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}
          `}
        >
          <SelectFilter
            label={t('lectures.filterBySpeaker')}
            options={speakersOptions}
            value={selectedSpeaker}
            onChange={setSelectedSpeaker}
            placeholder={t('lectures.filterBySpeaker')}
            isDark={isDark}
          />

          <SelectFilter
            label={t('lectures.filterByYear')}
            options={yearsOptions}  
            value={selectedYear}
            onChange={setSelectedYear}
            placeholder={t('lectures.filterByYear')}
            isDark={isDark}
          />

          <SelectFilter
            label={t('lectures.filterByCategory')}
            options={mainCategoriesOptions}
            value={selectedMainCategory}
            onChange={setSelectedMainCategory}
            placeholder={t('lectures.filterByCategory')}
            isDark={isDark}
          />

          <SelectFilter
            label={t('lectures.filterBySubCategory')}
            options={subCategoriesOptions}
            value={selectedSubCategory}
            onChange={setSelectedSubCategory}
            placeholder={t('lectures.filterBySubCategory')}
            disabled={!selectedMainCategory}
            isDark={isDark}
          />

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearFilters}
              className={`
                w-full h-11 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2
                ${isDark 
                  ? 'text-red-400 bg-red-900/40 hover:bg-red-900/60 border border-red-800' 
                  : 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
                }
              `}
            >
              <span>🗑️</span> {t('lectures.clearFilters')}
            </motion.button>
          </div>
        </motion.div>

        {/* === هيدر النتائج + البحث === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`
            flex flex-col md:flex-row gap-4 items-center justify-between 
            border-b pb-6 mb-6
            ${isDark ? 'border-gray-700' : 'border-slate-200'}
          `}
        >
          <div className={`w-full md:w-auto ${isRTL ? 'text-right' : 'text-left'}`}>
            <AnimatePresence mode="wait">
              <motion.h2 
                key={filteredLectures.length}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {filteredLectures.length} {t('lectures.lecturesAvailable', { count: filteredLectures.length })}
              </motion.h2>
            </AnimatePresence>
            <p className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
              {t('lectures.resultsFound')}
            </p>
          </div>
          <div className="w-full md:max-w-md">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t('lectures.searchPlaceholder')}
              onClear={clearFilters}
              isDark={isDark}
            />
          </div>
        </motion.div>

        {/* === عرض النتائج === */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`results-${search}-${selectedSpeaker}-${selectedYear}-${selectedMainCategory}-${selectedSubCategory}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="w-full"
          >
            {filteredLectures.length > 0 ? (
              <Pagination 
                items={filteredLectures.map((lecture) => (
                  <div key={lecture?.id}>
                    <LectureCard 
                      lecture={lecture}
                      isDark={isDark}
                    />
                  </div>
                ))} 
                perPage={6} 
                resetKey={`${search}-${selectedSpeaker}-${selectedYear}-${selectedMainCategory}-${selectedSubCategory}`}
                className="w-full"
                isDark={isDark}
              />
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
                  {t('lectures.noResults')}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className={`mt-4 px-6 py-2.5 rounded-xl text-sm font-bold transition ${isDark ? 'text-brand-secondary hover:bg-brand-secondary/20' : 'text-brand-primary hover:bg-brand-primary/10'}`}
                >
                  {t('lectures.clearFilters')}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Lectures;