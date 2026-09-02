<template>
  <section class="not-found"><div class="container"><p class="eyebrow">404 · Route not found</p><h1>This path leads nowhere.</h1><p>The system is healthy; this address is not.</p><RouterLink class="button button-primary" to="/">Return home</RouterLink></div></section>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
useHead({ title: 'Page not found | Nick Kampe', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
</script>
