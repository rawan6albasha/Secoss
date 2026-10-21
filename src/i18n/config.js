// src/i18n/config.js - إعدادات i18n المركزية
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// === قاموس الترجمات المركزي ===
export const TRANSLATIONS = {
  ar: {
    profile:{
      completion: 'اكتمال ملفك الشخصي',
      likes: 'إعجابات',
      posts: 'منشورات',
      followers: 'متابعون',
      views: 'مشاهدات',
      adminReview: 'مراجعات',
      published: 'منشور',
      pending: 'قيد الانتظار',
      specialization: 'التخصص',
      work: 'العمل',
      certificates: 'الشهادات',
      addCertificate: 'إضافة شهادات',
      complete: 'اكمل ملفك الشخصي',
      academicLinks: 'روابط أكاديمية',
         academicInfo: 'المعلومات الأكاديمية',
         addLink: 'إضافة رابط',

    },
    settings: {
      subtitle: 'إدارة إعدادات الحساب',
      email: 'البريد الإلكتروني',
      emailReadonly: 'البريد الإلكتروني (غير قابل للتعديل)',
      phone: 'رقم الهاتف',
      emailNotifications: 'الإشعارات عبر البريد الإلكتروني',
      language: 'اللغة',
      title: 'الإعدادات',
      general: 'عام',
      profile: 'الملف الشخصي',
      notifications: 'الإشعارات',
      privacy: 'الخصوصية',
      security: 'الأمان',
   
    },
    // عام
    common: {
      share: 'مشاركة',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      success: 'تم بنجاح',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      reply: 'رد',
      send: 'إرسال',
        clear: 'مسح',
  search: 'بحث',
  select: 'اختر',
  noResults: 'لا توجد نتائج',
  loading: 'جاري التحميل...',
  error: 'حدث خطأ',
  success: 'تم بنجاح',
  cancel: 'إلغاء',
  confirm: 'تأكيد',
  delete: 'حذف',
  edit: 'تعديل',
  view: 'عرض',
  close: 'إغلاق',
  back: 'عودة',
  next: 'التالي',
  previous: 'السابق',
  bio: 'السيرة الذاتية',
       // ... existing translations
  uploadImage: 'تحميل صورة',
  uploadSuccess: '✅ تم التحميل بنجاح!',
  uploadError: '❌  فشل التحميل',
  maxSize: 'الحد الأقصى للحجم : {{size}}MB',
  errors: {
    invalidImage: 'يرجى اختيار ملف صورة صالح',
    imageTooLarge: 'يجب أن يكون حجم الصورة أقل من  {{size}}MB',
    uploadFailed: 'فشل تحميل الصورة، يرجى المحاولة مرة أخرى',
    clear: 'مسح',
  },
    add: 'إضافة',
  deleteType: '🗑️ حذف النوع',
    },
    
    // تعليقات
    comments: {
      title: 'المناقشات الأكاديمية',
      noComments: 'كن أول من يعلق!',
      noCommentsDesc: 'شارك برأيك العلمي حول هذا المنشور',
      disabled: '🔕 تم إيقاف التعليقات على هذا المنشور',
      closed: '🔒 التعليقات مغلقة حالياً على هذا المنشور',
      loginToComment: '💬 للمشاركة في النقاش العلمي، يرجى تسجيل الدخول',
      login: 'تسجيل الدخول',
      confirmDelete: 'هل أنت متأكد من حذف هذا التعليق؟',
      you: 'أنت',

  placeholder: 'اكتب تعليقاً...',
  replyPlaceholder: 'اكتب ردك...',
  editPlaceholder: 'عدّل تعليقك...',
  publish: 'نشر',
  send: 'إرسال',
  reply: 'رد',
  like: 'إعجاب',
  edited: '(معدّل)',  
  // === رسائل ===
  login: 'تسجيل الدخول',
  noComments: 'كن أول من يعلق!',
  noCommentsDesc: 'شارك برأيك العلمي حول هذا المنشور',
  confirmDelete: 'هل أنت متأكد من حذف هذا التعليق؟',
  reported: '✅ تم إرسال البلاغ، شكرًا لمساهمتك',
  noPermission: 'ليس لديك صلاحية لإضافة تعليقات',
  moreOptions: 'خيارات إضافية',
  
  // === مؤشر الترجمة (للهجين) ===
  hasTranslation: 'متوفر بـ {lang}',
  viewReplies: 'عرض الردود',
  
  // === أزرار التحكم ===
  enable: 'تفعيل التعليقات',
  disable: 'إيقاف التعليقات',
    },
    lectures: {
  // === الهيدر ===
  eyebrow: 'المكتبة الرقمية',
  title: 'المحاضرات العلمية',
  description: 'مجموعة من المحاضرات المتخصصة في المجال الاقتصادي',
  
  // === الفلاتر والبحث ===
  searchPlaceholder: 'ابحث عن عنوان المحاضرة...',
  filterBySpeaker: 'المحاضر',
  filterByYear: 'السنة',
  filterByCategory: 'التصنيف الرئيسي',
  filterBySubCategory: 'التصنيف الفرعي',
  clearFilters: 'مسح الفلاتر',
  addNew: 'إضافة محاضرة جديدة',
  
  // === النتائج ===
  lecturesAvailable: 'محاضرة متاحة',
  lecturesAvailable_plural: 'محاضرة متاحة',
  resultsFound: 'نتائج البحث',
  noResults: 'عذراً، لم يتم العثور على محاضرات تطابق بحثك.',
  
  // === البطاقة ===
  pdfAttachment: 'ملف PDF',
  noSummary: 'لا يوجد ملخص متاح',
  viewDetails: 'عرض التفاصيل',
  bookmark: 'حفظ للمفضلة',
  unbookmark: 'إزالة من المفضلة',
  
  // === الإحصائيات ===
  likes: 'إعجاب',
  comments: 'تعليق',
  views: 'مشاهدة',
},

lecture: {
  content: 'المحتوى',
  summary: 'الملخص',
  title: 'عنوان المحاضرة',
  tags: 'الوسوم',
  addTag: 'أضف الوسوم',
  mainCategory: 'التصنيف الرئيسي',
  subCategory: 'التصنيف الفرعي',
  subCategoryPlaceholder: 'التصنيف الفرعي',
  attachment: 'المرفقات',
  hybridNote:"اضف ملاحظة",
  submitForReview: 'إرسال للمراجعة',
  createLecture: 'إنشاء محاضرة',
    selectCategory: 'اختر التصنيف',
  addCustomCategory: '✨ إضافة تصنيف مخصص',
  customCategoryLabel: 'اسم التصنيف الجديد',
  deleteType: 'حذف هذا النوع',
  // === حالة المحاضرة ===
  statusApproved: 'منشور',
  statusPending: 'قيد المراجعة',
  statusRejected: 'مرفوض',
  
  // === المحتوى ===
  pdfAttachment: 'ملف PDF',
  downloadPDF: 'تحميل الملف',
  viewImage: 'عرض الصورة',
  
  // === الإجراءات ===
  approve: 'قبول ونشر',
  reject: 'رفض',
  delete: 'حذف',
  edit: 'تعديل',
  confirmDelete: 'هل أنت متأكد من حذف هذه المحاضرة نهائياً؟',
  rejectReason: 'سبب الرفض',
  
  // === رسائل ===
  approved: '✅ تم قبول المحاضرة ونشرها',
  rejected: '❌ تم رفض المحاضرة',
  deleted: '✅ تم حذف المحاضرة',
},

post: {
  // === عرض المحتوى ===
  published:'تم النشر',
  write: 'كتابة',
  preview: 'معاينة',
  optional: 'اختياري',
  showMore: 'عرض المزيد',
  showLess: 'عرض أقل',
  pdfFile: 'ملف PDF',
  newPost: 'منشور جديد',
  
  // === التفاعل ===
  like: 'إعجاب',
  comment: 'تعليق',
  comments: 'تعليقات',
  views: 'مشاهدة',
  save: 'حفظ',
  share: 'مشاركة',
  download: 'تحميل',
  print: 'طباعة',
  report: 'الإبلاغ',
  
  // === رسائل ===
  loginToLike: 'يرجى تسجيل الدخول للإعجاب',
  linkCopied: '✅ تم نسخ الرابط!',
  copyFailed: '❌ فشل نسخ الرابط',
  confirmDelete: 'هل أنت متأكد من حذف هذا المنشور نهائياً؟',
  rejectReason: '⚠️ سبب الرفض',
  dataNotAvailable: 'بيانات المنشور غير متاحة',
  moreOptions: 'خيارات إضافية',
  reported: '✅ تم إرسال البلاغ، شكرًا لمساهمتك',
  
  // === مؤشر الترجمة (للهجين) ===
  hasTranslation: 'متوفر ترجمة للغة الأخرى',
  availableIn: 'متوفر بـ {lang}',
  translationAvailable: '💡 هذا المحتوى متاح أيضاً بـ {lang}',
},
    status: {
  approved: 'منشور',
  pending: 'قيد المراجعة',
  rejected: 'مرفوض',
},
    // صلاحيات
    permissions: {
      noAccess: 'ليس لديك صلاحية للوصول',
      loginRequired: 'يرجى تسجيل الدخول للمتابعة',
    },
    
    // أوقات
    time: {
      now: 'الآن',
      minutesAgo: 'منذ {{count}} دقيقة',
      hoursAgo: 'منذ {{count}} ساعة',
      daysAgo: 'منذ {{count}} يوم',
    },
    nav: {
  home: 'الرئيسية',
  lecturers: 'المحاضرون',
  board: 'مجلس الإدارة',
  about: 'حول',
  news: 'الأخبار',
  lectures: 'المحاضرات',
  conditions: 'شروط العضوية',
  profile: 'بروفايلي',
  logout: 'تسجيل خروج',
  login: 'دخول',
  join: 'انضم إلينا',
  toggleLanguage: 'تبديل اللغة',
  toggleMenu: 'القائمة',
  orgNameAr: 'جمعية العلوم الاقتصادية',
  orgNameEn: 'Syrian Economic Sciences',
    darkMode:'الوضع الداكن',
  lightMode:'الوضع الفاتح',
},
lecturers: {
  eyebrow: 'الهيئة الأكاديمية',
  title: 'تعرّف على محاضرينا',
  description: 'اكتشف الخبرات الأكاديمية واستعرض المحاضرات المتخصصة لكل محاضر.',
  count: 'محاضرون',
  publishedLectures: 'محاضرة منشورة',
  sectionTitle: 'المحاضرون',
  sectionDescription: 'اختر محاضرًا لعرض محاضراته',
  lecture: 'محاضرة',
  lectures: 'محاضرات',
  viewLectures: 'عرض المحاضرات',
  noResults: 'لم يتم العثور على محاضر بهذا الاسم.',
},
footer: {

  about: {
    title: 'عن الجمعية',
    content: 'منصة علمية متخصصة لنشر المعرفة الاقتصادية وتطوير الكوادر الأكاديمية في سوريا والمنطقة العربية.',
  },
  quickLinks: {
    title: 'روابط سريعة',
  },
  contact: {
    title: 'تواصل معنا',
    location: 'سوريا، دمشق',
  },
  newsletter: {
    title: 'النشرة البريدية',
    description: 'اشترك لتصلك أحدث الأخبار والمحاضرات',
    placeholder: 'أدخل بريدك الإلكتروني',
    button: 'اشترك الآن',
    success: '✅ تم الاشتراك بنجاح!',
  },
  copyright: '© {{year}} {{org}}. جميع الحقوق محفوظة.',
  followUs:"تابعنا",
  privacy:"الخصوصية",
  terms:"الشروط",
},

    board: {
      // الهيدر
      eyebrow: 'السجل التاريخي',
      title: 'مجلس الإدارة',
      description: 'جمعية العلوم الاقتصادية السورية - توثيق مسيرة العطاء والخبرات الأكاديمية.',
      
      // التسميات
      year: 'السنة',
      period: 'الفترة',
      president: 'الرئيس',
      vicePresident: 'نائب الرئيس',
      secretary: 'أمين السر',
      treasurer: 'أمين الصندوق',
      members: 'أعضاء مجلس الإدارة',
      noImages: 'لا توجد صور توثيقية',
      
      // ✅ حالات القائمة الفارغة (هنا القيم الفعلية)
      emptyList: 'لا توجد مجالس مسجلة حالياً',
      emptyListAdmin: 'اضغط على "إضافة مجلس جديد" للبدء',
      emptyListUser: 'سيتم عرض المجالس هنا عند إضافتها من قبل الإدارة',
      
      // الإجراءات
      actions: {
        addNew: 'إضافة مجلس جديد',
        edit: 'تعديل',
        delete: 'حذف',
        save: 'حفظ التعديلات',
        cancel: 'إلغاء',
        addImage: 'أضف صورة',
      },
      
      // النصوص البديلة
      placeholders: {
        members: 'أدخل أسماء الأعضاء مفصولة بفاصلة (،)',
      },
    },

    localizedInput: {
  // === نصوص الأزرار والعناوين ===
  addEnglish: 'إضافة النص بالإنجليزية',
  hideEnglish: 'إخفاء الإنجليزية',
  addArabic: 'إضافة النص بالعربية',
  hideArabic: 'إخفاء العربية',
  arabic: 'العربية',
  english: 'English',
  add: 'إضافة',
  delete: 'حذف',
  reorder: 'إعادة ترتيب',
  moveUp: 'تحريك للأعلى',
  moveDown: 'تحريك للأسفل',
  empty: '---',
  noItems: 'لا توجد عناصر',
   clickToEdit: '👆 انقر للتعديل',
  editingItem: 'تعديل العنصر',
  save: 'حفظ',
  cancel: 'إلغاء',
  editNote: '💡 اترك أي حقل فارغاً ليظهر النص من اللغة الأخرى',
  
  // === ملاحظات مساعدة ===
  note: '💡 اترك الحقل فارغاً ليظهر النص من اللغة الأخرى تلقائياً',
  required: 'هذا الحقل مطلوب',
  
  // === عناصر المصفوفات ===
  item: 'عنصر',
  items: 'عناصر',

    clickToEditOther: 'انقر لإضافة/تعديل النص',
  emptyOther: 'انقر لإضافة النص بالإنجليزية...',
  addOther: 'إضافة',
  editOther: 'تعديل',
},

about: {
  // === الهيدر ===
  eyebrow: 'تعرف علينا',
  title: 'حول الجمعية',
  description: 'نبذة عن جمعية العلوم الاقتصادية السورية وأهدافها ورسالتها',
  
  // === أزرار وأفعال الهيدر ===
  editHeader: 'تعديل محتوى الهيدر',
  editHeaderTitle: '✏️ تعديل الهيدر',
  save: 'حفظ',
  cancel: 'إلغاء',
  
  // === حقول الهيدر ===
  eyebrowField: 'العنوان الصغير',
  titleField: 'العنوان الرئيسي',
  descriptionField: 'الوصف',
  descriptionPlaceholder: {
    ar: 'أدخل الوصف بالعربية',
    en: 'Enter description in English'
  },
  
  // === الأقسام (الفقاعات) ===
  editSection: '✏️ تحرير القسم',
  sectionTitle: 'عنوان القسم',
  sectionTitlePlaceholder: {
    ar: 'أدخل العنوان',
    en: 'Enter title'
  },
  contentItems: 'نقاط المحتوى',
  contentItemPlaceholder: {
    ar: 'أدخل نقطة محتوى',

  },
  displayType: 'نوع العرض',
  displayTypes: {
    bullet: '• قائمة نقطية',
    number: '1. قائمة مرقمة',
    paragraph: 'فقرة نصية'
  },
  saveChanges: 'حفظ التغييرات',
  
  // === أزرار المشرف ===
  addBubble: 'إضافة فقاعة محتوى',
 
  // === رسائل ===
  noSections: 'لا توجد أقسام لعرضها',
  deleteSection: 'حذف هذا القسم',
  deleteConfirm: 'هل أنت متأكد من حذف هذا القسم؟',
},
conditions: {
  // === الهيدر ===
  eyebrow: 'دليل الانتساب',
  title: 'شروط العضوية',
  description: 'تعرف على الشروط والإجراءات اللازمة للانضمام إلى جمعية العلوم الاقتصادية السورية',
  
  // === الكاروسيل ===
  carouselTitle: 'وثائق الانتساب',
  uploadLabel: 'رفع صورة',
  deleteImage: 'حذف الصورة',
  noImages: 'لا توجد صور لعرضها',
  
  // === المواد القانونية ===
  addArticle: 'إضافة مادة قانونية جديدة',
  editArticle: '✏️ تعديل المادة',
  articleTitle: 'عنوان المادة',
  articleContent: 'محتوى المادة',
  articleTitlePlaceholder: {
    ar: 'أدخل عنوان المادة',
    en: 'Enter article title'
  },
  articleContentPlaceholder: {
    ar: 'أدخل محتوى المادة (كل سطر فقرة جديدة)',
    en: 'Enter article content (each line is a new paragraph)'
  },
  displayType: 'نوع العرض',
  displayTypes: {
    bullet: '• قائمة نقطية',
    number: '1. قائمة مرقمة',
    paragraph: 'فقرة نصية'
  },
  
  // === أزرار وأفعال ===
  save: 'حفظ',
  cancel: 'إلغاء',
  delete: 'حذف',
  deleteConfirm: 'هل أنت متأكد من حذف هذه المادة؟',
  
  // === رسائل ===
  noArticles: 'لا توجد مواد لعرضها',
  addFirst: 'ابدأ بإضافة أول مادة قانونية',
},
breadcrumbs: {
  label: 'مسار التنقل',
  home: 'الرئيسية',
  lectures: 'المحاضرات',
  lectureDetail: 'تفاصيل المحاضرة',
  news: 'الأخبار',
  newsDetail: 'تفاصيل الخبر',
  conditions: 'شروط العضوية',
  board: 'مجلس الإدارة',
  about: 'حول',
  lecturers: 'المحاضرون',
  login: 'تسجيل الدخول',
  profile: 'الملف الشخصي',
},
carousel: {
  label: 'شريط الصور',
  noImages: 'لا توجد صور لعرضها',
  slideLabel: 'شريحة {{current}} من {{total}}',
  prev: 'السابق',
  next: 'التالي',
  goToSlide: 'انتقل إلى الشريحة {{number}}',
},
sectionHeader: {
  // === أزرار وأفعال ===
  editButton: 'تعديل',
  editLabel: 'تعديل محتوى الهيدر',
  editTooltip: 'المحتوى مُعدّل - اضغط للتعديل',
  editingTitle: '✏️ تعديل الهيدر',
  save: 'حفظ',
  cancel: 'إلغاء',
  
  // === حقول التحرير ===
  eyebrowField: 'العنوان الصغير',
  titleField: 'العنوان الرئيسي',
  descriptionField: 'الوصف',
  eyebrowPlaceholder: {
    ar: 'مثال: من نحن',
    en: 'Example: About Us'
  },
  titlePlaceholder: {
    ar: 'أدخل العنوان الرئيسي',
    en: 'Enter main title'
  },
  descriptionPlaceholder: {
    ar: 'أدخل وصف الصفحة',
    en: 'Enter page description'
  },
  
  // === ملاحظات ===
  editNote: '💡 اترك أي حقل فارغاً ليظهر النص من اللغة الأخرى تلقائياً',
  contentEdited: 'تم تعديل هذا المحتوى',
  
  // === رسائل ===
  saveSuccess: '✅ تم حفظ التغييرات بنجاح',
  saveError: '❌ حدث خطأ أثناء الحفظ',
},
login: {
  welcomeTitle: 'مرحباً بك',
  welcomeSubtitle: 'سجل دخولك للمتابعة',
  email: 'البريد الإلكتروني',
  emailPlaceholder: 'email@example.com',
  password: 'كلمة المرور',
  passwordPlaceholder: '********',
  showPassword: 'إظهار كلمة المرور',
  hidePassword: 'إخفاء كلمة المرور',
  loading: 'جاري الدخول...',
  submit: 'دخول للحساب',
  devOptions: 'خيارات المطور',
  tip: 'تلميح',
  noAccount: 'ليس لديك حساب؟',
  registerLink: 'انضم إلينا',
  errors: {
    invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    required: 'هذا الحقل مطلوب',
  },
},
register: {
  title: 'إنشاء حساب جديد',
  subtitle: 'انضم إلى مجتمعنا العلمي',
  fullName: 'الاسم الكامل',
  namePlaceholder: 'مثال: سارة أحمد',
  confirmPassword: 'تأكيد كلمة المرور',
  confirmPasswordPlaceholder: '********',
  agreeTerms: 'أوافق على',
  terms: 'شروط الاستخدام',
  privacy: 'سياسة الخصوصية',
  and: 'و',
  loading: 'جاري إنشاء الحساب...',
  submit: 'تأكيد التسجيل',
  hasAccount: 'لديك حساب بالفعل؟',
  loginLink: 'سجل دخولك',
  devTip: '💡 للتجربة السريعة: استخدم خيارات المطور في صفحة الدخول',
  errors: {
    passwordMismatch: '⚠️ كلمات المرور غير متطابقة',
    passwordTooShort: '⚠️ كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    nameRequired: '⚠️ يرجى إدخال الاسم الكامل',
    termsRequired: '⚠️ يجب الموافقة على شروط الاستخدام',
    emailExists: 'هذا البريد الإلكتروني مسجل مسبقاً',
  },
},
news: {
  share:'مشاركة',
    filterType: 'نوع الخبر',
  filterYear: 'السنة',
  selectType: 'اختر النوع',
  selectYear: 'اختر السنة',
  resultsFound: 'نتيجة',
  resultsFound_plural: 'نتائج',
  noResults: 'عذراً، لا توجد أخبار تطابق بحثك',
  clearFilters: 'مسح الفلاتر',
  // === الهيدر ===
  eyebrow: 'أخبار الجمعية',
  title: 'الأخبار',
  description: 'آخر الأخبار والفعاليات',
  
  // === الأزرار ===
  publishNew: 'انشر خبر جديد',
  editNews: '✏️ تعديل الخبر',
  publish: 'نشر',
  
  // === الفلاتر ===
  filterType: 'نوع الخبر',
  filterYear: 'السنة',
  searchPlaceholder: 'ابحث في الأخبار...',
  
  // === الحقول ===
  title: 'عنوان الخبر',
  titlePlaceholder: { ar: 'أدخل عنوان الخبر', en: 'Enter news title' },
  description: 'الوصف المختصر',
  descriptionPlaceholder: { ar: 'ملخص سريع للخبر', en: 'Brief summary' },
  content: 'المحتوى الكامل',
  contentPlaceholder: { ar: 'اكتب محتوى الخبر الكامل', en: 'Write full content' },
  type: 'نوع الخبر',
  typePlaceholder: 'مثال: فعالية، إعلان، خبر',
  year: 'السنة',
  image: 'صورة الخبر',
  uploadImage: 'رفع صورة',
  
  // === النظام الهجين ===
  hybridNote: '💡 يمكنك كتابة الخبر بلغة واحدة أو لغتين. يمكن إضافة الترجمة لاحقاً من خلال التعديل.',
  
  // === الرسائل ===
  errorTitleRequired: 'العنوان مطلوب (بالعربية أو الإنجليزية)',
  updated: '✅ تم تحديث الخبر بنجاح',
  published: '✅ تم نشر الخبر بنجاح',
  error: 'حدث خطأ، حاول مرة أخرى',
  notFound: 'لم يتم العثور على هذا الخبر',
  shareNote: 'شارك هذا الخبر مع زملائك',
  
  // === الحالات ===
  loading: 'جاري تحميل الأخبار...',
    mainType: 'النوع الرئيسي',
  subType: 'النوع الفرعي',
  selectMainType: 'اختر النوع الرئيسي',
  selectSubType: 'اختر النوع الفرعي',
  addCustomType: '✨ إضافة نوع مخصص',
  addCustomSubType: '✨ إضافة نوع فرعي مخصص',
  customMainType: 'اسم النوع الرئيسي الجديد',
  customSubType: 'اسم النوع الفرعي الجديد',
  preview: 'معاينة الخبر',
  previewNote: 'هذه معاينة تقريبية. قد يختلف الشكل النهائي قليلاً عند النشر.',
  noTitle: 'بدون عنوان',
  searchInContent: 'ابحث في المحتوى أيضاً',
    selectMainType: 'اختر النوع الرئيسي',
  selectSubType: 'اختر النوع الفرعي',
  addCustomType: '✨ إضافة نوع رئيسي مخصص',
  addCustomSubType: '✨ إضافة نوع فرعي مخصص',
  customMainTypeLabel: 'اسم النوع الرئيسي الجديد',
  customSubTypeLabel: 'اسم النوع الفرعي الجديد',
},
  },
  
  en: {
    profile:{
      completion: 'Complete your profile',
      likes: 'Likes',
      posts: 'Posts',
      followers: 'Followers',
      views: 'Views',
      adminReview: 'Admin Reviews',
      published: 'Published',
      pending: 'Pending',
      specialization: 'Specialization',
      work: 'Work',
      certificates: 'Certificates',
      addCertificate: 'Add Certificates',
      complete: 'Complete your profile',
      academicLinks: 'Academic Links',
      academicInfo: 'Academic Information',
       addLink: 'Add Link',
      
    },
    settings: {
      subtitle: 'Manage account settings',
      email: 'Email Address',
      emailReadonly: 'Email Address (Read-only)',
      phone: 'Phone Number',
      emailNotifications: 'Email Notifications',
      language: 'Language',
      title: 'Settings',
      general: 'General',
      profile: 'Profile',
      notifications: 'Notifications',
      privacy: 'Privacy',
      security: 'Security',
    },
    news: {
  share:'Share',
  eyebrow: 'Association News',
  title: 'News',
  description: 'Latest news and events',
  publishNew: 'Publish News',
  editNews: '✏️ Edit News',
  publish: 'Publish',
  filterType: 'News Type',
  filterYear: 'Year',
  searchPlaceholder: 'Search news...',
  title: 'News Title',
  titlePlaceholder: { ar: 'أدخل عنوان الخبر', en: 'Enter news title' },
  description: 'Brief Description',
  descriptionPlaceholder: { ar: 'ملخص سريع للخبر', en: 'Brief summary' },
  content: 'Full Content',
  contentPlaceholder: { ar: 'اكتب محتوى الخبر الكامل', en: 'Write full content' },
  type: 'Type',
  typePlaceholder: 'e.g., Event, Announcement, News',
  year: 'Year',
  image: 'News Image',
  uploadImage: 'Upload Image',
  hybridNote: '💡 You can write the news in one language or both. Translation can be added later via editing.',
  errorTitleRequired: 'Title is required (Arabic or English)',
  updated: '✅ News updated successfully',
  published: '✅ News published successfully',
  error: 'An error occurred, please try again',
  notFound: 'News not found',
  shareNote: 'Share this news with your colleagues',
  loading: 'Loading news...',
    mainType: 'Main Type',
  subType: 'Sub-Type',
  selectMainType: 'Select main type',
  selectSubType: 'Select sub-type',
  addCustomType: '✨ Add custom type',
  addCustomSubType: '✨ Add custom sub-type',
  customMainType: 'New main type name',
  customSubType: 'New sub-type name',
  preview: 'Preview news',
  previewNote: 'This is an approximate preview. Final appearance may vary slightly.',
  noTitle: 'No title',
  searchInContent: 'Search in content too',
  selectType: 'Select type',
  selectYear: 'Select year',
  clearFilters: 'Clear filters',
},
    login: {
  welcomeTitle: 'Welcome Back',
  welcomeSubtitle: 'Sign in to continue',
  email: 'Email Address',
  emailPlaceholder: 'email@example.com',
  password: 'Password',
  passwordPlaceholder: '********',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  loading: 'Signing in...',
  submit: 'Sign In',
  devOptions: 'Developer Options',
  tip: 'Tip',
  noAccount: "Don't have an account?",
  registerLink: 'Join Us',
  errors: {
    invalidCredentials: 'Invalid email or password',
    required: 'This field is required',
  },
},

register: {
  title: 'Create New Account',
  subtitle: 'Join our scientific community',
  fullName: 'Full Name',
  namePlaceholder: 'Example: Sara Ahmed',
  confirmPassword: 'Confirm Password',
  confirmPasswordPlaceholder: '********',
  agreeTerms: 'I agree to the',
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  and: 'and',
  loading: 'Creating account...',
  submit: 'Confirm Registration',
  hasAccount: 'Already have an account?',
  loginLink: 'Sign In',
  devTip: '💡 For quick testing: Use developer options on login page',
  errors: {
    passwordMismatch: '⚠️ Passwords do not match',
    passwordTooShort: '⚠️ Password must be at least 6 characters',
    nameRequired: '⚠️ Please enter your full name',
    termsRequired: '⚠️ You must agree to the terms',
    emailExists: 'This email is already registered',
  },
},

    sectionHeader: {
  // === Actions ===
  editButton: 'Edit',
  editLabel: 'Edit header content',
  editTooltip: 'Content edited - click to modify',
  editingTitle: '✏️ Edit Header',
  save: 'Save',
  cancel: 'Cancel',
  
  // === Fields ===
  eyebrowField: 'Eyebrow Title',
  titleField: 'Main Title',
  descriptionField: 'Description',
  eyebrowPlaceholder: {
    ar: 'مثال: من نحن',
    en: 'Example: About Us'
  },
  titlePlaceholder: {
    ar: 'أدخل العنوان الرئيسي',
    en: 'Enter main title'
  },
  descriptionPlaceholder: {
    ar: 'أدخل وصف الصفحة',
    en: 'Enter page description'
  },
  
  // === Notes ===
  editNote: '💡 Leave any field empty to fallback to the other language',
  contentEdited: 'This content has been edited',
  
  // === Messages ===
  saveSuccess: '✅ Changes saved successfully',
  saveError: '❌ Error saving changes',
},

    carousel: {
  label: 'Image Carousel',
  noImages: 'No images to display',
  slideLabel: 'Slide {{current}} of {{total}}',
  prev: 'Previous',
  next: 'Next',
  goToSlide: 'Go to slide {{number}}',
},
    // عام
    common: {
      share: 'Share',
      add:'add',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      reply: 'Reply',
      send: 'Send',
        uploadImage: 'Upload Image',
  uploadSuccess: '✅ Uploaded successfully!',
  uploadError: '❌ Upload failed',
  maxSize: 'Max size: {{size}}MB',
  clear: 'Clear',
  search: 'Search',
  select: 'Select',
  noResults: 'No results found',
  loading: 'Loading...',
  error: 'An error occurred',
  success: 'Success',
  cancel: 'Cancel',
  confirm: 'Confirm',
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  view: 'View',
  close: 'Close',
  back: 'Back',
  next: 'Next',
  previous: 'Previous',
  bio: 'Bio',
  errors: {
    invalidImage: 'Please select a valid image file',
    imageTooLarge: 'Image size must be less than {{size}}MB',
    uploadFailed: 'Failed to upload image, please try again',}
    },
    
    // تعليقات
    comments: {
      title: 'Academic Discussions',
      noComments: 'Be the first to comment!',
      noCommentsDesc: 'Share your scientific opinion on this post',
      disabled: '🔕 Comments are disabled on this post',
      closed: '🔒 Comments are currently closed on this post',
      login: 'Login',
      confirmDelete: 'Are you sure you want to delete this comment?',
      edited: '(edited)',
      you: 'You',

  placeholder: 'Add a comment...',
  replyPlaceholder: 'Write your reply...',
  editPlaceholder: 'Edit your comment...',
  publish: 'Publish',
  send: 'Send',
  reply: 'Reply',
  like: 'Like',
  loginToComment: '💬 Please login to join the discussion',
  login: 'Login',
  reported: '✅ Report submitted, thank you',
  noPermission: 'You do not have permission to comment',
  moreOptions: 'More options',
  hasTranslation: 'Available in {lang}',
  viewReplies: 'View replies',
  enable: 'Enable comments',
},

lectures: {
  addNew: 'Add New Lecture',
  eyebrow: 'Digital Library',
  title: 'Scientific Lectures',
  description: 'A collection of specialized lectures in the economic field',
  searchPlaceholder: 'Search lecture title...',
  filterBySpeaker: 'Lecturer',
  filterByYear: 'Year',
  filterByCategory: 'Main Category',
  filterBySubCategory: 'Sub Category',
  clearFilters: 'Clear Filters',
  lecturesAvailable: 'Lecture Available',
  lecturesAvailable_plural: 'Lectures Available',
  resultsFound: 'Search Results',
  noResults: 'Sorry, no lectures match your search.',
  pdfAttachment: 'PDF File',
  noSummary: 'No summary available',
  viewDetails: 'View Details',
  bookmark: 'Save to Favorites',
  unbookmark: 'Remove from Favorites',
  likes: 'Like',
  comments: 'Comments',
  views: 'Views',
},

lecture: {
  content: 'Content',
  summary: 'summary',
  title: 'Lecture Title',
  tags: 'Tags',
  addTag: 'Add Tags',
  mainCategory: 'Main Category',
  subCategory: 'Sub Category',
  subCategoryPlaceholder: 'Sub Category',
  attachment: 'attachment',
  hybridNote:"Add a note",

  statusApproved: 'Published',
  statusPending: 'Pending Review',
  statusRejected: 'Rejected',
  pdfAttachment: 'PDF File',
  downloadPDF: 'Download File',
  viewImage: 'View Image',
  approve: 'Approve & Publish',
  reject: 'Reject',
  delete: 'Delete',
  edit: 'Edit',
  confirmDelete: 'Are you sure you want to delete this lecture permanently?',
  rejectReason: 'Reason for rejection',
  approved: '✅ Lecture approved and published',
  rejected: '❌ Lecture rejected',
  deleted: '✅ Lecture deleted',
},

post: {
  published: 'Published',
  write: 'Write',
  preview: 'Preview',
  optional: 'Optional',
  showMore: 'Show more',
  showLess: 'Show less',
  pdfFile: 'PDF File',
  like: 'Like',
  comment: 'Comment',
  comments: 'Comments',
  views: 'Views',
  save: 'Save',
  share: 'Share',
  download: 'Download',
  print: 'Print',
  report: 'Report',
  loginToLike: 'Please sign in to like',
  linkCopied: '✅ Link copied!',
  copyFailed: '❌ Failed to copy link',
  confirmDelete: 'Are you sure you want to delete this post permanently?',
  rejectReason: '⚠️ Reason for rejection',
  dataNotAvailable: 'Post data not available',
  moreOptions: 'More options',
  newPost: 'New Post',
  reported: '✅ Report submitted, thank you',
  hasTranslation: 'Translation available',
  availableIn: 'Available in {lang}',
  translationAvailable: '💡 This content is also available in {lang}',

},
status: {
  approved: 'Published',
  pending: 'Pending Review',
  rejected: 'Rejected',
},
    
    // صلاحيات
    permissions: {
      noAccess: 'You do not have permission to access this',
      loginRequired: 'Please login to continue',
    },
    
    // أوقات
    time: {
      now: 'Now',
      minutesAgo: '{{count}}m ago',
      hoursAgo: '{{count}}h ago',
      daysAgo: '{{count}}d ago',
    },
    // نافبار
nav: {
  home: 'Home',
  lecturers: 'Lecturers',
  board: 'Board of Directors',
  about: 'About',
  news: 'News',
  lectures: 'Lectures',
  conditions: 'Conditions of Affiliation',
  profile: 'My Profile',
  logout: 'Logout',
  login: 'Login',
  join: 'Join Us',
  toggleLanguage: 'Switch Language',
  toggleMenu: 'Menu',
  orgNameAr: 'جمعية العلوم الاقتصادية',
  orgNameEn: 'Syrian Economic Sciences',
  darkMode:'darkMode',
  lightMode:'lightMode',
},
lecturers: {
  eyebrow: 'Academic Faculty',
  title: 'Meet our lecturers',
  description: 'Explore our academic experts and discover the specialized lectures by each lecturer.',
  count: 'Lecturers',
  publishedLectures: 'Published lectures',
  sectionTitle: 'Lecturers',
  sectionDescription: 'Select a lecturer to view their lectures',
  lecture: 'lecture',
  lectures: 'lectures',
  viewLectures: 'View lectures',
  noResults: 'No lecturer found with this name.',
},
footer: {
  about: {
    title: 'About Us',
    content: 'A specialized scientific platform for disseminating economic knowledge and developing academic cadres in Syria and the Arab region.',
  },
  quickLinks: {
    title: 'Quick Links',
  },
  contact: {
    title: 'Contact Us',
    location: 'Syria, Damascus',
  },
  newsletter: {
    title: 'Newsletter',
    description: 'Subscribe to receive the latest news and lectures',
    placeholder: 'Enter your email',
    button: 'Subscribe',
    success: '✅ Subscribed successfully!',
  },
  copyright: '© {{year}} {{org}}. All rights reserved.',
  followUs:"Follow us",
  privacy:"privacy",
  terms:"terms",
},
    board: {
      // Header
      eyebrow: 'Historical Record',
      title: 'Board of Directors',
      description: 'Syrian Economic Sciences Association - Documenting a journey of giving and academic expertise.',
      
      // Labels
      year: 'Year',
      period: 'Period',
      president: 'President',
      vicePresident: 'Vice President',
      secretary: 'Secretary',
      treasurer: 'Treasurer',
      members: 'Board Members',
      noImages: 'No documentation images',
      
      // ✅ Empty list states (actual values here)
      emptyList: 'No boards registered yet',
      emptyListAdmin: 'Click "Add New Board" to get started',
      emptyListUser: 'Boards will appear here once added by administration',
      
      // Actions
      actions: {
        addNew: 'Add New Board',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save Changes',
        cancel: 'Cancel',
        addImage: 'Add Image',
      },
      
      // Placeholders
      placeholders: {
        members: 'Enter member names separated by comma (,)',
      },
    },
    localizedInput: {
  // === Button/label texts ===
  addEnglish: 'Add English text',
  hideEnglish: 'Hide English',
  addArabic: 'Add Arabic text',
  hideArabic: 'Hide Arabic',
  arabic: 'Arabic',
  english: 'English',
  add: 'Add',
  delete: 'Delete',
  reorder: 'Reorder',
  moveUp: 'Move up',
  moveDown: 'Move down',

  empty: '---',
  noItems: 'No items yet',
  
  // === Helper notes ===
  note: '💡 Leave empty to fallback to the other language',
  required: 'This field is required',
  
  // === Array items ===
  item: 'Item',
  items: 'Items',

    clickToEdit: '👆 Click to edit',
  editingItem: 'Editing item',
  save: 'Save',
  cancel: 'Cancel',
  editNote: '💡 Leave any field empty to fallback to the other language',
  clickToEditOther: 'Click to add/edit text',
  emptyOther: 'Click to add Arabic text...',
  addOther: 'Add',
  editOther: 'Edit',
},

about: {
  // === Header ===
  eyebrow: 'About Us',
  title: 'About the Association',
  description: 'About Syrian Economic Sciences Association, its goals and mission',
  
  // === Header actions ===
  editHeader: 'Edit header content',
  editHeaderTitle: '✏️ Edit Header',
  save: 'Save',
  cancel: 'Cancel',
  
  // === Header fields ===
  eyebrowField: 'Eyebrow Title',
  titleField: 'Main Title',
  descriptionField: 'Description',
  descriptionPlaceholder: {
    ar: 'أدخل الوصف بالعربية',
    en: 'Enter description in English'
  },
  
  // === Sections (Bubbles) ===
  editSection: '✏️ Edit Section',
  sectionTitle: 'Section Title',
  sectionTitlePlaceholder: {
    ar: 'أدخل العنوان',
    en: 'Enter title'
  },
  contentItems: 'Content Items',
  contentItemPlaceholder: {
    en: 'Enter content item'
  },
  displayType: 'Display Type',
  displayTypes: {
    bullet: '• Bulleted list',
    number: '1. Numbered list',
    paragraph: 'Text paragraph'
  },
  saveChanges: 'Save Changes',
  
  // === Admin buttons ===
  addBubble: 'Add Content Bubble',
  changeStyle: 'Change Style',
  
  // === Messages ===
  noSections: 'No sections to display',
  deleteSection: 'Delete this section',
  deleteConfirm: 'Are you sure you want to delete this section?',
},
conditions: {
  // === Header ===
  eyebrow: 'Membership Guide',
  title: 'Conditions of Affiliation',
  description: 'Learn about the requirements and procedures for joining the Syrian Economic Sciences Association',
  
  // === Carousel ===
  carouselTitle: 'Membership Documents',
  uploadLabel: 'Upload Image',
  deleteImage: 'Delete Image',
  noImages: 'No images to display',
  
  // === Articles ===
  addArticle: 'Add New Legal Article',
  editArticle: '✏️ Edit Article',
  articleTitle: 'Article Title',
  articleContent: 'Article Content',
  articleTitlePlaceholder: {
    ar: 'أدخل عنوان المادة',
    en: 'Enter article title'
  },
  articleContentPlaceholder: {
    ar: 'أدخل محتوى المادة (كل سطر فقرة جديدة)',
    en: 'Enter article content (each line is a new paragraph)'
  },
  displayType: 'Display Type',
  displayTypes: {
    bullet: '• Bulleted list',
    number: '1. Numbered list',
    paragraph: 'Text paragraph'
  },
  
  // === Actions ===
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  deleteConfirm: 'Are you sure you want to delete this article?',
  
  // === Messages ===
  noArticles: 'No articles to display',
  addFirst: 'Start by adding your first legal article',
},
breadcrumbs: {
  label: 'Breadcrumb',
  home: 'Home',
  lectures: 'Lectures',
  lectureDetail: 'Lecture Details',
  news: 'News',
  newsDetail: 'News Details',
  conditions: 'Conditions',
  board: 'Board',
  about: 'About',
  lecturers: 'Lecturers',
  login: 'Login',
  profile: 'Profile',
},
    
  },
};

// === تهيئة i18n ===
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: TRANSLATIONS.ar },
      en: { translation: TRANSLATIONS.en },
    },
    fallbackLng: 'en',
    supportedLngs: ['ar', 'en'],
    lng: localStorage.getItem('i18nextLng') || 'ar',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: false,
    },
  });

// === دالة مساعدة لتغيير اللغة ===
export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem('i18nextLng', lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
};

export default i18n;