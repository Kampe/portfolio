<template>
  <div class="fixed inset-0 bg-black overflow-hidden">
    <!-- Three.js Canvas (pointer-events: none so UI clicks work) -->
    <canvas ref="canvasRef" aria-hidden="true" class="absolute inset-0 pointer-events-none"></canvas>

    <!-- Overlay UI -->
    <main class="relative z-10 h-full flex flex-col items-center justify-center pointer-events-none px-4 md:px-0">
      <div class="text-center space-y-4 md:space-y-6 w-full">
        <!-- Name + Role -->
        <div>
          <h1 ref="nameRef" class="text-4xl md:text-6xl font-bold mb-2 md:mb-3 leading-tight text-white" style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; letter-spacing: -0.02em; text-shadow: 0 0 20px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.9);">
            NICK KAMPE
          </h1>
          <p ref="roleRef" class="text-sm md:text-lg tracking-wider font-semibold inline-flex gap-1 md:gap-2 flex-wrap justify-center px-2" style="font-family: 'Space Grotesk', sans-serif; font-weight: 500; letter-spacing: 0.08em; opacity: 0.65; color: hsl(var(--color-secondary-hsl) / 1); text-shadow: 0 0 12px rgba(0,0,0,0.7), 1px 1px 3px rgba(0,0,0,0.8);">
            <span class="role-item">Platform Engineer</span>
            <span class="role-separator">|</span>
            <span class="role-item">Software Craftsman</span>
            <span class="role-separator">|</span>
            <span class="role-item">Perpetual Learner</span>
          </p>
        </div>

        <!-- Tagline -->
        <p ref="taglineRef" class="text-sm md:text-base max-w-sm md:max-w-5xl mx-auto leading-relaxed px-2 text-white/80" style="font-family: 'Inter', sans-serif; font-weight: 400; text-shadow: 0 0 10px rgba(0,0,0,0.6), 1px 1px 2px rgba(0,0,0,0.7);">
          Expert infrastructure architect & automation specialist scaling production systems for startups and enterprise. <br class="hidden md:block">Designing cloud migrations, deploying modern CI/CD solutions, and building scalable platforms. <br class="hidden md:block"><span class="whitespace-nowrap">15+ years of proven expertise.</span> <span class="whitespace-nowrap">Available for strategic long-term engagements.</span>
        </p>

        <!-- CTA Buttons -->
        <div ref="buttonsRef" class="flex flex-row flex-wrap gap-3 md:gap-4 justify-center items-center pt-2 md:pt-4 pointer-events-auto px-2" style="opacity: 0;">
          <button type="button" @click="$emit('open-contact')" class="relative px-4 md:px-6 py-2 border-2 text-white font-semibold transition-all duration-300 text-xs md:text-sm uppercase tracking-widest whitespace-nowrap group overflow-hidden rounded-lg" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 1)`, color: 'white', textShadow: '0 0 8px rgba(0,0,0,0.6), 1px 1px 2px rgba(0,0,0,0.7)' }" @mouseenter="hoverPrimaryBtn = true" @mouseleave="hoverPrimaryBtn = false">
            <span class="absolute inset-0 transition-colors duration-300" :style="{ backgroundColor: `hsl(var(--color-primary-hsl) / ${hoverPrimaryBtn ? 0.1 : 0.05})` }"></span>
            <span class="relative flex items-center gap-2"><Mail :size="18" />Contact Me</span>
            <span class="absolute bottom-0 left-0 w-0 h-1 transition-all duration-500" :style="{ backgroundImage: `linear-gradient(to right, hsl(var(--color-primary-hsl) / 1), hsl(var(--color-secondary-hsl) / 1))`, width: hoverPrimaryBtn ? '100%' : '0%' }"></span>
          </button>
          <a href="https://github.com/Kampe" target="_blank" rel="noopener noreferrer" class="relative inline-block px-4 md:px-6 py-2 border-2 text-white font-semibold transition-all duration-300 text-xs md:text-sm uppercase tracking-widest whitespace-nowrap group overflow-hidden rounded-lg" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 1)`, color: 'white', textShadow: '0 0 8px rgba(0,0,0,0.6), 1px 1px 2px rgba(0,0,0,0.7)' }" @mouseenter="hoverGithubBtn = true" @mouseleave="hoverGithubBtn = false">
            <span class="absolute inset-0 transition-colors duration-300" :style="{ backgroundColor: `hsl(var(--color-accent-hsl) / ${hoverGithubBtn ? 0.1 : 0.05})` }"></span>
            <span class="relative flex items-center gap-2"><Github :size="18" />GitHub</span>
            <span class="absolute bottom-0 left-0 w-0 h-1 transition-all duration-500" :style="{ backgroundImage: `linear-gradient(to right, hsl(var(--color-primary-hsl) / 1), hsl(var(--color-secondary-hsl) / 1))`, width: hoverGithubBtn ? '100%' : '0%' }"></span>
          </a>
        </div>
      </div>


      <!-- Debug HUD (hidden by default, show with ?debug=1) -->
      <div v-if="showDebugHUD" class="fixed bottom-4 right-4 bg-black/80 border border-cyan-500/50 rounded p-3 text-xs text-cyan-400 font-mono space-y-1 pointer-events-auto z-50">
        <div>Theme: {{ currentTheme }}</div>
        <div>FPS: {{ fps }}</div>
        <div>Particles: {{ particleCount }}</div>
        <div>Time: {{ (time * 0.001).toFixed(1) }}s</div>
        <div>Energized: {{ energizedLevel.toFixed(2) }}</div>
        <div class="mt-2 pt-2 border-t border-cyan-500/30">
          <div class="text-cyan-300 mb-1">Themes (press key):</div>
          <button type="button" @click="switchTheme('spectrum')" class="block text-left hover:text-cyan-200 mb-1">
            [1] Spectrum
          </button>
          <button type="button" @click="switchTheme('kaleidoscope')" class="block text-left hover:text-cyan-200 mb-1">
            [2] Kaleidoscope
          </button>
          <button type="button" @click="switchTheme('milkdrop')" class="block text-left hover:text-cyan-200 mb-1">
            [3] Milkdrop
          </button>
          <button type="button" @click="switchTheme('dmt')" class="block text-left hover:text-cyan-200 mb-1">
            [4] DMT Geometry
          </button>
          <button type="button" @click="switchTheme('vectorfield')" class="block text-left hover:text-cyan-200 mb-1">
            [5] Vector Field Floor
          </button>
          <button type="button" @click="switchTheme('magnetosphere')" class="block text-left hover:text-cyan-200">
            [6] Charged Magnetosphere
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import type * as THREE from 'three'
import gsap from 'gsap'
import { Mail, Github } from 'lucide-vue-next'
import { LazyThemeManager, getThemeFromURL } from './vectorCloud/themes/themeManagerLazy'
import type { PostProcessingComposer, ThemeInteractionState, ThemeName } from './vectorCloud/themes/themeTypes'
import { synthesizePattern } from './vectorCloud/synthesis'
import type { ColorPalette } from '../../utils/colorPalettes'
import { getPaletteOrbColors } from '../../utils/colorPalettes'

// Props
const props = defineProps<{
  palette: ColorPalette
}>()

// Emit events
defineEmits<{
  'open-contact': []
}>()

// Refs
const canvasRef = ref<HTMLCanvasElement | null>(null)
const nameRef = ref<HTMLElement | null>(null)
const roleRef = ref<HTMLElement | null>(null)
const taglineRef = ref<HTMLElement | null>(null)
const buttonsRef = ref<HTMLElement | null>(null)
const fps = ref(0)
const showDebugHUD = ref(false)
const particleCount = ref(0)
const time = ref(0)
const energizedLevel = ref(0)
const currentTheme = ref<string>('magnetosphere')
const hoverPrimaryBtn = ref(false)
const hoverGithubBtn = ref(false)

// Scene objects
let scene: THREE.Scene | null = null
let camera: THREE.Camera | null = null
let renderer: THREE.WebGLRenderer | null = null
let composer: PostProcessingComposer | undefined
let animationId: number | null = null
let themeManager: LazyThemeManager | null = null
let cleanupScene: (() => void) | null = null
let heroTimeline: gsap.core.Timeline | null = null
let componentActive = true

const waitForInitialPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => window.setTimeout(resolve, 0))
  })

// Interaction state
let mousePos: THREE.Vector3
let clickPulseIntensity = 0
let clickPulseEndTime = 0
let wheelScrollTime = 0

const initScene = async () => {
  if (!canvasRef.value) return

  // Detect debug mode
  showDebugHUD.value = new URLSearchParams(window.location.search).has('debug')

  // Initialize theme manager
  themeManager = new LazyThemeManager(canvasRef.value)

  // Get palette orb colors to pass to theme (safely handle if palette not ready)
  let paletteOrbColors: { color1: number; color2: number; color3: number } | undefined
  if (props.palette) {
    paletteOrbColors = getPaletteOrbColors(props.palette)
  }

  // Load theme from URL or default to magnetosphere
  const themeName = (getThemeFromURL() || 'magnetosphere') as ThemeName
  const [three, themeSetup] = await Promise.all([
    import('three'),
    themeManager.loadTheme(themeName, paletteOrbColors),
  ])
  mousePos = new three.Vector3(0, 0, 50)
  if (!componentActive) {
    themeManager.dispose()
    return
  }

  scene = themeSetup.scene
  camera = themeSetup.camera
  renderer = themeSetup.renderer
  composer = themeSetup.composer
  particleCount.value = 1000  // Typical for particle-based themes
  currentTheme.value = themeName

  // Handle mouse movement
  const handleMouseMove = (event: MouseEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1
    mousePos.x = x * 50
    mousePos.y = y * 50
    mousePos.z = 50
  }

  // Handle click
  const handleClick = () => {
    clickPulseIntensity = 1
    clickPulseEndTime = performance.now() + 200
  }

  // Handle touch (mobile equivalent of click)
  const handleTouch = () => {
    clickPulseIntensity = 1
    clickPulseEndTime = performance.now() + 200
  }

  // Handle wheel scroll
  const handleWheel = () => {
    wheelScrollTime = performance.now() + 2000
  }

  // Handle touch move (mobile equivalent of mouse move)
  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      const x = (touch.clientX / window.innerWidth) * 2 - 1
      const y = -(touch.clientY / window.innerHeight) * 2 + 1
      mousePos.x = x * 50
      mousePos.y = y * 50
      mousePos.z = 50
    }
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('click', handleClick)
  window.addEventListener('touchstart', handleTouch)
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  window.addEventListener('wheel', handleWheel, { passive: true })

  // Animation loop
  let lastFrameTime = performance.now()
  let frameCount = 0
  let fpsWindowStarted = lastFrameTime
  let lastReducedMotionFrame = 0
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderScene = () => {
    if (!scene || !renderer || !camera) return

    if (composer) {
      composer.render()
    } else {
      renderer.render(scene, camera)
    }
  }

  const animate = () => {
    animationId = requestAnimationFrame(animate)

    const now = performance.now()
    if (document.hidden || (prefersReducedMotion && now - lastReducedMotionFrame < 100)) return
    lastReducedMotionFrame = now

    const deltaTime = Math.min((now - lastFrameTime) / 1000, 0.05)
    lastFrameTime = now
    frameCount++

    if (now - fpsWindowStarted >= 500) {
      fps.value = Math.round((frameCount * 1000) / (now - fpsWindowStarted))
      frameCount = 0
      fpsWindowStarted = now
    }

    // Calculate energized level (0-1)
    const timeSinceWheel = Math.max(0, wheelScrollTime - now)
    energizedLevel.value = Math.max(0, timeSinceWheel / 2000)

    // Calculate click pulse intensity (fades from 1 to 0)
    if (now >= clickPulseEndTime) {
      clickPulseIntensity = 0
    } else {
      const pulseFade = (clickPulseEndTime - now) / 200
      clickPulseIntensity = Math.max(0, pulseFade)
    }

    // Update scene
    time.value = now

    if (themeManager && scene && renderer && camera) {
      const currentTheme = themeManager.getCurrentTheme()
      if (currentTheme) {
        // Synthesize pattern (universal driver for all themes)
        const pattern = synthesizePattern(now)

        // Build interaction state for the theme
        const interactionState: ThemeInteractionState = {
          cursor: {
            position: mousePos,
            radius: 50,
            strength: 0.5,
          },
          energizedLevel: energizedLevel.value,
          clickPulse: clickPulseIntensity,
          deltaTime, // Pass frame-rate independent delta time
        }

        // Update theme
        currentTheme.update(now, pattern, interactionState)

        // Render
        renderScene()
      }
    }
  }

  // Present the initialized particle field before starting the expensive
  // physics loop. Calling animate() synchronously here made the hardware path
  // block its first browser paint while calculating particle interactions,
  // leaving a black canvas during startup.
  renderScene()
  canvasRef.value.dataset.animationState = 'ready'
  animationId = requestAnimationFrame(animate)

  // Cleanup function
  cleanupScene = () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
    }

    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('click', handleClick)
    window.removeEventListener('touchstart', handleTouch)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('wheel', handleWheel)

    // Theme manager handles all cleanup (renderer, composer, geometries, materials)
    if (themeManager) {
      themeManager.dispose()
      themeManager = null
    }
    scene = null
    camera = null
    renderer = null
    composer = undefined
    canvasRef.value?.removeAttribute('data-animation-state')
  }
}

/**
 * Switch to a different theme
 */
const switchTheme = async (themeName: ThemeName) => {
  if (!themeManager) return

  // Update URL
  const url = new URL(window.location.href)
  url.searchParams.set('theme', themeName)
  window.history.replaceState({}, '', url.toString())

  // Load new theme
  const themeSetup = await themeManager.loadTheme(themeName, getPaletteOrbColors(props.palette))
  if (!componentActive) return
  scene = themeSetup.scene
  camera = themeSetup.camera
  renderer = themeSetup.renderer
  composer = themeSetup.composer
  currentTheme.value = themeName
}

onMounted(async () => {
  // Wait for DOM to fully render refs
  await nextTick()

  // Animate hero text elements with GSAP
  heroTimeline = gsap.timeline()

  // Stagger the entrance animations
  heroTimeline
    .fromTo(
      nameRef.value,
      { y: 20 },
      { y: 0, duration: 0.8, ease: 'cubic.out' },
      0
    )
    .fromTo(
      roleRef.value,
      { opacity: 0.65, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'cubic.out' },
      0.15
    )
    .fromTo(
      buttonsRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'cubic.out' },
      0.45
    )

  // Add subtle continuous animations
  gsap.to(nameRef.value, {
    y: -5,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 1,
  })

  // Animate role subtitle items with stagger
  if (roleRef.value) {
    const roleItems = roleRef.value.querySelectorAll('.role-item')
    const roleSeparators = roleRef.value.querySelectorAll('.role-separator')

    // Stagger entrance for role items
    gsap.fromTo(
      roleItems,
      { opacity: 0, x: -10 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'cubic.out',
        stagger: 0.15,
        delay: 0.25
      }
    )

    // Fade in separators slightly delayed
    gsap.fromTo(
      roleSeparators,
      { opacity: 0 },
      {
        opacity: 0.6,
        duration: 0.5,
        ease: 'cubic.out',
        stagger: 0.15,
        delay: 0.3
      }
    )

    // Continuous subtle pulse on role items
    gsap.to(roleItems, {
      opacity: 0.9,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.5,
    })
  }

  // Let the original hero content paint before starting WebGL and particle
  // physics. This keeps the intro responsive without changing its animation.
  await waitForInitialPaint()
  if (!componentActive) return

  // Initialize 3D scene
  await initScene()
})

onUnmounted(() => {
  componentActive = false
  cleanupScene?.()
  heroTimeline?.kill()
  gsap.killTweensOf([
    nameRef.value,
    roleRef.value,
    taglineRef.value,
    buttonsRef.value,
    ...(roleRef.value?.querySelectorAll('.role-item, .role-separator') || []),
  ])
})
</script>

<style scoped>
/* Ensure canvas fills container */
canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Role subtitle styling */
.role-item {
  display: inline-block;
  white-space: nowrap;
}

.role-separator {
  display: inline-block;
  opacity: 0.5;
  margin: 0 0.5rem;
  font-weight: 300;
  letter-spacing: 0.05em;
}
</style>
