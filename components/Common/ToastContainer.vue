<template>
  <div class="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto p-4 rounded-2xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all',
          toastClass(toast.type)
        ]"
      >
        <span class="text-base shrink-0 mt-0.5">{{ toastIcon(toast.type) }}</span>

        <div class="flex-1 min-w-0">
          <h4 v-if="toast.title" class="text-xs font-bold text-white mb-0.5">{{ toast.title }}</h4>
          <p class="text-xs text-slate-200 leading-relaxed break-words">{{ toast.message }}</p>
        </div>

        <button
          type="button"
          @click="removeToast(toast.id)"
          class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition text-xs shrink-0"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast, type ToastType } from '~/composables/useToast'

const { toasts, removeToast } = useToast()

const toastClass = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-950/90 border-emerald-700/80 text-emerald-100 shadow-emerald-950/50'
    case 'error':
      return 'bg-rose-950/90 border-rose-700/80 text-rose-100 shadow-rose-950/50'
    case 'warning':
      return 'bg-amber-950/90 border-amber-700/80 text-amber-100 shadow-amber-950/50'
    case 'info':
    default:
      return 'bg-indigo-950/90 border-indigo-700/80 text-indigo-100 shadow-indigo-950/50'
  }
}

const toastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return '✅'
    case 'error':
      return '❌'
    case 'warning':
      return '⚠️'
    case 'info':
    default:
      return '💡'
  }
}
</script>
