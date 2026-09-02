<template>
  <section class="hero-section">
    <ProgressiveVisual />
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow"><span class="status-dot"></span> Platform engineering · Cloud infrastructure · SRE</p>
        <h1>I build self-service platforms that let engineering teams <em>ship.</em></h1>
        <p class="hero-lede">Fifteen years turning complex cloud infrastructure into secure, observable systems that teams can operate without bottlenecks.</p>
        <div class="button-row">
          <RouterLink class="button button-primary" to="/work">See selected work <ArrowRight :size="18" /></RouterLink>
          <RouterLink class="button button-secondary" to="/contact">Discuss a project</RouterLink>
        </div>
      </div>
      <div class="hero-note">
        <span>Currently</span>
        <p>Staff DevOps Engineer at Yuga Labs, building paved roads for product teams.</p>
      </div>
    </div>
  </section>

  <section class="proof-strip" aria-label="Career highlights">
    <div class="container proof-grid">
      <div><strong>15+</strong><span>years building production systems</span></div>
      <div><strong>50+</strong><span>engineers enabled with self-service</span></div>
      <div><strong>3</strong><span>major clouds operated at scale</span></div>
      <div><strong>Edge → cloud</strong><span>systems designed end to end</span></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-heading split-heading">
        <div><p class="eyebrow">Selected work</p><h2>Systems with leverage.</h2></div>
        <p>Details are generalized where needed, but the problems, responsibilities, and outcomes are real.</p>
      </div>
      <div class="case-grid">
        <CaseStudyCard v-for="(study, index) in caseStudies" :key="study.slug" :study="study" :index="index" />
      </div>
    </div>
  </section>

  <section class="section section-muted">
    <div class="container expertise-layout">
      <div class="section-heading sticky-heading">
        <p class="eyebrow">What I do</p>
        <h2>Make the right way the easy way.</h2>
        <p>Architecture, automation, and operating practices designed together—not bolted on after launch.</p>
        <RouterLink class="text-link" to="/about">Explore expertise <ArrowRight :size="17" /></RouterLink>
      </div>
      <div class="expertise-list">
        <article v-for="(item, index) in expertise" :key="item.title">
          <span>0{{ index + 1 }}</span><div><h3>{{ item.title }}</h3><p>{{ item.copy }}</p></div>
        </article>
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="container cta-card">
      <p class="eyebrow">Have a hard infrastructure problem?</p>
      <h2>Let’s make it operable.</h2>
      <RouterLink class="button button-primary" to="/contact">Start a conversation <ArrowUpRight :size="18" /></RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import CaseStudyCard from '../components/CaseStudyCard.vue'
import ProgressiveVisual from '../components/ProgressiveVisual.vue'
import { caseStudies, expertise } from '../content/portfolio'
import { useSeo } from '../composables/useSeo'

useSeo('Nick Kampe | Platform Architect & Infrastructure Engineer', 'I build self-service cloud platforms, reliable Kubernetes systems, and infrastructure automation that helps engineering teams ship.')
</script>
