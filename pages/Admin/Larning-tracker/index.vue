<template>
  <div class="space-y-8">
    <!-- Header Row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">İlerleme Çubukları & Konu Yönetimi</h1>
        <p class="text-slate-400 text-sm mt-0.5">Navbar ve ana sayfada görünen öğrenme hedeflerini ve oranlarını kontrol edin.</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="fetchSkills"
          :disabled="loading"
          class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50"
          title="Yenile"
        >
          <svg :class="['w-4 h-4', loading ? 'animate-spin' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <button
          type="button"
          @click="isModalOpen = true"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <span>+</span>
          <span>Yeni Konu Başlığı Ekle</span>
        </button>
      </div>
    </div>

    <!-- Error Alert Banner -->
    <div 
      v-if="errorMessage" 
      class="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center justify-between animate-fade-in"
    >
      <div class="flex items-center gap-2">
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>
      <button 
        type="button" 
        @click="errorMessage = ''" 
        class="text-rose-400 hover:text-rose-200 text-xs font-semibold px-2 py-0.5"
      >
        Kapat
      </button>
    </div>

    <!-- Overview Stats Card -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
        <span class="text-xs font-medium text-slate-400">Aktif Konu Sayısı</span>
        <div class="text-2xl font-bold text-white">{{ skills.length }} Yetenek</div>
      </div>
      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
        <span class="text-xs font-medium text-slate-400">Genel Ortalama İlerleme</span>
        <div class="text-2xl font-bold text-indigo-400 font-mono">%{{ averageProgress }}</div>
      </div>
      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
        <span class="text-xs font-medium text-slate-400">Veri Kaynağı</span>
        <div class="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>PostgreSQL (Prisma)</span>
        </div>
      </div>
    </div>

    <!-- Skills List Section -->
    <div class="space-y-4">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <span>📊</span>
        <span>Yetenek İlerleme Seviyeleri</span>
      </h2>

      <!-- Loading Skeleton -->
      <div v-if="loading && skills.length === 0" class="space-y-4">
        <div v-for="i in 3" :key="i" class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/60 animate-pulse space-y-3">
          <div class="flex justify-between">
            <div class="h-4 bg-slate-800 rounded w-1/3"></div>
            <div class="h-4 bg-slate-800 rounded w-12"></div>
          </div>
          <div class="h-3.5 bg-slate-950 rounded-full w-full"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="skills.length === 0"
        class="p-12 rounded-2xl border-2 border-dashed border-slate-800 text-center space-y-3 bg-slate-900/30"
      >
        <span class="text-3xl block">🎯</span>
        <h3 class="text-sm font-semibold text-slate-300">Henüz Yetenek Başlığı Bulunmuyor</h3>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">
          Yukarıdaki butona tıklayarak yeni bir öğrenme konusu ve başlangıç ilerleme oranı ekleyebilirsiniz.
        </p>
      </div>

      <!-- Skills Progress Bars List -->
      <div v-else class="space-y-4">
        <ProgressBar
          v-for="skill in skills"
          :key="skill.id"
          :skill="skill"
          :editable="true"
          @update-progress="handleUpdateProgress"
          @increment-progress="handleIncrementProgress"
          @delete-skill="handleDeleteSkill"
        />
      </div>
    </div>

    <!-- Create Skill Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
      @click.self="isModalOpen = false"
    >
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl animate-scale-in">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white">Yeni Konu / Yetenek Ekle</h3>
          <button
            type="button"
            @click="isModalOpen = false"
            class="text-slate-400 hover:text-white transition p-1"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="submitCreateSkill" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Yetenek / Konu Adı *</label>
            <input
              v-model="newSkill.skillName"
              type="text"
              placeholder="Örn: Docker & Containerization"
              required
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-medium text-slate-300">Başlangıç İlerlemesi (%)</label>
              <span class="text-xs font-bold text-indigo-400 font-mono">%{{ newSkill.percentage }}</span>
            </div>
            <input
              v-model.number="newSkill.percentage"
              type="range"
              min="0"
              max="100"
              class="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div class="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              @click="isModalOpen = false"
              class="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              :disabled="isCreating || !newSkill.skillName.trim()"
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20"
            >
              {{ isCreating ? 'Ekleniyor...' : 'Yeteneği Kaydet' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar, { type SkillItem } from '~/components/Learning/ProgressBar.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const skills = ref<SkillItem[]>([])
const loading = ref(false)
const errorMessage = ref('')

const isModalOpen = ref(false)
const isCreating = ref(false)
const newSkill = ref<{
  skillName: string
  percentage: number
}>({
  skillName: '',
  percentage: 0,
})

const averageProgress = computed(() => {
  if (skills.value.length === 0) return 0
  const total = skills.value.reduce((sum, s) => sum + s.percentage, 0)
  return Math.round(total / skills.value.length)
})

// Fetch all skills
const fetchSkills = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await $fetch<{ success: boolean; skills: SkillItem[] }>('/api/tracker')
    if (data?.skills) {
      skills.value = data.skills
    }
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || 'İlerleme verileri yüklenirken bir hata oluştu.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSkills()
})

// Update Progress with debounce / instant optimistic update
const handleUpdateProgress = async (id: number, newPercentage: number) => {
  const clamped = Math.min(100, Math.max(0, newPercentage))
  const previousSkills = JSON.parse(JSON.stringify(skills.value)) as SkillItem[]
  
  // Optimistic update
  const target = skills.value.find(s => s.id === id)
  if (target) {
    target.percentage = clamped
  }

  try {
    const res = await $fetch<{ success: boolean; skill: SkillItem }>('/api/tracker/progress', {
      method: 'POST',
      body: {
        id,
        percentage: clamped,
      },
    })

    if (res?.skill) {
      const idx = skills.value.findIndex(s => s.id === id)
      if (idx !== -1) {
        skills.value[idx] = res.skill
      }
    }
  } catch (err: any) {
    skills.value = previousSkills
    errorMessage.value = err?.data?.statusMessage || 'İlerleme güncellenirken hata oluştu.'
  }
}

// Increment Progress (+5%, +10%, etc.)
const handleIncrementProgress = async (id: number, delta: number) => {
  const previousSkills = JSON.parse(JSON.stringify(skills.value)) as SkillItem[]
  const target = skills.value.find(s => s.id === id)
  if (target) {
    target.percentage = Math.min(100, Math.max(0, target.percentage + delta))
  }

  try {
    const res = await $fetch<{ success: boolean; skill: SkillItem }>('/api/tracker/progress', {
      method: 'POST',
      body: {
        id,
        increment: delta,
      },
    })

    if (res?.skill) {
      const idx = skills.value.findIndex(s => s.id === id)
      if (idx !== -1) {
        skills.value[idx] = res.skill
      }
    }
  } catch (err: any) {
    skills.value = previousSkills
    errorMessage.value = err?.data?.statusMessage || 'İlerleme güncellenirken hata oluştu.'
  }
}

// Delete Skill
const handleDeleteSkill = async (id: number) => {
  const previousSkills = JSON.parse(JSON.stringify(skills.value)) as SkillItem[]
  skills.value = skills.value.filter(s => s.id !== id)

  try {
    await $fetch(`/api/tracker/${id}`, {
      method: 'DELETE',
    })
  } catch (err: any) {
    skills.value = previousSkills
    errorMessage.value = err?.data?.statusMessage || 'Yetenek silinirken hata oluştu.'
  }
}

// Create Skill
const submitCreateSkill = async () => {
  if (!newSkill.value.skillName.trim()) return

  isCreating.value = true
  errorMessage.value = ''

  try {
    const res = await $fetch<{ success: boolean; skill: SkillItem }>('/api/tracker', {
      method: 'POST',
      body: {
        skillName: newSkill.value.skillName.trim(),
        percentage: newSkill.value.percentage,
      },
    })

    if (res?.skill) {
      skills.value.push(res.skill)
      newSkill.value = { skillName: '', percentage: 0 }
      isModalOpen.value = false
    }
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || 'Yetenek eklenirken bir hata oluştu.'
  } finally {
    isCreating.value = false
  }
}
</script>