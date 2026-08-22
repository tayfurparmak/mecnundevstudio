export const useSiteConfig = () => {
  return {
    brand: {
      name: 'MECNUNUM',
      shortName: 'M',
      tagline: 'Öğreniyorum. Üretiyorum. Paylaşıyorum.',
      subTagline: 'LEARNING × AI × HUMAN BRAIN × TECHNOLOGY',
      concept: 'Digital Neural Interface & Learning Universe',
      description: 'Yapay zeka, modern full-stack web mimarileri (Nuxt, Vue, TypeScript, Python) ve bilgisayar mühendisliği vizyonuyla inşa edilen kişisel teknoloji ve öğrenme merkezi.',
    },
    navLinks: [
      { label: 'nav.home', to: '/' },
      { label: 'nav.about', to: '/about' },
      { label: 'nav.technologies', to: '/technologies' },
      { label: 'nav.blog', to: '/blog' },
      { label: 'nav.news', to: '/news' },
      { label: 'nav.contact', to: '/contact' },
    ],
    socialLinks: [
      { name: 'GitHub', icon: '💻', url: 'https://github.com' },
      { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
      { name: 'X / Twitter', icon: '🐦', url: 'https://x.com' },
      { name: 'YouTube', icon: '▶️', url: 'https://youtube.com' },
      { name: 'Instagram', icon: '📷', url: 'https://instagram.com' },
    ],
    contact: {
      email: 'contact@mecnunum.dev',
      location: 'İstanbul, Türkiye',
    },
  }
}
