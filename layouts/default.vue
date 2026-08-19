<template>
  <div class="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
    <!-- Navbar -->
    <header class="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="font-bold text-lg text-indigo-400">
          DevStudio<span class="text-white">.ai</span>
        </NuxtLink>
        
        <nav class="flex items-center gap-6 text-sm text-slate-300">
          <NuxtLink to="/" class="hover:text-white transition">Home</NuxtLink>
          <NuxtLink to="/About" class="hover:text-white transition">About</NuxtLink>
          <NuxtLink to="/blog" class="hover:text-white transition">Blog</NuxtLink>
          <NuxtLink to="/news" class="hover:text-white transition">News</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-white transition">Contact</NuxtLink>
          
          <!-- Konu Rozetleri -->
          <div class="px-2.5 py-1 rounded bg-indigo-950 border border-indigo-800 text-xs text-indigo-300">
            🤖 AI & 🇬🇧 English
          </div>

          <div class="flex items-center gap-2">
            <NuxtLink 
              to="/Login" 
              class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
            >
              Login
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>

    <!-- Public Page Content -->
    <main class="max-w-6xl mx-auto px-6 py-10 flex-1 w-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
      © 2026 Developer Portfolio & Learning Tracker
    </footer>
  </div>
</template>