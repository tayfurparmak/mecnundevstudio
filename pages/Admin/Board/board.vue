<template>
  <KanbanBoard />
</template>

<script setup lang="ts">
import KanbanBoard from '~/components/Boards/KanbanBoard.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})
</script>