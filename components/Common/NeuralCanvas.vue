<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <canvas ref="canvasRef" class="w-full h-full block opacity-80"></canvas>
  </div>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseRadius: number
  pulsePhase: number
  pulseSpeed: number
  color: string
}

interface Pulse {
  fromNode: number
  toNode: number
  progress: number
  speed: number
}

let animationFrameId: number | null = null
let isVisible = true
let nodes: Node[] = []
let pulses: Pulse[] = []
let width = 0
let height = 0

const initNodes = () => {
  if (!width || !height) return

  // Adaptive node count based on screen width
  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024
  const nodeCount = isMobile ? 18 : isTablet ? 30 : 45

  nodes = []
  pulses = []

  const colors = [
    'rgba(56, 189, 248, 0.9)', // cyan
    'rgba(96, 165, 250, 0.85)', // blue
    'rgba(129, 140, 248, 0.8)', // indigo
    'rgba(248, 250, 252, 0.95)', // white light
  ]

  for (let i = 0; i < nodeCount; i++) {
    const baseRadius = Math.random() * 2 + 1.5
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: baseRadius,
      baseRadius,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }
}

const resizeCanvas = () => {
  if (!canvasRef.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  width = rect.width
  height = rect.height

  canvasRef.value.width = width * dpr
  canvasRef.value.height = height * dpr

  const ctx = canvasRef.value.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
  }

  initNodes()
}

const render = () => {
  if (!canvasRef.value || !isVisible) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)

  const maxDistance = width < 640 ? 110 : 160

  // 1. Update & Draw Synaptic Connections
  for (let i = 0; i < nodes.length; i++) {
    const n1 = nodes[i]

    for (let j = i + 1; j < nodes.length; j++) {
      const n2 = nodes[j]
      const dx = n1.x - n2.x
      const dy = n1.y - n2.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < maxDistance) {
        const opacity = (1 - dist / maxDistance) * 0.35
        ctx.beginPath()
        ctx.moveTo(n1.x, n1.y)
        ctx.lineTo(n2.x, n2.y)
        ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`
        ctx.lineWidth = 0.85
        ctx.stroke()

        // Randomly spawn electrical pulse along connection
        if (Math.random() < 0.003 && pulses.length < 12) {
          pulses.push({
            fromNode: i,
            toNode: j,
            progress: 0,
            speed: 0.015 + Math.random() * 0.02,
          })
        }
      }
    }
  }

  // 2. Draw & Update Electrical Pulses (Synapse impulses)
  for (let p = pulses.length - 1; p >= 0; p--) {
    const pulse = pulses[p]
    pulse.progress += pulse.speed

    if (pulse.progress >= 1) {
      pulses.splice(p, 1)
      continue
    }

    const n1 = nodes[pulse.fromNode]
    const n2 = nodes[pulse.toNode]
    if (!n1 || !n2) continue

    const px = n1.x + (n2.x - n1.x) * pulse.progress
    const py = n1.y + (n2.y - n1.y) * pulse.progress

    ctx.beginPath()
    ctx.arc(px, py, 1.8, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.shadowColor = '#38bdf8'
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.shadowBlur = 0
  }

  // 3. Update & Draw Neuron Nodes
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]

    // Movement
    node.x += node.vx
    node.y += node.vy

    // Bounce off walls
    if (node.x <= 0 || node.x >= width) node.vx *= -1
    if (node.y <= 0 || node.y >= height) node.vy *= -1

    // Breathing pulse
    node.pulsePhase += node.pulseSpeed
    node.radius = node.baseRadius + Math.sin(node.pulsePhase) * 0.8

    // Outer glow
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)'
    ctx.fill()

    // Core node
    ctx.beginPath()
    ctx.arc(node.x, node.y, Math.max(1, node.radius), 0, Math.PI * 2)
    ctx.fillStyle = node.color
    ctx.fill()
  }

  animationFrameId = requestAnimationFrame(render)
}

let observer: IntersectionObserver | null = null

const handleVisibilityChange = () => {
  if (document.hidden) {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  } else if (isVisible) {
    if (!animationFrameId) render()
  }
}

onMounted(() => {
  if (process.client) {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      render()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      return
    }

    // Intersection observer to pause when scrolled out of view
    if (containerRef.value && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting
            if (isVisible && !animationFrameId) {
              render()
            } else if (!isVisible && animationFrameId) {
              cancelAnimationFrame(animationFrameId)
              animationFrameId = null
            }
          })
        },
        { threshold: 0.1 }
      )
      observer.observe(containerRef.value)
    } else {
      render()
    }
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', resizeCanvas)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    if (observer && containerRef.value) observer.unobserve(containerRef.value)
  }
})
</script>
