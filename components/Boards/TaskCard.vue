<template>
  <div
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click="$emit('open-detail', task)"
    :class="[
      'group relative p-4 rounded-2xl border transition-all select-none shadow-sm cursor-pointer active:cursor-grabbing',
      task.status === 'DONE' 
        ? 'bg-slate-950/50 border-slate-800/60 opacity-80 hover:opacity-100 hover:border-slate-700' 
        : 'bg-slate-950 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900/60',
      isDragging ? 'opacity-30 scale-95 border-dashed border-indigo-500' : ''
    ]"
  >
    <!-- Top Row: Checkbox, Title, Delete Button -->
    <div class="flex items-start gap-2.5 justify-between">
      <div class="flex items-start gap-2.5 flex-1 min-w-0">
        <!-- Status Checkbox -->
        <button
          type="button"
          @click.stop="toggleDone"
          :title="task.status === 'DONE' ? 'Görevi Geri Al' : 'Tamamlandı Olarak İşaretle'"
          class="mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition shrink-0"
          :class="task.status === 'DONE'
            ? 'bg-emerald-600 border-emerald-500 text-white'
            : 'border-slate-700 hover:border-indigo-500 bg-slate-900'"
        >
          <svg 
            v-if="task.status === 'DONE'" 
            class="w-3 h-3 stroke-current stroke-2" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>

        <div class="space-y-1 min-w-0">
          <span 
            :class="[
              'text-xs font-bold leading-snug break-words block transition-all',
              task.status === 'DONE' 
                ? 'line-through text-slate-500' 
                : 'text-slate-100 group-hover:text-indigo-300'
            ]"
          >
            {{ task.title }}
          </span>

          <p v-if="task.topic" class="text-[11px] text-slate-400 font-medium truncate">
            Konu: {{ task.topic }}
          </p>
        </div>
      </div>

      <!-- Quick Delete Button (Visible on hover) -->
      <button
        type="button"
        @click.stop="$emit('delete-task', task.id)"
        title="Görevi Sil"
        class="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-950/30 transition text-xs shrink-0"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Middle: Checklist Counter & Time Tag -->
    <div class="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
      <div v-if="task.checklists && task.checklists.length > 0" class="flex items-center gap-1">
        <span>☑️</span>
        <span>{{ completedChecklistCount }}/{{ task.checklists.length }}</span>
      </div>
      <div v-else></div>

      <div class="flex items-center gap-1.5">
        <span v-if="task.estimatedMinutes">⏱️ {{ task.estimatedMinutes }}dk</span>
      </div>
    </div>

    <!-- Bottom Row: Technology Badge, Priority & Column Shift -->
    <div class="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between">
      <div class="flex items-center gap-1.5 flex-wrap">
        <!-- Technology Badge -->
        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-900/60">
          {{ task.technology || task.category }}
        </span>

        <!-- Priority Badge -->
        <span
          :class="[
            'text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase',
            priorityBadgeStyle(task.priority)
          ]"
        >
          {{ task.priority || 'MEDIUM' }}
        </span>
      </div>

      <!-- Quick Move Arrows -->
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          v-if="task.status !== 'TODO'"
          type="button"
          @click.stop="moveLeft"
          title="Önceki Aşamaya Taşı"
          class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-[10px] transition"
        >
          ←
        </button>
        <button
          v-if="task.status !== 'DONE'"
          type="button"
          @click.stop="moveRight"
          title="Sonraki Aşamaya Taşı"
          class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-[10px] transition"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskItem } from '~/types/board'

const props = defineProps<{
  task: TaskItem
  isDragging?: boolean
}>()

const emit = defineEmits<{
  (e: 'update-status', taskId: number, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE'): void
  (e: 'toggle-done', task: TaskItem): void
  (e: 'delete-task', taskId: number): void
  (e: 'open-detail', task: TaskItem): void
  (e: 'drag-start', event: DragEvent, task: TaskItem): void
  (e: 'drag-end', event: DragEvent): void
}>()

const completedChecklistCount = computed(() => {
  if (!props.task.checklists) return 0
  return props.task.checklists.filter((c) => c.isCompleted).length
})

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(props.task.id))
  }
  emit('drag-start', event, props.task)
}

const onDragEnd = (event: DragEvent) => {
  emit('drag-end', event)
}

const toggleDone = () => {
  emit('toggle-done', props.task)
}

const moveLeft = () => {
  if (props.task.status === 'DONE') {
    emit('update-status', props.task.id, 'IN_PROGRESS')
  } else if (props.task.status === 'IN_PROGRESS') {
    emit('update-status', props.task.id, 'TODO')
  }
}

const moveRight = () => {
  if (props.task.status === 'TODO') {
    emit('update-status', props.task.id, 'IN_PROGRESS')
  } else if (props.task.status === 'IN_PROGRESS') {
    emit('update-status', props.task.id, 'DONE')
  }
}

const priorityBadgeStyle = (priority?: string) => {
  switch (priority) {
    case 'URGENT':
      return 'bg-rose-950 text-rose-400 border-rose-800'
    case 'HIGH':
      return 'bg-amber-950 text-amber-400 border-amber-800'
    case 'LOW':
      return 'bg-slate-900 text-slate-400 border-slate-800'
    default:
      return 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60'
  }
}
</script>
