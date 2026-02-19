/**
 * Theme Template Scaffolder
 * Generates boilerplate for new themes, ensuring best practices and type safety
 *
 * Usage:
 *   const template = createThemeTemplate('myTheme', {
 *     type: 'particle-based',
 *     description: 'My cool particle effect',
 *     colorScheme: 'complementary'
 *   })
 *   console.log(template.code)  // Copy-paste into new file
 */

import { ThemeFactory, ThemeSetupResult, ThemeInteractionState, ThemeConfig } from './themeTypes'
import * as THREE from 'three'
import { SynthesizedPattern } from '../synthesis'

export interface ThemeTemplateOptions {
  type: 'particle-based' | 'shader-based' | 'mesh-based' | 'hybrid'
  description: string
  colorScheme: 'complementary' | 'monochromatic' | 'triadic' | 'custom'
  performanceLevel: 'high' | 'medium' | 'low'
  withInteraction?: boolean
  withPostProcessing?: boolean
}

interface ThemeTemplate {
  filename: string
  code: string
  description: string
  registryEntry: string
}

/**
 * Generate a complete theme template with all necessary boilerplate
 */
export function createThemeTemplate(
  themeName: string,
  options: ThemeTemplateOptions
): ThemeTemplate {
  const className = pascalCase(themeName)
  const configName = `${className}_CONFIG`
  const paramsName = `${className}_PARAMS`
  const factoryName = `create${className}Theme`

  const description =
    options.description ||
    `${className} visualization theme - ${options.type.replace('-', ' ')}`

  let code = ''

  // Header
  code += `/**\n`
  code += ` * ${className.toUpperCase()} THEME\n`
  code += ` * ${description}\n`
  code += ` *\n`
  code += ` * Type: ${options.type}\n`
  code += ` * Performance: ${options.performanceLevel}\n`
  code += ` * Generated: ${new Date().toISOString()}\n`
  code += ` */\n\n`

  // Imports
  code += `import * as THREE from 'three'\n`
  code += `import { SynthesizedPattern } from '../synthesis'\n`
  code += `import { ThemeSetupResult, ThemeInteractionState, ThemeConfig } from './themeTypes'\n`

  if (options.withPostProcessing) {
    code += `import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'\n`
    code += `import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'\n`
    code += `import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'\n`
  }

  code += `\n`

  // Config
  code += `const ${configName}: ThemeConfig = {\n`
  code += `  name: '${className}',\n`
  code += `  description: '${description}',\n`
  code += `  colors: {\n`

  switch (options.colorScheme) {
    case 'complementary':
      code += `    primary: '#00d4ff',      // Cyan\n`
      code += `    secondary: '#ff006e',    // Hot pink\n`
      code += `    tertiary: '#ffbe0b',     // Yellow\n`
      break
    case 'monochromatic':
      code += `    primary: '#0066ff',      // Blue\n`
      code += `    secondary: '#004cbf',    // Darker blue\n`
      code += `    tertiary: '#00a3ff',     // Lighter blue\n`
      break
    case 'triadic':
      code += `    primary: '#ff0000',      // Red\n`
      code += `    secondary: '#00ff00',    // Green\n`
      code += `    tertiary: '#0000ff',     // Blue\n`
      break
    case 'custom':
    default:
      code += `    primary: '#ffffff',\n`
      code += `    secondary: '#cccccc',\n`
      code += `    tertiary: '#999999',\n`
  }

  code += `  },\n`
  code += `  performance: {\n`

  switch (options.performanceLevel) {
    case 'high':
      code += `    targetFps: 60,\n`
      code += `    particleCount: 5000,\n`
      break
    case 'medium':
      code += `    targetFps: 50,\n`
      code += `    particleCount: 2000,\n`
      break
    case 'low':
      code += `    targetFps: 30,\n`
      code += `    particleCount: 500,\n`
  }

  code += `  },\n`
  code += `}\n\n`

  // Parameters
  code += `// ===== TUNABLE PARAMETERS =====\n`
  code += `// Adjust these to tweak the look and feel\n`
  code += `const ${paramsName} = {\n`

  switch (options.type) {
    case 'particle-based':
      code += `  particleCount: 2000,\n`
      code += `  particleSize: 2.0,\n`
      code += `  maxVelocity: 20,\n`
      code += `  damping: 0.95,\n`
      code += `  interactionRadius: 80,\n`
      break
    case 'shader-based':
      code += `  scale: 1.0,\n`
      code += `  speed: 1.0,\n`
      code += `  detail: 3,\n`
      code += `  colorShift: 0.0,\n`
      break
    case 'mesh-based':
      code += `  geometryScale: 1.0,\n`
      code += `  rotationSpeed: 0.5,\n`
      code += `  subdivisions: 6,\n`
      break
    case 'hybrid':
      code += `  particleCount: 1000,\n`
      code += `  geometryCount: 10,\n`
      code += `  blendMode: 'mix',\n`
  }

  if (options.withPostProcessing) {
    code += `  bloomStrength: 1.0,\n`
    code += `  bloomRadius: 0.5,\n`
    code += `  bloomThreshold: 0.3,\n`
  }

  code += `}\n\n`

  // Factory function
  code += `export const ${factoryName}: ThemeFactory = (\n`
  code += `  canvas: HTMLCanvasElement,\n`
  code += `  config?: Partial<ThemeConfig>\n`
  code += `): ThemeSetupResult => {\n`
  code += `  // Scene setup\n`
  code += `  const scene = new THREE.Scene()\n`
  code += `  const camera = new THREE.PerspectiveCamera(\n`
  code += `    75,\n`
  code += `    canvas.clientWidth / canvas.clientHeight,\n`
  code += `    0.1,\n`
  code += `    1000\n`
  code += `  )\n`
  code += `  camera.position.z = 50\n`
  code += `\n`

  code += `  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })\n`
  code += `  renderer.setSize(canvas.clientWidth, canvas.clientHeight)\n`
  code += `  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))\n`
  code += `  renderer.setClearColor(0x000000)\n`
  code += `\n`

  if (options.withPostProcessing) {
    code += `  // Postprocessing\n`
    code += `  const composer = new EffectComposer(renderer)\n`
    code += `  const renderPass = new RenderPass(scene, camera)\n`
    code += `  composer.addPass(renderPass)\n`
    code += `\n`
    code += `  const bloomPass = new UnrealBloomPass(\n`
    code += `    new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),\n`
    code += `    ${paramsName}.bloomStrength,\n`
    code += `    ${paramsName}.bloomRadius,\n`
    code += `    ${paramsName}.bloomThreshold\n`
    code += `  )\n`
    code += `  composer.addPass(bloomPass)\n`
    code += `\n`
  }

  code += `  // TODO: Create your theme visuals here\n`
  code += `  // Add geometries, materials, particles to the scene\n`
  code += `\n`

  code += `  // Animation loop\n`
  code += `  const update = (\n`
  code += `    time: number,\n`
  code += `    pattern: SynthesizedPattern,\n`
  code += `    interaction: ThemeInteractionState\n`
  code += `  ) => {\n`
  code += `    // Update animation based on time and pattern\n`
  code += `    // Use pattern.energy, pattern.noise, pattern.phase for input\n`
  code += `    // Use interaction.cursor for cursor position\n`
  code += `\n`
  code += `    ${options.withPostProcessing ? 'composer.render()' : 'renderer.render(scene, camera)'}\n`
  code += `  }\n`
  code += `\n`

  code += `  // Cleanup\n`
  code += `  const dispose = () => {\n`
  code += `    scene.traverse((obj: any) => {\n`
  code += `      if (obj.geometry) obj.geometry.dispose()\n`
  code += `      if (obj.material) {\n`
  code += `        if (Array.isArray(obj.material)) {\n`
  code += `          obj.material.forEach((m: any) => m.dispose())\n`
  code += `        } else {\n`
  code += `          obj.material.dispose()\n`
  code += `        }\n`
  code += `      }\n`
  code += `    })\n`
  code += `    ${options.withPostProcessing ? 'composer.dispose()' : 'renderer.dispose()'}\n`
  code += `  }\n`
  code += `\n`

  code += `  return {\n`
  code += `    scene,\n`
  code += `    camera,\n`
  code += `    renderer,\n`
  code += `    ${options.withPostProcessing ? 'composer,' : ''}\n`
  code += `    update,\n`
  code += `    dispose,\n`
  code += `  }\n`
  code += `}\n`

  // Registry entry (for themeManager.ts)
  const registryEntry = `import { ${factoryName} } from './${themeName}'\n\n` +
    `// In THEME_REGISTRY:\n` +
    `'${themeName}': ${factoryName},\n`

  return {
    filename: `${themeName}.ts`,
    code,
    description,
    registryEntry,
  }
}

function pascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/**
 * Create a preset configuration template
 */
export function createPresetTemplate(
  themeName: string,
  presetName: string,
  params: Record<string, any>
): string {
  const code =
    `// Preset: ${presetName} for ${themeName}\n` +
    `export const ${presetName}_PRESET = {\n` +
    Object.entries(params)
      .map(([key, value]) => `  ${key}: ${JSON.stringify(value)},`)
      .join('\n') +
    `\n}\n`

  return code
}
