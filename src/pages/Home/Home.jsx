import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { getLocalizedText } from '../../utils/i18n-helpers'
import BlurShowcase from './../../components/ui/BlurShowcase'
import hero from './../../assets/Economic5.webp'
import { newsData } from './../../data/news'
import Card from '../../components/Card/Card'
import StatsSection from '../../components/StatsSection/StatsSection'
import { statsData,events } from '../../data/dataOfHomePage'
import ImageCarousel from '../../components/ui/ImageCarousel'
import EventCard from '../../components/EventCard/EventCard'



const Home = () => {
  const { i18n } = useTranslation()
  const { isDark } = useTheme()
  const [loading, setLoading] = useState(true)
  const [newsCards, setNewsCards] = useState([])

  const currentLang = i18n.language || 'ar'
  const isArabic = currentLang.startsWith('ar')
  const heroContent = {
    title: {
      ar: 'منصة جمعية العلوم الاقتصادية السورية',
      en: 'Syrian Economic Sciences Association Platform',
    },
    tagline: {
      ar: 'نحو وعي اقتصادي يصنع الفرق...',
      en: 'Towards economic awareness that makes a difference...',
    },
    description: {
      ar: 'نعمل على نشر المعرفة الاقتصادية وتسليط الضوء على القضايا المالية والمجتمعية من خلال الأخبار والمحاضرات والأنشطة التي تساهم في بناء وعي اقتصادي فعّال.',
      en: 'We promote economic knowledge and highlight financial and social issues through news, lectures, and activities that help build effective economic awareness.',
    },
  }

  useEffect(() => {
    setTimeout(() => {
      setNewsCards(newsData)
      setLoading(false)
    }, 1000)
  }, [])
  const sortedNews = [...newsCards].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <section dir={isArabic ? 'rtl' : 'ltr'} className="space-y-10 py-10">
    <ImageCarousel
  SlideComponent={EventCard}
  items={events}
/>
      {/* Hero */}
      <div className="grid gap-8 lg:grid-cols-[1.25fr_.85fr] items-center">
        <div className="space-y-6">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {getLocalizedText(heroContent.title, currentLang)}
          </h1>
          <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {getLocalizedText(heroContent.tagline, currentLang)}
          </p>
          <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
            {getLocalizedText(heroContent.description, currentLang)}
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden w-[43vw]">
          <img
            src={hero}
            alt={getLocalizedText(heroContent.title, currentLang)}
            className="w-full object-cover"
          />
        </div>
      </div>

      {/* آخر 5 أخبار نوع "خبر الجمعية" */}
    {/*   <BlurShowcase        
        title="محاضرات PDF"
        items={newsCards}
        loading={loading}
        limit={5}
        filter={card => card.type === 'خبر الجمعية'}
        buttonLink="/pdfs"
          CardComponent={Card} 
      /> */}

      {/* كل الأخبار */}
      <BlurShowcase           
        title={{ ar: 'جميع الأخبار', en: 'All news' }}
        items={sortedNews}
        loading={loading}
        limit={6}
        buttonLink="/news"
        CardComponent={Card} 
      />

      <StatsSection data={statsData} />
    </section>
  )
}

export default Home

