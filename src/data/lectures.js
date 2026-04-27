// src/data/lectures.js
// ✅ جميع المنشورات مترابطة مع المستخدمين عبر authorId

export const lectures = [
  // === منشورات د. أحمد (الأدمن) - متنوعة الحالات ===
  
  // ✅ مقبول - محاضرة
  {
    id: 'lec-001',
    authorId: 'admin-001',
    speaker: 'د. أحمد محمد الخليل',
    title: 'تأثير السياسات النقدية على التضخم في الاقتصادات الناشئة',
    summary: 'تحليل شامل لآليات تأثير السياسات النقدية على معدلات التضخم، مع دراسة حالة للاقتصاد السوري والعربي.',
    fullContent: `في هذا البحث، نستعرض الآليات النظرية والعملية التي تؤثر من خلالها السياسات النقدية على معدلات التضخم...

## المقدمة
يُعد التضخم أحد أهم التحديات التي تواجه الاقتصادات الناشئة، خاصة في ظل التقلبات العالمية...

## الإطار النظري
تعتمد البنوك المركزية على عدة أدوات للتحكم في التضخم، منها:
- أسعار الفائدة
- عمليات السوق المفتوحة
- متطلبات الاحتياطي الإلزامي

## الدراسة التطبيقية
تم تحليل بيانات 15 اقتصاداً ناشئاً خلال الفترة 2010-2023، وأظهرت النتائج أن...

## الخلاصة والتوصيات
1. ضرورة تنسيق السياسات النقدية مع المالية
2. تعزيز استقلالية البنك المركزي
3. تطوير أدوات السياسة النقدية غير التقليدية

## المراجع
- Mishkin, F. (2022). The Economics of Money, Banking, and Financial Markets.
- البنك المركزي السوري. (2023). التقرير السنوي.`,
    category: 'اقتصاد كلي',
    subCategory: 'سياسات نقدية',
    attachmentType: 'pdf',
    attachmentUrl: '/files/lectures/monetary-policy-inflation.pdf',
    attachmentName: 'السياسات_النقدية_والتضخم.pdf',
    fileSize: '2.4 MB',
    tags: ['تضخم', 'سياسة نقدية', 'اقتصاد ناشئ', 'بنوك مركزية'],
    status: 'APPROVED',
    postType: 'LECTURE',
    rejectedReason: null,
    views: 1247,
    likes: 89,
    commentsCount: 12,
    likedBy: ['user-001', 'user-003'],
    comments: [
      {
        id: 'c-001',
        author: { id: 'user-001', name: 'د. سارة علي الحسن', avatar: 'س', role: 'USER' },
        text: 'بحث ممتاز ومفيد جداً، خاصة الجزء الخاص بالتوصيات العملية',
        timestamp: '2024-03-15T10:30:00Z',
        likes: 5,
        replies: [
          {
            id: 'r-001',
            author: { id: 'admin-001', name: 'د. أحمد محمد الخليل', avatar: 'أ', role: 'ADMIN' },
            text: 'شكراً د. سارة، يسعدني أن البحث كان مفيداً',
            timestamp: '2024-03-15T14:20:00Z',
            likes: 2
          }
        ]
      }
    ],
    commentsDisabled: false,
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-12T11:00:00Z',
    reviewedAt: '2024-03-12T11:00:00Z',
    reviewedBy: 'admin-001'
  },
  
  // ✅ مقبول - مقال
  {
    id: 'art-001',
    authorId: 'admin-001',
    speaker: 'د. أحمد محمد الخليل',
    title: 'الاقتصاد الرقمي: فرص وتحديات للدول العربية',
    summary: 'نظرة استشرافية على مستقبل الاقتصاد الرقمي في المنطقة العربية والعوامل المساعدة على نجاح التحول الرقمي.',
    fullContent: `يشهد العالم تحولاً رقمياً متسارعاً يؤثر على جميع القطاعات الاقتصادية...

## مقدمة
أصبح الاقتصاد الرقمي محركاً رئيسياً للنمو الاقتصادي العالمي...

## واقع الاقتصاد الرقمي في العالم العربي
- نسبة المساهمة في الناتج المحلي: 3-8% فقط مقارنة بـ 15-25% في الدول المتقدمة
- التحديات: البنية التحتية، المهارات الرقمية، الأطر التنظيمية

## الفرص المتاحة
1. التجارة الإلكترونية والخدمات المالية الرقمية
2. الاقتصاد التشاركي والعمل عن بعد
3. الذكاء الاصطناعي وتحليل البيانات

## توصيات للسياسات
- استثمار في البنية التحتية الرقمية
- تطوير المناهج التعليمية
- إنشاء أطر تنظيمية مرنة

## خاتمة
التحول الرقمي ليس خياراً بل ضرورة للبقاء في المنافسة العالمية.`,
    category: 'اقتصاد رقمي',
    subCategory: 'تحول رقمي',
    attachmentType: 'image',
    attachmentUrl: 'https://picsum.photos/seed/digital-econ/800/400',
    attachmentName: 'infographic-digital-economy.png',
    fileSize: '1.2 MB',
    tags: ['اقتصاد رقمي', 'تحول رقمي', 'العالم العربي', 'تكنولوجيا'],
    status: 'APPROVED',
    postType: 'ARTICLE',
    rejectedReason: null,
    views: 892,
    likes: 67,
    commentsCount: 8,
    likedBy: ['user-002'],
    comments: [],
    commentsDisabled: false,
    createdAt: '2024-03-05T14:00:00Z',
    updatedAt: '2024-03-06T10:00:00Z',
    reviewedAt: '2024-03-06T10:00:00Z',
    reviewedBy: 'admin-001'
  },
  
  // ⏳ قيد المراجعة - محاضرة
  {
    id: 'lec-002',
    authorId: 'admin-001',
    speaker: 'د. أحمد محمد الخليل',
    title: 'أثر العقوبات الاقتصادية على التجارة الخارجية: دراسة حالة سوريا',
    summary: 'تحليل كمي ونوعي لتأثير العقوبات الاقتصادية على هيكل التجارة الخارجية السورية خلال العقد الماضي.',
    fullContent: 'محتوى المحاضرة الكامل هنا...',
    category: 'تجارة دولية',
    subCategory: 'عقوبات اقتصادية',
    attachmentType: 'pdf',
    attachmentUrl: '/files/lectures/sanctions-trade.pdf',
    attachmentName: 'العقوبات_والتجارة.pdf',
    fileSize: '3.1 MB',
    tags: ['عقوبات', 'تجارة خارجية', 'سوريا', 'اقتصاد سياسي'],
    status: 'PENDING',
    postType: 'LECTURE',
    rejectedReason: null,
    views: 45,
    likes: 3,
    commentsCount: 0,
    likedBy: [],
    comments: [],
    commentsDisabled: false,
    createdAt: '2024-03-20T16:00:00Z',
    updatedAt: '2024-03-20T16:00:00Z'
  },
  
  // ❌ مرفوض - مقال
  {
    id: 'art-002',
    authorId: 'admin-001',
    speaker: 'د. أحمد محمد الخليل',
    title: 'تحليل نقدي لسياسات الدعم في المنطقة العربية',
    summary: 'مراجعة نقدية لفعالية سياسات الدعم المباشر وغير المباشر وأثرها على المالية العامة.',
    fullContent: 'محتوى المقال...',
    category: 'مالية عامة',
    subCategory: 'سياسات الدعم',
    attachmentType: null,
    attachmentUrl: null,
    attachmentName: null,
    fileSize: null,
    tags: ['دعم', 'مالية عامة', 'سياسات اقتصادية'],
    status: 'REJECTED',
    postType: 'ARTICLE',
    rejectedReason: 'المحتوى يحتاج لمصادر أكاديمية أكثر دقة، يرجى إضافة مراجع محدثة من دوريات محكمة',
    views: 12,
    likes: 0,
    commentsCount: 0,
    likedBy: [],
    comments: [],
    commentsDisabled: false,
    createdAt: '2024-03-18T11:00:00Z',
    updatedAt: '2024-03-19T09:30:00Z',
    reviewedAt: '2024-03-19T09:30:00Z',
    reviewedBy: 'admin-001'
  },
  
  // === منشورات د. سارة (مستخدم) ===
  
  // ✅ مقبول - محاضرة
  {
    id: 'lec-003',
    authorId: 'user-001',
    speaker: 'د. سارة علي الحسن',
    title: 'إدارة المخاطر في المحافظ الاستثمارية: أدوات وتطبيقات',
    summary: 'استعراض لأهم أدوات قياس وإدارة المخاطر المالية مع تطبيقات عملية على الأسواق العربية.',
    fullContent: 'محتوى المحاضرة الكامل...',
    category: 'مالية',
    subCategory: 'إدارة مخاطر',
    attachmentType: 'pdf',
    attachmentUrl: '/files/lectures/risk-management.pdf',
    attachmentName: 'ادارة_المخاطر.pdf',
    fileSize: '1.8 MB',
    tags: ['مخاطر مالية', 'استثمار', 'محافظ', 'أسواق مالية'],
    status: 'APPROVED',
    postType: 'LECTURE',
    rejectedReason: null,
    views: 534,
    likes: 42,
    commentsCount: 5,
    likedBy: ['admin-001', 'user-003'],
    comments: [],
    commentsDisabled: false,
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-22T14:00:00Z',
    reviewedAt: '2024-02-22T14:00:00Z',
    reviewedBy: 'admin-001'
  },
  
  // ⏳ قيد المراجعة
  {
    id: 'lec-004',
    authorId: 'user-001',
    speaker: 'د. سارة علي الحسن',
    title: 'التمويل الإسلامي والبنوك التقليدية: مقارنة أداء في الأزمات',
    summary: 'دراسة مقارنة لمرونة البنوك الإسلامية والتقليدية في مواجهة الصدمات الاقتصادية.',
    fullContent: 'محتوى المحاضرة...',
    category: 'مالية',
    subCategory: 'تمويل إسلامي',
    attachmentType: 'pdf',
    attachmentUrl: '/files/lectures/islamic-finance.pdf',
    attachmentName: 'التمويل_الإسلامي.pdf',
    fileSize: '2.1 MB',
    tags: ['تمويل إسلامي', 'بنوك', 'أزمات مالية', 'مقارنة'],
    status: 'PENDING',
    postType: 'LECTURE',
    rejectedReason: null,
    views: 78,
    likes: 6,
    commentsCount: 1,
    likedBy: [],
    comments: [],
    commentsDisabled: false,
    createdAt: '2024-03-19T13:00:00Z',
    updatedAt: '2024-03-19T13:00:00Z'
  },
  
  // ❌ مرفوض
  {
    id: 'art-003',
    authorId: 'user-001',
    speaker: 'د. سارة علي الحسن',
    title: 'توقعات أسعار النفط للربع الثاني من 2024',
    summary: 'تحليل فني وأساسي لأسعار النفط مع سيناريوهات محتملة للربع القادم.',
    fullContent: 'محتوى المقال...',
    category: 'طاقة',
    subCategory: 'أسواق النفط',
    attachmentType: 'image',
    attachmentUrl: 'https://picsum.photos/seed/oil-chart/800/400',
    attachmentName: 'oil-forecast-chart.png',
    fileSize: '890 KB',
    tags: ['نفط', 'توقعات', 'أسواق طاقة', 'تحليل فني'],
    status: 'REJECTED',
    postType: 'ARTICLE',
    rejectedReason: 'المحتوى يحتوي على توقعات استثمارية مباشرة، يرجى إعادة الصياغة كأبحاث تحليلية غير استشارية',
    views: 23,
    likes: 1,
    commentsCount: 0,
    likedBy: [],
    comments: [],
    commentsDisabled: false,
    createdAt: '2024-03-17T15:00:00Z',
    updatedAt: '2024-03-18T10:00:00Z',
    reviewedAt: '2024-03-18T10:00:00Z',
    reviewedBy: 'admin-001'
  },
  
  // === منشورات خالد (مستخدم جديد) ===
  
  // ✅ مقبول
  {
    id: 'lec-005',
    authorId: 'user-002',
    speaker: 'م. خالد يوسف النمري',
    title: 'سلاسل التوريد العالمية: تأثير الجيوسياسة على التجارة',
    summary: 'كيف تؤثر التوترات الجيوسياسية على هيكل وكفاءة سلاسل التوريد الدولية.',
    fullContent: 'محتوى المحاضرة...',
    category: 'تجارة دولية',
    subCategory: 'سلاسل توريد',
    attachmentType: 'pdf',
    attachmentUrl: '/files/lectures/supply-chains.pdf',
    attachmentName: 'سلاسل_التوريد.pdf',
    fileSize: '1.5 MB',
    tags: ['تجارة دولية', 'جيوسياسة', 'سلاسل توريد', 'لوجستيات'],
    status: 'APPROVED',
    postType: 'LECTURE',
    rejectedReason: null,
    views: 312,
    likes: 28,
    commentsCount: 3,
    likedBy: ['user-001'],
    comments: [],
    commentsDisabled: false,
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-03-03T09:00:00Z',
    reviewedAt: '2024-03-03T09:00:00Z',
    reviewedBy: 'admin-001'
  },
  
  // ⏳ قيد المراجعة
  {
    id: 'art-004',
    authorId: 'user-002',
    speaker: 'م. خالد يوسف النمري',
    title: 'المنطقة الاقتصادية الحرة: دراسة جدوى لمشروع تصديري',
    summary: 'نموذج عملي لتقييم جدوى المشاريع التصديرية في المناطق الاقتصادية الحرة.',
    fullContent: 'محتوى المقال...',
    category: 'استثمار',
    subCategory: 'مناطق حرة',
    attachmentType: 'pdf',
    attachmentUrl: '/files/lectures/free-zones.pdf',
    attachmentName: 'المناطق_الحرة.pdf',
    fileSize: '2.8 MB',
    tags: ['مناطق حرة', 'تصدير', 'دراسة جدوى', 'استثمار'],
    status: 'PENDING',
    postType: 'ARTICLE',
    rejectedReason: null,
    views: 34,
    likes: 2,
    commentsCount: 0,
    likedBy: [],
    comments: [],
    commentsDisabled: false,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  },
  
  // === منشورات د. ليلى (مستخدمة جديدة - جميعها مقبولة) ===
  
  {
    id: 'lec-006',
    authorId: 'user-003',
    speaker: 'د. ليلى محمود السعيد',
    title: 'الاقتصاد الدائري: نموذج مستدام للنمو الاقتصادي',
    summary: 'كيف يمكن للاقتصاد الدائري أن يحقق النمو الاقتصادي مع الحفاظ على الموارد الطبيعية.',
    fullContent: 'محتوى المحاضرة...',
    category: 'تنمية',
    subCategory: 'اقتصاد أخضر',
    attachmentType: 'image',
    attachmentUrl: 'https://picsum.photos/seed/circular-econ/800/400',
    attachmentName: 'circular-economy-infographic.png',
    fileSize: '1.1 MB',
    tags: ['اقتصاد دائري', 'استدامة', 'بيئة', 'تنمية'],
    status: 'APPROVED',
    postType: 'LECTURE',
    rejectedReason: null,
    views: 445,
    likes: 51,
    commentsCount: 7,
    likedBy: ['admin-001', 'user-001'],
    comments: [],
    commentsDisabled: false,
    createdAt: '2024-03-12T09:00:00Z',
    updatedAt: '2024-03-13T11:00:00Z',
    reviewedAt: '2024-03-13T11:00:00Z',
    reviewedBy: 'admin-001'
  },
  
  {
    id: 'art-005',
    authorId: 'user-003',
    speaker: 'د. ليلى محمود السعيد',
    title: 'تمويل المشاريع الخضراء: آليات مبتكرة للدول النامية',
    summary: 'استعراض لآليات التمويل المبتكرة لدعم التحول نحو المشاريع الصديقة للبيئة.',
    fullContent: 'محتوى المقال...',
    category: 'تمويل',
    subCategory: 'تمويل أخضر',
    attachmentType: 'pdf',
    attachmentUrl: '/files/lectures/green-finance.pdf',
    attachmentName: 'التمويل_الأخضر.pdf',
    fileSize: '1.9 MB',
    tags: ['تمويل أخضر', 'مشاريع بيئية', 'دول نامية', 'استدامة'],
    status: 'APPROVED',
    postType: 'ARTICLE',
    rejectedReason: null,
    views: 267,
    likes: 33,
    commentsCount: 4,
    likedBy: ['admin-001'],
    comments: [],
    commentsDisabled: false,
    createdAt: '2024-03-08T14:00:00Z',
    updatedAt: '2024-03-09T10:00:00Z',
    reviewedAt: '2024-03-09T10:00:00Z',
    reviewedBy: 'admin-001'
  },
  
  {
    id: 'lec-007',
    authorId: 'user-003',
    speaker: 'د. ليلى محمود السعيد',
    title: 'مؤشرات الاستدامة: قياس الأداء البيئي للشركات',
    summary: 'أدوات ومنهجيات لقياس وتقييم الأداء البيئي والاجتماعي للشركات.',
    fullContent: 'محتوى المحاضرة...',
    category: 'تنمية',
    subCategory: 'مؤشرات أداء',
    attachmentType: null,
    attachmentUrl: null,
    attachmentName: null,
    fileSize: null,
    tags: ['مؤشرات', 'استدامة', 'أداء شركات', 'مسؤولية مجتمعية'],
    status: 'APPROVED',
    postType: 'LECTURE',
    rejectedReason: null,
    views: 189,
    likes: 22,
    commentsCount: 2,
    likedBy: [],
    comments: [],
    commentsDisabled: false,
    createdAt: '2024-03-15T11:00:00Z',
    updatedAt: '2024-03-16T09:00:00Z',
    reviewedAt: '2024-03-16T09:00:00Z',
    reviewedBy: 'admin-001'
  }
];

// دوال مساعدة
export const getLecturesByAuthor = (authorId) => lectures.filter(l => l.authorId === authorId);
export const getLecturesByStatus = (status) => lectures.filter(l => l.status === status);
export const getApprovedLectures = () => lectures.filter(l => l.status === 'APPROVED');

export default lectures;