<template>
  <div class="min-h-screen flex flex-col bg-[#05070A] text-slate-100 font-sans selection:bg-sky-500 selection:text-black">
    <ToastContainer />

    <!-- Translucent Neural Sticky Navbar -->
    <header class="border-b border-white/8 bg-[#05070A]/80 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-300">
      <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <!-- MECNUNUM Official Brand Logo -->
        <NuxtLink to="/" class="cursor-pointer focus:outline-none">
          <BrandLogo size="md" />
        </NuxtLink>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-8 text-xs font-bold text-slate-400">
          <NuxtLink
            v-for="link in config.navLinks"
            :key="link.to"
            :to="link.to"
            class="hover:text-white transition-colors relative py-1"
            active-class="text-sky-400 !font-extrabold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-sky-400 after:rounded-full after:shadow-[0_0_8px_#38bdf8]"
          >
            <span>{{ link.label }}</span>
          </NuxtLink>
        </nav>

        <!-- Right Side CTA Actions (Admin Studio Link + Contact Button) -->
        <div class="hidden md:flex items-center gap-3">
          <NuxtLink
            to="/admin"
            class="px-3.5 py-1.5 rounded-xl bg-[#0B1017] hover:bg-[#111722] border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
            title="Admin Studio Yönetim Paneli"
          >
            <span class="text-xs">🔒</span>
            <span>Admin</span>
          </NuxtLink>

          <NuxtLink
            to="/contact"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-black font-extrabold text-xs transition shadow-md shadow-sky-500/20 hover:shadow-sky-400/40 hover:scale-102 flex items-center gap-1.5"
          >
            <span>İletişime Geç</span>
            <span>→</span>
          </NuxtLink>
        </div>

        <!-- Mobile Controls (Hamburger) -->
        <div class="flex md:hidden items-center gap-2">
          <NuxtLink
            to="/admin"
            class="p-2 rounded-xl bg-[#0B1017] border border-white/10 text-slate-300 hover:text-white text-xs"
            title="Admin Giriş"
          >
            🔒
          </NuxtLink>

          <button
            type="button"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-white transition"
            aria-label="Menüyü Aç"
          >
            <span v-if="!isMobileMenuOpen" class="text-lg leading-none">☰</span>
            <span v-else class="text-lg font-bold leading-none">✕</span>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Drawer -->
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden border-b border-white/10 bg-[#05070A]/95 backdrop-blur-2xl px-6 py-5 space-y-4 animate-fade-in"
      >
        <nav class="flex flex-col space-y-2 text-sm font-bold">
          <NuxtLink
            v-for="link in config.navLinks"
            :key="link.to"
            :to="link.to"
            @click="isMobileMenuOpen = false"
            class="px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-900 transition"
            active-class="bg-sky-950/60 text-sky-400 !font-extrabold"
          >
            {{ link.label }}
          </NuxtLink>

          <NuxtLink
            to="/admin"
            @click="isMobileMenuOpen = false"
            class="px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition flex items-center justify-between border-t border-white/5 pt-3"
          >
            <span>Admin Studio</span>
            <span>🔒</span>
          </NuxtLink>
        </nav>

        <div class="pt-2 border-t border-white/10">
          <NuxtLink
            to="/contact"
            @click="isMobileMenuOpen = false"
            class="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-center text-black font-extrabold text-xs transition shadow-md block"
          >
            İletişime Geç
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Public Page Content -->
    <main class="flex-1 w-full relative">
      <slot />
    </main>

    <!-- Minimalist Neural Footer -->
    <footer class="border-t border-white/8 bg-[#030508] py-14 mt-24 text-slate-400 text-xs">
      <div class="max-w-6xl mx-auto px-6 space-y-10">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div class="space-y-3 max-w-sm">
            <BrandLogo size="sm" />
            <p class="text-slate-500 text-xs leading-relaxed font-sans">
              {{ config.brand.description }}
            </p>
          </div>

          <!-- Footer Navigation Links -->
          <div class="flex items-center gap-6 flex-wrap font-bold text-xs text-slate-400">
            <NuxtLink
              v-for="link in config.navLinks"
              :key="'footer_' + link.to"
              :to="link.to"
              class="hover:text-sky-400 transition-colors"
            >
              {{ link.label }}
            </NuxtLink>
          </div>

          <!-- Social Links -->
          <div class="flex items-center gap-2.5">
            <a
              v-for="social in config.socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-xl bg-slate-900/80 border border-white/8 hover:border-sky-500 hover:text-sky-400 text-slate-400 flex items-center justify-center text-xs transition shadow-xs hover:scale-105"
              :title="social.name"
            >
              <span>{{ social.icon }}</span>
            </a>
          </div>
        </div>

        <div class="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {{ new Date().getFullYear() }} {{ config.brand.name }} • Tüm Hakları Saklıdır.</p>
          <div class="flex items-center gap-4">
            <span class="font-mono text-sky-400/80">{{ config.brand.subTagline }}</span>
            <span class="text-slate-800">•</span>
            <NuxtLink
              to="/admin"
              class="text-slate-500 hover:text-sky-400 transition flex items-center gap-1 font-mono text-[11px]"
            >
              <span>🔒</span>
              <span>Yönetim Girişi</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import BrandLogo from '~/components/Common/BrandLogo.vue'
import ToastContainer from '~/components/Common/ToastContainer.vue'

const config = useSiteConfig()
const isMobileMenuOpen = ref(false)
</script>
