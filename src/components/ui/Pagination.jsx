// src/components/ui/Pagination/Pagination.jsx
import { useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

const Pagination = ({ 
  items, 
  perPage = 4, 
  maxVisible = 9, 
  getItemKey,
  onPageChange, // دالة اختيارية للإشعار بتغير الصفحة
  className = ""
}) => {
  const totalPages = Math.ceil((items?.length || 0) / perPage)
  const [currentPage, setCurrentPage] = useState(1)

  const visibleItems = useMemo(() => {
    if (!items) return []
    return items.slice((currentPage - 1) * perPage, currentPage * perPage)
  }, [items, currentPage, perPage])

  
  if (!items || items.length === 0) {
    return (
      <div className="py-12 text-center" role="status">
        <p className="text-slate-500">لا يوجد بيانات لعرضها</p>
      </div>
    )
  }
 
  const handleChange = useCallback((page) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    
    setCurrentPage(page)
    onPageChange?.(page)
  }, [currentPage, totalPages, onPageChange])

  // === توليد أرقام الصفحات مع ... ===
  const pages = useMemo(() => {
    const result = []
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    // ضبط البداية إذا وصلنا للنهاية
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    if (start > 1) {
      result.push(1)
      if (start > 2) result.push("ellipsis-start")
    }

    for (let i = start; i <= end; i++) {
      result.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) result.push("ellipsis-end")
      result.push(totalPages)
    }

    return result
  }, [currentPage, totalPages, maxVisible])

  const getItemUniqueKey = (item, index) => {
    if (getItemKey) return getItemKey(item)
    if (item?.id) return item.id
    if (typeof item === 'string' || typeof item === 'number') return item
    return `${item?.title || 'item'}-${index}`
  }

  return (
    <div className={`space-y-6 ${className}`} dir="rtl">
      
      {/* === عرض العناصر مع حركات دخول === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {visibleItems.map((item, index) => {
          const uniqueKey = getItemUniqueKey(item, index)
          return (
            <motion.div
              key={uniqueKey}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="h-full"
            >
              {item}
            </motion.div>
          )
        })}
      </div>
      
      {/* === عناصر التحكم في الصفحات === */}
      {totalPages > 1 && (
        <nav 
          className="flex items-center justify-center gap-1.5 mt-8" 
          aria-label="التنقل بين الصفحات"
          dir="ltr"
        >
          {/* زر السابق */}
          <button
            onClick={() => handleChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="الصفحة السابقة"
            className={`
              p-2.5 rounded-xl transition-all duration-200
              flex items-center justify-center
              ${currentPage === 1 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-brand-primary'
              }
            `}
          >
            <FaChevronRight size={16} className="rtl:rotate-180" />
          </button>

          {/* أرقام الصفحات */}
          <div className="flex items-center gap-1">
            {pages.map((page, index) => {
              if (page === "ellipsis-start" || page === "ellipsis-end") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-slate-400 select-none"
                    aria-hidden="true"
                  >
                    ...
                  </span>
                )
              }
              
              const isActive = currentPage === page
              return (
                <motion.button
                  key={`page-${page}`}
                  onClick={() => handleChange(page)}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{ duration: 0.15 }}
                  aria-label={`الصفحة ${page}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    min-w-[2.5rem] px-3 py-2 rounded-xl text-sm font-semibold
                    transition-all duration-200
                    ${isActive
                      ? "bg-brand-primary text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-brand-primary"
                    }
                  `}
                >
                  {page}
                </motion.button>
              )
            })}
          </div>

          {/* زر التالي */}
          <button
            onClick={() => handleChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="الصفحة التالية"
            className={`
              p-2.5 rounded-xl transition-all duration-200
              flex items-center justify-center
              ${currentPage === totalPages 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-brand-primary'
              }
            `}
          >
            <FaChevronLeft size={16} className="rtl:rotate-180" />
          </button>
        </nav>
      )}
    </div>
  )
}

export default Pagination