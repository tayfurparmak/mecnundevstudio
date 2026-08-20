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
        {
          name: 'description',
          content: 'MECNUNUM — Yapay zeka, modern full-stack web mimarileri ve bilgisayar mühendisliği vizyonuyla inşa edilen kişisel teknoloji ve öğrenme stüdyosu.',
        },
        { property: 'og:site_name', content: 'MECNUNUM' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
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