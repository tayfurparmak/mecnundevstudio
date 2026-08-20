<template>
  <div class="space-y-6 max-w-5xl">
    <!-- Header Row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/admin/cms"
          class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs"
          title="Listeye Dön"
        >
          ←
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">
            {{ isEditing ? 'Yazıyı Düzenle' : 'Yeni İçerik Oluştur' }} 📝
          </h1>
          <p class="text-slate-400 text-xs mt-0.5">
            {{ isEditing ? `ID: #${editPostId}` : 'Görsel ve Markdown destekli blog yazısı veya teknik doküman hazırlayın.' }}
          </p>
        </div>
      </div>

      <!-- Top Action Buttons -->
      <div class="flex items-center gap-2.5 self-end sm:self-auto">
        <button
          type="button"
          @click="savePost(false)"
          :disabled="isSubmitting || !form.title.trim() || !form.content.trim()"
          class="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white text-slate-300 disabled:opacity-50 text-xs font-semibold rounded-xl transition"
        >
          {{ isSubmitting ? 'Kaydediliyor...' : 'Taslak Kaydet 📝' }}
        </button>

        <button
          type="button"
          @click="savePost(true)"
          :disabled="isSubmitting || !form.title.trim() || !form.content.trim()"
          class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 text-xs font-semibold rounded-xl transition shadow-lg shadow-emerald-600/20"
        >
          {{ isSubmitting ? 'Yayınlanıyor...' : form.isPublished ? 'Güncelle & Yayında Tut 🚀' : 'Ziyaretçiye Yayınla 🚀' }}
        </button>
      </div>
    </div>

    <!-- Editor Form & Preview -->
    <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
      <!-- Title Input -->
      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1.5">Yazı Başlığı *</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="Örn: Nuxt 4 ile Tam Kapsamlı AI Uygulaması Geliştirme"
          required
          maxlength="255"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-base text-white font-bold focus:outline-none focus:border-indigo-500 transition placeholder:text-slate-600"
        />
      </div>

      <!-- Slug Customizer & Preview -->
      <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
        <div class="flex items-center justify-between">
          <label class="block text-[11px] font-medium text-slate-400">
            URL Kalıcı Bağlantısı (Slug)
          </label>
          <span class="text-[10px] text-slate-500 font-mono">/blog/{{ form.slug || previewSlug }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500 font-mono select-none">/blog/</span>
          <input
            v-model="form.slug"
            type="text"
            :placeholder="previewSlug"
            class="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      <!-- Content Toolbar (Image Upload & Markdown Helpers) -->
      <div class="space-y-2">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div class="flex items-center gap-2">
            <label class="block text-xs font-medium text-slate-300">
              İçerik (Markdown Destekli) *
            </label>

            <!-- Image Upload Trigger Button -->
            <button
              type="button"
              @click="isImageModalOpen = true"
              class="px-2.5 py-1 bg-indigo-950/70 border border-indigo-800/60 hover:bg-indigo-900 text-indigo-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            >
              <span>🖼️</span>
              <span>Resim / Görsel Ekle</span>
            </button>
          </div>

          <div class="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
            <button
              type="button"
              @click="editorTab = 'edit'"
              :class="[
                'px-3 py-1 rounded-md transition font-medium',
                editorTab === 'edit'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              ]"
            >
              Yazım
            </button>
            <button
              type="button"
              @click="editorTab = 'split'"
              :class="[
                'px-3 py-1 rounded-md transition font-medium hidden md:inline-block',
                editorTab === 'split'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              ]"
            >
              İkili Görünüm
            </button>
            <button
              type="button"
              @click="editorTab = 'preview'"
              :class="[
                'px-3 py-1 rounded-md transition font-medium',
                editorTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              ]"
            >
              Canlı Önizleme
            </button>
          </div>
        </div>

        <!-- Editor & Preview Grid -->
        <div 
          :class="[
            'grid gap-4',
            editorTab === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          ]"
        >
          <!-- Textarea (Visible on 'edit' or 'split') -->
          <div v-show="editorTab === 'edit' || editorTab === 'split'">
            <textarea
              ref="contentAreaRef"
              v-model="form.content"
              rows="16"
              placeholder="İçeriğinizi buraya yazın... Markdown sözdizimi (# Başlık, **kalın**, ```kod```, ![Resim](url), [link](url)) desteklenir."
              required
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition font-mono leading-relaxed placeholder:text-slate-600 resize-y min-h-[380px]"
            ></textarea>
          </div>

          <!-- Live Markdown Preview (Visible on 'preview' or 'split') -->
          <div 
            v-show="editorTab === 'preview' || editorTab === 'split'"
            class="p-5 rounded-xl bg-slate-950 border border-slate-800 overflow-y-auto min-h-[380px] max-h-[600px]"
          >
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-slate-800/80">
              Canlı Markdown & Görsel Önizlemesi
            </div>
            <MarkdownRenderer :content="form.content || '*Önizlenecek içerik henüz girilmedi...*'" />
          </div>
        </div>
      </div>

      <!-- Bottom Publish / Status Bar -->
      <div class="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input
              v-model="form.isPublished"
              type="checkbox"
              class="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-0 cursor-pointer"
            />
            <span class="text-xs font-medium text-slate-300">Bu yazıyı doğrudan yayına al</span>
          </label>
        </div>

        <div class="flex items-center gap-3">
          <NuxtLink
            to="/admin/cms"
            class="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Vazgeç
          </NuxtLink>

          <button
            type="button"
            @click="savePost(form.isPublished)"
            :disabled="isSubmitting || !form.title.trim() || !form.content.trim()"
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/20"
          >
            {{ isSubmitting ? 'Kaydediliyor...' : isEditing ? 'Değişiklikleri Kaydet' : 'Yazıyı Oluştur' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Image Upload Modal -->
    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
      @click.self="isImageModalOpen = false"
    >
      <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl animate-scale-in">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <span>🖼️</span>
            <span>Görsel / Resim Ekle</span>
          </h3>
          <button
            type="button"
            @click="isImageModalOpen = false"
            class="text-slate-400 hover:text-white transition p-1"
          >
            ✕
          </button>
        </div>

        <!-- Image Mode Tabs (Upload vs URL) -->
        <div class="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            @click="imageTab = 'upload'"
            :class="[
              'flex-1 py-1.5 rounded-lg transition font-medium text-center',
              imageTab === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            ]"
          >
            Bilgisayardan Yükle
          </button>
          <button
            type="button"
            @click="imageTab = 'url'"
            :class="[
              'flex-1 py-1.5 rounded-lg transition font-medium text-center',
              imageTab === 'url' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            ]"
          >
            Görsel URL'i Gir
          </button>
        </div>

        <!-- Upload File Zone -->
        <div v-if="imageTab === 'upload'" class="space-y-4">
          <div
            @dragover.prevent
            @drop.prevent="onImageFileDrop"
            class="border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-2xl p-6 text-center space-y-3 bg-slate-950/60 transition cursor-pointer"
            @click="$refs.fileInputRef?.click()"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              class="hidden"
              @change="onImageFileSelect"
            />

            <span class="text-3xl block">📤</span>
            <div class="text-xs text-slate-300 font-medium">
              <span class="text-indigo-400 underline">Dosya seçmek için tıklayın</span> veya buraya sürükleyip bırakın
            </div>
            <p class="text-[11px] text-slate-500">PNG, JPG, WebP, GIF veya SVG (Maks. 5MB)</p>
          </div>

          <!-- Selected File Info -->
          <div v-if="selectedFile" class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div class="truncate max-w-[280px] text-slate-300 font-mono">
              📄 {{ selectedFile.name }} ({{ Math.round(selectedFile.size / 1024) }} KB)
            </div>
            <button
              type="button"
              @click="selectedFile = null"
              class="text-rose-400 hover:text-rose-300 text-xs px-1.5"
            >
              Kaldır
            </button>
          </div>

          <!-- Alt text input -->
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Görsel Açıklaması (Alt Text)</label>
            <input
              v-model="imageAltText"
              type="text"
              placeholder="Örn: Nuxt 4 Mimari Diyagramı"
              class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              @click="isImageModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Vazgeç
            </button>
            <button
              type="button"
              @click="uploadAndInsertImage"
              :disabled="isUploadingImage || !selectedFile"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition"
            >
              {{ isUploadingImage ? 'Yükleniyor...' : 'Görseli Yükle ve İçeriğe Ekle' }}
            </button>
          </div>
        </div>

        <!-- Direct URL Zone -->
        <div v-else class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Görsel Bağlantısı (URL) *</label>
            <input
              v-model="imageUrlInput"
              type="url"
              placeholder="https://example.com/image.png"
              class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-mono"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Görsel Açıklaması (Alt Text)</label>
            <input
              v-model="imageAltText"
              type="text"
              placeholder="Örn: Proje Ekran Görüntüsü"
              class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              @click="isImageModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Vazgeç
            </button>
            <button
              type="button"
              @click="insertImageUrl"
              :disabled="!imageUrlInput.trim()"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition"
            >
              İçeriğe Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MarkdownRenderer from '~/components/Common/MarkdownRenderer.vue'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const toast = useToast()
const route = useRoute()
const router = useRouter()

const editPostId = computed(() => {
  const idQuery = route.query.id
  if (typeof idQuery === 'string' && /^\d+$/.test(idQuery)) {
    return Number.parseInt(idQuery, 10)
  }
  return null
})

const isEditing = computed(() => editPostId.value !== null)

const editorTab = ref<'edit' | 'split' | 'preview'>('edit')
const isSubmitting = ref(false)
const contentAreaRef = ref<HTMLTextAreaElement | null>(null)

// Image Modal State
const isImageModalOpen = ref(false)
const imageTab = ref<'upload' | 'url'>('upload')
const isUploadingImage = ref(false)
const selectedFile = ref<File | null>(null)
const imageAltText = ref('')
const imageUrlInput = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const form = ref<{
  title: string
  slug: string
  content: string
  isPublished: boolean
}>({
  title: '',
  slug: '',
  content: '',
  isPublished: false,
})

const previewSlug = computed(() => {
  if (!form.value.title) return 'yazi-basligi'
  const turkishCharMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
  }
  return form.value.title
    .split('')
    .map((c) => turkishCharMap[c] || c)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'yazi'
})

const onImageFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const onImageFileDrop = (event: DragEvent) => {
  if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
    selectedFile.value = event.dataTransfer.files[0]
  }
}

const insertMarkdownAtCursor = (markdownSnippet: string) => {
  const textarea = contentAreaRef.value
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const current = form.value.content
    form.value.content = current.substring(0, start) + `\n${markdownSnippet}\n` + current.substring(end)
  } else {
    form.value.content = form.value.content ? `${form.value.content}\n\n${markdownSnippet}` : markdownSnippet
  }
}

const uploadAndInsertImage = async () => {
  if (!selectedFile.value) return

  isUploadingImage.value = true

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const res = await $fetch<{ success: boolean; url: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (res?.url) {
      const alt = imageAltText.value.trim() || selectedFile.value.name.replace(/\.[^/.]+$/, '')
      const markdownImage = `![${alt}](${res.url})`
      insertMarkdownAtCursor(markdownImage)

      selectedFile.value = null
      imageAltText.value = ''
      isImageModalOpen.value = false
      toast.success('Görsel başarıyla yüklendi ve içeriğe eklendi! 🖼️')
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Görsel yüklenirken bir hata oluştu.')
  } finally {
    isUploadingImage.value = false
  }
}

const insertImageUrl = () => {
  if (!imageUrlInput.value.trim()) return

  const alt = imageAltText.value.trim() || 'Görsel'
  const markdownImage = `![${alt}](${imageUrlInput.value.trim()})`
  insertMarkdownAtCursor(markdownImage)

  imageUrlInput.value = ''
  imageAltText.value = ''
  isImageModalOpen.value = false
  toast.success('Görsel bağlantısı içeriğe eklendi.')
}

const loadPost = async () => {
  if (!editPostId.value) return

  try {
    const res = await $fetch<{ success: boolean; post: any }>(`/api/blog/${editPostId.value}`)
    if (res?.post) {
      form.value = {
        title: res.post.title,
        slug: res.post.slug,
        content: res.post.content,
        isPublished: res.post.isPublished,
      }
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Yazı detayları yüklenemedi.')
  }
}

onMounted(() => {
  loadPost()
})

const savePost = async (publishState: boolean) => {
  if (!form.value.title.trim()) {
    toast.warning('Lütfen yazı başlığını girin.')
    return
  }

  if (!form.value.content.trim()) {
    toast.warning('Lütfen yazı içeriğini girin.')
    return
  }

  isSubmitting.value = true
  form.value.isPublished = publishState

  try {
    if (isEditing.value) {
      const res = await $fetch<{ success: boolean; post: any }>(`/api/blog/${editPostId.value}`, {
        method: 'PATCH',
        body: {
          title: form.value.title.trim(),
          slug: form.value.slug.trim() || undefined,
          content: form.value.content.trim(),
          isPublished: publishState,
        },
      })

      if (res?.post) {
        toast.success(publishState ? 'Yazı güncellendi ve yayına alındı! 🚀' : 'Yazı taslak olarak kaydedildi. 📝')
        form.value.slug = res.post.slug
      }
    } else {
      const res = await $fetch<{ success: boolean; post: any }>('/api/blog', {
        method: 'POST',
        body: {
          title: form.value.title.trim(),
          slug: form.value.slug.trim() || undefined,
          content: form.value.content.trim(),
          isPublished: publishState,
        },
      })

      if (res?.post) {
        toast.success(publishState ? 'Yeni yazı başarıyla oluşturuldu ve yayınlandı! 🚀' : 'Yeni yazı taslak olarak kaydedildi. 📝')
        setTimeout(() => {
          router.push('/admin/cms')
        }, 1200)
      }
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Yazı kaydedilirken bir hata oluştu.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
