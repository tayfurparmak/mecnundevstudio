<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
    @click.self="cancel"
  >
    <div class="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-in">
      <div class="flex items-center gap-3">
        <div
          :class="[
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg border',
            options.type === 'danger'
              ? 'bg-rose-950/80 border-rose-800 text-rose-400'
              : options.type === 'warning'
              ? 'bg-amber-950/80 border-amber-800 text-amber-400'
              : 'bg-indigo-950/80 border-indigo-800 text-indigo-400'
          ]"
        >
          {{ options.type === 'danger' ? '🗑️' : options.type === 'warning' ? '⚠️' : '❓' }}
        </div>
        <div>
          <h3 class="text-sm font-bold text-white">{{ options.title }}</h3>
        </div>
      </div>

      <p class="text-xs text-slate-300 leading-relaxed">{{ options.message }}</p>

      <div class="pt-2 flex items-center justify-end gap-2.5">
        <button
          type="button"
          @click="cancel"
          class="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          {{ options.cancelText }}
        </button>
        <button
          type="button"
          @click="confirm"
          :class="[
            'px-5 py-2 rounded-xl text-xs font-semibold text-white transition shadow-md',
            options.type === 'danger'
              ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
              : options.type === 'warning'
              ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
          ]"
        >
          {{ options.confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfirm } from '~/composables/useConfirm'

const { isOpen, options, confirm, cancel } = useConfirm()
</script>
