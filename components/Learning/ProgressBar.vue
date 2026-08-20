<template>
  <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 group">
    <!-- Header: Skill Name & Dynamic Percentage Badge -->
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-base">{{ getSkillIcon(skill.skillName) }}</span>
        <h3 class="text-sm font-semibold text-white truncate">{{ skill.skillName }}</h3>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <span 
          :class="[
            'text-xs font-bold px-2.5 py-0.5 rounded-full border transition-all font-mono',
            getBadgeStyle(skill.skillName)
          ]"
        >
          %{{ skill.percentage }}
        </span>

        <!-- Delete button in admin editable mode -->
        <button
          v-if="editable"
          type="button"
          @click="$emit('delete-skill', skill.id)"
          title="Yetenek Başlığını Sil"
          class="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-950/30 transition text-xs"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Dynamic Progress Bar (No hardcoded widths) -->
    <div class="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5 relative">
      <div
        :class="[
          'h-full rounded-full transition-all duration-500 ease-out bg-linear-to-r shadow-sm',
          getProgressBarStyle(skill.skillName)
        ]"
        :style="{ width: `${Math.min(100, Math.max(0, skill.percentage))}%` }"
      ></div>
    </div>

    <!-- Admin Interactive Controls (Editable Mode) -->
    <div v-if="editable" class="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <!-- Range Slider -->
      <div class="flex items-center gap-2 flex-1">
        <span class="text-[10px] text-slate-500 font-mono">0%</span>
        <input
          type="range"
          min="0"
          max="100"
          :value="skill.percentage"
          @input="onSliderInput"
          @change="onSliderChange"
          class="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
        />
        <span class="text-[10px] text-slate-500 font-mono">100%</span>
      </div>

      <!-- Quick Step Buttons -->
      <div class="flex items-center gap-1.5 self-end sm:self-auto">
        <button
          type="button"
          @click="$emit('increment-progress', skill.id, -5)"
          :disabled="skill.percentage <= 0"
          class="px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
        >
          -5%
        </button>
        <button
          type="button"
          @click="$emit('increment-progress', skill.id, +5)"
          :disabled="skill.percentage >= 100"
          class="px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 disabled:opacity-30 transition"
        >
          +5%
        </button>
        <button
          type="button"
          @click="$emit('increment-progress', skill.id, +10)"
          :disabled="skill.percentage >= 100"
          class="px-2 py-1 rounded-md bg-indigo-950/60 border border-indigo-900/60 text-[10px] font-semibold text-indigo-300 hover:bg-indigo-900/80 disabled:opacity-30 transition"
        >
          +10%
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface SkillItem {
  id: number
  skillName: string
  percentage: number
  updatedAt?: string | Date
}

const props = withDefaults(
  defineProps<{
    skill: SkillItem
    editable?: boolean
  }>(),
  {
    editable: false,
  }
)

const emit = defineEmits<{
  (e: 'update-progress', id: number, newPercentage: number): void
  (e: 'increment-progress', id: number, delta: number): void
  (e: 'delete-skill', id: number): void
}>()

const onSliderInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const val = Number.parseInt(target.value, 10)
  // Optimistically emit update
  emit('update-progress', props.skill.id, val)
}

const onSliderChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const val = Number.parseInt(target.value, 10)
  emit('update-progress', props.skill.id, val)
}

const getSkillIcon = (name: string) => {
  const lower = name.toLowerCase()
  if (lower.includes('ai') || lower.includes('yapay')) return '🤖'
  if (lower.includes('ingilizce') || lower.includes('english')) return '🇬🇧'
  if (lower.includes('nuxt') || lower.includes('web') || lower.includes('frontend')) return '🌐'
  if (lower.includes('python') || lower.includes('backend')) return '⚙️'
  return '🎯'
}

const getProgressBarStyle = (name: string) => {
  const lower = name.toLowerCase()
  if (lower.includes('ai') || lower.includes('yapay')) {
    return 'from-indigo-500 to-indigo-600'
  }
  if (lower.includes('ingilizce') || lower.includes('english')) {
    return 'from-emerald-500 to-teal-500'
  }
  if (lower.includes('nuxt') || lower.includes('web') || lower.includes('frontend')) {
    return 'from-cyan-500 to-blue-600'
  }
  return 'from-indigo-500 to-purple-600'
}

const getBadgeStyle = (name: string) => {
  const lower = name.toLowerCase()
  if (lower.includes('ai') || lower.includes('yapay')) {
    return 'bg-indigo-950/60 text-indigo-400 border-indigo-900/60'
  }
  if (lower.includes('ingilizce') || lower.includes('english')) {
    return 'bg-emerald-950/60 text-emerald-400 border-emerald-900/60'
  }
  if (lower.includes('nuxt') || lower.includes('web') || lower.includes('frontend')) {
    return 'bg-cyan-950/60 text-cyan-400 border-cyan-900/60'
  }
  return 'bg-slate-800 text-slate-300 border-slate-700'
}
</script>
