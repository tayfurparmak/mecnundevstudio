<template>
  <div class="max-w-4xl mx-auto px-6 py-12 space-y-12">
    <!-- Header -->
    <div class="space-y-4 border-b border-white/8 pb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1017] border border-sky-500/30 text-sky-400 text-xs font-semibold font-mono">
        <span>📰</span>
        <span>Gelişmeler & Kilometre Taşları</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
        Haberler, Sürümler & Süreç 🚀
      </h1>
      <p class="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
        Platform geliştirmeleri, açık kaynak projeler ve öğrenme sürecimdeki önemli kilometre taşları.
      </p>
    </div>

    <!-- Timeline Grid of News / Milestones -->
    <div class="space-y-8 relative before:absolute before:inset-0 before:left-5 md:before:left-32 before:w-0.5 before:bg-white/8">
      <div
        v-for="item in newsItems"
        :key="item.id"
        class="relative flex flex-col md:flex-row items-start gap-6 md:gap-10 group"
      >
        <!-- Date Badge (Desktop Left) -->
        <div class="md:w-28 text-left md:text-right shrink-0 pt-1">
          <time class="text-xs font-mono font-bold text-sky-400 block">{{ item.date }}</time>
          <span class="text-[10px] text-slate-500 font-mono">{{ item.tag }}</span>
        </div>

        <!-- Node Dot -->
        <div class="absolute left-5 md:left-32 -translate-x-1/2 w-4 h-4 rounded-full bg-[#05070A] border-2 border-sky-400 group-hover:scale-125 transition-transform flex items-center justify-center shadow-[0_0_8px_#38bdf8]">
          <div class="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
        </div>

        <!-- Content Card -->
        <div class="ml-10 md:ml-0 flex-1 p-6 sm:p-7 rounded-3xl bg-[#0B1017] border border-white/8 space-y-3 hover:border-sky-500/50 card-hover-lift shadow-lg">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800/80 uppercase font-mono">
              {{ item.category }}
            </span>
            <span class="text-xs text-slate-500 font-mono font-semibold">{{ item.version }}</span>
          </div>

          <h3 class="text-lg font-bold text-white group-hover:text-sky-300 transition">
            {{ item.title }}
          </h3>

          <p class="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
            {{ item.summary }}
          </p>

          <ul v-if="item.highlights" class="pt-2 space-y-1.5 text-xs text-slate-300 border-t border-white/5 font-sans">
            <li v-for="(h, idx) in item.highlights" :key="idx" class="flex items-center gap-2">
              <span class="text-emerald-400 font-bold">✓</span>
              <span>{{ h }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useSiteConfig()

useSeoMeta({
  title: `Haberler & Gelişmeler • ${config.brand.name}`,
  description: 'Platform geliştirmeleri, açık kaynak sürümleri ve öğrenme sürecindeki son kilometre taşları.',
  ogTitle: `Haberler & Gelişmeler • ${config.brand.name}`,
  ogDescription: 'Platform geliştirmeleri ve son teknik kilometre taşları.',
})

const newsItems = ref([
  {
    id: 1,
    date: 'Ağustos 2026',
    tag: 'Sürüm Yayını',
    category: 'Platform Sürümü',
    version: 'v2.3',
    title: 'MECNUNUM Premium Dark Neural UI & Synaptic Network Yayında! 🌐',
    summary: 'LEARNING × AI × HUMAN BRAIN × TECHNOLOGY vizyonuyla, 60fps HTML5 Canvas Synaptic Neural Network eşliğinde saf ve ultra modern koyu tema yayına alındı.',
    highlights: [
      'Canlı ve hafif HTML5 Canvas Synaptic Neural Network motoru',
      'Canlı SkillTracker ve yayınlanmış blog yazıları entegrasyonu',
      'Tamamen izole ve güvenli mimari (Direct DB ve Mutation koruması)'
    ]
  },
  {
    id: 2,
    date: 'Ağustos 2026',
    tag: 'AI Entegrasyonu',
    category: 'Yapay Zeka',
    version: 'v2.1',
    title: 'Gemini 3.6 Flash ile Akıllı Quiz ve İçerik Motoru 🤖',
    summary: 'Google GenAI SDK entegre edilerek kişisel notlardan otomatik çoktan seçmeli pratik quizler türeten ve blog yazılarını zenginleştiren sistem devreye alındı.',
    highlights: [
      'Kişisel notlardan 3 soruluk açıklamalı pekiştirme sınavları',
      'Server-side API güvenliği ve izole token yönetimi'
    ]
  },
  {
    id: 3,
    date: 'Temmuz 2026',
    tag: 'Mühendislik',
    category: 'Altyapı',
    version: 'v1.5',
    title: 'PostgreSQL & Supabase Veritabanı Mimarisine Geçiş 🗄️',
    summary: 'Öğrenme jurnalleri, hedefler, teknik İngilizce kelime dağarcığı ve Kanban panosu için ilişkisel veri yapısı başarıyla kuruldu.',
    highlights: [
      'Prisma 7 ORM ve PostgreSQL veri bütünlüğü',
      'Aralıklı Tekrar (Spaced Repetition) kelime ezberleme motoru'
    ]
  }
])
</script>