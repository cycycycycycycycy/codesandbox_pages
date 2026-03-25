const n=`<template>\r
  <div class="month-picker">\r
    <div class="selected-range">\r
      <b style="color: #000; margin-right: 10px">已选月份</b\r
      >{{ displaySelectedRange }}\r
    </div>\r
\r
    <div class="month-container">\r
      <div v-for="month in months" :key="month.value" class="month-item">\r
        <div class="month-name">{{ month.name }}</div>\r
        <div class="half-month-container">\r
          <div\r
            class="half-month first-half"\r
            :class="{\r
              selected: isDirectlySelected(month.value, 'first'),\r
              'in-range': isInRange(month.value, 'first'),\r
            }"\r
            @click="selectHalfMonth(month.value, 'first')"\r
          >\r
            上\r
          </div>\r
          <div\r
            class="half-month second-half"\r
            :class="{\r
              selected: isDirectlySelected(month.value, 'second'),\r
              'in-range': isInRange(month.value, 'second'),\r
            }"\r
            @click="selectHalfMonth(month.value, 'second')"\r
          >\r
            下\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <div style="display: flex; justify-content: center">\r
      <button\r
        style="\r
          background: rgba(235, 236, 241, 1);\r
          color: rgba(51, 51, 51, 1);\r
          font-weight: 400;\r
        "\r
        class="confirm-btn"\r
        @click="$emit('close')"\r
      >\r
        取消\r
      </button>\r
      <button\r
        style="\r
          background: rgba(235, 236, 241, 1);\r
          color: rgba(51, 51, 51, 1);\r
          font-weight: 400;\r
          margin-left: 10px;\r
        "\r
        class="confirm-btn"\r
        @click="confirmSelection_N"\r
      >\r
        重置\r
      </button>\r
      <button\r
        style="\r
          margin-left: 10px;\r
          background: rgba(39, 115, 232, 1);\r
          font-weight: 400;\r
        "\r
        class="confirm-btn"\r
        @click="confirmSelection"\r
      >\r
        确定\r
      </button>\r
    </div>\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref, computed, watch } from "vue";\r
\r
const props = defineProps({\r
  modelValue: {\r
    type: Array,\r
    default: () => [],\r
  },\r
});\r
\r
const emit = defineEmits(["update:modelValue", "confirm"]);\r
\r
const months = [\r
  { name: "一月", value: 1 },\r
  { name: "二月", value: 2 },\r
  { name: "三月", value: 3 },\r
  { name: "四月", value: 4 },\r
  { name: "五月", value: 5 },\r
  { name: "六月", value: 6 },\r
  { name: "七月", value: 7 },\r
  { name: "八月", value: 8 },\r
  { name: "九月", value: 9 },\r
  { name: "十月", value: 10 },\r
  { name: "十一月", value: 11 },\r
  { name: "十二月", value: 12 },\r
];\r
\r
const selectedMonths = ref([...props.modelValue]);\r
const rangeEndpoints = ref([]);\r
\r
// 计算显示的选择范围文本\r
const displaySelectedRange = computed(() => {\r
  if (selectedMonths.value.length === 0) return "未选择";\r
\r
  const sorted = getSortedSelection();\r
  const first = sorted[0];\r
  const last = sorted[sorted.length - 1];\r
\r
  return \`\${first.month}月\${first.half === "first" ? "上半月" : "下半月"} 至 \${\r
    last.month\r
  }月\${last.half === "first" ? "上半月" : "下半月"}\`;\r
});\r
\r
// 获取排序后的选择\r
function getSortedSelection() {\r
  return [...selectedMonths.value].sort((a, b) => {\r
    const aValue = a.month + (a.half === "first" ? 0 : 0.5);\r
    const bValue = b.month + (b.half === "first" ? 0 : 0.5);\r
    return aValue - bValue;\r
  });\r
}\r
\r
// 判断是否是直接选中的端点\r
function isDirectlySelected(month, half) {\r
  return rangeEndpoints.value.some(\r
    (item) => item.month === month && item.half === half\r
  );\r
}\r
\r
// 判断是否在选中范围内\r
function isInRange(month, half) {\r
  if (rangeEndpoints.value.length < 2) return false;\r
\r
  const currentValue = month + (half === "first" ? 0 : 0.5);\r
  const sortedEndpoints = [...rangeEndpoints.value].sort((a, b) => {\r
    const aValue = a.month + (a.half === "first" ? 0 : 0.5);\r
    const bValue = b.month + (b.half === "first" ? 0 : 0.5);\r
    return aValue - bValue;\r
  });\r
\r
  const first = sortedEndpoints[0];\r
  const last = sortedEndpoints[1];\r
\r
  const minValue = first.month + (first.half === "first" ? 0 : 0.5);\r
  const maxValue = last.month + (last.half === "first" ? 0 : 0.5);\r
\r
  const isInRange = currentValue >= minValue && currentValue <= maxValue;\r
  const isEndpoint = isDirectlySelected(month, half);\r
\r
  return isInRange && !isEndpoint;\r
}\r
\r
// 选择半月份\r
function selectHalfMonth(month, half) {\r
  const currentSelection = { month, half };\r
\r
  if (rangeEndpoints.value.length === 1 && !(event.ctrlKey || event.metaKey)) {\r
    rangeEndpoints.value.push(currentSelection);\r
    updateSelectedMonths();\r
  } else if (event.ctrlKey || event.metaKey) {\r
    toggleSingleSelection(currentSelection);\r
  } else {\r
    rangeEndpoints.value = [currentSelection];\r
    updateSelectedMonths();\r
  }\r
}\r
\r
// 更新选中的月份范围\r
function updateSelectedMonths() {\r
  if (rangeEndpoints.value.length < 2) {\r
    selectedMonths.value = [...rangeEndpoints.value];\r
    return;\r
  }\r
\r
  const [first, last] = [...rangeEndpoints.value].sort((a, b) => {\r
    const aValue = a.month + (a.half === "first" ? 0 : 0.5);\r
    const bValue = b.month + (b.half === "first" ? 0 : 0.5);\r
    return aValue - bValue;\r
  });\r
\r
  const minValue = first.month + (first.half === "first" ? 0 : 0.5);\r
  const maxValue = last.month + (last.half === "first" ? 0 : 0.5);\r
\r
  selectedMonths.value = [];\r
\r
  for (let m = 1; m <= 12; m++) {\r
    for (const h of ["first", "second"]) {\r
      const value = m + (h === "first" ? 0 : 0.5);\r
      if (value >= minValue && value <= maxValue) {\r
        selectedMonths.value.push({ month: m, half: h });\r
      }\r
    }\r
  }\r
}\r
\r
// 单独切换选择状态\r
function toggleSingleSelection(selection) {\r
  const index = rangeEndpoints.value.findIndex(\r
    (item) => item.month === selection.month && item.half === selection.half\r
  );\r
\r
  if (index >= 0) {\r
    rangeEndpoints.value.splice(index, 1);\r
  } else {\r
    rangeEndpoints.value.push(selection);\r
  }\r
\r
  updateSelectedMonths();\r
}\r
\r
function confirmSelection() {\r
  console.log(selectedMonths.value, displaySelectedRange.value);\r
\r
  emit("update:modelValue", selectedMonths.value);\r
  emit("confirm", selectedMonths.value, displaySelectedRange.value);\r
}\r
function confirmSelection_N() {\r
  selectedMonths.value = "";\r
  rangeEndpoints.value = "";\r
  emit("update:modelValue", selectedMonths.value);\r
  emit("confirm", selectedMonths.value, displaySelectedRange.value);\r
}\r
\r
// 监听props变化\r
watch(\r
  () => props.modelValue,\r
  (newVal) => {\r
    selectedMonths.value = [...newVal];\r
    if (newVal.length >= 2) {\r
      const sorted = getSortedSelection();\r
      rangeEndpoints.value = [sorted[0], sorted[sorted.length - 1]];\r
    } else {\r
      rangeEndpoints.value = [...newVal];\r
    }\r
  },\r
  { immediate: true }\r
);\r
<\/script>\r
\r
<style scoped>\r
.month-picker {\r
  font-family: Arial, sans-serif;\r
  width: 100%;\r
  margin: 0 auto;\r
  box-sizing: border-box;\r
}\r
\r
.selected-range {\r
  margin-bottom: 16px;\r
  font-size: 14px;\r
  color: #666;\r
}\r
\r
.month-container {\r
  display: flex;\r
  gap: 8px;\r
  margin-bottom: 16px;\r
  overflow-x: auto;\r
  padding-bottom: 8px;\r
  flex-wrap: wrap;\r
}\r
\r
.month-item {\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  min-width: 60px;\r
}\r
\r
.month-name {\r
  font-size: 12px;\r
  margin-bottom: 8px;\r
  color: #333;\r
  text-align: center;\r
}\r
\r
.half-month-container {\r
  display: flex;\r
  width: 100%;\r
  border-radius: 4px;\r
  overflow: hidden;\r
}\r
\r
.half-month {\r
  flex: 1;\r
  text-align: center;\r
  padding: 6px 0;\r
  cursor: pointer;\r
  font-size: 12px;\r
  transition: all 0.2s;\r
  border: 1px solid rgba(240, 240, 240, 1);\r
  background-color: rgba(240, 240, 240, 1);\r
}\r
\r
.half-month:hover {\r
}\r
\r
.first-half {\r
  border-right: none;\r
  border-top-left-radius: 4px;\r
  border-bottom-left-radius: 4px;\r
}\r
\r
.second-half {\r
  border-left: none;\r
  border-top-right-radius: 4px;\r
  border-bottom-right-radius: 4px;\r
}\r
\r
/* 直接选中的端点 - 红色 */\r
.selected {\r
  background-color: rgba(39, 115, 232, 1);\r
  color: white;\r
  border-color: rgba(39, 115, 232, 1);\r
  font-weight: bold;\r
  z-index: 1;\r
}\r
\r
/* 自动包含的范围 - 绿色 */\r
.in-range {\r
  background: rgba(231, 241, 255, 1);\r
  color: rgba(39, 115, 232, 1);\r
  border-color: rgba(231, 241, 255, 1);\r
  z-index: 1;\r
}\r
\r
.confirm-btn {\r
  display: block;\r
  padding: 8px 16px;\r
  background-color: #ff4444;\r
  color: white;\r
  border: none;\r
  border-radius: 4px;\r
  cursor: pointer;\r
  transition: background-color 0.2s;\r
  font-weight: bold;\r
}\r
\r
.confirm-btn:hover {\r
  background-color: #cc0000;\r
}\r
</style>`;export{n as default};
