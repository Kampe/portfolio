<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <SiteHeader />
  <RouteAnnouncer />
  <main id="main-content" tabindex="-1">
    <RouterView />
  </main>
  <SiteFooter />
  <PrivacyControls />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import PrivacyControls from './components/PrivacyControls.vue'
import RouteAnnouncer from './components/RouteAnnouncer.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
</script>
