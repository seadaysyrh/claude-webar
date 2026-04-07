// 3D モデルの設定
export interface ModelConfig {
  id: string
  label: string
  description: string
  glbPath: string      // .glb ファイルパス
  scale: string        // A-Frame scale 属性 例: "0.1 0.1 0.1"
  position: string     // A-Frame position 属性
}

// AR 認識イベント
export interface AREvent {
  targetIndex: number
  timestamp: number
}

// AR ビューア状態
export interface ARState {
  isDetected: boolean
  detectedAt: Date | null
  currentTargetIndex: number | null
}
