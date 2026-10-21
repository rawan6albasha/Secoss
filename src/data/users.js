// src/data/users.js

// ✅ كلمات المرور للمحاكاة (في الإنتاج: استخدم hashing)
// admin: admin123 | user1: user123 | user2: user123 | user3: user123

export const users = [
  {
    id: 'admin-001',
    name: 'د. أحمد محمد الخليل',
    email: 'admin@secoss.org',
    password: 'admin123', // ⚠️ للمحاكاة فقط
    role: 'ADMIN',
    avatar: 'https://ui-avatars.com/api/?name=أحمد+محمد&background=10b981&color=fff&size=128',
    degree: 'دكتوراه في الاقتصاد السياسي',
    specialization: 'السياسات الاقتصادية والتنمية',
    work: 'جامعة دمشق - كلية الاقتصاد',
    bio: 'خبير اقتصادي بأكثر من 20 عاماً من الخبرة في مجال السياسات الاقتصادية والتحليل المالي. عضو في عدة جمعيات اقتصادية عربية ودولية.',
    certificates: [
      'شهادة التدريس الجامعي المتقدم',
      'زمالة الجمعية الاقتصادية العربية',
      'شهادة التحليل المالي المعتمد (CFA Level 2)'
    ],

    socialLinks: {
      linkedin: 'https://linkedin.com/in/ahmed-khalil',
      researchGate: 'https://researchgate.net/profile/ahmed-khalil'
    },
    extraPermissions: ['publish_news', 'publish_events', 'manage_all', 'moderate_comments'],
    createdAt: '2023-01-15T10:00:00Z',
    lastLogin: '2024-03-20T14:30:00Z',
    postsCount: 15,
    approvedPostsCount: 12
  },
  
  {
    id: 'user-001',
    name: 'د. سارة علي الحسن',
    email: 'sara.hassan@example.com',
    password: 'user123',
    role: 'USER',
    avatar: 'https://ui-avatars.com/api/?name=سارة+علي&background=3b82f6&color=fff&size=128',
    degree: 'ماجستير في الاقتصاد المالي',
    specialization: 'الأسواق المالية والاستثمار',
    work: 'مصرف سوريا المركزي - دائرة الأبحاث',
    bio: 'باحثة متخصصة في تحليل الأسواق المالية وتأثير السياسات النقدية على الاستقرار الاقتصادي. مهتمة بنشر الوعي المالي.',
    certificates: [
      'شهادة التحليل الفني للأسواق',
      'دبلوم في الإدارة المالية'
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sara-hassan'
    },
    extraPermissions: [],
    createdAt: '2023-06-20T09:00:00Z',
    lastLogin: '2024-03-19T11:20:00Z',
    postsCount: 8,
    approvedPostsCount: 5
  },
  
  {
    id: 'user-002',
    name: 'م. خالد يوسف النمري',
    email: 'khaled.nemri@example.com',
    password: 'user123',
    role: 'USER',
    avatar: 'https://ui-avatars.com/api/?name=خالد+يوسف&background=8b5cf6&color=fff&size=128',
    degree: 'بكالوريوس في الاقتصاد',
    specialization: 'الاقتصاد الجزئي والتجارة',
    work: 'شركة الشام للتجارة الدولية',
    bio: 'محلل اقتصادي مهتم بدراسة تأثير العولمة على الاقتصادات الناشئة. أسعى لنشر أبحاث تطبيقية تفيد القطاع الخاص.',
    certificates: [
      'شهادة محلل بيانات اقتصادية'
    ],
    socialLinks: {},
    extraPermissions: [],
    createdAt: '2023-09-10T14:00:00Z',
    lastLogin: '2024-03-18T16:45:00Z',
    postsCount: 4,
    approvedPostsCount: 2
  },
  
  {
    id: 'user-003',
    name: 'د. ليلى محمود السعيد',
    email: 'layla.saeed@example.com',
    password: 'user123',
    role: 'USER',
    avatar: 'https://ui-avatars.com/api/?name=ليلى+محمود&background=ec4899&color=fff&size=128',
    degree: 'دكتوراه في اقتصاديات التنمية',
    specialization: 'التنمية المستدامة والاقتصاد الأخضر',
    work: 'منظمة الأمم المتحدة للتنمية - مكتب دمشق',
    bio: 'متخصصة في اقتصاديات التنمية المستدامة والتحول نحو الاقتصاد الأخضر. أعمل على مشاريع بحثية لدعم السياسات البيئية.',
    certificates: [
      'شهادة الخبراء في التنمية المستدامة',
      'دبلوم في السياسات البيئية'
    ],
    socialLinks: {
      twitter: 'https://twitter.com/layla_econ',
      researchGate: 'https://researchgate.net/profile/layla-saeed'
    },
    extraPermissions: [],
    createdAt: '2024-01-05T08:30:00Z',
    lastLogin: '2024-03-20T09:15:00Z',
    postsCount: 3,
    approvedPostsCount: 3
  }
];

// المستخدمون الذين يظهرون ضمن دليل المحاضرين
export const lecturers = users.filter(user => user.role === 'ADMIN' || user.postsCount > 0);

// دالة مساعدة للبحث عن مستخدم (للمحاكاة)
export const findUserById = (id) => users.find(u => u.id === id);
export const findUserByEmail = (email) => users.find(u => u.email === email);

// دالة محاكاة تسجيل الدخول
export const mockLogin = (email, password) => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    const { password: _, ...userWithoutPass } = user;
    return {
      success: true,
      user: userWithoutPass,
      token: `mock-token-${user.id}-${Date.now()}`
    };
  }
  return { success: false, message: 'بيانات الدخول غير صحيحة' };
};

export default users;