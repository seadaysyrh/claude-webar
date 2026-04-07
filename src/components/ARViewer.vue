<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { ModelConfig } from '@/types/ar'
import { useAR } from '@/composables/useAR'

const props = defineProps<{
  models: ModelConfig[]   // 全モデルを受け取り一括プリロード
  selectedId: string      // 表示するモデルの id
}>()

const emit = defineEmits<{
  detected: []
  lost: []
}>()

const { state, init, destroy } = useAR()
const sceneRef = ref<Element | null>(null)

const base = import.meta.env.BASE_URL
const targetSrc = `${base}targets/targets.mind`

watch(() => state.value.isDetected, (detected) => {
  if (detected) {
    emit('detected')
  } else {
    emit('lost')
  }
})

onMounted(() => {
  const scene = sceneRef.value
  if (scene) {
    init(scene)
  }
})

onUnmounted(() => {
  destroy()
})
</script>

<template>
  <a-scene
    ref="sceneRef"
    :mindar-image="`imageTargetSrc: ${targetSrc}; autoStart: true; uiLoading: yes; uiError: yes; uiScanning: yes; filterMinCF: 0.1; maxTrack: 1`"
    embedded
    color-space="sRGB"
    renderer="colorManagement: true"
    vr-mode-ui="enabled: false"
    device-orientation-permission-ui="enabled: false"
    style="width: 100%; height: 100%;"
  >
    <!-- 全モデルを事前にプリロード -->
    <a-assets>
      <a-asset-item
        v-for="m in models"
        :key="m.id"
        :id="`model-${m.id}`"
        :src="m.glbPath"
      />
    </a-assets>

    <a-camera position="0 0 0" look-controls="enabled: false" />

    <a-entity mindar-image-target="targetIndex: 0">
      <!-- 選択中のモデルのみ表示、他は visible="false" で非表示 -->
      <a-gltf-model
        v-for="m in models"
        :key="m.id"
        :src="`#model-${m.id}`"
        :position="m.position"
        :scale="m.scale"
        animation-mixer="loop: repeat"
        :visible="m.id === selectedId"
      />
    </a-entity>
  </a-scene>
</template>
