# Nick Kampe's Portfolio

A cutting-edge portfolio website featuring dynamic WebGL visualizations built with **Three.js**, showcasing expertise in DevOps engineering, infrastructure automation, and cloud-native technologies.

## Overview

This portfolio is designed for **DevOps automation contract engagements**, featuring:

- **Interactive 3D Visualizations** — Charged Magnetosphere particle system (inspired by Robert Hodgin's iconic visualizer)
- **Performance-Optimized** — 60fps rendering on desktop, 30-45fps on mobile
- **Modern Tech Stack** — Vue 3, TypeScript, Vite, Docker
- **Responsive Design** — Works seamlessly on mobile, tablet, and desktop
- **AI-Enhanced** — Leveraging Claude, Gemini, and modern LLMs

## Tech Stack

### Frontend
- **Vue 3** — Progressive JavaScript framework for reactive UIs
- **TypeScript** — Type-safe development
- **Three.js** — WebGL rendering library for 3D graphics
- **GSAP** — Animation library for smooth transitions
- **Tailwind CSS** — Utility-first CSS framework
- **Vite** — Next-generation frontend build tool

### Backend
- **Elysia** — Lightweight, fast Bun HTTP server
- **TypeScript** — End-to-end type safety
- **Bun** — Ultra-fast JavaScript runtime

### Infrastructure
- **Docker** — Containerization for consistent deployments
- **Docker Compose** — Multi-container orchestration

## Features

### Visualizations

**Charged Magnetosphere Theme** (Default)
- Charged particle system with attractive/repulsive forces
- Complementary color pairs randomized at load
- Smooth drift and organic particle interactions
- Perfect backdrop for portfolio content

### Navigation
- Clean, minimal top-right navigation (ABOUT, SKILLS, RESUME, CONTACT)
- Smooth modal overlays with content sections
- Fully responsive on mobile devices

### Content Sections

**About**
- Professional background and expertise summary
- Focus on DevOps automation and contract work
- AI/LLM integration capabilities

**Skills**
- Organized grid of technical expertise
- Cloud platforms (AWS, GCP, Azure)
- Kubernetes and orchestration tools
- Infrastructure-as-Code (Terraform, Ansible, Crossplane)
- Observability stack (Prometheus, Grafana, Loki, Tempo)
- GitOps solutions (ArgoCD, Flux)
- AI/LLM tools (Claude, Gemini, LangChain)

**Resume**
- Professional summary emphasizing DevOps consulting
- Core experience from staff-level roles
- Technical expertise grid
- Education and achievements

**Contact**
- Social links (GitHub, LinkedIn, Twitter)
- Contact form with backend integration
- Email notification support

## Development

### Prerequisites
- **Node.js 18+** or **Bun** runtime
- **Docker** and **Docker Compose**
- **Git**

### Installation

```bash
# Clone repository
git clone <repo-url>
cd portfolio

# Install dependencies (frontend)
cd frontend
npm install    # or: bun install

# Install dependencies (backend)
cd ../backend
npm install    # or: bun install
```

### Local Development

**With Docker (Recommended)**
```bash
docker compose up --build
```

The app will be available at `http://localhost:3001`

**Without Docker**
```bash
# Terminal 1: Frontend (Vite dev server)
cd frontend
npm run dev        # or: bun run dev

# Terminal 2: Backend
cd backend
npm run dev        # or: bun run dev
```

### Project Structure

```
portfolio/
├── frontend/                    # Vue 3 application
│   ├── src/
│   │   ├── components/         # Vue components
│   │   │   └── art/
│   │   │       └── vectorCloud/ # 3D visualization system
│   │   │           └── themes/  # Visualization themes
│   │   ├── styles/             # Global styles & fonts
│   │   ├── App.vue             # Root component
│   │   └── main.ts
│   ├── package.json
│   └── vite.config.ts
├── backend/                     # Elysia HTTP server
│   ├── src/
│   │   ├── routes/             # API endpoints
│   │   └── index.ts            # Server entry point
│   └── package.json
├── Dockerfile                  # Single unified container
├── docker-compose.yml          # Container orchestration
└── README.md                   # This file
```

### Building for Production

```bash
# Build container
docker compose build

# Run in production
docker compose up

# Or deploy image
docker push <registry>/portfolio:latest
```

## Visualization System

### Theme Architecture

The visualization system is modular and extensible:

```
ThemeManager
├── Themes
│   ├── chargedMagnetosphere.ts    (Primary theme)
│   ├── chargedMagnetosphereV2.ts  (Improved iteration)
│   ├── spectrumAnalyzer.ts
│   ├── kaleidoscopeFractals.ts
│   ├── dmtGeometry.ts
│   ├── milkdropMorphing.ts
│   └── vectorFieldFloor.ts
├── Synthesis Engine
│   └── Procedural pattern generation
└── Interaction State
    └── Cursor, click, and scroll handling
```

### Adding New Themes

1. Create a new theme file in `frontend/src/components/art/vectorCloud/themes/`
2. Implement the `createTheme()` export following the pattern in existing themes
3. Register in `themeManager.ts`
4. Optional: Add theme switcher UI

## Performance Optimization

- **DPR Limiting** — Constrained to 1.5× for performance
- **Efficient Particle Physics** — Frame-rate independent deltaTime
- **Bloom Pass Tuning** — Balanced glow without text washout
- **Frustum Culling** — Built-in Three.js optimization
- **Lazy Loading** — Themes loaded on demand

## Deployment

### Docker
```bash
docker compose up --build -d
```

### Health Check
```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"ok","timestamp":"2026-02-16T03:22:53.804Z"}
```

## Configuration

### Frontend
- `frontend/vite.config.ts` — Build and dev server configuration
- `frontend/tailwind.config.js` — Tailwind CSS customization

### Backend
- `backend/src/index.ts` — Server routes and middleware
- `Dockerfile` — Single unified container build

### Environment
- Create `.env` file for environment-specific variables (not committed to git)

## Typography

The site uses a professional font stack:
- **Headings**: Space Grotesk (geometric, modern)
- **Body**: Inter (clean, readable)
- Imported from Google Fonts

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Contact Form
```
POST /api/contact
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Targets

- **Desktop**: 60 FPS with Magnetosphere theme
- **Mobile**: 30-45 FPS with particle physics
- **Page Load**: < 3 seconds
- **Lighthouse**: 90+ score

## Known Limitations

- Particle physics is computationally intensive on low-end devices
- Mobile devices may experience 30-45 FPS instead of 60
- Very large screens (8K+) may require DPR adjustment

## Customization

### Themes
Each theme is fully customizable through `PARAMS` object at the top of theme files. Modify:
- Particle count
- Bloom settings
- Physics parameters
- Color palettes
- Motion speeds

### Colors & Styling
- Global colors: `frontend/src/styles/global.css`
- Component styles: Tailwind classes throughout
- SVG icons: Inline in Vue templates

## Security Considerations

- ✅ No API keys exposed in frontend code
- ✅ `.gitignore` excludes `.env` and secrets
- ✅ Backend validates all input
- ✅ Container runs non-root (build-time verified)

## Contributing

This is a personal portfolio. For suggestions or improvements, please contact directly.

## License

Personal portfolio © 2026 Nick Kampe. All rights reserved.

---

**Built with**: Vue 3 • Three.js • TypeScript • Bun • Docker

**Contact**: [GitHub](https://github.com/Kampe) | [LinkedIn](https://linkedin.com/in/Kampe) | [Twitter](https://twitter.com/NickKampe)
