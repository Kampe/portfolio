# Theme Tuning Guide

Quick reference for tweaking visual parameters to achieve different moods/aesthetics.

## Spectrum Analyzer

### Layout & Structure
```typescript
barCount: 64                    // 32 = sparse, 128 = dense detail
barRadius: 25                   // How far from center circle is
barGeometry: CylinderGeometry(0.6, 0.6, 10, 16)
                               // (bottomRadius, topRadius, height, segments)
```

### Motion & Energy
```typescript
baseRotationSpeed: pattern.spatialFlow * 0.005
                               // Adjust multiplier: 0.002 = slow, 0.01 = fast
energizedRotationBoost: 0.01   // Extra rotation when scrolling
barHeightDamping: 0.92         // 0.95 = floaty, 0.85 = snappy
barHeightResponsiveness: 0.15  // Higher = instant, lower = smooth
```

### Colors
```typescript
colorMode: 'hsl'               // Use HSL for easy cycling
hueRange: full                 // 0-1, cycles through rainbow
saturation: 0.8 + flow * 0.2   // Base saturation
lightness: 0.5 + intensity * 0.1
```

### Glow & Lights
```typescript
bloomStrength: 1.2             // 0.5 = subtle, 2.0 = intense glow
bloomRadius: 0.3               // Spread of bloom
ambientLight: 0x1a3a5a, 0.6    // Dark blue baseline
pointLight1: 0xff006e, 2, 100  // Magenta point light
pointLight2: 0x00d4ff, 2, 100  // Cyan point light
```

### Interaction
```typescript
cursorRepulsion: {
  radius: 50                   // How far cursor affects bars
  strength: 0.5                // 0.2 = gentle push, 1.0 = violent
  falloff: 'smooth'            // linear, quadratic, smooth
}
```

---

## Kaleidoscope Fractals

### Symmetry & Pattern
```typescript
symmetryFolds: 6               // 3 = triangle, 6 = hexagon, 8 = octagon
                               // Change based on: int(2 + morphIntensity * 6)

fractalIterations: 20          // 10 = fast/blurry, 30 = slow/detailed
mandelbrotZoom: zoomAmount     // 1.0 = no zoom, increases over time
```

### Wave Patterns
```typescript
waveFrequency: [6.0, 10.0, 3.0]  // [angle_freq, radius_freq, time_freq]
waveAmplitude: 0.5                // 0.2 = subtle ripples, 1.0 = violent
wavePattern: sin/cos combinations
```

### Color & Psychedelia
```typescript
cosineGradient: (t) => {
  // Creates smooth color cycling
  return cos(6.28 * (vec3 + t)) * 0.5 + 0.5
}
hueShiftSpeed: colorShift       // Driven by synthesis pattern
saturation: 0.8-1.0             // Always high for psychedelic
```

### Glow & Post-Processing
```typescript
bloomStrength: 1.8              // High = intense psychedelic glow
bloomRadius: 0.5                // Spread of bloom
bloomThreshold: 0.7             // Only brightest parts glow
toneMapping: ACESFilmic         // Professional color grading
toneMappingExposure: 1.5        // Brightness multiplier
```

### Interaction
```typescript
cursorInfluence: 0.3            // 0 = ignore cursor, 1.0 = extreme distortion
cursorInfluenceBlending: 'add'  // Add cursor effect to fractal coordinates
```

### Quality vs Performance
```typescript
// For slower systems:
fractalIterations: 10           // Reduce iterations
bloomRadius: 0.2                // Less expensive blur
bloomThreshold: 0.8             // Fewer pixels blooming

// For high-end:
fractalIterations: 30           // Maximum detail
bloomRadius: 0.7                // Smoother, more expensive
bloomThreshold: 0.6             // More areas glowing
```

---

## Milkdrop Morphing

### Geometry & Deformation
```typescript
primaryBlobGeometry: IcosahedronGeometry(10, 6)
                                // (radius, subdivisions)
                                // Higher subdivisions = smoother but slower
secondaryBlobGeometry: IcosahedronGeometry(6, 5)

morphIntensity: pattern.morphIntensity + energized * 0.3
                                // How much vertices displace
deformationOctaves: 3           // Sin/cos layering for complexity
deformationSpeed: time * 0.0001 // Time coefficient for animation
```

### Vertex Deformation (Shader)
```glsl
// In blobVertexShader
displaced += normal * sin(time * 0.0001 + pos.x * 0.1) * morph;
displaced += normal * cos(time * 0.00015 + pos.y * 0.1) * morph * 0.7;
displaced += normal * sin(time * 0.00008 + pos.z * 0.1) * morph * 0.5;

// Tuning:
// Increase time multipliers (0.0001 → 0.0002) = faster deformation
// Decrease morph multipliers = less dramatic morphing
// Add more sine/cos layers = more complexity
```

### Particle System
```typescript
particleCount: 1000             // Mobile: 500-750, Desktop: 1000-2000
particleLifespan: 2-3 seconds   // How long particles live
particleSpawnRadius: 40         // Initial spawn zone size
particleMaxSpeed: 5.0           // Maximum velocity
particleDamping: 0.95           // Friction (0.90 = snappy, 0.98 = floaty)
```

### Particle Physics
```typescript
// Curl Noise Advection
curveNoiseScale: 0.05           // 0.02 = large smooth flows, 0.1 = small chaotic
curlNoiseSpeed: 0.0001          // Faster = more dynamic, slower = more stable

// Cursor Attraction
cursorAttractionStrength: 0.5   // How strongly particles follow cursor
cursorAttractionRadius: 50      // How far cursor pulls particles

// Central Gravity
centralGravity: enabled when energized  // Pulls particles toward center
centralGravityStrength: 0.1
```

### Colors & Iridescence
```typescript
// Fragment Shader (iridescence)
fresnel: pow(1 - dot(view, normal), 2.0)  // Edge glow
hueFromNormal: fresnel * 0.3  // Normal direction influences hue
saturation: 0.8 + sin(time) * 0.2

// Particle Colors
particleColorFromAge: hue shifts as particle ages
particleColorFromVelocity: optional velocity-based coloring
```

### Lighting & Glow
```typescript
ambientLight: 0x1a3a5a, 0.5    // Dark blue base
pointLight1: 0xff006e, 2.5     // Magenta
pointLight2: 0x00d4ff, 2.5     // Cyan

// Dynamic
lightIntensity *= (2.5 + pattern.lightIntensity * 1.5)

// Postprocessing
bloomStrength: 1.5              // Glow
bloomRadius: 0.4                // Spread
toneMapping: ACESFilmic         // Professional
```

### Camera Movement
```typescript
cameraX: Math.sin(time * 0.00005) * 10  // Orbital drift
cameraY: Math.cos(time * 0.00003) * 5

// Tuning:
// Increase time multipliers = faster drift
// Increase position multipliers = wider orbit
```

### Interaction
```typescript
// Scroll (Energized)
energizedLevel > 0: {
  morphing: increase
  rotation: faster
  lighting: brighter
}

// Click (Pulse)
clickPulse > 0: {
  geometry scale: 1 + pulse * 0.3
  particle emission: burst
}
```

### Performance Optimization
```typescript
// For 60fps on mobile:
particleCount: 500              // Reduce from 1000
bloomStrength: 1.0              // Reduce from 1.5
blobSubdivisions: 5             // Reduce from 6
curlNoiseScale: 0.1             // Reduce iterations

// For high-end setups:
particleCount: 2000             // Increase
bloomStrength: 2.0              // Enhance glow
blobSubdivisions: 7             // Smoother geometry
particleDamping: 0.98           // Floatier motion
```

---

## Universal Parameters

### Synthesis-Driven (All Themes)
```typescript
pattern.frequency.low            // Bass, foundational
pattern.frequency.mid            // Musical center
pattern.frequency.high           // Treble, sparkle
pattern.frequency.peak           // Dramatic spikes
pattern.spatialFlow              // Movement intensity
pattern.spatialTurbulence        // Chaos level
pattern.evolutionPhase           // 0-1 smooth cycle
pattern.morphIntensity           // Deformation amount
pattern.colorShift               // Hue rotation
pattern.lightIntensity           // Overall brightness
```

### Interaction-Driven (All Themes)
```typescript
interaction.energizedLevel       // 0-1, from scroll (2s decay)
interaction.clickPulse           // 0-1, fades from click (200ms)
interaction.cursor.position      // Mouse/touch 3D position
interaction.cursor.strength      // Influence magnitude
interaction.cursor.radius        // Influence zone size
```

---

## Experimentation Workflow

### Step 1: Baseline
1. Keep defaults from implementation
2. Run at ?debug=1 to see current theme
3. Note FPS baseline

### Step 2: Tweak One Parameter
```javascript
// In browser console, modify directly:
// (Requires exporting parameters or hot reload)

// Or edit source and:
pnpm run dev    // Hot reload picks up changes
```

### Step 3: Measure Impact
- Does it feel better or worse?
- Does performance degrade?
- Is it more hypnotic or more chaotic?

### Step 4: Find the Sweet Spot
- Adjust incrementally (+/- 20%)
- Listen to your intuition
- Trust the vibe

---

## Visual Mood Guide

### Calm & Meditative
```typescript
// Spectrum
rotationSpeed: 0.002
barHeightResponsiveness: 0.08   // Very smooth
bloomStrength: 0.8              // Gentle glow

// Kaleidoscope
fractalIterations: 30            // Detailed
symmetryFolds: 8                 // Intricate
waveFrequency: low               // Slow patterns

// Milkdrop
particleDamping: 0.98            // Very floaty
morphIntensity: 0.3              // Subtle
lightIntensity: 1.5              // Dim
```

### Energetic & Hypnotic
```typescript
// Spectrum
rotationSpeed: 0.01
barHeightResponsiveness: 0.2     // Snappy
bloomStrength: 1.8               // Intense glow

// Kaleidoscope
fractalIterations: 15             // Balanced detail
symmetryFolds: 6                  // Hexagonal
waveFrequency: high              // Fast oscillations

// Milkdrop
particleDamping: 0.90            // Bouncy
morphIntensity: 0.7              // Dramatic
lightIntensity: 2.5              // Bright
```

### Chaotic & Psychedelic
```typescript
// Spectrum
rotationSpeed: 0.02
barHeightDamping: 0.80           // Jittery
bloomStrength: 2.0               // Maximum glow

// Kaleidoscope
fractalIterations: 8              // Rough, detailed
symmetryFolds: 3                  // Minimal
waveFrequency: max               // Wild patterns
cursorInfluence: 1.0             // Extreme distortion

// Milkdrop
particleDamping: 0.85            // Chaotic
morphIntensity: 1.0              // Maximum deformation
particleCount: 2000              // Crowded
```

---

## Quick Copy-Paste Adjustments

### For Slower Devices
```typescript
// Spectrum
barCount: 32
bloomStrength: 0.8

// Kaleidoscope
fractalIterations: 10
bloomRadius: 0.2

// Milkdrop
particleCount: 500
bloomStrength: 1.0
```

### For High-End
```typescript
// Spectrum
barCount: 96
bloomStrength: 1.8
barGeometry: subdivisions++

// Kaleidoscope
fractalIterations: 30
bloomRadius: 0.7

// Milkdrop
particleCount: 2000
bloomStrength: 2.0
blobSubdivisions: 7
```

### For More Neon (Cyberpunk)
```typescript
// All themes
bloomStrength: +0.5
toneMapping: ACESFilmic
toneMappingExposure: 1.8
colorSaturation: +0.2
```

### For More Organic (Milky)
```typescript
// All themes
bloomStrength: -0.3
colorSaturation: -0.1
particleDamping: 0.97
morphIntensity: slight
```

---

## Pro Tips

1. **Always measure FPS** before and after changes
2. **Small changes go a long way** – tweak by 10-20% not 100%
3. **Color is powerful** – experiment with hue ranges before geometry
4. **Interaction feel matters** – adjust cursor/scroll responsiveness to match mood
5. **Symmetry creates harmony** – increase fold count for more sophisticated look
6. **Particles are expensive** – reduce count on mobile by 50%
7. **Bloom is magic but costly** – use sparingly on lower-end devices
8. **Test on real devices**, not just dev server

---

Ready to experiment? Pick a theme, change one parameter, and see what happens! 🎨

