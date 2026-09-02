/**
 * HARMONIC RIPPLES THEME
 * Psychedelic pulsing rings expanding outward
 *
 * Visual: Concentric rings that pulse, expand, and morph with additive blending,
 * colors shift through psychedelic spectrum with interference patterns
 *
 * Technical: Fragment shader fullscreen with layered ring patterns,
 * driven by synthesis engine for organic animation
 *
 * Performance: ~60fps on mid-range hardware (fragment shader based)
 */

import * as THREE from 'three'
import { SynthesizedPattern } from '../synthesis'
import { ThemeSetupResult, ThemeInteractionState, ThemeConfig } from './themeTypes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const CONFIG: ThemeConfig = {
  name: 'Harmonic Ripples',
  description: 'Psychedelic pulsing interference patterns',
  colors: {
    primary: '#ff006e',
    secondary: '#00d4ff',
    tertiary: '#ffbe0b',
  },
  performance: {
    targetFps: 60,
  },
}

// Fragment shader: pulsing harmonic rings with interference
const rippleFragmentShader = `
  uniform float time;
  uniform float morphIntensity;
  uniform float colorShift;
  uniform float lightIntensity;
  uniform float evolutionPhase;
  uniform vec3 cursorPos;
  uniform float cursorInfluence;

  varying vec2 vUv;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float aspect = 1.0; // Square aspect for radial patterns

    // Normalize coordinates to create radial center
    uv.x *= aspect;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);

    // Cursor influence: warp the pattern
    vec2 cursorNorm = cursorPos.xy * 0.5;
    float cursorDist = length(uv - cursorNorm);
    float cursorWarp = exp(-cursorDist * cursorDist * 2.0) * cursorInfluence;

    // Multiple harmonic rings with different frequencies
    float ring1 = sin(dist * 8.0 - time * 0.001 + angle * 2.0) * 0.5 + 0.5;
    float ring2 = sin(dist * 5.0 - time * 0.0012 + angle * 3.0 + evolutionPhase) * 0.5 + 0.5;
    float ring3 = cos(dist * 12.0 + time * 0.0008 - angle) * 0.5 + 0.5;

    // Pulsing expansion (breathing effect)
    float pulse = sin(time * 0.0005) * 0.3 + 0.7;
    float expandingRings = sin((dist - time * 0.0008) * 10.0 * pulse + angle * 4.0) * 0.5 + 0.5;

    // Combine rings with morphing
    float pattern = mix(
      mix(ring1, ring2, 0.5) * 0.6,
      expandingRings * 0.7,
      morphIntensity
    );

    // Apply cursor distortion
    pattern += cursorWarp * 0.4;

    // Interference pattern: add fine detail
    float interference = sin(dist * 20.0 + angle * 6.0 - time * 0.0006) * 0.5 + 0.5;
    pattern = mix(pattern, interference, 0.3);

    // Smooth step for more defined rings
    pattern = smoothstep(0.2, 0.8, pattern);

    // Psychedelic color mapping with multiple cycling hues
    // Fast cycling through spectrum based on time, pattern, and spatial position
    float hue = fract(pattern * 1.5 + colorShift * 2.0 + angle / 6.28318 + time * 0.0003);
    float saturation = 0.95 + sin(time * 0.0003 + pattern * 3.0) * 0.05;
    float lightness = 0.35 + lightIntensity * 0.2;

    vec3 color = hsv2rgb(vec3(hue, saturation, lightness));

    // Add secondary color layer with complementary hue for richer cycling
    vec3 accentHue = hsv2rgb(vec3(fract(hue + 0.33), saturation * 0.7, 0.3));
    color += accentHue * pattern * lightIntensity * 0.25;

    // Additive blending effect
    gl_FragColor = vec4(color, 0.9);
  }
`

const rippleVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const createSpectrumAnalyzerTheme = (
  canvas: HTMLCanvasElement,
  userConfig?: Partial<ThemeConfig>
): ThemeSetupResult => {
  const width = window.innerWidth
  const height = window.innerHeight

  // ===== SCENE SETUP =====
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0012)

  // ===== CAMERA =====
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
  camera.position.z = 1

  // ===== RENDERER =====
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false })
  const dpr = Math.min(window.devicePixelRatio, 1.5)
  renderer.setPixelRatio(dpr)
  renderer.setSize(width, height)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.75

  // ===== POSTPROCESSING =====
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    0.8, // strength - moderate glow, more color visible
    0.5, // radius
    0.8 // threshold - only brightest parts glow
  )
  composer.addPass(bloomPass)

  // ===== FULLSCREEN QUAD =====
  const geometry = new THREE.PlaneGeometry(2, 2)

  const uniforms = {
    time: { value: 0 },
    morphIntensity: { value: 0 },
    colorShift: { value: 0 },
    lightIntensity: { value: 0 },
    evolutionPhase: { value: 0 },
    cursorPos: { value: new THREE.Vector3(0, 0, 0) },
    cursorInfluence: { value: 0 },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: rippleVertexShader,
    fragmentShader: rippleFragmentShader,
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // ===== RESIZE HANDLER =====
  const handleResize = () => {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight
    renderer.setSize(newWidth, newHeight)
  }

  window.addEventListener('resize', handleResize)

  // ===== UPDATE LOOP =====
  const update = (
    time: number,
    pattern: SynthesizedPattern,
    interaction: ThemeInteractionState
  ) => {
    // Update shader uniforms
    uniforms.time.value = time * 0.001
    uniforms.morphIntensity.value = pattern.morphIntensity + interaction.energizedLevel * 0.3
    uniforms.colorShift.value = pattern.colorShift
    uniforms.lightIntensity.value = pattern.lightIntensity + interaction.clickPulse * 0.5
    uniforms.evolutionPhase.value = pattern.evolutionPhase

    // Cursor influence
    if (interaction.cursor.position) {
      const normalizedX = (interaction.cursor.position.x / window.innerWidth) * 2 - 1
      const normalizedY = 1 - (interaction.cursor.position.y / window.innerHeight) * 2
      uniforms.cursorPos.value.set(normalizedX, normalizedY, 0)
      uniforms.cursorInfluence.value = interaction.energizedLevel * 0.8
    } else {
      uniforms.cursorInfluence.value = 0
    }
  }

  // ===== DISPOSAL =====
  const dispose = () => {
    window.removeEventListener('resize', handleResize)
    geometry.dispose()
    material.dispose()
    composer.dispose()
    renderer.dispose()
  }

  return {
    scene,
    camera,
    renderer,
    composer,
    update,
    dispose,
  }
}
