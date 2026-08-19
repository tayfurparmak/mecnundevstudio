<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-white">Bugün Ne Öğrendim?</h1>
        <p class="text-slate-400 text-sm">Günlük çalışma notlarını kaydet ve ilerleme çubuğuna bağla.</p>
      </div>
      <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">AI ile Bloga Çevir</button>
    </div>

    <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Konu Kategorisi</label>
          <select class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500">
            <option>Yapay Zeka (AI)</option>
            <option>Teknik İngilizce</option>
            <option>Frontend / Nuxt</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Kazanılan İlerleme Puanı (%)</label>
          <input type="number" placeholder="+5" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1">Günlük Not & Kod Parçaları</label>
        <textarea rows="6" placeholder="Bugün öğrendiklerini detaylandır..." class="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500"></textarea>
      </div>

      <div class="flex justify-end gap-3">
        <button class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm">Taslak Kaydet</button>
        <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">Kaydet & İlerlemeyi Güncelle</button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
</script>