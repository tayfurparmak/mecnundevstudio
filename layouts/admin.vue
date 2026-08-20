<template>
  <div class="min-h-screen flex bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
    <!-- Global Toast, Modal & EOD Containers -->
    <ToastContainer />
    <ConfirmModal />
    <EodReviewModal v-model="showEodModal" />

    <!-- Admin Sidebar -->
    <aside class="w-64 border-r border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-5 flex flex-col justify-between shrink-0 select-none sticky top-0 h-screen overflow-y-auto">
      <div class="space-y-5">
        <!-- Logo / Studio Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <div>
            <span class="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block">LEARNING OS</span>
            <h2 class="text-base font-extrabold text-white mt-0.5 tracking-tight flex items-center gap-1.5">
              <span>Admin Studio</span>
              <span class="text-xs animate-pulse">⚡</span>
            </h2>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono font-bold">
            v2.2
          </span>
        </div>

        <!-- Quick EOD Action Button -->
        <button
          type="button"
          @click="showEodModal = true"
          class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-900/60 via-indigo-800/40 to-slate-900 border border-indigo-700/50 hover:border-indigo-500 text-indigo-200 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm group"
        >
          <span class="group-hover:rotate-12 transition-transform">🌙</span>
          <span>Gün Sonu Kapanışı</span>
        </button>
        
        <!-- Navigation Menu -->
        <nav class="space-y-1 text-xs font-medium">
          <!-- 1. Dashboard -->
          <NuxtLink 
            to="/admin" 
            class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition group relative"
            active-class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
          >
            <span class="text-sm">🧭</span>
            <span>Bugün Neredeyim?</span>
          </NuxtLink>

          <!-- 2. Goals & Technology Hierarchy -->
          <NuxtLink 
            to="/admin/goals" 
            class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            active-class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
          >
            <span class="text-sm">🎯</span>
            <span>Hedefler & Konular</span>
          </NuxtLink>

          <!-- 3. Learning Kanban -->
          <NuxtLink 
            to="/admin/board" 
            class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            active-class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
          >
            <span class="text-sm">📋</span>
            <span>Learning Kanban</span>
          </NuxtLink>

          <!-- 4. Learning Vault -->
          <NuxtLink 
            to="/admin/vault" 
            class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            active-class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
          >
            <span class="text-sm">🔒</span>
            <span>Learning Vault</span>
          </NuxtLink>

          <!-- 5. English Learning & Review -->
          <NuxtLink 
            to="/admin/english" 
            class="flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            active-class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
          >
            <div class="flex items-center gap-2.5">
              <span class="text-sm">🇬🇧</span>
              <span>English & Review</span>
            </div>
            <span 
              v-if="dueWordsCount > 0" 
              class="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold animate-pulse"
            >
              {{ dueWordsCount }}
            </span>
          </NuxtLink>

          <!-- 6. Analytics & Performance -->
          <NuxtLink 
            to="/admin/analytics" 
            class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            active-class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
          >
            <span class="text-sm">📈</span>
            <span>Performans Analizi</span>
          </NuxtLink>

          <!-- 7. Daily Journal -->
          <NuxtLink 
            to="/admin/daily-log" 
            class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            active-class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
          >
            <span class="text-sm">📔</span>
            <span>Öğrenme Jurnali</span>
          </NuxtLink>

          <!-- 8. CMS Blog Manager -->
          <NuxtLink 
            to="/admin/cms" 
            class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            active-class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
          >
            <span class="text-sm">📝</span>
            <span>CMS & Blog</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Sidebar Footer -->
      <div class="pt-4 border-t border-slate-800 space-y-3 text-xs">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-[11px] text-slate-500 hover:text-slate-300 transition inline-flex items-center gap-1">
            <span>←</span>
            <span>Public Site</span>
          </NuxtLink>
          <span class="text-[10px] text-slate-600 font-mono">Private Session</span>
        </div>
        <button 
          @click="handleLogout"
          class="w-full text-left text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2.5 py-1.5 rounded-xl transition flex items-center justify-between font-medium"
        >
          <span>Çıkış Yap</span>
          <span>🚪</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-6 sm:p-8 overflow-y-auto max-w-6xl">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import ToastContainer from '~/components/Common/ToastContainer.vue'
import ConfirmModal from '~/components/Common/ConfirmModal.vue'
import EodReviewModal from '~/components/Common/EodReviewModal.vue'

const { logout } = useAuth()
const dueWordsCount = ref(0)
const showEodModal = ref(false)

const fetchDueWords = async () => {
  try {
    const res = await $fetch<{ success: boolean; dueCount: number }>('/api/vocabulary?due=true')
    if (res?.dueCount !== undefined) {
      dueWordsCount.value = res.dueCount
    }
  } catch {
    // Ignore error in layout
  }
}

onMounted(() => {
  fetchDueWords()
})

const handleLogout = async () => {
  await logout()
}
</script>