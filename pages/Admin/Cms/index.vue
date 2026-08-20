<template>
  <div class="space-y-8">
    <!-- Header Row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">İçerik Yönetim Sistemi (CMS) 📝</h1>
        <p class="text-slate-400 text-sm mt-0.5">Ziyaretçilerin göreceği blog yazılarını ve teknik dokümanları yönetin.</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="fetchPosts"
          :disabled="loading"
          class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50"
          title="Yenile"
        >
          <svg :class="['w-4 h-4', loading ? 'animate-spin' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <NuxtLink
          to="/admin/cms/editor"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <span>+</span>
          <span>Yeni Yazı Ekle</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-800 pb-3">
      <button
        type="button"
        @click="activeFilter = 'all'"
        :class="[
          'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition select-none flex items-center gap-1.5',
          activeFilter === 'all'
            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
        ]"
      >
        <span>Tümü</span>
        <span class="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px]">{{ posts.length }}</span>
      </button>

      <button
        type="button"
        @click="activeFilter = 'published'"
        :class="[
          'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition select-none flex items-center gap-1.5',
          activeFilter === 'published'
            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
        ]"
      >
        <span>Yayındakiler</span>
        <span class="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px] text-emerald-400">{{ publishedPosts.length }}</span>
      </button>

      <button
        type="button"
        @click="activeFilter = 'draft'"
        :class="[
          'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition select-none flex items-center gap-1.5',
          activeFilter === 'draft'
            ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
        ]"
      >
        <span>Taslaklar</span>
        <span class="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px] text-amber-400">{{ draftPosts.length }}</span>
      </button>
    </div>

    <!-- Posts Table / List Container -->
    <div class="space-y-4">
      <!-- Loading Skeleton -->
      <div v-if="loading && posts.length === 0" class="space-y-3">
        <div v-for="i in 3" :key="i" class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/60 animate-pulse space-y-2">
          <div class="h-4 bg-slate-800 rounded w-1/3"></div>
          <div class="h-3 bg-slate-800/60 rounded w-1/4"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredPosts.length === 0"
        class="p-12 rounded-2xl border-2 border-dashed border-slate-800 text-center space-y-3 bg-slate-900/30"
      >
        <span class="text-3xl block">📝</span>
        <h3 class="text-sm font-semibold text-slate-300">
          {{ activeFilter === 'all' ? 'Henüz blog yazısı eklenmemiş' : activeFilter === 'published' ? 'Yayında yazı bulunmuyor' : 'Taslak yazı bulunmuyor' }}
        </h3>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">
          Yeni bir blog yazısı oluşturmak ve yayınlamak için yukarıdaki butonu kullanabilirsiniz.
        </p>
      </div>

      <!-- Posts List -->
      <div v-else class="space-y-3">
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          class="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
        >
          <!-- Left: Title, Slug, Date -->
          <div class="space-y-1.5 min-w-0 flex-1">
            <div class="flex items-center gap-2.5 flex-wrap">
              <h2 class="text-base font-bold text-white group-hover:text-indigo-300 transition truncate">
                {{ post.title }}
              </h2>
              <span
                :class="[
                  'text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0',
                  post.isPublished
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-900/60'
                    : 'bg-amber-950/60 text-amber-400 border-amber-900/60'
                ]"
              >
                {{ post.isPublished ? '✅ Yayında' : '📝 Taslak' }}
              </span>
            </div>

            <div class="flex items-center gap-3 text-xs text-slate-500 font-mono flex-wrap">
              <span class="text-slate-400">/blog/{{ post.slug }}</span>
              <span>•</span>
              <span>{{ formatDate(post.createdAt) }}</span>
            </div>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-2 self-end md:self-auto shrink-0">
            <!-- View on Public Site (if published) -->
            <NuxtLink
              v-if="post.isPublished"
              :to="`/blog/${post.slug}`"
              target="_blank"
              title="Yayında Görüntüle"
              class="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs"
            >
              👁️
            </NuxtLink>

            <!-- Toggle Publish / Unpublish -->
            <button
              type="button"
              @click="togglePublish(post)"
              :title="post.isPublished ? 'Yayından Kaldır (Taslak Yap)' : 'Ziyaretçilere Yayınla'"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition border',
                post.isPublished
                  ? 'bg-amber-950/30 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
                  : 'bg-emerald-950/30 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50'
              ]"
            >
              {{ post.isPublished ? 'Yayından Kaldır' : 'Yayınla' }}
            </button>

            <!-- Edit Button -->
            <NuxtLink
              :to="`/admin/cms/editor?id=${post.id}`"
              class="px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-900/60 text-indigo-300 hover:bg-indigo-900/80 text-xs font-semibold transition"
            >
              Düzenle ✏️
            </NuxtLink>

            <!-- Delete Button -->
            <button
              type="button"
              @click="deletePost(post.id)"
              title="Yazıyı Sil"
              class="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition text-xs"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'

export interface PostItem {
  id: number
  title: string
  slug: string
  content: string
  isPublished: boolean
  createdAt: string | Date
}

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const toast = useToast()
const confirm = useConfirm()

const posts = ref<PostItem[]>([])
const loading = ref(false)
const activeFilter = ref<'all' | 'published' | 'draft'>('all')

const publishedPosts = computed(() => posts.value.filter((p) => p.isPublished))
const draftPosts = computed(() => posts.value.filter((p) => !p.isPublished))

const filteredPosts = computed(() => {
  if (activeFilter.value === 'published') return publishedPosts.value
  if (activeFilter.value === 'draft') return draftPosts.value
  return posts.value
})

const fetchPosts = async () => {
  loading.value = true
  try {
    const data = await $fetch<{ success: boolean; posts: PostItem[] }>('/api/blog')
    if (data?.posts) {
      posts.value = data.posts
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Yazılar yüklenirken bir hata oluştu.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})

const togglePublish = async (post: PostItem) => {
  const previousPosts = JSON.parse(JSON.stringify(posts.value)) as PostItem[]
  const targetIndex = posts.value.findIndex((p) => p.id === post.id)
  const newStatus = !post.isPublished

  if (targetIndex !== -1) {
    posts.value[targetIndex].isPublished = newStatus
  }

  try {
    const res = await $fetch<{ success: boolean; post: PostItem }>(`/api/blog/${post.id}`, {
      method: 'PATCH',
      body: {
        isPublished: newStatus,
      },
    })

    if (res?.post && targetIndex !== -1) {
      posts.value[targetIndex] = res.post
      toast.success(newStatus ? 'Yazı başarıyla yayına alındı!' : 'Yazı taslağa çekildi.')
    }
  } catch (err: any) {
    posts.value = previousPosts
    toast.error(err?.data?.statusMessage || 'Yayın durumu güncellenirken hata oluştu.')
  }
}

const deletePost = async (id: number) => {
  const ok = await confirm.ask({
    title: 'Blog Yazısını Sil',
    message: 'Bu blog yazısını kalıcı olarak silmek istediğinizden emin misiniz?',
    confirmText: 'Evet, Sil',
  })
  if (!ok) return

  const previousPosts = JSON.parse(JSON.stringify(posts.value)) as PostItem[]
  posts.value = posts.value.filter((p) => p.id !== id)

  try {
    await $fetch(`/api/blog/${id}`, {
      method: 'DELETE',
    })
    toast.success('Blog yazısı başarıyla silindi.')
  } catch (err: any) {
    posts.value = previousPosts
    toast.error(err?.data?.statusMessage || 'Yazı silinirken hata oluştu.')
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