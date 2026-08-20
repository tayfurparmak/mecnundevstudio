<template>
  <div class="space-y-32 py-4 sm:py-8">
    <!-- 1. Hero Section: 3-Layer Neural Experience -->
    <section class="relative min-h-[85vh] flex flex-col justify-center items-center overflow-hidden px-6 max-w-6xl mx-auto rounded-3xl">
      <!-- Layer 1: Deep Dark Gradient Mesh -->
      <div class="absolute inset-0 bg-radial from-sky-950/20 via-[#05070A] to-[#05070A] pointer-events-none"></div>

      <!-- Layer 2: Live HTML5 Canvas Synaptic Neural Network -->
      <NeuralCanvas />

      <!-- Layer 3: Foreground Content & Typography -->
      <div class="relative z-10 max-w-4xl mx-auto text-center space-y-7 pt-12 pb-16">
        <!-- Sub-tagline Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E141E]/90 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold tracking-widest uppercase shadow-sm neural-glow-sm">
          <span class="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
          <span>{{ config.brand.subTagline }}</span>
        </div>

        <!-- Main Display Brand Typography -->
        <div class="space-y-3 flex flex-col items-center">
          <h1 class="text-5xl sm:text-7xl md:text-9xl font-black text-white tracking-tight uppercase font-sans leading-none">
            {{ config.brand.name }}
          </h1>

          <!-- Neural Cyan Accent Bar -->
          <div class="w-44 sm:w-64 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent rounded-full shadow-[0_0_12px_#38bdf8]"></div>
        </div>

        <!-- Headline Motto -->
        <p class="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-snug">
          {{ config.brand.tagline }}
        </p>

        <!-- Subtitle Description -->
        <p class="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
          {{ config.brand.description }}
        </p>

        <!-- CTA Buttons -->
        <div class="pt-4 flex flex-wrap items-center justify-center gap-4">
          <NuxtLink
            to="/technologies"
            class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-black font-black text-xs transition shadow-lg shadow-sky-500/25 hover:shadow-sky-400/40 hover:scale-105 flex items-center gap-2"
          >
            <span>Öğrenme Yolculuğum</span>
            <span>→</span>
          </NuxtLink>

          <NuxtLink
            to="/blog"
            class="px-8 py-3.5 rounded-2xl bg-[#0B1017] border border-white/10 hover:border-sky-500/50 text-slate-300 hover:text-white text-xs font-bold transition shadow-sm hover:scale-102 flex items-center gap-2"
          >
            <span>Yazıları Keşfet</span>
            <span>📖</span>
          </NuxtLink>
        </div>

        <!-- Social Icons Row -->
        <div class="pt-4 flex items-center justify-center gap-2.5 flex-wrap">
          <a
            v-for="social in config.socialLinks"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3.5 py-1.5 rounded-xl bg-[#0B1017]/80 border border-white/8 hover:border-sky-500 text-slate-400 hover:text-sky-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs hover:scale-105"
          >
            <span>{{ social.icon }}</span>
            <span>{{ social.name }}</span>
          </a>
        </div>
      </div>

      <!-- Minimal Animated Scroll Indicator -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[10px] font-mono text-slate-500 opacity-80 hover:opacity-100 transition animate-bounce">
        <span>↓ Keşfet</span>
      </div>
    </section>

    <!-- 2. Currently Learning / Live Neural Progress -->
    <section class="max-w-6xl mx-auto px-6 space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <div class="text-[11px] font-bold text-sky-400 tracking-wider uppercase font-mono">CANLI NÖRONİK GELİŞİM</div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Aktif Olarak Öğrendiklerim ⚡
          </h2>
        </div>
        <NuxtLink
          to="/technologies"
          class="text-xs font-bold text-sky-400 hover:underline inline-flex items-center gap-1 transition"
        >
          <span>Tüm Teknolojileri & Konuları İncele</span>
          <span>→</span>
        </NuxtLink>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="skillsPending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="i in 3" :key="i" class="p-6 rounded-3xl bg-[#0B1017]/60 border border-white/8 animate-pulse space-y-4">
          <div class="h-5 bg-slate-800 rounded w-1/3"></div>
          <div class="h-3 bg-slate-800 rounded-full w-full"></div>
        </div>
      </div>

      <!-- Live Skills Cards Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="skill in skills.slice(0, 6)"
          :key="skill.id"
          class="p-6 rounded-3xl bg-[#0B1017] border border-white/8 space-y-4 hover:border-sky-500/50 card-hover-lift shadow-lg group relative overflow-hidden"
        >
          <div class="flex items-center justify-between">
            <span class="text-base font-bold text-white group-hover:text-sky-300 transition">
              {{ skill.skillName }}
            </span>
            <span class="font-mono text-sm font-black text-sky-400">%{{ skill.percentage }}</span>
          </div>

          <!-- Neon Glow Progress Bar -->
          <div class="w-full bg-[#05070A] h-2.5 rounded-full overflow-hidden border border-white/8 p-0.5">
            <div
              class="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_10px_#38bdf8]"
              :style="{ width: `${skill.percentage}%` }"
            ></div>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
              <span>Canlı Takip</span>
            </span>
            <span class="font-mono font-medium text-slate-400">{{ getSkillCategory(skill.skillName) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Featured Published Technical Articles -->
    <section class="max-w-6xl mx-auto px-6 space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <div class="text-[11px] font-bold text-sky-400 tracking-wider uppercase font-mono">DOKÜMANTASYON & ARŞİV</div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Son Yayınlanan Teknik Yazılar 📖
          </h2>
        </div>
        <NuxtLink
          to="/blog"
          class="text-xs font-bold text-sky-400 hover:underline inline-flex items-center gap-1 transition"
        >
          <span>Tüm Makaleleri Oku</span>
          <span>→</span>
        </NuxtLink>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="blogPending" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="p-6 rounded-3xl bg-[#0B1017]/60 border border-white/8 animate-pulse space-y-3">
          <div class="h-4 bg-slate-800 rounded w-1/4"></div>
          <div class="h-5 bg-slate-800 rounded w-3/4"></div>
          <div class="h-3.5 bg-slate-800 rounded w-full"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="latestPosts.length === 0" class="p-14 rounded-3xl border border-white/8 text-center space-y-2 bg-[#0B1017]/40">
        <span class="text-3xl block">✍️</span>
        <h3 class="text-sm font-bold text-slate-200">Yeni Teknik Yazılar Hazırlanıyor</h3>
        <p class="text-xs text-slate-500">Öğrenme sürecinde tutulan notlar yakında burada yayınlanacaktır.</p>
      </div>

      <!-- Articles Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article
          v-for="post in latestPosts"
          :key="post.id"
          class="p-6 sm:p-7 rounded-3xl bg-[#0B1017] border border-white/8 space-y-4 hover:border-sky-500/50 card-hover-lift shadow-lg flex flex-col justify-between group"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-sky-950/80 text-sky-300 border border-sky-800/80 font-mono">
                Teknik Not
              </span>
              <time class="font-mono text-[11px]">{{ formatDate(post.createdAt) }}</time>
            </div>

            <h3 class="text-lg font-bold text-white group-hover:text-sky-300 transition leading-snug">
              <NuxtLink :to="`/blog/${post.slug}`" class="hover:underline">
                {{ post.title }}
              </NuxtLink>
            </h3>

            <p class="text-slate-400 text-xs leading-relaxed line-clamp-3 font-sans">
              {{ getExcerpt(post.content) }}
            </p>
          </div>

          <div class="pt-3 border-t border-white/5 flex items-center justify-between">
            <NuxtLink
              :to="`/blog/${post.slug}`"
              class="text-xs font-bold text-sky-400 hover:underline inline-flex items-center gap-1 transition"
            >
              <span>Yazıyı İncele</span>
              <span>→</span>
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <!-- 4. Learning Journey Section: Editorial Timeline -->
    <section class="max-w-6xl mx-auto px-6 space-y-10">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <div class="text-[11px] font-bold text-sky-400 tracking-wider uppercase font-mono">ÖĞRENME METODOLOJİSİ</div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Nöral Öğrenme & Üretim Felsefesi 🧭
        </h2>
        <p class="text-slate-400 text-xs sm:text-sm">
          Teorik mühendislik temellerini pratik üretime dönüştüren 4 adımlı döngü.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="p-6 rounded-3xl bg-[#0B1017] border border-white/8 space-y-3 shadow-md relative overflow-hidden">
          <div class="text-xs font-mono font-black text-sky-400/60">PHASE 01</div>
          <div class="text-2xl">🧠</div>
          <h3 class="text-base font-bold text-white">LEARN (Kavrama)</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            First principles yaklaşımıyla algoritmaları, mimarileri ve kavramsal temelleri derinlemesine anlama.
          </p>
        </div>

        <div class="p-6 rounded-3xl bg-[#0B1017] border border-white/8 space-y-3 shadow-md relative overflow-hidden">
          <div class="text-xs font-mono font-black text-blue-400/60">PHASE 02</div>
          <div class="text-2xl">⚡</div>
          <h3 class="text-base font-bold text-white">PRACTICE (Pekiştirme)</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Aralıklı tekrar (SRS), pratik quizler ve kod denemeleriyle bilgiyi sinapslara dönüştürme.
          </p>
        </div>

        <div class="p-6 rounded-3xl bg-[#0B1017] border border-white/8 space-y-3 shadow-md relative overflow-hidden">
          <div class="text-xs font-mono font-black text-indigo-400/60">PHASE 03</div>
          <div class="text-2xl">🛠️</div>
          <h3 class="text-base font-bold text-white">BUILD (İnşa Etme)</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Öğrenilen teknolojileri Nuxt 4, TypeScript, PostgreSQL ve AI modelleriyle canlı ürünlere dönüştürme.
          </p>
        </div>

        <div class="p-6 rounded-3xl bg-[#0B1017] border border-white/8 space-y-3 shadow-md relative overflow-hidden">
          <div class="text-xs font-mono font-black text-emerald-400/60">PHASE 04</div>
          <div class="text-2xl">🌐</div>
          <h3 class="text-base font-bold text-white">SHARE (Paylaşma)</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Teknik blog makaleleri ve açık dokümantasyonla bilgiyi ekosistemle paylaşma.
          </p>
        </div>
      </div>
    </section>

    <!-- 5. Collaboration / Contact CTA Banner -->
    <section class="max-w-6xl mx-auto px-6">
      <div class="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-950/40 via-[#0B1017] to-[#05070A] border border-sky-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
        <div class="space-y-2 max-w-xl">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bir Fikir veya Proje mi Düşünüyorsunuz? 💡
          </h2>
          <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Yazılım geliştirme, yapay zeka entegrasyonları veya teknoloji konularında fikir alışverişi için dilediğiniz zaman iletişime geçebilirsiniz.
          </p>
        </div>

        <NuxtLink
          to="/contact"
          class="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-black font-extrabold text-xs transition shadow-lg shadow-sky-500/30 hover:scale-105 shrink-0"
        >
          Mesaj Gönderin →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import NeuralCanvas from '~/components/Common/NeuralCanvas.vue'

const config = useSiteConfig()

// SEO Metadata
useSeoMeta({
  title: `${config.brand.name} • ${config.brand.tagline}`,
  description: config.brand.description,
  ogTitle: `${config.brand.name} • ${config.brand.subTagline}`,
  ogDescription: config.brand.description,
})

// Fetch dynamic skills from public API
const { data: skillsData, pending: skillsPending } = await useFetch<{ success: boolean; skills: any[] }>('/api/tracker')
const skills = computed(() => skillsData.value?.skills || [])

// Fetch latest 3 published blog posts
const { data: blogData, pending: blogPending } = await useFetch<{ success: boolean; posts: any[] }>('/api/blog')
const latestPosts = computed(() => (blogData.value?.posts || []).slice(0, 3))

const getSkillCategory = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('python')) return 'Backend'
  if (n.includes('nuxt') || n.includes('vue')) return 'Frontend'
  if (n.includes('type') || n.includes('java')) return 'Diller'
  if (n.includes('ai') || n.includes('llm')) return 'Yapay Zeka'
  if (n.includes('eng')) return 'İngilizce'
  return 'Full-Stack'
}

const getExcerpt = (content: string) => {
  if (!content) return ''
  const plainText = content
    .replace(/#+/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~>]/g, '')
    .trim()
  return plainText.length > 140 ? `${plainText.slice(0, 140)}...` : plainText
}

const formatDate = (dateInput: string | Date) => {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}
</script>