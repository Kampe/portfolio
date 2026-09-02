export interface CaseStudy {
  slug: string
  client: string
  title: string
  summary: string
  challenge: string
  approach: string[]
  outcomes: string[]
  stack: string[]
}

export interface Experience {
  role: string
  company: string
  period: string
  summary: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'yuga-platform',
    client: 'Yuga Labs',
    title: 'A self-service platform for product engineers',
    summary: 'A GitOps internal developer platform that moved infrastructure delivery from tickets to repeatable, governed workflows.',
    challenge: 'More than 50 engineers needed a safer, faster path to cloud infrastructure while platform teams also supported global DNS, game-development tooling, and legacy modernization.',
    approach: [
      'Designed an internal developer platform around Crossplane, Argo CD, and Backstage.',
      'Turned infrastructure standards into reusable, self-service workflows with GitOps review and auditability.',
      'Modernized legacy workloads toward cloud-native Kubernetes and strengthened the supporting observability stack.',
    ],
    outcomes: [
      'Enabled 50+ engineers to provision infrastructure without a platform-team bottleneck.',
      'Created a consistent path from infrastructure request to reviewed, declarative delivery.',
      'Supported global DNS and CI/CD systems used by high-scale game-development teams.',
    ],
    stack: ['Kubernetes', 'Crossplane', 'Argo CD', 'Backstage', 'GitOps', 'Grafana'],
  },
  {
    slug: 'powerflex-multicloud',
    client: 'PowerFlex / EDF Renewables',
    title: 'Reliable multi-cloud systems for renewable-energy operations',
    summary: 'A cloud-native operating model spanning edge, on-premises, and three public clouds for renewable-energy monitoring.',
    challenge: 'Distributed energy systems required repeatable environments, stronger reliability practices, and clearer operational visibility across a heterogeneous estate.',
    approach: [
      'Deployed containerized environments across GKE, EKS, and AKS with consistent service and secrets controls.',
      'Established SRE, GitOps, distributed-tracing, and chaos-engineering practices across teams.',
      'Designed distributed data and delivery systems for edge-to-cloud monitoring workloads.',
    ],
    outcomes: [
      'Standardized delivery across Google Cloud, AWS, Azure, edge, and on-premises environments.',
      'Reduced avoidable cloud waste by migrating workloads to more appropriate cloud-native services.',
      'Improved team ownership through SRE coaching, product roadmaps, and observable delivery workflows.',
    ],
    stack: ['GKE', 'EKS', 'AKS', 'Istio', 'Vault', 'Argo CD', 'OpenTelemetry'],
  },
  {
    slug: 'emerson-iot',
    client: 'Emerson',
    title: 'Modernizing a connected-device platform',
    summary: 'A migration from Rackspace to AWS that connected IoT products, customer experiences, and internal operations.',
    challenge: 'A growing connected-device ecosystem needed modern APIs, scalable cloud foundations, and fewer manual support workflows.',
    approach: [
      'Architected a microservice migration to AWS and built REST and streaming interfaces.',
      'Integrated Amazon Alexa, Google Home, IFTTT, Salesforce, and IoT systems.',
      'Built multi-tenant management portals, installation workflows, and internal self-service tooling.',
    ],
    outcomes: [
      'Moved core workloads to a scalable AWS platform.',
      'Expanded the connected-product ecosystem across major home-automation platforms.',
      'Reduced operational friction with self-service dashboards and support tooling.',
    ],
    stack: ['AWS', 'ECS', 'Lambda', 'Node.js', 'React', 'IoT', 'Salesforce'],
  },
]

export const experience: Experience[] = [
  { role: 'Staff DevOps Engineer', company: 'Yuga Labs', period: 'May 2023 – Present', summary: 'Leading platform engineering, internal developer-platform delivery, cloud-native modernization, global DNS, observability, and game-development infrastructure.' },
  { role: 'Manager, Site Reliability / Core Infrastructure', company: 'Kraken Digital Asset Exchange', period: 'Sep 2022 – May 2023', summary: 'Led infrastructure engineers, strengthened security and risk practices, automated triage and remediation, and improved operational visibility.' },
  { role: 'Principal & Senior Site Reliability Engineer', company: 'PowerFlex Systems / EDF Renewables', period: 'Sep 2019 – Aug 2022', summary: 'Established SRE practices, ran multi-cloud Kubernetes platforms, reduced cloud waste, and coached teams in GitOps, testing, tracing, and resilient delivery.' },
  { role: 'Senior Software Engineer', company: 'EDF Renewables', period: 'Sep 2018 – Sep 2019', summary: 'Architected distributed edge-to-cloud systems for renewable-energy monitoring and built machine-learning and continuous-delivery pipelines.' },
  { role: 'Agile Engineer & Software Engineer', company: 'Emerson', period: 'Nov 2014 – Sep 2018', summary: 'Migrated connected-device services to AWS, built product integrations and APIs, and created multi-tenant customer and internal self-service tools.' },
]

export const expertise = [
  { title: 'Platform engineering', copy: 'Internal developer platforms, golden paths, Backstage, Crossplane, GitOps, and paved-road automation.' },
  { title: 'Cloud & Kubernetes', copy: 'AWS, Google Cloud, Azure, Kubernetes, service mesh, networking, delivery, and workload modernization.' },
  { title: 'Reliability & observability', copy: 'SRE operating models, OpenTelemetry, Prometheus, Grafana, Loki, Tempo, incident response, and capacity.' },
  { title: 'Security & supply chain', copy: 'Zero-trust design, identity, secrets, policy, software provenance, container hardening, and risk-based controls.' },
  { title: 'Infrastructure as code', copy: 'Terraform, OpenTofu, Crossplane, Ansible, Helm, Kustomize, and reviewable lifecycle automation.' },
  { title: 'Engineering systems', copy: 'Go, Python, TypeScript, APIs, event-driven systems, CI/CD, testing, and maintainable automation.' },
]

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Kampe' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/Kampe' },
  { label: 'X / Twitter', href: 'https://twitter.com/NickKampe' },
]
