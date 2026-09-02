/**
 * Vector Cloud Animation Composable
 * Handles text animations via GSAP
 * Decouples animation logic from component rendering
 */

import { ref, watch, onMounted } from 'vue'
import gsap from 'gsap'

export interface AnimationState {
  nameVisible: boolean
  roleVisible: boolean
  taglineVisible: boolean
  buttonsVisible: boolean
}

export function useVectorCloudAnimation() {
  const animationState = ref<AnimationState>({
    nameVisible: false,
    roleVisible: false,
    taglineVisible: false,
    buttonsVisible: false,
  })

  const animateIn = () => {
    const timeline = gsap.timeline()

    // Animate text elements in sequence
    const elements = [
      { selector: '[data-anim="name"]', state: 'nameVisible' },
      { selector: '[data-anim="role"]', state: 'roleVisible' },
      { selector: '[data-anim="tagline"]', state: 'taglineVisible' },
      { selector: '[data-anim="buttons"]', state: 'buttonsVisible' },
    ]

    elements.forEach(({ selector, state }, index) => {
      timeline.to(
        selector,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          onStart: () => {
            animationState.value[state as keyof AnimationState] = true
          },
        },
        index * 0.15 // Stagger animations
      )
    })

    return timeline
  }

  const animateOut = () => {
    const timeline = gsap.timeline()

    const elements = [
      { selector: '[data-anim="buttons"]', state: 'buttonsVisible' },
      { selector: '[data-anim="tagline"]', state: 'taglineVisible' },
      { selector: '[data-anim="role"]', state: 'roleVisible' },
      { selector: '[data-anim="name"]', state: 'nameVisible' },
    ]

    elements.forEach(({ selector, state }, index) => {
      timeline.to(
        selector,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.in',
          onComplete: () => {
            animationState.value[state as keyof AnimationState] = false
          },
        },
        index * 0.1
      )
    })

    return timeline
  }

  return {
    animationState,
    animateIn,
    animateOut,
  }
}
