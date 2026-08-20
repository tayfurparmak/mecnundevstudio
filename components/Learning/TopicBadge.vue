<template>
  <span 
    :class="[
      'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border shadow-xs select-none',
      badgeStyle
    ]"
  >
    <span>{{ icon }}</span>
    <span>{{ name }}</span>
    <span v-if="percentage !== undefined" class="ml-1 opacity-80 font-mono">%{{ percentage }}</span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  percentage?: number
  icon?: string
}>()

const icon = computed(() => {
  if (props.icon) return props.icon
  const lower = props.name.toLowerCase()
  if (lower.includes('ai') || lower.includes('yapay')) return '🤖'
  if (lower.includes('ingilizce') || lower.includes('english')) return '🇬🇧'
  if (lower.includes('nuxt') || lower.includes('web') || lower.includes('frontend')) return '🌐'
  return '⚡'
})

const badgeStyle = computed(() => {
  const lower = props.name.toLowerCase()
  if (lower.includes('ai') || lower.includes('yapay')) {
    return 'bg-indigo-950/60 text-indigo-300 border-indigo-900/60'
  }
  if (lower.includes('ingilizce') || lower.includes('english')) {
    return 'bg-emerald-950/60 text-emerald-300 border-emerald-900/60'
  }
  if (lower.includes('nuxt') || lower.includes('web') || lower.includes('frontend')) {
    return 'bg-cyan-950/60 text-cyan-300 border-cyan-900/60'
  }
  return 'bg-slate-900 text-slate-300 border-slate-800'
})
</script>
