<template>
  <div class="month-picker">
    <div class="selected-range">
      <b style="color: #000; margin-right: 10px">已选月份</b
      >{{ displaySelectedRange }}
    </div>

    <div class="month-container">
      <div v-for="month in months" :key="month.value" class="month-item">
        <div class="month-name">{{ month.name }}</div>
        <div class="half-month-container">
          <div
            class="half-month first-half"
            :class="{
              selected: isDirectlySelected(month.value, 'first'),
              'in-range': isInRange(month.value, 'first'),
            }"
            @click="selectHalfMonth(month.value, 'first')"
          >
            上
          </div>
          <div
            class="half-month second-half"
            :class="{
              selected: isDirectlySelected(month.value, 'second'),
              'in-range': isInRange(month.value, 'second'),
            }"
            @click="selectHalfMonth(month.value, 'second')"
          >
            下
          </div>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: center">
      <button
        style="
          background: rgba(235, 236, 241, 1);
          color: rgba(51, 51, 51, 1);
          font-weight: 400;
        "
        class="confirm-btn"
        @click="$emit('close')"
      >
        取消
      </button>
      <button
        style="
          background: rgba(235, 236, 241, 1);
          color: rgba(51, 51, 51, 1);
          font-weight: 400;
          margin-left: 10px;
        "
        class="confirm-btn"
        @click="confirmSelection_N"
      >
        重置
      </button>
      <button
        style="
          margin-left: 10px;
          background: rgba(39, 115, 232, 1);
          font-weight: 400;
        "
        class="confirm-btn"
        @click="confirmSelection"
      >
        确定
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const months = [
  { name: "一月", value: 1 },
  { name: "二月", value: 2 },
  { name: "三月", value: 3 },
  { name: "四月", value: 4 },
  { name: "五月", value: 5 },
  { name: "六月", value: 6 },
  { name: "七月", value: 7 },
  { name: "八月", value: 8 },
  { name: "九月", value: 9 },
  { name: "十月", value: 10 },
  { name: "十一月", value: 11 },
  { name: "十二月", value: 12 },
];

const selectedMonths = ref([...props.modelValue]);
const rangeEndpoints = ref([]);

// 计算显示的选择范围文本
const displaySelectedRange = computed(() => {
  if (selectedMonths.value.length === 0) return "未选择";

  const sorted = getSortedSelection();
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  return `${first.month}月${first.half === "first" ? "上半月" : "下半月"} 至 ${
    last.month
  }月${last.half === "first" ? "上半月" : "下半月"}`;
});

// 获取排序后的选择
function getSortedSelection() {
  return [...selectedMonths.value].sort((a, b) => {
    const aValue = a.month + (a.half === "first" ? 0 : 0.5);
    const bValue = b.month + (b.half === "first" ? 0 : 0.5);
    return aValue - bValue;
  });
}

// 判断是否是直接选中的端点
function isDirectlySelected(month, half) {
  return rangeEndpoints.value.some(
    (item) => item.month === month && item.half === half
  );
}

// 判断是否在选中范围内
function isInRange(month, half) {
  if (rangeEndpoints.value.length < 2) return false;

  const currentValue = month + (half === "first" ? 0 : 0.5);
  const sortedEndpoints = [...rangeEndpoints.value].sort((a, b) => {
    const aValue = a.month + (a.half === "first" ? 0 : 0.5);
    const bValue = b.month + (b.half === "first" ? 0 : 0.5);
    return aValue - bValue;
  });

  const first = sortedEndpoints[0];
  const last = sortedEndpoints[1];

  const minValue = first.month + (first.half === "first" ? 0 : 0.5);
  const maxValue = last.month + (last.half === "first" ? 0 : 0.5);

  const isInRange = currentValue >= minValue && currentValue <= maxValue;
  const isEndpoint = isDirectlySelected(month, half);

  return isInRange && !isEndpoint;
}

// 选择半月份
function selectHalfMonth(month, half) {
  const currentSelection = { month, half };

  if (rangeEndpoints.value.length === 1 && !(event.ctrlKey || event.metaKey)) {
    rangeEndpoints.value.push(currentSelection);
    updateSelectedMonths();
  } else if (event.ctrlKey || event.metaKey) {
    toggleSingleSelection(currentSelection);
  } else {
    rangeEndpoints.value = [currentSelection];
    updateSelectedMonths();
  }
}

// 更新选中的月份范围
function updateSelectedMonths() {
  if (rangeEndpoints.value.length < 2) {
    selectedMonths.value = [...rangeEndpoints.value];
    return;
  }

  const [first, last] = [...rangeEndpoints.value].sort((a, b) => {
    const aValue = a.month + (a.half === "first" ? 0 : 0.5);
    const bValue = b.month + (b.half === "first" ? 0 : 0.5);
    return aValue - bValue;
  });

  const minValue = first.month + (first.half === "first" ? 0 : 0.5);
  const maxValue = last.month + (last.half === "first" ? 0 : 0.5);

  selectedMonths.value = [];

  for (let m = 1; m <= 12; m++) {
    for (const h of ["first", "second"]) {
      const value = m + (h === "first" ? 0 : 0.5);
      if (value >= minValue && value <= maxValue) {
        selectedMonths.value.push({ month: m, half: h });
      }
    }
  }
}

// 单独切换选择状态
function toggleSingleSelection(selection) {
  const index = rangeEndpoints.value.findIndex(
    (item) => item.month === selection.month && item.half === selection.half
  );

  if (index >= 0) {
    rangeEndpoints.value.splice(index, 1);
  } else {
    rangeEndpoints.value.push(selection);
  }

  updateSelectedMonths();
}

function confirmSelection() {
  console.log(selectedMonths.value, displaySelectedRange.value);

  emit("update:modelValue", selectedMonths.value);
  emit("confirm", selectedMonths.value, displaySelectedRange.value);
}
function confirmSelection_N() {
  selectedMonths.value = "";
  rangeEndpoints.value = "";
  emit("update:modelValue", selectedMonths.value);
  emit("confirm", selectedMonths.value, displaySelectedRange.value);
}

// 监听props变化
watch(
  () => props.modelValue,
  (newVal) => {
    selectedMonths.value = [...newVal];
    if (newVal.length >= 2) {
      const sorted = getSortedSelection();
      rangeEndpoints.value = [sorted[0], sorted[sorted.length - 1]];
    } else {
      rangeEndpoints.value = [...newVal];
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.month-picker {
  font-family: Arial, sans-serif;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.selected-range {
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
}

.month-container {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  flex-wrap: wrap;
}

.month-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.month-name {
  font-size: 12px;
  margin-bottom: 8px;
  color: #333;
  text-align: center;
}

.half-month-container {
  display: flex;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}

.half-month {
  flex: 1;
  text-align: center;
  padding: 6px 0;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  border: 1px solid rgba(240, 240, 240, 1);
  background-color: rgba(240, 240, 240, 1);
}

.half-month:hover {
}

.first-half {
  border-right: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.second-half {
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

/* 直接选中的端点 - 红色 */
.selected {
  background-color: rgba(39, 115, 232, 1);
  color: white;
  border-color: rgba(39, 115, 232, 1);
  font-weight: bold;
  z-index: 1;
}

/* 自动包含的范围 - 绿色 */
.in-range {
  background: rgba(231, 241, 255, 1);
  color: rgba(39, 115, 232, 1);
  border-color: rgba(231, 241, 255, 1);
  z-index: 1;
}

.confirm-btn {
  display: block;
  padding: 8px 16px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: bold;
}

.confirm-btn:hover {
  background-color: #cc0000;
}
</style>