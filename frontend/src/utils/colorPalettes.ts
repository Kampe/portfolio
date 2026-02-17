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
    name: 'Neon Lime',
    primary: '#39FF14', // Neon Green
    primaryHSL: '99 100% 55%',
    secondary: '#7C3AED', // Violet
    secondaryHSL: '261 100% 50%',
    accent: '#06FFA5',
    accentHSL: '152 100% 51%',
    orb1: '#39FF14',
    orb2: '#7C3AED',
    orb3: '#06FFA5',
  },
  {
    name: 'Rose Gold',
    primary: '#FF69B4', // Hot Pink
    primaryHSL: '330 100% 71%',
    secondary: '#FFD700', // Gold
    secondaryHSL: '51 100% 50%',
    accent: '#FF1493',
    accentHSL: '327 100% 50%',
    orb1: '#FF69B4',
    orb2: '#FFD700',
    orb3: '#FF1493',
  },
  {
    name: 'Vaporwave',
    primary: '#FF10F0', // Hot Magenta
    primaryHSL: '302 100% 50%',
    secondary: '#00F0FF', // Cyan
    secondaryHSL: '187 100% 50%',
    accent: '#B537F2',
    accentHSL: '283 100% 56%',
    orb1: '#FF10F0',
    orb2: '#00F0FF',
    orb3: '#B537F2',
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
