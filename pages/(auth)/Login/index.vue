<template>
  <div class="min-h-[70vh] flex items-center justify-center">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-bold text-white">Giriş Yap</h1>
        <p class="text-xs text-slate-400">Admin hesabınızla devam edin</p>
      </div>

      <div 
        v-if="errorMessage" 
        class="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-xs text-rose-300 text-center"
      >
        {{ errorMessage }}
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Admin Şifresi</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            required
            autocomplete="current-password"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition" 
          />
        </div>

        <button 
          type="submit" 
          :disabled="isSubmitting || loading"
          class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition flex items-center justify-center"
        >
          <span v-if="isSubmitting || loading">Giriş yapılıyor...</span>
          <span v-else>Giriş Yap</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const { login, loading } = useAuth()

const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (!password.value.trim()) {
    errorMessage.value = 'Lütfen şifrenizi girin.'
    return
  }

  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await login(password.value)
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || err?.statusMessage || 'Geçersiz şifre. Lütfen tekrar deneyin.'
  } finally {
    isSubmitting.value = false
  }
}
</script>