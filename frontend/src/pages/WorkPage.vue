<template>
  <section class="page-hero">
    <div class="container narrow-left">
      <p class="eyebrow">Selected work</p>
      <h1>Infrastructure that changed how teams deliver.</h1>
      <p class="page-lede">Platform, reliability, and cloud-modernization work across digital assets, renewable energy, connected products, and game development.</p>
    </div>
  </section>
  <section class="section section-tight">
    <div class="container">
      <h2 class="sr-only">Case studies</h2>
      <div class="case-grid case-grid-large">
        <CaseStudyCard v-for="(study, index) in caseStudies" :key="study.slug" :study="study" :index="index" />
      </div>
    </div>
    <p class="container disclosure">Selected work only. Some implementation details are generalized to respect confidentiality.</p>
  </section>
</template>

<script setup lang="ts">
import CaseStudyCard from '../components/CaseStudyCard.vue'
import { useSeo } from '../composables/useSeo'
import { caseStudies } from '../content/portfolio'

useSeo('Selected Platform Engineering Work | Nick Kampe', 'Case studies in internal developer platforms, multi-cloud reliability, Kubernetes, cloud migrations, and connected-device infrastructure.', '/work')
</script>
