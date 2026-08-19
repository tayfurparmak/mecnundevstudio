<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-white">Yönetim Masası 👋</h1>
      <p class="text-slate-400 text-sm mt-1">Öğrenme grafikleri, hedefler ve içerik yönetimi özeti.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <span class="text-xs font-medium text-slate-400">Trello Board Aktif Görev</span>
        <div class="text-3xl font-bold text-indigo-400 mt-2">5 Görev</div>
      </div>
      <div class="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <span class="text-xs font-medium text-slate-400">Hedef Tamamlama Oranı</span>
        <div class="text-3xl font-bold text-emerald-400 mt-2">%68</div>
      </div>
      <div class="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <span class="text-xs font-medium text-slate-400">Blog Taslakları</span>
        <div class="text-3xl font-bold text-amber-400 mt-2">2 Yazı</div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
</script>