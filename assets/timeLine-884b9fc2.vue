<template>
  <div class="timeline">
    <div class="leftBtnA" @click="leftBtn"></div>
    <div class="rightBtn" @click="rightBtn"></div>
    <div class="todayBtn" @click="backToToday" v-if="backToday">返回今天</div>
    <div class="line"></div>
    <div class="item">
      <div
        @click="changeDate(item)"
        :class="active == item ? 'iconActive' : 'icon'"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <div class="title">
          <div class="titleLittle"></div>
        </div>
        <div class="text">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  number: {
    type: Number,
    default: 9,
  },
  backToday: {
    type: Boolean,
    default: true,
  },
});

const active = ref("");
const dataList = ref([]);
const getFormattedCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份是从0开始的
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const getNextPreviousDate = (inputDate, isNext, value) => {
  let date = new Date(inputDate);
  if (isNext) {
    date.setDate(date.getDate() + value);
  } else {
    date.setDate(date.getDate() - value);
  }
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const leftBtn = () => {
  initDate(dataList.value[0]);
};
const rightBtn = () => {
  initDate(dataList.value[dataList.value.length - 1]);
};
const initDate = (date) => {
  dataList.value = [];
  dataList.value.push(date);
  for (let index = 0; index < parseInt(props.number / 2); index++) {
    dataList.value.push(getNextPreviousDate(date, true, index + 1));
  }
  for (let index = 0; index < parseInt(props.number / 2); index++) {
    dataList.value.unshift(getNextPreviousDate(date, false, index + 1));
  }
  console.log(dataList.value);
};
const emitFun = defineEmits(["update:modelValue"]);
const changeDate = (value) => {
  active.value = value;
  emitFun("update:modelValue", value);
};
const backToToday = () => {
  const today = getFormattedCurrentDate();
  initDate(today);
  active.value = today;
  emitFun("update:modelValue", today);
};
onMounted(() => {
  initDate(getFormattedCurrentDate());
  active.value = getFormattedCurrentDate();

  emitFun("update:modelValue", active.value);
});
</script>

<style lang="less" scoped>
.timeline {
  width: 100%;
  position: relative;
  margin-top: 50px;
  height: 40px;
  .line {
    position: absolute;
    height: 0;
    left: 50px;
    top: 11px;
    border: 2px solid rgb(109, 202, 255);
    opacity: 0.4;
    width: calc(100% - 100px);
  }
  .leftBtnA {
    cursor: pointer;
    position: absolute;
    width: 0;
    height: 0px;
    left: 15px;
    top: 3px;
    transform: rotate(-90deg);
    border-radius: 1px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid rgba(0, 0, 0, 0.4); /* Change color to suit your needs */
  }
  .rightBtn {
    cursor: pointer;
    position: absolute;
    width: 0;
    height: 0px;
    right: 15px;
    top: 3px;
    transform: rotate(-90deg);
    border-radius: 1px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 20px solid rgba(0, 0, 0, 0.4); /* Change color to suit your needs */
  }
  .todayBtn {
    position: absolute;
    right: 50%;
    top: 70px;
    transform: translateX(50%);
    background: #6dcaff;
    color: #fff;
    padding: 4px 16px;
    border-radius: 16px;
    cursor: pointer;
    font-size: 14px;
    z-index: 2;
    transition: background 0.2s;
    &:hover {
      background: #ffa322;
    }
  }
  .item {
    width: calc(100% - 100px);
    height: 60px;
    position: absolute;
    left: 52px;
    top: -2px;
    display: flex;
    justify-content: space-between;
    .icon {
      width: 10%;
      // background-color: blue;
      height: 60px;
      display: flex;
      align-items: end;
      justify-content: center;
      position: relative;
      cursor: pointer;
      .title {
        position: absolute;
        width: 20px;
        height: 20px;
        left: calc(50% - 10px);
        top: 5px;
        background: rgba(109, 202, 255, 0.4);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        .titleLittle {
          width: 10px;
          height: 10px;
          background: rgba(109, 202, 255, 1);
          border-radius: 50%;
        }
      }
    }
    .iconActive {
      cursor: pointer;
      width: 10%;
      // background-color: blue;
      height: 60px;
      display: flex;
      align-items: end;
      justify-content: center;
      position: relative;
      color: rgb(255, 163, 34);
      .title {
        position: absolute;
        width: 20px;
        height: 20px;
        left: calc(50% - 10px);
        top: 5px;
        background: rgba(255, 163, 34, 0.4);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        .titleLittle {
          width: 10px;
          height: 10px;
          background: rgba(255, 163, 34, 1);
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
