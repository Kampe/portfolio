<template>
  <section class="page-hero">
    <div class="container narrow-left">
      <p class="eyebrow">Expertise & approach</p>
      <h1>I build infrastructure for the people who have to use it.</h1>
      <p class="page-lede">The best platform is not a pile of tools. It is a clear operating model, encoded into automation, with enough visibility to improve safely.</p>
    </div>
  </section>

  <section class="section section-tight">
    <div class="container story-grid">
      <div class="portrait-mark" aria-hidden="true"><span>15</span><small>years in systems</small></div>
      <div class="prose-large">
        <p>I’m an infrastructure architect and platform engineer who has worked across connected devices, renewable energy, digital assets, and interactive entertainment.</p>
        <p>My work sits between product engineering and operations: internal developer platforms, Kubernetes foundations, observability, security, cloud migrations, and the delivery systems that connect them.</p>
        <p>I favor small interfaces, explicit ownership, useful defaults, and automation that can be understood by the next person. Reliability is a product capability, not a separate phase.</p>
      </div>
    </div>
  </section>

  <section class="section section-muted">
    <div class="container">
      <div class="section-heading"><p class="eyebrow">Capabilities</p><h2>Deep where it matters.</h2></div>
      <div class="capability-grid">
        <article v-for="(item, index) in expertise" :key="item.title">
          <span>0{{ index + 1 }}</span><h3>{{ item.title }}</h3><p>{{ item.copy }}</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container principles-layout">
      <div><p class="eyebrow">Working principles</p><h2>How I make decisions.</h2></div>
      <div class="principles-list">
        <article><h3>Start with the constraint.</h3><p>Find the actual delivery, reliability, security, or organizational bottleneck before selecting technology.</p></article>
        <article><h3>Design for the operator.</h3><p>Every system needs an understandable failure mode, ownership boundary, and path back to healthy.</p></article>
        <article><h3>Prefer paved roads to gates.</h3><p>Give teams safe defaults and fast self-service workflows instead of adding queues and policy theater.</p></article>
        <article><h3>Leave evidence.</h3><p>Tests, telemetry, runbooks, and decision records make infrastructure safer to change after the original author moves on.</p></article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSeo } from '../composables/useSeo'
import { expertise } from '../content/portfolio'

useSeo('Platform Engineering Expertise | Nick Kampe', 'Platform architecture, Kubernetes, cloud infrastructure, SRE, observability, security, and infrastructure automation built around engineering teams.', '/about')
</script>
