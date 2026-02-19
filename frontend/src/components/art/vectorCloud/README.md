# Vector Cloud Hero

A premium, fullpage Three.js hero component for the portfolio site. Creates a soft, organic 3D particle cloud that responds to user interactions.

## Concept

**Soft Vector Cloud Field** — A dense point cloud (4000 particles) flowing through 3D space via curl noise, rendered as soft, glowing discs. No hard edges or rigid geometries. Responds to pointer movement, clicks, and scroll events.

### Visual Characteristics

- **Primary**: Cyan (#00d4ff) → Secondary: Blue (#3b82f6) → Tertiary: Purple (#a855f7)
- **Rendering**: Custom shader with radial fade (Gaussian falloff)
- **Depth**: Fog effect + distance-based transparency for atmospheric layering
- **Blending**: Additive (particles glow and blend together)
- **Performance**: ~4000 particles at 60 FPS on typical laptops

## Architecture

### File Structure

```
vectorCloud/
  ├── README.md              # This file
  ├── config.ts              # Tunable parameters & reduced-motion detection
  ├── scene.ts               # Three.js scene setup & update loop
  ├── particles.ts           # Particle system & curl noise simulation
  ├── shaders.ts             # Custom soft-disc shader material
  ├── noise.ts               # 3D Perlin noise & curl noise implementation
  └── debug.ts               # Optional debug HUD utilities
```

### Key Components

#### `config.ts` — Configuration

All tunable parameters in one place:

```typescript
export interface VectorCloudConfig {
  particleCount: number              // Default: 4000
  noiseStrength: number              // Curl noise amplitude
  speed: number                      // Animation speed multiplier
  pointerAttractionRadius: number    // Interaction radius
  pointerAttractionStrength: number  // Interaction force
  primaryColor: string               // Cyan
  secondaryColor: string             // Blue
  tertiaryColor: string              // Purple
  dprCap: number                     // Max device pixel ratio
  enableBloom: boolean               // Postprocessing (default: false)
  calmSpeedMultiplier: number        // Default: 1.0
  energizedSpeedMultiplier: number   // On scroll: 2.5x
  clickPulseDuration: number         // 200ms compression pulse
  clickPulseIntensity: number        // Pulse strength
  reducedMotionParticleCount: number // ~2000 for a11y
  reducedMotionSpeed: number         // Half speed
}
```

**Reduced Motion Detection**:
- Automatically detects `prefers-reduced-motion: reduce` media query
- Halves particle count and reduces animation speed
- Disables click pulse intensity
- Keeps colors and softness for visual appeal

#### `scene.ts` — Scene Setup

- Initializes Three.js scene, camera, renderer
- Creates particle geometry and buffer attributes
- Clamps DPR (device pixel ratio) to max 2.0 for performance
- Exposes `update()` function for each-frame simulation
- Returns setup object with scene, camera, renderer, particles

#### `particles.ts` — Particle System

- **Initialization**: Creates 4000–6000 particles in a bounding volume
- **Simulation**: Per-particle curl noise motion each frame
- **Interactions**:
  - **Pointer**: Soft attraction field (50-unit radius)
  - **Click**: 200ms compression pulse toward center
  - **Scroll**: Speed boost for 2 seconds (calm → energized)
- **Soft Constraints**: Particles bounce gently at volume edges

#### `shaders.ts` — Custom Shaders

**Vertex Shader**:
- Computes point size based on depth (perspective)
- Interpolates color gradient (cyan → blue → purple) based on depth
- Passes depth and distance to fragment shader

**Fragment Shader**:
- Ultra-soft circular disc via Gaussian falloff: `exp(-dist² × 5)`
- Depth-based fade for layering
- Distance-based fog effect for atmosphere
- Additive blending makes particles glow

#### `noise.ts` — Procedural Noise

- **Perlin Noise**: 3D implementation with permutation tables
- **Curl Noise**: Smooth vector field derived from noise gradients
- **Multi-Octave**: Combines 3 octaves of curl noise for rich motion
- No external dependencies—pure TypeScript implementation

#### `debug.ts` — Debug Utilities

- Optional on-screen HUD (activate with `?debug=1`)
- Displays FPS, particle count, elapsed time, energized level
- Pure DOM (no heavy libraries)

## Interactions

### Pointer Movement
- Mouse position tracked in 3D space
- Particles within 50 units are gently attracted toward cursor
- Smooth interpolation prevents jittery motion

### Click
- 200ms compression pulse: particles move toward center
- Pulse intensity fades over duration
- Then relax back to normal noise-driven motion

### Scroll / Wheel
- Triggers 2-second "energized" state
- Animation speed increases to 2.5x normal
- Particle motion becomes more dramatic
- Smoothly transitions back to calm

### Keyboard / Mobile
- No keyboard-specific interactions
- Touch events trigger click pulses (if desired)
- Responsive on mobile but with reduced particle count

## Performance

### Optimization Strategies

1. **No Geometry Rebuild**: Position updates via buffer attribute only
2. **Frustum Culling**: Three.js handles automatically
3. **DPR Capping**: Max device pixel ratio set to 2.0
4. **Additive Blending**: Reduces fillrate vs. alpha blending
5. **Fog**: Reduces visible particle count at distance
6. **Reduced Motion**: Cuts particle count to 2000, halves speed

### Target Performance

- **Desktop (MacBook/Windows laptop)**: 4000 particles @ 60 FPS
- **Mobile (iPhone/Android)**: 2000 particles @ 60 FPS
- **Low-end Laptops**: Degradation to ~2000 particles if needed

### Benchmarks

- **Vertex Computation**: Simple; no expensive operations
- **Fragment Computation**: Gaussian falloff + depth fade (cheap)
- **JavaScript Simulation**: Curl noise per-particle; ~0.5ms per frame for 4000 particles
- **Memory**: ~48 KB for position buffer + 48 KB for velocity buffer = ~100 KB total

## Customization

### Tuning Parameters

Edit `config.ts` to adjust:

```typescript
// Slow down animation, increase particle count for a "dense" feel
particleCount: 5000,
speed: 0.2,
noiseStrength: 1.2,

// More energized response to scroll
energizedSpeedMultiplier: 3.0,

// Stronger pointer interaction
pointerAttractionStrength: 0.25,

// Different color palette
primaryColor: '#ff00ff',
secondaryColor: '#00ffff',
tertiaryColor: '#ffff00',
```

### Runtime Tuning (Development)

```typescript
import { updateVectorCloudConfig } from './config'

// In console or from external UI:
updateVectorCloudConfig({
  particleCount: 3000,
  speed: 0.5,
  pointerAttractionStrength: 0.2
})
```

### Color Customization

The shader interpolates between three colors based on particle depth. To change:

1. Update `config.ts` color values
2. Colors flow: primary (foreground) → secondary (mid) → tertiary (background)
3. Additive blending means colors mix—choose cohesive palettes

## Accessibility

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  /* Component automatically detects this and: */
  /* - Reduces particle count to 2000 */
  /* - Halves animation speed */
  /* - Disables click pulse visual effects */
  /* - Keeps colors and softness */
}
```

**Testing**:

```bash
# macOS
defaults write com.apple.universalaccessibility reduceMotionEnabled -bool true

# Then refresh browser; hero should have fewer particles and slower motion
```

## Deployment

### Docker Build

```bash
docker build -t portfolio:latest .
docker run -p 3001:3001 portfolio:latest
```

### Vite Build

```bash
npm run build:frontend
```

Output: `backend/public/` with minified Three.js + Vue components.

## Known Limitations

1. **No raymarching**: Soft discs only; no volumetric effects
2. **No postprocessing bloom**: Could add for extra glow, but disabled by default for performance
3. **Static camera position**: Camera doesn't move; only particles respond to interactions
4. **No touch events**: Click pulses work; swipe/pinch not implemented
5. **No audio reactivity**: Could add waveform interaction in future

## Future Enhancements

- Optional bloom postprocessing for extra softness
- Touch gestures (swipe → particle push)
- Audio-reactive mode (beat detection → pulse)
- Configurable particle shapes (not just discs)
- Path-following particles (particles flow along invisible splines)
- Dynamic color palettes (time-based or user-selected)

## References

- **Three.js Docs**: https://threejs.org/
- **Curl Noise Paper**: https://www.upvector.com/?p=346
- **Perlin Noise**: https://en.wikipedia.org/wiki/Perlin_noise
- **Shader Development**: https://www.shadertoy.com/

## Debug Mode

Activate with `?debug=1`:

```
http://localhost:3001/?debug=1
```

Shows:
- FPS (60 target)
- Particle count
- Elapsed time
- Energized level (0–1)

## Support

For issues or questions, check:
1. Browser console for errors
2. Rebuild Docker image if changes don't appear
3. Test with `?debug=1` to see live metrics
4. Verify `prefers-reduced-motion` detection on slow devices
