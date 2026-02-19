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
        <button ref="navAboutRef" @click="activeSection = 'about'" class="relative text-white transition-all duration-200 group" :style="{ '--hover-color': `hsl(var(--color-primary-hsl) / 1)` }">
          <span class="block hover:opacity-70">ABOUT</span>
          <span class="absolute bottom-0 left-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" :style="{ backgroundColor: `hsl(var(--color-primary-hsl) / 1)`, width: '100%' }"></span>
        </button>
        <button ref="navSkillsRef" @click="activeSection = 'skills'" class="relative text-white transition-all duration-200 group">
          <span class="block hover:opacity-70">SKILLS</span>
          <span class="absolute bottom-0 left-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" :style="{ backgroundColor: `hsl(var(--color-primary-hsl) / 1)`, width: '100%' }"></span>
        </button>
        <button ref="navResumeRef" @click="activeSection = 'resume'" class="relative text-white transition-all duration-200 group">
          <span class="block hover:opacity-70">RESUME</span>
          <span class="absolute bottom-0 left-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" :style="{ backgroundColor: `hsl(var(--color-primary-hsl) / 1)`, width: '100%' }"></span>
        </button>
        <button ref="navContactRef" @click="activeSection = 'contact'" class="relative text-white transition-all duration-200 group">
          <span class="block hover:opacity-70">CONTACT</span>
          <span class="absolute bottom-0 left-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" :style="{ backgroundColor: `hsl(var(--color-primary-hsl) / 1)`, width: '100%' }"></span>
        </button>
      </nav>
    </header>

    <!-- Modal Overlay -->
    <Teleport to="body" v-if="activeSection">
      <div class="fixed inset-0 bg-black/70 backdrop-blur-lg z-40 pointer-events-auto" @click.self="activeSection = null" style="animation: fadeIn 0.3s ease-out;"></div>

      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-auto overflow-y-auto">
        <div class="relative w-full md:max-w-4xl max-h-[90vh] bg-slate-950/98 backdrop-blur-xl rounded-none md:rounded-lg pointer-events-auto flex flex-col my-8 md:my-0 shadow-2xl border-2" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.6)`, boxShadow: `0 0 50px hsl(var(--color-primary-hsl) / 0.1)` }" style="animation: glitchOpen 0.5s ease-out; --glitch-offset: 4px;">
          <!-- Neon glow effect -->
          <div class="absolute inset-0 rounded-lg bg-gradient-to-br via-transparent pointer-events-none" :style="{ backgroundImage: `linear-gradient(to bottom right, hsl(var(--color-primary-hsl) / 0.03), transparent, hsl(var(--color-secondary-hsl) / 0.02))` }"></div>

          <!-- Animated scanline overlay -->
          <div class="absolute inset-0 rounded-lg pointer-events-none opacity-20" :style="{ backgroundImage: `linear-gradient(0deg, transparent 24%, hsl(var(--color-primary-hsl) / 0.1) 25%, hsl(var(--color-primary-hsl) / 0.1) 26%, transparent 27%, transparent 74%, hsl(var(--color-primary-hsl) / 0.1) 75%, hsl(var(--color-primary-hsl) / 0.1) 76%, transparent 77%, transparent)`, backgroundSize: '100% 4px', animation: 'scanlines 8s linear infinite' }"></div>

          <!-- Close Button - Fixed to modal corner -->
          <button @click="activeSection = null" class="absolute top-4 md:top-6 right-4 md:right-6 z-20 hover:scale-110 transition-all duration-200" :style="{ color: `hsl(var(--color-primary-hsl) / 0.7)` }" style="animation: slideInTop 0.4s ease-out 0.1s both;">
            <X size="24" />
          </button>

          <!-- Content -->
          <div class="relative z-10 min-h-full overflow-y-auto p-6 md:p-12 pb-12" style="animation: slideInUp 0.6s ease-out 0.2s both;">
          <!-- About -->
          <template v-if="activeSection === 'about'">
            <div class="mb-8 md:mb-12">
              <h2 class="text-4xl md:text-6xl font-serif font-black leading-none" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }" style="letter-spacing: -2px;">ABOUT</h2>
              <div class="h-1 mt-4 bg-gradient-to-r" :style="{ backgroundImage: `linear-gradient(to right, hsl(var(--color-primary-hsl) / 0.8), hsl(var(--color-secondary-hsl) / 0.4), transparent)` }"></div>
            </div>
            <div class="space-y-5 md:space-y-6 text-white/80 leading-relaxed font-light">
              <p class="text-sm md:text-base pl-4 py-2 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.5)`, borderLeftWidth: '4px' }" style="animation: slideInLeft 0.6s ease-out 0.3s both;">
                <span class="font-semibold" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">Infrastructure Architect & Platform Engineer</span> with 15+ years scaling systems. At <span class="font-semibold" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">Yuga Labs</span>, I built an Internal Development Platform (IDP) using GitOps that lets 50+ engineers self-serve infrastructure without bottlenecks. Managed global DNS infrastructure and CI/CD pipelines supporting game development at scale.
              </p>
              <p class="text-sm md:text-base pl-4 py-2 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.3)`, borderLeftWidth: '4px' }" style="animation: slideInLeft 0.6s ease-out 0.4s both;">
                I've built infrastructure for <span class="font-semibold" :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }">Kraken Digital Asset Exchange</span> and led cloud migrations for Fortune 500 companies. Expert in node operations, validator infrastructure, staking protocols, and stablecoin systems. Specialize in zero-trust architecture, distributed systems security, and hardening production across AWS, GCP, Azure, and on-premise Kubernetes.
              </p>
              <p class="text-sm md:text-base pl-4 py-2 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.3)`, borderLeftWidth: '4px' }" style="animation: slideInLeft 0.6s ease-out 0.5s both;">
                I design cloud-native platforms across all major providers. Kubernetes with GitOps (Crossplane, ArgoCD, Backstage). Observability stacks (Prometheus, Grafana, Loki, Tempo). Automated security. I write code for the long term—TDD, BDD, clean architecture. Infrastructure lives for years. It has to be built right.
              </p>
              <p class="text-sm md:text-base pl-4 py-2 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.3)`, borderLeftWidth: '4px' }" style="animation: slideInLeft 0.6s ease-out 0.6s both;">
                <span class="font-semibold" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">Available for contract infrastructure work:</span> platform architecture, DevOps automation, cloud migrations. If you need someone to solve hard scaling problems, <span class="font-semibold" :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }">get in touch.</span>
              </p>
            </div>
          </template>


          <!-- Skills -->
          <template v-if="activeSection === 'skills'">
            <div class="mb-8 md:mb-12">
              <h2 class="text-4xl md:text-6xl font-serif font-black leading-none" :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }" style="letter-spacing: -2px;">SKILLS</h2>
              <div class="h-1 mt-4 bg-gradient-to-r" :style="{ backgroundImage: `linear-gradient(to right, hsl(var(--color-secondary-hsl) / 0.8), hsl(var(--color-primary-hsl) / 0.4), transparent)` }"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-0 pb-12">
              <!-- TIER 1: Infrastructure Core -->
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Cloud Native Solutions</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Kubernetes, Docker, Talos, Istio, Helm, Kustomize, Linkerd, Cilium, eBPF, Argo Rollouts, Argo Workflows, External-DNS, Karpenter, Cluster Autoscaler</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Cloud & Hosting Platforms</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">AWS, GCP, Azure, Cloudflare, DigitalOcean, Hetzner, Linode, Civo, Vercel, Railway, Proxmox</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ IaC</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Terraform, OpenTofu, Pulumi, Ansible, Chef, Puppet, CloudFormation, CDK, Crossplane, Packer, OpenShift, Salt</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ GitOps & Platform Engineering</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">ArgoCD, Flux, Backstage, GitHub Actions, Azure DevOps, Jenkins, Tekton, TeamCity</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Secrets, IAM & Security</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Vault, cert-manager, External Secrets, 1Password, Bitwarden, mTLS, RBAC, OpenSSL, Boundary, Cloudflare Zero Trust, Okta, Authentik, Keycloak, IAM, Azure Key Vault, AWS Secrets Manager, Google Secret Manager, Sigstore, Cosign, Fulcio, Rekor</p>
              </div>

              <!-- TIER 2: Observability -->
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Metrics & Monitoring</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Prometheus, Grafana, Grafana Beyla, Thanos, Mimir, VictoriaMetrics, CloudWatch, PagerDuty, Grafana On-Call, Datadog, Honeycomb, Splunk, Sumo Logic, Kubecost</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Logging & Tracing</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">OpenTelemetry, Sentry, Loki, Tempo, ELK Stack, Kibana, Logstash</p>
              </div>

              <!-- TIER 3: Foundation -->
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Networking</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">TCP/IP, Envoy, Nginx, Apache, HAProxy, Tailscale, Cloudflare Argo Tunnels</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ DevTools</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Linux, macOS, zsh, starship, VS Code, Vim, Vagrant, PowerShell</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Languages</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Go, Rust, Python, TypeScript, JavaScript, PHP, Bash, LUA, PowerShell</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Software Craftsmanship</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">SDLC, DDD, TDD, BDD, XP, Agile, Clean Code, Design Patterns, SOLID Principles, Refactoring, 12FA</p>
              </div>

              <!-- TIER 4: Data -->
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Relational Databases</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">PostgreSQL, MySQL, CockroachDB, Aurora SQL, TimescaleDB, PostGIS</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ NoSQL, Search & Analytics</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">MongoDB, Redis, ElasticSearch, DynamoDB, Firebase, Supabase, Qdrant, CouchDB, Memcached, InfluxDB, Clickhouse, DuckDB, Snowflake, Scylla</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Blockchain</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Solidity, Vyper, Forge, Hardhat, Smart contracts, Smart contract audits, Layer 2 systems, Web3 tooling, Node hosting, Node RPC Providers, ethers.js, RainbowKit, Privy, Halliday, Echidna</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ GenAI/LLMs</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Claude, OpenAI, Copilot, Gemini, DeepSeek, AWS Bedrock, LangChain, Ollama, Hugging Face, TensorFlow Serving, KServe, vLLM, Feast, Elyra, ADK, AP2, Pi, openclaw/clawdbot, PyTorch, Keras</p>
              </div>

              <!-- TIER 5: Advanced -->
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Workflow Orchestration</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Temporal, Airflow, Workflows, Argo Events</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Testing</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">pytest, Jest, Vitest, Playwright, Storybook, Bats, mocha/chai, turbo, go test</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Load & Chaos Engineering</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">k6, Locust, JMeter, Apache Bench, Artillery, Gremlin</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ API Frameworks</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">gRPC, Express, FastAPI, Hapi, Flask, Gin, GeoJSON, Salesforce</p>
              </div>

              <!-- TIER 6: Specialized/Modern -->
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Data & ML Ops</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Kubeflow, Airbyte, dbt, MLflow, Spark, Databricks</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Messaging</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">RabbitMQ, NATS, MQTT, Kafka, Redis Streams, SQS, ZeroMQ</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Governance & Compliance</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">OPA, Rego, Gatekeeper, Kyverno, HashiCorp Sentinel, SOC2, Aqua, Trivy, Wiz, CrowdStrike Falcon, Falco, Lacework, SonarQube</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ VCS & Collaboration</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Git, GitHub, GitLab, Bitbucket, Gitea, Perforce, Helix Swarm, Unreal Game Sync, Jira, Confluence</p>
              </div>

              <!-- TIER 7: Supporting -->
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Query Builders/ORMs</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Kysley, Knex, Drizzle, TypeORM, Sequelize</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Database Migrations</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">Atlas, Flyway, Liquibase, Alembic</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Feature Flags</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">OpenFeature, LaunchDarkly, Unleash</p>
              </div>
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Object Storage</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">S3, IPFS, Minio, Wasabi</p>
              </div>

              <!-- TIER 8: De-emphasize -->
              <div class="p-3 md:p-4 border-2 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:scale-105" style="border-color: hsl(var(--color-primary-hsl) / 0.6); animation: slideInUp 0.5s ease-out;">
                <h3 class="text-white font-bold text-xs uppercase tracking-wider mb-2">▸ Frontend Frameworks</h3>
                <p class="text-white/70 text-xs font-light leading-relaxed">React, Vue, Next.js, Astro, Svelte, GraphQL, WebAssembly, jQuery</p>
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
            </div>
          </template>

          <!-- Resume -->
          <template v-if="activeSection === 'resume'">
            <div class="mb-8 md:mb-12">
              <h2 class="text-4xl md:text-6xl font-serif font-black leading-none" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }" style="letter-spacing: -2px;">RESUME</h2>
              <div class="h-1 mt-4 bg-gradient-to-r" :style="{ backgroundImage: `linear-gradient(to right, hsl(var(--color-primary-hsl) / 0.8), hsl(var(--color-secondary-hsl) / 0.4), transparent)` }"></div>
            </div>
            <div class="space-y-6 md:space-y-8 mt-0 pb-12" style="animation: slideInUp 0.6s ease-out 0.2s both;">
              <!-- Professional Summary -->
              <div class="p-4 md:p-5 border-2 bg-slate-900/40 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-secondary-hsl) / 0.5)` }" style="animation: slideInLeft 0.6s ease-out 0.3s both;">
                <h3 class="font-bold mb-3 uppercase tracking-wider text-xs md:text-sm" :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }">▸ Automation Engineer & Platform Architect</h3>
                <p class="text-white/75 text-xs md:text-sm leading-relaxed font-light">Specialist in designing and implementing enterprise DevOps solutions, Internal Development Platforms (IDPs), and cloud infrastructure automation. Deep expertise in Kubernetes, infrastructure-as-code, and GitOps workflows across AWS, GCP, and Azure. Experienced in delivering rapid infrastructure transformations for startups and enterprises. Available for contract-based DevOps automation, platform engineering, and infrastructure optimization engagements leveraging modern tooling and AI-driven workflows.</p>
              </div>

              <!-- Work Experience -->
              <div>
                <h3 class="font-bold mb-4 md:mb-5 uppercase tracking-wider text-xs md:text-sm flex items-center gap-2" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }" style="animation: slideInLeft 0.6s ease-out 0.4s both;">
                  <span>▸ PROFESSIONAL EXPERIENCE</span>
                  <span class="flex-1 h-px" :style="{ backgroundImage: `linear-gradient(to right, hsl(var(--color-primary-hsl) / 0.5), transparent)` }"></span>
                </h3>
                <div class="space-y-3 md:space-y-4">
                  <div class="p-3 md:p-4 border-l-4 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.6)` }" style="animation: slideInLeft 0.6s ease-out 0.45s both;">
                    <h4 class="font-bold text-xs md:text-sm" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">Staff DevOps Engineer</h4>
                    <p class="text-xs mt-1" :style="{ color: `hsl(var(--color-primary-hsl) / 0.6)` }">Yuga Labs · May 2023 – Present</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Spearheading platform engineering at the world's largest NFT metaverse company. Designed and implemented Internal Development Platform (IDP) using GitOps with Crossplane, ArgoCD, Backstage, and LGTM stack. Transitioned legacy systems to cloud-native Kubernetes. Oversaw global DNS management for all company IP and brands. Managed Perforce Helix Core and Unreal Engine utilities supporting game development pipelines.</p>
                  </div>
                  <div class="p-3 md:p-4 border-l-4 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300" :style="{ borderColor: `hsl(var(--color-secondary-hsl) / 0.6)` }" style="animation: slideInLeft 0.6s ease-out 0.5s both;">
                    <h4 class="font-bold text-xs md:text-sm" :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }">Manager, Site Reliability/Core Infrastructure</h4>
                    <p class="text-xs mt-1" :style="{ color: `hsl(var(--color-secondary-hsl) / 0.6)` }">Payward Inc (Kraken Digital Asset Exchange) · Sept 2022 – May 2023</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Enhanced organizational security posture through robust policies and risk-based approaches. Led team of engineers coordinating with multiple stakeholders. Formulated technical triage and remediation procedures with emphasis on automation. Elevated infrastructure visibility and integrated open-source observability tools.</p>
                  </div>
                  <div class="p-3 md:p-4 border-l-4 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.6)` }" style="animation: slideInLeft 0.6s ease-out 0.55s both;">
                    <h4 class="font-bold text-xs md:text-sm" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">Principal Site Reliability Engineer</h4>
                    <p class="text-xs mt-1" :style="{ color: `hsl(var(--color-primary-hsl) / 0.6)` }">Powerflex Systems (EDF Renewables) · April 2021 – Aug 2022</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Transformed diverse teams into lean agile using Kanban and XP. Mentored organization-wide on 12FA, TDD/BDD, GitOps, distributed tracing, and chaos engineering. Managed SRE team leading ceremonies and roadmapping product delivery to internal customers.</p>
                  </div>
                  <div class="p-3 md:p-4 border-l-4 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300" :style="{ borderColor: `hsl(var(--color-secondary-hsl) / 0.6)` }" style="animation: slideInLeft 0.6s ease-out 0.6s both;">
                    <h4 class="font-bold text-xs md:text-sm" :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }">Senior Site Reliability Engineer</h4>
                    <p class="text-xs mt-1" :style="{ color: `hsl(var(--color-secondary-hsl) / 0.6)` }">Powerflex Systems · Sept 2019 – April 2021</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Established SRE practices organization-wide. Deployed multistage containerized environments across GKE, EKS, and AKS with Istio, Vault, and ArgoCD. Identified cloud waste and migrated to cost-reduced cloud-native solutions.</p>
                  </div>
                  <div class="p-3 md:p-4 border-l-4 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.6)` }" style="animation: slideInLeft 0.6s ease-out 0.65s both;">
                    <h4 class="font-bold text-xs md:text-sm" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">Senior Software Engineer</h4>
                    <p class="text-xs mt-1" :style="{ color: `hsl(var(--color-primary-hsl) / 0.6)` }">EDF Renewables · Sept 2018 – Sept 2019</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Architected distributed systems for renewable energy monitoring across on-prem, edge, and cloud-native infrastructure. Developed "EDF Edge Industrial IoT Cloud Platform." Built ML pipelines and continuous delivery systems. Presented AWS solutions at Re:Invent 2018.</p>
                  </div>
                  <div class="p-3 md:p-4 border-l-4 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300" :style="{ borderColor: `hsl(var(--color-secondary-hsl) / 0.6)` }" style="animation: slideInLeft 0.6s ease-out 0.7s both;">
                    <h4 class="font-bold text-xs md:text-sm" :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }">Agile Engineer</h4>
                    <p class="text-xs mt-1" :style="{ color: `hsl(var(--color-secondary-hsl) / 0.6)` }">Emerson Climate Technologies · May 2016 – Sept 2018</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Led full-stack cloud engineering in agile environment. Architected microservice migration from Rackspace to AWS. Developed REST/streaming APIs. Integrated Amazon Alexa, Google Home, and IFTTT. Unified Salesforce CRM, IoT, and Marketing Cloud.</p>
                  </div>
                  <div class="p-3 md:p-4 border-l-4 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.6)` }" style="animation: slideInLeft 0.6s ease-out 0.75s both;">
                    <h4 class="font-bold text-xs md:text-sm" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">Software Engineer</h4>
                    <p class="text-xs mt-1" :style="{ color: `hsl(var(--color-primary-hsl) / 0.6)` }">Emerson Electric Co. · Nov 2014 – May 2016</p>
                    <p class="text-white/75 mt-2 text-xs md:text-sm leading-relaxed font-light">Reduced support team request volumes through creation of self-service internal tooling and data dashboards. Managed containerized server clusters on AWS ECS with RDS, ElastiCache, and ElasticSearch. Consulted on Amazon Alexa integration for IoT thermostats using AWS Lambda and Node.js. Architected multi-tenant management portals and mobile installation wizards using Node.js, React, Angular, and PHP.</p>
                  </div>
                </div>
              </div>

              <!-- Technical Expertise -->
              <div style="animation: slideInUp 0.6s ease-out 0.75s both;">
                <h3 class="font-bold mb-4 uppercase tracking-wider text-xs md:text-sm flex items-center gap-2" :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }">
                  <span>▸ TECHNICAL EXPERTISE</span>
                  <span class="flex-1 h-px" :style="{ backgroundImage: `linear-gradient(to right, hsl(var(--color-secondary-hsl) / 0.5), transparent)` }"></span>
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-white/75 text-xs md:text-sm font-light">
                  <div class="p-2 md:p-3 border-l-2 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.6)` }"><strong :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">Cloud:</strong> AWS, GCP, Azure, Linode</div>
                  <div class="p-2 md:p-3 border-l-2 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-secondary-hsl) / 0.6)` }"><strong :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }">Orchestration:</strong> Kubernetes, Istio, Helm, ArgoCD</div>
                  <div class="p-2 md:p-3 border-l-2 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.6)` }"><strong :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">IaC:</strong> Terraform, Ansible, Kustomize, Crossplane</div>
                  <div class="p-2 md:p-3 border-l-2 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-secondary-hsl) / 0.6)` }"><strong :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }">Observability:</strong> Prometheus, Grafana, Loki, Tempo</div>
                  <div class="p-2 md:p-3 border-l-2 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.6)` }"><strong :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">GitOps:</strong> ArgoCD, Flux, GitHub Actions, Tekton</div>
                  <div class="p-2 md:p-3 border-l-2 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-secondary-hsl) / 0.6)` }"><strong :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }">Languages:</strong> Go, Rust, Python, TypeScript, Node.js</div>
                  <div class="p-2 md:p-3 border-l-2 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.6)` }"><strong :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">Databases:</strong> PostgreSQL, MongoDB, Redis, MySQL</div>
                  <div class="p-2 md:p-3 border-l-2 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-secondary-hsl) / 0.6)` }"><strong :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }">Messaging:</strong> RabbitMQ, Kafka, MQTT, AWS SQS</div>
                  <div class="p-2 md:p-3 border-l-2 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.6)` }"><strong :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">GenAI/LLMs:</strong> Claude, Gemini, Codex/ChatGPT, LangChain</div>
                  <div class="p-2 md:p-3 border-l-2 bg-slate-900/30 hover:bg-slate-900/50 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-secondary-hsl) / 0.6)` }"><strong :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }">Automation:</strong> Bash, Python, CI/CD, Workflows</div>
                </div>
              </div>

              <!-- Education & Achievements -->
              <div style="animation: slideInUp 0.6s ease-out 0.85s both;">
                <h3 class="font-bold mb-4 uppercase tracking-wider text-xs md:text-sm flex items-center gap-2" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">
                  <span>▸ EDUCATION & ACHIEVEMENTS</span>
                  <span class="flex-1 h-px" :style="{ backgroundImage: `linear-gradient(to right, hsl(var(--color-primary-hsl) / 0.5), transparent)` }"></span>
                </h3>
                <div class="space-y-3">
                  <div class="p-3 md:p-4 border-2 bg-slate-900/40 transition-colors duration-300" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.5)` }">
                    <p class="font-bold text-xs md:text-sm" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">▸ University of Missouri–Columbia</p>
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
              <h2 class="text-4xl md:text-6xl font-serif font-black leading-none" :style="{ color: `hsl(var(--color-secondary-hsl) / 1)` }" style="letter-spacing: -2px;">CONTACT</h2>
              <div class="h-1 mt-4 bg-gradient-to-r" :style="{ backgroundImage: `linear-gradient(to right, hsl(var(--color-secondary-hsl) / 0.8), hsl(var(--color-primary-hsl) / 0.4), transparent)` }"></div>
            </div>
            <div class="space-y-6 md:space-y-8 mt-0" style="animation: slideInUp 0.6s ease-out 0.2s both;">
              <div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  <a href="https://github.com/Kampe" target="_blank" class="flex items-center gap-3 transition-all duration-300 group text-sm font-medium px-3 py-2 border rounded hover:bg-slate-900/40" :style="{ color: `hsl(var(--color-primary-hsl) / 0.7)`, borderColor: `hsl(var(--color-primary-hsl) / 0.3)` }">
                    <Github size="18" class="transition-transform duration-300 group-hover:scale-110" />
                    <span>GitHub</span>
                  </a>
                  <a href="https://linkedin.com/in/Kampe" target="_blank" class="flex items-center gap-3 transition-all duration-300 group text-sm font-medium px-3 py-2 border rounded hover:bg-slate-900/40" :style="{ color: `hsl(var(--color-secondary-hsl) / 0.7)`, borderColor: `hsl(var(--color-secondary-hsl) / 0.3)` }">
                    <Linkedin size="18" class="transition-transform duration-300 group-hover:scale-110" />
                    <span>LinkedIn</span>
                  </a>
                  <a href="https://twitter.com/NickKampe" target="_blank" class="flex items-center gap-3 transition-all duration-300 group text-sm font-medium px-3 py-2 border rounded hover:bg-slate-900/40" :style="{ color: `hsl(var(--color-primary-hsl) / 0.7)`, borderColor: `hsl(var(--color-primary-hsl) / 0.3)` }">
                    <Twitter size="18" class="transition-transform duration-300 group-hover:scale-110" />
                    <span>Twitter/X</span>
                  </a>
                  <a href="https://bitbucket.org/Kampe" target="_blank" class="flex items-center gap-3 transition-all duration-300 group text-sm font-medium px-3 py-2 border rounded hover:bg-slate-900/40" :style="{ color: `hsl(var(--color-secondary-hsl) / 0.7)`, borderColor: `hsl(var(--color-secondary-hsl) / 0.3)` }">
                    <svg size="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110"><path d="M6 7c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V7Z"/><path d="M6 17c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v0c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v0Z"/></svg>
                    <span>BitBucket</span>
                  </a>
                  <a href="https://stackoverflow.com/users/201297/nickkampe" target="_blank" class="flex items-center gap-3 transition-all duration-300 group text-sm font-medium px-3 py-2 border rounded hover:bg-slate-900/40" :style="{ color: `hsl(var(--color-primary-hsl) / 0.7)`, borderColor: `hsl(var(--color-primary-hsl) / 0.3)` }">
                    <svg size="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110"><path d="M6.5 12h11M6.5 16h11M8 19h8M8 8h8M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/></svg>
                    <span>Stack Overflow</span>
                  </a>
                  <a href="https://angel.co/Kampe" target="_blank" class="flex items-center gap-3 transition-all duration-300 group text-sm font-medium px-3 py-2 border rounded hover:bg-slate-900/40" :style="{ color: `hsl(var(--color-secondary-hsl) / 0.7)`, borderColor: `hsl(var(--color-secondary-hsl) / 0.3)` }">
                    <svg size="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M9 12h6"/></svg>
                    <span>AngelList</span>
                  </a>
                  <a href="https://quora.com/Nick-Kampe" target="_blank" class="flex items-center gap-3 transition-all duration-300 group text-sm font-medium px-3 py-2 border rounded hover:bg-slate-900/40" :style="{ color: `hsl(var(--color-primary-hsl) / 0.7)`, borderColor: `hsl(var(--color-primary-hsl) / 0.3)` }">
                    <svg size="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm3.43-5.71C15.5 12.5 14 14.02 14 15.5v.5h-2v-.5c0-2.23 1.77-3.82 4-4.13V9.62c0-.88-.56-1.62-1.5-1.62-.95 0-1.5.75-1.5 1.62h-2c0-2.02 1.45-3.62 3.5-3.62 2.1 0 3.5 1.6 3.5 3.62v3.36z"/></svg>
                    <span>Quora</span>
                  </a>
                  <a href="https://facebook.com/NickKampe" target="_blank" class="flex items-center gap-3 transition-all duration-300 group text-sm font-medium px-3 py-2 border rounded hover:bg-slate-900/40" :style="{ color: `hsl(var(--color-secondary-hsl) / 0.7)`, borderColor: `hsl(var(--color-secondary-hsl) / 0.3)` }">
                    <Facebook size="18" class="transition-transform duration-300 group-hover:scale-110" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
              <div>
                <h3 class="font-bold mb-0 uppercase tracking-wider text-xs md:text-sm flex items-center gap-2" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">
                  <span>▸ CONNECT WITH ME</span>
                  <span class="flex-1 h-px" :style="{ backgroundImage: `linear-gradient(to right, hsl(var(--color-primary-hsl) / 0.5), transparent)` }"></span>
                </h3>
              </div>
              <div>
                <template v-if="formSuccess">
                  <div class="flex flex-col items-center justify-center py-12 text-center" style="animation: slideInUp 0.4s ease-out;">
                    <div class="text-4xl md:text-5xl mb-4" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">✓</div>
                    <h3 class="text-lg md:text-xl font-bold mb-2" :style="{ color: `hsl(var(--color-primary-hsl) / 1)` }">Message Submitted!</h3>
                    <p class="text-sm md:text-base text-white/70">Thanks for reaching out. I'll get back to you shortly.</p>
                  </div>
                </template>
                <form v-else @submit.prevent="submitForm" class="space-y-3 md:space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <input id="contact-name" name="name" v-model="form.name" type="text" placeholder="Your Name" class="w-full px-4 md:px-5 py-2 md:py-3 bg-slate-900/60 border-2 text-white placeholder-slate-500 focus:outline-none focus:bg-slate-900/80 transition-all duration-300 text-xs md:text-sm font-light" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.5)` }" required />
                    <input id="contact-email" name="email" v-model="form.email" type="email" placeholder="Your Email" class="w-full px-4 md:px-5 py-2 md:py-3 bg-slate-900/60 border-2 text-white placeholder-slate-500 focus:outline-none focus:bg-slate-900/80 transition-all duration-300 text-xs md:text-sm font-light" :style="{ borderColor: `hsl(var(--color-secondary-hsl) / 0.5)` }" required />
                  </div>
                  <textarea id="contact-message" name="message" v-model="form.message" placeholder="Your Message" rows="5" class="w-full px-4 md:px-5 py-2 md:py-3 bg-slate-900/60 border-2 text-white placeholder-slate-500 focus:outline-none focus:bg-slate-900/80 transition-all duration-300 resize-none text-xs md:text-sm font-light" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 0.5)` }" required></textarea>
                  <button id="contact-submit" type="submit" class="w-full px-6 md:px-8 py-3 md:py-4 font-bold transition-all duration-300 text-xs md:text-sm uppercase tracking-widest text-black shadow-lg border-2 flex items-center justify-center gap-2" :style="{ backgroundImage: `linear-gradient(to right, hsl(var(--color-primary-hsl) / 0.6), hsl(var(--color-secondary-hsl) / 0.6))`, borderColor: `hsl(var(--color-primary-hsl) / 0.5)`, boxShadow: `0 0 30px hsl(var(--color-primary-hsl) / 0.25)` }">
                    <Send size="20" />SEND MESSAGE
                  </button>
                </form>
              </div>
            </div>
          </template>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import gsap from 'gsap'
import { Send, X, Github, Linkedin, Twitter, Facebook } from 'lucide-vue-next'
import VectorCloudHero from './components/art/VectorCloudHero.vue'
import { getRandomPalette, applyPaletteToDOM } from './utils/colorPalettes'
import { trackPageView } from './utils/analytics'

const activeSection = ref<string | null>(null)
const form = ref({ name: '', email: '', subject: '', message: '' })
const formSuccess = ref(false)
const formError = ref(false)
const navRef = ref<HTMLElement | null>(null)
const navAboutRef = ref<HTMLElement | null>(null)
const navSkillsRef = ref<HTMLElement | null>(null)
const navResumeRef = ref<HTMLElement | null>(null)
const navContactRef = ref<HTMLElement | null>(null)
const currentPalette = ref(getRandomPalette())

const trackCurrentPage = () => {
  const pagePath = `${window.location.pathname}${window.location.search}${window.location.hash}`
  trackPageView(pagePath)
}

// Sync URL hash with active section
watch(activeSection, (newSection) => {
  if (newSection) {
    window.location.hash = newSection
  } else {
    window.location.hash = ''
  }
})

// Handle browser back/forward navigation
const handleHashChange = () => {
  const hash = window.location.hash.slice(1)
  const validSections = ['about', 'skills', 'resume', 'contact']
  activeSection.value = validSections.includes(hash) ? hash : null
  trackCurrentPage()
}

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
      formSuccess.value = true

      // Close modal after 2 seconds
      setTimeout(() => {
        activeSection.value = null
        formSuccess.value = false
      }, 2000)
    } else {
      formError.value = true
      setTimeout(() => {
        formError.value = false
      }, 3000)
    }
  } catch (error) {
    formError.value = true
    setTimeout(() => {
      formError.value = false
    }, 3000)
  }
}

onMounted(async () => {
  // Wait for DOM to fully render
  await nextTick()

  // Handle initial URL hash for deep linking
  const hash = window.location.hash.slice(1)
  const validSections = ['about', 'skills', 'resume', 'contact']
  if (validSections.includes(hash)) {
    activeSection.value = hash
  }

  // Listen for browser back/forward navigation
  window.addEventListener('hashchange', handleHashChange)
  trackCurrentPage()

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

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
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
  border-left: 1px solid hsl(var(--color-primary-hsl) / 0.15);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, hsl(var(--color-primary-hsl) / 1), hsl(var(--color-secondary-hsl) / 1));
  border-radius: 0;
  border-left: 2px solid hsl(var(--color-primary-hsl) / 0.8);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, hsl(var(--color-primary-hsl) / 0.9), hsl(var(--color-accent-hsl) / 1));
  box-shadow: inset 0 0 6px hsl(var(--color-primary-hsl) / 0.5);
}

/* Firefox scrollbar styling */
* {
  scrollbar-color: hsl(var(--color-primary-hsl) / 0.8) rgba(15, 23, 42, 0.8);
  scrollbar-width: thin;
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
