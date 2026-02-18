<template>
  <div class="fixed inset-0 bg-black overflow-hidden">
    <!-- Three.js Canvas (pointer-events: none so UI clicks work) -->
    <canvas ref="canvasRef" class="absolute inset-0 pointer-events-none" />

    <!-- Overlay UI -->
    <div class="relative z-10 h-full flex flex-col items-center justify-center pointer-events-none px-4 md:px-0">
      <div class="text-center space-y-4 md:space-y-6 w-full">
        <!-- Name + Role -->
        <div ref="heroNameRef">
          <h1 ref="nameRef" class="text-4xl md:text-6xl font-bold mb-2 md:mb-3 leading-tight text-white" style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; letter-spacing: -0.02em; text-shadow: 0 0 20px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.9);">
            NICK KAMPE
          </h1>
          <p ref="roleRef" class="text-sm md:text-lg tracking-wider font-semibold inline-flex gap-1 md:gap-2 flex-wrap justify-center px-2" style="font-family: 'Space Grotesk', sans-serif; font-weight: 500; letter-spacing: 0.08em; opacity: 0; color: hsl(var(--color-secondary-hsl) / 1); text-shadow: 0 0 12px rgba(0,0,0,0.7), 1px 1px 3px rgba(0,0,0,0.8);">
            <span class="role-item">Platform Engineer</span>
            <span class="role-separator">|</span>
            <span class="role-item">Software Craftsman</span>
            <span class="role-separator">|</span>
            <span class="role-item">Perpetual Learner</span>
          </p>
        </div>

        <!-- Tagline -->
        <p ref="taglineRef" class="text-sm md:text-base max-w-sm md:max-w-5xl mx-auto leading-relaxed px-2 text-white/80" style="font-family: 'Inter', sans-serif; font-weight: 400; opacity: 0; text-shadow: 0 0 10px rgba(0,0,0,0.6), 1px 1px 2px rgba(0,0,0,0.7);">
          Expert infrastructure architect & DevOps specialist scaling production systems for startups and enterprise. <br class="hidden md:block">Designing cloud migrations, deploying modern CI/CD solutions, and building scalable platforms. <br class="hidden md:block"><span class="whitespace-nowrap">15+ years of proven expertise.</span> <span class="whitespace-nowrap">Available for strategic long-term engagements.</span>
        </p>

        <!-- CTA Buttons -->
        <div ref="buttonsRef" class="flex flex-col md:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4 pointer-events-auto px-2" style="opacity: 0;">
          <button @click="$emit('open-contact')" class="relative px-4 md:px-6 py-2 border-2 text-white font-semibold transition-all duration-300 text-xs md:text-sm uppercase tracking-widest whitespace-nowrap group overflow-hidden rounded-lg" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 1)`, color: 'white' }" @mouseenter="hoverPrimaryBtn = true" @mouseleave="hoverPrimaryBtn = false">
            <span class="absolute inset-0 transition-colors duration-300" :style="{ backgroundColor: `hsl(var(--color-primary-hsl) / ${hoverPrimaryBtn ? 0.1 : 0.05})` }"></span>
            <span class="relative block">▸ Contact Me</span>
            <span class="absolute bottom-0 left-0 w-0 h-1 transition-all duration-500" :style="{ backgroundImage: `linear-gradient(to right, hsl(var(--color-primary-hsl) / 1), hsl(var(--color-secondary-hsl) / 1))`, width: hoverPrimaryBtn ? '100%' : '0%' }"></span>
          </button>
          <a href="https://github.com/Kampe" target="_blank" class="relative inline-block px-4 md:px-6 py-2 border-2 text-white font-semibold transition-all duration-300 text-xs md:text-sm uppercase tracking-widest whitespace-nowrap group overflow-hidden rounded-lg" :style="{ borderColor: `hsl(var(--color-primary-hsl) / 1)`, color: 'white' }" @mouseenter="hoverGithubBtn = true" @mouseleave="hoverGithubBtn = false">
            <span class="absolute inset-0 transition-colors duration-300" :style="{ backgroundColor: `hsl(var(--color-accent-hsl) / ${hoverGithubBtn ? 0.1 : 0.05})` }"></span>
            <span class="relative block">◆ GitHub</span>
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
          <button @click="switchTheme('spectrum')" class="block text-left hover:text-cyan-200 mb-1">
            [1] Spectrum
          </button>
          <button @click="switchTheme('kaleidoscope')" class="block text-left hover:text-cyan-200 mb-1">
            [2] Kaleidoscope
          </button>
          <button @click="switchTheme('milkdrop')" class="block text-left hover:text-cyan-200 mb-1">
            [3] Milkdrop
          </button>
          <button @click="switchTheme('dmt')" class="block text-left hover:text-cyan-200 mb-1">
            [4] DMT Geometry
          </button>
          <button @click="switchTheme('vectorfield')" class="block text-left hover:text-cyan-200 mb-1">
            [5] Vector Field Floor
          </button>
          <button @click="switchTheme('magnetosphere')" class="block text-left hover:text-cyan-200">
            [6] Charged Magnetosphere
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick, defineEmits, defineProps } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import { ThemeManager, getThemeFromURL, type ThemeName, type ThemeInteractionState } from './vectorCloud/themes'
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
const heroNameRef = ref<HTMLElement | null>(null)
const fps = ref(0)
const showDebugHUD = ref(false)
const particleCount = ref(0)
const time = ref(0)
const energizedLevel = ref(0)
const currentTheme = ref<string>('magnetosphere')
const hoverPrimaryBtn = ref(false)
const hoverGithubBtn = ref(false)

// Theme labels for display
const themeLabels = {
  spectrum: 'Harmonic Ripples',
  kaleidoscope: 'Kaleidoscope Fractals',
  milkdrop: 'Milkdrop Morphing',
  dmt: 'DMT Geometry',
  vectorfield: 'Vector Field Floor',
  magnetosphere: 'Charged Magnetosphere',
}

// Scene objects
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let composer: any = null // EffectComposer for postprocessing
let animationId: number | null = null
let themeManager: ThemeManager | null = null

// Interaction state
let mousePos = new THREE.Vector3(0, 0, 50)
let clickPulseIntensity = 0
let clickPulseEndTime = 0
let wheelScrollTime = 0

// Camera drift for "floating through space" effect
let cameraBaseZ = 50
let cameraTargetX = 0
let cameraTargetY = 0

const initScene = () => {
  if (!canvasRef.value) return

  // Detect debug mode
  showDebugHUD.value = new URLSearchParams(window.location.search).has('debug')

  // Initialize theme manager
  themeManager = new ThemeManager(canvasRef.value)

  // Get palette orb colors to pass to theme (safely handle if palette not ready)
  let paletteOrbColors: { color1: number; color2: number; color3: number } | undefined
  if (props.palette) {
    paletteOrbColors = getPaletteOrbColors(props.palette)
  }

  // Load theme from URL or default to magnetosphere
  const themeName = (getThemeFromURL() || 'magnetosphere') as ThemeName
  const themeSetup = themeManager.loadTheme(themeName, paletteOrbColors)

  scene = themeSetup.scene
  camera = themeSetup.camera
  renderer = themeSetup.renderer
  composer = themeSetup.composer
  particleCount.value = 1000  // Typical for particle-based themes
  currentTheme.value = themeName

  // Handle resize
  const handleResize = () => {
    if (!camera || !renderer) return
    const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

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
  const handleWheel = (event: WheelEvent) => {
    wheelScrollTime = performance.now() + 2000
  }

  // Handle keyboard for theme switching
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === '1') switchTheme('spectrum')
    if (event.key === '2') switchTheme('kaleidoscope')
    if (event.key === '3') switchTheme('milkdrop')
    if (event.key === '4') switchTheme('dmt')
    if (event.key === '5') switchTheme('vectorfield')
    if (event.key === '6') switchTheme('magnetosphere')
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

  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('click', handleClick)
  window.addEventListener('touchstart', handleTouch)
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  window.addEventListener('wheel', handleWheel, { passive: true })
  window.addEventListener('keydown', handleKeydown)

  // Animation loop
  let lastFrameTime = performance.now()
  let frameCount = 0

  const animate = () => {
    animationId = requestAnimationFrame(animate)

    // Calculate FPS
    const now = performance.now()
    const deltaTime = (now - lastFrameTime) / 1000
    lastFrameTime = now
    frameCount++

    if (frameCount % 30 === 0) {
      fps.value = Math.round(1 / deltaTime)
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

    if (themeManager && scene && renderer && composer) {
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
        if (composer && composer.render) {
          composer.render()
        } else {
          renderer.render(scene, camera)
        }
      }
    }
  }

  animate()

  // Cleanup function
  const cleanup = () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
    }

    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('click', handleClick)
    window.removeEventListener('touchstart', handleTouch)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('wheel', handleWheel)
    window.removeEventListener('keydown', handleKeydown)

    // Theme manager handles all cleanup (renderer, composer, geometries, materials)
    if (themeManager) {
      themeManager.dispose()
      themeManager = null
    }
  }

  onUnmounted(() => {
    cleanup()
  })
}

/**
 * Switch to a different theme
 */
const switchTheme = (themeName: ThemeName) => {
  if (!themeManager) return

  // Update URL
  const url = new URL(window.location.href)
  url.searchParams.set('theme', themeName)
  window.history.replaceState({}, '', url.toString())

  // Load new theme
  const themeSetup = themeManager.loadTheme(themeName)
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
  const timeline = gsap.timeline()

  // Stagger the entrance animations
  timeline
    .fromTo(
      nameRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'cubic.out' },
      0
    )
    .fromTo(
      roleRef.value,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'cubic.out' },
      0.15,
      '-=0.3'
    )
    .fromTo(
      taglineRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'cubic.out' },
      0.3
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

  // Initialize 3D scene
  initScene()
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
