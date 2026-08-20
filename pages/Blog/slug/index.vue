<template>
  <div class="max-w-3xl mx-auto space-y-8 py-10 px-4 sm:px-6">
    <!-- Back Navigation & Actions -->
    <div class="flex items-center justify-between">
      <NuxtLink 
        to="/blog" 
        class="text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1.5 transition group"
      >
        <span class="group-hover:-translate-x-0.5 transition-transform">←</span>
        <span>Tüm Blog Yazılarına Dön</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="copyShareUrl"
          class="text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <span>🔗</span>
          <span>Paylaş</span>
        </button>

        <!-- Admin Quick Edit Button -->
        <NuxtLink
          v-if="post && user?.role === 'admin'"
          :to="`/admin/cms/editor?id=${post.id}`"
          class="text-xs text-blue-700 dark:text-sky-300 hover:text-white bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 px-3 py-1.5 rounded-xl transition"
        >
          Yazıyı Düzenle ✏️
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="space-y-4">
      <div class="h-10 bg-slate-200 dark:bg-slate-900 rounded-2xl w-3/4 animate-pulse"></div>
      <div class="h-4 bg-slate-200/60 dark:bg-slate-900/60 rounded w-1/4 animate-pulse"></div>
      <div class="space-y-2 pt-6">
        <div class="h-4 bg-slate-200/40 dark:bg-slate-900/40 rounded w-full animate-pulse"></div>
        <div class="h-4 bg-slate-200/40 dark:bg-slate-900/40 rounded w-5/6 animate-pulse"></div>
        <div class="h-4 bg-slate-200/40 dark:bg-slate-900/40 rounded w-4/6 animate-pulse"></div>
      </div>
    </div>

    <!-- Error / 404 State -->
    <div 
      v-else-if="error || !post" 
      class="p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3 bg-white dark:bg-slate-900/30"
    >
      <span class="text-4xl block">🔍</span>
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">404 - Yazı Bulunamadı</h2>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        Aradığınız blog yazısı mevcut değil veya henüz yayınlanmamış olabilir.
      </p>
      <NuxtLink
        to="/blog"
        class="mt-4 inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20"
      >
        Tüm Yazılara Göz At
      </NuxtLink>
    </div>

    <!-- Post Article Content -->
    <article v-else class="space-y-8">
      <header class="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div class="flex items-center gap-2 flex-wrap">
          <span 
            v-if="!post.isPublished"
            class="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 font-mono"
          >
            📝 Taslak Önizleme (Admin)
          </span>
          <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-sky-400 border border-blue-200 dark:border-blue-800">
            Teknik Doküman
          </span>
          <time :datetime="String(post.createdAt)" class="text-xs text-slate-500 font-mono">
            Yayınlanma Tarihi: {{ formatDate(post.createdAt) }}
          </time>
        </div>

        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {{ post.title }}
        </h1>
      </header>

      <!-- Markdown Rendered Content -->
      <div class="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-none font-sans leading-relaxed text-slate-800 dark:text-slate-200">
        <MarkdownRenderer :content="post.content" />
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import MarkdownRenderer from '~/components/Common/MarkdownRenderer.vue'
import { useToast } from '~/composables/useToast'

interface SinglePost {
  id: number
  title: string
  slug: string
  content: string
  isPublished: boolean
  createdAt: string | Date
}

const config = useSiteConfig()
const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { user } = useAuth()
const toast = useToast()

const { data, pending, error } = await useFetch<{ success: boolean; post: SinglePost }>(
  () => `/api/blog/${slug.value}`
)

const post = computed(() => data.value?.post || null)

// Dynamic SEO
watchEffect(() => {
  if (post.value) {
    const plainExcerpt = post.value.content
      .replace(/#+/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_~>]/g, '')
      .slice(0, 160)
      .trim()

    useSeoMeta({
      title: `${post.value.title} • ${config.brand.name}`,
      description: plainExcerpt || post.value.title,
      ogTitle: `${post.value.title} • ${config.brand.name}`,
      ogDescription: plainExcerpt,
    })
  }
})

const copyShareUrl = async () => {
  if (process.client) {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Yazı bağlantısı panoya kopyalandı! 🔗')
    } catch {
      toast.error('Bağlantı kopyalanamadı.')
    }
  }
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
