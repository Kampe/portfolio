# Quick Start: Animation Playground

**Get your first live parameter tweak working in 2 minutes.**

---

## 1. Add Playground Route

Edit `src/main.ts`:

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Playground from '@/components/art/Playground.vue'

const routes = [
  {
    path: '/',
    component: App
  },
  {
    path: '/playground',
    component: Playground,
    props: { isDev: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

---

## 2. Start Dev Server

```bash
cd frontend
npm run dev
```

---

## 3. Open Playground

Visit: `http://localhost:5173/playground`

You should see:
- ✅ Charged Magnetosphere theme animating
- ✅ Parameter panel (bottom-left)
- ✅ Performance metrics (top-right)

---

## 4. Try Your First Parameter Change

In the **Parameter Panel**:
1. Find "Particle Count" slider
2. Drag it left → down to 1000
   - **Instant**: You see fewer particles, FPS improves
3. Drag it right → up to 3000
   - **Instant**: More particles, FPS drops
4. Find "Bloom Strength"
5. Adjust until text is readable

---

## 5. Save Your First Preset

1. Click "Save Preset" button
2. Type: `my_first_tweaks`
3. Click Save
4. ✅ Preset saved to browser

Next time, you can load it instantly!

---

## 6. Create a New Theme (Optional)

```typescript
// In browser console or a new file:
import { createThemeTemplate } from '@/components/art/vectorCloud/themes'

const theme = createThemeTemplate('myFirstTheme', {
  type: 'particle-based',
  colorScheme: 'complementary',
  performanceLevel: 'high'
})

console.log(theme.code)
```

Copy the code to: `src/components/art/vectorCloud/themes/myFirstTheme.ts`

Register in `themeManager.ts`:
```typescript
import { createMyFirstThemeTheme } from './myFirstTheme'

const THEME_REGISTRY = {
  // ... existing themes
  'myFirstTheme': createMyFirstThemeTheme,
}
```

Refresh playground, new theme appears in theme browser!

---

## 7. Key Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `T` | Open theme browser |
| `H` | Toggle HUD |
| `Scroll` | Increase energy level |

---

## That's It!

You now have:
- ✅ Live parameter editing (no rebuilds!)
- ✅ Real-time performance monitoring
- ✅ Preset saving and loading
- ✅ Theme scaffolding for rapid creation

**Next**: Read [PLAYGROUND_GUIDE.md](./PLAYGROUND_GUIDE.md) for workflows and advanced features.

---

## Troubleshooting

### "Playground component not found"
- Make sure route is added to `main.ts`
- Refresh browser

### "Parameters not updating"
- Check browser console for errors
- Make sure theme file uses `params.paramName` in update()

### "Presets not saving"
- Open DevTools → Application → Local Storage
- Should see `theme_parameter_presets` entry
- Check that localStorage is enabled

### "FPS very low"
- Use Performance Monitor to find bottleneck
- Reduce `particleCount` first
- Lower bloom strength and radius

---

## What's Next?

1. **Experiment with existing themes** - try all parameters
2. **A/B test presets** - see which looks best
3. **Create a new theme** - use the scaffolder
4. **Save your favorite presets** - commit to git
5. **Share presets with team** - export JSON, share

Enjoy the playground! 🚀
