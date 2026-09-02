<template>
  <section class="page-hero resume-hero">
    <div class="container resume-title-row">
      <div class="narrow-left"><p class="eyebrow">Resume</p><h1>Fifteen years of building and operating systems.</h1></div>
      <RouterLink class="button button-secondary" to="/contact">Request a PDF</RouterLink>
    </div>
  </section>

  <section class="section section-tight">
    <div class="container resume-layout">
      <div class="resume-sidebar">
        <section><p class="eyebrow">Core</p><p>AWS · GCP · Azure<br />Kubernetes · GitOps<br />Terraform · Crossplane<br />Observability · SRE<br />Go · Python · TypeScript</p></section>
        <section><p class="eyebrow">Education</p><p>University of Missouri–Columbia<br /><span>Computer Science & IT coursework, 2008–2012</span></p></section>
      </div>
      <div>
        <div class="resume-summary">
          <p class="eyebrow">Profile</p>
          <p>Platform architect and automation engineer specializing in internal developer platforms, production Kubernetes, infrastructure as code, cloud modernization, and reliable operating models across AWS, Google Cloud, Azure, edge, and on-premises environments.</p>
        </div>
        <ol class="timeline">
          <li v-for="job in experience" :key="`${job.company}-${job.period}`">
            <span class="timeline-dot"></span>
            <div class="timeline-meta"><span>{{ job.period }}</span><strong>{{ job.company }}</strong></div>
            <div><h2>{{ job.role }}</h2><p>{{ job.summary }}</p></div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useSeo } from '../composables/useSeo'
import { experience } from '../content/portfolio'

useSeo('Resume | Nick Kampe, Platform Architect', 'Experience leading platform engineering, SRE, cloud infrastructure, IoT, Kubernetes, GitOps, and automation at Yuga Labs, Kraken, EDF Renewables, and Emerson.', '/resume')
</script>
