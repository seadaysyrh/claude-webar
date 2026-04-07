// ============================================================
// AR アプリ共通の型定義
//
// TypeScript の interface は「この形のオブジェクトを使う」という
// 約束書きのようなもの。型を定義しておくと、間違った値を渡した
// ときにエディタがその場でエラーを教えてくれる。
// ============================================================

// 3D モデル 1 件分の設定
// App.vue の models 配列の各要素がこの型を持つ
export interface ModelConfig {
  id: string          // モデルを一意に識別するキー（例: 'duck'）
  label: string       // UI に表示する名前（例: 'アヒル'）
  description: string // カード内の説明文
  glbPath: string     // GLB ファイルの URL パス
  scale: string       // A-Frame の scale 属性（例: "0.05 0.05 0.05"）
  position: string    // A-Frame の position 属性（例: "0 0 0"）
}

// MindAR がマーカーを検出・消失したときのイベントデータ
// useAR.ts の onTargetFound で CustomEvent から取り出して使う
export interface AREvent {
  targetIndex: number // 検出されたマーカーのインデックス（0 始まり）
  timestamp: number   // 検出時刻（Date.now() の値）
}

// AR ビューア全体の状態をまとめた型
// useAR.ts の state ref がこの型を持つ
export interface ARState {
  isDetected: boolean            // マーカーを現在認識中かどうか
  detectedAt: Date | null        // 最後に認識した日時（未検出時は null）
  currentTargetIndex: number | null // 認識中のマーカーインデックス
}
