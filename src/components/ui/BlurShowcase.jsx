import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { getLocalizedText } from '../../utils/i18n-helpers'
import Button from './Button'

const BlurShowcase = ({
  title = 'المحتوى',
  items = [],          // مصفوفة العناصر
  loading = false,
  limit = 6,           // الحد الأقصى لعدد العناصر اللي رح تظهر
  filter = () => true,  // دالة فلترة
  CardComponent,        // الكومبوننت اللي يعرض كل عنصر (إجباري)
  buttonLink = '/more', // رابط زر "عرض المزيد"
}) => {
  const { i18n } = useTranslation()
  const { isDark } = useTheme()
  const currentLang = i18n.language || 'ar'

  if (!CardComponent) {
    console.error('ContentGrid: يجب تمرير CardComponent لعرض العناصر!')
    return null
  }

  const filteredItems = items.filter(filter)
  const displayedItems = loading ? Array.from({ length: limit }) : filteredItems.slice(0, limit)
  const hasMore = filteredItems.length > limit

  return (
    <section className={`relative space-y-8 py-6 sm:py-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <h2 className="text-2xl sm:text-3xl font-bold">{getLocalizedText(title, currentLang)}</h2>

      {/* Responsive Grid */}
      <div className="relative grid min-h-[26rem] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {displayedItems.map((item, index) => (
          <div key={loading ? index : item.id} className="h-full min-h-[22rem]">
            <CardComponent {...item} loading={loading} />
          </div>
        ))}


          <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-44 w-full [mask-image:linear-gradient(to_top,black_0%,black_30%,transparent_100%)]">
            <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-gray-900/95 via-gray-900/55' : 'from-white/95 via-white/55'} via-40% to-transparent`} />
            <div className="absolute inset-0 backdrop-blur-[6px]" />
          </div>

      </div>


        <div className="flex justify-center pt-2">
          <Button   
          children={currentLang.startsWith('ar') ? 'عرض المزيد' : 'View more'}
            to={buttonLink}
            variant="accent"
            className="whitespace-nowrap"/>
        </div>

    </section>
  )
}

export default BlurShowcase

