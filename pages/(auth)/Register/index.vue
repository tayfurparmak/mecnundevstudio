<template>
  <div class="min-h-[70vh] flex items-center justify-center">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-bold text-white">Ziyaretçi Kaydı</h1>
        <p class="text-xs text-slate-400">İçerikleri kaydetmek ve takip etmek için hesap oluşturun</p>
      </div>
      <form class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Ad Soyad</label>
          <input type="text" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">E-Posta</label>
          <input type="email" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Şifre</label>
          <input type="password" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <button type="submit" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition">
          Kayıt Ol
        </button>
      </form>
    </div>
  </div>
</template>