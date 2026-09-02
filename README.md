# Nick Kampe portfolio

A proof-led platform-engineering portfolio for [nickkampe.com](https://nickkampe.com). The site pairs statically rendered case studies with an optional generative WebGL lab and a small Bun contact API.

## What the site includes

- Static, crawlable pages for the homepage, work, case studies, expertise, resume, contact, lab, and privacy
- Case studies based on real work at Yuga Labs, PowerFlex / EDF Renewables, and Emerson
- Route-specific titles, descriptions, canonical links, sitemap entries, structured data, social preview art, and install icons
- Responsive navigation, semantic landmarks, visible form labels, keyboard focus, reduced-motion support, and automated Axe checks
- Consent-controlled analytics that respects Do Not Track and Global Privacy Control
- A progressive Three.js experience that is skipped on small screens, reduced-motion devices, and data-saver connections
- Server-side validation, body limits, provider timeouts, rate limiting, a honeypot, accurate HTTP errors, secure static paths, security headers, and real 404 responses

## Stack

- Vue 3, Vue Router, TypeScript, Vite, and Vite SSG
- Three.js, isolated behind a dynamic import
- Bun HTTP server and test runner
- Playwright and Axe for browser and accessibility coverage
- Docker, Trivy, Lighthouse CI, Dependabot, and SPDX SBOM generation

## Local development

Requirements: Bun 1.3.13+, a current Chromium installation for browser tests, and Docker only when testing the container.

```zsh
bun install --frozen-lockfile
bun run dev
```

The Vite frontend runs on `http://localhost:5173`; the Bun server runs on `http://localhost:3001`. Vite proxies `/api` requests to the Bun server so the contact flow works in development.

```zsh
bun run build
bun run start
```

The production server is then available at `http://localhost:3001`.

## Quality gates

```zsh
bun run check       # lint, typecheck, unit tests, production build
bun run test:e2e    # desktop and mobile browser + Axe tests
bun audit           # dependency advisory scan
trivy fs --scanners vuln,misconfig,secret --severity HIGH,CRITICAL --ignore-unfixed .
```

Lighthouse budgets live in `.lighthouserc.cjs`. CI enforces performance, accessibility, best-practices, and SEO thresholds on the home, work, and contact pages.

## Configuration

| Variable | Phase | Purpose |
| --- | --- | --- |
| `FORMSPREE_ID` | Runtime | Formspree form identifier. Defaults to the portfolio’s public form ID. |
| `PORT` | Runtime | Bun server port. Defaults to `3001`. |
| `PUBLIC_DIR` | Runtime | Static build directory. Set by the container. |
| `PUBLIC_ORIGIN` | Runtime | Optional canonical origin allowed to submit the contact form when a reverse proxy changes the request host. |
| `VITE_GA_ID` | Build | Google Analytics measurement ID. Defaults to the production property. |

Analytics does not load until a visitor opts in. Contact messages are sent to Formspree only after local validation succeeds. Do not put secrets in frontend variables or contact-form submissions.

## Project layout

```text
frontend/
  public/                 SEO, PWA, security, and social assets
  src/components/         Shared shell, cards, consent, and progressive visual
  src/content/            Typed portfolio content
  src/pages/              Route-level pages
  src/router.ts           Public route map
backend/
  src/routes/contact.ts   Validation and Formspree adapter
  src/server.ts           Static server, API boundary, headers, and 404 handling
e2e/
  tests/                  Product, mobile, form, 404, and Axe coverage
.github/
  workflows/ci.yml        Quality, browser, Lighthouse, image scan, and SBOM jobs
```

The frontend build writes static assets and rendered HTML directly to `backend/public/`. That directory is generated and intentionally ignored by Git.

## Container

The image uses a digest-pinned Bun Alpine base, applies available Alpine security upgrades, carries no runtime package installation, and runs as the unprivileged `bun` user. Compose removes Linux capabilities, prevents privilege escalation, uses a read-only root filesystem, and supplies only a small temporary filesystem.

```zsh
BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ) docker compose build
docker compose up
curl --fail http://127.0.0.1:3001/health
```

CI scans both the repository and final image with Trivy and uploads an SPDX JSON SBOM. Image signing belongs in the registry publishing workflow once a deployment registry is configured; this repository does not claim to sign an image it does not publish.

## Content and design rules

- Do not invent impact metrics. Use a qualitative outcome when a verified number is unavailable.
- Keep work details generalized where confidentiality requires it.
- Treat the lab as optional enhancement, never a prerequisite for reading or navigation.
- Preserve 44px minimum interactive targets, visible focus, useful labels, and reduced-motion behavior.
- Measure any new client-side dependency against the initial bundle and Lighthouse budgets.

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution expectations, [SECURITY.md](SECURITY.md) for private vulnerability reporting, and [LICENSE](LICENSE) for usage terms.
