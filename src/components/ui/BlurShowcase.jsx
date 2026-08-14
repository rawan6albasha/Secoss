import { Link } from 'react-router-dom'
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
  if (!CardComponent) {
    console.error('ContentGrid: يجب تمرير CardComponent لعرض العناصر!')
    return null
  }

  const filteredItems = items.filter(filter)
  const displayedItems = loading ? Array.from({ length: limit }) : filteredItems.slice(0, limit)
  const hasMore = filteredItems.length > limit

  return (
    <section className="relative space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {displayedItems.map((item, index) => (
          <div key={loading ? index : item.id} className="h-full">
            <CardComponent {...item} loading={loading} />
          </div>
        ))}


          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-52">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 via-40% to-transparent" />
            <div className="absolute inset-0 backdrop-blur-[6px] mask-gradient" />
          </div>

      </div>


        <div className="flex justify-center mt-4">
          <Button   
          children="عرض المزيد"           
            to={buttonLink}
            variant="accent"
            className="whitespace-nowrap"/>
        </div>

    </section>
  )
}

export default BlurShowcase

