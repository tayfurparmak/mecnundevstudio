<template>
  <div>
    <!-- Floating Trigger Button -->
    <button
      type="button"
      @click="isOpen = true"
      class="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-600 text-black font-extrabold text-xs transition active:scale-95 shadow-2xl neon-glow-cyan flex items-center gap-2 font-mono"
      title="AI Dev Mentor & Growth Coach (⌘+J)"
    >
      <span class="w-2.5 h-2.5 rounded-full bg-black animate-pulse"></span>
      <span>🤖 AI Dev Mentor</span>
    </button>

    <!-- Slide-over Drawer -->
    <div v-if="isOpen" class="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-fade-in" @click.self="isOpen = false">
      <div class="w-full max-w-md bg-[#0e0e16] border-l border-white/10 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div class="space-y-6">
          <!-- Drawer Header -->
          <div class="flex items-center justify-between border-b border-white/10 pb-4">
            <div class="flex items-center gap-2">
              <span class="text-xl">🤖</span>
              <div>
                <h3 class="text-base font-bold text-white">AI Dev Mentor & Growth Coach</h3>
                <span class="text-[10px] text-cyan-400 font-mono">Gemini 2.5 Flash Autonomous Engine</span>
              </div>
            </div>
            <button @click="isOpen = false" class="text-zinc-400 hover:text-white p-1">✕</button>
          </div>

          <!-- Advice Content Box -->
          <div class="p-5 rounded-2xl bg-[#07070a] border border-cyan-500/30 space-y-3 relative overflow-hidden shadow-inner">
            <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>

            <div class="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>Sistem Analiz Raporu</span>
              <span v-if="loading" class="animate-pulse">Analiz ediliyor...</span>
            </div>

            <p class="text-zinc-200 text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-line">
              {{ advice || 'Mentor analizi yükleniyor...' }}
            </p>
          </div>

          <!-- Quick Prompts / Actions -->
          <div class="space-y-2">
            <span class="text-xs font-bold text-zinc-400 uppercase font-mono">Hızlı Mentor Komutları</span>
            <div class="grid grid-cols-1 gap-2">
              <button
                type="button"
                @click="fetchAdvice"
                :disabled="loading"
                class="w-full py-2.5 px-4 rounded-xl bg-[#141420] hover:bg-white/5 border border-white/10 text-cyan-300 text-xs font-bold font-mono transition text-left flex items-center justify-between"
              >
                <span>🔄 Gelişim Durumumu Yeniden Analiz Et</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-white/10 text-center text-[10px] font-mono text-zinc-500">
          Mecnun Dev Studio • AI Growth Command Center
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const isOpen = ref(false)
const loading = ref(false)
const advice = ref('')
const toast = useToast()

const fetchAdvice = async () => {
  loading.value = true
  try {
    const res = await $fetch<{ success: boolean; advice: string }>('/api/ai-coach')
    if (res?.advice) {
      advice.value = res.advice
    }
  } catch (err: any) {
    toast.error('AI Koç yanıt veremedi.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAdvice()
})

// Keyboard shortcut ⌘+J
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
      e.preventDefault()
      isOpen.value = !isOpen.value
      if (isOpen.value && !advice.value) fetchAdvice()
    }
  }
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})
</script>
