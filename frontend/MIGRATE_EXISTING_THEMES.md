# Migrating Existing Themes to Use Parameter Tuning

Convert your existing themes to use live parameter editing without rebuilds.

**Time to migrate one theme: ~5 minutes**

---

## Before: Static Parameters

```typescript
// Old way - requires rebuild to change
const PARAMS = {
  particleCount: 2000,
  bloomStrength: 1.2,
  interactionRadius: 80,
  // Edit these = wait for rebuild
}
```

## After: Reactive Parameters

```typescript
// New way - change with UI slider, instant feedback
const { params } = createParameters({
  particleCount: {
    type: 'range',
    value: 2000,
    min: 100,
    max: 10000,
    category: 'Particles'
  },
  // ... more parameters
})

// params.particleCount is now reactive!
```

---

## Migration Steps

### Step 1: Import the Tuning System

At the top of your theme file:

```typescript
import { createParameters, type ParameterDefinition } from './core/parameterTuning'
```

### Step 2: Replace Static PARAMS

**Before:**
```typescript
const PARAMS = {
  particleCount: 2000,
  particleSize: 2.8,
  bloomStrength: 1.2,
  bloomRadius: 0.6,
  bloomThreshold: 0.4,
}
```

**After:**
```typescript
const { params, definitions } = createParameters({
  particleCount: {
    name: 'Particle Count',
    type: 'range',
    value: 2000,
    min: 100,
    max: 10000,
    step: 100,
    category: 'Particle System',
    description: 'Number of particles in the system'
  },
  particleSize: {
    name: 'Particle Size',
    type: 'range',
    value: 2.8,
    min: 0.5,
    max: 10,
    step: 0.1,
    category: 'Particle System'
  },
  bloomStrength: {
    name: 'Bloom Strength',
    type: 'range',
    value: 1.2,
    min: 0,
    max: 2,
    step: 0.1,
    category: 'Postprocessing',
    description: 'Glow intensity (higher may wash out text)'
  },
  bloomRadius: {
    name: 'Bloom Radius',
    type: 'range',
    value: 0.6,
    min: 0,
    max: 2,
    step: 0.05,
    category: 'Postprocessing'
  },
  bloomThreshold: {
    name: 'Bloom Threshold',
    type: 'range',
    value: 0.4,
    min: 0,
    max: 1,
    step: 0.05,
    category: 'Postprocessing'
  },
})
```

### Step 3: Use params Instead of PARAMS

Update references throughout your theme file:

**Before:**
```typescript
const geometry = new THREE.BufferGeometry()
const positions = new Float32Array(PARAMS.particleCount * 3)
// ...
const material = new THREE.PointsMaterial({
  size: PARAMS.particleSize,
})
// ...
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(width, height),
  PARAMS.bloomStrength,
  PARAMS.bloomRadius,
  PARAMS.bloomThreshold
)
```

**After:**
```typescript
const geometry = new THREE.BufferGeometry()
const positions = new Float32Array(params.particleCount * 3)
// ...
const material = new THREE.PointsMaterial({
  size: params.particleSize,
})
// ...
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(width, height),
  params.bloomStrength,
  params.bloomRadius,
  params.bloomThreshold
)
```

### Step 4: Test in Playground

```bash
npm run dev
# Visit http://localhost:5173/playground
```

Your theme should now show in the Parameter Panel with all parameters available to adjust!

---

## Complete Example: Magnetosphere

### Before Migration

```typescript
const PARAMS = {
  particleCount: 2000,
  particleSize: 2.8,
  bloomStrength: 1.2,
  bloomRadius: 0.6,
  bloomThreshold: 0.4,
  toneMappingExposure: 0.9,
  interactionRadius: 80,
  chargeStrength: 0.6,
  velocityDamping: 0.91,
  beatResponsiveness: 2.5,
}

export const createChargedMagnetosphereTheme = (canvas, config) => {
  // ... rest of theme
}
```

### After Migration

```typescript
const { params, definitions } = createParameters({
  particleCount: {
    name: 'Particle Count',
    type: 'range',
    value: 2000,
    min: 100,
    max: 5000,
    step: 100,
    category: 'Particles'
  },
  particleSize: {
    name: 'Particle Size',
    type: 'range',
    value: 2.8,
    min: 0.5,
    max: 10,
    step: 0.1,
    category: 'Particles'
  },
  bloomStrength: {
    name: 'Bloom Strength',
    type: 'range',
    value: 1.2,
    min: 0,
    max: 2,
    step: 0.1,
    category: 'Bloom'
  },
  bloomRadius: {
    name: 'Bloom Radius',
    type: 'range',
    value: 0.6,
    min: 0,
    max: 2,
    step: 0.05,
    category: 'Bloom'
  },
  bloomThreshold: {
    name: 'Bloom Threshold',
    type: 'range',
    value: 0.4,
    min: 0,
    max: 1,
    step: 0.05,
    category: 'Bloom'
  },
  toneMappingExposure: {
    name: 'Tone Mapping',
    type: 'range',
    value: 0.9,
    min: 0.5,
    max: 2,
    step: 0.1,
    category: 'Rendering'
  },
  interactionRadius: {
    name: 'Interaction Radius',
    type: 'range',
    value: 80,
    min: 10,
    max: 200,
    step: 10,
    category: 'Interaction'
  },
  chargeStrength: {
    name: 'Charge Strength',
    type: 'range',
    value: 0.6,
    min: 0.1,
    max: 2,
    step: 0.1,
    category: 'Physics'
  },
  velocityDamping: {
    name: 'Velocity Damping',
    type: 'range',
    value: 0.91,
    min: 0.8,
    max: 0.99,
    step: 0.01,
    category: 'Physics'
  },
  beatResponsiveness: {
    name: 'Beat Responsiveness',
    type: 'range',
    value: 2.5,
    min: 0.5,
    max: 5,
    step: 0.5,
    category: 'Animation'
  },
})

export const createChargedMagnetosphereTheme = (canvas, config) => {
  // ... rest of theme, but use params instead of PARAMS
}
```

---

## Parameter Definition Reference

### Minimum Definition
```typescript
{
  name: 'My Parameter',
  type: 'range',
  value: 100  // Initial value
}
```

### Full Definition
```typescript
{
  name: 'Particle Count',           // Display name
  type: 'range',                    // 'range' | 'number' | 'color' | 'boolean' | 'select'
  value: 2000,                      // Initial value
  min: 100,                         // For range/number
  max: 5000,                        // For range/number
  step: 100,                        // For range/number
  category: 'Particles',            // Groups in UI
  description: 'Number of...',      // Tooltip text
  options: ['a', 'b', 'c']         // For 'select' type
}
```

### Parameter Types

**Range** (slider):
```typescript
bloomStrength: {
  type: 'range',
  value: 1.2,
  min: 0,
  max: 2,
  step: 0.1
}
```

**Number** (text input):
```typescript
count: {
  type: 'number',
  value: 100,
  min: 0,
  max: 1000
}
```

**Color** (color picker):
```typescript
primaryColor: {
  type: 'color',
  value: '#ff006e'
}
```

**Boolean** (toggle):
```typescript
enableBloom: {
  type: 'boolean',
  value: true
}
```

**Select** (dropdown):
```typescript
blendMode: {
  type: 'select',
  value: 'screen',
  options: ['screen', 'multiply', 'overlay']
}
```

---

## Accessing Parameters in Update Loop

```typescript
const update = (time, pattern, interaction) => {
  // Before:
  // const size = PARAMS.particleSize

  // After:
  const size = params.particleSize  // Always current value

  // Use anywhere in update:
  particles.forEach((p, i) => {
    positions[i * 3] += p.velocity.x * size
    positions[i * 3 + 1] += p.velocity.y * size
    positions[i * 3 + 2] += p.velocity.z * size
  })

  renderer.render(scene, camera)
}
```

---

## Checklist

- [ ] Import `createParameters`
- [ ] Convert `PARAMS` to parameter definitions
- [ ] Update all `PARAMS.x` references to `params.x`
- [ ] Add `category` to each parameter
- [ ] Add `description` to key parameters
- [ ] Set appropriate `min`/`max`/`step` values
- [ ] Test in Playground at `/playground`
- [ ] Verify Parameter Panel shows all params
- [ ] Try adjusting each parameter (should update instantly)
- [ ] Save a preset to test persistence
- [ ] Commit changes to git

---

## Validation (Optional)

Add parameter validation if needed:

```typescript
import { ParameterValidator } from './core/parameterTuning'

// Validate all parameters
const validation = ParameterValidator.validateAll(params, definitions)
if (!validation.valid) {
  console.error('Invalid parameters:', validation.errors)
}
```

---

## Common Pitfalls

### ❌ Forgetting to Use params in Update

```typescript
// WRONG - uses stale value
const particleSize = PARAMS.particleSize
const update = () => {
  material.size = particleSize  // Never changes
}

// RIGHT - gets current value
const update = () => {
  material.size = params.particleSize  // Always current
}
```

### ❌ Step Size Too Large

```typescript
// WRONG - slider jumps in big increments
{
  type: 'range',
  value: 0.5,
  min: 0,
  max: 1,
  step: 1  // Jumps to 0 or 1 only
}

// RIGHT - smooth adjustments
{
  type: 'range',
  value: 0.5,
  min: 0,
  max: 1,
  step: 0.01  // Smooth control
}
```

### ❌ Forgetting Categories

```typescript
// WRONG - all parameters listed together
{
  name: 'Particle Count',
  type: 'range',
  value: 2000
  // No category
}

// RIGHT - organized in UI
{
  name: 'Particle Count',
  type: 'range',
  value: 2000,
  category: 'Particles'
}
```

---

## Migration Priority

**Migrate these themes first (most benefit):**
1. Magnetosphere (most tweakable)
2. Kaleidoscope (many color parameters)
3. DMT Geometry (needs visual iteration)

**Then migrate others as needed.**

---

## After Migration

Once migrated:
- ✅ Open Playground
- ✅ Experiment with parameters in real-time
- ✅ Save presets of good configurations
- ✅ A/B test different variations
- ✅ Share presets with team
- ✅ Commit favorite presets to git

---

## Questions?

See [PLAYGROUND_GUIDE.md](./PLAYGROUND_GUIDE.md) for detailed workflows and examples.
