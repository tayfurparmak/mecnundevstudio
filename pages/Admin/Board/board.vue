<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-white">Trello Hedef Paneli (Check Board)</h1>
        <p class="text-slate-400 text-sm">Öğrenilecek konuları ve aşamaları check edin.</p>
      </div>
      <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition">
        + Yeni Kolon / Görev Ekle
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Kolon 1: Öğrenilecekler -->
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h2 class="text-sm font-semibold text-slate-300">📋 Öğrenilecekler</h2>
        <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <div class="text-xs font-medium text-white">LangChain Temelleri</div>
          <span class="text-[10px] text-indigo-400">#YapayZeka</span>
        </div>
      </div>

      <!-- Kolon 2: Sürdürülenler (In Progress) -->
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h2 class="text-sm font-semibold text-slate-300">⏳ Devam Edenler</h2>
        <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <div class="text-xs font-medium text-white">İngilizce B2 Cümle Kalıpları</div>
          <span class="text-[10px] text-emerald-400">#İngilizce</span>
        </div>
      </div>

      <!-- Kolon 3: Tamamlananlar / Check Edilenler -->
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h2 class="text-sm font-semibold text-slate-300">✅ Tamamlandı (Check)</h2>
        <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 opacity-70">
          <div class="text-xs font-medium text-white line-through">Nuxt 4 Routing Yapısı</div>
          <span class="text-[10px] text-slate-500">#WebDev</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
</script>