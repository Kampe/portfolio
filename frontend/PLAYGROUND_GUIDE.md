# Animation Playground Guide

## Overview

The Animation Playground is a dedicated development environment for rapidly experimenting with new theme variations and parameter combinations **without touching production code** or requiring rebuilds.

**Key Benefits:**
- ✅ Live parameter editing (no rebuild!)
- ✅ Real-time performance monitoring
- ✅ Save/load parameter presets
- ✅ Theme switching in milliseconds
- ✅ Separate from production VectorCloudHero

---

## Quick Start

### Access the Playground

```bash
# Development mode only
npm run dev
# Navigate to: http://localhost:5173/playground
```

Or add a route to your main app:
```typescript
// src/main.ts
import Playground from '@/components/art/Playground.vue'

const routes = [
  { path: '/playground', component: Playground, props: { isDev: true } }
]
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `T` | Open theme browser |
| `H` | Toggle performance HUD |
| `ESC` | Exit playground |

---

## Using the Parameter Panel

The Parameter Panel (bottom-left of screen) is your main control center for live tuning.

### Adjusting Parameters

1. **Range Sliders** - Drag for smooth transitions
2. **Number Inputs** - Type precise values
3. **Color Pickers** - Click to select colors
4. **Toggle Switches** - Enable/disable features

All changes apply **instantly** without rebuilds.

### Saving Presets

```
1. Adjust parameters until you like the effect
2. Click "Save Preset" in the panel
3. Enter a name like: "magnetosphere_darkNeon"
4. Preset is saved to browser localStorage
```

Later, load it instantly:
```typescript
const presetManager = new ParameterPresetManager()
const params = presetManager.loadPreset('magnetosphere_darkNeon')
// Apply to theme
```

### Comparing Presets

```typescript
const comparison = presetManager.compare('original', 'darkNeon')
// Returns differences:
// {
//   bloomStrength: { preset1: 1.2, preset2: 0.8 },
//   particleSize: { preset1: 2.8, preset2: 3.2 }
// }
```

---

## Creating New Themes

### Option 1: Use the Scaffolder (Fastest)

```typescript
import { createThemeTemplate } from '@/components/art/vectorCloud/themes'

// Generate boilerplate code
const template = createThemeTemplate('myAwesomeTheme', {
  type: 'particle-based',
  description: 'Organic blob morphing with fluid dynamics',
  colorScheme: 'complementary',
  performanceLevel: 'high',
  withInteraction: true,
  withPostProcessing: true
})

// Copy template.code to new file: src/components/art/vectorCloud/themes/myAwesomeTheme.ts
console.log(template.code)

// Register in themeManager.ts:
// import { createMyAwesomeThemeTheme } from './myAwesomeTheme'
// 'myAwesomeTheme': createMyAwesomeThemeTheme,
```

### Option 2: Copy Existing Theme

1. Copy `chargedMagnetosphere.ts` to `myNewTheme.ts`
2. Change export function name
3. Modify the `PARAMS` object
4. Adjust the `update()` function logic
5. Register in `themeManager.ts`

### Option 3: Template Structure

Every theme must follow this structure:

```typescript
export const createMyThemeTheme = (
  canvas: HTMLCanvasElement,
  config?: Partial<ThemeConfig>
): ThemeSetupResult => {
  // 1. Scene setup
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(...)
  const renderer = new THREE.WebGLRenderer(...)

  // 2. Optional: postprocessing
  const composer = new EffectComposer(renderer)

  // 3. Create visuals
  // Add particles, meshes, shaders to scene

  // 4. Animation loop
  const update = (
    time: number,
    pattern: SynthesizedPattern,
    interaction: ThemeInteractionState
  ) => {
    // Update animations based on:
    // - time: elapsed time in ms
    // - pattern: { energy, noise, phase, ... }
    // - interaction: { cursor position, energized level, ... }

    composer ? composer.render() : renderer.render(scene, camera)
  }

  // 5. Cleanup
  const dispose = () => {
    // Dispose geometries, materials, textures
    renderer.dispose()
  }

  return { scene, camera, renderer, composer, update, dispose }
}
```

---

## Performance Monitoring

The Performance Monitor (top-right) shows real-time metrics:

```
FPS: 58 (avg: 56, min: 45, max: 60)
Frame Time: 16.5ms
Geometries: 2,340
Materials: 156
Memory: 245MB / 512MB
Bottleneck: geometry
```

### Interpreting Metrics

- **FPS < 50**: Too many particles/meshes or expensive shader
- **Frame Time > 20ms**: GPU bottleneck (reduce particles/postprocessing)
- **Bottleneck: geometry**: Reduce polygon count or use instancing
- **Bottleneck: material**: Simplify shaders or use fewer materials
- **Bottleneck: memory**: Memory leak or too many textures

---

## Workflow Examples

### Example 1: Tweaking Magnetosphere

```
1. Playground opens with Magnetosphere theme
2. Parameter Panel shows:
   - particleCount: 2000
   - bloomStrength: 1.2
   - interactionRadius: 80
3. Drag particleCount slider → 3000
   ✓ Instantly see more particles, watch FPS drop to 42
4. Drag bloomStrength down → 0.7
   ✓ Text becomes readable again, FPS back to 58
5. Click "Save Preset" → name: "magnetosphere_high-perf"
6. Switch theme with T key, experiment with others
7. Return to Magnetosphere, load preset
```

### Example 2: Creating "Plasma Storm" Theme

```
1. Click "Save Preset" → Generate template code:
   createThemeTemplate('plasmaStorm', {
     type: 'particle-based',
     colorScheme: 'complementary',
     performanceLevel: 'high'
   })

2. Copy generated code to: themes/plasmaStorm.ts
3. Edit PARAMS object:
   particleCount: 4000
   velocityDamping: 0.88 (faster movement)
   chargeStrength: 1.2 (stronger forces)

4. Register in themeManager.ts

5. Refresh playground (in dev mode, hot-reload if available)

6. Theme selector now shows "plasmaStorm"

7. Switch to it, adjust parameters, save preset

8. Compare with Magnetosphere:
   presetManager.compare('magnetosphere_original', 'plasmaStorm')

9. If happy, commit to git!
```

### Example 3: A/B Testing

```typescript
// Save two variations
presetManager.savePreset('effect_v1', { bloom: 1.2, particles: 2000 })
presetManager.savePreset('effect_v2', { bloom: 0.8, particles: 3000 })

// Load and compare
const diff = presetManager.compare('effect_v1', 'effect_v2')
// {
//   bloomStrength: { preset1: 1.2, preset2: 0.8 },
//   particleCount: { preset1: 2000, preset2: 3000 }
// }

// Switch between them by clicking in Parameter Panel
// See which performs better and looks better
```

---

## Parameter Definitions

When creating a theme, define parameters like this:

```typescript
import { createParameters } from '@/components/art/vectorCloud/themes/core/parameterTuning'

const { params, definitions } = createParameters({
  particleCount: {
    name: 'Particle Count',
    type: 'range',
    value: 2000,
    min: 100,
    max: 10000,
    step: 100,
    category: 'Particle System',
    description: 'More particles = more visual richness, slower FPS'
  },

  bloomStrength: {
    name: 'Bloom Strength',
    type: 'range',
    value: 1.2,
    min: 0,
    max: 2,
    step: 0.1,
    category: 'Postprocessing',
    description: 'Higher = more glow, might wash out text'
  },

  primaryColor: {
    name: 'Primary Color',
    type: 'color',
    value: '#ff006e',
    category: 'Colors'
  },

  enableFluidDynamics: {
    name: 'Enable Fluid Dynamics',
    type: 'boolean',
    value: false,
    category: 'Physics'
  }
})

// In theme update loop:
// params.particleCount now reflects slider position
// Update particles based on this value
```

---

## Best Practices

### Do ✅
- Save presets as you iterate (creates natural checkpoints)
- Monitor FPS while adjusting parameters (spot slow changes early)
- Use descriptive preset names: `magnetosphere_mobile_optimized`, not `m1`
- Group related parameters by category
- Test on both desktop and mobile viewports

### Don't ❌
- Edit themes directly in VectorCloudHero (use Playground)
- Leave parameter panel open in production build
- Save presets without testing performance first
- Copy presets without understanding what they do
- Forget to dispose resources in theme cleanup

---

## Preset Export/Import

### Export All Presets (for sharing)

```typescript
const presetManager = new ParameterPresetManager()
const json = presetManager.export()
// Copy to clipboard, share with team
```

### Import Presets

```typescript
const json = `[
  {
    "name": "magnetosphere_v2",
    "timestamp": 1234567890,
    "parameters": { "bloomStrength": 0.8, "particleCount": 1500 }
  }
]`

presetManager.import(json)
// All presets loaded from localStorage
```

---

## Troubleshooting

### Parameters Not Updating?
- Check browser console for errors
- Ensure `update()` function uses `params.something`
- Restart dev server if using hot-reload

### Presets Not Saving?
- Check if localStorage is enabled
- Browser DevTools → Application → Local Storage
- Should see `theme_parameter_presets` key

### Performance Bad?
- Check bottleneck indicator in HUD
- Reduce `particleCount` first
- Lower bloom strength and radius
- Check for memory leaks (scrolling up in Memory graph)

### Can't Find Old Preset?
- Check browser DevTools Application → LocalStorage
- Or export all: `presetManager.export()` and search JSON

---

## Integration with Production

When happy with a theme variation:

1. **Save the preset name and parameters**
2. **Commit the PARAMS values to git**
3. **Update README with new theme color descriptions**
4. **Deploy to production**

Example commit:
```
git add frontend/src/components/art/vectorCloud/themes/magnetosphere.ts
git commit -m "refine: magnetosphere - optimize bloom for dark backgrounds

New parameters:
- bloomStrength: 1.2 → 0.8 (improve text readability)
- particleCount: 2000 → 2500 (more visual richness)

Preset: magnetosphere_v2 saved and tested on mobile

See: Playground guide for preset management
"
```

---

## Next Steps

1. ✅ Open `/playground` in dev mode
2. ✅ Experiment with existing theme parameters
3. ✅ Save 3 different presets
4. ✅ Create one new theme from template
5. ✅ Test on mobile viewport (press F12 → toggle device toolbar)
6. ✅ Commit favorite presets

**You're now equipped for rapid animation iteration! 🚀**
