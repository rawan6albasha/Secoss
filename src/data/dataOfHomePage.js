import { FaUsers, FaProjectDiagram, FaSmile, FaAward } from "react-icons/fa";
import card1 from "../assets/card.jpg";

export const events = [
  {
    id: 1,
    title: "ندوة التحليل الاقتصادي",
    description: "جلسة لمناقشة أبرز التحديات الاقتصادية الحالية",
    date: "2026-05-10",
    // image: '/event1.jpg',
    // type: 'حدث',
    image: card1,
    location: "دمشق-سوريا",
    shareUrl: "#",
    showCountdown: true,
    actionLabel: "اشترك الآن",
    actionLink: "#",
  },
  {
    id: 2,
    title: "ورشة العمل المالية",
    description: "تعلم أساسيات التحليل المالي",
    date: "2026-06-01",
    image: "/event2.jpg",
    // type: 'حدث',
    location: "دمشق-سوريا",
    shareUrl: "#",
    showCountdown: true,
    actionLabel: "اشترك الآن",
    actionLink: "#",
     image: card1,
  },
];

export const statsData = [
  {
    title: "المحاضرات",
    value: 500,
    Icon: FaUsers,
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
  },
  {
    title: "الأحداث",
    value: 85,
    Icon: FaProjectDiagram,
    gradient: "bg-gradient-to-r from-pink-500 to-red-500",
  },
  {
    title: "الأعضاء",
    value: 86,
    Icon: FaSmile,
    gradient: "bg-gradient-to-r from-brand-primary to-brand-secondary",
  },
  {
    title: "المحاضرين",
    value: 134,
    Icon: FaAward,
    gradient: "bg-gradient-to-r from-yellow-400 to-orange-500",
  },
];
