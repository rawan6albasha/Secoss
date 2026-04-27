import card1 from "../assets/card.jpg";
import card2 from "../assets/card2.jpg";
import card3 from "../assets/card3.jpg";
import card4 from "../assets/card4.jpg";
import card5 from "../assets/card5.jpg";
// src/data/news.js
// ✅ الأخبار والفعاليات ينشرها الأدمن فقط

// src/data/news.js

export const newsData = [
  // ============================================================================
  // === 📰 أخبار (نوع: news) ===
  // ============================================================================
  
  {
    id: 1,
    authorId: 'admin-001',
    authorName: { ar: 'د. أحمد محمد الخليل', en: 'Dr. Ahmed Mohammed Al-Khalil' },
    
    // === نصوص ثنائية اللغة ===
    title: {
      ar: 'الجمعية تطلق مبادرة "اقتصاديون شباب" لدعم الباحثين الناشئين',
      en: 'Association Launches "Young Economists" Initiative to Support Emerging Researchers'
    },
    description: {
      ar: 'إطلاق برنامج تدريبي ومنح بحثية للشباب الاقتصاديين تحت سن 35 عاماً',
      en: 'Launching a training program and research grants for young economists under 35'
    },
    content: {
      ar: `أعلنت جمعية العلوم الاقتصادية عن إطلاق مبادرة "اقتصاديون شباب" بهدف دعم وتطوير الكفاءات البحثية الناشئة في مجال الاقتصاد.

## تفاصيل المبادرة
- برنامج تدريبي مكثف لمدة 6 أشهر
- منح بحثية بقيمة تصل إلى 5000 دولار
- إشراف مباشر من خبراء الجمعية
- فرصة للنشر في مجلة الجمعية المحكمة

## شروط التقديم
1. أن يكون المتقدم تحت سن 35 عاماً
2. حاصل على درجة الماجستير في الاقتصاد أو تخصص ذي صلة
3. تقديم مقترح بحثي مبتكر في أحد مجالات:
   - الاقتصاد الكلي والسياسات العامة
   - التمويل والأسواق المالية
   - اقتصاديات التنمية والاستدامة

## المواعيد الهامة
- آخر موعد للتقديم: 30 أبريل 2024
- إعلان النتائج: 15 مايو 2024
- بدء البرنامج: 1 يونيو 2024

للمزيد من المعلومات والتقديم: [رابط التسجيل]`,
      en: `The Syrian Economic Sciences Association announced the launch of the "Young Economists" initiative aimed at supporting and developing emerging research talents in the field of economics.

## Initiative Details
- Intensive 6-month training program
- Research grants up to $5,000
- Direct supervision by association experts
- Opportunity to publish in the association's peer-reviewed journal

## Application Requirements
1. Applicant must be under 35 years old
2. Hold a Master's degree in Economics or related field
3. Submit an innovative research proposal in one of:
   - Macroeconomics and public policy
   - Finance and financial markets
   - Development economics and sustainability

## Important Dates
- Application deadline: April 30, 2024
- Results announcement: May 15, 2024
- Program start: June 1, 2024

For more information and to apply: [Registration Link]`
    },
    
    // === حقول أخرى ===
    image: 'https://picsum.photos/seed/youth-initiative/800/400',
    type: { ar: 'خبر', en: 'News' },
    date: '2024-03-20',
    year: 2024,
    views: 342,
    likes: 28,
    commentsCount: 12,
    shares: 28,
    featured: true,
    status: 'APPROVED',
    tags: [
      { ar: 'مبادرة', en: 'Initiative' },
      { ar: 'شباب', en: 'Youth' },
      { ar: 'منح بحثية', en: 'Research Grants' },
      { ar: 'تدريب', en: 'Training' }
    ]
  },
  
  {
    id: 2,
    authorId: 'admin-001',
    authorName: { ar: 'د. أحمد محمد الخليل', en: 'Dr. Ahmed Mohammed Al-Khalil' },
    
    title: {
      ar: 'نتائج مؤتمر "الاقتصاد السوري: رؤى مستقبلية" تصدر في تقرير شامل',
      en: 'Results of "Syrian Economy: Future Visions" Conference Published in Comprehensive Report'
    },
    description: {
      ar: 'نشر التقرير النهائي للمؤتمر الذي عقد في دمشق الشهر الماضي',
      en: 'Publication of the final report of the conference held in Damascus last month'
    },
    content: {
      ar: `تم نشر التقرير النهائي لمؤتمر "الاقتصاد السوري: رؤى مستقبلية" الذي عقدته الجمعية في دمشق خلال مارس 2024.

## أبرز محاور التقرير
- تحليل الوضع الاقتصادي الراهن والتحديات
- رؤى واستراتيجيات للتعافي الاقتصادي
- دور القطاع الخاص في إعادة الإعمار
- توصيات لصانعي السياسات

## المشاركون
شارك في المؤتمر أكثر من 150 خبيراً وباحثاً من سوريا والخارج، وقدموا أكثر من 40 ورقة بحثية.

## الوصول للتقرير
يمكن تحميل التقرير الكامل مجاناً من موقع الجمعية: [رابط التحميل]`,
      en: `The final report of the "Syrian Economy: Future Visions" conference, organized by the Association in Damascus during March 2024, has been published.

## Key Report Themes
- Analysis of current economic situation and challenges
- Visions and strategies for economic recovery
- Role of private sector in reconstruction
- Recommendations for policymakers

## Participants
More than 150 experts and researchers from Syria and abroad participated, presenting over 40 research papers.

## Accessing the Report
The full report can be downloaded for free from the Association's website: [Download Link]`
    },
    
    image: 'https://picsum.photos/seed/conference-report/800/400',
    type: { ar: 'خبر', en: 'News' },
    date: '2024-03-18',
    year: 2024,
    views: 567,
    likes: 45,
    commentsCount: 23,
    shares: 45,
    featured: false,
    status: 'APPROVED',
    tags: [
      { ar: 'مؤتمر', en: 'Conference' },
      { ar: 'تقرير', en: 'Report' },
      { ar: 'اقتصاد سوري', en: 'Syrian Economy' }
    ]
  },
  
  {
    id: 3,
    authorId: 'admin-001',
    authorName: { ar: 'د. أحمد محمد الخليل', en: 'Dr. Ahmed Mohammed Al-Khalil' },
    
    title: {
      ar: 'الجمعية توقع مذكرة تفاهم مع جامعة حلب للتعاون البحثي',
      en: 'Association Signs MoU with University of Aleppo for Research Cooperation'
    },
    description: {
      ar: 'شراكة استراتيجية لتعزيز الإنتاج العلمي المشترك وتبادل الخبرات',
      en: 'Strategic partnership to enhance joint scientific production and expertise exchange'
    },
    content: {
      ar: `وقعت جمعية العلوم الاقتصادية مذكرة تفاهم مع جامعة حلب لإنشاء شراكة استراتيجية في المجالات البحثية والأكاديمية.

## مجالات التعاون
1. الإشراف المشترك على رسائل الماجستير والدكتوراه
2. تنظيم مؤتمرات وندوات علمية مشتركة
3. تبادل الخبرات التدريسية والبحثية
4. نشر الأبحاث في المجلات المحكمة للطرفين

## الخطوات القادمة
- تشكيل لجنة مشتركة لمتابعة التنفيذ
- إطلاق برامج تبادل أكاديمي للباحثين
- تطوير مشاريع بحثية مشتركة ممولة

تأتي هذه الشراكة ضمن استراتيجية الجمعية لتعزيز التواصل مع المؤسسات الأكاديمية ودعم البحث العلمي في سوريا.`,
      en: `The Syrian Economic Sciences Association signed a Memorandum of Understanding with the University of Aleppo to establish a strategic partnership in research and academic fields.

## Areas of Cooperation
1. Joint supervision of Master's and PhD theses
2. Organizing joint scientific conferences and seminars
3. Exchange of teaching and research expertise
4. Publishing research in peer-reviewed journals of both parties

## Next Steps
- Forming a joint committee to follow up on implementation
- Launching academic exchange programs for researchers
- Developing joint funded research projects

This partnership comes within the Association's strategy to enhance communication with academic institutions and support scientific research in Syria.`
    },
    
    image: 'https://picsum.photos/seed/mou-signing/800/400',
    type: { ar: 'خبر', en: 'News' },
    date: '2024-03-15',
    year: 2024,
    views: 234,
    likes: 19,
    commentsCount: 8,
    shares: 19,
    featured: false,
    status: 'APPROVED',
    tags: [
      { ar: 'شراكة', en: 'Partnership' },
      { ar: 'جامعة', en: 'University' },
      { ar: 'بحث علمي', en: 'Scientific Research' }
    ]
  },
  
  // ============================================================================
  // === 🎪 فعاليات (نوع: event) ===
  // ============================================================================
  
  {
    id: 4,
    authorId: 'admin-001',
    authorName: { ar: 'د. أحمد محمد الخليل', en: 'Dr. Ahmed Mohammed Al-Khalil' },
    
    title: {
      ar: 'ورشة عمل: التحليل الاقتصادي الكمي باستخدام برنامج R',
      en: 'Workshop: Quantitative Economic Analysis Using R'
    },
    description: {
      ar: 'ورشة تطبيقية لمدة يومين للمهتمين بالتحليل الإحصائي والاقتصاد القياسي',
      en: 'Two-day hands-on workshop for those interested in statistical analysis and econometrics'
    },
    content: {
      ar: `## تفاصيل الفعالية

**المحاور الرئيسية:**
1. مقدمة في بيئة R للاقتصاديين
2. استيراد وتنظيف البيانات الاقتصادية
3. التحليل الوصفي والاستدلالي
4. نماذج الانحدار والسلاسل الزمنية
5. تصور البيانات وعرض النتائج

**المدرب:** د. محمد الخطيب - خبير في الاقتصاد القياسي

**التاريخ:** 10-11 أبريل 2024
**الوقت:** 9:00 صباحاً - 4:00 مساءً
**المكان:** مقر الجمعية - دمشق / متاح أونلاين

**رسوم التسجيل:**
- أعضاء الجمعية: مجاني
- غير الأعضاء: 50,000 ل.س

**للتسجيل:** [رابط التسجيل]

*ملاحظة: عدد المقاعد محدود، الأولوية للأعضاء*`,
      en: `## Event Details

**Main Topics:**
1. Introduction to R environment for economists
2. Importing and cleaning economic data
3. Descriptive and inferential analysis
4. Regression models and time series
5. Data visualization and results presentation

**Trainer:** Dr. Mohammed Al-Khatib - Econometrics Expert

**Date:** April 10-11, 2024
**Time:** 9:00 AM - 4:00 PM
**Location:** Association HQ - Damascus / Available Online

**Registration Fees:**
- Association members: Free
- Non-members: 50,000 SYP

**To Register:** [Registration Link]

*Note: Limited seats, priority for members*`
    },
    
    image: 'https://picsum.photos/seed/r-workshop/800/400',
    type: { ar: 'فعالية', en: 'Event' },
    date: '2024-04-10',
    year: 2024,
    views: 189,
    likes: 34,
    commentsCount: 15,
    shares: 34,
    featured: true,
    status: 'APPROVED',
    tags: [
      { ar: 'ورشة عمل', en: 'Workshop' },
      { ar: 'R', en: 'R' },
      { ar: 'تحليل كمي', en: 'Quantitative Analysis' },
      { ar: 'تدريب', en: 'Training' }
    ],
    eventDetails: {
      startDate: '2024-04-10T09:00:00Z',
      endDate: '2024-04-11T16:00:00Z',
      location: { ar: 'دمشق / أونلاين', en: 'Damascus / Online' },
      seats: 30,
      registered: 18,
      fee: { members: 0, nonMembers: 50000 }
    }
  },
  
  {
    id: 5,
    authorId: 'admin-001',
    authorName: { ar: 'د. أحمد محمد الخليل', en: 'Dr. Ahmed Mohammed Al-Khalil' },
    
    title: {
      ar: 'ندوة حوارية: مستقبل الطاقة المتجددة في الاقتصاد السوري',
      en: 'Panel Discussion: Future of Renewable Energy in Syrian Economy'
    },
    description: {
      ar: 'حوار مفتوح مع خبراء الطاقة والاقتصاد لمناقشة فرص التحول الأخضر',
      en: 'Open dialogue with energy and economics experts to discuss green transition opportunities'
    },
    content: {
      ar: `تنظم الجمعية ندوة حوارية مفتوحة لمناقشة فرص وتحديات التحول نحو الطاقة المتجددة في السياق السوري.

## محاور النقاش
- الوضع الراهن لقطاع الطاقة في سوريا
- الإمكانيات المتاحة للطاقة الشمسية وطاقة الرياح
- الجوانب الاقتصادية للاستثمار في الطاقة النظيفة
- السياسات الداعمة للتحول الأخضر

## المتحدثون
- د. سارة حسن - خبيرة سياسات الطاقة
- م. خالد النمري - مهندس مشاريع طاقة متجددة
- د. ليلى أحمد - اقتصادية بيئية

**التاريخ:** 25 أبريل 2024
**الوقت:** 5:00 - 8:00 مساءً
**المكان:** مقر الجمعية - دمشق
**الدخول:** مجاني (يتطلب تسجيل مسبق)

**للتسجيل:** [رابط التسجيل]`,
      en: `The Association organizes an open panel discussion to discuss opportunities and challenges of transitioning to renewable energy in the Syrian context.

## Discussion Topics
- Current status of energy sector in Syria
- Available potential for solar and wind energy
- Economic aspects of investing in clean energy
- Supportive policies for green transition

## Speakers
- Dr. Sara Hassan - Energy Policy Expert
- Eng. Khaled Al-Nimri - Renewable Energy Projects Engineer
- Dr. Layla Ahmed - Environmental Economist

**Date:** April 25, 2024
**Time:** 5:00 - 8:00 PM
**Location:** Association HQ - Damascus
**Entry:** Free (pre-registration required)

**To Register:** [Registration Link]`
    },
    
    image: 'https://picsum.photos/seed/renewable-energy/800/400',
    type: { ar: 'فعالية', en: 'Event' },
    date: '2024-04-25',
    year: 2024,
    views: 145,
    likes: 22,
    commentsCount: 9,
    shares: 22,
    featured: false,
    status: 'APPROVED',
    tags: [
      { ar: 'ندوة', en: 'Panel' },
      { ar: 'طاقة متجددة', en: 'Renewable Energy' },
      { ar: 'اقتصاد أخضر', en: 'Green Economy' }
    ],
    eventDetails: {
      startDate: '2024-04-25T17:00:00Z',
      endDate: '2024-04-25T20:00:00Z',
      location: { ar: 'مقر الجمعية - دمشق', en: 'Association HQ - Damascus' },
      seats: 50,
      registered: 12,
      fee: { members: 0, nonMembers: 0 }
    }
  },
  
  {
    id: 6,
    authorId: 'admin-001',
    authorName: { ar: 'د. أحمد محمد الخليل', en: 'Dr. Ahmed Mohammed Al-Khalil' },
    
    title: {
      ar: 'المؤتمر السنوي التاسع لجمعية العلوم الاقتصادية',
      en: '9th Annual Conference of the Syrian Economic Sciences Association'
    },
    description: {
      ar: 'دعوة للمشاركة في المؤتمر السنوي تحت شعار "الاقتصاد في عصر التحولات"',
      en: 'Call for participation in the annual conference under the theme "Economy in an Era of Transformations"'
    },
    content: {
      ar: `تدعو جمعية العلوم الاقتصادية الباحثين والأكاديميين والممارسين للمشاركة في مؤتمرها السنوي التاسع.

## شعار المؤتمر
"الاقتصاد في عصر التحولات: تحديات وفرص"

## المحاور العلمية
1. التحولات الهيكلية في الاقتصادات الناشئة
2. الرقمنة والاقتصاد الجديد
3. الاستدامة والتمويل الأخضر
4. السياسات الاقتصادية في ظل الأزمات

## أنواع المشاركات المقبولة
- أوراق بحثية كاملة
- ملخصات أبحاث قيد التنفيذ
- ملصقات علمية (Posters)
- جلسات نقاشية متخصصة

## مواعيد هامة
- آخر موعد لاستلام الملخصات: 1 مايو 2024
- إشعار القبول: 15 مايو 2024
- آخر موعد لاستلام الأوراق الكاملة: 1 يونيو 2024
- تاريخ المؤتمر: 15-17 يونيو 2024

## رسوم المشاركة
| الفئة | أعضاء الجمعية | غير الأعضاء |
|-------|--------------|------------|
| باحث مقدم ورقة | 100,000 ل.س | 200,000 ل.س |
| مشارك مستمع | 50,000 ل.س | 100,000 ل.س |
| طلاب دراسات عليا | مجاني | 50,000 ل.س |

**للمزيد والتسجيل:** [موقع المؤتمر]`,
      en: `The Syrian Economic Sciences Association invites researchers, academics, and practitioners to participate in its 9th annual conference.

## Conference Theme
"Economy in an Era of Transformations: Challenges and Opportunities"

## Scientific Tracks
1. Structural transformations in emerging economies
2. Digitalization and the new economy
3. Sustainability and green finance
4. Economic policies in times of crisis

## Accepted Participation Types
- Full research papers
- Research abstracts (work in progress)
- Scientific posters
- Specialized panel sessions

## Important Dates
- Abstract submission deadline: May 1, 2024
- Acceptance notification: May 15, 2024
- Full paper submission deadline: June 1, 2024
- Conference dates: June 15-17, 2024

## Participation Fees
| Category | Association Members | Non-Members |
|----------|-------------------|-------------|
| Paper Presenter | 100,000 SYP | 200,000 SYP |
| Listener | 50,000 SYP | 100,000 SYP |
| Graduate Students | Free | 50,000 SYP |

**For more info and registration:** [Conference Website]`
    },
    
    image: 'https://picsum.photos/seed/annual-conference/800/400',
    type: { ar: 'فعالية', en: 'Event' },
    date: '2024-06-15',
    year: 2024,
    views: 423,
    likes: 67,
    commentsCount: 31,
    shares: 67,
    featured: true,
    status: 'APPROVED',
    tags: [
      { ar: 'مؤتمر سنوي', en: 'Annual Conference' },
      { ar: 'بحث علمي', en: 'Scientific Research' },
      { ar: 'شبكة مهنية', en: 'Professional Network' }
    ],
    eventDetails: {
      startDate: '2024-06-15T09:00:00Z',
      endDate: '2024-06-17T17:00:00Z',
      location: { ar: 'دمشق', en: 'Damascus' },
      seats: 200,
      registered: 45,
      fee: { members: 100000, nonMembers: 200000 },
      submissionDeadline: '2024-05-01'
    }
  }
];

// دوال مساعدة
export const getNewsByType = (type) => newsData.filter(n => n.type === type);
export const getFeaturedNews = () => newsData.filter(n => n.featured);
export const getUpcomingEvents = () => {
  const now = new Date();
  return newsData.filter(n => 
    n.type === 'event' && 
    new Date(n.eventDetails?.startDate) > now
  );
};

export default newsData;