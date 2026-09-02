<template>
  <section class="page-hero"><div class="container narrow-left"><p class="eyebrow">Privacy</p><h1>A small site should have a small data footprint.</h1><p class="page-lede">This site does not sell personal information or use advertising trackers.</p></div></section>
  <section class="section section-tight"><div class="container legal-copy">
    <h2>Analytics</h2><p>Google Analytics loads only after you choose “Allow analytics.” It is configured without an automatic page view and is used to understand aggregate page usage. If you decline, no analytics script is loaded. Your choice is stored in your browser.</p>
    <h2>Contact form</h2><p>When you submit the contact form, the information you provide is sent to the site owner through Formspree so the message can be answered. Do not include secrets or sensitive credentials.</p>
    <h2>Infrastructure logs</h2><p>The hosting provider may temporarily process standard request information for security, reliability, and abuse prevention.</p>
    <h2>Your controls</h2><p>You can reset your choice here at any time. Global Privacy Control and Do Not Track signals prevent analytics initialization.</p>
    <button class="button button-secondary" type="button" @click="resetConsent">Reset analytics choice</button>
    <p class="disclosure">Last updated September 2, 2026. This summary is provided for transparency and is not legal advice.</p>
  </div></section>
</template>

<script setup lang="ts">
import { useSeo } from '../composables/useSeo'
useSeo('Privacy | Nick Kampe', 'Privacy information for nickkampe.com, including optional analytics and contact form data handling.', '/privacy')

function resetConsent() {
  localStorage.removeItem('portfolio-analytics-consent')
  location.reload()
}
</script>
