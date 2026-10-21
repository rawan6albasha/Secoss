// import { useEffect, useRef, useState } from "react";

// const ImageCarousel = ({ SlideComponent, items }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);

//   const startX = useRef(0);
//   const isDragging = useRef(false);

//   console.log("activeIndex:", activeIndex);

//   // ✅ reset عند تغيير البيانات
//   useEffect(() => {
//     setActiveIndex(0);
//   }, [items]);

//   // 🔥 Auto-play (يوقف عند hover)
//   useEffect(() => {
//     if (isHovered || items.length <= 1) return;

//     const interval = setInterval(() => {
//       setActiveIndex((prev) =>
//         prev + 1 >= items.length ? 0 : prev + 1
//       );
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [isHovered, items.length]);

//   const moveTo = (index) => {
//     if (index < 0) index = items.length - 1;
//     if (index >= items.length) index = 0;
//     setActiveIndex(index);
//   };

//   // 🖱️ Drag Start
//   const handleStart = (e) => {
//     isDragging.current = true;
//     startX.current =
//       e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
//   };

//   // 🖱️ Drag End
//   const handleEnd = (e) => {
//     if (!isDragging.current) return;

//     const endX =
//       e.type.includes("mouse") ? e.clientX : e.changedTouches[0].clientX;

//     const diff = startX.current - endX;

//     if (diff > 50) moveTo(activeIndex + 1);
//     if (diff < -50) moveTo(activeIndex - 1);

//     isDragging.current = false;
//   };

//   if (!items.length) return null;

//   return (
//     <div
//       className="relative overflow-hidden rounded-3xl"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onMouseDown={handleStart}
//       onMouseUp={handleEnd}
//       onTouchStart={handleStart}
//       onTouchEnd={handleEnd}
//     >
//       {/* ✅ Slides */}
//       <div
//         className="flex transition-transform duration-700 ease-out"
//         style={{
//           transform: `translateX(${activeIndex * 100}%)`,
//         }}
//       >
//         {items.map((item, idx) => (
//           <div
//             key={idx}
//             className="min-w-full h-[420px]"
//           >
//             <SlideComponent {...item} />
//           </div>
//         ))}
//       </div>

//       {/* ⬅️ Arrow */}
//       <button
//         onClick={() => moveTo(activeIndex - 1)}
//         className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-3 rounded-full shadow hover:scale-110 transition"
//       >
//         ‹
//       </button>

//       {/* ➡️ Arrow */}
//       <button
//         onClick={() => moveTo(activeIndex + 1)}
//         className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-3 rounded-full shadow hover:scale-110 transition"
//       >
//         ›
//       </button>

//       {/* 🔘 Dots */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//         {items.map((_, idx) => (
//           <button
//             key={idx}
//             onClick={() => moveTo(idx)}
//             className={`h-2 rounded-full transition-all ${
//               idx === activeIndex
//                 ? "bg-white w-5"
//                 : "bg-white/50 w-2 hover:bg-white"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageCarousel;  



// src/components/ui/ImageCarousel/ImageCarousel.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getLocalizedText } from '../../utils/i18n-helpers';

const ImageCarousel = ({ 
  SlideComponent, 
  items, 
  height = 'h-64 sm:h-80 lg:h-96', // ✅ ارتفاع قابل للتخصيص
  autoPlayInterval = 4000,
  showArrows = true,
  showDots = true,
}) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const currentLang = i18n.language || 'ar';
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const startX = useRef(0);
  const isDragging = useRef(false);
  const carouselRef = useRef(null);

  // === إعادة التعيين عند تغيير البيانات ===
  useEffect(() => {
    setActiveIndex(0);
  }, [items]);

  // === التشغيل التلقائي ===
  useEffect(() => {
    if (isHovered || items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1 >= items.length ? 0 : prev + 1));
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isHovered, items.length, autoPlayInterval]);

  // === التنقل بالسهم ===
  const moveTo = useCallback((index) => {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    setActiveIndex(index);
  }, [items.length]);

  // === السحب باللمس/الماوس ===
  const handleStart = useCallback((e) => {
    isDragging.current = true;
    startX.current = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
  }, []);

  const handleEnd = useCallback((e) => {
    if (!isDragging.current) return;
    const endX = e.type.includes("mouse") ? e.clientX : e.changedTouches[0].clientX;
    const diff = startX.current - endX;
    if (diff > 50) moveTo(activeIndex + 1);
    if (diff < -50) moveTo(activeIndex - 1);
    isDragging.current = false;
  }, [activeIndex, moveTo]);

  // === دعم لوحة المفاتيح ===
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') moveTo(activeIndex - 1);
    if (e.key === 'ArrowRight') moveTo(activeIndex + 1);
  }, [activeIndex, moveTo]);

  if (!items?.length) {
    return (
      <div className={`
        ${height} rounded-3xl border-2 border-dashed flex items-center justify-center
        ${isDark ? 'border-gray-700 text-gray-400' : 'border-slate-200 text-slate-400'}
      `}>
        <span className="text-sm">{t('carousel.noImages')}</span>
      </div>
    );
  }

  return (
    <div
      ref={carouselRef}
      className={`relative overflow-hidden rounded-3xl ${height}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={t('carousel.label')}
      aria-roledescription="carousel"
    >
      {/* === الشرائح === */}
      <div
        dir="ltr"
        className="flex w-full h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="relative w-full min-w-full h-full flex-shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={t('carousel.slideLabel', { current: idx + 1, total: items.length })}
          >
            <SlideComponent 
              {...item} 
              alt={getLocalizedText(item.alt, currentLang)}
            />
          </div>
        ))}
      </div>

      {/* === أزرار التنقل === */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={() => moveTo(activeIndex - 1)}
            className={`
              absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 
              p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-brand-secondary/50
              ${isDark 
                ? 'bg-gray-800/90 text-white hover:bg-gray-700' 
                : 'bg-white/90 text-slate-700 hover:bg-white'
              }
            `}
            aria-label={t('carousel.prev')}
          >
            <FaChevronLeft size={16} />
          </button>
          <button
            onClick={() => moveTo(activeIndex + 1)}
            className={`
              absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 
              p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-brand-secondary/50
              ${isDark 
                ? 'bg-gray-800/90 text-white hover:bg-gray-700' 
                : 'bg-white/90 text-slate-700 hover:bg-white'
              }
            `}
            aria-label={t('carousel.next')}
          >
            <FaChevronRight size={16} />
          </button>
        </>
      )}

      {/* === النقاط === */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-2   left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => moveTo(idx)}
              className={`
                h-1.5 sm:h-2 rounded-full transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-brand-secondary/50
                ${idx === activeIndex
                  ? 'bg-brand-secondary w-4 sm:w-5'
                  : isDark 
                    ? 'bg-gray-500/50 w-1.5 sm:w-2 hover:bg-gray-400' 
                    : 'bg-white/50 w-1.5 sm:w-2 hover:bg-white'
                }
              `}
              aria-label={t('carousel.goToSlide', { number: idx + 1 })}
              aria-current={idx === activeIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;