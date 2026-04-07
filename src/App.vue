<script setup lang="ts">
import { ref, computed } from 'vue'
import ARViewer from '@/components/ARViewer.vue'
import ModelSelector from '@/components/ModelSelector.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import type { ModelConfig } from '@/types/ar'

// 利用可能なモデル一覧
// glbPath は public/models/ 以下にファイルを配置してください
const base = import.meta.env.BASE_URL

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

const selectedId = ref<string>(models[0].id)
const isDetected = ref<boolean>(false)

const selectedModel = computed<ModelConfig>(
  () => models.find(m => m.id === selectedId.value) ?? models[0]
)

function handleSelect(model: ModelConfig) {
  selectedId.value = model.id
}

function handleDetected() {
  isDetected.value = true
}

function handleLost() {
  isDetected.value = false
}
</script>

<template>
  <div class="app-container">
    <!-- AR ビューア（全画面背景） -->
    <ARViewer
      :models="models"
      :selected-id="selectedId"
      @detected="handleDetected"
      @lost="handleLost"
    />

    <!-- UI オーバーレイ -->
    <div class="overlay">
      <!-- 上部: 認識状態バッジ -->
      <header class="top-bar">
        <StatusBadge :is-detected="isDetected" />
        <p v-if="isDetected" class="detected-info">
          {{ selectedModel.label }} を表示中
        </p>
      </header>

      <!-- 下部: モデル選択パネル -->
      <footer class="bottom-bar">
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
  height: 100dvh;
  overflow: hidden;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
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

.bottom-bar {
  pointer-events: all;
}
</style>
