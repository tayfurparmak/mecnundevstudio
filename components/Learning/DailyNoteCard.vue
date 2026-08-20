<template>
  <div 
    :class="[
      'p-5 rounded-2xl border transition-all duration-200 space-y-4 group',
      log.isCompleted 
        ? 'bg-slate-900/40 border-slate-800/60' 
        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
    ]"
  >
    <!-- Top Header: Date, Technology, Status Badge & Delete -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
      <div class="flex items-center gap-2.5">
        <!-- Checkbox Button -->
        <button
          type="button"
          @click="$emit('toggle-complete', log)"
          :title="log.isCompleted ? 'Geri Al (Devam Ediyor yap)' : 'Tamamlandı Olarak İşaretle'"
          class="w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0"
          :class="log.isCompleted
            ? 'bg-emerald-600 border-emerald-500 text-white'
            : 'border-slate-700 hover:border-slate-500 bg-slate-950 text-transparent'"
        >
          <svg class="w-3.5 h-3.5 stroke-current stroke-2" viewBox="0 0 24 24" fill="none">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>

        <span v-if="log.technology" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
          {{ log.technology }}
        </span>

        <!-- Formatted Date -->
        <div class="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <span>📅</span>
          <span>{{ formatDate(log.createdAt) }}</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Status Badge -->
        <span
          :class="[
            'text-[11px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1',
            log.isCompleted
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-900/60'
              : 'bg-amber-950/60 text-amber-400 border-amber-900/60'
          ]"
        >
          <span>{{ log.isCompleted ? '✅' : '⏳' }}</span>
          <span>{{ log.isCompleted ? 'Tamamlandı' : 'Devam Ediyor' }}</span>
        </span>

        <!-- Delete Button -->
        <button
          type="button"
          @click="$emit('delete-log', log.id)"
          title="Kaydı Sil"
          class="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-950/30 transition text-xs"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content: Todo Task & Journal Blocks -->
    <div class="space-y-3">
      <h3 
        :class="[
          'text-base font-bold transition-all',
          log.isCompleted ? 'line-through text-slate-500' : 'text-white'
        ]"
      >
        {{ log.todoTask }}
      </h3>

      <!-- 1. Learning Log -->
      <div 
        v-if="log.learningLog" 
        class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto"
      >
        <span class="text-indigo-400 font-bold block mb-1 font-sans">💡 Bugün Ne Öğrendim:</span>
        {{ log.learningLog }}
      </div>

      <!-- 2. Not Learned / Challenges -->
      <div 
        v-if="log.notLearned" 
        class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-900/40 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto"
      >
        <span class="text-amber-400 font-bold block mb-1 font-sans">❓ Neyi Anlamadım / Sorular:</span>
        {{ log.notLearned }}
      </div>

      <!-- 3. Plan for Tomorrow -->
      <div 
        v-if="log.planTomorrow" 
        class="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-900/40 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto"
      >
        <span class="text-emerald-400 font-bold block mb-1 font-sans">🎯 Yarın Ne Çalışacağım:</span>
        {{ log.planTomorrow }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface DailyLogItem {
  id: number
  createdAt: string | Date
  todoTask: string
  isCompleted: boolean
  learningLog: string | null
  notLearned?: string | null
  planTomorrow?: string | null
  technology?: string | null
}

defineProps<{
  log: DailyLogItem
}>()

defineEmits<{
  (e: 'toggle-complete', log: DailyLogItem): void
  (e: 'delete-log', id: number): void
}>()

const formatDate = (dateInput: string | Date) => {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return String(dateInput)

  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>
