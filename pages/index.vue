<template>
  <div class="space-y-32 py-8 sm:py-16 animate-fade-in bg-cyber-grid min-h-screen relative">
    <!-- Ambient Cyber Glows -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] cyber-radial-glow pointer-events-none"></div>

    <!-- 1. Hero Command Hub Section -->
    <section class="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden px-6 max-w-6xl mx-auto rounded-3xl border border-white/10 bg-[#0e0e16]/80 backdrop-blur-2xl shadow-2xl">
      <!-- Neural Canvas Background -->
      <NeuralCanvas />

      <div class="relative z-10 max-w-4xl mx-auto text-center space-y-8 pt-10 pb-16 w-full">
        <!-- Live System Radar Badge -->
        <div class="flex justify-center">
          <SystemRadar />
        </div>

        <!-- Main Display Typography -->
        <div class="space-y-4 flex flex-col items-center">
          <h1 class="text-5xl sm:text-7xl md:text-9xl font-black text-white tracking-tight uppercase font-sans leading-none">
            {{ config.brand.name }}
          </h1>

          <!-- Cyan / Violet Glowing Accent Bar -->
          <div class="w-56 sm:w-80 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-violet-500 rounded-full neon-glow-cyan"></div>
        </div>

        <!-- Headline Motto -->
        <p class="text-xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight leading-snug">
          {{ config.brand.tagline }}
        </p>

        <!-- Subtitle Description -->
        <p class="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
          {{ config.brand.description }}
        </p>

        <!-- Interactive Hero Terminal (Kimi AI Prompt Simulator) -->
        <div class="pt-2 pb-4 text-left">
          <HeroTerminal />
        </div>

        <!-- CTA Action Buttons -->
        <div class="pt-2 flex flex-wrap items-center justify-center gap-4">
          <NuxtLink
            to="/admin"
            class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-black font-extrabold text-xs transition active:scale-95 shadow-lg neon-glow-cyan flex items-center gap-2"
          >
            <span>{{ t('hero.explore') }}</span>
            <span>⚡</span>
          </NuxtLink>

          <NuxtLink
            to="/blog"
            class="px-8 py-3.5 rounded-2xl bg-[#141420] border border-white/10 hover:border-cyan-400/50 text-zinc-300 hover:text-white text-xs font-bold transition active:scale-95 shadow-sm flex items-center gap-2"
          >
            <span>{{ t('hero.readBlog') }}</span>
            <span>📖</span>
          </NuxtLink>
        </div>

        <!-- Social Links Matrix -->
        <div class="pt-4 flex items-center justify-center gap-3 flex-wrap">
          <a
            v-for="social in config.socialLinks"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-2 rounded-xl bg-[#12121c] border border-white/10 hover:border-cyan-400 text-zinc-400 hover:text-cyan-300 text-xs font-semibold transition active:scale-95 flex items-center gap-2 shadow-xs"
          >
            <span>{{ social.icon }}</span>
            <span>{{ social.name }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- 2. Skill Matrix (Neon Segmented Progress Bars) -->
    <section class="max-w-6xl mx-auto px-6 space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div class="text-[11px] font-bold text-cyan-400 tracking-widest uppercase font-mono flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            SYNAPSE MATRIX // 01
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {{ t('skills.title') }}
          </h2>
        </div>
        <NuxtLink
          to="/technologies"
          class="text-xs font-bold text-cyan-400 hover:underline inline-flex items-center gap-1 transition font-mono"
        >
          <span>{{ t('skills.viewAll') }}</span>
          <span>→</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="skillsPending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 animate-pulse space-y-4">
          <div class="h-5 bg-zinc-800 rounded w-1/3"></div>
          <div class="h-3 bg-zinc-800 rounded-full w-full"></div>
        </div>
      </div>

      <!-- Neon Skill Matrix Component -->
      <NeonSkillMatrix v-else :skills="skills" />
    </section>

    <!-- 3. Goal & DailyLog Cybernetic Timeline -->
    <section class="max-w-6xl mx-auto px-6 space-y-10">
      <div class="border-b border-white/10 pb-5">
        <div class="text-[11px] font-bold text-violet-400 tracking-widest uppercase font-mono">CHRONO-TIMELINE // 02</div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          {{ t('goals.title') }}
        </h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Active Goals -->
        <div class="space-y-4">
          <h3 class="text-xs font-bold text-zinc-400 uppercase font-mono tracking-wider">{{ t('goals.activeGoals') }}</h3>

          <div v-if="goals.length === 0" class="p-8 rounded-3xl bg-[#0e0e16] border border-white/10 text-center text-xs text-zinc-500">
            Aktif hedef bulunmuyor.
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="goal in goals.slice(0, 3)"
              :key="goal.id"
              class="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-3 card-hover-cyber shadow-lg"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase font-mono">
                    {{ goal.category }}
                  </span>
                  <h4 class="text-sm font-bold text-white mt-2">{{ goal.title }}</h4>
                </div>
                <span class="text-xs font-mono font-bold text-emerald-400">%{{ goal.progress }}</span>
              </div>

              <div class="w-full bg-[#050508] h-2 rounded-full overflow-hidden border border-white/10">
                <div 
                  class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_#00f2fe]"
                  :style="{ width: `${goal.progress}%` }"
                ></div>
              </div>

              <div class="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Deadline: {{ goal.targetDate }}</span>
                <span class="text-cyan-400">{{ goal.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- DailyLog Timeline -->
        <div class="space-y-4">
          <h3 class="text-xs font-bold text-zinc-400 uppercase font-mono tracking-wider">{{ t('goals.dailyLogs') }}</h3>

          <div v-if="dailyLogs.length === 0" class="p-8 rounded-3xl bg-[#0e0e16] border border-white/10 text-center text-xs text-zinc-500">
            Günlük kayıt bulunmuyor.
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="log in dailyLogs.slice(0, 3)"
              :key="log.id"
              class="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-3 card-hover-cyber shadow-lg"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-mono text-cyan-400 font-bold">{{ formatDate(log.createdAt) }}</span>
                <span v-if="log.technology" class="px-2 py-0.5 rounded bg-[#161625] text-zinc-300 border border-white/10 font-mono text-[10px]">
                  {{ log.technology }}
                </span>
              </div>

              <p class="text-sm font-bold text-white">{{ log.todoTask }}</p>

              <p v-if="log.learningLog" class="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                💡 {{ log.learningLog }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Knowledge Base / Blog Posts (Terminal Output Cards) -->
    <section class="max-w-6xl mx-auto px-6 space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div class="text-[11px] font-bold text-cyan-400 tracking-widest uppercase font-mono">KNOWLEDGE BASE // 03</div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {{ t('blog.title') }}
          </h2>
        </div>
        <NuxtLink
          to="/blog"
          class="text-xs font-bold text-cyan-400 hover:underline inline-flex items-center gap-1 transition font-mono"
        >
          <span>{{ t('blog.readAll') }}</span>
          <span>→</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="blogPending" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 animate-pulse space-y-3">
          <div class="h-4 bg-zinc-800 rounded w-1/4"></div>
          <div class="h-5 bg-zinc-800 rounded w-3/4"></div>
          <div class="h-3.5 bg-zinc-800 rounded w-full"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="latestPosts.length === 0" class="p-14 rounded-3xl border border-white/10 text-center space-y-2 bg-[#0e0e16]/40">
        <span class="text-3xl block">✍️</span>
        <h3 class="text-sm font-bold text-zinc-200">Teknik Yazılar Hazırlanıyor</h3>
        <p class="text-xs text-zinc-500">Öğrenme sürecinde tutulan notlar yakında burada yayınlanacaktır.</p>
      </div>

      <!-- Posts Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article
          v-for="post in latestPosts"
          :key="post.id"
          class="p-6 sm:p-7 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4 card-hover-cyber shadow-xl flex flex-col justify-between group"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs text-zinc-400">
              <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-mono">
                DOCS.LOG
              </span>
              <time class="font-mono text-[11px]">{{ formatDate(post.createdAt) }}</time>
            </div>

            <h3 class="text-lg font-bold text-white group-hover:text-cyan-300 transition leading-snug">
              <NuxtLink :to="`/blog/${post.slug}`" class="hover:underline">
                {{ post.title }}
              </NuxtLink>
            </h3>

            <p class="text-zinc-400 text-xs leading-relaxed line-clamp-3 font-sans">
              {{ getExcerpt(post.content) }}
            </p>
          </div>

          <div class="pt-3 border-t border-white/5 flex items-center justify-between">
            <NuxtLink
              :to="`/blog/${post.slug}`"
              class="text-xs font-bold text-cyan-400 hover:underline inline-flex items-center gap-1 transition font-mono"
            >
              <span>{{ t('blog.readArticle') }}</span>
              <span>→</span>
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <!-- 5. Autonomous Command CTA Banner -->
    <section class="max-w-6xl mx-auto px-6">
      <div class="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/30 via-[#0e0e16] to-[#050508] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
        <div class="space-y-2 max-w-xl">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fikirleri Koda ve Ürüne Dönüştürelim 🚀
          </h2>
          <p class="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Yazılım mimarisi, yapay zeka entegrasyonları ve ileri düzey web sistemleri için iletişime geçin.
          </p>
        </div>

        <NuxtLink
          to="/contact"
          class="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-black font-extrabold text-xs transition active:scale-95 shadow-lg neon-glow-cyan shrink-0"
        >
          {{ t('nav.contact') }} →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import NeuralCanvas from '~/components/Common/NeuralCanvas.vue'
import SystemRadar from '~/components/Common/SystemRadar.vue'
import HeroTerminal from '~/components/Common/HeroTerminal.vue'
import NeonSkillMatrix from '~/components/Learning/NeonSkillMatrix.vue'
import { useI18n } from '~/composables/useI18n'

const config = useSiteConfig()
const { t } = useI18n()

useSeoMeta({
  title: `${config.brand.name} • ${config.brand.tagline}`,
  description: config.brand.description,
  ogTitle: `${config.brand.name} • ${config.brand.subTagline}`,
  ogDescription: config.brand.description,
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://mecnunum.dev' }
  ],
  script: [
    {
      type: 'application/ld+json' as any,
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": "https://mecnunum.dev/#website",
            "url": "https://mecnunum.dev",
            "name": "MECNUNUM",
            "description": "Yapay zeka, modern full-stack web mimarileri ve bilgisayar mühendisliği vizyonuyla inşa edilen kişisel teknoloji ve öğrenme stüdyosu.",
            "publisher": {
              "@id": "https://mecnunum.dev/#person"
            }
          },
          {
            "@type": "Person",
            "@id": "https://mecnunum.dev/#person",
            "name": "Tayfur",
            "url": "https://mecnunum.dev",
            "jobTitle": "Full-Stack Developer & Software Engineer",
            "sameAs": [
              "https://twitter.com/mecnunum",
              "https://github.com/mecnunum"
            ]
          }
        ]
      })
    }
  ]
})

const { data: skillsData, pending: skillsPending } = await useFetch<{ success: boolean; skills: any[] }>('/api/tracker')
const skills = computed(() => skillsData.value?.skills || [])

const { data: blogData, pending: blogPending } = await useFetch<{ success: boolean; posts: any[] }>('/api/blog')
const latestPosts = computed(() => (blogData.value?.posts || []).slice(0, 3))

const { data: goalsData } = await useFetch<{ success: boolean; goals: any[] }>('/api/goals')
const goals = computed(() => goalsData.value?.goals || [])

const { data: logsData } = await useFetch<{ success: boolean; logs: any[] }>('/api/daily-log')
const dailyLogs = computed(() => logsData.value?.logs || [])

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
