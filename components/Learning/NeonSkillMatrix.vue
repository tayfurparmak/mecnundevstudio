<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="skill in skills"
      :key="skill.id"
      class="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4 card-hover-cyber shadow-xl group relative overflow-hidden"
    >
      <!-- Background Cyber Glow Accent -->
      <div class="absolute -right-12 -top-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none"></div>

      <div class="flex items-center justify-between relative z-10">
        <span class="text-base font-bold text-white group-hover:text-cyan-400 transition font-sans">
          {{ skill.skillName }}
        </span>
        <span class="font-mono text-sm font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
          %{{ skill.percentage }}
        </span>
      </div>

      <!-- Segmented Neon Energy Bar -->
      <div class="space-y-1.5 relative z-10">
        <div class="w-full bg-[#050508] h-3 rounded-full overflow-hidden border border-white/10 p-0.5 flex gap-0.5">
          <div
            v-for="seg in 10"
            :key="seg"
            :class="[
              'h-full flex-1 rounded-sm transition-all duration-500',
              (seg / 10) * 100 <= skill.percentage
                ? 'bg-gradient-to-r from-cyan-500 to-violet-500 shadow-[0_0_8px_rgba(0,242,254,0.6)]'
                : 'bg-white/5'
            ]"
          ></div>
        </div>
      </div>

      <div class="flex items-center justify-between text-[11px] text-zinc-400 pt-1 relative z-10 font-mono">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Active Matrix</span>
        </span>
        <span class="text-zinc-500">Updated Real-time</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  skills: Array<{ id: number; skillName: string; percentage: number }>
}>()
</script>
