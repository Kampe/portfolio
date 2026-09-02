<template>
  <section class="page-hero contact-hero">
    <div class="container narrow-left">
      <p class="eyebrow">Contact</p>
      <h1>Tell me what is getting in the way.</h1>
      <p class="page-lede">Share the constraint, the team, and what a good outcome looks like. I’ll respond with useful next steps—usually within two business days.</p>
    </div>
  </section>
  <section class="section section-tight">
    <div class="container contact-layout">
      <div class="contact-aside">
        <p class="eyebrow">Good fit</p>
        <ul class="fit-list">
          <li>Platform architecture and internal developer platforms</li>
          <li>Kubernetes, cloud, and GitOps modernization</li>
          <li>Reliability, observability, and incident readiness</li>
          <li>Security and infrastructure automation</li>
        </ul>
        <div class="social-row">
          <a v-for="link in socialLinks" :key="link.href" :href="link.href" target="_blank" rel="noopener noreferrer">{{ link.label }} <ArrowUpRight :size="15" /></a>
        </div>
      </div>
      <div class="form-card">
        <div v-if="status === 'success'" class="success-state" role="status" tabindex="-1">
          <CheckCircle :size="42" aria-hidden="true" />
          <h2>Message received.</h2>
          <p>Thanks for the context. I’ll get back to you shortly.</p>
          <button class="button button-secondary" type="button" @click="resetForm">Send another</button>
        </div>
        <form v-else @submit.prevent="submitForm">
          <div class="form-heading"><p class="eyebrow">Project brief</p><p>Fields marked <span aria-hidden="true">*</span><span class="sr-only">required</span> are required.</p></div>
          <div class="field-grid">
            <div class="field"><label for="contact-name">Name <span aria-hidden="true">*</span></label><input id="contact-name" v-model.trim="form.name" name="name" autocomplete="name" minlength="2" maxlength="80" required /></div>
            <div class="field"><label for="contact-email">Email <span aria-hidden="true">*</span></label><input id="contact-email" v-model.trim="form.email" name="email" type="email" autocomplete="email" maxlength="254" required /></div>
          </div>
          <div class="field"><label for="contact-subject">What are you working on? <span aria-hidden="true">*</span></label><input id="contact-subject" v-model.trim="form.subject" name="subject" minlength="3" maxlength="120" placeholder="Platform modernization, reliability review…" required /></div>
          <div class="field"><label for="contact-message">What would a good outcome look like? <span aria-hidden="true">*</span></label><textarea id="contact-message" v-model.trim="form.message" name="message" minlength="20" maxlength="5000" rows="7" required></textarea><span class="field-hint">20–5,000 characters</span></div>
          <div class="honeypot" aria-hidden="true"><label for="contact-website">Website</label><input id="contact-website" v-model="form.website" name="website" tabindex="-1" autocomplete="off" /></div>
          <p v-if="status === 'error'" class="form-error" role="alert">{{ errorMessage }}</p>
          <button id="contact-submit" class="button button-primary submit-button" type="submit" :disabled="status === 'submitting'">
            <LoaderCircle v-if="status === 'submitting'" class="spin" :size="18" aria-hidden="true" />
            <Send v-else :size="18" aria-hidden="true" />
            {{ status === 'submitting' ? 'Sending…' : 'Send project brief' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight, CheckCircle, LoaderCircle, Send } from 'lucide-vue-next'
import { nextTick, reactive, ref } from 'vue'
import { useSeo } from '../composables/useSeo'
import { socialLinks } from '../content/portfolio'
import { trackFormSubmission } from '../utils/analytics'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'
const emptyForm = () => ({ name: '', email: '', subject: '', message: '', website: '' })
const form = reactive(emptyForm())
const status = ref<FormStatus>('idle')
const errorMessage = ref('')

useSeo('Contact Nick Kampe | Platform Engineering', 'Discuss a platform engineering, Kubernetes, cloud infrastructure, reliability, observability, or automation project with Nick Kampe.', '/contact')

async function submitForm() {
  status.value = 'submitting'
  errorMessage.value = ''
  try {
    const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const result = await response.json() as { success?: boolean; message?: string; error?: string }
    if (!response.ok || !result.success) {
      status.value = 'error'
      errorMessage.value = result.error || result.message || 'Unable to send your message. Please try again.'
      trackFormSubmission('contact_form', false)
      return
    }
    status.value = 'success'
    trackFormSubmission('contact_form', true)
    await nextTick()
    document.querySelector<HTMLElement>('.success-state')?.focus()
  } catch {
    status.value = 'error'
    errorMessage.value = 'Unable to send your message. Check your connection and try again.'
    trackFormSubmission('contact_form', false)
  }
}

function resetForm() {
  Object.assign(form, emptyForm())
  status.value = 'idle'
}
</script>
