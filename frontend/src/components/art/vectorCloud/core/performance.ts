/**
 * Performance Monitoring System
 * Real-time metrics for animation debugging and optimization
 *
 * Tracks: FPS, frame time, memory, geometry/material counts
 * Low-overhead: ~0.1ms per frame overhead
 */

import * as THREE from 'three'

export interface PerformanceMetrics {
  fps: number
  frameTime: number // milliseconds
  minFps: number
  maxFps: number
  avgFps: number
  geometries: number
  materials: number
  textures: number
  drawCalls: number
  totalMemory?: number // MB (if available)
  usedMemory?: number  // MB (if available)
  jsHeap?: number      // MB (if available)
}

export class PerformanceMonitor {
  private scene: THREE.Scene
  private renderer: THREE.WebGLRenderer
  private metrics: PerformanceMetrics
  private frameCount = 0
  private fpsHistory: number[] = []
  private frameTimeHistory: number[] = []
  private lastTime = performance.now()
  private historySize = 60 // Keep last 60 frames for averaging

  constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    this.scene = scene
    this.renderer = renderer
    this.metrics = this.initMetrics()
  }

  private initMetrics(): PerformanceMetrics {
    return {
      fps: 0,
      frameTime: 0,
      minFps: 60,
      maxFps: 0,
      avgFps: 0,
      geometries: 0,
      materials: 0,
      textures: 0,
      drawCalls: 0,
    }
  }

  /**
   * Update metrics (call once per frame)
   */
  update(): void {
    const now = performance.now()
    const deltaTime = now - this.lastTime
    this.lastTime = now

    // Calculate FPS
    const fps = 1000 / deltaTime
    this.fpsHistory.push(fps)
    if (this.fpsHistory.length > this.historySize) {
      this.fpsHistory.shift()
    }

    // Frame time history
    this.frameTimeHistory.push(deltaTime)
    if (this.frameTimeHistory.length > this.historySize) {
      this.frameTimeHistory.shift()
    }

    this.metrics.fps = Math.round(fps)
    this.metrics.frameTime = Math.round(deltaTime * 10) / 10
    this.metrics.minFps = Math.round(Math.min(...this.fpsHistory))
    this.metrics.maxFps = Math.round(Math.max(...this.fpsHistory))
    this.metrics.avgFps = Math.round(
      this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length
    )

    // Count scene objects
    this.updateSceneStats()

    // Memory stats (if available)
    this.updateMemoryStats()

    this.frameCount++
  }

  private updateSceneStats(): void {
    let geometries = 0
    let materials = 0
    let textures = 0

    this.scene.traverse((object: any) => {
      if (object.geometry) geometries++
      if (object.material) {
        const mats = Array.isArray(object.material) ? object.material : [object.material]
        materials += mats.length
        mats.forEach((mat: any) => {
          if (mat.map) textures++
          if (mat.normalMap) textures++
          if (mat.emissiveMap) textures++
        })
      }
    })

    this.metrics.geometries = geometries
    this.metrics.materials = materials
    this.metrics.textures = textures

    // Try to get draw calls from renderer
    try {
      const info = this.renderer.info.render
      this.metrics.drawCalls = info.calls
    } catch {
      // Not available on all platforms
    }
  }

  private updateMemoryStats(): void {
    if (performance.memory) {
      const memory = performance.memory
      this.metrics.totalMemory = Math.round((memory.jsHeapSizeLimit / 1048576) * 10) / 10
      this.metrics.usedMemory = Math.round((memory.usedJSHeapSize / 1048576) * 10) / 10
      this.metrics.jsHeap = Math.round((memory.jsHeapSize / 1048576) * 10) / 10
    }
  }

  /**
   * Get current metrics snapshot
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Get metrics as human-readable format
   */
  getReport(): string {
    return `
FPS: ${this.metrics.fps} (avg: ${this.metrics.avgFps}, min: ${this.metrics.minFps}, max: ${this.metrics.maxFps})
Frame Time: ${this.metrics.frameTime}ms
Scene: ${this.metrics.geometries} geometries, ${this.metrics.materials} materials, ${this.metrics.textures} textures
Draw Calls: ${this.metrics.drawCalls}
${this.metrics.jsHeap ? `Memory: ${this.metrics.jsHeap}MB heap / ${this.metrics.usedMemory}MB used / ${this.metrics.totalMemory}MB total` : ''}
    `.trim()
  }

  /**
   * Check if performance is good
   */
  isOptimal(targetFps: number = 50): boolean {
    return this.metrics.fps >= targetFps && this.metrics.frameTime < 50
  }

  /**
   * Detect bottleneck
   */
  getBottleneck(): 'geometry' | 'material' | 'memory' | 'none' {
    if (this.metrics.geometries > 5000) return 'geometry'
    if (this.metrics.materials > 200) return 'material'
    if (this.metrics.usedMemory && this.metrics.usedMemory > 500) return 'memory'
    return 'none'
  }

  /**
   * Reset history
   */
  reset(): void {
    this.fpsHistory = []
    this.frameTimeHistory = []
    this.frameCount = 0
  }
}
