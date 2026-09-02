<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink class="wordmark" to="/" aria-label="Nick Kampe, home">
        <span aria-hidden="true">NK</span>
        <span class="wordmark-copy">Nick Kampe<small>Platform architect</small></span>
      </RouterLink>
      <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="site-navigation" @click="menuOpen = !menuOpen">
        <Menu v-if="!menuOpen" :size="22" aria-hidden="true" />
        <X v-else :size="22" aria-hidden="true" />
        <span class="sr-only">{{ menuOpen ? 'Close navigation' : 'Open navigation' }}</span>
      </button>
      <nav id="site-navigation" :class="['site-nav', { open: menuOpen }]" aria-label="Primary">
        <RouterLink to="/work" @click="closeMenu">Work</RouterLink>
        <RouterLink to="/about" @click="closeMenu">Expertise</RouterLink>
        <RouterLink to="/resume" @click="closeMenu">Resume</RouterLink>
        <RouterLink to="/lab" @click="closeMenu">Lab</RouterLink>
        <RouterLink class="nav-cta" to="/contact" @click="closeMenu">Contact</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const menuOpen = ref(false)
const closeMenu = () => { menuOpen.value = false }
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMenu()
}
onMounted(() => document.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))
</script>
