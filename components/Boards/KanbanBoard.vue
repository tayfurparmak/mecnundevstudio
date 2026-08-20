<template>
  <div class="space-y-6">
    <!-- Header / Controls Row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Learning Kanban Board 📋</h1>
        <p class="text-slate-400 text-sm mt-0.5">Konu, alt checklist maddeleri ve süre takipli öğrenme panosu.</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Refresh Button -->
        <button
          type="button"
          @click="fetchTasks"
          :disabled="loading"
          class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50"
          title="Yenile"
        >
          <svg :class="['w-4 h-4', loading ? 'animate-spin' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <!-- New Task Button -->
        <button
          type="button"
          @click="openCreateModal('TODO')"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <span>+</span>
          <span>Yeni Görev / Konu Ekle</span>
        </button>
      </div>
    </div>

    <!-- Kanban Grid (3 Columns) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="col in columns"
        :key="col.status"
        @dragover.prevent="onDragOver($event, col.status)"
        @dragenter.prevent="onDragEnter(col.status)"
        @dragleave.prevent="onDragLeave(col.status)"
        @drop="onDrop($event, col.status)"
        :class="[
          'flex flex-col p-4 rounded-2xl bg-slate-900/60 border transition-all duration-200 min-h-[440px]',
          dragOverColumn === col.status
            ? 'border-indigo-500 bg-slate-900 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-950'
            : 'border-slate-800/80 hover:border-slate-700/80'
        ]"
      >
        <!-- Column Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
          <div class="flex items-center gap-2">
            <span class="text-base">{{ col.icon }}</span>
            <h2 class="text-sm font-bold text-slate-200">{{ col.title }}</h2>
          </div>
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800/90 text-slate-400 border border-slate-700/60 font-mono">
            {{ getTasksByStatus(col.status).length }}
          </span>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading && tasks.length === 0" class="space-y-3 flex-1">
          <div v-for="i in 3" :key="i" class="p-4 rounded-xl bg-slate-950/40 border border-slate-800/40 animate-pulse space-y-2">
            <div class="h-3.5 bg-slate-800 rounded w-3/4"></div>
            <div class="h-2.5 bg-slate-800/60 rounded w-1/3"></div>
          </div>
        </div>

        <!-- Task List -->
        <div v-else class="space-y-3 flex-1 flex flex-col">
          <TaskCard
            v-for="task in getTasksByStatus(col.status)"
            :key="task.id"
            :task="task"
            :is-dragging="draggedTaskId === task.id"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
            @update-status="handleUpdateStatus"
            @toggle-done="handleToggleDone"
            @delete-task="handleDeleteTask"
            @open-detail="openDetailModal"
          />

          <!-- Empty State -->
          <div
            v-if="getTasksByStatus(col.status).length === 0"
            class="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800/60 rounded-xl text-center text-slate-500 my-auto"
          >
            <span class="text-xl mb-1 opacity-60">📭</span>
            <p class="text-xs font-medium">Henüz kart yok</p>
            <button
              type="button"
              @click="openCreateModal(col.status)"
              class="mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 transition"
            >
              + Kart Ekle
            </button>
          </div>
        </div>

        <!-- Column Footer: Quick Add Button -->
        <div class="mt-3 pt-2">
          <button
            type="button"
            @click="openCreateModal(col.status)"
            class="w-full py-2 rounded-xl border border-dashed border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <span>+</span>
            <span>Görev Ekle</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Create Task Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
      @click.self="closeCreateModal"
    >
      <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-in">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white">Yeni Öğrenme Kartı Ekle</h3>
          <button
            type="button"
            @click="closeCreateModal"
            class="text-slate-400 hover:text-white transition p-1"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="submitCreateTask" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Görev / Kart Başlığı *</label>
            <input
              v-model="newTask.title"
              type="text"
              placeholder="Örn: Present Perfect Tense Kullanımı"
              required
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Teknoloji / Kategori *</label>
              <input
                v-model="newTask.technology"
                type="text"
                required
                placeholder="Örn: English, Python, Nuxt"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Öncelik</label>
              <select
                v-model="newTask.priority"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="LOW">Düşük</option>
                <option value="MEDIUM">Orta</option>
                <option value="HIGH">Yüksek</option>
                <option value="URGENT">Acil ⚡</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Konu (Topic)</label>
              <input
                v-model="newTask.topic"
                type="text"
                placeholder="Örn: Grammar Rules"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Tahmini Süre (Dk)</label>
              <input
                v-model.number="newTask.estimatedMinutes"
                type="number"
                min="5"
                placeholder="45"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Açıklama / Not</label>
            <textarea
              v-model="newTask.description"
              rows="2"
              placeholder="Öğrenilecek detaylar..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Checklist Maddeleri (Her satıra bir madde)</label>
            <textarea
              v-model="newTask.checklistText"
              rows="3"
              placeholder="Have/has kullanımı&#10;Past participle&#10;Since / For kuralları"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            ></textarea>
          </div>

          <div class="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              @click="closeCreateModal"
              class="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              :disabled="isCreating || !newTask.title.trim()"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
            >
              {{ isCreating ? 'Ekleniyor...' : 'Kartı Kaydet' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Task Detail / Edit Modal -->
    <div
      v-if="selectedTask"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
      @click.self="selectedTask = null"
    >
      <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl animate-scale-in">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
              {{ selectedTask.technology || selectedTask.category }}
            </span>
            <h3 class="text-sm font-bold text-white">{{ selectedTask.title }}</h3>
          </div>
          <button @click="selectedTask = null" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <div v-if="selectedTask.description" class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
            {{ selectedTask.description }}
          </div>

          <!-- Status & Priority Control -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-400 mb-1">Durum</label>
              <select
                v-model="selectedTask.status"
                @change="updateSelectedTask"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              >
                <option value="TODO">📋 Yapılacaklar</option>
                <option value="IN_PROGRESS">⏳ Devam Edenler</option>
                <option value="DONE">✅ Tamamlananlar</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-400 mb-1">Gerçekleşen Süre (Dk)</label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="selectedTask.actualMinutes"
                  type="number"
                  min="0"
                  class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
                <button
                  type="button"
                  @click="updateSelectedTask"
                  class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>

          <!-- Checklist Items -->
          <div class="space-y-2 pt-2 border-t border-slate-800">
            <label class="block font-semibold text-slate-300">Alt Checklist Maddeleri</label>
            <div
              v-for="chk in (selectedTask.checklists || [])"
              :key="chk.id"
              class="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800/80 cursor-pointer"
              @click="toggleTaskChecklist(chk)"
            >
              <input
                type="checkbox"
                :checked="chk.isCompleted"
                class="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                @click.stop="toggleTaskChecklist(chk)"
              />
              <span :class="chk.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'">
                {{ chk.title }}
              </span>
            </div>
            <div v-if="!selectedTask.checklists || selectedTask.checklists.length === 0" class="text-slate-500 italic">
              Bu kart için checklist bulunmuyor.
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800 flex justify-between items-center">
          <button
            type="button"
            @click="handleDeleteTask(selectedTask.id); selectedTask = null"
            class="text-xs text-rose-400 hover:text-rose-300 transition"
          >
            🗑️ Kartı Sil
          </button>
          <button
            type="button"
            @click="selectedTask = null"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import type { TaskItem, TaskStatus } from '~/types/board'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'

interface ColumnDef {
  status: TaskStatus
  title: string
  icon: string
}

const toast = useToast()
const confirm = useConfirm()

const columns: ColumnDef[] = [
  { status: 'TODO', title: 'Yapılacaklar', icon: '📋' },
  { status: 'IN_PROGRESS', title: 'Devam Edenler', icon: '⏳' },
  { status: 'DONE', title: 'Tamamlananlar', icon: '✅' },
]

const tasks = ref<TaskItem[]>([])
const loading = ref(false)
const selectedTask = ref<TaskItem | null>(null)

const draggedTaskId = ref<number | null>(null)
const dragOverColumn = ref<TaskStatus | null>(null)

// Modal State
const isModalOpen = ref(false)
const isCreating = ref(false)
const newTask = ref({
  title: '',
  technology: 'Python',
  topic: '',
  priority: 'MEDIUM',
  estimatedMinutes: 45,
  description: '',
  checklistText: '',
  status: 'TODO' as TaskStatus,
})

const fetchTasks = async () => {
  loading.value = true
  try {
    const data = await $fetch<{ success: boolean; tasks: TaskItem[] }>('/api/board/tasks')
    if (data?.tasks) {
      tasks.value = data.tasks
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Görevler yüklenirken hata oluştu.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTasks()
})

const getTasksByStatus = (status: TaskStatus) => {
  return tasks.value.filter(t => t.status === status)
}

const openDetailModal = (task: TaskItem) => {
  selectedTask.value = JSON.parse(JSON.stringify(task))
}

const updateSelectedTask = async () => {
  if (!selectedTask.value) return
  try {
    const res = await $fetch<{ success: boolean; task: TaskItem }>(`/api/board/tasks/${selectedTask.value.id}`, {
      method: 'PATCH',
      body: {
        status: selectedTask.value.status,
        actualMinutes: selectedTask.value.actualMinutes,
      },
    })
    if (res?.task) {
      const idx = tasks.value.findIndex(t => t.id === res.task.id)
      if (idx !== -1) tasks.value[idx] = res.task
      toast.success('Kart bilgileri güncellendi.')
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Güncellenemedi.')
  }
}

const toggleTaskChecklist = async (chk: any) => {
  const newStatus = !chk.isCompleted
  chk.isCompleted = newStatus
  try {
    await $fetch('/api/topics/checklist', {
      method: 'PATCH',
      body: { id: chk.id, isCompleted: newStatus },
    })
  } catch {
    chk.isCompleted = !newStatus
    toast.error('Checklist güncellenemedi.')
  }
}

// Drag & Drop
const handleDragStart = (_event: DragEvent, task: TaskItem) => {
  draggedTaskId.value = task.id
}

const handleDragEnd = () => {
  draggedTaskId.value = null
  dragOverColumn.value = null
}

const onDragOver = (event: DragEvent, status: TaskStatus) => {
  event.dataTransfer!.dropEffect = 'move'
  dragOverColumn.value = status
}

const onDragEnter = (status: TaskStatus) => {
  dragOverColumn.value = status
}

const onDragLeave = (status: TaskStatus) => {
  if (dragOverColumn.value === status) {
    dragOverColumn.value = null
  }
}

const onDrop = async (_event: DragEvent, targetStatus: TaskStatus) => {
  const taskId = draggedTaskId.value
  dragOverColumn.value = null
  draggedTaskId.value = null

  if (!taskId) return

  const targetTask = tasks.value.find(t => t.id === taskId)
  if (!targetTask || targetTask.status === targetStatus) return

  await handleUpdateStatus(taskId, targetStatus)
}

const handleUpdateStatus = async (taskId: number, newStatus: TaskStatus) => {
  const previousTasks = JSON.parse(JSON.stringify(tasks.value)) as TaskItem[]
  const taskIndex = tasks.value.findIndex(t => t.id === taskId)
  if (taskIndex !== -1) {
    const current = tasks.value[taskIndex]
    if (current) {
      current.status = newStatus
    }
  }

  try {
    const res = await $fetch<{ success: boolean; task: TaskItem }>(`/api/board/tasks/${taskId}`, {
      method: 'PATCH',
      body: { status: newStatus },
    })
    if (res?.task && taskIndex !== -1) {
      tasks.value[taskIndex] = res.task
    }
  } catch (err: any) {
    tasks.value = previousTasks
    toast.error(err?.data?.statusMessage || 'Durum güncellenirken bir hata oluştu.')
  }
}

const handleToggleDone = async (task: TaskItem) => {
  const newStatus: TaskStatus = task.status === 'DONE' ? 'TODO' : 'DONE'
  await handleUpdateStatus(task.id, newStatus)
}

const handleDeleteTask = async (taskId: number) => {
  const ok = await confirm.ask({
    title: 'Görevi Sil',
    message: 'Bu kartı silmek istediğinizden emin misiniz?',
    confirmText: 'Evet, Sil',
  })
  if (!ok) return

  const previousTasks = JSON.parse(JSON.stringify(tasks.value)) as TaskItem[]
  tasks.value = tasks.value.filter(t => t.id !== taskId)

  try {
    await $fetch(`/api/board/tasks/${taskId}`, { method: 'DELETE' })
    toast.success('Kart başarıyla silindi.')
  } catch (err: any) {
    tasks.value = previousTasks
    toast.error(err?.data?.statusMessage || 'Görev silinemedi.')
  }
}

const openCreateModal = (initialStatus: TaskStatus = 'TODO') => {
  newTask.value = {
    title: '',
    technology: 'Python',
    topic: '',
    priority: 'MEDIUM',
    estimatedMinutes: 45,
    description: '',
    checklistText: '',
    status: initialStatus,
  }
  isModalOpen.value = true
}

const closeCreateModal = () => {
  isModalOpen.value = false
}

const submitCreateTask = async () => {
  if (!newTask.value.title.trim()) return

  isCreating.value = true

  const checklistItems = newTask.value.checklistText
    .split('\n')
    .map(t => t.trim())
    .filter(Boolean)
    .map(title => ({ title, isCompleted: false }))

  try {
    const res = await $fetch<{ success: boolean; task: TaskItem }>('/api/board/tasks', {
      method: 'POST',
      body: {
        title: newTask.value.title.trim(),
        technology: newTask.value.technology.trim(),
        topic: newTask.value.topic.trim() || undefined,
        priority: newTask.value.priority,
        estimatedMinutes: newTask.value.estimatedMinutes,
        description: newTask.value.description.trim() || undefined,
        status: newTask.value.status,
        checklists: checklistItems,
      },
    })

    if (res?.task) {
      tasks.value.push(res.task)
      closeCreateModal()
      toast.success('Yeni kart panoya eklendi! 📋')
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Görev eklenirken bir hata oluştu.')
  } finally {
    isCreating.value = false
  }
}
</script>
