// // tailwind.config.js
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   darkMode: "class", // أو 'media' حسب حاجتك
//   theme: {
//     extend: {
//       // === 🎨 ألوان الهوية البصرية ===
//       colors: {
//         brand: {
//           primary: "#0201fb", // أزرق غامق - اللون الرئيسي
//           secondary: "#84fdff", // سماوي فاتح - اللون الثانوي
//           // مشتقات مفيدة
//           primaryHover: "#0100d1",
//           secondaryHover: "#5dfbff",
//           light: "#84fdff20", // شفافية 12% للخلفيات
//         },
//         // ألوان حالة (يمكن تعديلها لتتناسب مع الهوية)
//         success: "#22c55e",
//         warning: "#f59e0b",
//         error: "#ef4444",
//       },

//       // === 🔤 الخطوط ===
//       fontFamily: {
//       sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
//       arabic: ['Tajawal', 'Cairo', 'sans-serif'], // ✅ ستعمل تلقائياً مع جوجل فونتس
//       },

//       // === 📏 المسافات (إضافة إذا احتجت قيم مخصصة) ===
//       spacing: {
//         18: "4.5rem",
//         22: "5.5rem",
//         // ... إلخ
//       },

//       // === 🔄 الانتقالات ===
//       transitionDuration: {
//         150: "150ms",
//         300: "300ms",
//       },
//       transitionTimingFunction: {
//         "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
//       },

//       // === 🎭 تأثيرات إضافية ===
//       boxShadow: {
//         brand: "0 4px 14px rgba(2, 1, 251, 0.15)",
//         "brand-hover": "0 8px 24px rgba(2, 1, 251, 0.25)",
//       },
//       borderRadius: {
//         "4xl": "2rem",
//       },
//       minHeight: { "60vh": "60vh" },
//     },
//   },
//   plugins: [
//     // يمكن إضافة @tailwindcss/forms أو @tailwindcss/typography هنا
//     require("@tailwindcss/forms"),
//     require("@tailwindcss/typography"),
//   ],
// };
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // === 🎨 ألوان هوية الجمعية الخيرية ===
      colors: {
        brand: {
          primary: "#1E40AF",
          primaryHover: "#1E3A8A",
          secondary: "#2563EB",
          secondaryHover: "#1D4ED8",
          accent: "#2563EB",
          accentHover: "#1E40AF",
          light: "#EFF6FF",
          soft: "#E2E8F0",
          surface: "#F8FAFC",
        },
        accent: "#2563EB",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },


      

      // === 🔤 الخطوط - دعم العربية والإنجليزية ===
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Tajawal', 'Cairo', 'Noto Sans Arabic', 'sans-serif'],
      },
      

      // === 📏 تحسينات المسافات والحدود ===
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        88: "22rem",
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // === 🎭 تأثيرات الظل والحركة ===
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'brand': '0 4px 20px rgba(30, 64, 175, 0.12)',
        'brand-hover': '0 8px 30px rgba(30, 64, 175, 0.2)',
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
      },
      
      // === 🔄 تحسينات الحركة ===
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
        '500': '500ms',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    // إضافة دعم RTL إذا لزم
    // require('tailwindcss-rtl'),
  ],
}


