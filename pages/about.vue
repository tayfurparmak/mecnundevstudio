<template>
  <div class="max-w-4xl mx-auto px-6 py-12 space-y-16">
    <!-- Header -->
    <div class="space-y-4 border-b border-white/8 pb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1017] border border-sky-500/30 text-sky-400 text-xs font-semibold font-mono">
        <span>👤</span>
        <span>Hakkımda & Vizyon</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
        Mühendislik, Zihin ve Üretim 🧠
      </h1>
      <p class="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
        {{ config.brand.tagline }}
      </p>
    </div>

    <!-- Bio / Story Section -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <div class="md:col-span-8 space-y-6 text-slate-300 text-sm leading-relaxed">
        <div class="p-6 sm:p-7 rounded-3xl bg-[#0B1017] border border-white/8 space-y-4 shadow-md">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>🎓</span>
            <span>Kimim & Mühendislik Yaklaşımım</span>
          </h2>
          <p>
            Merhaba! Ben bilgisayar mühendisliği vizyonuyla hareket eden, modern yazılım ekosisteminde sürekli öğrenmeyi ve üretmeyi ilke edinmiş bir geliştiriciyim.
          </p>
          <p>
            Yazılım benim için yalnızca kod satırlarından ibaret değildir; insan zihninin düşünme gücünü, algoritmik yapılar ve yapay zeka çarpanıyla somut, yaşayan sistemlere dönüştürme sanatıdır.
          </p>
        </div>

        <div class="p-6 sm:p-7 rounded-3xl bg-[#0B1017] border border-white/8 space-y-4 shadow-md">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>⚡</span>
            <span>Öğrenme & Üretim Felsefem</span>
          </h2>
          <p>
            Teknolojinin katlanarak dönüştüğü günümüzde, yüzeysel bilgi yerine "First Principles Thinking" (İlk İlkelerden Düşünme) metodolojisini benimsiyorum. Her yeni teknolojiyi gerçek projeler ve canlı mimariler üzerinde test ederek öğreniyorum.
          </p>
          <p>
            Bu stüdyo (<strong class="text-sky-400">{{ config.brand.name }}</strong>), öğrendiğim her konsepti canlı veritabanı, yapay zeka asistanları ve teknik blog makaleleriyle kayıt altına aldığım açık bir dijital düşünce merkezidir.
          </p>
        </div>
      </div>

      <!-- Quick Info / Stat Card Sidebar (4 cols) -->
      <div class="md:col-span-4 space-y-4">
        <div class="p-6 rounded-3xl bg-[#0B1017] border border-white/8 space-y-4 shadow-md">
          <h3 class="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">ODAK ALANLARI</h3>
          <ul class="space-y-2 text-xs font-semibold text-slate-300">
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              <span>Full-Stack Web (Nuxt, Vue, TS)</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>Python & Backend Servisleri</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span>Generative AI (Gemini LLM)</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>PostgreSQL & Veri Mimarisi</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              <span>Teknik İngilizce (CEFR SRS)</span>
            </li>
          </ul>
        </div>

        <div class="p-6 rounded-3xl bg-[#0E141E] border border-sky-500/20 space-y-3">
          <div class="text-xl">📍</div>
          <h4 class="text-sm font-bold text-white">İletişim & Lokasyon</h4>
          <p class="text-xs text-slate-400 font-mono">{{ config.contact.location }}</p>
          <NuxtLink
            to="/contact"
            class="inline-block pt-1 text-xs font-bold text-sky-400 hover:underline transition"
          >
            İletişim Formuna Git →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Core Values Section -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-white tracking-tight">Temel Değerler & İlkeler 🧭</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-[#0B1017] border border-white/8 space-y-2">
          <span class="text-2xl">🎯</span>
          <h3 class="text-sm font-bold text-white">Sürekli Gelişim</h3>
          <p class="text-xs text-slate-400 leading-relaxed">Her gün küçük de olsa somut bir nöronik ilerleme kaydetmek.</p>
        </div>

        <div class="p-5 rounded-2xl bg-[#0B1017] border border-white/8 space-y-2">
          <span class="text-2xl">🏛️</span>
          <h3 class="text-sm font-bold text-white">Temiz Mimari</h3>
          <p class="text-xs text-slate-400 leading-relaxed">Okunabilir, test edilebilir ve güvenli kod üretmek.</p>
        </div>

        <div class="p-5 rounded-2xl bg-[#0B1017] border border-white/8 space-y-2">
          <span class="text-2xl">🤝</span>
          <h3 class="text-sm font-bold text-white">Açık Paylaşım</h3>
          <p class="text-xs text-slate-400 leading-relaxed">Öğrenilen teknik bilgileri toplulukla şeffaf paylaşmak.</p>
        </div>

        <div class="p-5 rounded-2xl bg-[#0B1017] border border-white/8 space-y-2">
          <span class="text-2xl">🤖</span>
          <h3 class="text-sm font-bold text-white">AI ile Güçlenme</h3>
          <p class="text-xs text-slate-400 leading-relaxed">Yapay zekayı problem çözme hızını artıran bir çarpan olarak kullanmak.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useSiteConfig()

useSeoMeta({
  title: `Hakkımda • ${config.brand.name}`,
  description: 'Bilgisayar mühendisliği vizyonu, teknoloji ilgileri, sürekli öğrenme felsefesi ve full-stack geliştirme yaklaşımı.',
  ogTitle: `Hakkımda • ${config.brand.name}`,
  ogDescription: 'Bilgisayar mühendisliği vizyonu, teknoloji ilgileri ve geliştirme yaklaşımı.',
})
</script>
