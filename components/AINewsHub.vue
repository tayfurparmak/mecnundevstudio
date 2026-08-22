<template>
  <div class="max-w-6xl mx-auto px-6 py-12 space-y-12 animate-fade-in">
    <!-- Header & Language Switcher -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
      <div class="space-y-3 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12121c] border border-cyan-500/30 text-cyan-400 text-xs font-semibold font-mono shadow-sm">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>{{ t('badge') }}</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {{ t('title') }}
        </h1>
        <p class="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          {{ t('subtitle') }}
        </p>
      </div>

      <!-- Language Switcher Group -->
      <div class="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0e0e16] border border-white/10 shadow-lg shrink-0">
        <button
          v-for="lang in SUPPORTED_LANGUAGES"
          :key="lang.code"
          type="button"
          @click="setLanguage(lang.code)"
          :class="[
            'px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 font-mono active:scale-95',
            currentLang === lang.code
              ? 'bg-gradient-to-r from-cyan-400 to-violet-600 text-black shadow-md neon-glow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          ]"
        >
          <span>{{ lang.flag }}</span>
          <span>{{ lang.code.toUpperCase() }}</span>
        </button>
      </div>
    </div>

    <!-- Search & Category Filters -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Category Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          @click="activeCategory = cat.id"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap font-mono active:scale-95',
            activeCategory === cat.id
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'bg-[#0e0e16] text-zinc-400 hover:text-white border border-white/10'
          ]"
        >
          {{ t(cat.key) }}
        </button>
      </div>

      <!-- Search Bar -->
      <div class="w-full sm:w-80 relative">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('searchPlaceholder')"
          class="w-full bg-[#0e0e16] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono shadow-inner placeholder:text-zinc-600"
        />
        <span class="absolute right-3.5 top-3 text-zinc-500 text-xs font-mono">⌘K</span>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="p-7 rounded-3xl bg-[#0e0e16] border border-white/10 animate-pulse space-y-4">
        <div class="h-4 bg-zinc-800 rounded w-1/3"></div>
        <div class="h-6 bg-zinc-800 rounded w-4/5"></div>
        <div class="h-16 bg-zinc-800/60 rounded w-full"></div>
      </div>
    </div>

    <!-- Content Matrix -->
    <div v-else class="space-y-8">
      <!-- Breaking / Featured News Banner -->
      <div v-if="breakingItem && !searchQuery && activeCategory === 'all'" class="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0e0e16] to-[#07070a] border border-cyan-500/40 shadow-2xl relative overflow-hidden group">
        <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="space-y-4 relative z-10">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="px-3 py-1 rounded-full bg-cyan-500 text-black font-extrabold text-[10px] font-mono tracking-widest uppercase shadow-md neon-glow-sm flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-black animate-ping"></span>
              {{ t('breaking') }}
            </span>
            <span class="text-xs font-mono text-cyan-400">{{ breakingItem.source }} • {{ breakingItem.date }}</span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-cyan-300 transition leading-snug">
            <a :href="breakingItem.sourceUrl" target="_blank" rel="noopener noreferrer" class="hover:underline">
              {{ breakingItem.title }}
            </a>
          </h2>

          <p class="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-4xl font-sans">
            {{ breakingItem.summary }}
          </p>

          <div class="pt-2 flex items-center justify-between">
            <span class="text-xs font-mono text-zinc-500 uppercase">Category: {{ breakingItem.category }}</span>
            <a
              :href="breakingItem.sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition active:scale-95 shadow-md font-mono"
            >
              {{ t('viewSource') }}
            </a>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredItems.length === 0" class="p-16 rounded-3xl border border-white/10 text-center space-y-3 bg-[#0e0e16]/40">
        <span class="text-3xl block">🔍</span>
        <h3 class="text-base font-bold text-white">{{ t('noResults') }}</h3>
      </div>

      <!-- News Grid Matrix -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NewsCard
          v-for="item in gridItems"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AIDispatchItem } from '~/server/api/ai-news'

const { currentLang, setLanguage, t } = useLanguage()

const categories = [
  { id: 'all', key: 'all' },
  { id: 'llm', key: 'llm' },
  { id: 'robotics', key: 'robotics' },
  { id: 'tools', key: 'tools' },
  { id: 'research', key: 'research' },
]

const activeCategory = ref('all')
const searchQuery = ref('')

const items = ref<AIDispatchItem[]>([])
const pending = ref(true)

const fetchNews = async (lang: string) => {
  pending.value = true
  try {
    const res = await $fetch<{ success: boolean; items: AIDispatchItem[] }>(`/api/ai-news?lang=${lang}`)
    if (res?.items) {
      items.value = res.items
    }
  } catch {
    items.value = []
  } finally {
    pending.value = false
  }
}

// Watch language changes and re-fetch
watch(currentLang, (newLang) => {
  fetchNews(newLang)
}, { immediate: true })

const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const matchesCategory = activeCategory.value === 'all' || item.category === activeCategory.value
    const matchesSearch =
      !searchQuery.value ||
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const breakingItem = computed(() => {
  return items.value.find((i) => i.isBreaking) || items.value[0]
})

const gridItems = computed(() => {
  if (!searchQuery.value && activeCategory.value === 'all' && breakingItem.value) {
    return filteredItems.value.filter((i) => i.id !== breakingItem.value?.id)
  }
  return filteredItems.value
})
</script>
