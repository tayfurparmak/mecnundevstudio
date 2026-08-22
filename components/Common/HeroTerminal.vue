<template>
  <div class="w-full max-w-3xl mx-auto rounded-2xl bg-[#09090f] border border-white/10 shadow-2xl overflow-hidden font-mono text-xs">
    <!-- Terminal Header Bar -->
    <div class="flex items-center justify-between px-4 py-3 bg-[#12121c] border-b border-white/10">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
        <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
        <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
        <span class="text-zinc-400 ml-2 font-semibold tracking-wider">kimi-cli@mecnun-studio:~</span>
      </div>
      <div class="flex items-center gap-2 text-[10px] text-cyan-400">
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>AI Autonomous Mode</span>
      </div>
    </div>

    <!-- Terminal Body / Output Scroll -->
    <div ref="terminalBody" class="p-5 space-y-3 h-64 overflow-y-auto text-zinc-300">
      <div class="text-zinc-500">
        Mecnun Dev Studio v2.4 (x86_64-pc-windows) • Powered by Nuxt 3 & Kimi AI Engine.<br/>
        Type <span class="text-cyan-400 font-bold">'help'</span> to list available executive commands or click quick actions below.
      </div>

      <div v-for="(log, idx) in history" :key="idx" class="space-y-1">
        <div class="flex items-center gap-2 text-cyan-400">
          <span>❯</span>
          <span class="text-white">{{ log.command }}</span>
        </div>
        <div class="text-zinc-400 pl-4 whitespace-pre-line leading-relaxed" v-html="log.output"></div>
      </div>
    </div>

    <!-- Terminal Input Prompt -->
    <form @submit.prevent="executeCommand" class="flex items-center px-4 py-3 bg-[#0d0d14] border-t border-white/10 gap-2">
      <span class="text-cyan-400 font-bold">❯</span>
      <input
        ref="commandInput"
        v-model="currentCommand"
        type="text"
        placeholder="Komut girin (örn: help, skills, status, blog)..."
        class="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono placeholder:text-zinc-600"
      />
      <button
        type="submit"
        class="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition active:scale-95"
      >
        Çalıştır ↵
      </button>
    </form>

    <!-- Quick Command Suggestions Bar -->
    <div class="px-4 py-2 bg-[#08080c] border-t border-white/5 flex items-center gap-2 flex-wrap text-[11px]">
      <span class="text-zinc-500 font-mono">Hızlı:</span>
      <button
        v-for="cmd in quickCommands"
        :key="cmd.label"
        type="button"
        @click="runQuick(cmd.action)"
        class="px-2 py-0.5 rounded bg-[#141420] border border-white/10 text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/40 transition font-mono active:scale-95"
      >
        {{ cmd.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentCommand = ref('')
const terminalBody = ref<HTMLElement | null>(null)
const commandInput = ref<HTMLInputElement | null>(null)

const history = ref<Array<{ command: string; output: string }>>([
  {
    command: 'status',
    output: '✓ Database: PostgreSQL / Supabase [Connected]\n✓ AI Core: Gemini 2.5 Flash / Kimi CLI [Active]\n✓ Neural Network: 100% Operational',
  },
])

const quickCommands = [
  { label: 'help', action: 'help' },
  { label: 'skills', action: 'skills' },
  { label: 'status', action: 'status' },
  { label: 'blog', action: 'blog' },
  { label: 'clear', action: 'clear' },
]

const executeCommand = () => {
  const cmd = currentCommand.value.trim().toLowerCase()
  if (!cmd) return

  let output = ''
  switch (cmd) {
    case 'help':
      output = 'Mevcut Komutlar:\n • status   - Sistem ve Supabase bağlantı durumunu gösterir\n • skills   - Aktif teknoloji ve beceri matrisini listeler\n • blog     - Son yayınlanan teknik yazıları getirir\n • whoami   - Mecnun Dev Studio vizyonunu açıklar\n • clear    - Terminal ekranını temizler'
      break
    case 'status':
      output = '✓ Database: PostgreSQL / Supabase [Connected]\n✓ AI Core: Gemini 2.5 Flash / Kimi CLI [Active]\n✓ Latency: 12ms | Security: Strict Mode'
      break
    case 'skills':
      output = '🚀 Aktif Nöronik Yetenekler:\n • Nuxt 3 & Vue 4: %95\n • Python & FastAPI: %90\n • TypeScript & Node.js: %92\n • AI & LLM Integrations: %88\n • English & SRS: %85'
      break
    case 'blog':
      output = '📖 Son Teknik Yazılar:\n 1. Nuxt 4 Architecture & Nitro Engine\n 2. PostgreSQL & Prisma Advanced Indexing\n 3. Cyber-Minimalist UI Design Systems'
      break
    case 'whoami':
      output = 'Mecnun Dev Studio — Yapay zeka, modern full-stack web mimarileri ve bilgisayar mühendisliği vizyonuyla inşa edilen kişisel teknoloji stüdyosudur.'
      break
    case 'clear':
      history.value = []
      currentCommand.value = ''
      return
    default:
      output = `Bilinmeyen komut: "${cmd}". Kullanılabilir komutları görmek için 'help' yazın.`
      break
  }

  history.value.push({ command: currentCommand.value, output })
  currentCommand.value = ''

  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
    }
  })
}

const runQuick = (action: string) => {
  currentCommand.value = action
  executeCommand()
}
</script>
