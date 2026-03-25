<template>
  <el-dialog
    v-model="visible"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :modal-append-to-body="true"
    class="download-el-dialog"
    align-center
    destroy-on-close
    :lock-scroll="true"
  >
    <div class="progress-title">
      <el-icon style="color: #4facfe; font-size: 24px; margin-right: 8px">
        <Download />
      </el-icon>
      {{ progressText }}
    </div>
    <el-progress
      :percentage="progress"
      :stroke-width="18"
      color="#4facfe"
      :show-text="false"
      striped
      striped-flow
      style="margin-bottom: 16px"
    />
    <div class="progress-num" style="text-align: center">{{ progress }}%</div>
  </el-dialog>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { ElDialog, ElProgress, ElIcon } from "element-plus";
import { Download } from "@element-plus/icons-vue";

const visible = ref(false);
const progress = ref(0);
const progressText = ref("准备下载...");

let timer = null;

// 进度阶段提示
const tips = [
  { percent: 0, text: "准备下载..." },
  { percent: 10, text: "正在连接服务器..." },
  { percent: 30, text: "正在获取资源..." },
  { percent: 50, text: "正在下载文件..." },
  { percent: 100, text: "下载完成！" },
];

// 禁止所有操作
function blockEvent(e) {
  e.stopPropagation();
  e.preventDefault();
}
function addBlockEvents() {
  window.addEventListener("keydown", blockEvent, true);
  window.addEventListener("keyup", blockEvent, true);
  window.addEventListener("keypress", blockEvent, true);
  window.addEventListener("wheel", blockEvent, {
    passive: false,
    capture: true,
  });
  window.addEventListener("contextmenu", blockEvent, true);
  window.addEventListener("mousedown", blockEvent, true);
  window.addEventListener("mouseup", blockEvent, true);
}
function removeBlockEvents() {
  window.removeEventListener("keydown", blockEvent, true);
  window.removeEventListener("keyup", blockEvent, true);
  window.removeEventListener("keypress", blockEvent, true);
  window.removeEventListener("wheel", blockEvent, true);
  window.removeEventListener("contextmenu", blockEvent, true);
  window.removeEventListener("mousedown", blockEvent, true);
  window.removeEventListener("mouseup", blockEvent, true);
}

// 打开弹窗并开始模拟下载
function openDialog() {
  visible.value = true;
  document.body.style.overflow = "hidden";
  addBlockEvents();
  progress.value = 0;
  progressText.value = tips[0].text;
  simulateProgress();
}

// 关闭弹窗
function closeDialog() {
  visible.value = false;
  document.body.style.overflow = "";
  clearTimeout(timer);
  removeBlockEvents();
}

// 模拟进度
function simulateProgress() {
  if (progress.value >= 99) return; // 不能到100%
  timer = setTimeout(() => {
    let next;
    if (progress.value > 70) {
      next = (progress.value + Math.random() * 0.5).toFixed(1);
    } else {
      next = progress.value + Math.floor(Math.random() * 10) + 5;
    }
    if (next > 99) next = 99;
    progress.value = parseFloat(next);
    for (let i = tips.length - 1; i >= 0; i--) {
      if (progress.value >= tips[i].percent) {
        progressText.value = tips[i].text;
        break;
      }
    }
    if (progress.value < 99) {
      simulateProgress();
    }
  }, 500 + Math.random() * 500);
}

// 下载完成时调用
function finishDownload() {
  clearTimeout(timer);
  progress.value = 100;
  progressText.value = tips[tips.length - 1].text;
  setTimeout(() => {
    closeDialog();
  }, 1200);
}

// 组件卸载时恢复滚动
onUnmounted(() => {
  document.body.style.overflow = "";
  removeBlockEvents();
});

// 暴露方法给父组件调用
defineExpose({
  openDialog,
  finishDownload,
});
</script>

<style lang="less" >
.download-el-dialog {
  border-radius: 15px !important;
  :deep(.el-dialog__header) {
    display: none;
  }
  :deep(.el-dialog__body) {
    padding: 32px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .progress-title {
    font-size: 20px;
    color: #222;
    margin-bottom: 28px;
    font-weight: 600;
    letter-spacing: 1.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .progress-num {
    font-size: 18px;
    color: #4facfe;
    font-weight: 700;
    letter-spacing: 1.5px;
    margin-top: 2px;
    text-shadow: 0 1px 4px #e3f0ff;
  }
}
</style>