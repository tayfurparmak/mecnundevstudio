<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-white">Blog & Dokümanlar</h1>
      <p class="text-slate-400 text-sm mt-1">Öğrenme sürecimde tuttuğum notlar, rehberler ve teknik makaleler.</p>
    </div>

    <div class="grid gap-4">
      <div v-for="i in 3" :key="i" class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition">
        <span class="text-xs text-indigo-400 font-medium">Yapay Zeka & Nuxt</span>
        <h2 class="text-xl font-bold text-white">
          <NuxtLink :to="`/blog/ornek-yazi-${i}`" class="hover:underline">Nuxt 4 ile Tam Kapsamlı AI Uygulaması Geliştirme #{{ i }}</NuxtLink>
        </h2>
        <p class="text-slate-400 text-sm">Bugün aldığım notları ve öğrendiğim kritik mimari yapıları detaylandırdım...</p>
        <span class="text-xs text-slate-500 block">19 Ağustos 2026</span>
      </div>
    </div>
  </div>
</template>