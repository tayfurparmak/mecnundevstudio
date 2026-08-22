<template>
  <article class="p-7 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4 card-hover-cyber shadow-2xl flex flex-col justify-between group relative overflow-hidden">
    <!-- Spotlight Hover Glow Accent -->
    <div class="absolute -right-16 -top-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/25 transition-all pointer-events-none"></div>

    <div class="space-y-3 relative z-10">
      <!-- Header Meta: Source & Read Time -->
      <div class="flex items-center justify-between text-xs font-mono">
        <span class="px-2.5 py-1 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-bold uppercase tracking-wider">
          {{ item.source }}
        </span>
        <div class="flex items-center gap-2 text-zinc-500">
          <span>{{ item.date }}</span>
          <span>•</span>
          <span>{{ item.readTimeMinutes }} {{ t('readTime') }}</span>
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition leading-snug font-sans">
        {{ item.title }}
      </h3>

      <!-- Summary -->
      <p class="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
        {{ item.summary }}
      </p>
    </div>

    <!-- Footer Action -->
    <div class="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
      <span class="text-[11px] font-mono text-zinc-500 uppercase">
        {{ item.category }}
      </span>
      <a
        :href="item.sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="px-4 py-2 rounded-xl bg-[#141420] hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-500/30 text-xs font-bold transition active:scale-95 flex items-center gap-1.5 font-mono shadow-xs"
      >
        <span>{{ t('viewSource') }}</span>
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { AIDispatchItem } from '~/server/api/ai-news'

defineProps<{
  item: AIDispatchItem
}>()

const { t } = useLanguage()
</script>
