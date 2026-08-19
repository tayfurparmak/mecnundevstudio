<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-white">Yeni İçerik Oluştur</h1>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm">Taslak Kaydet</button>
        <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">Ziyaretçiye Yayınla</button>
      </div>
    </div>

    <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <input type="text" placeholder="Başlık..." class="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500" />
      <textarea rows="10" placeholder="İçeriğinizi buraya yazın veya Markdown kullanın..." class="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500"></textarea>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
</script>