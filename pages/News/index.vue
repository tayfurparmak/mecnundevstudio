<template>
  <div class="min-h-screen bg-[#07070a] text-zinc-100 font-sans selection:bg-cyan-500 selection:text-black bg-cyber-grid">
    <AINewsHub />
  </div>
</template>

<script setup lang="ts">
import AINewsHub from '~/components/AINewsHub.vue'

const config = useSiteConfig()

useSeoMeta({
  title: `AI Intelligence Hub • ${config.brand.name}`,
  description: 'Gerçek zamanlı yapay zeka gelişmeleri, LLM modelleri ve küresel teknoloji raporları.',
  ogTitle: `AI Intelligence Hub • ${config.brand.name}`,
  ogDescription: 'Gerçek zamanlı yapay zeka gelişmeleri ve küresel teknoloji raporları.',
})
</script>
