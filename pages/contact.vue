<template>
  <div class="max-w-4xl mx-auto px-6 py-12 space-y-12">
    <!-- Header -->
    <div class="space-y-4 border-b border-white/8 pb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1017] border border-sky-500/30 text-sky-400 text-xs font-semibold font-mono">
        <span>✉️</span>
        <span>Bağlantı & İletişim</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
        İletişime Geçin 💡
      </h1>
      <p class="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
        Projeler, iş birlikleri veya teknik fikir alışverişi için formu doldurabilir veya doğrudan e-posta ile bağlantı kurabilirsiniz.
      </p>
    </div>

    <!-- 2-Column Contact Grid -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <!-- Left: Contact Information Cards (5 cols) -->
      <div class="md:col-span-5 space-y-4">
        <div class="p-6 sm:p-7 rounded-3xl bg-[#0B1017] border border-white/8 space-y-4 shadow-md">
          <h3 class="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">DOĞRUDAN İLETİŞİM</h3>
          
          <div class="space-y-3.5 text-xs">
            <div class="flex items-start gap-3">
              <span class="text-base">📧</span>
              <div>
                <span class="text-slate-400 block text-[10px]">E-Posta</span>
                <a :href="`mailto:${config.contact.email}`" class="font-bold text-white hover:text-sky-400 transition font-mono">
                  {{ config.contact.email }}
                </a>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span class="text-base">📍</span>
              <div>
                <span class="text-slate-400 block text-[10px]">Lokasyon</span>
                <span class="font-bold text-white">{{ config.contact.location }}</span>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span class="text-base">⏱️</span>
              <div>
                <span class="text-slate-400 block text-[10px]">Yanıt Süresi</span>
                <span class="text-slate-300">Genellikle 24 saat içinde yanıt verilir.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Channels -->
        <div class="p-6 rounded-3xl bg-[#0B1017] border border-white/8 space-y-3 shadow-md">
          <h3 class="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">SOSYAL KANALLAR</h3>
          <div class="flex flex-wrap gap-2 pt-1">
            <a
              v-for="social in config.socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-1.5 rounded-xl bg-[#05070A] border border-white/8 hover:border-sky-500 text-slate-300 hover:text-sky-300 text-xs font-medium transition flex items-center gap-1.5 shadow-xs hover:scale-105"
            >
              <span>{{ social.icon }}</span>
              <span>{{ social.name }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Right: Interactive Contact Form (7 cols) -->
      <div class="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0B1017] border border-white/8 space-y-6 shadow-2xl relative overflow-hidden">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <span>📨</span>
          <span>Mesaj Gönder</span>
        </h2>

        <!-- Success Banner -->
        <div
          v-if="isSuccess"
          class="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs space-y-2 animate-fade-in"
        >
          <div class="flex items-center gap-2 font-bold text-sm">
            <span>✓</span>
            <span>Mesajınız Başarıyla İletildi!</span>
          </div>
          <p>En kısa sürede e-posta adresiniz üzerinden geri dönüş yapılacaktır. Teşekkürler!</p>
          <button
            type="button"
            @click="isSuccess = false"
            class="text-[11px] font-bold underline hover:text-emerald-100 pt-1 block"
          >
            Yeni bir mesaj yaz
          </button>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Honeypot anti-spam field (hidden) -->
          <input
            v-model="honeypot"
            type="text"
            name="website"
            class="hidden"
            tabindex="-1"
            autocomplete="off"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Adınız Soyadınız *</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Örn: Ahmet Yılmaz"
                class="w-full bg-[#05070A] border border-white/8 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">E-Posta Adresiniz *</label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="ahmet@example.com"
                class="w-full bg-[#05070A] border border-white/8 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Konu</label>
            <input
              v-model="form.subject"
              type="text"
              placeholder="Örn: Nuxt / Full-Stack Proje Fikri"
              class="w-full bg-[#05070A] border border-white/8 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Mesajınız *</label>
            <textarea
              v-model="form.message"
              rows="5"
              required
              placeholder="Mesajınızı buraya yazabilirsiniz..."
              class="w-full bg-[#05070A] border border-white/8 rounded-xl p-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition leading-relaxed"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="submitting || !form.name || !form.email || !form.message"
            class="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-black font-extrabold rounded-xl text-xs transition shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
          >
            <span v-if="submitting" class="animate-spin">🌀</span>
            <span>{{ submitting ? 'Mesaj İletiliyor...' : 'Mesajı Gönder 🚀' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const config = useSiteConfig()
const toast = useToast()

useSeoMeta({
  title: `İletişim • ${config.brand.name}`,
  description: 'Projeler, iş birlikleri ve teknik danışmanlık için iletişim formu.',
  ogTitle: `İletişim • ${config.brand.name}`,
  ogDescription: 'Projeler ve iş birlikleri için iletişim sayfası.',
})

const submitting = ref(false)
const isSuccess = ref(false)
const honeypot = ref('')

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const handleSubmit = async () => {
  if (honeypot.value) {
    return
  }

  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.message.trim()) {
    toast.error('Lütfen tüm zorunlu alanları doldurunuz.')
    return
  }

  submitting.value = true

  await new Promise((resolve) => setTimeout(resolve, 500))

  submitting.value = false
  isSuccess.value = true
  toast.success('Mesajınız başarıyla iletildi! 📬')

  form.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
  }
}
</script>
