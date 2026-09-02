/**
 * KALEIDOSCOPE FRACTALS THEME
 * Hypnotic radial symmetry with raymarched fractals
 *
 * Visual: Infinitely zooming/rotating fractals with perfect 6-8 fold symmetry,
 * mandala patterns, psychedelic color cycles
 *
 * Technical: Heavily fragment shader based (pure math, no geometry)
 * Interaction: Cursor position modulates fractal parameters
 *
 * Performance: Fragment shader cost, but no geometry overhead
 * ~60fps on mid-range hardware (adaptive shader complexity)
 */

import * as THREE from 'three'
import { SynthesizedPattern } from '../synthesis'
import { ThemeSetupResult, ThemeInteractionState, ThemeConfig } from './themeTypes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const CONFIG: ThemeConfig = {
  name: 'Kaleidoscope Fractals',
  description: 'Hypnotic radial symmetry and evolving fractals',
  colors: {
    primary: '#ff006e',
    secondary: '#00d4ff',
    tertiary: '#ffbe0b',
  },
  performance: {
    targetFps: 60,
  },
}

// Fragment shader: psychedelic liquid fractals with acid/DMT effects
const fractalFragmentShader = `
  uniform float time;
  uniform float evolutionPhase;
  uniform float morphIntensity;
  uniform float colorShift;
  uniform float spatialFlow;
  uniform vec3 cursorPos;
  uniform float cursorInfluence;

  varying vec2 vUv;

  // Psychedelic cosine palette with more color variation
  vec3 cosineGradient(float t) {
    vec3 color = cos(6.28318 * (vec3(colorShift * 1.2, colorShift + 0.2, colorShift + 0.5) + t));
    // Darker output for readability on dark background
    return (color * 0.7 + 0.3) * 0.75;
  }

  // Smooth noise-like function
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n00 = sin(dot(i, vec2(12.9898, 78.233))) * 43758.5453;
    float n10 = sin(dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453;
    float n01 = sin(dot(i + vec2(0.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453;
    float n11 = sin(dot(i + vec2(1.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453;

    n00 -= floor(n00);
    n10 -= floor(n10);
    n01 -= floor(n01);
    n11 -= floor(n11);

    return mix(mix(n00, n10, f.x), mix(n01, n11, f.x), f.y);
  }

  // Organic liquid distortion (smooth, flowing)
  vec2 liquidDistort(vec2 p, float time) {
    float dist1 = sin(p.x * 1.2 + time * 0.000012) * 0.05;
    float dist2 = cos(p.y * 1.2 + time * 0.000015) * 0.05;
    float noise = smoothNoise(p * 1.5 + time * 0.00001) * 0.03;

    return p + vec2(dist1 + noise, dist2 + noise);
  }

  // Fractal with liquid morphing
  float fractal(vec2 p, int iterations) {
    vec2 z = vec2(0.0);
    float r = 0.0;

    for (int i = 0; i < iterations; i++) {
      if (r > 4.0) break;

      z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + p;
      r = dot(z, z);
    }

    return sqrt(r) / float(iterations);
  }

  // Multi-layered organic wave patterns (smooth, fluid)
  float liquidWave(vec2 p, float time) {
    float angle = atan(p.y, p.x);
    float radius = length(p);

    // Very slow, smooth waves for ultra-fluid feel
    float wave1 = sin(angle * 2.0 + time * 0.000015 + radius * 0.06) * 0.5 + 0.5;
    float wave2 = sin(radius * 3.0 - time * 0.00003 + angle * 1.0) * 0.5 + 0.5;
    float wave3 = cos(angle * 1.0 + time * 0.000012 + radius * 0.03) * 0.5 + 0.5;

    // Smooth organic blending
    return mix(wave1 * wave2, wave3, 0.5) * (0.8 + morphIntensity * 0.2);
  }

  // Psychedelic color bleeding
  vec3 colorBleed(vec3 color, float pattern, float time) {
    // Add color shift/bleeding based on position (very subtle, slow)
    vec3 bleed = cosineGradient(pattern * 2.0 + time * 0.000008) * 0.2;
    return color + bleed;
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    p *= 1.5;

    // Liquid distortion from cursor
    vec2 cursorNorm = cursorPos.xy;
    vec2 distortedP = liquidDistort(p + cursorNorm * cursorInfluence * 0.5, time);

    // Very subtle zoom modulation (glacial breathing)
    float zoomAmount = 1.0 + sin(time * 0.000005) * morphIntensity * 0.2;
    distortedP /= zoomAmount;

    // Multi-speed rotation for psychedelic effect
    float rot1 = evolutionPhase * 6.28318 + spatialFlow * 6.28318;
    float rot2 = evolutionPhase * 3.14159 + spatialFlow * 4.0;

    mat2 rotMat1 = mat2(cos(rot1), -sin(rot1), sin(rot1), cos(rot1));
    mat2 rotMat2 = mat2(cos(rot2), -sin(rot2), sin(rot2), cos(rot2));

    distortedP = rotMat1 * distortedP;

    // Layered fractals with morphing
    float folds = 6.0 + morphIntensity * 3.0;

    // Multiple fractal layers blended
    float fractal1 = fractal(distortedP * 0.5, 20) * 0.7;
    float fractal2 = fractal(rotMat2 * distortedP * 0.3, 15) * 0.4;
    float liquid = liquidWave(distortedP, time);

    // Combine with more organic feel
    float pattern = mix(fractal1 + fractal2, liquid, 0.4 + morphIntensity * 0.3);

    // Smoother transitions
    pattern = smoothstep(0.1, 0.9, pattern);

    // Base color with psychedelic cycling (slow, liquid color changes)
    vec3 color = cosineGradient(pattern + time * 0.00002);

    // Apply color bleeding for acid effect
    color = colorBleed(color, pattern, time);

    // Darker output for better contrast on dark backgrounds
    color *= (0.45 + spatialFlow * 0.3 + morphIntensity * 0.15);

    gl_FragColor = vec4(color, 1.0);
  }
`

const fractalVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const createKaleidoscopeFractalsTheme = (
  canvas: HTMLCanvasElement,
  userConfig?: Partial<ThemeConfig>
): ThemeSetupResult => {
  const width = window.innerWidth
  const height = window.innerHeight

  // ===== SCENE SETUP =====
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0e27)

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
  renderer.toneMappingExposure = 0.9

  // ===== POSTPROCESSING =====
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.1, // strength - moderate for color clarity
    0.4, // radius
    0.75 // threshold
  )
  composer.addPass(bloomPass)

  // ===== FULLSCREEN QUAD =====
  const geometry = new THREE.PlaneGeometry(2, 2)

  const uniforms = {
    time: { value: 0 },
    evolutionPhase: { value: 0 },
    morphIntensity: { value: 0 },
    colorShift: { value: 0 },
    spatialFlow: { value: 0 },
    cursorPos: { value: new THREE.Vector3(0, 0, 0) },
    cursorInfluence: { value: 0 },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: fractalVertexShader,
    fragmentShader: fractalFragmentShader,
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
    // Update shader uniforms (slowed down for fluid effect)
    uniforms.time.value = time * 0.0003
    uniforms.evolutionPhase.value = pattern.evolutionPhase
    uniforms.morphIntensity.value = pattern.morphIntensity + interaction.energizedLevel * 0.3
    uniforms.colorShift.value = pattern.colorShift
    uniforms.spatialFlow.value = pattern.spatialFlow + interaction.clickPulse * 0.5

    // Cursor influence on fractal
    if (interaction.cursor.position) {
      uniforms.cursorPos.value.copy(interaction.cursor.position)
      uniforms.cursorInfluence.value = interaction.cursor.strength + interaction.clickPulse
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
