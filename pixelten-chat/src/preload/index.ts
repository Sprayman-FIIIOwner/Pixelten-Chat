import { contextBridge } from 'electron'

// Expose protected APIs to the renderer (SolidJS)
contextBridge.exposeInMainWorld('pixelten', {
  osVersion: '1.03',
  level: 'KernelLevel'
})