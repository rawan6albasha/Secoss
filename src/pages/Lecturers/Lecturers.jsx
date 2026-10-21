import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion'
import SearchInput from '../../components/ui/SearchInput'
import { FaArrowLeft, FaBookOpen, FaChalkboardTeacher } from 'react-icons/fa'
import { lecturers as lecturerData } from '../../data/users'

const Lecturers = () => {
  const lectures = useSelector(state => state.lectures.items)
  const navigate = useNavigate()
  const { i18n, t } = useTranslation()
  const { isDark } = useTheme()
  const [search, setSearch] = useState('')
  const currentLang = i18n.language || 'ar'
  const isArabic = currentLang.startsWith('ar')

  const lecturers = useMemo(() => {
    return lecturerData
      .map(lecturer => {
        const lecturerLectures = lectures.filter(lecture => lecture.authorId === lecturer.id)
        const categories = [...new Set(lecturerLectures.map(lecture => lecture.category).filter(Boolean))]

        return {
          ...lecturer,
          count: lecturerLectures.length,
          categories: categories.slice(0, 2),
        }
      })
      .filter(lecturer => {
        const normalizedSearch = search.trim().toLowerCase()
        return !normalizedSearch || lecturer.name.toLowerCase().includes(normalizedSearch)
      })
  }, [lectures, search])

  const totalLectures = lectures.length
  const countLabel = (count) => count === 1 ? t('lecturers.lecture') : t('lecturers.lectures')

  // Variants للكاردات
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1, // كل كارد يظهر بعد 0.1 ثانية
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { y: -6, transition: { duration: 0.25 } },
  }

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`min-h-[70vh] px-4 py-10 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-950 text-white' : 'bg-slate-50 text-slate-900'}`}
    >
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-primary to-brand-secondary px-6 py-10 text-white shadow-xl sm:px-10">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center gap-3 text-sm font-bold text-white/80">
              <FaChalkboardTeacher />
              <span>{t('lecturers.eyebrow')}</span>
            </div>
            <h1 className="text-3xl font-black sm:text-5xl">
              {t('lecturers.title')}
            </h1>
            <p className="max-w-xl text-sm leading-7 text-white/85 sm:text-base">
              {t('lecturers.description')}
            </p>
          </div>
          <FaChalkboardTeacher className="absolute -bottom-10 end-8 text-[12rem] text-white/10" aria-hidden="true" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className={`rounded-2xl border p-5 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-slate-200 bg-white'}`}>
            <FaChalkboardTeacher className="mb-3 text-brand-secondary" />
            <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{lecturers.length}</p>
            <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>{t('lecturers.count')}</p>
          </div>
          <div className={`rounded-2xl border p-5 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-slate-200 bg-white'}`}>
            <FaBookOpen className="mb-3 text-brand-secondary" />
            <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalLectures}</p>
            <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>{t('lecturers.publishedLectures')}</p>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('lecturers.sectionTitle')}
            </h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              {t('lecturers.sectionDescription')}
            </p>
          </div>
          <SearchInput value={search} onChange={setSearch} />
        </div>

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {lecturers.map((lecturer) => (
          <motion.div
            key={lecturer.name}
            className={`group cursor-pointer rounded-3xl border p-6 shadow-sm transition-shadow hover:shadow-xl ${isDark ? 'border-gray-800 bg-gray-900 hover:border-brand-secondary/50' : 'border-slate-200 bg-white hover:border-brand-primary/30'}`}
            variants={cardVariants}
            whileHover="hover"
            onClick={() =>
              navigate(`/lectures?speaker=${encodeURIComponent(lecturer.name)}`)
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary text-xl font-black text-white shadow-lg">
                {lecturer.name.trim().charAt(0)}
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${isDark ? 'bg-brand-secondary/15 text-brand-secondary' : 'bg-brand-primary/10 text-brand-primary'}`}>
                {lecturer.count} {countLabel(lecturer.count)}
              </span>
            </div>
            <h3 className={`mt-5 text-xl font-black transition-colors group-hover:text-brand-secondary ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lecturer.name}
            </h3>
            <div className="mt-4 flex min-h-7 flex-wrap gap-2">
              {lecturer.categories.map(category => (
                <span key={category} className={`rounded-md px-2 py-1 text-[11px] ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-slate-100 text-slate-600'}`}>
                  {category}
                </span>
              ))}
            </div>
            <div className={`mt-6 flex items-center gap-2 text-sm font-bold text-brand-secondary ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
              <span>{t('lecturers.viewLectures')}</span>
              <FaArrowLeft className={isArabic ? '' : 'rotate-180'} size={12} />
            </div>
          </motion.div>
        ))}
      </motion.div>

        {lecturers.length === 0 && (
          <div className={`rounded-3xl border py-16 text-center ${isDark ? 'border-gray-800 bg-gray-900 text-gray-400' : 'border-slate-200 bg-white text-slate-500'}`}>
            {t('lecturers.noResults')}
          </div>
        )}
      </div>
    </section>
  )
}

export default Lecturers