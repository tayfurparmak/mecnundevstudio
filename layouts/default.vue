<template>
  <div class="min-h-screen flex flex-col bg-[#050508] text-zinc-100 font-sans selection:bg-cyan-500 selection:text-black bg-cyber-grid relative">
    <!-- Real-Time Global Market & Asset Streamer Ticker -->
    <MarketTicker />

    <!-- Ambient Cyber Glow -->
    <div class="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 cyber-radial-glow pointer-events-none"></div>

    <ToastContainer />

    <!-- Translucent Sticky Navbar -->
    <header class="border-b border-white/10 bg-[#050508]/85 backdrop-blur-2xl sticky top-0 z-40 transition-all duration-300">
      <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <!-- Brand Logo -->
        <NuxtLink to="/" class="cursor-pointer focus:outline-none hover:opacity-95 transition">
          <BrandLogo size="md" />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400">
          <NuxtLink
            v-for="link in config.navLinks"
            :key="link.to"
            :to="link.to"
            class="hover:text-white transition-colors relative py-1"
            active-class="text-cyan-400 !font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-400 after:rounded-full after:shadow-[0_0_10px_#00f2fe]"
          >
            <span>{{ t(link.label) }}</span>
          </NuxtLink>
        </nav>

        <!-- Right CTA Actions -->
        <div class="hidden md:flex items-center gap-3">
          <LanguageSwitcher />

          <NuxtLink
            to="/admin"
            class="px-3.5 py-2 rounded-xl bg-[#121218] hover:bg-[#181822] border border-white/10 hover:border-cyan-400/40 text-zinc-300 hover:text-white font-semibold text-xs transition active:scale-95 flex items-center gap-1.5 shadow-sm"
            title="Admin Studio"
          >
            <span class="text-xs">🔒</span>
            <span>{{ t('nav.admin') }}</span>
          </NuxtLink>

          <NuxtLink
            to="/contact"
            class="px-4.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-black font-bold text-xs transition active:scale-95 shadow-md neon-glow-cyan flex items-center gap-1.5"
          >
            <span>{{ t('nav.contact') }}</span>
            <span>→</span>
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex md:hidden items-center gap-2">
          <NuxtLink
            to="/admin"
            class="p-2 rounded-xl bg-[#121218] border border-white/10 text-zinc-300 text-xs"
            title="Admin"
          >
            🔒
          </NuxtLink>
          <button
            type="button"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2.5 rounded-xl bg-[#121218] border border-white/10 text-zinc-300 hover:text-white transition active:scale-95"
            aria-label="Menü"
          >
            <span class="text-base">{{ isMobileMenuOpen ? '✕' : '☰' }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile Drawer -->
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden border-b border-white/10 bg-[#050508]/98 backdrop-blur-2xl px-6 py-5 space-y-4 animate-fade-in"
      >
        <nav class="flex flex-col space-y-2 text-sm font-semibold">
          <NuxtLink
            v-for="link in config.navLinks"
            :key="link.to"
            :to="link.to"
            @click="isMobileMenuOpen = false"
            class="px-3 py-2.5 rounded-xl text-zinc-300 hover:bg-white/5 transition"
            active-class="bg-cyan-500/10 text-cyan-400 !font-bold"
          >
            {{ t(link.label) }}
          </NuxtLink>
          <NuxtLink
            to="/admin"
            @click="isMobileMenuOpen = false"
            class="px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition flex items-center justify-between border-t border-white/5 pt-3"
          >
            <span>{{ t('admin.studio') }}</span>
            <span>🔒</span>
          </NuxtLink>
        </nav>
        <div class="pt-2 border-t border-white/10">
          <NuxtLink
            to="/contact"
            @click="isMobileMenuOpen = false"
            class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-600 text-center text-black font-bold text-xs transition active:scale-95 block"
          >
            {{ t('nav.contact') }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full relative z-10">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/10 bg-[#030306] py-14 mt-24 text-zinc-400 text-xs relative z-10">
      <div class="max-w-6xl mx-auto px-6 space-y-10">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div class="space-y-3 max-w-sm">
            <BrandLogo size="sm" />
            <p class="text-zinc-500 text-xs leading-relaxed font-sans">
              {{ t('hero.description') }}
            </p>
          </div>

          <div class="flex items-center gap-6 flex-wrap font-semibold text-xs text-zinc-400">
            <NuxtLink
              v-for="link in config.navLinks"
              :key="'footer_' + link.to"
              :to="link.to"
              class="hover:text-cyan-400 transition-colors"
            >
              {{ t(link.label) }}
            </NuxtLink>
          </div>

          <div class="flex items-center gap-2.5">
            <a
              v-for="social in config.socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-xl bg-[#121218] border border-white/10 hover:border-cyan-400 hover:text-cyan-300 text-zinc-400 flex items-center justify-center text-xs transition active:scale-95 shadow-xs"
              :title="social.name"
            >
              <span>{{ social.icon }}</span>
            </a>
          </div>
        </div>

        <div class="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {{ new Date().getFullYear() }} {{ config.brand.name }} • {{ t('footer.rights') }}</p>
          <div class="flex items-center gap-4">
            <span class="font-mono text-cyan-400/80 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              {{ config.brand.subTagline }}
            </span>
            <span class="text-zinc-700">•</span>
            <NuxtLink
              to="/admin"
              class="text-zinc-500 hover:text-cyan-400 transition font-mono text-[11px]"
            >
              🔒 {{ t('footer.adminLogin') }}
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
import MarketTicker from '~/components/MarketTicker.vue'
import LanguageSwitcher from '~/components/Common/LanguageSwitcher.vue'
import { useI18n } from '~/composables/useI18n'

const config = useSiteConfig()
const isMobileMenuOpen = ref(false)
const { t } = useI18n()
</script>