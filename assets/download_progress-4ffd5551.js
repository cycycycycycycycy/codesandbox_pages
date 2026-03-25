const o=`<template>
  <downloadProgressDialog ref="downloadRef" />
  <el-button @click="startDownload">开始下载</el-button>
</template>
<script setup>
import { ref } from "vue";
import downloadProgressDialog from "./components/download-progress-dialog.vue";

const downloadRef = ref();

function startDownload() {
  downloadRef.value.openDialog();
  // 模拟下载完成
  setTimeout(() => {
    downloadRef.value.finishDownload();
  }, 60000);
}
<\/script>`;export{o as default};
