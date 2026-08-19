<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
    <header class="p-6">
      <NuxtLink to="/" class="text-sm text-slate-400 hover:text-white transition">
        ← Back to Home
      </NuxtLink>
    </header>

    <main class="flex-1 flex items-center justify-center p-4">
      <slot />
    </main>

    <footer class="p-6 text-center text-xs text-slate-600">
      DevStudio.ai • Secure Authentication
    </footer>
  </div>
</template>