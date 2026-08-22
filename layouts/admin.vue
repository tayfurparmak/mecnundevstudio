<template>
  <div class="min-h-screen flex bg-[#09090b] text-zinc-100 font-sans selection:bg-sky-500 selection:text-black bg-dot-grid">
    <!-- Global Toast, Modal, EOD & AI Mentor Containers -->
    <ToastContainer />
    <ConfirmModal />
    <EodReviewModal v-model="showEodModal" />
    <AICoachDrawer />

    <!-- Admin Sidebar -->
    <aside class="w-64 border-r border-white/10 bg-[#0c0c10]/90 backdrop-blur-2xl p-5 flex flex-col justify-between shrink-0 select-none sticky top-0 h-screen overflow-y-auto">
      <div class="space-y-6">
        <!-- Logo / Studio Header -->
        <div class="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span class="text-[10px] font-bold text-sky-400 uppercase tracking-widest block font-mono">{{ t('admin.osTitle') }}</span>
            <h2 class="text-base font-extrabold text-white mt-0.5 tracking-tight flex items-center gap-2">
              <span>{{ t('admin.studio') }}</span>
              <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            </h2>
          </div>
          <LanguageSwitcher />
        </div>

        <!-- Quick EOD Action Button -->
        <button
          type="button"
          @click="showEodModal = true"
          class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-950/60 via-blue-950/40 to-[#121218] border border-sky-500/30 hover:border-sky-500 text-sky-200 hover:text-white text-xs font-bold transition active:scale-95 flex items-center justify-center gap-2 shadow-sm group"
        >
          <span class="group-hover:rotate-12 transition-transform">🌙</span>
          <span>{{ t('admin.eod') }}</span>
        </button>
        
        <!-- Navigation Menu -->
        <nav class="space-y-1.5 text-xs font-semibold">
          <NuxtLink 
            to="/admin" 
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition"
            active-class="bg-gradient-to-r from-sky-500 to-blue-600 text-black !font-bold shadow-md shadow-sky-500/20"
          >
            <span class="text-sm">🧭</span>
            <span>{{ t('admin.dashboard') }}</span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/goals" 
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition"
            active-class="bg-gradient-to-r from-sky-500 to-blue-600 text-black !font-bold shadow-md shadow-sky-500/20"
          >
            <span class="text-sm">🎯</span>
            <span>{{ t('admin.goalsTab') }}</span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/board" 
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition"
            active-class="bg-gradient-to-r from-sky-500 to-blue-600 text-black !font-bold shadow-md shadow-sky-500/20"
          >
            <span class="text-sm">📋</span>
            <span>{{ t('admin.kanbanTab') }}</span>
          </NuxtLink>

          <!-- Mind Map Canvas -->
          <NuxtLink 
            to="/admin/mindmap" 
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition"
            active-class="bg-gradient-to-r from-sky-500 to-blue-600 text-black !font-bold shadow-md shadow-sky-500/20"
          >
            <span class="text-sm">🧠</span>
            <span>{{ t('admin.mindmapTab') }}</span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/vault" 
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition"
            active-class="bg-gradient-to-r from-sky-500 to-blue-600 text-black !font-bold shadow-md shadow-sky-500/20"
          >
            <span class="text-sm">🔒</span>
            <span>{{ t('admin.vaultTab') }}</span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/english" 
            class="flex items-center justify-between px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition"
            active-class="bg-gradient-to-r from-sky-500 to-blue-600 text-black !font-bold shadow-md shadow-sky-500/20"
          >
            <div class="flex items-center gap-2.5">
              <span class="text-sm">🇬🇧</span>
              <span>{{ t('admin.englishTab') }}</span>
            </div>
            <span 
              v-if="dueWordsCount > 0" 
              class="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold animate-pulse"
            >
              {{ dueWordsCount }}
            </span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/analytics" 
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition"
            active-class="bg-gradient-to-r from-sky-500 to-blue-600 text-black !font-bold shadow-md shadow-sky-500/20"
          >
            <span class="text-sm">📈</span>
            <span>{{ t('admin.analyticsTab') }}</span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/daily-log" 
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition"
            active-class="bg-gradient-to-r from-sky-500 to-blue-600 text-black !font-bold shadow-md shadow-sky-500/20"
          >
            <span class="text-sm">📔</span>
            <span>{{ t('admin.journalTab') }}</span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/cms" 
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition"
            active-class="bg-gradient-to-r from-sky-500 to-blue-600 text-black !font-bold shadow-md shadow-sky-500/20"
          >
            <span class="text-sm">📝</span>
            <span>{{ t('admin.cmsTab') }}</span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/learning-tracker" 
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition"
            active-class="bg-gradient-to-r from-sky-500 to-blue-600 text-black !font-bold shadow-md shadow-sky-500/20"
          >
            <span class="text-sm">🚀</span>
            <span>{{ t('admin.trackerTab') }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Sidebar Footer -->
      <div class="pt-4 border-t border-white/10 space-y-3 text-xs">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-[11px] text-zinc-500 hover:text-zinc-300 transition inline-flex items-center gap-1">
            <span>←</span>
            <span>{{ t('nav.publicSite') }}</span>
          </NuxtLink>
          <span class="text-[10px] text-zinc-600 font-mono">{{ t('admin.secureSession') }}</span>
        </div>
        <button 
          @click="handleLogout"
          class="w-full text-left text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-2 rounded-xl transition flex items-center justify-between font-semibold active:scale-95"
        >
          <span>{{ t('admin.logout') }}</span>
          <span>🚪</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl mx-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import ToastContainer from '~/components/Common/ToastContainer.vue'
import ConfirmModal from '~/components/Common/ConfirmModal.vue'
import EodReviewModal from '~/components/Common/EodReviewModal.vue'
import LanguageSwitcher from '~/components/Common/LanguageSwitcher.vue'
import AICoachDrawer from '~/components/Common/AICoachDrawer.vue'
import { useI18n } from '~/composables/useI18n'

const { logout } = useAuth()
const { t } = useI18n()
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