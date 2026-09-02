<template>
  <aside v-if="visible" class="privacy-banner" aria-labelledby="privacy-title">
    <div>
      <p id="privacy-title" class="privacy-title">Privacy, by choice</p>
      <p>I use optional, anonymized analytics to understand which pages help. No advertising profiles.</p>
    </div>
    <div class="privacy-actions">
      <button class="button button-quiet" type="button" @click="decide(false)">Decline</button>
      <button class="button button-primary" type="button" @click="decide(true)">Allow analytics</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { initializeGoogleAnalytics, trackPageView } from '../utils/analytics'

const consentKey = 'portfolio-analytics-consent'
const visible = ref(false)

onMounted(() => {
  const choice = localStorage.getItem(consentKey)
  if (choice === 'allow' && initializeGoogleAnalytics()) trackPageView(`${location.pathname}${location.search}`)
  else if (choice === null) visible.value = true
})

function decide(allow: boolean) {
  localStorage.setItem(consentKey, allow ? 'allow' : 'decline')
  visible.value = false
  if (allow && initializeGoogleAnalytics()) trackPageView(`${location.pathname}${location.search}`)
}
</script>
