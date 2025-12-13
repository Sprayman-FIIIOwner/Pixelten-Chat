import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  // 1. Main Process (The Node.js/Kernel side)
  main: {
    plugins: [externalizeDepsPlugin()]
  },

  // 2. Preload Scripts (The Bridge)
  preload: {
    plugins: [externalizeDepsPlugin()]
  },

  // 3. Renderer Process (Your existing SolidJS + Tailwind app)
  renderer: {
    root: 'src/renderer', // This is where you moved your old src/
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      solid(), 
      tailwindcss()
    ]
  }
})