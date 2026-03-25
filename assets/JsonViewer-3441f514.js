const r=`<template>\r
  <el-dialog\r
    v-model="dialogVisible"\r
    :title="title"\r
    :width="width"\r
    :close-on-click-modal="false"\r
  >\r
    <div class="json-viewer">\r
      <div class="json-toolbar">\r
        <el-button size="small" type="primary" @click="copyJson">\r
          <el-icon><CopyDocument /></el-icon>\r
          复制数据\r
        </el-button>\r
      </div>\r
      <div class="json-content">\r
        <vue-json-pretty\r
          :data="jsonData"\r
          :deep="deep"\r
          :show-double-quotes="true"\r
          :show-length="true"\r
          :collapsed-on-click-brackets="true"\r
          :show-icon="true"\r
          :show-line="true"\r
          :collapsed-strings-length="20"\r
          :theme="'dark'"\r
          ref="jsonViewer"\r
        />\r
      </div>\r
    </div>\r
  </el-dialog>\r
</template>\r
\r
<script setup lang="ts">\r
import { ref, computed } from "vue";\r
import { ElMessage } from "element-plus";\r
import { CopyDocument } from "@element-plus/icons-vue";\r
import VueJsonPretty from "vue-json-pretty";\r
import "vue-json-pretty/lib/styles.css";\r
\r
interface Props {\r
  modelValue: boolean;\r
  data: any;\r
  title?: string;\r
  width?: string | number;\r
  deep?: number;\r
}\r
\r
const props = withDefaults(defineProps<Props>(), {\r
  title: "数据查看",\r
  width: "800px",\r
  deep: 2,\r
});\r
\r
const emit = defineEmits(["update:modelValue"]);\r
\r
const dialogVisible = computed({\r
  get: () => props.modelValue,\r
  set: (val) => emit("update:modelValue", val),\r
});\r
\r
const jsonViewer = ref();\r
const jsonData = computed(() => props.data);\r
\r
// 复制 JSON 数据\r
async function copyJson() {\r
  const jsonString = JSON.stringify(jsonData.value, null, 2);\r
  try {\r
    await navigator.clipboard.writeText(jsonString);\r
    ElMessage.success("数据已复制到剪贴板");\r
  } catch (error) {\r
    console.error("复制失败:", error);\r
    // 降级处理：使用传统复制方法\r
    const textarea = document.createElement("textarea");\r
    textarea.value = jsonString;\r
    document.body.appendChild(textarea);\r
    textarea.select();\r
    try {\r
      document.execCommand("copy");\r
      ElMessage.success("数据已复制到剪贴板");\r
    } catch (err) {\r
      ElMessage.error("复制失败，请手动复制");\r
    }\r
    document.body.removeChild(textarea);\r
  }\r
}\r
<\/script>\r
\r
<style lang="less" scoped>\r
.json-viewer {\r
  background: #1e1e1e;\r
  border-radius: 8px;\r
  height: 500px;\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
\r
  .json-toolbar {\r
    position: sticky;\r
    top: 0;\r
    z-index: 10;\r
    background: #1e1e1e;\r
    padding: 16px;\r
    display: flex;\r
    justify-content: flex-end;\r
    border-bottom: 1px solid #333;\r
  }\r
\r
  .json-content {\r
    flex: 1;\r
    overflow: auto;\r
    padding: 0 16px 16px;\r
  }\r
}\r
\r
:deep(.vjs-tree) {\r
  font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", "source-code-pro",\r
    monospace;\r
  font-size: 14px;\r
  line-height: 1.5;\r
  color: #d4d4d4;\r
  background: transparent;\r
}\r
\r
:deep(.vjs-tree-node) {\r
  padding: 2px 0;\r
}\r
\r
:deep(.vjs-value) {\r
  &.vjs-value-string {\r
    color: #ce9178;\r
  }\r
\r
  &.vjs-value-number {\r
    color: #b5cea8;\r
  }\r
\r
  &.vjs-value-boolean {\r
    color: #569cd6;\r
  }\r
\r
  &.vjs-value-null {\r
    color: #569cd6;\r
  }\r
}\r
\r
:deep(.vjs-key) {\r
  color: #9cdcfe;\r
}\r
\r
:deep(.vjs-bracket) {\r
  color: #d4d4d4;\r
}\r
\r
:deep(.vjs-comma) {\r
  color: #d4d4d4;\r
}\r
\r
:deep(.vjs-toggle) {\r
  color: #666;\r
  transition: color 0.2s;\r
\r
  &:hover {\r
    color: #9cdcfe;\r
  }\r
}\r
\r
:deep(.vjs-line-number) {\r
  color: #858585;\r
  margin-right: 8px;\r
}\r
\r
:deep(.el-dialog__body) {\r
  padding: 20px;\r
}\r
</style> `;export{r as default};
