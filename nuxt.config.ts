import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css: ['~/styles/main.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'tr',
        class: 'dark',
      },
      title: 'MECNUNUM • LEARNING × AI × HUMAN BRAIN × TECHNOLOGY',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' },
        { name: 'theme-color', content: '#05070a' },
        { name: 'description', content: 'MECNUNUM — Yapay zeka, modern full-stack web mimarileri ve bilgisayar mühendisliği vizyonuyla inşa edilen kişisel teknoloji ve öğrenme stüdyosu.' },
        { property: 'og:site_name', content: 'MECNUNUM' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'MECNUNUM • LEARNING × AI × HUMAN BRAIN × TECHNOLOGY' },
        { property: 'og:description', content: 'MECNUNUM — Yapay zeka, modern full-stack web mimarileri ve bilgisayar mühendisliği vizyonuyla inşa edilen kişisel teknoloji ve öğrenme stüdyosu.' },
        { property: 'og:image', content: 'https://mecnunum.dev/og-image.png' },
        { property: 'og:url', content: 'https://mecnunum.dev' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@mecnunum' },
        { name: 'twitter:creator', content: '@mecnunum' },
        { name: 'twitter:title', content: 'MECNUNUM • LEARNING × AI × HUMAN BRAIN × TECHNOLOGY' },
        { name: 'twitter:description', content: 'MECNUNUM — Yapay zeka, modern full-stack web mimarileri ve bilgisayar mühendisliği vizyonuyla inşa edilen kişisel teknoloji ve öğrenme stüdyosu.' },
        { name: 'twitter:image', content: 'https://mecnunum.dev/og-image.png' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // Server-only runtime config (Secrets never leak to client bundle)
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
    adminSecretPassword: process.env.ADMIN_SECRET_PASSWORD,
    geminiApiKey: process.env.GEMINI_API_KEY,
    public: {
      siteUrl: process.env.SITE_URL || 'https://mecnunum.dev',
      appName: 'MECNUNUM',
    },
  },

  // Nitro Production Security Headers
  nitro: {
    compressPublicAssets: true,
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'X-XSS-Protection': '1; mode=block',
        },
      },
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})