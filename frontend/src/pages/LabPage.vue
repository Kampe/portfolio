<template>
  <section class="lab-page">
    <ProgressiveVisual v-if="started" eager interactive />
    <div class="container lab-copy">
      <p class="eyebrow">Systems lab</p>
      <h1>A small experiment in emergent motion.</h1>
      <p>This WebGL study uses a deterministic particle field, pauses when the tab is hidden, and caps device-pixel density. It only loads when you ask for it.</p>
      <button v-if="!started" class="button button-primary" type="button" @click="started = true"><Play :size="18" /> Start experience</button>
      <p v-else class="lab-hint">Move your pointer to influence the field. Reduced-motion and data-saver preferences are respected.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Play } from 'lucide-vue-next'
import { ref } from 'vue'
import ProgressiveVisual from '../components/ProgressiveVisual.vue'
import { useSeo } from '../composables/useSeo'

const started = ref(false)
useSeo('Generative Systems Lab | Nick Kampe', 'An optional, performance-conscious WebGL particle experiment by platform engineer Nick Kampe.', '/lab')
</script>
