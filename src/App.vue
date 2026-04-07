<!--
  App.vue — ルートコンポーネント

  【学習ポイント: ref / computed / コンポーネントの組み合わせ】
  このファイルがアプリの状態管理の起点。
  - selectedId: どのモデルを表示するか
  - isDetected: マーカーを認識中かどうか
  この 2 つの状態を子コンポーネントに props で渡し、
  子からの emit を受け取って更新する。
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import ARViewer from '@/components/ARViewer.vue'
import ModelSelector from '@/components/ModelSelector.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import type { ModelConfig } from '@/types/ar'

// GitHub Pages では /claude-webar/ がベース URL になるため
// import.meta.env.BASE_URL でビルド時の設定を取得してパスに付与する
const base = import.meta.env.BASE_URL

// モデル一覧の定義
// ここにモデルを追加するだけで、カード一覧と AR 表示の両方に反映される
const models: ModelConfig[] = [
  {
    id: 'duck',
    label: 'アヒル',
    description: 'シンプルな 3D アヒル',
    glbPath: `${base}models/duck.glb`,
    scale: '0.05 0.05 0.05',
    position: '0 0 0'
  },
  {
    id: 'robot',
    label: 'ロボット',
    description: 'アニメーション付きロボット',
    glbPath: `${base}models/robot.glb`,
    scale: '0.08 0.08 0.08',
    position: '0 0 0'
  },
  {
    id: 'astronaut',
    label: '宇宙飛行士',
    description: '宇宙飛行士フィギュア',
    glbPath: `${base}models/astronaut.glb`,
    scale: '0.06 0.06 0.06',
    position: '0 0 0'
  }
]

// --- リアクティブな状態 ---
// ref() で包むと値の変化を Vue が検知して画面を更新してくれる

// 現在選択中のモデル id（初期値は最初のモデル）
const selectedId = ref<string>(models[0].id)

// マーカー認識中かどうか
const isDetected = ref<boolean>(false)

// computed: selectedId が変わると自動で再計算される派生値
// selectedId に対応する ModelConfig オブジェクトを返す
const selectedModel = computed<ModelConfig>(
  () => models.find(m => m.id === selectedId.value) ?? models[0]
)

// --- イベントハンドラー ---

// ModelSelector から 'select' イベントを受け取ったとき
function handleSelect(model: ModelConfig) {
  selectedId.value = model.id
}

// ARViewer から 'detected' イベントを受け取ったとき
function handleDetected() {
  isDetected.value = true
}

// ARViewer から 'lost' イベントを受け取ったとき
function handleLost() {
  isDetected.value = false
}
</script>

<template>
  <div class="app-container">
    <!--
      ARViewer: 全画面の AR カメラビュー
      - :models="models"        → 全モデルを渡してプリロード
      - :selected-id="selectedId" → 表示するモデルを伝える
      - @detected / @lost       → 認識状態の変化を受け取る
    -->
    <ARViewer
      :models="models"
      :selected-id="selectedId"
      @detected="handleDetected"
      @lost="handleLost"
    />

    <!-- UI オーバーレイ: AR ビューアの上に重ねて表示する -->
    <div class="overlay">
      <!-- 上部: 認識状態バッジ -->
      <header class="top-bar">
        <!-- :is-detected で StatusBadge に状態を渡す -->
        <StatusBadge :is-detected="isDetected" />

        <!--
          v-if: isDetected が true のときだけ表示する
          selectedModel.label は computed で自動更新される
        -->
        <p v-if="isDetected" class="detected-info">
          {{ selectedModel.label }} を表示中
        </p>
      </header>

      <!-- 下部: モデル選択パネル -->
      <footer class="bottom-bar">
        <!--
          @select="handleSelect" で子からの emit を受け取り
          selectedId を更新する → ARViewer の表示が切り替わる
        -->
        <ModelSelector
          :models="models"
          :selected-id="selectedId"
          @select="handleSelect"
        />
      </footer>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  width: 100vw;
  height: 100dvh; /* dvh = dynamic viewport height（モバイル対応） */
  overflow: hidden;
}

/* AR ビューアの上に UI を重ねるための絶対配置 */
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none; /* AR 操作を邪魔しないようにクリックを透過 */
  z-index: 10;
}

.top-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  pointer-events: none;
}

.detected-info {
  font-family: sans-serif;
  font-size: 13px;
  color: #e5e7eb;
  background: rgba(0, 0, 0, 0.45);
  padding: 4px 10px;
  border-radius: 8px;
}

/* モデル選択パネルはクリックを受け付ける必要があるので none を解除 */
.bottom-bar {
  pointer-events: all;
}
</style>
