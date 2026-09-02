<template>
  <template v-if="study">
    <article>
      <header class="page-hero case-hero">
        <div class="container narrow-left">
          <RouterLink class="back-link" to="/work"><ArrowLeft :size="17" /> All work</RouterLink>
          <p class="eyebrow">{{ study.client }} · Case study</p>
          <h1>{{ study.title }}</h1>
          <p class="page-lede">{{ study.summary }}</p>
          <ul class="tag-list"><li v-for="item in study.stack" :key="item">{{ item }}</li></ul>
        </div>
      </header>
      <div class="container study-layout section section-tight">
        <div class="study-meta"><p class="eyebrow">Engagement</p><p>Platform architecture, delivery systems, reliability, and team enablement.</p></div>
        <div class="study-content">
          <section><p class="eyebrow">The challenge</p><h2>Creating room to move.</h2><p>{{ study.challenge }}</p></section>
          <section><p class="eyebrow">The approach</p><h2>Standards encoded in the platform.</h2><ol class="numbered-list"><li v-for="item in study.approach" :key="item">{{ item }}</li></ol></section>
          <section><p class="eyebrow">The outcome</p><h2>More autonomy, stronger guardrails.</h2><ul class="outcome-list"><li v-for="item in study.outcomes" :key="item"><Check :size="20" />{{ item }}</li></ul></section>
        </div>
      </div>
    </article>
    <section class="cta-section"><div class="container cta-card"><p class="eyebrow">Working on something similar?</p><h2>Let’s compare notes.</h2><RouterLink class="button button-primary" to="/contact">Get in touch <ArrowUpRight :size="18" /></RouterLink></div></section>
  </template>
  <NotFoundPage v-else />
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useSeo } from '../composables/useSeo'
import { caseStudies } from '../content/portfolio'
import NotFoundPage from './NotFoundPage.vue'

const route = useRoute()
const study = computed(() => caseStudies.find((item) => item.slug === route.params.slug))
const title = study.value ? `${study.value.title} | Nick Kampe` : 'Work not found | Nick Kampe'
const description = study.value?.summary ?? 'The requested case study could not be found.'
useSeo(title, description, route.path)
</script>
