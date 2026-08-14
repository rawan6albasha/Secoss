import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import BackButton from '../../components/BackButton'
import SectionHeader from '../../components/ui/SectionHeader'
import Tag from '../../components/ui/Tag'
import SearchInput from '../../components/ui/SearchInput'
import InfiniteScrollFeed from '../../components/ui/InfiniteScrollFeed'
import Button from '../../components/ui/Button'

const Lecturers = () => {
  const lectures = useSelector(state => state.lectures.items)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  // قائمة المحاضرين مع عدد المحاضرات لكل واحد + فلترة البحث
  const lecturers = useMemo(() => {
    const countMap = {}
    lectures.forEach(l => {
      if (!search || l.speaker.toLowerCase().includes(search.toLowerCase())) {
        countMap[l.speaker] = (countMap[l.speaker] || 0) + 1
      }
    })
    return Object.entries(countMap).map(([name, count]) => ({ name, count }))
  }, [lectures, search])

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
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  }

  return (
    <section className="py-5 px-4 sm:px-6 lg:px-8 space-y-5" dir="rtl">
      {/*  */}
      

      {/* Header+زر الرجوع */}
      <div className='flex justify-between items-end gap-4'>
<div className="w-full">
      <SectionHeader
        eyebrow="المحاضرون"
        title="قائمة المحاضرين"/>
        </div>
              <div className="w-full">
        <SearchInput value={search} onChange={setSearch} />
      </div>
</div>
      {/* البحث */}


      {/* قائمة المحاضرين مع Staggered Animation */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {lecturers.map((lecturer, idx) => (
          <motion.div
            key={idx}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md hover:shadow-lg cursor-pointer transition-all"
            variants={cardVariants}
            whileHover="hover"
            onClick={() =>
              navigate(`/lectures?speaker=${encodeURIComponent(lecturer.name)}`)
            }
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 hover:text-brand-secondary transition">
              {lecturer.name}
            </h3>
            <p className="mt-2">
              <Tag variant="accentSoft">
                {lecturer.count} محاضرة{lecturer.count > 1 ? 'ات' : ''}
              </Tag>
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* زر مسح البحث */}
      {search && (
        <div className="flex justify-start mt-4">
          <Button variant="secondary" onClick={() => setSearch('')}>
            مسح البحث
          </Button>
        </div>
      )}
    </section>
  )
}

export default Lecturers