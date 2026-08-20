<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Günlük Öğrenme Jurnali (Daily Log) 📔</h1>
        <p class="text-slate-400 text-xs mt-1">Günün öğrenme özeti: Neyi başardım, nerede takıldım ve yarın ne yapacağım?</p>
      </div>

      <button
        type="button"
        @click="isModalOpen = true"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
      >
        + Yeni Günlük Giriş Ekle
      </button>
    </div>

    <!-- Daily Logs Timeline List -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 2" :key="i" class="p-6 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse space-y-3">
        <div class="h-4 bg-slate-800 rounded w-1/4"></div>
        <div class="h-3 bg-slate-800/60 rounded w-full"></div>
      </div>
    </div>

    <div v-else-if="logs.length === 0" class="p-12 rounded-2xl border-2 border-dashed border-slate-800 text-center space-y-3 bg-slate-900/30">
      <span class="text-3xl block">📔</span>
      <h3 class="text-sm font-semibold text-slate-300">Henüz Günlük Kaydı Bulunmuyor</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        Günün sonunda öğrendiklerinizi ve yarının planını kaydederek öğrenme disiplininizi koruyun.
      </p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="log in logs"
        :key="log.id"
        class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md"
      >
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
              {{ formatDate(log.createdAt) }}
            </span>
            <span v-if="log.technology" class="text-xs font-semibold text-slate-400">
              ({{ log.technology }})
            </span>
          </div>

          <span
            :class="[
              'text-[10px] font-bold px-2 py-0.5 rounded-full border',
              log.isCompleted
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
            ]"
          >
            {{ log.isCompleted ? '✅ Hedef Tamamlandı' : '⏳ Devam Ediyor' }}
          </span>
        </div>

        <div class="space-y-3 text-xs">
          <!-- Main Todo Task -->
          <div>
            <span class="text-slate-500 font-medium block text-[11px] mb-0.5">Günün Ana Görevi:</span>
            <p class="font-bold text-white text-sm">{{ log.todoTask }}</p>
          </div>

          <!-- What I learned -->
          <div v-if="log.learningLog" class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed">
            <span class="text-emerald-400 font-semibold block mb-1">💡 Bugün Ne Öğrendim?</span>
            {{ log.learningLog }}
          </div>

          <!-- What I couldn't learn / Blockers -->
          <div v-if="log.notLearned" class="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-200 leading-relaxed">
            <span class="text-rose-400 font-semibold block mb-1">⚠️ Nerede Takıldım / Neyi Anlamadım?</span>
            {{ log.notLearned }}
          </div>

          <!-- Tomorrow Plan -->
          <div v-if="log.planTomorrow" class="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 text-indigo-200 leading-relaxed">
            <span class="text-indigo-400 font-semibold block mb-1">🎯 Yarınki İlk Hedefim:</span>
            {{ log.planTomorrow }}
          </div>
        </div>
      </div>
    </div>

    <!-- New Daily Log Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
      @click.self="isModalOpen = false"
    >
      <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-in">
        <h3 class="text-base font-bold text-white">Günün Öğrenme Raporunu Yaz 📔</h3>
        <form @submit.prevent="createLog" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Günün Ana Hedefi / Görevi *</label>
            <input
              v-model="newLog.todoTask"
              type="text"
              required
              placeholder="Örn: Nuxt 4 Route Middleware ve API Güvenliği"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Teknoloji</label>
            <input
              v-model="newLog.technology"
              type="text"
              placeholder="Nuxt, Python, TypeScript..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Bugün Ne Öğrendim? (Özet)</label>
            <textarea
              v-model="newLog.learningLog"
              rows="3"
              placeholder="Kazanılan bilgiler, pratikler..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Nerede Takıldım? (Öğrenilemeyen Nokta)</label>
            <textarea
              v-model="newLog.notLearned"
              rows="2"
              placeholder="Kafama yatmayan veya tekrar edilmesi gereken detaylar..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Yarın Neyi Öğreneceğim?</label>
            <input
              v-model="newLog.planTomorrow"
              type="text"
              placeholder="Örn: Nitro Sub-route handler yapıları"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isCompleted"
              v-model="newLog.isCompleted"
              class="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
            />
            <label for="isCompleted" class="text-xs text-slate-300 cursor-pointer">Bugünkü hedefimi başarıyla tamamladım</label>
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              @click="isModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              Jurnale Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const toast = useToast()
const loading = ref(false)
const logs = ref<any[]>([])
const isModalOpen = ref(false)

const newLog = ref({
  todoTask: '',
  technology: 'Python',
  learningLog: '',
  notLearned: '',
  planTomorrow: '',
  isCompleted: true,
})

const fetchLogs = async () => {
  loading.value = true
  try {
    const res = await $fetch<{ success: boolean; logs: any[] }>('/api/daily-log')
    if (res?.logs) {
      logs.value = res.logs
    }
  } catch (err) {
    toast.error('Günlük kayıtları getirilirken hata oluştu.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLogs()
})

const createLog = async () => {
  if (!newLog.value.todoTask.trim()) return
  try {
    await $fetch('/api/daily-log', {
      method: 'POST',
      body: {
        todoTask: newLog.value.todoTask.trim(),
        technology: newLog.value.technology.trim() || undefined,
        learningLog: newLog.value.learningLog.trim() || undefined,
        notLearned: newLog.value.notLearned.trim() || undefined,
        planTomorrow: newLog.value.planTomorrow.trim() || undefined,
        isCompleted: newLog.value.isCompleted,
      },
    })
    isModalOpen.value = false
    newLog.value = { todoTask: '', technology: 'Python', learningLog: '', notLearned: '', planTomorrow: '', isCompleted: true }
    toast.success('Günün öğrenme jurnali kaydedildi! 📔')
    await fetchLogs()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Kayıt başarısız.')
  }
}

const formatDate = (dateInput: string | Date) => {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'short' }).format(d)
}
</script>