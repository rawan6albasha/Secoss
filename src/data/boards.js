import boardImage1 from '../assets/Economic1.webp';
import boardImage2 from '../assets/Economic2.jpg';

export const boards = [
  {
    id: 'board-2024-2026',
    year: { ar: '2024-2026', en: '2024-2026' },
    period: { ar: 'الدورة الحالية', en: 'Current term' },
    president: { ar: 'د. أحمد محمد الخليل', en: 'Dr. Ahmad Mohammad Al-Khalil' },
    vicePresident: { ar: 'د. سارة علي الحسن', en: 'Dr. Sara Ali Al-Hassan' },
    secretary: { ar: 'م. خالد يوسف النمري', en: 'Eng. Khaled Yousef Al-Nemri' },
    treasurer: { ar: 'د. ليلى محمود السعيد', en: 'Dr. Layla Mahmoud Al-Saeed' },
    members: [
      { ar: 'د. رامي عبد الله', en: 'Dr. Rami Abdullah' },
      { ar: 'د. نور حسن', en: 'Dr. Nour Hassan' },
    ],
    images: [boardImage1, boardImage2],
  },
  {
    id: 'board-2022-2024',
    year: { ar: '2022-2024', en: '2022-2024' },
    period: { ar: 'الدورة السابقة', en: 'Previous term' },
    president: { ar: 'د. سامر أحمد', en: 'Dr. Samer Ahmad' },
    vicePresident: { ar: 'د. هناء مصطفى', en: 'Dr. Hana Mustafa' },
    secretary: { ar: 'د. ياسر حمود', en: 'Dr. Yasser Hammoud' },
    treasurer: { ar: 'د. ريم خضور', en: 'Dr. Reem Khaddour' },
    members: [
      { ar: 'د. مازن علي', en: 'Dr. Mazen Ali' },
      { ar: 'د. لمى خليل', en: 'Dr. Lama Khalil' },
    ],
    images: [boardImage2, boardImage1],
  },
];

export default boards;
