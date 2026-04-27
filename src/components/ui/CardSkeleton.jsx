// src/components/ui/CardSkeleton.jsx
const CardSkeleton = ({ variant = 'lecture', className = '' }) => {
  const baseClasses = `
    bg-white rounded-3xl border border-slate-100 
    overflow-hidden animate-pulse ${className}
  `

  if (variant === 'lecture') {
    return (
      <div className={baseClasses} role="status" aria-label="جاري التحميل">
        {/* الشريط العلوي */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="w-16 h-5 bg-slate-100 rounded-full" />
          <div className="w-8 h-8 bg-slate-100 rounded-full" />
        </div>

        {/* صورة وهمية */}
        <div className="px-4">
          <div className="aspect-video w-full rounded-2xl bg-slate-100" />
        </div>

        {/* المحتوى */}
        <div className="p-4 pt-3 space-y-3">
          {/* المحاضر */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="w-24 h-3 bg-slate-100 rounded" />
              <div className="w-16 h-2 bg-slate-100 rounded" />
            </div>
          </div>

          {/* العنوان */}
          <div className="space-y-2">
            <div className="w-full h-4 bg-slate-100 rounded" />
            <div className="w-3/4 h-4 bg-slate-100 rounded" />
          </div>

          {/* الملخص */}
          <div className="space-y-2">
            <div className="w-full h-3 bg-slate-100 rounded" />
            <div className="w-full h-3 bg-slate-100 rounded" />
            <div className="w-2/3 h-3 bg-slate-100 rounded" />
          </div>

          {/* الوسم */}
          <div className="w-20 h-5 bg-slate-100 rounded-full" />
        </div>

        {/* الفوتر */}
        <div className="px-4 pb-4 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <div className="w-8 h-3 bg-slate-100 rounded" />
              <div className="w-8 h-3 bg-slate-100 rounded" />
              <div className="w-8 h-3 bg-slate-100 rounded" />
            </div>
            <div className="w-12 h-6 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  // === هيكل عام قابل للتخصيص ===
  return (
    <div className={baseClasses}>
      <div className="p-4 space-y-4">
        <div className="w-3/4 h-5 bg-slate-100 rounded" />
        <div className="space-y-2">
          <div className="w-full h-3 bg-slate-100 rounded" />
          <div className="w-5/6 h-3 bg-slate-100 rounded" />
        </div>
        <div className="w-1/2 h-8 bg-slate-100 rounded-lg" />
      </div>
    </div>
  )
}

export default CardSkeleton