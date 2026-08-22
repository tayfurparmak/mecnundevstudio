import tr from '~/locales/tr.json'
import en from '~/locales/en.json'
import de from '~/locales/de.json'
import nl from '~/locales/nl.json'

export type SupportedLocale = 'tr' | 'en' | 'de' | 'nl'

const dictionaries: Record<SupportedLocale, any> = {
  tr,
  en,
  de,
  nl,
}

export const useI18n = () => {
  const cookieRef = useCookie<SupportedLocale>('mecnun_lang', { maxAge: 60 * 60 * 24 * 365, default: () => 'tr' as SupportedLocale })
  
  const currentLocale = useState<SupportedLocale>('global_locale', () => {
    if (cookieRef.value && ['tr', 'en', 'de', 'nl'].includes(cookieRef.value)) {
      return cookieRef.value
    }
    return 'tr'
  })

  // Watch for changes and update HTML lang attribute dynamically for SEO/Accessibility
  useHead({
    htmlAttrs: {
      lang: currentLocale,
    }
  })

  // Synchronize navigator language only on client mount if no cookie exists to prevent hydration mismatch
  onMounted(() => {
    if (!useCookie('mecnun_lang').value && navigator) {
      const navLang = navigator.language.toLowerCase()
      let detected: SupportedLocale = 'tr'
      if (navLang.startsWith('de')) detected = 'de'
      else if (navLang.startsWith('nl')) detected = 'nl'
      else if (navLang.startsWith('en')) detected = 'en'
      
      if (detected !== 'tr') {
        setLocale(detected)
      }
    }
  })

  const setLocale = (locale: SupportedLocale) => {
    currentLocale.value = locale
    cookieRef.value = locale
    if (process.client) {
      localStorage.setItem('mecnun_lang', locale)
    }
  }

  const t = (path: string): string => {
    const keys = path.split('.')
    let current = dictionaries[currentLocale.value] || dictionaries.tr

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        // Fallback to Turkish
        let fallback = dictionaries.tr
        for (const k of keys) {
          if (fallback && typeof fallback === 'object' && k in fallback) {
            fallback = fallback[k]
          } else {
            return path
          }
        }
        return typeof fallback === 'string' ? fallback : path
      }
    }

    return typeof current === 'string' ? current : path
  }

  return {
    currentLocale,
    setLocale,
    t,
  }
}
