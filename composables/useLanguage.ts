export type LanguageCode = 'en' | 'de' | 'nl' | 'tr'

interface LanguageMeta {
  code: LanguageCode
  label: string
  flag: string
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
]

export const useLanguage = () => {
  const currentLang = useState<LanguageCode>('ai_news_lang', () => 'tr')

  const setLanguage = (lang: LanguageCode) => {
    currentLang.value = lang
  }

  const t = (key: string) => {
    const dict: Record<LanguageCode, Record<string, string>> = {
      en: {
        badge: 'GLOBAL AI DISPATCH',
        title: 'AI Intelligence & Global Dispatch Hub 🤖',
        subtitle: 'Real-time breakthroughs in Large Language Models, Robotics, AI Agents, and Neural Architectures.',
        searchPlaceholder: 'Search AI intelligence, models, papers...',
        all: 'All',
        llm: 'LLMs & Models',
        robotics: 'Robotics',
        tools: 'AI Tools',
        research: 'Research',
        breaking: 'BREAKING AI',
        readTime: 'min read',
        source: 'Source',
        viewSource: 'Read Source ↗',
        noResults: 'No intelligence dispatches found matching your search.',
      },
      de: {
        badge: 'GLOBALE KI-BERICHTE',
        title: 'KI-Intelligenz & Global Dispatch Hub 🤖',
        subtitle: 'Echtzeit-Durchbrüche bei großen Sprachmodellen, Robotik, KI-Agenten und neuronalen Architekturen.',
        searchPlaceholder: 'KI-Intelligenz, Modelle, Paper durchsuchen...',
        all: 'Alle',
        llm: 'LLMs & Modelle',
        robotics: 'Robotik',
        tools: 'KI-Werkzeuge',
        research: 'Forschung',
        breaking: 'EILMELDUNG KI',
        readTime: 'Min. Lesezeit',
        source: 'Quelle',
        viewSource: 'Quelle lesen ↗',
        noResults: 'Keine passenden Berichte gefunden.',
      },
      nl: {
        badge: 'WERELDWIJDE AI DISPATCH',
        title: 'AI Intelligentie & Global Dispatch Hub 🤖',
        subtitle: 'Realtime doorbraken in Large Language Models, Robotica, AI-agenten en neurale architecturen.',
        searchPlaceholder: 'Zoek AI-intelligentie, modellen, artikelen...',
        all: 'Alles',
        llm: 'LLM & Modellen',
        robotics: 'Robotica',
        tools: 'AI Tools',
        research: 'Onderzoek',
        breaking: 'BREAKING AI',
        readTime: 'min lezen',
        source: 'Bron',
        viewSource: 'Lees bron ↗',
        noResults: 'Geen dispatches gevonden die aan uw zoekopdracht voldoen.',
      },
      tr: {
        badge: 'KÜRESEL YAPAY ZEKA MERKEZİ',
        title: 'AI Intelligence & Global Dispatch Hub 🤖',
        subtitle: 'Büyük Dil Modelleri, Robotik, Yapay Zeka Ajanları ve Nöral Mimarilerdeki gerçek zamanlı gelişmeler.',
        searchPlaceholder: 'Yapay zeka haberleri, modelleri, makaleleri ara...',
        all: 'Tümü',
        llm: 'LLM & Modeller',
        robotics: 'Robotik',
        tools: 'AI Araçları',
        research: 'Araştırma',
        breaking: 'SON DAKİKA AI',
        readTime: 'dk okuma',
        source: 'Kaynak',
        viewSource: 'Kaynağı Oku ↗',
        noResults: 'Arama kriterinize uygun yapay zeka haberi bulunamadı.',
      },
    }

    return dict[currentLang.value]?.[key] || dict.en[key] || key
  }

  return {
    currentLang,
    setLanguage,
    t,
  }
}
