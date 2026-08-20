<template>
  <div class="space-y-10 max-w-4xl mx-auto py-12 px-6">
    <!-- Header -->
    <div class="border-b border-white/8 pb-8 space-y-3">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1017] text-sky-400 border border-sky-500/30 text-xs font-semibold font-mono">
        <span>📖</span>
        <span>Yazılar & Teknik Notlar</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
        Blog & Teknik Arşiv
      </h1>
      <p class="text-slate-400 text-sm sm:text-base max-w-xl font-sans">
        Öğrenme sürecimde tuttuğum notlar, teknik rehberler ve detaylı makaleler.
      </p>
    </div>

    <!-- Search / Filter Input -->
    <div class="flex items-center justify-between gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Başlık veya içerikte ara..."
        class="bg-[#0B1017] border border-white/8 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition w-full sm:w-80 shadow-xs"
      />
      <span class="text-xs text-slate-500 font-mono hidden sm:inline">
        {{ filteredPosts.length }} Yazı Mevcut
      </span>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="p-6 sm:p-8 rounded-3xl bg-[#0B1017]/60 border border-white/8 animate-pulse space-y-4">
        <div class="h-5 bg-slate-800 rounded w-2/3"></div>
        <div class="h-3.5 bg-slate-800/60 rounded w-full"></div>
        <div class="h-3 bg-slate-800/40 rounded w-1/4"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8 rounded-3xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs text-center">
      Yazılar yüklenirken bir sorun oluştu.
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredPosts.length === 0"
      class="p-16 rounded-3xl border-2 border-dashed border-white/8 text-center space-y-3 bg-[#0B1017]/30"
    >
      <span class="text-3xl block">📖</span>
      <h3 class="text-sm font-bold text-slate-300">
        {{ searchQuery ? 'Aradığınız kriterde yazı bulunamadı' : 'Henüz Yayınlanmış Blog Yazısı Bulunmuyor' }}
      </h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        {{ searchQuery ? 'Farklı bir arama terimi deneyebilirsiniz.' : 'Yeni teknik yazılar ve notlar yakında burada yayınlanacaktır.' }}
      </p>
    </div>

    <!-- Published Posts Grid / List -->
    <div v-else class="space-y-6">
      <article
        v-for="post in filteredPosts"
        :key="post.id"
        class="p-6 sm:p-8 rounded-3xl bg-[#0B1017] border border-white/8 space-y-4 hover:border-sky-500/50 card-hover-lift shadow-lg group"
      >
        <div class="flex items-center justify-between gap-2 text-xs text-slate-400">
          <span class="text-sky-300 font-bold px-2.5 py-0.5 rounded-md bg-sky-950/80 border border-sky-900/60 text-[10px] font-mono">
            Teknik Doküman
          </span>
          <div class="flex items-center gap-3">
            <span class="font-mono text-[11px]">{{ getReadingTime(post.content) }} okuma</span>
            <time :datetime="String(post.createdAt)" class="font-mono text-[11px]">{{ formatDate(post.createdAt) }}</time>
          </div>
        </div>

        <h2 class="text-xl sm:text-2xl font-bold text-white group-hover:text-sky-300 transition leading-snug">
          <NuxtLink :to="`/blog/${post.slug}`" class="hover:underline">
            {{ post.title }}
          </NuxtLink>
        </h2>

        <p class="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3 font-sans">
          {{ getExcerpt(post.content) }}
        </p>

        <div class="pt-3 border-t border-white/5 flex items-center justify-between">
          <NuxtLink
            :to="`/blog/${post.slug}`"
            class="text-xs font-bold text-sky-400 hover:underline inline-flex items-center gap-1.5 transition"
          >
            <span>Yazıyı Oku</span>
            <span>→</span>
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useSiteConfig()

useSeoMeta({
  title: `Blog & Teknik Dokümanlar • ${config.brand.name}`,
  description: 'Yapay zeka, modern web mimarileri ve teknik İngilizce öğrenme notları, rehberler ve makaleler.',
  ogTitle: `Blog & Teknik Dokümanlar • ${config.brand.name}`,
  ogDescription: 'Yapay zeka ve modern web mimarileri üzerine teknik makaleler.',
})

interface PostSummary {
  id: number
  title: string
  slug: string
  content: string
  isPublished: boolean
  createdAt: string | Date
}

const searchQuery = ref('')

const { data, pending, error } = await useFetch<{ success: boolean; posts: PostSummary[] }>('/api/blog')
const posts = computed(() => data.value?.posts || [])

const filteredPosts = computed(() => {
  if (!searchQuery.value.trim()) return posts.value
  const q = searchQuery.value.toLowerCase()
  return posts.value.filter(
    (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
  )
})

const getReadingTime = (content: string) => {
  if (!content) return '1 dk'
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} dk`
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
  return plainText.length > 220 ? `${plainText.slice(0, 220)}...` : plainText
}

const formatDate = (dateInput: string | Date) => {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return String(dateInput)

  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
</script>