import { ref, readonly } from 'vue'
import type { ARState, AREvent } from '@/types/ar'

export function useAR() {
  const state = ref<ARState>({
    isDetected: false,
    detectedAt: null,
    currentTargetIndex: null
  })

  // MindAR の a-scene 要素への参照
  let sceneEl: Element | null = null

  function onTargetFound(event: Event) {
    const detail = (event as CustomEvent<{ targetIndex: number }>).detail
    const arEvent: AREvent = {
      targetIndex: detail?.targetIndex ?? 0,
      timestamp: Date.now()
    }
    state.value.isDetected = true
    state.value.detectedAt = new Date()
    state.value.currentTargetIndex = arEvent.targetIndex
  }

  function onTargetLost() {
    state.value.isDetected = false
    state.value.currentTargetIndex = null
  }

  function init(scene: Element) {
    sceneEl = scene
    sceneEl.addEventListener('targetFound', onTargetFound)
    sceneEl.addEventListener('targetLost', onTargetLost)
  }

  function destroy() {
    if (sceneEl) {
      sceneEl.removeEventListener('targetFound', onTargetFound)
      sceneEl.removeEventListener('targetLost', onTargetLost)
      sceneEl = null
    }
    state.value = {
      isDetected: false,
      detectedAt: null,
      currentTargetIndex: null
    }
  }

  return {
    state: readonly(state),
    init,
    destroy
  }
}
