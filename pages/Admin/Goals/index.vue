<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Öğrenme Hiyerarşisi (Goals & Topics) 🎯</h1>
        <p class="text-slate-400 text-xs mt-1">Hedef → Teknoloji → Konu → Alt Maddeler (Checklist) ilişkisel takip sistemi.</p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          @click="isGoalModalOpen = true"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
        >
          + Yeni Hedef Ekle
        </button>

        <button
          type="button"
          @click="isTopicModalOpen = true"
          class="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold transition"
        >
          + Yeni Konu Ekle
        </button>
      </div>
    </div>

    <!-- Goals & Topics Tree -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 2" :key="i" class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse space-y-4">
        <div class="h-5 bg-slate-800 rounded w-1/3"></div>
        <div class="h-3 bg-slate-800/60 rounded w-full"></div>
      </div>
    </div>

    <div v-else-if="goals.length === 0" class="p-12 rounded-2xl border-2 border-dashed border-slate-800 text-center space-y-3 bg-slate-900/30">
      <span class="text-3xl block">🎯</span>
      <h3 class="text-sm font-semibold text-slate-300">Henüz Öğrenme Hedefi Eklenmemiş</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        Öğrenmek istediğiniz bir teknoloji için büyük hedef oluşturun ve alt konuları bağlayın.
      </p>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="goal in goals"
        :key="goal.id"
        class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-md"
      >
        <!-- Goal Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2.5">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase">
                {{ goal.category }}
              </span>
              <h2 class="text-lg font-bold text-white">{{ goal.title }}</h2>
            </div>
            <p v-if="goal.description" class="text-xs text-slate-400">{{ goal.description }}</p>
          </div>

          <div class="flex items-center gap-4 self-end sm:self-auto">
            <div class="text-right">
              <span class="text-xs font-mono font-bold text-emerald-400 block">%{{ goal.progress }} İlerleme</span>
              <span class="text-[10px] text-slate-500">Hedef: {{ goal.targetDate }}</span>
            </div>
            <button
              type="button"
              @click="deleteGoal(goal.id)"
              class="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-400 text-xs transition"
              title="Hedefi Sil"
            >
              🗑️
            </button>
          </div>
        </div>

        <!-- Goal Progress Bar -->
        <div class="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div 
            class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            :style="{ width: `${goal.progress}%` }"
          ></div>
        </div>

        <!-- Topics & Checklists for this Goal -->
        <div class="space-y-3">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Bağlı Konular & Alt Maddeler ({{ (goal.topics || []).length }})</span>
            <button
              type="button"
              @click="openTopicModalForGoal(goal.id, goal.category)"
              class="text-indigo-400 hover:text-indigo-300 text-xs lowercase font-normal"
            >
              + bu hedefe konu ekle
            </button>
          </div>

          <div v-if="!goal.topics || goal.topics.length === 0" class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-500 text-center">
            Bu hedefe bağlı konu bulunmuyor.
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="topic in goal.topics"
              :key="topic.id"
              class="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3 hover:border-slate-700 transition"
            >
              <!-- Topic Header -->
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'w-2.5 h-2.5 rounded-full shrink-0',
                      topic.status === 'DONE' ? 'bg-emerald-500' : topic.status === 'IN_PROGRESS' ? 'bg-amber-500' : 'bg-slate-600'
                    ]"
                  ></span>
                  <h4 class="text-xs font-bold text-white">{{ topic.title }}</h4>
                </div>

                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                      topic.status === 'DONE'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                        : topic.status === 'IN_PROGRESS'
                        ? 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    ]"
                  >
                    {{ topic.status === 'DONE' ? 'Tamamlandı' : topic.status === 'IN_PROGRESS' ? 'Devam Ediyor' : 'Bekliyor' }}
                  </span>

                  <!-- AI Topic Summary Button -->
                  <button
                    type="button"
                    @click="generateTopicSummary(topic)"
                    class="p-1 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 hover:text-white text-[10px]"
                    title="AI ile Konu Özeti Çıkar"
                  >
                    ✨
                  </button>
                </div>
              </div>

              <!-- Checklist Items -->
              <div class="space-y-1.5 pl-2 border-l-2 border-slate-800">
                <div
                  v-for="chk in topic.checklists"
                  :key="chk.id"
                  class="flex items-center gap-2 text-xs group cursor-pointer select-none"
                  @click="toggleChecklist(chk)"
                >
                  <input
                    type="checkbox"
                    :checked="chk.isCompleted"
                    class="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                    @click.stop="toggleChecklist(chk)"
                  />
                  <span :class="chk.isCompleted ? 'line-through text-slate-500' : 'text-slate-300 group-hover:text-white'">
                    {{ chk.title }}
                  </span>
                </div>

                <div v-if="!topic.checklists || topic.checklists.length === 0" class="text-[11px] text-slate-600 italic">
                  Alt checklist maddesi yok.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Goal Modal -->
    <div
      v-if="isGoalModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
      @click.self="isGoalModalOpen = false"
    >
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-in">
        <h3 class="text-base font-bold text-white">Yeni Öğrenme Hedefi Ekle 🎯</h3>
        <form @submit.prevent="createGoal" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Hedef Başlığı *</label>
            <input
              v-model="goalForm.title"
              type="text"
              required
              placeholder="Örn: 3 Ayda Python Backend Uzmanlaşması"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Kategori / Teknoloji *</label>
            <input
              v-model="goalForm.category"
              type="text"
              required
              placeholder="Örn: Python, Nuxt, AI, English"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Hedef Bitiş Tarihi</label>
            <input
              v-model="goalForm.targetDate"
              type="text"
              placeholder="Örn: Kasım 2026 veya 30 Gün"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Açıklama</label>
            <textarea
              v-model="goalForm.description"
              rows="2"
              placeholder="Hedefin amacı ve kazanımları..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              @click="isGoalModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              Hedefi Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- New Topic Modal -->
    <div
      v-if="isTopicModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
      @click.self="isTopicModalOpen = false"
    >
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-in">
        <h3 class="text-base font-bold text-white">Yeni Konu & Checklist Ekle 📚</h3>
        <form @submit.prevent="createTopic" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Bağlı Hedef</label>
            <select
              v-model="topicForm.goalId"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option :value="null">Bağımsız Konu</option>
              <option v-for="g in goals" :key="g.id" :value="g.id">{{ g.title }} ({{ g.category }})</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Teknoloji *</label>
            <input
              v-model="topicForm.technology"
              type="text"
              required
              placeholder="Örn: Python"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Konu Başlığı *</label>
            <input
              v-model="topicForm.title"
              type="text"
              required
              placeholder="Örn: Functions & Parameters"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Alt Checklist Maddeleri (Her satıra bir madde)</label>
            <textarea
              v-model="topicForm.checklistText"
              rows="4"
              placeholder="Function definition&#10;Parameters&#10;Return&#10;*args ve **kwargs"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            ></textarea>
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              @click="isTopicModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              Konuyu Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- AI Summary Modal -->
    <div
      v-if="aiSummaryModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
      @click.self="aiSummaryModalOpen = false"
    >
      <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-in">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <span>✨</span>
            <span>AI Konu Özeti & Pekiştirme</span>
          </h3>
          <button @click="aiSummaryModalOpen = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div v-if="generatingSummary" class="py-12 text-center space-y-3">
          <div class="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-xs text-slate-400">Gemini 3.6 Flash konu özetini hazırlıyor...</p>
        </div>

        <div v-else class="space-y-4">
          <div class="text-xs font-bold text-indigo-400">{{ activeSummaryTopic?.title }}</div>
          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans prose-invert max-h-72 overflow-y-auto">
            <MarkdownRenderer :content="generatedSummaryText" />
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="saveSummaryToVault"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-indigo-600/20"
            >
              🔒 Learning Vault'a Kaydet
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
const goals = ref<any[]>([])

const isGoalModalOpen = ref(false)
const isTopicModalOpen = ref(false)
const aiSummaryModalOpen = ref(false)
const generatingSummary = ref(false)
const generatedSummaryText = ref('')
const activeSummaryTopic = ref<any>(null)

const goalForm = ref({
  title: '',
  category: 'Python',
  targetDate: '',
  description: '',
})

const topicForm = ref<{
  goalId: number | null
  technology: string
  title: string
  checklistText: string
}>({
  goalId: null,
  technology: 'Python',
  title: '',
  checklistText: '',
})

const fetchGoals = async () => {
  loading.value = true
  try {
    const res = await $fetch<{ success: boolean; goals: any[] }>('/api/goals')
    if (res?.goals) {
      goals.value = res.goals
    }
  } catch (err) {
    toast.error('Hedefler getirilirken hata oluştu.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGoals()
})

const toggleChecklist = async (chk: any) => {
  const newStatus = !chk.isCompleted
  chk.isCompleted = newStatus

  try {
    await $fetch('/api/topics/checklist', {
      method: 'PATCH',
      body: {
        id: chk.id,
        isCompleted: newStatus,
      },
    })
    await fetchGoals()
  } catch (err) {
    chk.isCompleted = !newStatus
    toast.error('Checklist güncellenemedi.')
  }
}

const openTopicModalForGoal = (goalId: number, category: string) => {
  topicForm.value.goalId = goalId
  topicForm.value.technology = category
  isTopicModalOpen.value = true
}

const createGoal = async () => {
  if (!goalForm.value.title.trim()) return
  try {
    await $fetch('/api/goals', {
      method: 'POST',
      body: {
        title: goalForm.value.title.trim(),
        category: goalForm.value.category.trim(),
        targetDate: goalForm.value.targetDate.trim() || undefined,
        description: goalForm.value.description.trim() || undefined,
      },
    })
    isGoalModalOpen.value = false
    goalForm.value = { title: '', category: 'Python', targetDate: '', description: '' }
    toast.success('Yeni hedef başarıyla oluşturuldu! 🎯')
    await fetchGoals()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Hedef eklenemedi.')
  }
}

const createTopic = async () => {
  if (!topicForm.value.title.trim()) return
  const checklistItems = topicForm.value.checklistText
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((title) => ({ title, isCompleted: false }))

  try {
    await $fetch('/api/topics', {
      method: 'POST',
      body: {
        goalId: topicForm.value.goalId,
        technology: topicForm.value.technology.trim(),
        title: topicForm.value.title.trim(),
        checklists: checklistItems,
      },
    })
    isTopicModalOpen.value = false
    topicForm.value = { goalId: null, technology: 'Python', title: '', checklistText: '' }
    toast.success('Yeni konu başarıyla eklendi! 📚')
    await fetchGoals()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Konu eklenemedi.')
  }
}

const deleteGoal = async (id: number) => {
  const ok = await confirm.ask({
    title: 'Hedefi Sil',
    message: 'Bu hedefi silmek istediğinizden emin misiniz? (Bağlı konular korunacaktır)',
    confirmText: 'Evet, Sil',
  })
  if (!ok) return

  try {
    await $fetch(`/api/goals/${id}`, { method: 'DELETE' })
    toast.success('Hedef başarıyla silindi.')
    await fetchGoals()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Hedef silinemedi.')
  }
}

const generateTopicSummary = async (topic: any) => {
  activeSummaryTopic.value = topic
  aiSummaryModalOpen.value = true
  generatingSummary.value = true
  generatedSummaryText.value = ''

  try {
    const subtopics = (topic.checklists || []).map((c: any) => c.title)
    const res = await $fetch<{ success: boolean; summary: string }>('/api/ai/generate-summary', {
      method: 'POST',
      body: {
        topic: topic.title,
        technology: topic.technology,
        subtopics,
      },
    })
    if (res?.summary) {
      generatedSummaryText.value = res.summary
    }
  } catch (err: any) {
    generatedSummaryText.value = 'Özet hazırlanırken bir hata oluştu: ' + (err?.data?.statusMessage || err?.message)
  } finally {
    generatingSummary.value = false
  }
}

const saveSummaryToVault = async () => {
  if (!activeSummaryTopic.value || !generatedSummaryText.value) return
  try {
    await $fetch('/api/learning-notes', {
      method: 'POST',
      body: {
        title: `${activeSummaryTopic.value.title} - Öğrenme Özeti`,
        technology: activeSummaryTopic.value.technology,
        topic: activeSummaryTopic.value.title,
        content: generatedSummaryText.value,
        status: 'PRIVATE',
      },
    })
    toast.success('Özet başarıyla Learning Vault kasasına kaydedildi! 🔒')
    aiSummaryModalOpen.value = false
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Kayıt başarısız.')
  }
}
</script>
