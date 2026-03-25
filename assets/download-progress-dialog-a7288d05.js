const n=`<template>\r
  <el-dialog\r
    v-model="visible"\r
    width="400px"\r
    :close-on-click-modal="false"\r
    :close-on-press-escape="false"\r
    :show-close="false"\r
    :modal-append-to-body="true"\r
    class="download-el-dialog"\r
    align-center\r
    destroy-on-close\r
    :lock-scroll="true"\r
  >\r
    <div class="progress-title">\r
      <el-icon style="color: #4facfe; font-size: 24px; margin-right: 8px">\r
        <Download />\r
      </el-icon>\r
      {{ progressText }}\r
    </div>\r
    <el-progress\r
      :percentage="progress"\r
      :stroke-width="18"\r
      color="#4facfe"\r
      :show-text="false"\r
      striped\r
      striped-flow\r
      style="margin-bottom: 16px"\r
    />\r
    <div class="progress-num" style="text-align: center">{{ progress }}%</div>\r
  </el-dialog>\r
</template>\r
\r
<script setup>\r
import { ref, onUnmounted } from "vue";\r
import { ElDialog, ElProgress, ElIcon } from "element-plus";\r
import { Download } from "@element-plus/icons-vue";\r
\r
const visible = ref(false);\r
const progress = ref(0);\r
const progressText = ref("准备下载...");\r
\r
let timer = null;\r
\r
// 进度阶段提示\r
const tips = [\r
  { percent: 0, text: "准备下载..." },\r
  { percent: 10, text: "正在连接服务器..." },\r
  { percent: 30, text: "正在获取资源..." },\r
  { percent: 50, text: "正在下载文件..." },\r
  { percent: 100, text: "下载完成！" },\r
];\r
\r
// 禁止所有操作\r
function blockEvent(e) {\r
  e.stopPropagation();\r
  e.preventDefault();\r
}\r
function addBlockEvents() {\r
  window.addEventListener("keydown", blockEvent, true);\r
  window.addEventListener("keyup", blockEvent, true);\r
  window.addEventListener("keypress", blockEvent, true);\r
  window.addEventListener("wheel", blockEvent, {\r
    passive: false,\r
    capture: true,\r
  });\r
  window.addEventListener("contextmenu", blockEvent, true);\r
  window.addEventListener("mousedown", blockEvent, true);\r
  window.addEventListener("mouseup", blockEvent, true);\r
}\r
function removeBlockEvents() {\r
  window.removeEventListener("keydown", blockEvent, true);\r
  window.removeEventListener("keyup", blockEvent, true);\r
  window.removeEventListener("keypress", blockEvent, true);\r
  window.removeEventListener("wheel", blockEvent, true);\r
  window.removeEventListener("contextmenu", blockEvent, true);\r
  window.removeEventListener("mousedown", blockEvent, true);\r
  window.removeEventListener("mouseup", blockEvent, true);\r
}\r
\r
// 打开弹窗并开始模拟下载\r
function openDialog() {\r
  visible.value = true;\r
  document.body.style.overflow = "hidden";\r
  addBlockEvents();\r
  progress.value = 0;\r
  progressText.value = tips[0].text;\r
  simulateProgress();\r
}\r
\r
// 关闭弹窗\r
function closeDialog() {\r
  visible.value = false;\r
  document.body.style.overflow = "";\r
  clearTimeout(timer);\r
  removeBlockEvents();\r
}\r
\r
// 模拟进度\r
function simulateProgress() {\r
  if (progress.value >= 99) return; // 不能到100%\r
  timer = setTimeout(() => {\r
    let next;\r
    if (progress.value > 70) {\r
      next = (progress.value + Math.random() * 0.5).toFixed(1);\r
    } else {\r
      next = progress.value + Math.floor(Math.random() * 10) + 5;\r
    }\r
    if (next > 99) next = 99;\r
    progress.value = parseFloat(next);\r
    for (let i = tips.length - 1; i >= 0; i--) {\r
      if (progress.value >= tips[i].percent) {\r
        progressText.value = tips[i].text;\r
        break;\r
      }\r
    }\r
    if (progress.value < 99) {\r
      simulateProgress();\r
    }\r
  }, 500 + Math.random() * 500);\r
}\r
\r
// 下载完成时调用\r
function finishDownload() {\r
  clearTimeout(timer);\r
  progress.value = 100;\r
  progressText.value = tips[tips.length - 1].text;\r
  setTimeout(() => {\r
    closeDialog();\r
  }, 1200);\r
}\r
\r
// 组件卸载时恢复滚动\r
onUnmounted(() => {\r
  document.body.style.overflow = "";\r
  removeBlockEvents();\r
});\r
\r
// 暴露方法给父组件调用\r
defineExpose({\r
  openDialog,\r
  finishDownload,\r
});\r
<\/script>\r
\r
<style lang="less" >\r
.download-el-dialog {\r
  border-radius: 15px !important;\r
  :deep(.el-dialog__header) {\r
    display: none;\r
  }\r
  :deep(.el-dialog__body) {\r
    padding: 32px 24px 24px 24px;\r
    display: flex;\r
    flex-direction: column;\r
    align-items: center;\r
  }\r
\r
  .progress-title {\r
    font-size: 20px;\r
    color: #222;\r
    margin-bottom: 28px;\r
    font-weight: 600;\r
    letter-spacing: 1.5px;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    gap: 8px;\r
  }\r
  .progress-num {\r
    font-size: 18px;\r
    color: #4facfe;\r
    font-weight: 700;\r
    letter-spacing: 1.5px;\r
    margin-top: 2px;\r
    text-shadow: 0 1px 4px #e3f0ff;\r
  }\r
}\r
</style>`;export{n as default};
