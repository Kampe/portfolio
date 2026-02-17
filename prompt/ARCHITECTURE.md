# Frontend Architecture: Animation Playground System

## Current State Analysis

### Strengths
✅ Clean **ThemeFactory** pattern - themes are self-contained, isolated modules
✅ **ThemeManager** provides single source of truth for theme switching
✅ Type-safe **ThemeSetupResult** interface ensures consistency
✅ Good separation: synthesis → themes → components
✅ Keyboard shortcuts already in place for rapid testing

### Gaps
❌ **No live parameter tuning** - changing PARAMS requires code edit + rebuild
❌ **No playground/sandbox mode** - dev workflow mixes with production code
❌ **Limited performance visibility** - FPS HUD but no detailed metrics
❌ **Theme scaffolding is manual** - copying existing theme, editing = slow iteration
❌ **No preset/config persistence** - can't save and A/B test parameter sets
❌ **Mixed concerns in VectorCloudHero** - component handles too much logic

---

## Redesigned Architecture

### Directory Structure

```
frontend/src/
├── components/
│   ├── art/
│   │   ├── VectorCloudHero.vue          # Production hero (clean, minimal)
│   │   ├── Playground.vue                # ← NEW: Dev playground sandbox
│   │   └── vectorCloud/
│   │       ├── core/                     # ← NEW: Core systems
│   │       │   ├── scene.ts              # Base THREE scene setup
│   │       │   ├── performance.ts        # ← NEW: Perf monitor
│   │       │   └── interaction.ts        # Cursor/scroll handling
│   │       ├── synthesis.ts              # Pattern generation
│   │       ├── shaders/                  # ← NEW: Organized shaders
│   │       │   ├── common.glsl
│   │       │   └── effects.glsl
│   │       ├── themes/
│   │       │   ├── themeManager.ts
│   │       │   ├── themeTypes.ts
│   │       │   ├── createThemeTemplate.ts  # ← NEW: Scaffolder
│   │       │   ├── presets/              # ← NEW: Preset configs
│   │       │   │   ├── devMode.ts        # Dev-specific settings
│   │       │   │   └── production.ts     # Production defaults
│   │       │   ├── core/                 # ← NEW: Shared theme logic
│   │       │   │   ├── baseTheme.ts      # Common initialization
│   │       │   │   ├── parameterTuning.ts  # ← NEW: Live tuning
│   │       │   │   └── transitions.ts    # Theme switching
│   │       │   └── implementations/      # ← NEW: Theme modules
│   │       │       ├── magnetosphere.ts
│   │       │       ├── dmt.ts
│   │       │       └── ...
│   └── dev/
│       ├── ParameterPanel.vue            # ← NEW: Dev UI
│       ├── ThemeBrowser.vue              # ← NEW: Theme gallery
│       ├── PerformanceMonitor.vue        # ← NEW: Metrics display
│       └── PresetManager.vue             # ← NEW: Preset A/B testing

├── lib/
│   ├── devMode.ts                        # ← NEW: Dev utilities
│   └── performance.ts                    # ← NEW: Performance analytics

└── types/
    └── playground.ts                     # ← NEW: Dev-only types
```

---

## Key Improvements

### 1. **Live Parameter Tuning** (No Rebuild)
```typescript
// Instead of static PARAMS object, use reactive config:
const themeConfig = reactive({
  particleCount: 2000,
  bloomStrength: 1.2,
  interactionRadius: 80,
  // ... auto-updates when changed in dev panel
})
```

### 2. **Playground Component** (Sandbox for Experiments)
```vue
<Playground>
  <!-- Live preview + controls in one place -->
  <!-- Switch themes, tweak params, monitor perf, all without affecting production -->
</Playground>
```

### 3. **Performance Monitoring System**
- Real-time FPS, memory, geometry/material counts
- Frame time breakdown (simulation vs render vs postprocessing)
- GPU vs CPU bottleneck detection

### 4. **Theme Scaffolding**
```typescript
const newTheme = createThemeTemplate('myNewTheme', {
  description: 'Experimental blob morphing',
  colorScheme: 'complementary',
  performanceLevel: 'high'
})
// Generates a ready-to-edit theme with all boilerplate
```

### 5. **Preset System**
```typescript
// Save param combinations as presets for A/B testing
savePreset('magnetosphere_darkNeon', { bloomStrength: 0.8, particleCount: 1500 })
// Later: loadPreset('magnetosphere_darkNeon') // instant switch
```

### 6. **Separated Concerns**
- **VectorCloudHero.vue** - Production-only, minimal, clean
- **Playground.vue** - Dev-only, experimental, full-featured

---

## Workflow Examples

### Example 1: Tweaking Existing Theme
```
1. Dev starts Playground component (only in dev mode)
2. Selects "Charged Magnetosphere" theme
3. Adjusts parameters in live panel (no rebuild!)
4. Sees FPS/memory metrics in real-time
5. Saves successful config as preset "magnetosphere_v2"
6. Commits preset, deletes old version
```

### Example 2: Creating New Theme Fast
```
1. Click "Create New Theme" in Playground
2. Choose base type (particle-based, shader-based, etc.)
3. Get boilerplate theme file + all scaffolding
4. Edit the `update()` function live
5. Parameter panel auto-generates inputs from PARAMS
6. Save as preset, test across devices, commit
```

### Example 3: A/B Testing
```
1. Duplicate Magnetosphere → v1 (original), v2 (new params)
2. Preset system lets you switch between configs instantly
3. Side-by-side parameter comparison
4. Commit winning preset
```

---

## Implementation Priority

### Phase 1 (Foundational)
- [ ] Extract ParameterTuning system
- [ ] Build PerformanceMonitor
- [ ] Create Playground.vue (basic)

### Phase 2 (Developer Experience)
- [ ] Implement parameter reactivity
- [ ] Add ParameterPanel.vue
- [ ] Create preset persistence (localStorage)

### Phase 3 (Automation)
- [ ] Theme scaffolder
- [ ] ThemeBrowser.vue
- [ ] Theme export/import

### Phase 4 (Polish)
- [ ] Shader hot-reload (optional, requires bundler config)
- [ ] Preset sharing via URL
- [ ] Performance regression detection

---

## Technical Decisions

### Why Reactive Parameters?
- Vue's reactivity system handles change detection
- No manual update() polling needed
- Parameter changes trigger theme recompute automatically

### Why Separated Playground?
- Production code stays lean and focused
- Dev features don't bloat build (tree-shakeable)
- Playground only loaded in dev mode

### Why Preset System?
- Preserve good parameter combinations
- A/B testing without code changes
- Faster iteration → more experiments

### Why Theme Scaffolder?
- Copy-paste boilerplate is slow and error-prone
- Scaffolder ensures type safety, proper lifecycle
- Reduces onboarding time for new theme ideas

---

## Performance Considerations

- **Live parameter tuning**: Updates only affected uniforms (minimal overhead)
- **Preset switching**: Instant swap, no memory leaks (proper dispose())
- **Playground overhead**: Dev-only, fully tree-shakeable
- **Monitor system**: Low-cost frame-time tracking (~0.1ms)

---

## Next Steps

1. Review this architecture
2. Implement Phase 1 (Performance monitor + Parameter tuning)
3. Build Playground component
4. Create theme scaffolder utility
5. Test rapid iteration workflow

Goal: **From code edit → new animation** should be **< 1 second** (no rebuild), not 5-10s.
