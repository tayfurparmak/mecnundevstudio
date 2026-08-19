<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-white">İlerleme Çubukları & Konu Yönetimi</h1>
        <p class="text-slate-400 text-sm">Navbar ve ana sayfada görünen konu başlıklarının oranlarını kontrol edin.</p>
      </div>
      <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">+ Yeni Konu Başlığı Ekle</button>
    </div>

    <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
      <div class="space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-white font-medium">🤖 Yapay Zeka (LLM & Prompt Mühendisliği)</span>
            <span class="text-indigo-400 font-semibold">%70</span>
          </div>
          <div class="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div class="bg-indigo-500 h-full w-[70%]"></div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-white font-medium">🇬🇧 Teknik İngilizce (B2 Seviyesi)</span>
            <span class="text-emerald-400 font-semibold">%60</span>
          </div>
          <div class="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div class="bg-emerald-500 h-full w-[60%]"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
</script>