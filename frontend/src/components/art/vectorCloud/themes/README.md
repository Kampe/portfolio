# Psychedelic Music Visualizer Themes

A modular, experimental Three.js theme system for creating abstract music visualizer experiences without requiring audio input.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   VectorCloudHero.vue                    │
│              (Vue Component + Lifecycle)                 │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│                    ThemeManager                          │
│            (Factory + Theme Lifecycle)                   │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌─────────┐ ┌──────────────┐ ┌──────────────┐
│Spectrum │ │Kaleidoscope  │ │   Milkdrop   │
│Analyzer │ │   Fractals   │ │   Morphing   │
└─────────┘ └──────────────┘ └──────────────┘
    │            │            │
    └────────────┼────────────┘
                 │
    ┌────────────▼────────────┐
    │ SynthesizedPattern       │
    │ (Universal driver)       │
    └─────────────────────────┘
                 │
    ┌────────────▼────────────┐
    │ ThemeInteractionState    │
    │ (Cursor, energy, pulse)  │
    └─────────────────────────┘
```

## Core Concepts

### 1. **Universal Synthesis Engine**

All themes are driven by a single **time-based frequency synthesis engine** that generates:

```typescript
interface SynthesizedPattern {
  frequency: { low, mid, high, peak }  // Frequency bands (0-1)
  spatialFlow: number                  // Movement intensity
  spatialTurbulence: number            // Chaos/variation level
  evolutionPhase: number               // Smooth 0-1 cycling
  morphIntensity: number               // Geometry deformation
  particleEmission: number             // Spawn rate
  particleVelocity: number             // Speed multiplier
  geometryScale: number                // Size modulation
  lightIntensity: number               // Brightness
  colorShift: number                   // Hue rotation (0-1)
}
```

**Why this works**: Each theme interprets these values differently:
- **Spectrum**: Uses `frequency` for bar heights, `colorShift` for gradients
- **Kaleidoscope**: Uses `evolutionPhase` for rotation, `morphIntensity` for zoom
- **Milkdrop**: Uses `spatialFlow` for particle velocity, `morphIntensity` for geometry deformation

### 2. **Interaction State**

All themes receive consistent interaction data:

```typescript
interface ThemeInteractionState {
  cursor: {
    position: THREE.Vector3 | null  // Mouse/touch position in world space
    radius: number                  // Influence radius (50 units)
    strength: number                // Force magnitude (0-1)
  }
  energizedLevel: number            // 0-1, from scroll (2 second decay)
  clickPulse: number                // 0-1, fades from 1 to 0 on click (200ms)
}
```

### 3. **Theme Interface**

Every theme exports a factory function:

```typescript
export const createMyTheme = (
  canvas: HTMLCanvasElement,
  config?: Partial<ThemeConfig>
): ThemeSetupResult => {
  // ... implementation

  return {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    composer?: EffectComposer  // Optional postprocessing
    update: (time, pattern, interaction) => void
    dispose: () => void
  }
}
```

## Three Implemented Themes

### 1. **Spectrum Analyzer** (`spectrumAnalyzer.ts`)

**Aesthetic**: Classic music visualizer with rotating frequency bars

**Visual**:
- 64 cylinders arranged in a circle
- Height driven by synthesized frequency bands
- Colors gradient from hue rotation
- Rotation speed driven by `spatialFlow`

**Interaction**:
- Cursor repulsion: bars push outward when cursor approaches
- Energized state: faster rotation
- Click pulse: all bars scale up briefly

**Performance**: ~60fps
- Low geometry complexity (simple cylinders)
- Bloom postprocessing for glow
- Instanced rendering potential for further optimization

**Tuning Knobs**:
```typescript
barCount: 64              // More bars = higher detail
barRadius: 25            // Circle size
barHeight: 20            // Max height multiplier
rotationSpeed: 0.001     // Base rotation rate
cursorRepulsion: 0.5     // Cursor push strength
bloomStrength: 1.2       // Glow intensity
```

---

### 2. **Kaleidoscope Fractals** (`kaleidoscopeFractals.ts`)

**Aesthetic**: Hypnotic radial symmetry with evolving fractals

**Visual**:
- Fragment shader-based raymarching
- 6-8 fold rotational symmetry (adjustable)
- Mandelbrot-like fractal iteration
- Smooth sine/cosine wave patterns layered on fractals
- Full-screen quad with no geometry overhead

**Technical Approach**:
- Pure GLSL shader (fragment shader only)
- Radial coordinate transformation for symmetry
- Cosine gradient for psychedelic color cycling
- Zoom modulation from `morphIntensity`

**Interaction**:
- Cursor position modulates fractal parameters
- `evolutionPhase` drives continuous rotation
- `colorShift` drives hue cycling

**Performance**: ~60fps
- Fragment shader cost, but zero geometry overhead
- Adaptive shader complexity possible (trade quality for speed)
- No particles, physics, or complex CPU work

**Tuning Knobs**:
```typescript
fractalIterations: 20       // More iterations = more detail (slower)
symmetryFolds: 6            // Radial symmetry count (3-8)
zoomSpeed: 0.00003          // Zoom in/out rate
waveFrequency: [6, 10, 3]   // Pattern frequencies
cursorInfluence: 0.3        // How much cursor distorts fractals
bloomStrength: 1.8          // Higher for psychedelic glow
```

---

### 3. **Milkdrop Morphing** (`milkdropMorphing.ts`)

**Aesthetic**: Organic gooey blobs inspired by iTunes visualizer Milkdrop

**Visual**:
- Two subdivided icospheres with per-vertex deformation
- 1000 particles with physics-based motion (curl noise flow fields)
- Iridescent shader with Fresnel effect
- Internal particle swarms responding to geometry

**Technical Approach**:
- Vertex shader displacement using multi-octave sine waves
- Fragment shader with HSV color space and Fresnel effect
- Particle system with curl noise advection
- Cursor attraction on particles

**Interaction**:
- Geometry morphs more aggressively when energized
- Particles attracted to cursor position
- Click pulse triggers particle emission burst
- Particle color animates with age

**Performance**: ~45-60fps
- Higher cost due to geometry + particles
- Potential bottlenecks:
  - 1000 particles with physics updates per frame
  - Shader compilation on first frame (~100ms)
- Mobile optimization: reduce particle count to 500-750

**Tuning Knobs**:
```typescript
particleCount: 1000         // Fewer = better performance
morphIntensity: 0.5-1.0     // Geometry deformation amount
particleEmission: 0.0-2.0   // Spawn rate
particleDamping: 0.95       // Physics damping (0-1)
cursorAttraction: 0.5       // How strongly particles follow cursor
bloomStrength: 1.5          // Glow
```

---

## How to Add a New Theme

### Step 1: Create Theme File

Create `themes/myNewTheme.ts`:

```typescript
import * as THREE from 'three'
import { SynthesizedPattern } from '../synthesis'
import { ThemeSetupResult, ThemeInteractionState, ThemeConfig } from './themeTypes'

const CONFIG: ThemeConfig = {
  name: 'My New Theme',
  description: 'Describe what it does',
  colors: { /* ... */ },
  performance: { targetFps: 60 },
}

export const createMyNewTheme = (
  canvas: HTMLCanvasElement,
  userConfig?: Partial<ThemeConfig>
): ThemeSetupResult => {
  // Scene setup
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(...)
  const renderer = new THREE.WebGLRenderer({ canvas })

  // Geometry/shaders/particles
  // ... your implementation

  // Update function: receives synthesized pattern + interaction state
  const update = (
    time: number,
    pattern: SynthesizedPattern,
    interaction: ThemeInteractionState
  ) => {
    // Use pattern and interaction to drive animation
    // Update scene objects, materials, camera, etc.
  }

  // Cleanup
  const dispose = () => {
    // Release GPU resources
    // renderer.dispose(), geometry.dispose(), etc.
  }

  return { scene, camera, renderer, update, dispose }
}
```

### Step 2: Register Theme

Edit `themeManager.ts`:

```typescript
import { createMyNewTheme } from './myNewTheme'

const THEME_REGISTRY: Record<ThemeName, ThemeFactory> = {
  spectrum: createSpectrumAnalyzerTheme,
  kaleidoscope: createKaleidoscopeFractalsTheme,
  milkdrop: createMilkdropMorphingTheme,
  mynewtheme: createMyNewTheme,  // Add this
}

export type ThemeName = 'spectrum' | 'kaleidoscope' | 'milkdrop' | 'mynewtheme'
```

### Step 3: Use It

In the browser:
```
http://localhost:5173/?theme=mynewtheme
```

Or via keyboard (if you add keyboard handling):
```typescript
// In VectorCloudHero.vue:
if (event.key === '4') switchTheme('mynewtheme')
```

---

## Interaction Patterns

### Cursor Repulsion
```typescript
// Used in Spectrum Analyzer
const direction = position - cursorPos
const force = normalize(direction) * (1 - distance/radius)
position += force * strength
```

### Cursor Attraction
```typescript
// Used in Milkdrop for particles
const direction = cursorPos - position
const force = normalize(direction) * (1 - distance/radius)
velocity += force * strength
```

### Energy Surge (Scroll)
```typescript
// All themes can use:
if (interaction.energizedLevel > 0) {
  // Increase rotation speed, particle emission, morphing, etc.
  rotationSpeed *= (1 + energizedLevel * 0.5)
}
```

### Click Burst
```typescript
// All themes can use:
if (interaction.clickPulse > 0) {
  // Emit particles, scale geometry, brighten lights, etc.
  scale = 1 + clickPulse * 0.3
}
```

---

## Performance Optimization Tips

### For Fragment Shaders (Kaleidoscope)
- Reduce iteration count: 20 → 10-15
- Simplify waveform equations
- Use pre-computed lookup tables instead of sin/cos

### For Particle Systems (Milkdrop)
- Use GPU compute shaders for 5000+ particles (WebGL2 only)
- Spatial partitioning (octree) for neighbor queries
- LOD: reduce particle count on mobile

### For Geometry (Spectrum, Milkdrop)
- Use `InstancedMesh` instead of individual meshes
- Limit mesh subdivision on mobile
- Avoid recalculating geometry every frame

### General
- Cap `window.devicePixelRatio` to 1.5 (saves 4x pixels on high-DPI)
- Use `OrthographicCamera` when possible (faster)
- Disable shadow maps and environment maps
- Use bloom sparingly (high cost)

---

## Debugging

### Enable Debug HUD
```
http://localhost:5173/?debug=1
```

Shows:
- Current theme name
- FPS
- Particle count
- Energized level
- Theme switching buttons (click or press 1/2/3)

### Profiling
```javascript
// In browser console:
const perf = performance.measureUserAgentSpecificMemory()
console.log(perf.usedJSHeapSize / 1048576, 'MB')
```

### Visual Debugging
- Use `renderer.wireframe = true` on geometries
- Render normals as colors (good visualization)
- Visualize cursor influence radius

---

## Future Theme Ideas

Already designed (ready to implement):

1. **Fluid Dynamics**: Smoke/ink advection with curl noise
2. **Reaction-Diffusion**: Self-organizing Turing patterns
3. **Oscilloscope**: Lissajous curves in 3D
4. **Particle Flocking**: Emergent swarm behavior
5. **Cloth Simulation**: Wind-driven fabric physics

---

## Performance Targets

| Theme | Desktop | Mobile | Notes |
|-------|---------|--------|-------|
| Spectrum | 60fps | 60fps | Very light |
| Kaleidoscope | 60fps | 45fps | Shader-bound on mobile |
| Milkdrop | 60fps | 30-45fps | Particle-bound on mobile |

Adaptive quality:
- Desktop (DPR=2): Full quality
- Mobile (DPR=1): Reduced particle count, simpler shaders

---

## References

- **Synthesis Engine**: `../synthesis.ts` - Universal pattern generator
- **Noise Functions**: `../noise.ts` - Perlin, Curl, Simplex
- **Cursor Physics**: `./cursorInteraction.ts` - Reusable force calculations
- **Vue Integration**: `../VectorCloudHero.vue` - Theme loading and lifecycle

---

## Creative Guidelines

When designing a new theme:

1. **One hero system**: One dominant visual idea (geometry, shader, particles)
2. **Support the synthesis pattern**: Map synthesized values meaningfully to your visuals
3. **Psychedelic aesthetic**: Neon colors, bloom, moving forms, hypnotic motion
4. **Responsive to interaction**: Cursor, scroll, and click should noticeably affect visuals
5. **Performance conscious**: Know your bottleneck and optimize there
6. **Unique visual signature**: Avoid looking like generic Three.js tutorials

---

Built with ❤️ for interactive art. Enjoy experimenting!
