<template>
  <div class="max-w-xl space-y-6">
    <h1 class="text-3xl font-bold text-white">İletişim</h1>
    <p class="text-slate-400 text-sm">Projeler veya iş birlikleri için mesaj gönderebilirsiniz.</p>

    <form class="space-y-4">
      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1">Ad Soyad</label>
        <input type="text" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1">E-Posta</label>
        <input type="email" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1">Mesaj</label>
        <textarea rows="4" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"></textarea>
      </div>
      <button type="submit" class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition">
        Gönder
      </button>
    </form>
  </div>
</template>