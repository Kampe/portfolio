/**
 * Debug utilities for the vector cloud hero
 * Provides lightweight instrumentation for development
 */

export interface DebugState {
  fps: number
  particleCount: number
  time: number
  energizedLevel: number
}

/**
 * Create a simple debug HUD (pure DOM, no heavy libs)
 * Shows FPS, particle count, time, and state
 */
export const createDebugHUD = (): HTMLDivElement => {
  const hud = document.createElement('div')
  hud.className = 'fixed bottom-4 right-4 bg-black/80 border border-cyan-500/50 rounded p-3 text-xs text-cyan-400 font-mono space-y-1 pointer-events-auto z-50'
  hud.style.fontFamily = 'monospace'
  hud.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
  hud.style.border = '1px solid rgba(0, 212, 255, 0.5)'
  hud.style.borderRadius = '0.5rem'
  hud.style.padding = '0.75rem'
  hud.style.color = 'rgba(0, 212, 255, 1)'
  hud.style.fontSize = '12px'
  hud.style.lineHeight = '1.5'
  hud.style.pointerEvents = 'auto'
  hud.style.zIndex = '50'
  hud.style.position = 'fixed'
  hud.style.bottom = '1rem'
  hud.style.right = '1rem'

  return hud
}

/**
 * Update debug HUD with current state
 */
export const updateDebugHUD = (hud: HTMLDivElement, state: DebugState) => {
  hud.innerHTML = `
    <div>FPS: ${state.fps}</div>
    <div>Particles: ${state.particleCount}</div>
    <div>Time: ${(state.time * 0.001).toFixed(1)}s</div>
    <div>Energized: ${state.energizedLevel.toFixed(2)}</div>
  `
}
