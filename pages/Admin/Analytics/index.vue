<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-white">Hedef Analiz Tablosu</h1>
      <p class="text-slate-400 text-sm">Belirlediğiniz hedeflerin tamamlanma ve check edilme analizleri.</p>
    </div>

    <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-slate-950/60 text-xs uppercase text-slate-400 border-b border-slate-800">
          <tr>
            <th class="px-6 py-4">Hedef Konu</th>
            <th class="px-6 py-4">Kategori</th>
            <th class="px-6 py-4">Hedeflenen Tarih</th>
            <th class="px-6 py-4">İlerleme</th>
            <th class="px-6 py-4">Durum</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr>
            <td class="px-6 py-4 font-medium text-white">Gemini API Entegrasyonu</td>
            <td class="px-6 py-4"><span class="px-2 py-0.5 rounded text-xs bg-indigo-950 text-indigo-300">Yapay Zeka</span></td>
            <td class="px-6 py-4 text-xs text-slate-400">Ağustos 2026</td>
            <td class="px-6 py-4">%85</td>
            <td class="px-6 py-4"><span class="text-emerald-400 text-xs font-semibold">Devam Ediyor</span></td>
          </tr>
          <tr>
            <td class="px-6 py-4 font-medium text-white">200 Teknik Kelime Ezberi</td>
            <td class="px-6 py-4"><span class="px-2 py-0.5 rounded text-xs bg-emerald-950 text-emerald-300">İngilizce</span></td>
            <td class="px-6 py-4 text-xs text-slate-400">Eylül 2026</td>
            <td class="px-6 py-4">%50</td>
            <td class="px-6 py-4"><span class="text-amber-400 text-xs font-semibold">İnceleniyor</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
</script>