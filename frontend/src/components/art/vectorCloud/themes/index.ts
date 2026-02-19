/**
 * Themes Module - Psychedelic Music Visualizer Themes
 * Export all themes, managers, and utilities
 */

export { ThemeManager, getThemeFromURL, registerTheme, type ThemeName } from './themeManager'
export { LazyThemeManager, lazyThemeRegistry, type LazyThemeFactory } from './themeManagerLazy'
export { createSpectrumAnalyzerTheme } from './spectrumAnalyzer'
export { createKaleidoscopeFractalsTheme } from './kaleidoscopeFractals'
export { createDMTMorphingTheme } from './dmtMorphing'
export { createMilkdropMorphingTheme } from './milkdropMorphing'
export { createDMTGeometryTheme } from './dmtGeometry'
export { createVectorFieldFloorTheme } from './vectorFieldFloor'
export { createChargedMagnetosphereTheme } from './chargedMagnetosphere'
export {
  type ThemeSetupResult,
  type ThemeInteractionState,
  type CursorState,
  type ThemeConfig,
  type ThemeFactory,
  type PostProcessingComposer,
} from './themeTypes'
export {
  calculateCursorForce,
  CursorTrail,
  CursorVectorField,
  type CursorPhysicsConfig,
} from './cursorInteraction'
