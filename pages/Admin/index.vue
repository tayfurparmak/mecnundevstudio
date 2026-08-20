<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-extrabold text-white tracking-tight">Bugün Neredeyim? 🧭</h1>
          <span class="px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-400 text-xs font-mono font-semibold">
            {{ formattedToday }}
          </span>
        </div>
        <p class="text-slate-400 text-xs mt-1">Kişisel öğrenme hedefleriniz, günlük ilerlemeniz ve anlık durum analizi.</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="fetchDashboardData"
          :disabled="loading"
          class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
        >
          <span :class="loading ? 'animate-spin' : ''">🔄</span>
          <span>Yenile</span>
        </button>
      </div>
    </div>

    <!-- 4 Main Glowing KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- 1. Daily Goal & Performance -->
      <div class="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3 shadow-md hover:border-slate-700 transition">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400">Bugünkü Çalışma</span>
          <span class="text-base">⏱️</span>
        </div>
        <div>
          <div class="text-2xl font-extrabold text-white tracking-tight">
            {{ formatMinutes(analytics?.today?.actualMinutes ?? 0) }}
          </div>
          <div class="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Hedef: {{ formatMinutes(analytics?.today?.plannedMinutes ?? 120) }}</span>
            <span :class="(analytics?.today?.differenceMinutes ?? 0) >= 0 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'">
              {{ (analytics?.today?.differenceMinutes ?? 0) >= 0 ? `+${analytics?.today?.differenceMinutes ?? 0} dk` : `${analytics?.today?.differenceMinutes ?? 0} dk` }}
            </span>
          </div>
        </div>
        <!-- Mini Progress Bar with Gradient Glow -->
        <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div 
            class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            :style="{ width: `${Math.min(100, analytics?.today?.performancePercentage ?? 0)}%` }"
          ></div>
        </div>
        <div class="text-[11px] text-slate-400 font-medium flex justify-between">
          <span>Tamamlanma</span>
          <span class="font-bold text-indigo-300 font-mono">%{{ analytics?.today?.performancePercentage ?? 0 }}</span>
        </div>
      </div>

      <!-- 2. Topics Status -->
      <div class="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3 shadow-md hover:border-slate-700 transition">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400">Konu Durumu</span>
          <span class="text-base">📚</span>
        </div>
        <div class="space-y-1.5 pt-1">
          <div class="flex items-center justify-between text-xs">
            <span class="text-emerald-400 font-medium flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Tamamlanan</span>
            </span>
            <span class="font-bold text-white font-mono">{{ analytics?.today?.completedTopicsCount ?? 0 }}</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-indigo-400 font-medium flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Devam Eden</span>
            </span>
            <span class="font-bold text-white font-mono">{{ analytics?.today?.inProgressTopicsCount ?? 0 }}</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400 font-medium flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              <span>Bekleyen</span>
            </span>
            <span class="font-bold text-white font-mono">{{ analytics?.today?.todoTopicsCount ?? 0 }}</span>
          </div>
        </div>
      </div>

      <!-- 3. Learning Streak -->
      <div class="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3 shadow-md hover:border-slate-700 transition">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400">Öğrenme Serisi</span>
          <span class="text-base">🔥</span>
        </div>
        <div>
          <div class="text-2xl font-extrabold text-amber-400 font-mono flex items-center gap-1">
            <span>{{ analytics?.streak ?? 0 }}</span>
            <span class="text-sm font-sans font-medium text-slate-300">Gün</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            {{ (analytics?.streak ?? 0) > 0 ? 'Harika tempo! Kesintisiz seriyi sürdür.' : 'Bugün ilk aktiviteni ekle ve seriyi başlat!' }}
          </p>
        </div>
      </div>

      <!-- 4. English Vocabulary & Quick Practice Indicator -->
      <div class="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3 shadow-md hover:border-slate-700 transition">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400">İngilizce Dağarcığı</span>
          <span class="text-base">🇬🇧</span>
        </div>
        <div>
          <div class="text-2xl font-extrabold text-white font-mono">
            {{ analytics?.vocabulary?.totalWords ?? 0 }} <span class="text-xs font-normal text-slate-400">Kelime</span>
          </div>
          <div class="text-xs mt-1">
            <NuxtLink 
              v-if="(analytics?.vocabulary?.dueForReviewCount ?? 0) > 0" 
              to="/admin/english"
              class="text-rose-400 font-bold hover:underline flex items-center gap-1 animate-pulse"
            >
              <span>⚡ {{ analytics.vocabulary.dueForReviewCount }} kelime tekrar bekliyor →</span>
            </NuxtLink>
            <span v-else class="text-emerald-400 font-medium">
              ✓ Tüm kelimeler güncel
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Time & Activity Logger -->
    <div class="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold text-white flex items-center gap-2">
          <span>⚡</span>
          <span>Hızlı Çalışma Süresi Kaydet</span>
        </h2>
        <span class="text-xs text-slate-500 font-mono">Sürekli timer gerekmez, doğrudan süre girin</span>
      </div>

      <form @submit.prevent="saveActivity" class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label class="block text-[11px] text-slate-400 mb-1">Teknoloji *</label>
          <select
            v-model="activityForm.technology"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="Python">Python</option>
            <option value="Nuxt">Nuxt & Vue</option>
            <option value="TypeScript">TypeScript</option>
            <option value="AI">Yapay Zeka & LLM</option>
            <option value="English">English</option>
            <option value="Web">Web Temelleri</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] text-slate-400 mb-1">Konu Başlığı</label>
          <input
            v-model="activityForm.topic"
            type="text"
            placeholder="Örn: Functions & *args"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-[11px] text-slate-400 mb-1">Çalışılan Süre (Dakika) *</label>
          <input
            v-model.number="activityForm.durationMinutes"
            type="number"
            min="5"
            max="720"
            required
            placeholder="45"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div class="flex items-end">
          <button
            type="submit"
            :disabled="savingActivity || !activityForm.durationMinutes"
            class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
          >
            <span v-if="savingActivity" class="animate-spin">🌀</span>
            <span>{{ savingActivity ? 'Kaydediliyor...' : '+ Süreyi Kaydet' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Active Goals & Learning Targets -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-bold text-white flex items-center gap-2">
          <span>🎯</span>
          <span>Aktif Hedeflerim (Goals)</span>
        </h2>
        <NuxtLink to="/admin/goals" class="text-xs text-indigo-400 hover:underline">
          Tüm Hedefleri & Hiyerarşiyi Gör →
        </NuxtLink>
      </div>

      <div v-if="goals.length === 0" class="p-8 rounded-2xl border border-slate-800 text-center text-xs text-slate-500 bg-slate-900/30">
        Henüz hedef eklenmemiş. <NuxtLink to="/admin/goals" class="text-indigo-400 underline">Yeni hedef oluşturun.</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="goal in goals"
          :key="goal.id"
          class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase">
                {{ goal.category }}
              </span>
              <h3 class="text-sm font-bold text-white mt-1.5">{{ goal.title }}</h3>
            </div>
            <span class="text-xs font-mono font-bold text-emerald-400">%{{ goal.progress }}</span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div 
              class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
              :style="{ width: `${goal.progress}%` }"
            ></div>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-500">
            <span>Hedef Tarih: {{ goal.targetDate }}</span>
            <span class="font-medium text-slate-400">{{ goal.status }}</span>
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
const analytics = ref<any>({
  today: {
    actualMinutes: 0,
    plannedMinutes: 120,
    differenceMinutes: -120,
    performancePercentage: 0,
    completedTopicsCount: 0,
    inProgressTopicsCount: 0,
    todoTopicsCount: 0,
  },
  week: {
    totalActualMinutes: 0,
    totalPlannedMinutes: 840,
    differenceMinutes: -840,
    chart: [],
  },
  streak: 0,
  vocabulary: {
    totalWords: 0,
    dueForReviewCount: 0,
    levels: [],
  },
})
const goals = ref<any[]>([])
const savingActivity = ref(false)

const activityForm = ref({
  technology: 'Python',
  topic: '',
  durationMinutes: 45,
  note: '',
})

const formattedToday = computed(() => {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date())
})

const formatMinutes = (mins: number) => {
  const hours = Math.floor(mins / 60)
  const remaining = mins % 60
  if (hours > 0) {
    return `${hours} sa ${remaining > 0 ? `${remaining} dk` : ''}`
  }
  return `${mins} dk`
}

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [analyticsRes, goalsRes] = await Promise.all([
      $fetch<{ success: boolean; today: any; week: any; streak: number; vocabulary: any }>('/api/analytics'),
      $fetch<{ success: boolean; goals: any[] }>('/api/goals'),
    ])

    if (analyticsRes?.success) {
      analytics.value = analyticsRes
    }
    if (goalsRes?.goals) {
      goals.value = goalsRes.goals
    }
  } catch (err: any) {
    if (process.client) {
      toast.error('Dashboard verileri yüklenirken hata oluştu.')
    }
  } finally {
    loading.value = false
  }
}

const saveActivity = async () => {
  if (!activityForm.value.durationMinutes) return
  savingActivity.value = true

  try {
    await $fetch('/api/activities', {
      method: 'POST',
      body: {
        technology: activityForm.value.technology,
        topic: activityForm.value.topic.trim() || undefined,
        durationMinutes: activityForm.value.durationMinutes,
      },
    })

    toast.success(`${activityForm.value.technology} için ${activityForm.value.durationMinutes} dakika kaydedildi!`)
    activityForm.value.topic = ''
    activityForm.value.durationMinutes = 45

    await fetchDashboardData()
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Aktivite kaydedilemedi.')
  } finally {
    savingActivity.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>