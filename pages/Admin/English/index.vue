<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-extrabold text-white tracking-tight">English Learning & Spaced Review 🇬🇧</h1>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold font-mono">
            {{ words.length }} Kelime
          </span>
        </div>
        <p class="text-slate-400 text-xs mt-1">Aralıklı tekrar algoritması (Spaced Repetition), sesli telaffuz ve AI destekli pratik hikayeleri.</p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          @click="openStoryModal"
          :disabled="selectedWords.length === 0"
          class="px-3.5 py-2 bg-indigo-950/80 border border-indigo-800/80 hover:bg-indigo-900 disabled:opacity-40 text-indigo-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
        >
          <span>✨</span>
          <span>Seçilenlerden Hikaye Üret ({{ selectedWords.length }})</span>
        </button>

        <button
          type="button"
          @click="isWordModalOpen = true"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
        >
          + Yeni Kelime Ekle
        </button>
      </div>
    </div>

    <!-- Active Spaced Review Flashcard Section (If words due) -->
    <div v-if="dueWords.length > 0" class="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-800/80 space-y-4 shadow-xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg animate-pulse">🧠</span>
          <h2 class="text-sm font-bold text-white">Aralıklı Tekrar Zamanı (Spaced Review)</h2>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-slate-400 font-mono hidden sm:inline">Kısayol: [Boşluk] Aç, [1] Unuttum, [2] Hatırla</span>
          <span class="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/60">
            {{ currentDueIndex + 1 }} / {{ dueWords.length }}
          </span>
        </div>
      </div>

      <!-- Flashcard Content -->
      <div v-if="currentDueWord" class="p-6 sm:p-8 rounded-xl bg-slate-950/90 border border-slate-800 space-y-5 text-center transition-all duration-300">
        <div class="space-y-2">
          <div class="flex items-center justify-center gap-2">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 uppercase">
              Seviye: {{ currentDueWord.level }}
            </span>

            <!-- Audio Speak Button (Web Speech API) -->
            <button
              type="button"
              @click="speakWord(currentDueWord.word)"
              class="px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-700 transition inline-flex items-center gap-1"
              title="İngilizce Telaffuzu Dinle"
            >
              <span>🔊</span>
              <span>Dinle</span>
            </button>
          </div>

          <h3 class="text-3xl sm:text-4xl font-extrabold text-white tracking-wide mt-2 font-mono select-none">
            {{ currentDueWord.word }}
          </h3>
          <p v-if="currentDueWord.phonetic" class="text-xs text-slate-500 font-mono">{{ currentDueWord.phonetic }}</p>
        </div>

        <!-- Meaning & Example reveal toggle -->
        <div v-if="isMeaningRevealed" class="space-y-3 pt-4 border-t border-slate-900 animate-fade-in">
          <div class="text-lg font-bold text-emerald-400">{{ currentDueWord.meaning }}</div>
          <p v-if="currentDueWord.example" class="text-xs text-slate-300 italic font-serif max-w-md mx-auto bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
            "{{ currentDueWord.example }}"
          </p>
        </div>

        <div v-else class="pt-2">
          <button
            type="button"
            @click="isMeaningRevealed = true"
            class="px-4 py-2 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-xs text-indigo-300 hover:text-white transition font-medium"
          >
            Anlamı ve Örnek Cümleyi Göster (Boşluk Tuşu)
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="pt-4 flex justify-center gap-3">
          <button
            type="button"
            @click="submitReview(currentDueWord.id, false)"
            class="px-5 py-2.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 hover:bg-rose-900 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <span>❌</span>
            <span>Unuttum [1]</span>
          </button>
          <button
            type="button"
            @click="submitReview(currentDueWord.id, true)"
            class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <span>✅</span>
            <span>Hatırlıyorum [2]</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filter & Search Row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
      <div class="flex items-center gap-1.5 flex-wrap">
        <button
          v-for="lvl in ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1']"
          :key="lvl"
          type="button"
          @click="selectedLevel = lvl"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-semibold transition',
            selectedLevel === lvl ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-900 text-slate-400 hover:text-white'
          ]"
        >
          {{ lvl === 'ALL' ? 'Tümü' : lvl }}
        </button>
      </div>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Kelime veya anlam ara..."
        class="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
      />
    </div>

    <!-- Vocabulary Table -->
    <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
      <table class="w-full text-left text-xs text-slate-300">
        <thead class="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
          <tr>
            <th class="p-3.5 w-8">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
              />
            </th>
            <th class="p-3.5">Kelime</th>
            <th class="p-3.5">Türkçe Anlamı</th>
            <th class="p-3.5">Örnek Cümle</th>
            <th class="p-3.5">Seviye</th>
            <th class="p-3.5">Tekrar Sayısı</th>
            <th class="p-3.5 text-right">İşlem</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/80 font-sans">
          <tr
            v-for="w in filteredWords"
            :key="w.id"
            class="hover:bg-slate-800/40 transition group"
          >
            <td class="p-3.5">
              <input
                type="checkbox"
                :value="w.word"
                v-model="selectedWords"
                class="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
              />
            </td>
            <td class="p-3.5 font-bold text-white font-mono flex items-center gap-1.5">
              <span>{{ w.word }}</span>
              <button
                type="button"
                @click="speakWord(w.word)"
                class="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition"
                title="Dinle"
              >
                🔊
              </button>
            </td>
            <td class="p-3.5 font-medium text-emerald-400">{{ w.meaning }}</td>
            <td class="p-3.5 text-slate-400 max-w-xs truncate italic">{{ w.example || '-' }}</td>
            <td class="p-3.5">
              <span class="px-2 py-0.5 rounded-full bg-slate-950 text-indigo-300 border border-slate-800 font-semibold font-mono">
                {{ w.level }}
              </span>
            </td>
            <td class="p-3.5 font-mono text-slate-400">{{ w.reviewCount }}x ({{ w.intervalDays }}g)</td>
            <td class="p-3.5 text-right">
              <button
                type="button"
                @click="deleteWord(w.id)"
                class="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition p-1"
                title="Kelimeyi Sil"
              >
                🗑️
              </button>
            </td>
          </tr>

          <tr v-if="filteredWords.length === 0">
            <td colspan="7" class="p-8 text-center text-slate-500">
              Aranan kriterde kelime bulunamadı.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- New Word Modal -->
    <div
      v-if="isWordModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
      @click.self="isWordModalOpen = false"
    >
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-in">
        <h3 class="text-base font-bold text-white">Yeni İngilizce Kelime Ekle 🇬🇧</h3>
        <form @submit.prevent="createWord" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Kelime (English) *</label>
            <input
              v-model="newWord.word"
              type="text"
              required
              placeholder="Örn: achieve"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Türkçe Anlamı *</label>
            <input
              v-model="newWord.meaning"
              type="text"
              required
              placeholder="Örn: başarmak, elde etmek"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Seviye</label>
              <select
                v-model="newWord.level"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="A1">A1 (Başlangıç)</option>
                <option value="A2">A2 (Temel)</option>
                <option value="B1">B1 (Orta)</option>
                <option value="B2">B2 (İyi)</option>
                <option value="C1">C1 (İleri)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Okunuş (Opsiyonel)</label>
              <input
                v-model="newWord.phonetic"
                type="text"
                placeholder="/əˈtʃiːv/"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Örnek Cümle</label>
            <textarea
              v-model="newWord.example"
              rows="2"
              placeholder="Örn: With consistent study, you will achieve your goals."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-serif"
            ></textarea>
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              @click="isWordModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              Kelimeyi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- AI Story Generator Modal -->
    <div
      v-if="isStoryModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
      @click.self="isStoryModalOpen = false"
    >
      <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-in">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <span>✨</span>
            <span>AI Destekli İngilizce Pratik Hikayesi</span>
          </h3>
          <button @click="isStoryModalOpen = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div v-if="generatingStory" class="py-12 text-center space-y-3">
          <div class="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-xs text-slate-400">Gemini 3.6 Flash seçtiğiniz {{ selectedWords.length }} kelime ile hikaye yazıyor...</p>
        </div>

        <div v-else-if="generatedStory" class="space-y-4">
          <h4 class="text-base font-bold text-white">{{ generatedStory.title }}</h4>

          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 max-h-72 overflow-y-auto">
            <div class="text-xs text-slate-200 leading-relaxed font-sans">
              <MarkdownRenderer :content="generatedStory.storyEnglish" />
            </div>

            <div v-if="generatedStory.storyTurkish" class="pt-3 border-t border-slate-900 text-xs text-slate-400 leading-relaxed font-sans">
              <span class="text-indigo-400 font-semibold block mb-1">Türkçe Çeviri & Not:</span>
              {{ generatedStory.storyTurkish }}
            </div>
          </div>

          <div class="flex justify-between items-center pt-2">
            <button
              type="button"
              @click="saveStoryToVault"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
            >
              🔒 Learning Vault'a Kaydet
            </button>
            <button
              type="button"
              @click="isStoryModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Kapat
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
import { useConfirm } from '~/composables/useConfirm'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const toast = useToast()
const confirm = useConfirm()

const loading = ref(false)
const words = ref<any[]>([])
const dueWords = ref<any[]>([])
const currentDueIndex = ref(0)
const isMeaningRevealed = ref(false)

const selectedLevel = ref('ALL')
const searchQuery = ref('')
const selectedWords = ref<string[]>([])

const isWordModalOpen = ref(false)
const isStoryModalOpen = ref(false)
const generatingStory = ref(false)
const generatedStory = ref<any>(null)

const newWord = ref({
  word: '',
  meaning: '',
  example: '',
  phonetic: '',
  level: 'B1',
})

const currentDueWord = computed(() => {
  if (dueWords.value.length === 0) return null
  return dueWords.value[currentDueIndex.value] || null
})

const filteredWords = computed(() => {
  return words.value.filter(w => {
    const matchesLevel = selectedLevel.value === 'ALL' || w.level === selectedLevel.value
    const matchesQuery = !searchQuery.value.trim() ||
      w.word.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesLevel && matchesQuery
  })
})

const isAllSelected = computed(() => {
  return filteredWords.value.length > 0 && filteredWords.value.every(w => selectedWords.value.includes(w.word))
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedWords.value = []
  } else {
    selectedWords.value = filteredWords.value.map(w => w.word)
  }
}

// Web Speech API for Pronunciation
const speakWord = (text: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }
}

// Keyboard shortcuts for Flashcard
const handleKeyDown = (e: KeyboardEvent) => {
  // Only if no modal is open and we have due words
  if (isWordModalOpen.value || isStoryModalOpen.value || dueWords.value.length === 0) return
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

  if (e.code === 'Space') {
    e.preventDefault()
    isMeaningRevealed.value = !isMeaningRevealed.value
  } else if (e.key === '1' && currentDueWord.value) {
    submitReview(currentDueWord.value.id, false)
  } else if (e.key === '2' && currentDueWord.value) {
    submitReview(currentDueWord.value.id, true)
  }
}

const fetchVocabulary = async () => {
  loading.value = true
  try {
    const [allRes, dueRes] = await Promise.all([
      $fetch<{ success: boolean; words: any[] }>('/api/vocabulary'),
      $fetch<{ success: boolean; words: any[] }>('/api/vocabulary?due=true'),
    ])

    if (allRes?.words) words.value = allRes.words
    if (dueRes?.words) {
      dueWords.value = dueRes.words
      currentDueIndex.value = 0
      isMeaningRevealed.value = false
    }
  } catch (err) {
    toast.error('Kelimeler getirilirken hata oluştu.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchVocabulary()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const submitReview = async (wordId: number, remembered: boolean) => {
  try {
    const res = await $fetch<{ success: boolean; word: any; message: string }>('/api/vocabulary/review', {
      method: 'POST',
      body: { wordId, remembered },
    })

    toast.success(res?.message || (remembered ? 'Kelime hatırlandı!' : 'Kelime yarına alındı.'))

    // Advance to next due word
    if (currentDueIndex.value < dueWords.value.length - 1) {
      currentDueIndex.value++
      isMeaningRevealed.value = false
    } else {
      dueWords.value = []
    }

    await fetchVocabulary()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Tekrar durumu kaydedilemedi.')
  }
}

const createWord = async () => {
  if (!newWord.value.word.trim() || !newWord.value.meaning.trim()) return
  try {
    await $fetch('/api/vocabulary', {
      method: 'POST',
      body: {
        word: newWord.value.word.trim(),
        meaning: newWord.value.meaning.trim(),
        example: newWord.value.example.trim() || undefined,
        phonetic: newWord.value.phonetic.trim() || undefined,
        level: newWord.value.level,
      },
    })
    isWordModalOpen.value = false
    newWord.value = { word: '', meaning: '', example: '', phonetic: '', level: 'B1' }
    toast.success('Kelime başarıyla kaydedildi! 🇬🇧')
    await fetchVocabulary()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Kelime kaydedilemedi.')
  }
}

const deleteWord = async (id: number) => {
  const ok = await confirm.ask({
    title: 'Kelimeyi Sil',
    message: 'Bu kelimeyi kelime dağarcığınızdan silmek istediğinizden emin misiniz?',
    confirmText: 'Evet, Sil',
  })
  if (!ok) return

  try {
    await $fetch(`/api/vocabulary/${id}`, { method: 'DELETE' })
    toast.success('Kelime başarıyla silindi.')
    await fetchVocabulary()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Kelime silinemedi.')
  }
}

const openStoryModal = async () => {
  if (selectedWords.value.length === 0) return
  isStoryModalOpen.value = true
  generatingStory.value = true
  generatedStory.value = null

  try {
    const res = await $fetch<{ success: boolean; story: any }>('/api/ai/generate-story', {
      method: 'POST',
      body: {
        words: selectedWords.value,
        level: 'B1',
      },
    })

    if (res?.story) {
      generatedStory.value = res.story
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Hikaye üretilemedi.')
    isStoryModalOpen.value = false
  } finally {
    generatingStory.value = false
  }
}

const saveStoryToVault = async () => {
  if (!generatedStory.value) return
  try {
    await $fetch('/api/learning-notes', {
      method: 'POST',
      body: {
        title: `${generatedStory.value.title} (English Practice)`,
        technology: 'English',
        topic: 'Vocabulary Practice',
        content: `${generatedStory.value.storyEnglish}\n\n---\n**Türkçe Çeviri:**\n${generatedStory.value.storyTurkish}`,
        status: 'PRIVATE',
      },
    })
    toast.success('Hikaye başarıyla Learning Vault kasasına kaydedildi! 🔒')
    isStoryModalOpen.value = false
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Kayıt başarısız.')
  }
}
</script>
