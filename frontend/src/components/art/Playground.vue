<template>
  <div class="fixed inset-0 bg-black overflow-hidden">
    <!-- Canvas -->
    <canvas ref="canvasRef" class="absolute inset-0" />

    <!-- Dev UI Overlay -->
    <div v-if="isDev" class="pointer-events-none">
      <!-- Performance Monitor (top-right) -->
      <div class="fixed top-4 right-4 bg-black/80 border border-cyan-500/50 rounded p-3 text-xs text-cyan-400 font-mono space-y-1 pointer-events-auto z-40">
        <div class="text-cyan-300 font-bold mb-2">Performance</div>
        <div>FPS: {{ metrics.fps }} (avg: {{ metrics.avgFps }})</div>
        <div>Frame Time: {{ metrics.frameTime }}ms</div>
        <div>Geometries: {{ metrics.geometries }}</div>
        <div>Materials: {{ metrics.materials }}</div>
        <div v-if="metrics.jsHeap">Memory: {{ metrics.jsHeap }}MB / {{ metrics.usedMemory }}MB</div>
        <div class="mt-2 pt-2 border-t border-cyan-500/30">
          <div class="text-xs">Bottleneck: {{ bottleneck }}</div>
        </div>
      </div>

      <!-- Parameter Panel -->
      <ParameterPanel
        :parameters="currentParams"
        :definitions="paramDefinitions"
        :available-themes="availableThemes"
        :current-theme="currentThemeName"
        @param-change="handleParamChange"
        @theme-change="switchTheme"
        @reset-params="resetParams"
        @save-preset="savePreset"
      />
    </div>

    <!-- Theme Browser (if in theme picker mode) -->
    <div
      v-if="showThemeBrowser"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      @click="showThemeBrowser = false"
    >
      <div class="bg-slate-900 border border-cyan-500 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 class="text-cyan-300 text-xl font-bold mb-4">Available Themes</h2>
        <div class="grid grid-cols-2 gap-4">
          <button
            v-for="theme in availableThemes"
            :key="theme"
            @click="switchTheme(theme); showThemeBrowser = false"
            :class="[
              'p-4 rounded border-2 transition-all',
              currentThemeName === theme
                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                : 'border-slate-600 hover:border-cyan-500 text-slate-300'
            ]"
          >
            {{ theme }}
          </button>
        </div>
      </div>
    </div>

    <!-- Keyboard Help -->
    <div class="fixed bottom-4 right-4 text-xs text-slate-500 space-y-1 pointer-events-none">
      <div>Press [T] for theme browser</div>
      <div>Press [H] to toggle HUD</div>
      <div>Press [ESC] to exit dev mode</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import ParameterPanel from '../dev/ParameterPanel.vue'
import { ThemeManager, type ThemeName } from './vectorCloud/themes'
import { synthesizePattern } from './vectorCloud/synthesis'
import { PerformanceMonitor, type PerformanceMetrics } from './vectorCloud/core/performance'
import {
  ParameterPresetManager,
  type ParameterDefinition,
  type ParameterSet,
} from './vectorCloud/themes/core/parameterTuning'

const props = defineProps<{
  isDev?: boolean
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

// State
const currentThemeName = ref<ThemeName>('magnetosphere')
const availableThemes = ref<ThemeName[]>([])
const showThemeBrowser = ref(false)
const currentParams = reactive<ParameterSet>({})
const paramDefinitions = reactive<Record<string, ParameterDefinition>>({})
const metrics = reactive<PerformanceMetrics>({
  fps: 0,
  frameTime: 0,
  minFps: 0,
  maxFps: 0,
  avgFps: 0,
  geometries: 0,
  materials: 0,
  textures: 0,
  drawCalls: 0,
})

// Managers
let themeManager: ThemeManager | null = null
let performanceMonitor: PerformanceMonitor | null = null
let presetManager: ParameterPresetManager | null = null

// Scene objects
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let animationId: number | null = null

// Interaction state
let time = 0
let mousePos = new THREE.Vector3(0, 0, 50)
let energizedLevel = 0

const isDev = props.isDev !== false

const bottleneck = ref('none')

const initScene = () => {
  if (!canvasRef.value) return

  // Initialize managers
  themeManager = new ThemeManager(canvasRef.value)
  presetManager = new ParameterPresetManager()

  availableThemes.value = themeManager.getAvailableThemes()

  // Load initial theme
  const themeSetup = themeManager.loadTheme(currentThemeName.value)
  scene = themeSetup.scene
  camera = themeSetup.camera
  renderer = themeSetup.renderer

  // Initialize default parameters
  const defaultParams = {
    scale: { name: 'Scale', type: 'range' as const, min: 0.1, max: 3, value: 1, step: 0.1, category: 'General' },
    speed: { name: 'Speed', type: 'range' as const, min: 0, max: 2, value: 1, step: 0.1, category: 'General' },
    brightness: { name: 'Brightness', type: 'range' as const, min: 0, max: 2, value: 1, step: 0.1, category: 'Rendering' },
    bloomStrength: { name: 'Bloom Strength', type: 'range' as const, min: 0, max: 3, value: 1.2, step: 0.1, category: 'Rendering' },
    particleSize: { name: 'Particle Size', type: 'range' as const, min: 0.5, max: 10, value: 2, step: 0.5, category: 'Particles' },
  }

  Object.assign(paramDefinitions, defaultParams)
  Object.entries(defaultParams).forEach(([key, def]) => {
    currentParams[key] = def.value
  })

  // Performance monitoring
  if (scene && renderer) {
    performanceMonitor = new PerformanceMonitor(scene, renderer)
  }

  // Handle resize
  const handleResize = () => {
    if (!camera || !renderer) return

    const width = canvasRef.value!.clientWidth
    const height = canvasRef.value!.clientHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  handleResize()
  window.addEventListener('resize', handleResize)

  // Interaction handlers
  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvasRef.value!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    if (camera) {
      mousePos.x = (x - 0.5) * (camera.right - camera.left)
      mousePos.y = -(y - 0.5) * (camera.top - camera.bottom)
    }
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    energizedLevel = Math.min(1, energizedLevel + 0.1)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 't' || e.key === 'T') {
      showThemeBrowser.value = !showThemeBrowser.value
    }
    if (e.key === 'h' || e.key === 'H') {
      // Toggle HUD (would need to add state for this)
    }
    if (e.key === 'Escape') {
      // Exit dev mode
      window.location.pathname = '/'
    }
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('keydown', handleKeyDown)

  // Animation loop
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    if (!renderer || !camera || !scene) return

    // Update time and pattern
    time += 16 // ~60fps
    const pattern = synthesizePattern(time)

    // Decay energized level
    energizedLevel *= 0.95

    // Update metrics
    if (performanceMonitor) {
      performanceMonitor.update()
      const m = performanceMonitor.getMetrics()
      Object.assign(metrics, m)
      bottleneck.value = performanceMonitor.getBottleneck()
    }

    // Update theme
    const theme = themeManager?.getCurrentTheme()
    if (theme && theme.update) {
      theme.update(time, pattern, {
        cursor: { position: mousePos, radius: 50, strength: 1 },
        energizedLevel,
        clickPulse: 0,
        deltaTime: 0.016,
      })
    }
  }

  animate()

  return () => {
    if (animationId !== null) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('wheel', handleWheel)
    window.removeEventListener('keydown', handleKeyDown)
  }
}

const switchTheme = (themeName: ThemeName | string) => {
  if (!themeManager) return
  currentThemeName.value = themeName as ThemeName
  const setup = themeManager.loadTheme(themeName as ThemeName)
  scene = setup.scene
  camera = setup.camera
  renderer = setup.renderer

  // Load default parameters for theme
  const defaultParams = {
    scale: { name: 'Scale', type: 'range' as const, min: 0.1, max: 3, value: 1, step: 0.1, category: 'General' },
    speed: { name: 'Speed', type: 'range' as const, min: 0, max: 2, value: 1, step: 0.1, category: 'General' },
    brightness: { name: 'Brightness', type: 'range' as const, min: 0, max: 2, value: 1, step: 0.1, category: 'Rendering' },
    bloomStrength: { name: 'Bloom Strength', type: 'range' as const, min: 0, max: 3, value: 1.2, step: 0.1, category: 'Rendering' },
    particleSize: { name: 'Particle Size', type: 'range' as const, min: 0.5, max: 10, value: 2, step: 0.5, category: 'Particles' },
  }

  Object.assign(paramDefinitions, defaultParams)
  Object.entries(defaultParams).forEach(([key, def]) => {
    currentParams[key] = def.value
  })

  if (scene && renderer && performanceMonitor) {
    performanceMonitor = new PerformanceMonitor(scene, renderer)
  }
}

const handleParamChange = (key: string, value: any) => {
  currentParams[key] = value
}

const resetParams = () => {
  // Reset to default values
  Object.entries(paramDefinitions).forEach(([key, def]) => {
    currentParams[key] = def.value
  })
}

const savePreset = (name: string, params: ParameterSet) => {
  if (!presetManager) return
  presetManager.savePreset(name, params, `${currentThemeName.value} - ${name}`)
  console.log(`✓ Preset saved: ${name}`)
}

onMounted(() => {
  initScene()
})

onUnmounted(() => {
  if (themeManager) {
    themeManager.dispose()
  }
})
</script>
