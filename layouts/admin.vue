<template>
  <div class="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
    <!-- Admin Sidebar -->
    <aside class="w-64 border-r border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between shrink-0">
      <div class="space-y-6">
        <div>
          <span class="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Control Panel</span>
          <h2 class="text-lg font-bold text-white mt-1">Admin Studio</h2>
        </div>
        
        <nav class="space-y-1.5 text-sm text-slate-400">
          <NuxtLink 
            to="/Admin" 
            class="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink 
            to="/Admin/Board" 
            class="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Check Board (Trello)
          </NuxtLink>
          <NuxtLink 
            to="/Admin/Daily-log" 
            class="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Daily Log
          </NuxtLink>
          <NuxtLink 
            to="/Admin/Larning-tracker" 
            class="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Learning Tracker
          </NuxtLink>
          <NuxtLink 
            to="/Admin/Analytics" 
            class="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Goal Analytics
          </NuxtLink>
          <NuxtLink 
            to="/Admin/Cms" 
            class="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            CMS & Blog Manager
          </NuxtLink>
        </nav>
      </div>

      <div class="pt-4 border-t border-slate-800 flex items-center justify-between">
        <NuxtLink to="/" class="text-xs text-slate-500 hover:text-slate-300 transition">
          ← Public Site
        </NuxtLink>
        <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
          Active
        </span>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-y-auto max-w-6xl">
      <slot />
    </main>
  </div>
</template>