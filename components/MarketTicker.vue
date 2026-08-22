<template>
  <div class="relative w-full bg-[#050508] border-y border-emerald-500/15 backdrop-blur-2xl py-2 px-4 select-none overflow-hidden z-50 font-mono text-xs">
    <!-- Left Vignette & Live Signal Badge -->
    <div class="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050508] to-transparent z-20 pointer-events-none flex items-center pl-2">
      <div class="flex items-center gap-2 bg-[#0a0a12] border border-emerald-500/30 px-2.5 py-1 rounded-md shadow-[0_0_12px_rgba(16,185,129,0.2)]">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-[10px] font-bold text-emerald-400 tracking-wider hidden sm:inline">LIVE FEED</span>
      </div>
    </div>

    <!-- Right Vignette -->
    <div class="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050508] to-transparent z-20 pointer-events-none"></div>

    <!-- Loading State -->
    <div v-if="pending && assets.length === 0" class="flex items-center justify-center py-1 text-zinc-500">
      <span class="animate-pulse">Global finansal akış yükleniyor...</span>
    </div>

    <!-- Infinite Marquee Ticker -->
    <div v-else class="overflow-hidden whitespace-nowrap flex w-full relative">
      <div class="animate-marquee flex items-center gap-8 pl-24 pr-12">
        <!-- Render Asset Items (duplicated for seamless infinite loop) -->
        <div
          v-for="(asset, idx) in duplicatedAssets"
          :key="idx"
          class="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#0b0b14] border border-white/5 hover:border-emerald-500/40 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm group"
        >
          <!-- Symbol & Name -->
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-white tracking-wider group-hover:text-emerald-300 transition">{{ asset.symbol }}</span>
            <span class="text-[10px] text-zinc-500 hidden sm:inline">({{ asset.name }})</span>
          </div>

          <!-- Price -->
          <span class="font-mono font-bold text-zinc-200">{{ asset.price }}</span>

          <!-- Change Badge -->
          <span
            :class="[
              'px-2 py-0.5 rounded-md text-[10px] font-bold font-mono flex items-center gap-0.5 shadow-sm',
              asset.isPositive
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                : 'bg-rose-950/80 text-rose-400 border border-rose-800/60 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
            ]"
          >
            <span>{{ asset.isPositive ? '▲' : '▼' }}</span>
            <span>{{ asset.change }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MarketAsset } from '~/server/api/market'

const assets = ref<MarketAsset[]>([])
const pending = ref(true)

const fetchMarketData = async () => {
  try {
    const res = await $fetch<{ success: boolean; assets: MarketAsset[] }>('/api/market')
    if (res?.assets) {
      assets.value = res.assets
    }
  } catch {
    // Keep existing or fallback
  } finally {
    pending.value = false
  }
}

// Duplicate assets array for seamless infinite marquee loop
const duplicatedAssets = computed(() => {
  if (assets.value.length === 0) return []
  return [...assets.value, ...assets.value]
})

let timer: NodeJS.Timeout | null = null

onMounted(() => {
  fetchMarketData()
  // 60-second polling interval
  timer = setInterval(fetchMarketData, 60000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
