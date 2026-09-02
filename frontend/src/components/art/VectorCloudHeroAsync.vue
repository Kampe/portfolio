<template>
  <div ref="containerRef" class="w-full h-full">
    <Suspense>
      <template #default>
        <VectorCloudHeroLazy v-bind="$attrs" :palette="props.palette" @open-contact="$emit('open-contact')" />
      </template>
      <template #fallback>
        <!-- Minimal fallback UI - just a gradient, no Three.js loaded -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950"></div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import type { ColorPalette } from '../../utils/colorPalettes'

const props = defineProps<{ palette: ColorPalette }>()

const containerRef = ref<HTMLElement | null>(null)

// Lazy-loaded component - only imports VectorCloudHero when visible
const VectorCloudHeroLazy = defineAsyncComponent(() => import('./VectorCloudHero.vue'))

defineEmits<{
  'open-contact': []
}>()
</script>
