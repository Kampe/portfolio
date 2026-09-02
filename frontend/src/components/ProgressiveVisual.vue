<template>
  <div class="visual-shell" aria-hidden="true">
    <div class="visual-fallback"></div>
    <ClientOnly>
      <VectorCloudHero v-if="enabled" :interactive="interactive" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{ eager?: boolean; interactive?: boolean }>(), {
  eager: false,
  interactive: false,
})

const VectorCloudHero = defineAsyncComponent(() => import('./art/VectorCloudHero.vue'))
const enabled = ref(false)
let idleHandle: number | undefined

interface IdleWindow {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const wideEnough = window.matchMedia('(min-width: 900px)').matches
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (reduceMotion || connection?.saveData || (!props.eager && !wideEnough)) return

  if (props.eager) {
    enabled.value = true
    return
  }

  const idleWindow = window as unknown as IdleWindow
  if (idleWindow.requestIdleCallback) {
    idleHandle = idleWindow.requestIdleCallback(() => { enabled.value = true }, { timeout: 1200 })
  } else {
    idleHandle = globalThis.setTimeout(() => { enabled.value = true }, 600) as unknown as number
  }
})

onBeforeUnmount(() => {
  if (idleHandle === undefined) return
  const idleWindow = window as unknown as IdleWindow
  if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idleHandle)
  else globalThis.clearTimeout(idleHandle)
})
</script>
