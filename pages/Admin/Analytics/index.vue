<template>
  <div class="space-y-10 animate-fade-in bg-cyber-grid min-h-screen pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Analytics & Metrics Hub 📈</h1>
          <span class="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[10px] font-mono font-bold text-cyan-400">
            SUPABASE REALTIME // PROD
          </span>
        </div>
        <p class="text-zinc-400 text-xs sm:text-sm mt-1">Supabase ve Prisma tabanlı gerçek zamanlı öğrenme temposu, beceri spektrumu ve görev verimlilik analitiği.</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="fetchAnalytics"
          :disabled="loading"
          class="px-4 py-2.5 rounded-xl bg-[#12121c] border border-white/10 text-xs text-zinc-300 hover:text-white hover:border-cyan-400/50 transition active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-sm font-mono"
        >
          <span :class="loading ? 'animate-spin' : ''">🔄</span>
          <span>Sistemi Yenile</span>
        </button>
      </div>
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
    <div v-if="loading && !data" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 animate-pulse space-y-4">
        <div class="h-4 bg-zinc-800 rounded w-1/3"></div>
        <div class="h-10 bg-zinc-800/60 rounded w-1/2"></div>
        <div class="h-3 bg-zinc-800/40 rounded w-full"></div>
      </div>
    </div>

    <!-- 1. Radial Efficiency Gauges & Key Metrics -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 1. Efficiency Gauge Card -->
      <div class="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4 card-hover-cyber shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-zinc-400 uppercase font-mono">Verimlilik İndeksi</span>
          <span class="text-base">🎯</span>
        </div>
        <div class="flex items-center justify-between py-2">
          <div>
            <div class="text-3xl font-extrabold text-white font-mono tracking-tight">
              %{{ efficiencyPercentage }}
            </div>
            <p class="text-xs text-zinc-500 mt-1">Planlanan vs Gerçekleşen</p>
          </div>
          <!-- Circular Progress Ring SVG -->
          <div class="relative w-16 h-16 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="currentColor" stroke-width="6" class="text-zinc-800 fill-none" />
              <circle
                cx="32" cy="32" r="26" stroke="currentColor" stroke-width="6"
                class="text-cyan-400 fill-none transition-all duration-1000"
                :stroke-dasharray="163"
                :stroke-dashoffset="163 - (163 * Math.min(100, efficiencyPercentage)) / 100"
                stroke-linecap="round"
              />
            </svg>
            <span class="absolute text-xs font-mono font-bold text-cyan-300">%{{ efficiencyPercentage }}</span>
          </div>
        </div>
        <div class="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5 pt-2 border-t border-white/5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Optimal Hedef Tempo</span>
        </div>
      </div>

      <!-- 2. Today Study Time Card -->
      <div class="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4 card-hover-cyber shadow-xl flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-zinc-400 uppercase font-mono">Bugünkü Çalışma</span>
          <span class="text-base">⏱️</span>
        </div>
        <div>
          <div class="text-3xl font-extrabold text-white font-mono tracking-tight">
            {{ formatMinutes(data?.today?.actualMinutes ?? 0) }}
          </div>
          <div class="text-xs text-zinc-500 mt-2 flex items-center justify-between">
            <span>Hedef: {{ formatMinutes(data?.today?.plannedMinutes ?? 120) }}</span>
            <span :class="(data?.today?.differenceMinutes ?? 0) >= 0 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'">
              {{ (data?.today?.differenceMinutes ?? 0) >= 0 ? `+${data?.today?.differenceMinutes ?? 0} dk` : `${data?.today?.differenceMinutes ?? 0} dk` }}
            </span>
          </div>
        </div>
        <div class="w-full bg-[#050508] h-2 rounded-full overflow-hidden border border-white/10">
          <div
            class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_8px_#00f2fe]"
            :style="{ width: `${Math.min(100, data?.today?.performancePercentage ?? 0)}%` }"
          ></div>
        </div>
      </div>

      <!-- 3. Kanban Task Velocity Card -->
      <div class="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4 card-hover-cyber shadow-xl flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-zinc-400 uppercase font-mono">Kanban Görev Hızı</span>
          <span class="text-base">📋</span>
        </div>
        <div>
          <div class="text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">
            {{ data?.tasks?.completed ?? 0 }} <span class="text-sm font-sans font-normal text-zinc-400">/ {{ data?.tasks?.total ?? 0 }}</span>
          </div>
          <p class="text-xs text-zinc-500 mt-1">
            {{ data?.tasks?.inProgress ?? 0 }} görev aktif işlemde
          </p>
        </div>
        <div class="text-[11px] text-zinc-400 font-mono flex items-center justify-between pt-2 border-t border-white/5">
          <span>Tamamlanma Oranı</span>
          <span class="text-emerald-400 font-bold">%{{ taskCompletionPercentage }}</span>
        </div>
      </div>

      <!-- 4. Learning Streak Card -->
      <div class="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4 card-hover-cyber shadow-xl flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-zinc-400 uppercase font-mono">Kesintisiz Seri</span>
          <span class="text-base">🔥</span>
        </div>
        <div>
          <div class="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
            {{ data?.streak ?? 0 }} <span class="text-sm font-sans font-normal text-zinc-300">Gün</span>
          </div>
          <p class="text-xs text-zinc-500 mt-1">
            {{ (data?.streak ?? 0) > 0 ? 'Mükemmel disiplin! Seriyi koruyun.' : 'Bugün ilk aktiviteyi kaydedin.' }}
          </p>
        </div>
        <div class="text-[11px] text-zinc-400 font-mono flex items-center justify-between pt-2 border-t border-white/5">
          <span>Toplam Jurnal</span>
          <span class="text-white font-bold">{{ data?.dailyLogs?.total ?? 0 }} Gün</span>
        </div>
      </div>
    </div>

    <!-- 2. Weekly Study Velocity Area / Bar Chart -->
    <div class="p-8 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div class="text-[11px] font-bold text-cyan-400 tracking-widest uppercase font-mono">VELOCITY ANALYTICS // 01</div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
            Son 7 Günlük Çalışma Temposu & Eğrisi 📊
          </h2>
          <p class="text-xs text-zinc-400 mt-1">PostgreSQL `LearningActivity` tablosundan beslenen gerçek zamanlı süre analizi.</p>
        </div>

        <div class="flex items-center gap-4 text-xs font-mono">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded bg-cyan-400 shadow-[0_0_8px_#00f2fe]"></span>
            <span class="text-zinc-300">Gerçekleşen Süre</span>
          </div>
          <span class="text-zinc-500">|</span>
          <span class="text-zinc-300">Haftalık Toplam: <strong class="text-white">{{ formatMinutes(data?.week?.totalActualMinutes ?? 0) }}</strong></span>
        </div>
      </div>

      <!-- Responsive SVG/CSS Bar Chart with Smooth Easing Animation -->
      <div class="grid grid-cols-7 gap-3 sm:gap-6 items-end h-64 pt-8 pb-4 border-b border-white/5">
        <div
          v-for="item in (data?.week?.chart ?? [])"
          :key="item.date"
          class="flex flex-col items-center gap-3 h-full justify-end group cursor-pointer"
        >
          <!-- Floating Tooltip Preview -->
          <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-16 px-3 py-1.5 rounded-xl bg-[#141420] border border-cyan-500/40 text-cyan-300 font-mono text-xs shadow-2xl pointer-events-none z-20">
            <div class="font-bold">{{ item.label }} ({{ item.date }})</div>
            <div>Süre: {{ item.actual }} dk</div>
          </div>

          <!-- Bar Column Container -->
          <div class="w-full max-w-[56px] bg-[#050508] rounded-2xl overflow-hidden h-48 flex flex-col justify-end p-1.5 border border-white/10 group-hover:border-cyan-400/50 transition-all shadow-inner">
            <div
              class="w-full bg-gradient-to-t from-violet-600 via-cyan-500 to-cyan-300 rounded-xl transition-all duration-700 shadow-[0_0_15px_rgba(0,242,254,0.4)] relative group-hover:brightness-125"
              :style="{ height: `${Math.min(100, Math.max(8, (item.actual / 240) * 100))}%` }"
            >
              <div class="absolute inset-x-0 top-0 h-1 bg-white/40 rounded-t-xl"></div>
            </div>
          </div>

          <!-- Day Label -->
          <div class="text-center">
            <span class="text-xs font-bold text-zinc-300 group-hover:text-cyan-400 transition font-mono">{{ item.label }}</span>
            <span class="block text-[10px] text-zinc-500 font-mono">{{ item.actual }}dk</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Skill & Category Matrix & English CEFR Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Skill & Category Radar / Segmented Neon Bars (7 cols) -->
      <div class="lg:col-span-7 p-8 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div class="text-[11px] font-bold text-cyan-400 tracking-widest uppercase font-mono">SKILL MATRIX // 02</div>
            <h3 class="text-lg font-extrabold text-white mt-1">Yetenek Uzmanlık Dağılımı</h3>
          </div>
          <span class="text-xs font-mono text-zinc-400">{{ (data?.skills ?? []).length }} Aktif Konu</span>
        </div>

        <div v-if="!data?.skills || data.skills.length === 0" class="text-xs text-zinc-500 py-12 text-center">
          Yetenek kaydı bulunmuyor.
        </div>

        <div v-else class="space-y-5">
          <div v-for="skill in data.skills" :key="skill.id" class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {{ skill.skillName }}
              </span>
              <span class="font-mono font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">%{{ skill.percentage }}</span>
            </div>
            
            <!-- Segmented Energy Bar -->
            <div class="w-full bg-[#050508] h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5 flex gap-0.5">
              <div
                v-for="seg in 10"
                :key="seg"
                :class="[
                  'h-full flex-1 rounded-xs transition-all duration-500',
                  (seg / 10) * 100 <= skill.percentage
                    ? 'bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_6px_rgba(0,242,254,0.5)]'
                    : 'bg-white/5'
                ]"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- English CEFR Distribution & Vocabulary Stats (5 cols) -->
      <div class="lg:col-span-5 p-8 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-6 shadow-2xl flex flex-col justify-between">
        <div class="space-y-6">
          <div class="border-b border-white/10 pb-4">
            <div class="text-[11px] font-bold text-violet-400 tracking-widest uppercase font-mono">LINGUISTIC ANALYTICS // 03</div>
            <h3 class="text-lg font-extrabold text-white mt-1">İngilizce CEFR Kelime Dağarcığı</h3>
          </div>

          <div class="grid grid-cols-5 gap-2 text-center">
            <div
              v-for="lvl in ['A1', 'A2', 'B1', 'B2', 'C1']"
              :key="lvl"
              class="p-3 rounded-2xl bg-[#050508] border border-white/10 space-y-1 card-hover-cyber"
            >
              <span class="text-[10px] font-bold text-zinc-400 block font-mono">{{ lvl }}</span>
              <span class="text-lg font-extrabold text-cyan-400 font-mono">
                {{ getWordCountForLevel(lvl) }}
              </span>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-[#050508] border border-white/10 text-xs text-zinc-300 space-y-3 font-mono">
            <div class="flex justify-between items-center">
              <span class="text-zinc-400">Toplam Kelime Dağarcığı:</span>
              <span class="font-bold text-white text-sm">{{ data?.vocabulary?.totalWords ?? 0 }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-white/5">
              <span class="text-zinc-400">Tekrar Bekleyenler:</span>
              <span class="font-bold text-rose-400 text-sm animate-pulse">{{ data?.vocabulary?.dueForReviewCount ?? 0 }} Kelime</span>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <NuxtLink
            to="/admin/english"
            class="w-full py-3 rounded-xl bg-[#141420] hover:bg-white/5 border border-white/10 hover:border-cyan-400/50 text-cyan-300 text-xs font-bold transition flex items-center justify-center gap-2 font-mono shadow-sm active:scale-95"
          >
            <span>SRS Tekrar Paneline Git</span>
            <span>→</span>
          </NuxtLink>
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

const efficiencyPercentage = computed(() => {
  if (!data.value?.week?.totalPlannedMinutes) return 85
  const ratio = (data.value.week.totalActualMinutes / data.value.week.totalPlannedMinutes) * 100
  return Math.min(100, Math.round(ratio))
})

const fetchAnalytics = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await $fetch<{ success: boolean }>('/api/analytics')
    if (res?.success) {
      data.value = res
      if (process.client) {
        toast.success('Analitik metrikleri başarıyla senkronize edildi.')
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
