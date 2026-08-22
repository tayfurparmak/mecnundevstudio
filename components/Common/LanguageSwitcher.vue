<template>
  <div class="relative inline-block text-left">
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="px-3 py-1.5 rounded-xl bg-[#12121c] border border-white/10 hover:border-cyan-400/50 text-xs text-zinc-300 hover:text-white transition flex items-center gap-2 font-mono shadow-sm active:scale-95"
    >
      <span>{{ currentFlag }}</span>
      <span class="font-bold">{{ currentLocale.toUpperCase() }}</span>
      <span class="text-[10px] text-zinc-500">▼</span>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-36 rounded-2xl bg-[#0e0e16] border border-white/10 shadow-2xl py-1.5 z-50 backdrop-blur-2xl animate-fade-in"
    >
      <button
        v-for="lang in languages"
        :key="lang.code"
        type="button"
        @click="selectLanguage(lang.code)"
        :class="[
          'w-full px-3.5 py-2 text-left text-xs font-mono font-semibold transition flex items-center gap-2.5',
          currentLocale === lang.code
            ? 'bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
        ]"
      >
        <span>{{ lang.flag }}</span>
        <span>{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n, type SupportedLocale } from '~/composables/useI18n'

const { currentLocale, setLocale } = useI18n()
const isOpen = ref(false)

const languages: Array<{ code: SupportedLocale; name: string; flag: string }> = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
]

const currentFlag = computed(() => {
  const found = languages.find((l) => l.code === currentLocale.value)
  return found ? found.flag : '🇹🇷'
})

const selectLanguage = (code: SupportedLocale) => {
  setLocale(code)
  isOpen.value = false
}

// Close dropdown on click outside
onMounted(() => {
  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      isOpen.value = false
    }
  }
  window.addEventListener('click', handleOutsideClick)
  onUnmounted(() => window.removeEventListener('click', handleOutsideClick))
})
</script>
