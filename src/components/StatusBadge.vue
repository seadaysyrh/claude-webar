<!--
  StatusBadge — AR 認識状態を表示するバッジコンポーネント

  【学習ポイント: props と TypeScript】
  親コンポーネントから isDetected を受け取り、
  true/false に応じてクラスとテキストを切り替えるだけのシンプルな例。
  defineProps<{ ... }>() で型付き props を宣言できる。
-->
<script setup lang="ts">
// props の宣言
// 型引数に interface を書くと、型チェックが自動でかかる
defineProps<{
  isDetected: boolean // true = 認識中 / false = 待機中
}>()
</script>

<template>
  <!--
    :class="..." は動的クラスのバインディング
    isDetected が true なら 'detected'、false なら 'waiting' クラスが付く
  -->
  <div class="status-badge" :class="isDetected ? 'detected' : 'waiting'">
    <span class="dot" />
    <!-- {{ }} はテンプレート内での値の表示（Mustache 構文） -->
    <span class="label">{{ isDetected ? '認識中' : '待機中' }}</span>
  </div>
</template>

<style scoped>
/*
  scoped を付けると、このコンポーネント内だけにスタイルが適用される。
  他のコンポーネントの同名クラスとぶつからない。
*/
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  font-family: sans-serif;
  backdrop-filter: blur(8px);
  transition: background 0.3s, color 0.3s;
}

.detected {
  background: rgba(34, 197, 94, 0.85);
  color: #fff;
}

.waiting {
  background: rgba(0, 0, 0, 0.55);
  color: #d1d5db;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

/* 認識中のときだけドットをパルスアニメーションさせる */
.detected .dot {
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
