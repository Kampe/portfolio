/**
 * Dynamic color palette system for portfolio
 * Provides complementary color sets that randomize on page load
 */

export interface ColorPalette {
  name: string
  primary: string // hex color for primary accents (e.g., border 1)
  primaryHSL: string // HSL format for CSS variables
  secondary: string // hex color for secondary accents (e.g., border 2)
  secondaryHSL: string // HSL format for CSS variables
  accent: string // hex for hover/emphasis
  accentHSL: string // HSL format
  orb1: string // Three.js orb colors
  orb2: string
  orb3: string
}

export const palettes: ColorPalette[] = [
  {
    name: 'Cyberpunk',
    primary: '#00FFFF', // Cyan
    primaryHSL: '180 100% 50%',
    secondary: '#FF00FF', // Magenta
    secondaryHSL: '300 100% 50%',
    accent: '#0099FF',
    accentHSL: '204 100% 50%',
    orb1: '#00FFFF',
    orb2: '#FF00FF',
    orb3: '#00FF88',
  },
  {
    name: 'Deep Ocean',
    primary: '#00D9FF', // Bright Teal
    primaryHSL: '186 100% 50%',
    secondary: '#FF1493', // Deep Pink
    secondaryHSL: '327 100% 50%',
    accent: '#00CED1',
    accentHSL: '180 100% 50%',
    orb1: '#00D9FF',
    orb2: '#00FF88',
    orb3: '#FF1493',
  },
  {
    name: 'Sunset',
    primary: '#FF6B35', // Orange
    primaryHSL: '17 100% 55%',
    secondary: '#9D4EDD', // Purple
    secondaryHSL: '280 100% 55%',
    accent: '#FFD60A',
    accentHSL: '45 100% 50%',
    orb1: '#FF6B35',
    orb2: '#9D4EDD',
    orb3: '#FFD60A',
  },
  {
    name: 'Slate & Steel',
    primary: '#4A90E2', // Refined electric blue
    primaryHSL: '218 81% 55%',
    secondary: '#E8E8E8', // Light gray/silver
    secondaryHSL: '0 0% 91%',
    accent: '#00D9FF',
    accentHSL: '186 100% 50%',
    orb1: '#4A90E2',
    orb2: '#E8E8E8',
    orb3: '#00D9FF',
  },
  {
    name: 'Indigo Pro',
    primary: '#6366F1', // Deep indigo
    primaryHSL: '242 94% 57%',
    secondary: '#A78BFA', // Soft lavender
    secondaryHSL: '263 94% 74%',
    accent: '#60A5FA',
    accentHSL: '217 97% 70%',
    orb1: '#6366F1',
    orb2: '#A78BFA',
    orb3: '#60A5FA',
  },
  {
    name: 'Monochrome Dark',
    primary: '#FFFFFF', // Pure white
    primaryHSL: '0 0% 100%',
    secondary: '#94A3B8', // Slate gray
    secondaryHSL: '221 16% 65%',
    accent: '#06B6D4',
    accentHSL: '190 94% 43%',
    orb1: '#FFFFFF',
    orb2: '#94A3B8',
    orb3: '#06B6D4',
  },
]

export function getRandomPalette(): ColorPalette {
  return palettes[Math.floor(Math.random() * palettes.length)]
}

export function applyPaletteToDOM(palette: ColorPalette): void {
  const root = document.documentElement
  root.style.setProperty('--color-primary', palette.primary)
  root.style.setProperty('--color-primary-hsl', palette.primaryHSL)
  root.style.setProperty('--color-secondary', palette.secondary)
  root.style.setProperty('--color-secondary-hsl', palette.secondaryHSL)
  root.style.setProperty('--color-accent', palette.accent)
  root.style.setProperty('--color-accent-hsl', palette.accentHSL)
}

export function getPaletteOrbColors(palette: ColorPalette): { color1: number; color2: number; color3: number } {
  return {
    color1: parseInt(palette.orb1.slice(1), 16),
    color2: parseInt(palette.orb2.slice(1), 16),
    color3: parseInt(palette.orb3.slice(1), 16),
  }
}
