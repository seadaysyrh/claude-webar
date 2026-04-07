<script setup lang="ts">
defineProps<{
  isDetected: boolean
}>()
</script>

<template>
  <div class="status-badge" :class="isDetected ? 'detected' : 'waiting'">
    <span class="dot" />
    <span class="label">{{ isDetected ? '認識中' : '待機中' }}</span>
  </div>
</template>

<style scoped>
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

.detected .dot {
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
