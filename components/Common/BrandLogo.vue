<template>
  <div class="flex items-center gap-3 select-none group">
    <!-- Geometric SVG Logo Symbol -->
    <div
      :class="[
        'relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105',
        sizeClasses.iconContainer
      ]"
    >
      <!-- Ambient Neural Glow Behind Symbol -->
      <div class="absolute inset-0 bg-sky-500/25 rounded-2xl blur-md group-hover:bg-sky-400/40 transition-all"></div>

      <!-- Exact Composite Symbol SVG -->
      <svg
        :class="sizeClasses.svg"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Outer Glowing Background Shape -->
        <rect width="100" height="100" rx="20" fill="#080B10" fill-opacity="0.95" />
        <rect width="100" height="100" rx="20" stroke="#1E293B" stroke-width="1.5" />

        <!-- Left White Pillar of 'M' -->
        <path
          d="M20 80V25L42 55V80H34V45L26 35V80H20Z"
          fill="#F8FAFC"
        />

        <!-- Diagonal & Right Blue Wing of 'M' with Gradient -->
        <path
          d="M40 25L78 60V80H70V65L35 32V25H40Z"
          fill="url(#blue_gradient)"
        />
        <path
          d="M78 25V80H70V35L48 55L42 48L68 25H78Z"
          fill="url(#neon_gradient)"
        />

        <!-- Dart & Target Symbol (Bottom Left) -->
        <circle cx="34" cy="66" r="14" stroke="#F8FAFC" stroke-width="2.5" fill="#080B10" />
        <circle cx="34" cy="66" r="9" stroke="#2563EB" stroke-width="2" />
        <circle cx="34" cy="66" r="4" fill="#38BDF8" />
        <!-- Dart Arrow hitting center -->
        <path d="M48 52L36 64" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" />
        <path d="M46 48L52 54L48 56L44 52L46 48Z" fill="#2563EB" />

        <!-- Code Symbol '</>' (Bottom Right) -->
        <path
          d="M62 68L56 73L62 78M74 68L80 73L74 78M69 66L67 80"
          stroke="#38BDF8"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Gradient Definitions -->
        <defs>
          <linearGradient id="blue_gradient" x1="35" y1="25" x2="78" y2="80" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2563EB" />
            <stop offset="1" stop-color="#1E40AF" />
          </linearGradient>
          <linearGradient id="neon_gradient" x1="42" y1="25" x2="78" y2="80" gradientUnits="userSpaceOnUse">
            <stop stop-color="#38BDF8" />
            <stop offset="1" stop-color="#2563EB" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Typography (Hidden in icon-only mode) -->
    <div v-if="variant !== 'icon'" class="flex flex-col">
      <!-- Main Title: MECNUNUM -->
      <div class="flex items-center gap-1.5 leading-none">
        <span class="font-black tracking-wider text-white uppercase font-sans transition-colors" :class="sizeClasses.title">
          MECNUNUM
        </span>
      </div>

      <!-- Accent Separator Bar -->
      <div class="w-full h-0.5 bg-gradient-to-r from-sky-400 via-blue-600 to-transparent my-1 rounded-full opacity-90"></div>

      <!-- Subtitle Tagline: LEARNING × AI × TECHNOLOGY -->
      <span
        v-if="showTagline"
        :class="[
          'font-semibold tracking-widest uppercase font-mono text-sky-400/90',
          sizeClasses.subtitle
        ]"
      >
        LEARNING × AI × TECHNOLOGY
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    variant?: 'full' | 'icon'
    showTagline?: boolean
  }>(),
  {
    size: 'md',
    variant: 'full',
    showTagline: true,
  }
)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        iconContainer: 'w-8 h-8',
        svg: 'w-8 h-8',
        title: 'text-sm',
        subtitle: 'text-[7px]',
      }
    case 'lg':
      return {
        iconContainer: 'w-14 h-14',
        svg: 'w-14 h-14',
        title: 'text-2xl',
        subtitle: 'text-[10px]',
      }
    case 'md':
    default:
      return {
        iconContainer: 'w-10 h-10',
        svg: 'w-10 h-10',
        title: 'text-lg',
        subtitle: 'text-[8px]',
      }
  }
})
</script>
