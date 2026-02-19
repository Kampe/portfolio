<template>
  <div ref="containerRef" class="w-full h-full">
    <Suspense>
      <template #default>
        <VectorCloudHeroLazy v-bind="$attrs" @open-contact="$emit('open-contact')" />
      </template>
      <template #fallback>
        <!-- Minimal fallback UI - just a gradient, no Three.js loaded -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950" />
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from 'vue'

const containerRef = ref<HTMLElement | null>(null)

// Lazy-loaded component - only imports VectorCloudHero when visible
const VectorCloudHeroLazy = defineAsyncComponent(async () => {
  // Only load when container is visible in viewport
  return new Promise((resolve) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Visible! Load the component
          observer.disconnect()
          import('./VectorCloudHero.vue').then((module) => {
            resolve(module)
          })
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.value) {
      observer.observe(containerRef.value)
    }
  })
})

defineEmits<{
  'open-contact': []
}>()
</script>
