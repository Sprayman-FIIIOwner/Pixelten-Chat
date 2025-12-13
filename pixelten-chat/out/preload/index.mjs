import { contextBridge } from "electron";
contextBridge.exposeInMainWorld("pixelten", {
  osVersion: "1.03",
  level: "KernelLevel"
});
