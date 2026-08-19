<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-white">İçerik Yönetim Sistemi (CMS)</h1>
        <p class="text-slate-400 text-sm">Ziyaretçilerin göreceği blog ve haberleri yönetin.</p>
      </div>
      <NuxtLink to="/admin/cms/editor" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">+ Yeni Yazı Ekle</NuxtLink>
    </div>

    <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800">
      <div class="space-y-3">
        <div class="flex justify-between items-center p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div>
            <div class="font-medium text-white text-sm">Nuxt 4 ile AI Entegrasyonu</div>
            <span class="text-xs text-slate-500">19 Ağustos 2026 • Blog</span>
          </div>
          <span class="px-2 py-1 rounded bg-emerald-950 text-emerald-400 text-xs border border-emerald-800">Yayında</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
</script>