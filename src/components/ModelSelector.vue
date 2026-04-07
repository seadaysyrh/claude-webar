<script setup lang="ts">
import type { ModelConfig } from '@/types/ar'

const props = defineProps<{
  models: ModelConfig[]
  selectedId: string
}>()

const emit = defineEmits<{
  select: [model: ModelConfig]
}>()

function handleSelect(model: ModelConfig) {
  emit('select', model)
}
</script>

<template>
  <div class="model-selector">
    <p class="selector-title">モデルを選択</p>
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
  overflow-x: auto;
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
