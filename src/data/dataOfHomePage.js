import { FaUsers, FaProjectDiagram, FaSmile, FaAward } from "react-icons/fa";
import card1 from "../assets/card.jpg";
import card2 from "../assets/card4.jpg";

export const events = [
  {
    id: 1,
    title: {
      ar: "ندوة التحليل الاقتصادي",
      en: "Economic Analysis Seminar",
    },
    description: {
      ar: "جلسة لمناقشة أبرز التحديات الاقتصادية الحالية",
      en: "A session to discuss the most important current economic challenges",
    },
    date: "2027-05-10",
    // type: 'حدث',
    image: card1,
    location: {
      ar: "دمشق-سوريا",
      en: "Damascus, Syria",
    },
    shareUrl: "#",
    showCountdown: true,
    actionLabel: {
      ar: "اشترك الآن",
      en: "Register now",
    },
    actionLink: "#",
  },
  {
    id: 2,
    title: {
      ar: "ورشة العمل المالية",
      en: "Financial Workshop",
    },
    description: {
      ar: "تعلم أساسيات التحليل المالي",
      en: "Learn the fundamentals of financial analysis",
    },
    date: "2028-06-01",
    // type: 'حدث',
    image: card2,
    location: {
      ar: "دمشق-سوريا",
      en: "Damascus, Syria",
    },
    shareUrl: "#",
    showCountdown: true,
    actionLabel: {
      ar: "اشترك الآن",
      en: "Register now",
    },
    actionLink: "#",
  },
];

export const statsData = [
  {
    title: { ar: "المحاضرات", en: "Lectures" },
    value: 500,
    Icon: FaUsers,
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
  },
  {
    title: { ar: "الأحداث", en: "Events" },
    value: 85,
    Icon: FaProjectDiagram,
    gradient: "bg-gradient-to-r from-pink-500 to-red-500",
  },
  {
    title: { ar: "الأعضاء", en: "Members" },
    value: 86,
    Icon: FaSmile,
    gradient: "bg-gradient-to-r from-brand-primary to-brand-secondary",
  },
  {
    title: { ar: "المحاضرين", en: "Lecturers" },
    value: 134,
    Icon: FaAward,
    gradient: "bg-gradient-to-r from-yellow-400 to-orange-500",
  },
];
