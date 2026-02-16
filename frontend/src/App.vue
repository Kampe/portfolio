<template>
  <div id="app" class="fixed inset-0 bg-black text-white overflow-hidden">
    <!-- Vector Cloud Hero -->
    <VectorCloudHero @open-contact="activeSection = 'contact'" />

    <!-- Header + Navigation (overlay) -->
    <header class="fixed top-0 left-0 right-0 z-30 flex justify-end items-center px-4 md:px-8 py-4 md:py-6 pointer-events-none">
      <nav ref="navRef" class="flex gap-2 md:gap-4 lg:gap-8 text-xs tracking-widest uppercase font-semibold pointer-events-auto" style="opacity: 0;">
        <button ref="navAboutRef" @click="activeSection = 'about'" class="relative text-white/80 hover:text-white transition-colors duration-300 group">
          <span>ABOUT</span>
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
        </button>
        <button ref="navSkillsRef" @click="activeSection = 'skills'" class="relative text-white/80 hover:text-white transition-colors duration-300 group">
          <span>SKILLS</span>
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
        </button>
        <button ref="navResumeRef" @click="activeSection = 'resume'" class="relative text-white/80 hover:text-white transition-colors duration-300 group">
          <span>RESUME</span>
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
        </button>
        <button ref="navContactRef" @click="activeSection = 'contact'" class="relative text-white/80 hover:text-white transition-colors duration-300 group">
          <span>CONTACT</span>
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
        </button>
      </nav>
    </header>

    <!-- Modal Overlay -->
    <Teleport to="body" v-if="activeSection">
      <div class="fixed inset-0 bg-black/80 backdrop-blur-md z-40 pointer-events-auto" @click.self="activeSection = null"></div>

      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none overflow-y-auto">
        <div class="relative w-full md:max-w-4xl md:h-auto bg-slate-950/95 backdrop-blur-xl border md:border border-cyan-500/20 rounded-none md:rounded-xl p-6 md:p-12 pb-12 md:pb-16 shadow-none md:shadow-2xl shadow-none md:shadow-cyan-900/20 pointer-events-auto flex flex-col my-8 md:my-0">
          <!-- Gradient border effect -->
          <div class="hidden md:block absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 pointer-events-none"></div>

          <!-- Close Button -->
          <button @click="activeSection = null" class="absolute top-4 md:top-6 right-4 md:right-6 z-20 text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-2xl font-light hover:scale-110 transform duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Content -->
          <div class="relative z-10 min-h-full">
          <!-- About -->
          <template v-if="activeSection === 'about'">
            <div>
              <h2 class="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">About</h2>
              <div class="w-20 md:w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6 md:mb-8"></div>
            </div>
            <div class="space-y-4 md:space-y-5 text-white/85 leading-relaxed mt-6 md:mt-8">
              <p class="text-xs md:text-sm">Staff DevOps Engineer specializing in platform engineering, cloud infrastructure automation, and Kubernetes-native solutions. 15+ years architecting and operating distributed systems at scale across GCP, AWS, and Azure using open-source technology and infrastructure-as-code.</p>
              <p class="text-xs md:text-sm">Expert in Internal Development Platforms (IDPs), GitOps workflows (ArgoCD, Flux), service mesh architecture (Istio), and observability-first design (Prometheus, Grafana, Loki). Currently available for DevOps automation, infrastructure optimization, and platform engineering contract engagements.</p>
              <p class="text-xs md:text-sm">Proven track record implementing enterprise-grade CI/CD pipelines, cloud migrations, container orchestration, and automated infrastructure deployments. Leveraging AI/ML tools and modern LLMs to accelerate automation and drive infrastructure innovation.</p>
            </div>
          </template>


          <!-- Skills -->
          <template v-if="activeSection === 'skills'">
            <div>
              <h2 class="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Skills</h2>
              <div class="w-20 md:w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6 md:mb-8"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mt-6 md:mt-8">
              <div class="p-2 md:p-3 rounded-lg border border-cyan-500/20 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-cyan-400 font-semibold mb-1 text-xs uppercase tracking-wide">Cloud</h3>
                <p class="text-white/75 text-xs leading-relaxed">AWS, GCP, Azure, DigitalOcean, Hetzner, Civo, Vercel, Railway</p>
              </div>
              <div class="p-2 md:p-3 rounded-lg border border-blue-500/20 bg-slate-900/40 hover:border-blue-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-blue-400 font-semibold mb-1 text-xs uppercase tracking-wide">K8s</h3>
                <p class="text-white/75 text-xs leading-relaxed">Kubernetes, Docker, Istio, Helm, Kustomize, Linkerd</p>
              </div>
              <div class="p-2 md:p-3 rounded-lg border border-purple-500/20 bg-slate-900/40 hover:border-purple-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-purple-400 font-semibold mb-1 text-xs uppercase tracking-wide">IaC</h3>
                <p class="text-white/75 text-xs leading-relaxed">Terraform, Ansible, Packer, Vault</p>
              </div>
              <div class="p-2 md:p-3 rounded-lg border border-pink-500/20 bg-slate-900/40 hover:border-pink-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-pink-400 font-semibold mb-1 text-xs uppercase tracking-wide">Languages</h3>
                <p class="text-white/75 text-xs leading-relaxed">Go, Rust, Python, TypeScript, Bash</p>
              </div>
              <div class="p-2 md:p-3 rounded-lg border border-red-500/20 bg-slate-900/40 hover:border-red-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-red-400 font-semibold mb-1 text-xs uppercase tracking-wide">Databases</h3>
                <p class="text-white/75 text-xs leading-relaxed">PostgreSQL, MongoDB, Redis, ElasticSearch</p>
              </div>
              <div class="p-2 md:p-3 rounded-lg border border-amber-500/20 bg-slate-900/40 hover:border-amber-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-amber-400 font-semibold mb-1 text-xs uppercase tracking-wide">GitOps</h3>
                <p class="text-white/75 text-xs leading-relaxed">ArgoCD, GitHub Actions, Tekton, Flux</p>
              </div>
              <div class="p-2 md:p-3 rounded-lg border border-emerald-500/20 bg-slate-900/40 hover:border-emerald-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-emerald-400 font-semibold mb-1 text-xs uppercase tracking-wide">DevTools</h3>
                <p class="text-white/75 text-xs leading-relaxed">Linux, macOS, VS Code, Vim, Docker</p>
              </div>
              <div class="p-2 md:p-3 rounded-lg border border-cyan-500/20 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-cyan-400 font-semibold mb-1 text-xs uppercase tracking-wide">Observability</h3>
                <p class="text-white/75 text-xs leading-relaxed">Prometheus, Grafana, Loki, Tempo</p>
              </div>
              <div class="p-2 md:p-3 rounded-lg border border-violet-500/20 bg-slate-900/40 hover:border-violet-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-violet-400 font-semibold mb-1 text-xs uppercase tracking-wide">Frontend</h3>
                <p class="text-white/75 text-xs leading-relaxed">React, Vue, Next.js, GraphQL</p>
              </div>
              <div class="p-2 md:p-3 rounded-lg border border-indigo-500/20 bg-slate-900/40 hover:border-indigo-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-indigo-400 font-semibold mb-1 text-xs uppercase tracking-wide">Hardware</h3>
                <p class="text-white/75 text-xs leading-relaxed">Raspberry Pi, Arduino, 3D Printing</p>
              </div>
              <div class="p-2 md:p-3 rounded-lg border border-pink-500/20 bg-slate-900/40 hover:border-pink-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-pink-400 font-semibold mb-1 text-xs uppercase tracking-wide">Creative</h3>
                <p class="text-white/75 text-xs leading-relaxed">Unreal, Blender, Game Dev</p>
              </div>
              <div class="p-2 md:p-3 rounded-lg border border-orange-500/20 bg-slate-900/40 hover:border-orange-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-orange-400 font-semibold mb-1 text-xs uppercase tracking-wide">IoT</h3>
                <p class="text-white/75 text-xs leading-relaxed">AWS IoT, Home Assistant</p>
              </div>
              <div class="p-2 md:p-3 rounded-lg border border-yellow-500/20 bg-slate-900/40 hover:border-yellow-500/40 hover:bg-slate-900/60 transition-all duration-300">
                <h3 class="text-yellow-400 font-semibold mb-1 text-xs uppercase tracking-wide">AI/LLMs</h3>
                <p class="text-white/75 text-xs leading-relaxed">Claude, OpenAI, LangChain</p>
              </div>
            </div>
          </template>

          <!-- Resume -->
          <template v-if="activeSection === 'resume'">
            <div>
              <h2 class="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Resume</h2>
              <div class="w-20 md:w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6 md:mb-8"></div>
            </div>
            <div class="space-y-6 md:space-y-8 mt-6 md:mt-8">
              <!-- Professional Summary -->
              <div>
                <h3 class="text-white/90 font-semibold mb-3 uppercase tracking-wider text-xs md:text-sm">Staff DevOps Engineer & Platform Architect</h3>
                <p class="text-white/80 text-xs md:text-sm leading-relaxed">Specialist in designing and implementing enterprise DevOps solutions, Internal Development Platforms (IDPs), and cloud infrastructure automation. Deep expertise in Kubernetes, infrastructure-as-code, and GitOps workflows across AWS, GCP, and Azure. Experienced in delivering rapid infrastructure transformations for startups and enterprises. Available for contract-based DevOps automation, platform engineering, and infrastructure optimization engagements leveraging modern tooling and AI-driven workflows.</p>
              </div>

              <!-- Work Experience -->
              <div>
                <h3 class="text-white/90 font-semibold mb-3 md:mb-4 uppercase tracking-wider text-xs md:text-sm">Professional Experience</h3>
                <div class="space-y-3 md:space-y-4">
                  <div class="p-3 md:p-4 rounded-lg border border-cyan-500/10 bg-slate-900/40 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all duration-300">
                    <h4 class="text-cyan-400 font-semibold text-xs md:text-sm">Staff DevOps Engineer</h4>
                    <p class="text-xs text-slate-400 mt-1">Yuga Labs · May 2023 – Present</p>
                    <p class="text-white/80 mt-2 text-xs md:text-sm leading-relaxed">Spearheading platform engineering at the world's largest NFT metaverse company. Designed and implemented Internal Development Platform (IDP) using GitOps with Crossplane, ArgoCD, Backstage, and LGTM stack. Transitioned legacy systems to cloud-native Kubernetes. Oversaw global DNS management for all company IP and brands. Managed Perforce Helix Core and Unreal Engine utilities supporting game development pipelines.</p>
                  </div>
                  <div class="p-3 md:p-4 rounded-lg border border-blue-500/10 bg-slate-900/40 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300">
                    <h4 class="text-blue-400 font-semibold text-xs md:text-sm">Manager, Site Reliability/Core Infrastructure</h4>
                    <p class="text-xs text-slate-400 mt-1">Payward Inc (Kraken Digital Asset Exchange) · Sept 2022 – May 2023</p>
                    <p class="text-white/80 mt-2 text-xs md:text-sm leading-relaxed">Enhanced organizational security posture through robust policies and risk-based approaches. Led team of engineers coordinating with multiple stakeholders. Formulated technical triage and remediation procedures with emphasis on automation. Elevated infrastructure visibility and integrated open-source observability tools.</p>
                  </div>
                  <div class="p-3 md:p-4 rounded-lg border border-purple-500/10 bg-slate-900/40 hover:border-purple-500/30 hover:bg-slate-900/60 transition-all duration-300">
                    <h4 class="text-purple-400 font-semibold text-xs md:text-sm">Principal Site Reliability Engineer</h4>
                    <p class="text-xs text-slate-400 mt-1">Powerflex Systems (EDF Renewables) · April 2021 – Aug 2022</p>
                    <p class="text-white/80 mt-2 text-xs md:text-sm leading-relaxed">Transformed diverse teams into lean agile using Kanban and XP. Mentored organization-wide on 12FA, TDD/BDD, GitOps, distributed tracing, and chaos engineering. Managed SRE team leading ceremonies and roadmapping product delivery to internal customers.</p>
                  </div>
                  <div class="p-3 md:p-4 rounded-lg border border-pink-500/10 bg-slate-900/40 hover:border-pink-500/30 hover:bg-slate-900/60 transition-all duration-300">
                    <h4 class="text-pink-400 font-semibold text-xs md:text-sm">Senior Site Reliability Engineer</h4>
                    <p class="text-xs text-slate-400 mt-1">Powerflex Systems · Sept 2019 – April 2021</p>
                    <p class="text-white/80 mt-2 text-xs md:text-sm leading-relaxed">Established SRE practices organization-wide. Deployed multistage containerized environments across GKE, EKS, and AKS with Istio, Vault, and ArgoCD. Identified cloud waste and migrated to cost-reduced cloud-native solutions.</p>
                  </div>
                  <div class="p-3 md:p-4 rounded-lg border border-amber-500/10 bg-slate-900/40 hover:border-amber-500/30 hover:bg-slate-900/60 transition-all duration-300">
                    <h4 class="text-amber-400 font-semibold text-xs md:text-sm">Senior Software Engineer</h4>
                    <p class="text-xs text-slate-400 mt-1">EDF Renewables · Sept 2018 – Sept 2019</p>
                    <p class="text-white/80 mt-2 text-xs md:text-sm leading-relaxed">Architected distributed systems for renewable energy monitoring across on-prem, edge, and cloud-native infrastructure. Developed "EDF Edge Industrial IoT Cloud Platform." Built ML pipelines and continuous delivery systems. Presented AWS solutions at Re:Invent 2018.</p>
                  </div>
                  <div class="p-3 md:p-4 rounded-lg border border-red-500/10 bg-slate-900/40 hover:border-red-500/30 hover:bg-slate-900/60 transition-all duration-300">
                    <h4 class="text-red-400 font-semibold text-xs md:text-sm">Agile Engineer</h4>
                    <p class="text-xs text-slate-400 mt-1">Emerson Climate Technologies · May 2016 – Sept 2018</p>
                    <p class="text-white/80 mt-2 text-xs md:text-sm leading-relaxed">Led full-stack cloud engineering in agile environment. Architected microservice migration from Rackspace to AWS. Developed REST/streaming APIs. Integrated Amazon Alexa, Google Home, and IFTTT. Unified Salesforce CRM, IoT, and Marketing Cloud.</p>
                  </div>
                </div>
              </div>

              <!-- Technical Expertise -->
              <div>
                <h3 class="text-white/90 font-semibold mb-3 uppercase tracking-wider text-xs md:text-sm">Technical Expertise</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/80 text-xs md:text-sm">
                  <div class="p-2 md:p-3 rounded border border-slate-700/30 bg-slate-900/20"><strong>Cloud:</strong> AWS, GCP, Azure, Linode</div>
                  <div class="p-2 md:p-3 rounded border border-slate-700/30 bg-slate-900/20"><strong>Orchestration:</strong> Kubernetes, Istio, Helm, ArgoCD</div>
                  <div class="p-2 md:p-3 rounded border border-slate-700/30 bg-slate-900/20"><strong>IaC:</strong> Terraform, Ansible, Kustomize, Crossplane</div>
                  <div class="p-2 md:p-3 rounded border border-slate-700/30 bg-slate-900/20"><strong>Observability:</strong> Prometheus, Grafana, Loki, Tempo</div>
                  <div class="p-2 md:p-3 rounded border border-slate-700/30 bg-slate-900/20"><strong>GitOps:</strong> ArgoCD, Flux, GitHub Actions, Tekton</div>
                  <div class="p-2 md:p-3 rounded border border-slate-700/30 bg-slate-900/20"><strong>Languages:</strong> Go, Rust, Python, TypeScript, Node.js</div>
                  <div class="p-2 md:p-3 rounded border border-slate-700/30 bg-slate-900/20"><strong>Databases:</strong> PostgreSQL, MongoDB, Redis, MySQL</div>
                  <div class="p-2 md:p-3 rounded border border-slate-700/30 bg-slate-900/20"><strong>Messaging:</strong> RabbitMQ, Kafka, MQTT, AWS SQS</div>
                  <div class="p-2 md:p-3 rounded border border-slate-700/30 bg-slate-900/20"><strong>AI/LLMs:</strong> Claude, Gemini, GPT, LangChain, Prompt Engineering</div>
                  <div class="p-2 md:p-3 rounded border border-slate-700/30 bg-slate-900/20"><strong>Automation:</strong> Bash, Python, CI/CD Scripting, Workflow Orchestration</div>
                </div>
              </div>

              <!-- Education & Achievements -->
              <div>
                <h3 class="text-white/90 font-semibold mb-3 uppercase tracking-wider text-xs md:text-sm">Education & Achievements</h3>
                <div class="space-y-3">
                  <div class="p-3 md:p-4 rounded-lg border border-violet-500/10 bg-slate-900/40">
                    <p class="text-violet-400 font-semibold text-xs md:text-sm">B.S. Interdisciplinary Studies in Computer Science & IT</p>
                    <p class="text-white/80 text-xs md:text-sm">University of Missouri–Columbia (2008–2012)</p>
                  </div>
                  <ul class="space-y-2 text-white/80 text-xs md:text-sm">
                    <li class="flex items-start gap-3">
                      <span class="text-cyan-400 mt-1">→</span>
                      <span>2010 Missouri Student Unions Entrepreneurial Program Winner</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="text-cyan-400 mt-1">→</span>
                      <span>Led successful cloud infrastructure migrations for Fortune 500 companies</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="text-cyan-400 mt-1">→</span>
                      <span>Open source contributor to cloud-native and observability projects</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="text-cyan-400 mt-1">→</span>
                      <span>Founded and led Listener Approved music discovery platform (2010–2014)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </template>

          <!-- Contact -->
          <template v-if="activeSection === 'contact'">
            <div>
              <h2 class="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Contact</h2>
              <div class="w-20 md:w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6 md:mb-8"></div>
            </div>
            <div class="space-y-6 md:space-y-8 mt-6 md:mt-8">
              <div>
                <h3 class="text-white/90 font-semibold mb-3 md:mb-4 uppercase tracking-wider text-xs md:text-sm">Connect With Me</h3>
                <div class="space-y-2 md:space-y-3">
                  <a href="https://github.com/Kampe" target="_blank" class="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300 group">
                    <span class="w-1 h-1 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                    <span class="text-xs md:text-sm">GitHub</span>
                  </a>
                  <a href="https://linkedin.com/in/Kampe" target="_blank" class="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300 group">
                    <span class="w-1 h-1 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                    <span class="text-xs md:text-sm">LinkedIn</span>
                  </a>
                  <a href="https://twitter.com/NickKampe" target="_blank" class="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300 group">
                    <span class="w-1 h-1 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                    <span class="text-xs md:text-sm">Twitter/X</span>
                  </a>
                </div>
              </div>
              <form @submit.prevent="submitForm" class="space-y-3 md:space-y-4 pt-3 md:pt-4">
                <input v-model="form.name" type="text" placeholder="Name" class="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all duration-300 text-xs md:text-sm" required />
                <input v-model="form.email" type="email" placeholder="Email" class="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all duration-300 text-xs md:text-sm" required />
                <textarea v-model="form.message" placeholder="Message" rows="4" class="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all duration-300 resize-none text-xs md:text-sm" required></textarea>
                <button type="submit" class="w-full px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-semibold transition-all duration-300 text-xs md:text-sm uppercase tracking-wide text-white shadow-lg hover:shadow-cyan-500/25">Send Message</button>
              </form>
            </div>
          </template>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import VectorCloudHero from './components/art/VectorCloudHero.vue'

const activeSection = ref<string | null>(null)
const form = ref({ name: '', email: '', subject: '', message: '' })
const navRef = ref<HTMLElement | null>(null)
const navAboutRef = ref<HTMLElement | null>(null)
const navSkillsRef = ref<HTMLElement | null>(null)
const navResumeRef = ref<HTMLElement | null>(null)
const navContactRef = ref<HTMLElement | null>(null)

const submitForm = async () => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.success) {
      form.value = { name: '', email: '', subject: '', message: '' }
      alert('Message received!')
      activeSection.value = null
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

onMounted(async () => {
  // Wait for DOM to fully render
  await nextTick()

  // Animate navbar with staggered entrance
  const timeline = gsap.timeline()

  timeline.to(navRef.value, {
    opacity: 1,
    duration: 0.6,
    ease: 'cubic.out',
  })

  // Stagger nav buttons with slight delay
  timeline.fromTo(
    [navAboutRef.value, navSkillsRef.value, navResumeRef.value, navContactRef.value],
    { opacity: 0, y: -10 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'cubic.out', stagger: 0.1 },
    0.1
  )

  // Add subtle hover animations via GSAP
  const navButtons = [navAboutRef.value, navSkillsRef.value, navResumeRef.value, navContactRef.value]
  navButtons.forEach((btn) => {
    if (!btn) return
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        y: -3,
        duration: 0.3,
        ease: 'cubic.out',
      })
    })
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        y: 0,
        duration: 0.3,
        ease: 'cubic.out',
      })
    })
  })
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgb(34, 211, 238), rgb(59, 130, 246));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgb(34, 211, 238), rgb(59, 130, 246));
  opacity: 0.8;
}
</style>

<style>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  overflow: hidden;
}
</style>
