<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <p class="eyebrow">Build the platform, unblock the team.</p>
        <p class="footer-heading">Complex infrastructure should feel simple to use.</p>
      </div>
      <div class="footer-links">
        <RouterLink to="/contact">Start a conversation</RouterLink>
        <RouterLink to="/privacy">Privacy</RouterLink>
        <a v-for="link in socialLinks" :key="link.href" :href="link.href" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
      </div>
    </div>
    <div class="container footer-base">
      <span>© {{ new Date().getFullYear() }} Nick Kampe</span>
      <span>Designed and engineered in Missouri.</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { socialLinks } from '../content/portfolio'
</script>
