/**
 * Vector Cloud Interaction Composable
 * Handles all mouse, keyboard, and scroll interactions for the visualization
 * Decouples interaction logic from component rendering
 */

import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

export interface InteractionState {
  mousePos: THREE.Vector3
  energizedLevel: number
  clickPulse: number
}

export function useVectorCloudInteraction(canvasRef: HTMLCanvasElement) {
  const interaction = ref<InteractionState>({
    mousePos: new THREE.Vector3(0, 0, 50),
    energizedLevel: 0,
    clickPulse: 0,
  })

  // Helper to convert screen coordinates to scene coordinates
  const screenToSceneCoordinates = (screenX: number, screenY: number, camera: THREE.PerspectiveCamera): THREE.Vector3 => {
    if (!canvasRef) return new THREE.Vector3(0, 0, 50)

    // Normalize to NDC [-1, 1]
    const ndc = new THREE.Vector3(
      (screenX / canvasRef.clientWidth) * 2 - 1,
      -(screenY / canvasRef.clientHeight) * 2 + 1,
      0
    )

    // Project to a plane 50 units in front of camera
    const vFOV = (camera.fov * Math.PI) / 180 // vertical FOV in radians
    const height = 2 * Math.tan(vFOV / 2) * 50 // height at focal distance 50
    const width = height * camera.aspect

    return new THREE.Vector3((ndc.x * width) / 2, (ndc.y * height) / 2, 50)
  }

  const handleMouseMove = (e: MouseEvent, camera: THREE.PerspectiveCamera) => {
    if (!canvasRef) return
    const rect = canvasRef.getBoundingClientRect()
    const screenX = e.clientX - rect.left
    const screenY = e.clientY - rect.top
    interaction.value.mousePos.copy(screenToSceneCoordinates(screenX, screenY, camera))
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    interaction.value.energizedLevel = Math.min(1, interaction.value.energizedLevel + 0.1)
  }

  const handleClick = () => {
    interaction.value.clickPulse = 1
  }

  const setupEventListeners = (camera: THREE.PerspectiveCamera) => {
    const moveHandler = (e: MouseEvent) => handleMouseMove(e, camera)
    const wheelHandler = (e: WheelEvent) => handleWheel(e)
    const clickHandler = () => handleClick()

    canvasRef.addEventListener('mousemove', moveHandler)
    canvasRef.addEventListener('wheel', wheelHandler, { passive: false })
    canvasRef.addEventListener('click', clickHandler)

    return () => {
      canvasRef.removeEventListener('mousemove', moveHandler)
      canvasRef.removeEventListener('wheel', wheelHandler)
      canvasRef.removeEventListener('click', clickHandler)
    }
  }

  const updateInteraction = (deltaTime: number) => {
    // Decay energized level over time
    interaction.value.energizedLevel *= 0.95

    // Decay click pulse over ~200ms
    if (interaction.value.clickPulse > 0) {
      interaction.value.clickPulse = Math.max(0, interaction.value.clickPulse - deltaTime * 5)
    }
  }

  return {
    interaction,
    setupEventListeners,
    updateInteraction,
  }
}
