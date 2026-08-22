<template>
  <div class="space-y-4 pb-16 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Interactive Mind Map Canvas 🧠</h1>
          <span class="px-3 py-1 rounded-full bg-violet-950/80 border border-violet-800 text-[10px] font-mono font-bold text-violet-400">
            OBSIDIAN & MIRO ENGINE
          </span>
        </div>
        <p class="text-zinc-400 text-xs sm:text-sm mt-1">Mimari bileşenleri, öğrenme konularını ve fikirleri birbirine bağlayan interaktif zihin haritası.</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="isModalOpen = true"
          class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-600 text-black font-extrabold text-xs transition active:scale-95 shadow-lg neon-glow-cyan flex items-center gap-2 font-mono"
        >
          <span>+ Yeni Düğüm Ekle</span>
        </button>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center gap-3">
      <button 
        @click="toggleConnectionMode" 
        class="px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border"
        :class="isConnecting ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-[0_0_10px_#00f2fe]' : 'bg-[#0e0e16] text-zinc-400 border-white/10 hover:border-zinc-500'"
      >
        <span>🔗 Bağlantı Modu {{ isConnecting ? '(Açık)' : '(Kapalı)' }}</span>
      </button>
      <span v-if="isConnecting && !connectionSourceId" class="text-xs text-zinc-500 animate-pulse">İlk düğümü seçin...</span>
      <span v-if="isConnecting && connectionSourceId" class="text-xs text-cyan-400 animate-pulse">Hedef düğümü seçin... (İptal etmek için boşluğa tıklayın)</span>
    </div>

    <!-- Infinite Canvas Container -->
    <div 
      ref="canvasContainer"
      class="relative w-full h-[700px] rounded-3xl bg-[#09090f] border border-white/10 overflow-hidden shadow-2xl bg-cyber-grid select-none"
      :class="isPanning ? 'cursor-grabbing' : (isConnecting ? 'cursor-crosshair' : 'cursor-grab')"
      @wheel.prevent="handleWheel"
      @mousedown.self="startPan"
      @mousemove="handleCanvasMouseMove"
      @mouseup="endInteraction"
      @mouseleave="endInteraction"
    >
      <div class="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-[#0e0e16]/80 border border-white/10 text-[10px] font-mono text-zinc-400 flex items-center gap-2 backdrop-blur-sm pointer-events-none">
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>Zoom: {{ Math.round(scale * 100) }}% | Nodes: {{ nodes.length }}</span>
      </div>

      <!-- Transform Wrapper -->
      <div 
        class="absolute origin-top-left"
        :style="{ transform: `translate3d(${panX}px, ${panY}px, 0) scale(${scale})` }"
      >
        <!-- Edges Layer -->
        <svg class="absolute inset-0 overflow-visible pointer-events-none" style="z-index: 0">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#00f2fe" opacity="0.6" />
            </marker>
          </defs>
          <g v-for="edge in edges" :key="edge.id">
            <!-- Görsel Çizgi -->
            <path
              :d="getBezierPath(edge.fromId, edge.toId)"
              fill="none"
              stroke="#00f2fe"
              stroke-width="2"
              class="opacity-50 drop-shadow-[0_0_5px_#00f2fe]"
              marker-end="url(#arrow)"
            />
            <!-- Tıklama Alanı (Silmek için) -->
            <path
              :d="getBezierPath(edge.fromId, edge.toId)"
              fill="none"
              stroke="transparent"
              stroke-width="12"
              class="pointer-events-auto cursor-pointer hover:stroke-rose-500/50 transition-colors"
              @mousedown.stop="deleteEdge(edge.id)"
              title="Bağlantıyı Sil"
            />
          </g>

          <!-- Aktif Çizim Çizgisi (Bağlantı Modu) -->
          <path
            v-if="isConnecting && connectionSourceId && mousePos"
            :d="getActiveLinePath()"
            fill="none"
            stroke="#00f2fe"
            stroke-width="2"
            stroke-dasharray="5,5"
            class="opacity-80 animate-pulse drop-shadow-[0_0_5px_#00f2fe]"
          />
        </svg>

        <!-- Nodes Layer -->
        <div
          v-for="node in nodes"
          :key="node.id"
          class="absolute p-4 rounded-2xl bg-[#0e0e16]/90 backdrop-blur-md border border-white/10 shadow-xl w-64 space-y-2 transition-colors will-change-transform"
          :class="[
            isConnecting ? 'cursor-pointer hover:border-cyan-400' : 'cursor-grab active:cursor-grabbing hover:border-white/30',
            { 'border-cyan-500 shadow-[0_0_15px_rgba(0,242,254,0.4)]': connectionSourceId === node.id }
          ]"
          :style="{ 
            left: `${node.x}px`, 
            top: `${node.y}px`, 
            borderColor: connectionSourceId === node.id ? '#00f2fe' : node.color,
            zIndex: draggingNodeId === node.id ? 10 : 1
          }"
          @mousedown.stop="handleNodeMouseDown($event, node)"
        >
          <div class="flex items-center justify-between pointer-events-none">
            <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 uppercase" :style="{ color: node.color }">
              {{ node.category }}
            </span>
            <button
              v-if="!isConnecting"
              @mousedown.stop="deleteNode(node.id)"
              class="text-zinc-500 hover:text-rose-400 text-xs transition-colors pointer-events-auto"
              title="Düğümü Sil"
            >
              🗑️
            </button>
          </div>
          <h4 class="text-sm font-bold text-white pointer-events-none">{{ node.label }}</h4>
          <p v-if="node.description" class="text-[11px] text-zinc-400 leading-relaxed font-sans pointer-events-none">
            {{ node.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Create Node Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in" @click.self="isModalOpen = false">
      <div class="w-full max-w-md bg-[#0e0e16] border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl">
        <div class="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 class="text-base font-bold text-white">Yeni Zihin Haritası Düğümü</h3>
          <button @click="isModalOpen = false" class="text-zinc-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="createNode" class="space-y-4 text-xs font-mono">
          <div>
            <label class="block text-zinc-400 mb-1">Düğüm Başlığı *</label>
            <input
              v-model="newNode.label"
              type="text"
              required
              placeholder="Örn: Nuxt 4 Nitro Server Engine"
              class="w-full bg-[#050508] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-zinc-400 mb-1">Kategori</label>
              <input
                v-model="newNode.category"
                type="text"
                placeholder="Backend / AI / Frontend"
                class="w-full bg-[#050508] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label class="block text-zinc-400 mb-1">Neon Renk</label>
              <select
                v-model="newNode.color"
                class="w-full bg-[#050508] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="#00f2fe">Cyan (#00f2fe)</option>
                <option value="#8a2be2">Violet (#8a2be2)</option>
                <option value="#10b981">Emerald (#10b981)</option>
                <option value="#f59e0b">Amber (#f59e0b)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-zinc-400 mb-1">Açıklama / Not</label>
            <textarea
              v-model="newNode.description"
              rows="3"
              placeholder="Düğüm detayları..."
              class="w-full bg-[#050508] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 font-sans"
            ></textarea>
          </div>

          <div class="pt-3 border-t border-white/10 flex justify-end gap-3">
            <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-zinc-400 hover:text-white">Vazgeç</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold font-mono">Düğümü Ekle</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const toast = useToast()
const nodes = ref<any[]>([])
const edges = ref<any[]>([])
const isModalOpen = ref(false)

// Canvas State
const canvasContainer = ref<HTMLElement | null>(null)
const panX = ref(0)
const panY = ref(0)
const scale = ref(1)

const isPanning = ref(false)
const startPanX = ref(0)
const startPanY = ref(0)

// Drag State
const draggingNodeId = ref<number | null>(null)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)

// Connection State
const isConnecting = ref(false)
const connectionSourceId = ref<number | null>(null)
const mousePos = ref<{ x: number, y: number } | null>(null)

const newNode = ref({
  label: '',
  category: 'Backend',
  color: '#00f2fe',
  description: '',
})

const fetchMindMap = async () => {
  try {
    const res = await $fetch<{ success: boolean; nodes: any[]; edges: any[] }>('/api/mindmap')
    if (res?.nodes) {
      nodes.value = res.nodes
      edges.value = res.edges || []
      centerCanvas()
    }
  } catch {
    toast.error('Zihin haritası yüklenemedi.')
  }
}

onMounted(() => {
  fetchMindMap()
})

const centerCanvas = () => {
  if (!canvasContainer.value || nodes.value.length === 0) return
  const rect = canvasContainer.value.getBoundingClientRect()
  // Just center around first node for simplicity
  const cx = nodes.value[0].x
  const cy = nodes.value[0].y
  panX.value = (rect.width / 2) - cx
  panY.value = (rect.height / 2) - cy
}

// ---- Canvas Pan & Zoom ----
const handleWheel = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? -0.05 : 0.05
  const newScale = Math.min(Math.max(0.3, scale.value + delta), 2)
  scale.value = newScale
}

const startPan = (e: MouseEvent) => {
  if (isConnecting.value) {
    // Clicked on empty space while connecting -> cancel
    cancelConnection()
    return
  }
  isPanning.value = true
  startPanX.value = e.clientX - panX.value
  startPanY.value = e.clientY - panY.value
}

const handleCanvasMouseMove = (e: MouseEvent) => {
  if (isPanning.value) {
    panX.value = e.clientX - startPanX.value
    panY.value = e.clientY - startPanY.value
  } else if (draggingNodeId.value) {
    const node = nodes.value.find(n => n.id === draggingNodeId.value)
    if (node) {
      // Convert screen coordinates to canvas coordinates
      const rect = canvasContainer.value!.getBoundingClientRect()
      const x = (e.clientX - rect.left - panX.value - dragOffsetX.value) / scale.value
      const y = (e.clientY - rect.top - panY.value - dragOffsetY.value) / scale.value
      node.x = x
      node.y = y
    }
  } else if (isConnecting.value && connectionSourceId.value) {
    const rect = canvasContainer.value!.getBoundingClientRect()
    mousePos.value = {
      x: (e.clientX - rect.left - panX.value) / scale.value,
      y: (e.clientY - rect.top - panY.value) / scale.value
    }
  }
}

const endInteraction = () => {
  isPanning.value = false
  if (draggingNodeId.value) {
    const node = nodes.value.find(n => n.id === draggingNodeId.value)
    if (node) {
      saveNodePosition(node)
    }
    draggingNodeId.value = null
  }
}

// ---- Node Interaction ----
const handleNodeMouseDown = (e: MouseEvent, node: any) => {
  if (isConnecting.value) {
    handleConnectClick(node.id)
  } else {
    // Start drag
    draggingNodeId.value = node.id
    const rect = canvasContainer.value!.getBoundingClientRect()
    const currentX = (e.clientX - rect.left - panX.value) / scale.value
    const currentY = (e.clientY - rect.top - panY.value) / scale.value
    dragOffsetX.value = (currentX - node.x) * scale.value
    dragOffsetY.value = (currentY - node.y) * scale.value
  }
}

// ---- Connection Logic ----
const toggleConnectionMode = () => {
  isConnecting.value = !isConnecting.value
  cancelConnection()
}

const cancelConnection = () => {
  connectionSourceId.value = null
  mousePos.value = null
}

const handleConnectClick = async (nodeId: number) => {
  if (!connectionSourceId.value) {
    connectionSourceId.value = nodeId
  } else {
    if (connectionSourceId.value !== nodeId) {
      await createEdge(connectionSourceId.value, nodeId)
    }
    cancelConnection()
    isConnecting.value = false // Exit mode after success
  }
}

// ---- SVG Path Math ----
const getNodeCenter = (nodeId: number) => {
  const node = nodes.value.find(n => n.id === nodeId)
  if (!node) return { x: 0, y: 0 }
  return { x: node.x + 128, y: node.y + 50 } // approx center of w-64 h-auto
}

const getBezierPath = (fromId: number, toId: number) => {
  const from = getNodeCenter(fromId)
  const to = getNodeCenter(toId)
  const dx = Math.abs(to.x - from.x) * 0.5
  return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`
}

const getActiveLinePath = () => {
  if (!connectionSourceId.value || !mousePos.value) return ''
  const from = getNodeCenter(connectionSourceId.value)
  const to = mousePos.value
  const dx = Math.abs(to.x - from.x) * 0.5
  return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`
}

// ---- API Calls ----
const saveNodePosition = async (node: any) => {
  try {
    await $fetch('/api/mindmap/move', {
      method: 'PUT',
      body: { id: node.id, x: node.x, y: node.y }
    })
  } catch {
    toast.error('Pozisyon kaydedilemedi.')
  }
}

const createNode = async () => {
  if (!newNode.value.label.trim()) return
  try {
    // Drop in center of current view
    const x = (-panX.value + (canvasContainer.value?.clientWidth || 800) / 2) / scale.value - 128
    const y = (-panY.value + (canvasContainer.value?.clientHeight || 600) / 2) / scale.value - 50

    const res = await $fetch<{ success: boolean; node: any }>('/api/mindmap', {
      method: 'POST',
      body: { ...newNode.value, x, y },
    })
    if (res?.node) {
      nodes.value.push(res.node)
      newNode.value = { label: '', category: 'Backend', color: '#00f2fe', description: '' }
      isModalOpen.value = false
      toast.success('Yeni zihin haritası düğümü eklendi! 🧠')
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'Düğüm eklenemedi.')
  }
}

const deleteNode = async (id: number) => {
  try {
    await $fetch(`/api/mindmap?id=${id}`, { method: 'DELETE' })
    nodes.value = nodes.value.filter(n => n.id !== id)
    edges.value = edges.value.filter(e => e.fromId !== id && e.toId !== id)
    toast.success('Düğüm silindi.')
  } catch {
    toast.error('Düğüm silinemedi.')
  }
}

const createEdge = async (fromId: number, toId: number) => {
  try {
    const res = await $fetch<{ success: boolean; edge: any }>('/api/mindmap/edge', {
      method: 'POST',
      body: { fromId, toId }
    })
    if (res?.edge) {
      // avoid duplicates in local state
      if (!edges.value.find(e => e.id === res.edge.id)) {
        edges.value.push(res.edge)
      }
      toast.success('Bağlantı kuruldu! 🔗')
    }
  } catch {
    toast.error('Bağlantı oluşturulamadı.')
  }
}

const deleteEdge = async (id: number) => {
  try {
    await $fetch(`/api/mindmap/edge?id=${id}`, { method: 'DELETE' })
    edges.value = edges.value.filter(e => e.id !== id)
    toast.success('Bağlantı silindi.')
  } catch {
    toast.error('Bağlantı silinemedi.')
  }
}
</script>
