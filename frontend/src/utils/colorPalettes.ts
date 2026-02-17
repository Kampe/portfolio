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
    name: 'Cyberpunk Neon',
    primary: '#FF006E', // Hot pink
    primaryHSL: '327 100% 50%',
    secondary: '#00FFFF', // Bright cyan
    secondaryHSL: '180 100% 50%',
    accent: '#0099FF', // Electric blue
    accentHSL: '204 100% 50%',
    orb1: '#FF006E',
    orb2: '#00FFFF',
    orb3: '#0099FF',
  },
  {
    name: 'Electric Summer',
    primary: '#FF9500', // Bright orange
    primaryHSL: '35 100% 50%',
    secondary: '#00FFFF', // Cyan
    secondaryHSL: '180 100% 50%',
    accent: '#FFFF00', // Bright yellow
    accentHSL: '60 100% 50%',
    orb1: '#FF9500',
    orb2: '#00FFFF',
    orb3: '#FFFF00',
  },
  {
    name: 'Neon Dreams',
    primary: '#FF00FF', // Bright magenta
    primaryHSL: '300 100% 50%',
    secondary: '#00D9FF', // Bright cyan
    secondaryHSL: '186 100% 50%',
    accent: '#39FF14', // Neon lime
    accentHSL: '95 100% 50%',
    orb1: '#FF00FF',
    orb2: '#00D9FF',
    orb3: '#39FF14',
  },
  {
    name: 'Sunset Paradise',
    primary: '#FF6B35', // Bright orange
    primaryHSL: '17 100% 55%',
    secondary: '#FF006E', // Hot pink
    secondaryHSL: '327 100% 50%',
    accent: '#FFDD00', // Golden yellow
    accentHSL: '55 100% 50%',
    orb1: '#FF6B35',
    orb2: '#FF006E',
    orb3: '#FFDD00',
  },
  {
    name: 'Tropical Vibes',
    primary: '#39FF14', // Neon lime
    primaryHSL: '95 100% 50%',
    secondary: '#FF1493', // Hot pink
    secondaryHSL: '327 100% 50%',
    accent: '#00FFFF', // Bright cyan
    accentHSL: '180 100% 50%',
    orb1: '#39FF14',
    orb2: '#FF1493',
    orb3: '#00FFFF',
  },
  {
    name: 'Ocean Neon',
    primary: '#00FFFF', // Bright cyan
    primaryHSL: '180 100% 50%',
    secondary: '#FF0080', // Hot magenta
    secondaryHSL: '325 100% 50%',
    accent: '#0080FF', // Electric blue
    accentHSL: '210 100% 50%',
    orb1: '#00FFFF',
    orb2: '#FF0080',
    orb3: '#0080FF',
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
