<template>
  <div class="max-w-5xl mx-auto px-6 py-12 space-y-12">
    <!-- Header -->
    <div class="space-y-4 border-b border-white/8 pb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1017] border border-sky-500/30 text-sky-400 text-xs font-semibold font-mono">
        <span>🚀</span>
        <span>Yetenek & Teknoloji Dağarcığı</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
        Çalıştığım & Öğrendiğim Teknolojiler ⚡
      </h1>
      <p class="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
        Bu sayfadaki ilerleme oranları ve konular, PostgreSQL veritabanından dinamik ve canlı olarak beslenmektedir.
      </p>
    </div>

    <!-- Filter Buttons -->
    <div class="flex items-center gap-2 border-b border-white/8 pb-4 flex-wrap">
      <button
        type="button"
        @click="selectedCategory = 'all'"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs',
          selectedCategory === 'all' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-black shadow-sky-500/20' : 'bg-[#0B1017] text-slate-400 hover:text-white border border-white/8'
        ]"
      >
        Tümü ({{ skills.length }})
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        type="button"
        @click="selectedCategory = cat"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs',
          selectedCategory === cat ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-black shadow-sky-500/20' : 'bg-[#0B1017] text-slate-400 hover:text-white border border-white/8'
        ]"
      >
        {{ cat }} ({{ getCategoryCount(cat) }})
      </button>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="p-6 rounded-3xl bg-[#0B1017]/60 border border-white/8 animate-pulse space-y-4">
        <div class="h-5 bg-slate-800 rounded w-1/3"></div>
        <div class="h-3 bg-slate-800 rounded-full w-full"></div>
        <div class="h-4 bg-slate-800 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8 rounded-3xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 text-center">
      Teknoloji verileri yüklenirken bir sorun oluştu.
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredSkills.length === 0" class="p-16 rounded-3xl border-2 border-dashed border-white/8 text-center space-y-3 bg-[#0B1017]/30">
      <span class="text-3xl block">🚀</span>
      <h3 class="text-sm font-bold text-slate-300">Bu kategoride listelenecek teknoloji bulunamadı</h3>
      <p class="text-xs text-slate-500">Tüm kategorileri seçerek tüm yetenekleri görüntüleyebilirsiniz.</p>
    </div>

    <!-- Dynamic Technologies Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="skill in filteredSkills"
        :key="skill.id"
        class="p-6 sm:p-7 rounded-3xl bg-[#0B1017] border border-white/8 space-y-5 hover:border-sky-500/50 card-hover-lift shadow-lg group relative overflow-hidden"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1">
            <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800/80 font-mono uppercase">
              {{ getSkillCategory(skill.skillName) }}
            </span>
            <h3 class="text-xl font-bold text-white group-hover:text-sky-300 transition pt-1">
              {{ skill.skillName }}
            </h3>
          </div>

          <div class="text-right font-mono">
            <span class="text-2xl font-black text-sky-400 font-mono">%{{ skill.percentage }}</span>
            <span class="block text-[10px] text-slate-400 font-sans">İlerleme Oranı</span>
          </div>
        </div>

        <!-- Glowing Progress Bar -->
        <div class="space-y-2">
          <div class="w-full bg-[#05070A] h-3 rounded-full overflow-hidden border border-white/8 p-0.5">
            <div
              class="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_10px_#38bdf8]"
              :style="{ width: `${skill.percentage}%` }"
            ></div>
          </div>
        </div>

        <!-- Topics & Details Footer -->
        <div class="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/5">
          <span class="flex items-center gap-1.5 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            <span>Canlı Takip</span>
          </span>
          <span class="font-mono text-[11px] text-slate-400">PostgreSQL Verified</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useSiteConfig()

useSeoMeta({
  title: `Teknolojiler & Yetenekler • ${config.brand.name}`,
  description: 'Python, Nuxt, Vue 3, TypeScript, Yapay Zeka ve veritabanı teknolojileri üzerinde canlı öğrenme ilerlemeleri.',
  ogTitle: `Teknolojiler & Yetenekler • ${config.brand.name}`,
  ogDescription: 'Canlı PostgreSQL verileriyle teknoloji yetenek ve öğrenme dağarcığı.',
})

const selectedCategory = ref('all')

const { data, pending, error } = await useFetch<{ success: boolean; skills: any[] }>('/api/tracker')
const skills = computed(() => data.value?.skills || [])

const getSkillCategory = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('python')) return 'Backend'
  if (n.includes('nuxt') || n.includes('vue')) return 'Frontend'
  if (n.includes('type') || n.includes('java')) return 'Diller'
  if (n.includes('ai') || n.includes('llm')) return 'Yapay Zeka'
  if (n.includes('eng')) return 'İngilizce'
  return 'Genel'
}

const categories = computed(() => {
  const set = new Set(skills.value.map(s => getSkillCategory(s.skillName)))
  return Array.from(set)
})

const getCategoryCount = (cat: string) => {
  return skills.value.filter(s => getSkillCategory(s.skillName) === cat).length
}

const filteredSkills = computed(() => {
  if (selectedCategory.value === 'all') return skills.value
  return skills.value.filter(s => getSkillCategory(s.skillName) === selectedCategory.value)
})
</script>
