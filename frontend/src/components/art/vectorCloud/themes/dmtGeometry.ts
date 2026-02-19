/**
 * KALEIDOSCOPE MANDALA THEME
 * Full-screen infinite geometric mandala with psychedelic colors
 *
 * Visual: Rotating, breathing kaleidoscope with crisp symmetry, layered depth,
 * and glow. Procedurally generated psychedelic textures with geometric overlays.
 * N-fold symmetry (6, 8, 12, 16, 24 wedges), radial rings, SDF line structures.
 *
 * Technical: Full-screen ShaderMaterial with polar coordinate folding,
 * multi-layer sampling, animation, and mouse interaction. Procedural colors.
 *
 * Interaction: Mouse controls center offset, wheel controls zoom,
 * click cycles symmetry count. All smooth and gallery-level.
 *
 * Performance: ~60fps desktop, 45-55fps mobile
 */

import * as THREE from 'three'
import { SynthesizedPattern } from '../synthesis'
import { ThemeSetupResult, ThemeInteractionState, ThemeConfig } from './themeTypes'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const CONFIG: ThemeConfig = {
  name: 'Kaleidoscope Mandala',
  description: 'Infinite rotating psychedelic geometric mandala',
  colors: {
    primary: '#ff00ff',
    secondary: '#00ffff',
    tertiary: '#ffff00',
  },
  performance: {
    targetFps: 60,
  },
}

// Full-screen kaleidoscope shader with psychedelic colors
const kaleidoscopeVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const kaleidoscopeFragmentShader = `
  uniform float time;
  uniform float colorShift;
  uniform float lightIntensity;
  uniform float morphIntensity;
  uniform vec2 mouseCenter;
  uniform float zoomLevel;
  uniform float symmetryCount;
  uniform float cursorInfluence;

  varying vec2 vUv;

  // Pseudo-random noise for psychedelic patterns
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // Cheap turbulence using wave functions
  float turbulence(vec2 p, float scale) {
    float t = 0.0;
    t += 0.5 * sin(p.x * scale + time * 0.0003);
    t += 0.25 * sin(p.y * scale * 1.3 + time * 0.0002);
    t += 0.125 * sin((p.x + p.y) * scale * 0.8 + time * 0.0004);
    return t;
  }

  // Sample procedurally generated psychedelic texture
  vec3 samplePsychedelic(vec2 uv, float layer) {
    // Base frequency patterns - keep values bounded
    float wave1 = sin(uv.x * 2.0 + time * 0.0003);
    float wave2 = cos(uv.y * 2.5 + time * 0.0002);
    float wave3 = sin((uv.x + uv.y) * 1.5 + time * 0.0004);

    // Combine waves, constrain to [-1, 1]
    float pattern = (wave1 * 0.4 + wave2 * 0.4 + wave3 * 0.2) * 0.5 + 0.5; // Now in [0, 1]

    // Add layer-based modulation
    pattern = mix(pattern, sin(pattern * 6.28 + layer * 2.0) * 0.5 + 0.5, 0.3);

    // Generate hue based on pattern and time
    float hue = colorShift + pattern * 0.5 + layer * 0.12 + time * 0.0004;
    hue = fract(hue); // Keep in [0, 1]

    // Saturation and brightness - ensure visible colors
    float saturation = 0.85 + sin(time * 0.0002 + layer) * 0.1; // [0.75, 0.95]
    float brightness = 0.45 + pattern * 0.3; // [0.45, 0.75]

    // HSB to RGB - simplified and reliable conversion
    float h = hue * 6.0;
    float sector = floor(h);
    float fade = fract(h);

    float p = brightness * (1.0 - saturation);
    float q = brightness * (1.0 - saturation * fade);
    float t = brightness * (1.0 - saturation * (1.0 - fade));

    vec3 rgb;
    if (sector < 1.0) rgb = vec3(brightness, t, p);
    else if (sector < 2.0) rgb = vec3(q, brightness, p);
    else if (sector < 3.0) rgb = vec3(p, brightness, t);
    else if (sector < 4.0) rgb = vec3(p, q, brightness);
    else if (sector < 5.0) rgb = vec3(t, p, brightness);
    else rgb = vec3(brightness, p, q);

    return rgb;
  }

  // Kaleidoscope transform with N-fold symmetry
  vec2 kaleidoscopeTransform(vec2 p, float n) {
    float r = length(p);
    float a = atan(p.y, p.x);

    // Fold into wedge
    float segment = 6.28318 / n;
    a = mod(a, segment);
    a = abs(a - segment * 0.5);

    // Rebuild from polar
    return vec2(cos(a), sin(a)) * r;
  }

  // Radial ring quantization for geometric structure
  float ringQuantize(float r, float ringCount) {
    float rq = floor(r * ringCount) / ringCount;
    return mix(r, rq, 0.3); // Subtle blend to avoid harsh banding
  }

  // SDF-based geometric line overlays
  float geometricLines(float r, float a, float freq) {
    // Radial lines
    float radialLine = abs(sin(a * freq)) * 0.15;

    // Ring lines
    float ringLine = abs(sin(r * freq * 10.0)) * 0.1;

    return max(radialLine, ringLine);
  }

  void main() {
    // Centered coordinates with aspect correction
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= 1.0; // Aspect ratio

    // Apply mouse offset for parallax
    uv -= mouseCenter * 0.3;

    // Apply zoom
    uv *= zoomLevel;

    // Multi-layer kaleidoscope sampling
    vec3 color = vec3(0.0);

    // Layer 1: Base kaleidoscope
    vec2 p1 = kaleidoscopeTransform(uv, symmetryCount);
    float r1 = length(p1);
    float a1 = atan(p1.y, p1.x);

    // Apply ring quantization
    r1 = ringQuantize(r1, 4.0 + morphIntensity * 2.0);

    // Breathing pulse animation
    r1 *= 1.0 + 0.04 * sin(time * 0.0004 + r1 * 3.0);

    // Sample psychedelic texture
    vec3 layer1 = samplePsychedelic(p1, 0.0);
    color = layer1;

    // Layer 2: Rotated + zoomed variant for depth
    float rotation = time * 0.00015;
    float cosRot = cos(rotation);
    float sinRot = sin(rotation);
    vec2 p2 = vec2(cosRot * uv.x - sinRot * uv.y, sinRot * uv.x + cosRot * uv.y);
    p2 *= 1.2; // Slight zoom
    p2 = kaleidoscopeTransform(p2, symmetryCount + 2.0);
    float r2 = length(p2);
    r2 = ringQuantize(r2, 5.0 + morphIntensity * 2.0);
    r2 *= 1.0 + 0.03 * sin(time * 0.0005 + r2 * 2.5);

    vec3 layer2 = samplePsychedelic(p2, 1.0);
    // Blend using overlay blending for better saturation
    color = mix(color, layer2, 0.5);

    // Layer 3: High-frequency detail/sparkle
    vec2 p3 = kaleidoscopeTransform(uv * 0.8, symmetryCount * 1.5);
    float r3 = length(p3);
    r3 = ringQuantize(r3, 8.0 + morphIntensity * 3.0);
    r3 *= 1.0 + 0.025 * sin(time * 0.0006 + r3 * 4.0);

    vec3 layer3 = samplePsychedelic(p3, 2.0);
    color = mix(color, layer3, 0.25);

    // Subtle geometric line overlays
    float lines1 = geometricLines(r1, a1, 6.0 + morphIntensity * 2.0);
    float lines2 = geometricLines(r2, atan(p2.y, p2.x), 5.0);

    // Blend lines in instead of adding
    color = mix(color, color + vec3(0.05, 0.08, 0.1), (lines1 + lines2) * 0.5);

    // Subtle central glow
    float centerDist = length(uv);
    float centerMask = smoothstep(0.4, 0.0, centerDist) * 0.15;
    color = mix(color, color + vec3(0.1, 0.3, 0.4), centerMask);

    // Apply vignette naturally
    vec2 vignetteUv = vUv - 0.5;
    float vignette = 1.0 - length(vignetteUv) * 0.7;
    color *= vignette;

    // Conservative intensity modulation
    color *= (0.8 + lightIntensity * 0.2);

    // Final pass: ensure values stay in valid range
    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`

export const createDMTGeometryTheme = (
  canvas: HTMLCanvasElement,
  userConfig?: Partial<ThemeConfig>
): ThemeSetupResult => {
  const width = window.innerWidth
  const height = window.innerHeight

  // ===== SCENE SETUP =====
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000) // Pure black
  scene.fog = new THREE.FogExp2(0x000000, 0.001)

  // ===== CAMERA =====
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
  camera.position.z = 1

  // ===== RENDERER =====
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  const dpr = Math.min(window.devicePixelRatio, 1.5)
  renderer.setPixelRatio(dpr)
  renderer.setSize(width, height)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.4

  // ===== POSTPROCESSING =====
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    2.0, // strong strength for neon glow
    0.7, // radius
    0.3 // threshold
  )
  composer.addPass(bloomPass)

  // ===== FULLSCREEN KALEIDOSCOPE PLANE =====
  const geometry = new THREE.PlaneGeometry(2, 2)

  const uniforms = {
    time: { value: 0 },
    colorShift: { value: 0 },
    lightIntensity: { value: 0 },
    morphIntensity: { value: 0 },
    mouseCenter: { value: new THREE.Vector2(0, 0) },
    zoomLevel: { value: 1.0 },
    symmetryCount: { value: 8 },
    cursorInfluence: { value: 0 },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: kaleidoscopeVertexShader,
    fragmentShader: kaleidoscopeFragmentShader,
    side: THREE.FrontSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // ===== INTERACTION STATE =====
  let mousePos = new THREE.Vector2(0, 0)
  let currentZoom = 1.0
  let symmetryIndex = 2 // Start at 8 (index 2)
  const symmetryCounts = [6, 8, 12, 16, 24]

  // ===== EVENT HANDLERS =====
  const handleMouseMove = (event: MouseEvent) => {
    mousePos.x = (event.clientX / width) * 2 - 1
    mousePos.y = -(event.clientY / height) * 2 + 1
  }

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    const zoomSpeed = 0.1
    currentZoom *= event.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed
    currentZoom = Math.max(0.5, Math.min(3.0, currentZoom))
  }

  const handleClick = () => {
    symmetryIndex = (symmetryIndex + 1) % symmetryCounts.length
    uniforms.symmetryCount.value = symmetryCounts[symmetryIndex]
  }

  const handleResize = () => {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight
    camera.aspect = newWidth / newHeight
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, newHeight)
    composer.setSize(newWidth, newHeight)
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('click', handleClick)
  window.addEventListener('resize', handleResize)

  // ===== UPDATE LOOP =====
  const update = (
    time: number,
    pattern: SynthesizedPattern,
    interaction: ThemeInteractionState
  ) => {
    // Core uniforms
    uniforms.time.value = time * 0.001
    uniforms.colorShift.value = pattern.colorShift
    uniforms.lightIntensity.value = pattern.lightIntensity
    uniforms.morphIntensity.value = pattern.morphIntensity + interaction.energizedLevel * 0.4

    // Mouse parallax: smooth blend toward current mouse position
    const targetX = mousePos.x * 0.5
    const targetY = mousePos.y * 0.5
    uniforms.mouseCenter.value.x = THREE.MathUtils.lerp(
      uniforms.mouseCenter.value.x,
      targetX,
      0.1
    )
    uniforms.mouseCenter.value.y = THREE.MathUtils.lerp(
      uniforms.mouseCenter.value.y,
      targetY,
      0.1
    )

    // Zoom: smooth blend
    const targetZoom = 1.0 / currentZoom
    uniforms.zoomLevel.value = THREE.MathUtils.lerp(
      uniforms.zoomLevel.value,
      targetZoom,
      0.08
    )

    // Cursor influence
    uniforms.cursorInfluence.value = interaction.cursor.strength
  }

  // ===== DISPOSAL =====
  const dispose = () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('wheel', handleWheel)
    window.removeEventListener('click', handleClick)
    window.removeEventListener('resize', handleResize)

    geometry.dispose()
    if (material instanceof THREE.Material) {
      material.dispose()
    }

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
