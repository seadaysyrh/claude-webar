// ============================================================
// useAR — AR ロジックをまとめた Composable
//
// Composable とは「use〇〇」という名前の関数で、
// リアクティブな状態とロジックをコンポーネントから切り離して
// 再利用できるようにしたもの（React の Custom Hook に近い考え方）。
//
// このファイルでやること:
//   1. MindAR のイベントをリッスンして状態を更新する
//   2. イベントの登録 (init) と解除 (destroy) を管理する
// ============================================================

import { ref, readonly } from 'vue'
import type { ARState, AREvent } from '@/types/ar'

export function useAR() {
  // --- リアクティブな状態 ---
  // ref() で包むと、値が変わったとき Vue が自動で画面を再描画する
  const state = ref<ARState>({
    isDetected: false,
    detectedAt: null,
    currentTargetIndex: null
  })

  // a-scene 要素への参照（イベントリスナーの登録・解除に使う）
  // Vue の ref とは別物で、ただの変数
  let sceneEl: Element | null = null

  // ----------------------------------------------------------
  // マーカーが見つかったときに MindAR が発火するイベントのハンドラー
  // event は CustomEvent なので detail にデータが入っている
  // ----------------------------------------------------------
  function onTargetFound(event: Event) {
    // CustomEvent にキャストして targetIndex を取り出す
    const detail = (event as CustomEvent<{ targetIndex: number }>).detail
    const arEvent: AREvent = {
      targetIndex: detail?.targetIndex ?? 0, // 値がなければ 0 をデフォルトに
      timestamp: Date.now()
    }
    // state を更新すると、これを参照しているコンポーネントが自動で再描画される
    state.value.isDetected = true
    state.value.detectedAt = new Date()
    state.value.currentTargetIndex = arEvent.targetIndex
  }

  // マーカーが見失われたときのハンドラー
  function onTargetLost() {
    state.value.isDetected = false
    state.value.currentTargetIndex = null
  }

  // ----------------------------------------------------------
  // init — コンポーネントの onMounted から呼ぶ
  // a-scene 要素を受け取ってイベントリスナーを登録する
  // ----------------------------------------------------------
  function init(scene: Element) {
    sceneEl = scene
    // MindAR は a-scene 上でカスタムイベントを発火する
    sceneEl.addEventListener('targetFound', onTargetFound)
    sceneEl.addEventListener('targetLost', onTargetLost)
  }

  // ----------------------------------------------------------
  // destroy — コンポーネントの onUnmounted から呼ぶ
  // リスナーを解除してメモリリークを防ぐ
  // ----------------------------------------------------------
  function destroy() {
    if (sceneEl) {
      sceneEl.removeEventListener('targetFound', onTargetFound)
      sceneEl.removeEventListener('targetLost', onTargetLost)
      sceneEl = null
    }
    // 状態もリセット
    state.value = {
      isDetected: false,
      detectedAt: null,
      currentTargetIndex: null
    }
  }

  // readonly() で外から state を直接書き換えられないようにする
  // 状態の変更は必ずこのファイル内の関数を通す（単方向データフロー）
  return {
    state: readonly(state),
    init,
    destroy
  }
}
