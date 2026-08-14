// src/config/siteConfig.js
/**
 * 🎯 ملف التكوين المركزي - جميع معلومات الموقع من مكان واحد
 * يمكن تعديله بسهولة دون الحاجة للبحث في الملفات
 */
import logoImage from './../assets/logo1.png';

export const SITE_CONFIG = {
  // === هوية الجمعية ===
  identity: {
    name: {
      ar: 'جمعية العلوم الاقتصادية',
      en: 'Syrian Economic Sciences',
    },

    shortName: {
      // ar: '',
      // en: 'SES',
    },

    logo: logoImage, // مسار الشعار
    favicon: '/favicon.ico',
    description: {
      ar: 'منصة علمية متخصصة لنشر المعرفة الاقتصادية وتطوير الكوادر الأكاديمية',
      en: 'A specialized scientific platform for disseminating economic knowledge and developing academic cadres',
    },
  },

  // === الألوان والهوية البصرية ===
  theme: {
    colors: {
      primary: '#1E40AF',      // أزرق رسمي وموثوق
      primaryHover: '#1E3A8A',
      secondary: '#2563EB',    // أزرق داعم متناسق مع الهوية
      secondaryHover: '#1D4ED8',
      accent: '#2563EB',       // نفس الأسرة الزرقاء للوضوح
      accentHover: '#1E40AF',
      background: {
        light: '#F8FAFC',
        dark: '#020617',
      },
      surface: {
        light: '#FFFFFF',
        dark: '#111827',
      },
    },
    fonts: {
      arabic: ['Tajawal', 'Cairo', 'Noto Sans Arabic', 'sans-serif'],
      latin: ['Inter', 'system-ui', 'sans-serif'],
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem',
      '2xl': '2rem',
    },
  },

  // === روابط التنقل ===
  navigation: {
    main: [
      { key: 'home', path: '/', icon: '🏠' },
      { key: 'conditions', path: '/conditions', icon: '📋' },
      { key: 'lecturers', path: '/lecturers', icon: '👨‍🏫' },
      { key: 'board', path: '/board', icon: '👥' },
      { key: 'about', path: '/about', icon: 'ℹ️' },
      { key: 'news', path: '/news', icon: '📰' },
      { key: 'lectures', path: '/lectures', icon: '🎓' },
    ],
    user: [
      { key: 'profile', path: '/profile', icon: '👤' },
      { key: 'settings', path: '/settings', icon: '⚙️' },
      { key: 'logout', action: 'logout', icon: '🚪', danger: true },
    ],
  },
    footer: {
    sections: [
      {
        id: 'about',
        titleKey: 'footer.about.title',
        contentKey: 'footer.about.content',
        type: 'text',
      },
      {
        id: 'quick-links',
        titleKey: 'footer.quickLinks.title',
        type: 'links',
        links: [
          { key: 'nav.home', path: '/' },
          { key: 'nav.lecturers', path: '/lecturers' },
          { key: 'nav.board', path: '/board' },
          { key: 'nav.news', path: '/news' },
          { key: 'nav.lectures', path: '/lectures' },
        ],
      },
      {
        id: 'contact',
        titleKey: 'footer.contact.title',
        type: 'contact',
        items: [
          { type: 'email', value: 'info@ses.org.sy', icon: '📧' },
          { type: 'phone', value: '+963 11 123 4567', icon: '📱' },
          { type: 'address', value: 'دمشق، سوريا', icon: '📍' },
        ],
      },
    ],
    
    // === النشرة البريدية ===
    newsletter: {
      titleKey: 'footer.newsletter.title',
      descriptionKey: 'footer.newsletter.description',
      placeholderKey: 'footer.newsletter.placeholder',
      buttonKey: 'footer.newsletter.button',
      successMessage: 'footer.newsletter.success',
    },
    
    // === وسائل التواصل الاجتماعي ===
   social: [
    { 
      id: 'facebook', 
      icon: 'FaFacebookF', 
      href: 'https://facebook.com/ses', 
      labelKey: 'social.facebook',
      color: '#1877F2'
    },
    { 
      id: 'twitter', 
      icon: 'FaTwitter', 
      href: 'https://twitter.com/ses', 
      labelKey: 'social.twitter',
      color: '#1DA1F2'
    },
    { 
      id: 'linkedin', 
      icon: 'FaLinkedin', 
      href: 'https://linkedin.com/company/ses', 
      labelKey: 'social.linkedin',
      color: '#0077b5'
    },
    { 
      id: 'youtube', 
      icon: 'FaYoutube', 
      href: 'https://youtube.com/@ses', 
      labelKey: 'social.youtube',
      color: '#FF0000'
    },
  ],
    
    // === الحقوق والنسخة ===
    copyright: {
      textKey: 'footer.copyright',
      startYear: 2024,
      organizationKey: 'nav.orgNameAr',
    },
  },

    // === 👥 مجلس الإدارة ===
  board: {
    header: {
      eyebrowKey: 'board.eyebrow',      // ← مجرد مفتاح
      titleKey: 'board.title',          // ← مجرد مفتاح
      descriptionKey: 'board.description',
    },
    labels: {
      year: 'board.year',
      period: 'board.period',
      president: 'board.president',
      vicePresident: 'board.vicePresident',
      secretary: 'board.secretary',
      treasurer: 'board.treasurer',
      members: 'board.members',
      noImages: 'board.noImages',
      // ✅ هذه أيضاً مجرد مفاتيح تشير لـ i18n
      emptyList: 'board.emptyList',
      emptyListAdmin: 'board.emptyListAdmin', 
      emptyListUser: 'board.emptyListUser',
    },
    actions: {
      addNew: 'board.actions.addNew',
      edit: 'board.actions.edit',
      delete: 'board.actions.delete',
      save: 'board.actions.save',
      cancel: 'board.actions.cancel',
      addImage: 'board.actions.addImage',
    },
    placeholders: {
      members: 'board.placeholders.members',
    },
  },

    pageContent: {
    // صفحة مجلس الإدارة
    boardOfDirectors: {
      header: {
        // القيم الافتراضية (تظهر إذا لم يعدلها المستخدم)
        defaults: {
          eyebrow: { ar: 'السجل التاريخي', en: 'Historical Record' },
          title: { ar: 'مجلس الإدارة', en: 'Board of Directors' },
          description: { 
            ar: 'جمعية العلوم الاقتصادية السورية - توثيق مسيرة العطاء والخبرات الأكاديمية.',
            en: 'Syrian Economic Sciences Association - Documenting a journey of giving and academic expertise.'
          },
        },
        // مفاتيح الترجمة البديلة (إذا أردت استخدام i18n فقط)
        keys: {
          eyebrow: 'board.eyebrow',
          title: 'board.title',
          description: 'board.description',
        },
      },
    },
    conditions: {
      header: {
        // القيم الافتراضية (تظهر إذا لم يعدلها المستخدم)
        defaults: {
          eyebrow: { ar: 'السجل التاريخي', en: 'Historical Record' },
          title: { ar: 'مجلس الإدارة', en: 'Board of Directors' },
          description: { 
            ar: 'جمعية العلوم الاقتصادية السورية - توثيق مسيرة العطاء والخبرات الأكاديمية.',
            en: 'Syrian Economic Sciences Association - Documenting a journey of giving and academic expertise.'
          },
        },
        // مفاتيح الترجمة البديلة (إذا أردت استخدام i18n فقط)
        keys: {
          eyebrow: 'board.eyebrow',
          title: 'board.title',
          description: 'board.description',
        },
      },
    },

    // صفحة الأخبار
    news: {
      header: {
        defaults: {
          eyebrow: { ar: 'آخر المستجدات', en: 'Latest Updates' },
          title: { ar: 'الأخبار', en: 'News' },
          description: {
            ar: 'تابع أحدث الأخبار والفعاليات المتعلقة بالعلوم الاقتصادية',
            en: 'Follow the latest news and events related to economic sciences'
          },
        },
        keys: {
          eyebrow: 'news.eyebrow',
          title: 'news.title',
          description: 'news.description',
        },
      },
      mainTypes: [
        { id: 'news', label: { ar: 'خبر', en: 'News' }, editable: true },
        { id: 'event', label: { ar: 'فعالية', en: 'Event' }, editable: true },
        { id: 'article', label: { ar: 'مقال', en: 'Article' }, editable: true },
        { id: 'report', label: { ar: 'تقرير', en: 'Report' }, editable: true },
      ],
      // الأنواع الفرعية لكل نوع رئيسي
      subTypes: {
        news: [
          { id: 'announcement', label: { ar: 'إعلان', en: 'Announcement' }, editable: true },
          { id: 'initiative', label: { ar: 'مبادرة', en: 'Initiative' }, editable: true },
          { id: 'partnership', label: { ar: 'شراكة', en: 'Partnership' }, editable: true },
          { id: 'award', label: { ar: 'جائزة', en: 'Award' }, editable: true },
        ],
        event: [
          { id: 'workshop', label: { ar: 'ورشة عمل', en: 'Workshop' }, editable: true },
          { id: 'conference', label: { ar: 'مؤتمر', en: 'Conference' }, editable: true },
          { id: 'seminar', label: { ar: 'ندوة', en: 'Seminar' }, editable: true },
          { id: 'webinar', label: { ar: 'ندوة أونلاين', en: 'Webinar' }, editable: true },
        ],
        article: [
          { id: 'opinion', label: { ar: 'رأي', en: 'Opinion' }, editable: true },
          { id: 'analysis', label: { ar: 'تحليل', en: 'Analysis' }, editable: true },
          { id: 'review', label: { ar: 'مراجعة', en: 'Review' }, editable: true },
        ],
        report: [
          { id: 'annual', label: { ar: 'سنوي', en: 'Annual' }, editable: true },
          { id: 'research', label: { ar: 'بحثي', en: 'Research' }, editable: true },
          { id: 'statistical', label: { ar: 'إحصائي', en: 'Statistical' }, editable: true },
        ],
      },
      // السماح بإضافة أنواع مخصصة
      allowCustomTypes: true,
      customMainTypesKey: 'customNewsMainTypes',
      customSubTypesKey: 'customNewsSubTypes',
    },

    // صفحة المحاضرات
    lectures: {
      header: {
        defaults: {
          eyebrow: { ar: 'المكتبة العلمية', en: 'Scientific Library' },
          title: { ar: 'المحاضرات', en: 'Lectures' },
          description: {
            ar: 'مجموعة من المحاضرات العلمية المتخصصة في المجال الاقتصادي',
            en: 'A collection of specialized scientific lectures in the economic field'
          },
        },
        keys: {
          eyebrow: 'lectures.eyebrow',
          title: 'lectures.title',
          description: 'lectures.description',
        },
      },
            mainCategories: [
        { id: 'macro', label: { ar: 'اقتصاد كلي', en: 'Macroeconomics' }, editable: true },
        { id: 'micro', label: { ar: 'اقتصاد جزئي', en: 'Microeconomics' }, editable: true },
        { id: 'finance', label: { ar: 'مالية', en: 'Finance' }, editable: true },
        { id: 'trade', label: { ar: 'تجارة دولية', en: 'International Trade' }, editable: true },
        { id: 'development', label: { ar: 'تنمية', en: 'Development' }, editable: true },
        { id: 'research', label: { ar: 'أبحاث علمية', en: 'Scientific Research' }, editable: true },
      ],
      // السماح بإضافة أنواع مخصصة
      allowCustomCategories: true,
      // تخزين الأنواع المخصصة محلياً (أو يمكن ربطها بـ API)
      customCategoriesKey: 'customLectureCategories',
    },

    // صفحة من نحن
    about: {
      header: {
        defaults: {
          eyebrow: { ar: 'تعرف علينا', en: 'About Us' },
          title: { ar: 'حول الجمعية', en: 'About the Association' },
          description: {
            ar: 'نبذة عن جمعية العلوم الاقتصادية السورية وأهدافها ورسالتها',
            en: 'About Syrian Economic Sciences Association, its goals and mission'
          },
        },
        keys: {
          eyebrow: 'about.eyebrow',
          title: 'about.title',
          description: 'about.description',
        },
      },
    },
  },
  // === إعدادات اللغة ===
  languages: {
    supported: ['ar', 'en'],
    default: 'ar',
    labels: {
      ar: { name: 'العربية', code: 'AR' },
      en: { name: 'English', code: 'EN' },
    },
  },

  // === إعدادات السمة (Theme) ===
  themeSettings: {
    defaultMode: 'light', // 'light' | 'dark' | 'system'
    allowToggle: true,
    storageKey: 'ses-theme-preference',
  },
};

export default SITE_CONFIG;