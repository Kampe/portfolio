<template>
  <div id="app" class="fixed inset-0 bg-black text-white overflow-hidden font-sans">
    <!-- Vector Cloud Hero -->
    <VectorCloudHero :palette="currentPalette" @open-contact="activeSection = 'contact'" />

    <!-- Animated Grid Background (subtle) -->
    <div class="fixed inset-0 opacity-5 pointer-events-none overflow-hidden z-0">
      <div class="absolute inset-0" style="background-image: linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent); background-size: 50px 50px; animation: scanlines 8s linear infinite;"></div>
    </div>

    <!-- Header + Navigation (overlay) -->
    <header class="fixed top-0 left-0 right-0 z-30 flex justify-end items-center px-4 md:px-8 py-6 md:py-8 pointer-events-none">
      <nav ref="navRef" class="flex gap-3 md:gap-6 text-xs md:text-sm tracking-wider uppercase font-bold pointer-events-auto" style="opacity: 0;">
        <button ref="navAboutRef" @click="activeSection = 'about'" class="relative text-white hover:text-blue-400 transition-all duration-200 group">
          <span class="block">ABOUT</span>
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></span>
        </button>
        <button ref="navSkillsRef" @click="activeSection = 'skills'" class="relative text-white hover:text-blue-400 transition-all duration-200 group">
          <span class="block">SKILLS</span>
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></span>
        </button>
        <button ref="navResumeRef" @click="activeSection = 'resume'" class="relative text-white hover:text-blue-400 transition-all duration-200 group">
          <span class="block">RESUME</span>
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></span>
        </button>
        <button ref="navContactRef" @click="activeSection = 'contact'" class="relative text-white hover:text-blue-400 transition-all duration-200 group">
          <span class="block">CONTACT</span>
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></span>
        </button>
      </nav>
    </header>

    <!-- Modal Overlay -->
    <Teleport to="body" v-if="activeSection">
      <div class="fixed inset-0 bg-black/70 backdrop-blur-lg z-40 pointer-events-auto" @click.self="activeSection = null" style="animation: fadeIn 0.3s ease-out;"></div>

      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-auto overflow-y-auto">
        <div class="relative w-full md:max-w-4xl max-h-[90vh] bg-slate-950/98 backdrop-blur-xl border-2 border-cyan-500/60 rounded-none md:rounded-lg p-6 md:p-12 pb-64 md:pb-96 pointer-events-auto flex flex-col my-8 md:my-0 overflow-y-auto shadow-2xl shadow-cyan-500/10" style="animation: glitchOpen 0.5s ease-out; --glitch-offset: 4px;">
          <!-- Neon glow effect -->
          <div class="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500/3 via-transparent to-magenta-500/2 pointer-events-none"></div>

          <!-- Animated scanline overlay -->
          <div class="absolute inset-0 rounded-lg pointer-events-none opacity-20" style="background-image: linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.1) 25%, rgba(0, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.1) 75%, rgba(0, 255, 255, 0.1) 76%, transparent 77%, transparent); background-size: 100% 4px; animation: scanlines 8s linear infinite;"></div>

          <!-- Close Button -->
          <button @click="activeSection = null" class="absolute top-4 md:top-6 right-4 md:right-6 z-20 text-cyan-400/70 hover:text-cyan-300 hover:text-lg transition-all duration-200 font-bold text-2xl" style="animation: slideInTop 0.4s ease-out 0.1s both;">
            <span class="relative block">
              ✕
              <span class="absolute inset-0 text-magenta-500 opacity-0 animate-pulse" style="animation: glitchText 0.3s ease-out; animation-delay: 0.3s;">✕</span>
            </span>
          </button>

          <!-- Content -->
          <div class="relative z-10 min-h-full" style="animation: slideInUp 0.6s ease-out 0.2s both;">
          <!-- About -->
          <template v-if="activeSection === 'about'">
            <div class="mb-8 md:mb-12">
              <div class="flex items-baseline gap-4">
                <h2 class="text-4xl md:text-6xl font-serif font-black text-cyan-300 leading-none" style="letter-spacing: -2px;">ABOUT</h2>
                <div class="flex-1 h-0.5 bg-gradient-to-r from-cyan-500 via-magenta-500 to-transparent"></div>
              </div>
              <div class="h-1 w-16 bg-gradient-to-r from-magenta-500 to-cyan-500 mt-3 md:mt-4"></div>
            </div>
            <div class="space-y-5 md:space-y-6 text-white/80 leading-relaxed font-light">
              <p class="text-sm md:text-base border-l-4 border-cyan-500/50 pl-4 py-2 hover:border-magenta-500/50 transition-colors duration-300" style="animation: slideInLeft 0.6s ease-out 0.3s both;">
                <span class="text-cyan-300 font-semibold">Infrastructure Architect & Platform Engineer</span> with 15+ years scaling production systems from pre-seed startups to enterprise and Web3. Specialist in designing end-to-end platform infrastructure—from cloud orchestration and observability to smart contract security and internal development platforms.
              </p>
              <p class="text-sm md:text-base border-l-4 border-cyan-500/30 pl-4 py-2 hover:border-magenta-500/50 transition-colors duration-300" style="animation: slideInLeft 0.6s ease-out 0.4s both;">
                At <span class="text-cyan-300 font-semibold">Yuga Labs</span> (world's largest NFT metaverse), architected an Internal Development Platform leveraging GitOps (Crossplane, ArgoCD, Backstage, LGTM stack) enabling 50+ engineers to self-serve infrastructure. Managed global DNS infrastructure across all company IPs and brands, and oversaw Perforce Helix Core and Unreal Engine CI/CD pipelines supporting game development workflows.
              </p>
              <p class="text-sm md:text-base border-l-4 border-cyan-500/30 pl-4 py-2 hover:border-magenta-500/50 transition-colors duration-300" style="animation: slideInLeft 0.6s ease-out 0.5s both;">
                <span class="text-cyan-300 font-semibold">Crypto infrastructure specialist</span> with hands-on smart contract audit experience (Solidity, Vyper, Forge, Hardhat). Deep expertise in zero-trust architecture (Boundary, Okta, Authentik, Cloudflare), distributed systems security, and hardening production environments across AWS, GCP, and on-premise Kubernetes clusters.
              </p>
              <p class="text-sm md:text-base border-l-4 border-cyan-500/30 pl-4 py-2 hover:border-magenta-500/50 transition-colors duration-300" style="animation: slideInLeft 0.6s ease-out 0.6s both;">
                <span class="text-cyan-300 font-semibold">Software craftsman</span> committed to TDD, BDD, and clean architecture principles. Full-stack capabilities span backend (Go, Rust, Python, Node.js), frontend (React, Vue, Three.js generative art), and embedded systems (Raspberry Pi, Arduino, FPGA). Experienced mentoring engineering teams on platform-as-a-service thinking, chaos engineering, and distributed systems design.
              </p>
            </div>
          </template>


          <!-- Skills -->
          <template v-if="activeSection === 'skills'">
            <div class="mb-8 md:mb-12">
              <div class="flex items-baseline gap-4">
                <h2 class="text-4xl md:text-6xl font-serif font-black text-magenta-400 leading-none" style="letter-spacing: -2px;">SKILLS</h2>
                <div class="flex-1 h-0.5 bg-gradient-to-r from-magenta-500 via-cyan-500 to-transparent"></div>
              </div>
              <div class="h-1 w-16 bg-gradient-to-r from-cyan-500 to-magenta-500 mt-3 md:mt-4"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-0">
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Cloud & Hosting Platforms</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">AWS, GCP, Azure, Cloudflare, DigitalOcean, Hetzner, Linode, Civo, Vercel, Railway, Proxmox, EBS</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Cloud Native Solutions</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Kubernetes, Docker, Talos, Istio, Helm, Kustomize, Linkerd, Argo Rollouts, Argo Workflows, External-DNS</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Blockchain</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Solidity, Vyper, Forge, Hardhat, Smart contracts, Smart contract audits, Layer 2 systems, Web3 tooling, Node hosting, ethers.js, RainbowKit, Privy, Halliday</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ IaC</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Terraform, OpenTofu, Pulumi, Ansible, CloudFormation, CDK, Crossplane, Packer</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Languages</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Go, Rust, Python, TypeScript, JavaScript, PHP, Bash</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Databases</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">PostgreSQL, MongoDB, Redis, ElasticSearch, MySQL, Scylla, DynamoDB, Firebase, Supabase, Qdrant, Snowflake, CouchDB, Aurora SQL, CockroachDB, Memcached, TimescaleDB, InfluxDB, Clickhouse</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ GitOps</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">ArgoCD, GitHub Actions, Jenkins, Tekton, Flux, TeamCity</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ DevTools</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Linux, macOS, VS Code, Vim, Vagrant</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Metrics & Monitoring</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Prometheus, Grafana, Grafana Beyla, CloudWatch, PagerDuty, Grafana On-Call, Datadog, Splunk, Sumo Logic</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Logging & Tracing</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">OpenTelemetry, Sentry, Loki, Tempo, ELK Stack, Kibana, Logstash</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Frontend Frameworks</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">React, Vue, Next.js, Astro, Svelte, GraphQL, jQuery</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ CSS/Styling</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Tailwind CSS, PostCSS, Bootstrap</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Creative Graphics</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Three.js, p5.js, WebGL, GLSL</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Hardware & Embedded</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Raspberry Pi, Arduino, Microcontrollers, PCB Design, 3D Printing, FPGA, Soldering</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Creative</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Unreal, Blender, Maya, Photoshop, Illustrator, After Effects, Premiere</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ IoT</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">AWS IoT, AWS Greengrass, Home Assistant, SmartThings</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ AI/LLMs</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Claude, OpenAI, Gemini, LangChain, Ollama, Hugging Face, TensorFlow Serving, KServe, Feast, Elyra</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Messaging</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">RabbitMQ, NATS, MQTT, Kafka, Redis Streams, SQS, ZeroMQ</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Networking</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Envoy, Nginx, Apache, HAProxy, Tailscale, Cloudflare Argo Tunnels</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ API Frameworks</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">gRPC, Express, FastAPI, Hapi, Flask, Gin</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Load Testing</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">k6, Locust, JMeter, Apache Bench, Artillery</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Feature Flags</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">OpenFeature, LaunchDarkly, Unleash</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Database Migrations</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Atlas, Flyway, Liquibase, Alembic</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Query Builders/ORMs</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Kysley, Knex, Drizzle, TypeORM, Sequelize</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Testing</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">pytest, Jest, Vitest, Playwright, Bats, mocha/chai, turbo, go test</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Secrets & Security</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Vault, cert-manager, External Secrets, 1Password, Bitwarden, mTLS, RBAC, OpenSSL, Boundary, Cloudflare Zero Trust, Okta, Authentik, Keycloak</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Security Scanning</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Aqua, Trivy, Wiz, CrowdStrike Falcon, Falco, Lacework</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ VCS & Collaboration</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Git, GitHub, GitLab, Bitbucket, Gitea, Perforce, Helix Swarm, Unreal Game Sync, Jira, Confluence</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Workflow Orchestration</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Temporal, Airflow, Workflows, Argo Events</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Data & ML Ops</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Kubeflow, Airbyte, dbt, MLflow, Spark</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Object Storage</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">S3, IPFS, Minio, Wasabi</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Software Craftsmanship</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">TDD, BDD, XP, Agile, Clean Code, Design Patterns, SOLID Principles, Refactoring, 12FA</p>
              </div>
            </div>
          </template>

          <!-- Resume -->
          <template v-if="activeSection === 'resume'">
            <div class="mb-8 md:mb-12">
              <div class="flex items-baseline gap-4">
                <h2 class="text-4xl md:text-6xl font-serif font-black text-cyan-300 leading-none" style="letter-spacing: -2px;">RESUME</h2>
                <div class="flex-1 h-0.5 bg-gradient-to-r from-cyan-500 via-magenta-500 to-transparent"></div>
              </div>
              <div class="h-1 w-16 bg-gradient-to-r from-magenta-500 to-cyan-500 mt-3 md:mt-4"></div>
            </div>
            <div class="space-y-6 md:space-y-8 mt-0" style="animation: slideInUp 0.6s ease-out 0.2s both;">
              <!-- Professional Summary -->
              <div class="p-4 md:p-5 border-2 border-magenta-500/50 bg-slate-900/40 hover:border-magenta-500/80 transition-colors duration-300" style="animation: slideInLeft 0.6s ease-out 0.3s both;">
                <h3 class="text-magenta-300 font-bold mb-3 uppercase tracking-wider text-xs md:text-sm">▸ Staff DevOps Engineer & Platform Architect</h3>
                <p class="text-white/75 text-xs md:text-sm leading-relaxed font-light">Specialist in designing and implementing enterprise DevOps solutions, Internal Development Platforms (IDPs), and cloud infrastructure automation. Deep expertise in Kubernetes, infrastructure-as-code, and GitOps workflows across AWS, GCP, and Azure. Experienced in delivering rapid infrastructure transformations for startups and enterprises. Available for contract-based DevOps automation, platform engineering, and infrastructure optimization engagements leveraging modern tooling and AI-driven workflows.</p>
              </div>

              <!-- Work Experience -->
              <div>
                <h3 class="text-cyan-300 font-bold mb-4 md:mb-5 uppercase tracking-wider text-xs md:text-sm flex items-center gap-2" style="animation: slideInLeft 0.6s ease-out 0.4s both;">
                  <span>▸ PROFESSIONAL EXPERIENCE</span>
                  <span class="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></span>
                </h3>
                <div class="space-y-3 md:space-y-4">
                  <div class="p-3 md:p-4 border-l-4 border-cyan-500/60 bg-slate-900/40 hover:bg-slate-900/60 hover:border-white/80 transition-all duration-300" style="animation: slideInLeft 0.6s ease-out 0.45s both;">
                    <h4 class="text-cyan-300 font-bold text-xs md:text-sm">Staff DevOps Engineer</h4>
                    <p class="text-xs text-cyan-400/60 mt-1">Yuga Labs · May 2023 – Present</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Spearheading platform engineering at the world's largest NFT metaverse company. Designed and implemented Internal Development Platform (IDP) using GitOps with Crossplane, ArgoCD, Backstage, and LGTM stack. Transitioned legacy systems to cloud-native Kubernetes. Oversaw global DNS management for all company IP and brands. Managed Perforce Helix Core and Unreal Engine utilities supporting game development pipelines.</p>
                  </div>
                  <div class="p-3 md:p-4 border-l-4 border-magenta-500/60 bg-slate-900/40 hover:bg-slate-900/60 hover:border-white/80 transition-all duration-300" style="animation: slideInLeft 0.6s ease-out 0.5s both;">
                    <h4 class="text-magenta-300 font-bold text-xs md:text-sm">Manager, Site Reliability/Core Infrastructure</h4>
                    <p class="text-xs text-magenta-400/60 mt-1">Payward Inc (Kraken Digital Asset Exchange) · Sept 2022 – May 2023</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Enhanced organizational security posture through robust policies and risk-based approaches. Led team of engineers coordinating with multiple stakeholders. Formulated technical triage and remediation procedures with emphasis on automation. Elevated infrastructure visibility and integrated open-source observability tools.</p>
                  </div>
                  <div class="p-3 md:p-4 border-l-4 border-cyan-500/60 bg-slate-900/40 hover:bg-slate-900/60 hover:border-magenta-500 transition-all duration-300" style="animation: slideInLeft 0.6s ease-out 0.55s both;">
                    <h4 class="text-cyan-300 font-bold text-xs md:text-sm">Principal Site Reliability Engineer</h4>
                    <p class="text-xs text-cyan-400/60 mt-1">Powerflex Systems (EDF Renewables) · April 2021 – Aug 2022</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Transformed diverse teams into lean agile using Kanban and XP. Mentored organization-wide on 12FA, TDD/BDD, GitOps, distributed tracing, and chaos engineering. Managed SRE team leading ceremonies and roadmapping product delivery to internal customers.</p>
                  </div>
                  <div class="p-3 md:p-4 border-l-4 border-magenta-500/60 bg-slate-900/40 hover:bg-slate-900/60 hover:border-cyan-500 transition-all duration-300" style="animation: slideInLeft 0.6s ease-out 0.6s both;">
                    <h4 class="text-magenta-300 font-bold text-xs md:text-sm">Senior Site Reliability Engineer</h4>
                    <p class="text-xs text-magenta-400/60 mt-1">Powerflex Systems · Sept 2019 – April 2021</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Established SRE practices organization-wide. Deployed multistage containerized environments across GKE, EKS, and AKS with Istio, Vault, and ArgoCD. Identified cloud waste and migrated to cost-reduced cloud-native solutions.</p>
                  </div>
                  <div class="p-3 md:p-4 border-l-4 border-cyan-500/60 bg-slate-900/40 hover:bg-slate-900/60 hover:border-magenta-500 transition-all duration-300" style="animation: slideInLeft 0.6s ease-out 0.65s both;">
                    <h4 class="text-cyan-300 font-bold text-xs md:text-sm">Senior Software Engineer</h4>
                    <p class="text-xs text-cyan-400/60 mt-1">EDF Renewables · Sept 2018 – Sept 2019</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Architected distributed systems for renewable energy monitoring across on-prem, edge, and cloud-native infrastructure. Developed "EDF Edge Industrial IoT Cloud Platform." Built ML pipelines and continuous delivery systems. Presented AWS solutions at Re:Invent 2018.</p>
                  </div>
                  <div class="p-3 md:p-4 border-l-4 border-magenta-500/60 bg-slate-900/40 hover:bg-slate-900/60 hover:border-cyan-500 transition-all duration-300" style="animation: slideInLeft 0.6s ease-out 0.7s both;">
                    <h4 class="text-magenta-300 font-bold text-xs md:text-sm">Agile Engineer</h4>
                    <p class="text-xs text-magenta-400/60 mt-1">Emerson Climate Technologies · May 2016 – Sept 2018</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Led full-stack cloud engineering in agile environment. Architected microservice migration from Rackspace to AWS. Developed REST/streaming APIs. Integrated Amazon Alexa, Google Home, and IFTTT. Unified Salesforce CRM, IoT, and Marketing Cloud.</p>
                  </div>
                  <div class="p-3 md:p-4 border-l-4 border-cyan-500/60 bg-slate-900/40 hover:bg-slate-900/60 hover:border-magenta-500 transition-all duration-300" style="animation: slideInLeft 0.6s ease-out 0.75s both;">
                    <h4 class="text-cyan-300 font-bold text-xs md:text-sm">Software Engineer</h4>
                    <p class="text-xs text-cyan-400/60 mt-1">Emerson Electric Co. · Nov 2014 – May 2016</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Reduced support team request volumes through creation of self-service internal tooling and data dashboards. Managed containerized server clusters on AWS ECS with RDS, ElastiCache, and ElasticSearch. Consulted on Amazon Alexa integration for IoT thermostats using AWS Lambda and Node.js. Architected multi-tenant management portals and mobile installation wizards using Node.js, React, Angular, and PHP.</p>
                  </div>
                </div>
              </div>

              <!-- Technical Expertise -->
              <div style="animation: slideInUp 0.6s ease-out 0.75s both;">
                <h3 class="text-magenta-300 font-bold mb-4 uppercase tracking-wider text-xs md:text-sm flex items-center gap-2">
                  <span>▸ TECHNICAL EXPERTISE</span>
                  <span class="flex-1 h-px bg-gradient-to-r from-magenta-500/50 to-transparent"></span>
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-white/75 text-xs md:text-sm font-light">
                  <div class="p-2 md:p-3 border-l-2 border-cyan-500/60 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300"><strong class="text-cyan-300">Cloud:</strong> AWS, GCP, Azure, Linode</div>
                  <div class="p-2 md:p-3 border-l-2 border-magenta-500/60 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300"><strong class="text-magenta-300">Orchestration:</strong> Kubernetes, Istio, Helm, ArgoCD</div>
                  <div class="p-2 md:p-3 border-l-2 border-cyan-500/60 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300"><strong class="text-cyan-300">IaC:</strong> Terraform, Ansible, Kustomize, Crossplane</div>
                  <div class="p-2 md:p-3 border-l-2 border-magenta-500/60 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300"><strong class="text-magenta-300">Observability:</strong> Prometheus, Grafana, Loki, Tempo</div>
                  <div class="p-2 md:p-3 border-l-2 border-cyan-500/60 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300"><strong class="text-cyan-300">GitOps:</strong> ArgoCD, Flux, GitHub Actions, Tekton</div>
                  <div class="p-2 md:p-3 border-l-2 border-magenta-500/60 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300"><strong class="text-magenta-300">Languages:</strong> Go, Rust, Python, TypeScript, Node.js</div>
                  <div class="p-2 md:p-3 border-l-2 border-cyan-500/60 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300"><strong class="text-cyan-300">Databases:</strong> PostgreSQL, MongoDB, Redis, MySQL</div>
                  <div class="p-2 md:p-3 border-l-2 border-magenta-500/60 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300"><strong class="text-magenta-300">Messaging:</strong> RabbitMQ, Kafka, MQTT, AWS SQS</div>
                  <div class="p-2 md:p-3 border-l-2 border-cyan-500/60 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300"><strong class="text-cyan-300">AI/LLMs:</strong> Claude, Gemini, Codex/ChatGPT, LangChain</div>
                  <div class="p-2 md:p-3 border-l-2 border-magenta-500/60 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300"><strong class="text-magenta-300">Automation:</strong> Bash, Python, CI/CD, Workflows</div>
                </div>
              </div>

              <!-- Education & Achievements -->
              <div style="animation: slideInUp 0.6s ease-out 0.85s both;">
                <h3 class="text-cyan-300 font-bold mb-4 uppercase tracking-wider text-xs md:text-sm flex items-center gap-2">
                  <span>▸ EDUCATION & ACHIEVEMENTS</span>
                  <span class="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></span>
                </h3>
                <div class="space-y-3">
                  <div class="p-3 md:p-4 border-2 border-cyan-500/50 bg-slate-900/40 hover:border-cyan-500/70 transition-colors duration-300">
                    <p class="text-cyan-300 font-bold text-xs md:text-sm">▸ University of Missouri–Columbia</p>
                    <p class="text-white/70 text-xs md:text-sm mt-1 font-light">Computer Science & IT coursework (2008–2012)</p>
                  </div>
                  <ul class="space-y-2 text-white/75 text-xs md:text-sm font-light">
                    <li class="flex items-start gap-3 p-2 hover:bg-slate-900/40 transition-colors duration-300">
                      <span class="text-magenta-400 font-bold mt-0.5">▸</span>
                      <span>2010 Missouri Student Unions Entrepreneurial Program Winner</span>
                    </li>
                    <li class="flex items-start gap-3 p-2 hover:bg-slate-900/40 transition-colors duration-300">
                      <span class="text-magenta-400 font-bold mt-0.5">▸</span>
                      <span>Led successful cloud infrastructure migrations for Fortune 500 companies</span>
                    </li>
                    <li class="flex items-start gap-3 p-2 hover:bg-slate-900/40 transition-colors duration-300">
                      <span class="text-magenta-400 font-bold mt-0.5">▸</span>
                      <span>Open source contributor to cloud-native and observability projects</span>
                    </li>
                    <li class="flex items-start gap-3 p-2 hover:bg-slate-900/40 transition-colors duration-300">
                      <span class="text-magenta-400 font-bold mt-0.5">▸</span>
                      <span>Founded and led Listener Approved music discovery platform (2010–2014)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </template>

          <!-- Contact -->
          <template v-if="activeSection === 'contact'">
            <div class="mb-8 md:mb-12">
              <div class="flex items-baseline gap-4">
                <h2 class="text-4xl md:text-6xl font-serif font-black text-magenta-300 leading-none" style="letter-spacing: -2px;">CONTACT</h2>
                <div class="flex-1 h-0.5 bg-gradient-to-r from-magenta-500 via-cyan-500 to-transparent"></div>
              </div>
              <div class="h-1 w-16 bg-gradient-to-r from-cyan-500 to-magenta-500 mt-3 md:mt-4"></div>
            </div>
            <div class="space-y-6 md:space-y-8 mt-0" style="animation: slideInUp 0.6s ease-out 0.2s both;">
              <div>
                <h3 class="text-cyan-300 font-bold mb-3 md:mb-4 uppercase tracking-wider text-xs md:text-sm flex items-center gap-2">
                  <span>▸ CONNECT WITH ME</span>
                  <span class="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></span>
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  <a href="https://github.com/Kampe" target="_blank" class="flex items-center gap-3 text-cyan-400/70 hover:text-cyan-300 transition-all duration-300 group text-sm font-light px-3 py-2 border border-cyan-500/30 hover:border-cyan-500/60 rounded">
                    <span class="w-1.5 h-1.5 bg-cyan-500 group-hover:bg-magenta-500 rounded-full transition-colors duration-300"></span>
                    <span>GitHub</span>
                  </a>
                  <a href="https://linkedin.com/in/Kampe" target="_blank" class="flex items-center gap-3 text-magenta-400/70 hover:text-magenta-300 transition-all duration-300 group text-sm font-light px-3 py-2 border border-magenta-500/30 hover:border-magenta-500/60 rounded">
                    <span class="w-1.5 h-1.5 bg-magenta-500 group-hover:bg-cyan-500 rounded-full transition-colors duration-300"></span>
                    <span>LinkedIn</span>
                  </a>
                  <a href="https://twitter.com/NickKampe" target="_blank" class="flex items-center gap-3 text-cyan-400/70 hover:text-cyan-300 transition-all duration-300 group text-sm font-light px-3 py-2 border border-cyan-500/30 hover:border-cyan-500/60 rounded">
                    <span class="w-1.5 h-1.5 bg-cyan-500 group-hover:bg-magenta-500 rounded-full transition-colors duration-300"></span>
                    <span>Twitter/X</span>
                  </a>
                  <a href="https://bitbucket.org/Kampe" target="_blank" class="flex items-center gap-3 text-magenta-400/70 hover:text-magenta-300 transition-all duration-300 group text-sm font-light px-3 py-2 border border-magenta-500/30 hover:border-magenta-500/60 rounded">
                    <span class="w-1.5 h-1.5 bg-magenta-500 group-hover:bg-cyan-500 rounded-full transition-colors duration-300"></span>
                    <span>BitBucket</span>
                  </a>
                  <a href="https://stackoverflow.com/users/201297/nickkampe" target="_blank" class="flex items-center gap-3 text-cyan-400/70 hover:text-cyan-300 transition-all duration-300 group text-sm font-light px-3 py-2 border border-cyan-500/30 hover:border-cyan-500/60 rounded">
                    <span class="w-1.5 h-1.5 bg-cyan-500 group-hover:bg-magenta-500 rounded-full transition-colors duration-300"></span>
                    <span>Stack Overflow</span>
                  </a>
                  <a href="https://angel.co/Kampe" target="_blank" class="flex items-center gap-3 text-magenta-400/70 hover:text-magenta-300 transition-all duration-300 group text-sm font-light px-3 py-2 border border-magenta-500/30 hover:border-magenta-500/60 rounded">
                    <span class="w-1.5 h-1.5 bg-magenta-500 group-hover:bg-cyan-500 rounded-full transition-colors duration-300"></span>
                    <span>AngelList</span>
                  </a>
                  <a href="https://quora.com/Nick-Kampe" target="_blank" class="flex items-center gap-3 text-cyan-400/70 hover:text-cyan-300 transition-all duration-300 group text-sm font-light px-3 py-2 border border-cyan-500/30 hover:border-cyan-500/60 rounded">
                    <span class="w-1.5 h-1.5 bg-cyan-500 group-hover:bg-magenta-500 rounded-full transition-colors duration-300"></span>
                    <span>Quora</span>
                  </a>
                </div>
              </div>
              <form @submit.prevent="submitForm" class="space-y-3 md:space-y-4 pt-3 md:pt-6 border-t border-cyan-500/20">
                <input id="contact-name" name="name" v-model="form.name" type="text" placeholder="Your Name" class="w-full px-4 md:px-5 py-2 md:py-3 bg-slate-900/60 border-2 border-cyan-500/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:bg-slate-900/80 transition-all duration-300 text-xs md:text-sm font-light" required />
                <input id="contact-email" name="email" v-model="form.email" type="email" placeholder="Your Email" class="w-full px-4 md:px-5 py-2 md:py-3 bg-slate-900/60 border-2 border-magenta-500/50 text-white placeholder-slate-500 focus:outline-none focus:border-magenta-400 focus:bg-slate-900/80 transition-all duration-300 text-xs md:text-sm font-light" required />
                <textarea id="contact-message" name="message" v-model="form.message" placeholder="Your Message" rows="5" class="w-full px-4 md:px-5 py-2 md:py-3 bg-slate-900/60 border-2 border-cyan-500/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:bg-slate-900/80 transition-all duration-300 resize-none text-xs md:text-sm font-light" required></textarea>
                <button id="contact-submit" type="submit" class="w-full px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-500 hover:to-magenta-500 font-bold transition-all duration-300 text-xs md:text-sm uppercase tracking-widest text-black shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 border-2 border-cyan-400/50 hover:border-cyan-300">
                  ▸ SEND MESSAGE
                </button>
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
import { getRandomPalette, applyPaletteToDOM } from './utils/colorPalettes'

const activeSection = ref<string | null>(null)
const form = ref({ name: '', email: '', subject: '', message: '' })
const navRef = ref<HTMLElement | null>(null)
const navAboutRef = ref<HTMLElement | null>(null)
const navSkillsRef = ref<HTMLElement | null>(null)
const navResumeRef = ref<HTMLElement | null>(null)
const navContactRef = ref<HTMLElement | null>(null)
const currentPalette = ref(getRandomPalette())

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

  // Apply selected color palette to DOM
  applyPaletteToDOM(currentPalette.value)

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
@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=IBM+Plex+Mono:wght@400;700&display=swap');

:root {
  --font-serif: 'Crimson Text', serif;
  --font-mono: 'IBM Plex Mono', monospace;
}

.font-serif {
  font-family: var(--font-serif);
}

.font-mono {
  font-family: var(--font-mono);
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.8);
  border-left: 1px solid rgba(0, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgb(34, 211, 238), rgb(220, 38, 38));
  border-radius: 0;
  border-left: 2px solid rgb(0, 255, 255);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgb(34, 211, 238), rgb(236, 72, 153));
  box-shadow: inset 0 0 6px rgba(0, 255, 255, 0.5);
}

/* Cyberpunk Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes glitchOpen {
  0% {
    opacity: 0;
    transform: translate(-20px, 20px);
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
  }
  50% {
    opacity: 0.8;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 95%);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}

@keyframes glitchText {
  0% {
    transform: translate(-2px, -2px);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(2px, 2px);
    opacity: 0;
  }
}

@keyframes slideInTop {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scanlines {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
}
</style>

<style>
:root {
  /* Default palette (Cyberpunk) - will be overridden by JS */
  --color-primary: #00FFFF;
  --color-primary-hsl: 180 100% 50%;
  --color-secondary: #FF00FF;
  --color-secondary-hsl: 300 100% 50%;
  --color-accent: #0099FF;
  --color-accent-hsl: 204 100% 50%;
}

html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  overflow: hidden;
}
</style>
