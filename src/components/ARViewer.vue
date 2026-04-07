<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { ModelConfig } from '@/types/ar'
import { useAR } from '@/composables/useAR'

// A-Frame / MindAR はグローバルスクリプト(CDN)として読み込み済みのため
// カスタム要素を Vue のテンプレートコンパイラに知らせる設定が vite.config で必要
const props = defineProps<{
  model: ModelConfig
}>()

const emit = defineEmits<{
  detected: []
  lost: []
}>()

const { state, init, destroy } = useAR()
const sceneRef = ref<Element | null>(null)

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
  <!--
    MindAR は a-scene の mindar-image 属性で設定します。
    imageTargetSrc: MindAR Compiler で生成した .mind ファイルのパス
    public/targets/targets.mind に配置してください。
  -->
  <a-scene
    ref="sceneRef"
    mindar-image="imageTargetSrc: /targets/targets.mind; autoStart: true; uiLoading: yes; uiError: yes; uiScanning: yes; filterMinCF: 0.1; maxTrack: 1"
    embedded
    color-space="sRGB"
    renderer="colorManagement: true"
    vr-mode-ui="enabled: false"
    device-orientation-permission-ui="enabled: false"
    style="width: 100%; height: 100%;"
  >
    <a-assets>
      <a-asset-item :id="`model-${model.id}`" :src="model.glbPath" />
    </a-assets>

    <a-camera position="0 0 0" look-controls="enabled: false" />

    <!-- マーカー index 0 にモデルをアタッチ -->
    <a-entity mindar-image-target="targetIndex: 0">
      <a-gltf-model
        :src="`#model-${model.id}`"
        :position="model.position"
        :scale="model.scale"
        animation-mixer="loop: repeat"
      />
    </a-entity>
  </a-scene>
</template>
