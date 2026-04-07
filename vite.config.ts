import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// A-Frame / MindAR のカスタム要素プレフィックス
const AFRAME_ELEMENTS = /^a-/

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // a- で始まる要素をカスタム要素として扱い、Vue の解決対象から除外
          isCustomElement: (tag) => AFRAME_ELEMENTS.test(tag)
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: '/claude-webar/',
  build: {
    outDir: 'dist'
  }
})
