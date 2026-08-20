<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <!-- Ambient Top Glow -->
        <div class="absolute -top-12 -right-12 w-40 h-40 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">🌙</span>
            <div>
              <h3 class="text-base font-bold text-white tracking-tight">Gün Sonu Kapanışı (EOD Review)</h3>
              <p class="text-[11px] text-slate-400">Günün süresini ve öğrenme jurnalinizi tek tıkla mühürleyin.</p>
            </div>
          </div>
          <button
            type="button"
            @click="close"
            class="text-slate-400 hover:text-white p-1 rounded-lg transition text-sm"
          >
            ✕
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-slate-400 mb-1">Teknoloji *</label>
              <select
                v-model="form.technology"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Python">Python</option>
                <option value="Nuxt">Nuxt & Vue</option>
                <option value="TypeScript">TypeScript</option>
                <option value="AI">Yapay Zeka & LLM</option>
                <option value="English">English</option>
                <option value="Web">Genel Web</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-400 mb-1">Çalışılan Süre (dk) *</label>
              <input
                v-model.number="form.durationMinutes"
                type="number"
                min="0"
                max="720"
                required
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-slate-400 mb-1">Bugün Ne Öğrendim? (Özet) *</label>
            <textarea
              v-model="form.learningLog"
              rows="3"
              required
              placeholder="Örn: Python'da decorator yapısını ve argüman aktarımını pratik ettim..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-slate-400 mb-1">Takıldığım / Anlamadığım Nokta</label>
              <input
                v-model="form.notLearned"
                type="text"
                placeholder="Örn: Closure bellek optimizasyonu"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-400 mb-1">Yarınki İlk Hedefim</label>
              <input
                v-model="form.planTomorrow"
                type="text"
                placeholder="Örn: LeetCode 2 soru çöz"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div class="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="close"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 transition"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              :disabled="submitting || !form.learningLog"
              class="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <span v-if="submitting" class="animate-spin">🌀</span>
              <span>{{ submitting ? 'Kaydediliyor...' : '🌙 Günü Tamamla & Kaydet' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}>()

const toast = useToast()
const isOpen = computed(() => props.modelValue)
const submitting = ref(false)

const form = ref({
  technology: 'Python',
  durationMinutes: 60,
  todoTask: '',
  learningLog: '',
  notLearned: '',
  planTomorrow: '',
})

const close = () => {
  emit('update:modelValue', false)
}

const handleSubmit = async () => {
  if (!form.value.learningLog.trim()) return
  submitting.value = true

  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/daily-log/eod', {
      method: 'POST',
      body: {
        technology: form.value.technology,
        durationMinutes: form.value.durationMinutes,
        todoTask: form.value.todoTask || `${form.value.technology} Çalışması`,
        learningLog: form.value.learningLog,
        notLearned: form.value.notLearned || undefined,
        planTomorrow: form.value.planTomorrow || undefined,
      },
    })

    if (res?.success) {
      toast.success(res.message || 'Gün sonu kapanışı kaydedildi! 🌟')
      form.value = {
        technology: 'Python',
        durationMinutes: 60,
        todoTask: '',
        learningLog: '',
        notLearned: '',
        planTomorrow: '',
      }
      emit('saved')
      close()
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Gün sonu kapanışı kaydedilemedi.')
  } finally {
    submitting.value = false
  }
}
</script>
