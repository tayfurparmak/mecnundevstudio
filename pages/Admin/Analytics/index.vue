<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-extrabold text-white tracking-tight">Öğrenme & Sistem Analitiği 📈</h1>
          <span class="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-indigo-400 font-mono">
            POSTGRESQL REALTIME
          </span>
        </div>
        <p class="text-slate-400 text-xs mt-1">Veritabanı düzeyinde hesaplanan çalışma süreleri, görev dağılımları, blog ve jurnal metrikleri.</p>
      </div>

      <button
        type="button"
        @click="fetchAnalytics"
        :disabled="loading"
        class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
      >
        <span :class="loading ? 'animate-spin' : ''">🔄</span>
        <span>Yenile</span>
      </button>
    </div>

    <!-- Error State Alert -->
    <div 
      v-if="errorMessage" 
      class="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center justify-between animate-fade-in"
    >
      <div class="flex items-center gap-2">
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>
      <button @click="errorMessage = ''" class="text-rose-400 hover:text-rose-200 text-xs">✕</button>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading && !data" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/60 animate-pulse space-y-3">
        <div class="h-4 bg-slate-800 rounded w-1/3"></div>
        <div class="h-8 bg-slate-800/60 rounded w-1/2"></div>
        <div class="h-3 bg-slate-800/40 rounded w-full"></div>
      </div>
    </div>

    <!-- Main 4 Key Metrics Overview Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- 1. Today Duration & Target -->
      <div class="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-2 shadow-md">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400">Bugünkü Çalışma</span>
          <span class="text-base">⏱️</span>
        </div>
        <div class="text-2xl font-extrabold text-white font-mono">
          {{ formatMinutes(data?.today?.actualMinutes ?? 0) }}
        </div>
        <div class="text-[11px] flex items-center justify-between text-slate-500">
          <span>Hedef: {{ formatMinutes(data?.today?.plannedMinutes ?? 120) }}</span>
          <span :class="(data?.today?.differenceMinutes ?? 0) >= 0 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'">
            {{ (data?.today?.differenceMinutes ?? 0) >= 0 ? `+${data?.today?.differenceMinutes ?? 0} dk` : `${data?.today?.differenceMinutes ?? 0} dk` }}
          </span>
        </div>
      </div>

      <!-- 2. Tasks & Kanban Status -->
      <div class="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-2 shadow-md">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400">Görev & Kanban</span>
          <span class="text-base">📋</span>
        </div>
        <div class="text-2xl font-extrabold text-indigo-400 font-mono">
          {{ data?.tasks?.completed ?? 0 }} <span class="text-xs text-slate-500 font-sans font-normal">/ {{ data?.tasks?.total ?? 0 }} Görev</span>
        </div>
        <div class="text-[11px] flex items-center justify-between text-slate-400">
          <span class="text-emerald-400 font-semibold">%{{ taskCompletionPercentage }} Tamamlandı</span>
          <span class="text-slate-500">{{ data?.tasks?.inProgress ?? 0 }} Devam Eden</span>
        </div>
      </div>

      <!-- 3. Blog & Content Status -->
      <div class="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-2 shadow-md">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400">CMS & Blog Yazıları</span>
          <span class="text-base">📝</span>
        </div>
        <div class="text-2xl font-extrabold text-white font-mono">
          {{ data?.posts?.published ?? 0 }} <span class="text-xs text-slate-500 font-sans font-normal">Yayında</span>
        </div>
        <div class="text-[11px] flex items-center justify-between text-slate-500">
          <span>Toplam: {{ data?.posts?.total ?? 0 }} Yazı</span>
          <span class="text-amber-400">{{ data?.posts?.draft ?? 0 }} Taslak</span>
        </div>
      </div>

      <!-- 4. Learning Journal & Streak -->
      <div class="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-2 shadow-md">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400">Öğrenme Serisi</span>
          <span class="text-base">🔥</span>
        </div>
        <div class="text-2xl font-extrabold text-amber-400 font-mono">
          {{ data?.streak ?? 0 }} <span class="text-xs text-slate-300 font-sans font-normal">Gün Kesintisiz</span>
        </div>
        <div class="text-[11px] flex items-center justify-between text-slate-500">
          <span>{{ data?.dailyLogs?.total ?? 0 }} Günlük Jurnal</span>
          <span class="text-indigo-400">{{ data?.notes?.total ?? 0 }} Özel Not</span>
        </div>
      </div>
    </div>

    <!-- Weekly Chart (Responsive CSS/SVG Bar Chart) -->
    <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-md">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <h2 class="text-sm font-bold text-white flex items-center gap-2">
            <span>📊</span>
            <span>Son 7 Günlük Çalışma Süresi Dağılımı</span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">PostgreSQL `LearningActivity` tablosundan gerçek süre kayıtları.</p>
        </div>

        <div class="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>Haftalık Toplam: <strong class="text-white">{{ formatMinutes(data?.week?.totalActualMinutes ?? 0) }}</strong></span>
        </div>
      </div>

      <!-- Bar Chart Grid -->
      <div class="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 pb-2 border-b border-slate-800">
        <div
          v-for="item in (data?.week?.chart ?? [])"
          :key="item.date"
          class="flex flex-col items-center gap-2 h-full justify-end group"
        >
          <!-- Tooltip on hover -->
          <span class="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            {{ item.actual }} dk
          </span>

          <!-- Bar Column -->
          <div class="w-full max-w-[40px] bg-slate-950 rounded-t-xl overflow-hidden h-36 flex items-end p-1 border border-slate-800/80">
            <div
              class="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-lg transition-all duration-500"
              :style="{ height: `${Math.min(100, Math.max(6, (item.actual / 180) * 100))}%` }"
            ></div>
          </div>

          <!-- Day Label -->
          <span class="text-xs font-semibold text-slate-400 mt-1">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- Secondary Grid: Technology Skills, English Levels & Recent Activities -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Technology Skills Progress (4 cols) -->
      <div class="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <span>🚀</span>
          <span>Teknoloji İlerleme Durumu</span>
        </h3>

        <div v-if="!data?.skills || data.skills.length === 0" class="text-xs text-slate-500 py-6 text-center">
          Henüz teknoloji kaydı yok.
        </div>

        <div v-else class="space-y-3.5">
          <div v-for="skill in data.skills" :key="skill.id" class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-200">{{ skill.skillName }}</span>
              <span class="font-mono font-bold text-emerald-400">%{{ skill.percentage }}</span>
            </div>
            <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                :style="{ width: `${skill.percentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- English CEFR Distribution (4 cols) -->
      <div class="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <span>🇬🇧</span>
          <span>İngilizce Seviye Dağılımı (CEFR)</span>
        </h3>

        <div class="grid grid-cols-5 gap-1.5 pt-1 text-center">
          <div
            v-for="lvl in ['A1', 'A2', 'B1', 'B2', 'C1']"
            :key="lvl"
            class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
          >
            <span class="text-[10px] font-bold text-slate-400 block">{{ lvl }}</span>
            <span class="text-base font-bold text-emerald-400 font-mono">
              {{ getWordCountForLevel(lvl) }}
            </span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
          <div class="flex justify-between">
            <span>Toplam Kelime Dağarcığı:</span>
            <span class="font-bold text-white font-mono">{{ data?.vocabulary?.totalWords ?? 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span>Tekrar Bekleyenler:</span>
            <span class="font-bold text-amber-400 font-mono">{{ data?.vocabulary?.dueForReviewCount ?? 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity Stream (4 cols) -->
      <div class="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <span>⚡</span>
          <span>Son Öğrenme Aktiviteleri</span>
        </h3>

        <div v-if="(!data?.recent?.tasks || data.recent.tasks.length === 0) && (!data?.recent?.activities || data.recent.activities.length === 0)" class="text-xs text-slate-500 py-6 text-center">
          Henüz aktivite kaydı yok.
        </div>

        <div v-else class="space-y-2.5">
          <div
            v-for="act in (data?.recent?.activities ?? [])"
            :key="'act_' + act.id"
            class="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-white font-mono">{{ act.technology }}</span>
              <span class="font-bold text-indigo-400 font-mono">+{{ act.durationMinutes }} dk</span>
            </div>
            <p v-if="act.topic" class="text-slate-400 text-[11px] truncate">{{ act.topic }}</p>
          </div>

          <div
            v-for="task in (data?.recent?.tasks ?? [])"
            :key="'task_' + task.id"
            class="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-400">✓ {{ task.title }}</span>
              <span class="text-[10px] text-slate-500 font-mono">{{ task.technology || 'Web' }}</span>
            </div>
          </div>
        </div>
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
const errorMessage = ref('')
const data = ref<any>(null)

const taskCompletionPercentage = computed(() => {
  if (!data.value?.tasks?.total) return 0
  return Math.round((data.value.tasks.completed / data.value.tasks.total) * 100)
})

const fetchAnalytics = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await $fetch<{ success: boolean }>('/api/analytics')
    if (res?.success) {
      data.value = res
      if (process.client) {
        toast.info('Analitik metrikleri güncellendi.')
      }
    }
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || 'Analitik verileri yüklenirken hata oluştu.'
    if (process.client) {
      toast.error('Analytics yüklenirken hata oluştu.')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAnalytics()
})

const getWordCountForLevel = (lvl: string) => {
  if (!data.value?.vocabulary?.levels) return 0
  const item = data.value.vocabulary.levels.find((l: any) => l.level === lvl)
  return item ? item.count : 0
}

const formatMinutes = (mins: number) => {
  const hours = Math.floor(mins / 60)
  const remaining = mins % 60
  if (hours > 0) {
    return `${hours} sa ${remaining > 0 ? `${remaining} dk` : ''}`
  }
  return `${mins} dk`
}
</script>