<!--
  ARViewer — MindAR + A-Frame を統合する AR ビューアコンポーネント

  【学習ポイント: onMounted / onUnmounted と外部ライブラリの統合】
  Vue のライフサイクルフックを使って、DOM が準備できてから
  MindAR のイベントリスナーを登録し、コンポーネント破棄時に解除する。

  A-Frame と MindAR は index.html の <script> タグで CDN から読み込んでいる。
  a-scene など「a-」で始まる要素は A-Frame のカスタム要素なので、
  vite.config.ts で isCustomElement として登録してある。
-->
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { ModelConfig } from '@/types/ar'
import { useAR } from '@/composables/useAR'

// props の定義
// 全モデルを受け取ってプリロードし、selectedId のものだけ表示する
const props = defineProps<{
  models: ModelConfig[]  // 全モデル一覧（a-assets にまとめて登録）
  selectedId: string     // 現在表示するモデルの id
}>()

// emit の定義: マーカーの認識状態を親 (App.vue) に通知する
const emit = defineEmits<{
  detected: []  // マーカーを認識したとき
  lost: []      // マーカーを見失ったとき
}>()

// useAR Composable から状態と操作関数を取得
const { state, init, destroy } = useAR()

// テンプレート内の <a-scene> 要素を参照するための ref
// ref="sceneRef" と対応している
const sceneRef = ref<Element | null>(null)

// GitHub Pages では base URL が '/claude-webar/' になるため
// import.meta.env.BASE_URL で取得してパスに付与する
const base = import.meta.env.BASE_URL
const targetSrc = `${base}targets/targets.mind`

// ----------------------------------------------------------
// watch: state.isDetected が変化したとき親へ emit する
// watch(監視する値, コールバック) の形で使う
// ----------------------------------------------------------
watch(() => state.value.isDetected, (detected) => {
  if (detected) {
    emit('detected')
  } else {
    emit('lost')
  }
})

// ----------------------------------------------------------
// onMounted: コンポーネントが DOM に挿入されたあとに実行される
// A-Frame / MindAR は DOM 要素に対して動作するため、
// DOM が確定するこのタイミングで初期化する
// ----------------------------------------------------------
onMounted(() => {
  const scene = sceneRef.value
  if (scene) {
    init(scene) // useAR にシーン要素を渡してイベントリスナーを登録
  }
})

// ----------------------------------------------------------
// onUnmounted: コンポーネントが破棄されるときに実行される
// イベントリスナーを解除してメモリリークを防ぐ
// ----------------------------------------------------------
onUnmounted(() => {
  destroy()
})
</script>

<template>
  <!--
    <a-scene>: A-Frame のルート要素。3D シーン全体を管理する。
    mindar-image 属性: MindAR のコンポーネントを設定する。
      - imageTargetSrc: コンパイル済みマーカーファイル (.mind) のパス
      - autoStart: 読み込み完了後にカメラを自動起動
      - filterMinCF: 認識精度の閾値（低いほど敏感）
      - maxTrack: 同時認識するマーカー数
  -->
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
    <!--
      <a-assets>: A-Frame のアセット管理システム。
      ここに登録したファイルをシーン開始前にプリロードしてくれる。
      v-for で全モデルを一括登録することで、切替時のローディングをなくす。
    -->
    <a-assets>
      <a-asset-item
        v-for="m in models"
        :key="m.id"
        :id="`model-${m.id}`"
        :src="m.glbPath"
      />
    </a-assets>

    <!-- カメラ: look-controls を無効にして MindAR が制御できるようにする -->
    <a-camera position="0 0 0" look-controls="enabled: false" />

    <!--
      <a-entity mindar-image-target>: マーカーに追従するエンティティ。
      targetIndex はマーカーファイル内のインデックス（0 始まり）。
    -->
    <a-entity mindar-image-target="targetIndex: 0">
      <!--
        v-for で全モデルを描画し、selectedId と一致するものだけ
        :visible="true" にする。
        切替時に再読み込みが不要なので、スムーズに表示が変わる。
      -->
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
