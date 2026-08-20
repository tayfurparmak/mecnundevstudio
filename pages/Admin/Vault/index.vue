<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-extrabold text-white tracking-tight">Learning Vault (Kişisel Bilgi Kasası) 🔒</h1>
          <span class="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-amber-400">
            PRIVATE
          </span>
        </div>
        <p class="text-slate-400 text-xs mt-1">Öğrendiğiniz şeyleri kaydedin. Ziyaretçiler göremez; istediğinizde AI ile quiz çözebilir veya bloga aktarabilirsiniz.</p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          @click="openAiModal"
          class="px-3.5 py-2 bg-indigo-950/80 border border-indigo-800/80 hover:bg-indigo-900 text-indigo-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
        >
          <span>✨</span>
          <span>AI ile Not Üret</span>
        </button>

        <button
          type="button"
          @click="isCreateModalOpen = true"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
        >
          + Yeni Not Ekle
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-800 pb-3 flex-wrap">
      <button
        type="button"
        @click="selectedTech = 'all'"
        :class="[
          'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition',
          selectedTech === 'all' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-900 text-slate-400 hover:text-white'
        ]"
      >
        Tümü ({{ notes.length }})
      </button>
      <button
        v-for="tech in uniqueTechnologies"
        :key="tech"
        type="button"
        @click="selectedTech = tech"
        :class="[
          'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition',
          selectedTech === tech ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-900 text-slate-400 hover:text-white'
        ]"
      >
        {{ tech }} ({{ notes.filter(n => n.technology === tech).length }})
      </button>
    </div>

    <!-- Notes List -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 2" :key="i" class="p-6 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse space-y-3">
        <div class="h-5 bg-slate-800 rounded w-1/3"></div>
        <div class="h-3 bg-slate-800/60 rounded w-full"></div>
      </div>
    </div>

    <div v-else-if="filteredNotes.length === 0" class="p-12 rounded-2xl border-2 border-dashed border-slate-800 text-center space-y-3 bg-slate-900/30">
      <span class="text-3xl block">🔒</span>
      <h3 class="text-sm font-semibold text-slate-300">Bu kategoride henüz kişisel not bulunmuyor</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        Bugün öğrendiğiniz kritik konseptleri kaydedin veya AI ile ham notlarınızı düzenleyin.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="note in filteredNotes"
        :key="note.id"
        class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md flex flex-col justify-between hover:border-slate-700 transition"
      >
        <div class="space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                {{ note.technology }}
              </span>
              <span v-if="note.topic" class="text-[11px] text-slate-400 font-mono">
                / {{ note.topic }}
              </span>
            </div>

            <span
              :class="[
                'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                note.status === 'PUBLIC'
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                  : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
              ]"
            >
              {{ note.status === 'PUBLIC' ? '🌐 Public Blogda' : '🔒 Private' }}
            </span>
          </div>

          <h3 class="text-base font-bold text-white">{{ note.title }}</h3>

          <div class="text-xs text-slate-300 leading-relaxed max-h-36 overflow-hidden relative font-sans">
            <MarkdownRenderer :content="note.content" />
            <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900 to-transparent"></div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
          <span class="text-[10px] text-slate-500 font-mono">{{ formatDate(note.createdAt) }}</span>

          <div class="flex items-center gap-2">
            <!-- AI Quiz Button -->
            <button
              type="button"
              @click="startQuiz(note)"
              class="px-2.5 py-1 bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 hover:bg-indigo-900 rounded-xl text-xs font-semibold transition flex items-center gap-1"
              title="Bu nottan AI Quiz üret"
            >
              <span>🧠</span>
              <span>Quiz</span>
            </button>

            <!-- Copy content button -->
            <button
              type="button"
              @click="copyContent(note.content)"
              class="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs transition"
              title="Notu Kopyala"
            >
              📋
            </button>

            <!-- Publish to Blog Button -->
            <button
              v-if="note.status !== 'PUBLIC'"
              type="button"
              @click="publishToBlog(note)"
              class="px-3 py-1 bg-emerald-950 border border-emerald-800/80 text-emerald-300 hover:bg-emerald-900 text-xs font-semibold rounded-xl transition shadow-sm"
            >
              🌐 Bloga Aktar
            </button>

            <button
              type="button"
              @click="deleteNote(note.id)"
              class="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-400 text-xs transition"
              title="Notu Sil"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Note Modal -->
    <div
      v-if="isCreateModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
      @click.self="isCreateModalOpen = false"
    >
      <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-in">
        <h3 class="text-base font-bold text-white">Yeni Öğrenme Notu Ekle 🔒</h3>
        <form @submit.prevent="createNote" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Not Başlığı *</label>
            <input
              v-model="newNote.title"
              type="text"
              required
              placeholder="Örn: Bugün Python List Comprehension Öğrendim"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Teknoloji *</label>
              <input
                v-model="newNote.technology"
                type="text"
                required
                placeholder="Örn: Python"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Konu</label>
              <input
                v-model="newNote.topic"
                type="text"
                placeholder="Örn: List Comprehension"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">İçerik (Markdown) *</label>
            <textarea
              v-model="newNote.content"
              rows="7"
              required
              placeholder="Kişisel öğrenme notunuz, kod örnekleri, dikkat edilecekler..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            ></textarea>
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              @click="isCreateModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              Kasaya Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- AI Note Generator Modal -->
    <div
      v-if="isAiModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
      @click.self="isAiModalOpen = false"
    >
      <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-in">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <span>✨</span>
            <span>AI Destekli Not Üretimi</span>
          </h3>
          <button @click="isAiModalOpen = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="generateAiNote" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Teknoloji</label>
            <input
              v-model="aiForm.skill"
              type="text"
              placeholder="Python, Nuxt, AI..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Konu</label>
            <input
              v-model="aiForm.topic"
              type="text"
              placeholder="Örn: Nuxt 4 Server Middleware"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Ham Öğrenme Notlarınız *</label>
            <textarea
              v-model="aiForm.rawNotes"
              rows="5"
              required
              placeholder="Bugün ne öğrendiniz? Kod parçaları, hatalar, çözümler..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            ></textarea>
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              @click="isAiModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              :disabled="generatingAi || !aiForm.rawNotes.trim()"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <span v-if="generatingAi" class="animate-spin">🌀</span>
              <span>{{ generatingAi ? 'AI Hazırlıyor...' : '✨ Notu Üret ve Kaydet' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- AI Quiz Modal -->
    <div
      v-if="isQuizModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
    >
      <div class="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-2">
            <span class="text-xl">🧠</span>
            <div>
              <h3 class="text-sm font-bold text-white">AI Not Pekiştirme Testi</h3>
              <p class="text-[11px] text-slate-400 font-mono">{{ activeQuizNote?.title }}</p>
            </div>
          </div>
          <button
            @click="closeQuiz"
            class="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-950 rounded-lg border border-slate-800"
          >
            ✕ Kapat
          </button>
        </div>

        <!-- Quiz Generating State -->
        <div v-if="quizLoading" class="p-8 text-center space-y-3">
          <div class="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-xs text-indigo-300 font-medium">Gemini AI notlarınızı analiz ederek quiz üretiyor...</p>
        </div>

        <!-- Quiz Questions -->
        <div v-else-if="quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length" class="space-y-5">
          <div class="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Soru {{ currentQuestionIndex + 1 }} / {{ quizQuestions.length }}</span>
            <span class="text-emerald-400 font-bold">Skor: {{ score }}</span>
          </div>

          <h4 class="text-sm font-bold text-white leading-relaxed">
            {{ currentQuestion.question }}
          </h4>

          <!-- Options -->
          <div class="space-y-2">
            <button
              v-for="(option, idx) in currentQuestion.options"
              :key="idx"
              type="button"
              :disabled="selectedOption !== null"
              @click="handleSelectOption(idx)"
              :class="[
                'w-full p-3.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between',
                selectedOption === null
                  ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-indigo-500 hover:bg-slate-900'
                  : idx === currentQuestion.correctIndex
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200 font-bold'
                    : selectedOption === idx
                      ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                      : 'bg-slate-950/40 border-slate-800/40 text-slate-500'
              ]"
            >
              <span>{{ option }}</span>
              <span v-if="selectedOption !== null && idx === currentQuestion.correctIndex" class="text-emerald-400 font-bold">✓</span>
              <span v-else-if="selectedOption === idx && idx !== currentQuestion.correctIndex" class="text-rose-400 font-bold">✗</span>
            </button>
          </div>

          <!-- Explanation Banner when answered -->
          <div v-if="selectedOption !== null" class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 animate-fade-in">
            <span :class="selectedOption === currentQuestion.correctIndex ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'">
              {{ selectedOption === currentQuestion.correctIndex ? 'Tebrikler, Doğru Cevap! 🎉' : 'Yanlış Cevap' }}
            </span>
            <p class="text-slate-400 text-[11px] leading-relaxed">{{ currentQuestion.explanation }}</p>
          </div>

          <!-- Next Button -->
          <div v-if="selectedOption !== null" class="pt-2 flex justify-end">
            <button
              type="button"
              @click="nextQuestion"
              class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/20"
            >
              {{ currentQuestionIndex + 1 < quizQuestions.length ? 'Sonraki Soru →' : 'Sonucu Gör 🏆' }}
            </button>
          </div>
        </div>

        <!-- Quiz Completed Result -->
        <div v-else-if="quizQuestions.length > 0 && currentQuestionIndex >= quizQuestions.length" class="text-center p-6 space-y-4">
          <span class="text-4xl block">🏆</span>
          <h4 class="text-lg font-bold text-white">Quiz Tamamlandı!</h4>
          <p class="text-xs text-slate-300">
            {{ quizQuestions.length }} sorudan <strong class="text-emerald-400 font-bold">{{ score }}</strong> tanesini doğru bildiniz.
          </p>
          <div class="pt-2">
            <button
              type="button"
              @click="closeQuiz"
              class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              Quizi Bitir
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
const notes = ref<any[]>([])
const selectedTech = ref('all')

const isCreateModalOpen = ref(false)
const isAiModalOpen = ref(false)
const generatingAi = ref(false)

// Quiz States
const isQuizModalOpen = ref(false)
const quizLoading = ref(false)
const activeQuizNote = ref<any>(null)
const quizQuestions = ref<any[]>([])
const currentQuestionIndex = ref(0)
const selectedOption = ref<number | null>(null)
const score = ref(0)

const currentQuestion = computed(() => quizQuestions.value[currentQuestionIndex.value] || {})

const newNote = ref({
  title: '',
  technology: 'Python',
  topic: '',
  content: '',
})

const aiForm = ref({
  skill: 'Python',
  topic: '',
  rawNotes: '',
})

const uniqueTechnologies = computed(() => {
  const set = new Set(notes.value.map(n => n.technology).filter(Boolean))
  return Array.from(set)
})

const filteredNotes = computed(() => {
  if (selectedTech.value === 'all') return notes.value
  return notes.value.filter(n => n.technology === selectedTech.value)
})

const fetchNotes = async () => {
  loading.value = true
  try {
    const res = await $fetch<{ success: boolean; notes: any[] }>('/api/learning-notes')
    if (res?.notes) {
      notes.value = res.notes
    }
  } catch (err) {
    toast.error('Notlar getirilirken hata oluştu.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNotes()
})

const startQuiz = async (note: any) => {
  activeQuizNote.value = note
  isQuizModalOpen.value = true
  quizLoading.value = true
  quizQuestions.value = []
  currentQuestionIndex.value = 0
  selectedOption.value = null
  score.value = 0

  try {
    const res = await $fetch<{ success: boolean; quiz: any[] }>('/api/ai/generate-quiz', {
      method: 'POST',
      body: {
        noteContent: note.content,
        topic: note.topic || note.title,
        technology: note.technology,
      },
    })

    if (res?.quiz && res.quiz.length > 0) {
      quizQuestions.value = res.quiz
    } else {
      toast.error('Quiz soruları üretilemedi.')
      isQuizModalOpen.value = false
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'AI Quiz oluşturulamadı.')
    isQuizModalOpen.value = false
  } finally {
    quizLoading.value = false
  }
}

const handleSelectOption = (idx: number) => {
  if (selectedOption.value !== null) return
  selectedOption.value = idx
  if (idx === currentQuestion.value.correctIndex) {
    score.value++
  }
}

const nextQuestion = () => {
  selectedOption.value = null
  currentQuestionIndex.value++
}

const closeQuiz = () => {
  isQuizModalOpen.value = false
  activeQuizNote.value = null
  quizQuestions.value = []
}

const copyContent = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Not panoya kopyalandı! 📋')
  } catch {
    toast.error('Kopyalama başarısız oldu.')
  }
}

const createNote = async () => {
  if (!newNote.value.title.trim() || !newNote.value.content.trim()) return
  try {
    await $fetch('/api/learning-notes', {
      method: 'POST',
      body: {
        title: newNote.value.title.trim(),
        technology: newNote.value.technology.trim(),
        topic: newNote.value.topic.trim() || undefined,
        content: newNote.value.content.trim(),
        status: 'PRIVATE',
      },
    })
    isCreateModalOpen.value = false
    newNote.value = { title: '', technology: 'Python', topic: '', content: '' }
    toast.success('Öğrenme notu kasaya kaydedildi! 🔒')
    await fetchNotes()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Not eklenemedi.')
  }
}

const publishToBlog = async (note: any) => {
  const ok = await confirm.ask({
    title: 'Blog Yazısı Olarak Yayınla',
    message: `"${note.title}" başlıklı kişisel notunuz public bloga aktarılacak ve ziyaretçilere açılacaktır. Onaylıyor musunuz?`,
    confirmText: 'Evet, Blogda Yayınla',
    type: 'info',
  })
  if (!ok) return

  try {
    await $fetch(`/api/learning-notes/publish`, {
      method: 'POST',
      body: { id: note.id },
    })
    toast.success('Not başarıyla bloga aktarıldı ve yayına alındı! 🌐')
    await fetchNotes()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Yayınlama başarısız.')
  }
}

const deleteNote = async (id: number) => {
  const ok = await confirm.ask({
    title: 'Notu Sil',
    message: 'Bu kişisel notu kasanızdan silmek istediğinizden emin misiniz?',
    confirmText: 'Evet, Sil',
  })
  if (!ok) return

  try {
    await $fetch(`/api/learning-notes/${id}`, { method: 'DELETE' })
    toast.success('Not başarıyla silindi.')
    await fetchNotes()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Not silinemedi.')
  }
}

const openAiModal = () => {
  aiForm.value = { skill: 'Python', topic: '', rawNotes: '' }
  isAiModalOpen.value = true
}

const generateAiNote = async () => {
  if (!aiForm.value.rawNotes.trim()) return
  generatingAi.value = true

  try {
    const res = await $fetch<{ success: boolean; post: any }>('/api/ai/generate-post', {
      method: 'POST',
      body: {
        rawNotes: aiForm.value.rawNotes,
        topic: aiForm.value.topic || undefined,
        skill: aiForm.value.skill,
        language: 'tr',
      },
    })

    if (res?.post) {
      await $fetch('/api/learning-notes', {
        method: 'POST',
        body: {
          title: res.post.title,
          technology: aiForm.value.skill,
          topic: aiForm.value.topic || undefined,
          content: res.post.content,
          status: 'PRIVATE',
        },
      })

      isAiModalOpen.value = false
      toast.success('AI notu hazırladı ve Learning Vault kasasına ekledi! ✨')
      await fetchNotes()
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'AI not üretimi başarısız.')
  } finally {
    generatingAi.value = false
  }
}

const formatDate = (dateInput: string | Date) => {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}
</script>
