<!--
  ModelSelector — 表示する 3D モデルを選ぶカード一覧コンポーネント

  【学習ポイント: emit でコンポーネント間通信】
  子コンポーネントが親に「何かが起きた」を伝えるには emit を使う。
  props は親 → 子への一方通行。
  emit  は子 → 親への通知。
  この組み合わせが Vue のコンポーネント通信の基本パターン。
-->
<script setup lang="ts">
import type { ModelConfig } from '@/types/ar'

// props: 親から受け取るデータ
const props = defineProps<{
  models: ModelConfig[]  // 表示するモデルの一覧
  selectedId: string     // 現在選択中のモデル id
}>()

// emit: 子が親へ通知するイベントの定義
// 'select' イベントを発火でき、引数の型は ModelConfig
const emit = defineEmits<{
  select: [model: ModelConfig]
}>()

// カードをクリックしたとき親に通知する
function handleSelect(model: ModelConfig) {
  // emit('イベント名', 引数) で親コンポーネントに伝える
  emit('select', model)
}
</script>

<template>
  <div class="model-selector">
    <p class="selector-title">モデルを選択</p>

    <!--
      v-for でモデル一覧を繰り返し描画する
      :key は Vue が各要素を追跡するための一意な識別子（必須）
    -->
    <div class="card-list">
      <button
        v-for="model in models"
        :key="model.id"
        class="model-card"
        :class="{ active: model.id === selectedId }"
        @click="handleSelect(model)"
      >
        <span class="model-label">{{ model.label }}</span>
        <span class="model-desc">{{ model.description }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.model-selector {
  padding: 12px 16px 20px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.selector-title {
  font-family: sans-serif;
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}

.card-list {
  display: flex;
  gap: 10px;
  overflow-x: auto; /* 横スクロール可能にする */
  scrollbar-width: none;
  padding-bottom: 4px;
}

.card-list::-webkit-scrollbar {
  display: none;
}

.model-card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 10px 14px;
  min-width: 130px;
  border-radius: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.07);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  text-align: left;
}

/* selectedId と一致するカードに active クラスが付く */
.model-card.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.25);
}

.model-label {
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #f9fafb;
}

.model-desc {
  font-family: sans-serif;
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.4;
}
</style>
