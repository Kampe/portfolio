<template>
  <article class="case-card">
    <div class="case-card-top">
      <span class="case-index">0{{ index + 1 }}</span>
      <span class="case-client">{{ study.client }}</span>
    </div>
    <h3>{{ study.title }}</h3>
    <p>{{ study.summary }}</p>
    <ul class="tag-list" aria-label="Technologies">
      <li v-for="item in study.stack.slice(0, 4)" :key="item">{{ item }}</li>
    </ul>
    <RouterLink class="text-link" :to="`/work/${study.slug}`">
      Read case study <ArrowUpRight :size="17" aria-hidden="true" />
    </RouterLink>
  </article>
</template>

<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import type { CaseStudy } from '../content/portfolio'

defineProps<{ study: CaseStudy; index: number }>()
</script>
