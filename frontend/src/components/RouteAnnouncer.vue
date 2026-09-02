<template>
  <p class="sr-only" aria-live="polite" aria-atomic="true">{{ announcement }}</p>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const announcement = ref('')

watch(() => route.fullPath, async (_, previousPath) => {
  if (!previousPath) return
  await nextTick()
  if (typeof document === 'undefined') return
  announcement.value = document.title
  document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true })
})
</script>
