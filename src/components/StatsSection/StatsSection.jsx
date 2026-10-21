import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { getLocalizedText } from "../../utils/i18n-helpers";

const StatsCard = ({ title, value, Icon, gradient, isDark, currentLang }) => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  // 👇 مراقبة الظهور عند السكرول
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  // 👇 عداد
  useEffect(() => {
    if (!visible) return;

    let start = 0;
    const duration = 1200;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [visible, value]);

  return (
    <div
      ref={ref}
      className={`rounded-3xl border p-6 text-center shadow-lg transition-all duration-700 
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      hover:-translate-y-2 hover:shadow-2xl
      ${isDark
        ? "bg-gray-800/80 border-gray-700 hover:border-brand-secondary/40"
        : "bg-white border-slate-200 hover:border-brand-primary/30"}`}
    >
      {/* icon */}
      <div
        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl ${gradient}`}
      >
        <Icon />
      </div>

      {/* number */}
      <h2 className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
        {count}+
      </h2>

      {/* title */}
      <p className={`text-lg ${isDark ? "text-gray-300" : "text-slate-600"}`}>
        {getLocalizedText(title, currentLang)}
      </p>
    </div>
  );
};




// import StatsCard from "./StatsCard";


const StatsSection = ({ data }) => {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();
  const currentLang = i18n.language || "ar";
  const isArabic = currentLang.startsWith("ar");

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className={`py-16 sm:py-20 transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-slate-50"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">

        <h1 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDark ? "text-white" : "text-slate-900"}`}>
          {isArabic ? "إنجازاتنا" : "Our achievements"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {data.map((item, index) => (
            <StatsCard
              key={index}
              {...item}
              isDark={isDark}
              currentLang={currentLang}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default StatsSection;