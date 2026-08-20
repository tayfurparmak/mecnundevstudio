<template>
  <EditorPage />
</template>

<script setup lang="ts">
import EditorPage from './editor.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})
</script>