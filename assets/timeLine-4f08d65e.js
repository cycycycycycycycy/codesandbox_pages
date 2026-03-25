const r=`<template>\r
  <div class="timeline">\r
    <div class="leftBtnA" @click="leftBtn"></div>\r
    <div class="rightBtn" @click="rightBtn"></div>\r
    <div class="todayBtn" @click="backToToday" v-if="backToday">返回今天</div>\r
    <div class="line"></div>\r
    <div class="item">\r
      <div\r
        @click="changeDate(item)"\r
        :class="active == item ? 'iconActive' : 'icon'"\r
        v-for="(item, index) in dataList"\r
        :key="index"\r
      >\r
        <div class="title">\r
          <div class="titleLittle"></div>\r
        </div>\r
        <div class="text">{{ item }}</div>\r
      </div>\r
    </div>\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref, onMounted } from "vue";\r
\r
const props = defineProps({\r
  modelValue: {\r
    type: String,\r
    default: "",\r
  },\r
  number: {\r
    type: Number,\r
    default: 9,\r
  },\r
  backToday: {\r
    type: Boolean,\r
    default: true,\r
  },\r
});\r
\r
const active = ref("");\r
const dataList = ref([]);\r
const getFormattedCurrentDate = () => {\r
  const now = new Date();\r
  const year = now.getFullYear();\r
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份是从0开始的\r
  const day = now.getDate().toString().padStart(2, "0");\r
  return \`\${year}-\${month}-\${day}\`;\r
};\r
const getNextPreviousDate = (inputDate, isNext, value) => {\r
  let date = new Date(inputDate);\r
  if (isNext) {\r
    date.setDate(date.getDate() + value);\r
  } else {\r
    date.setDate(date.getDate() - value);\r
  }\r
  let year = date.getFullYear();\r
  let month = String(date.getMonth() + 1).padStart(2, "0");\r
  let day = String(date.getDate()).padStart(2, "0");\r
  return \`\${year}-\${month}-\${day}\`;\r
};\r
const leftBtn = () => {\r
  initDate(dataList.value[0]);\r
};\r
const rightBtn = () => {\r
  initDate(dataList.value[dataList.value.length - 1]);\r
};\r
const initDate = (date) => {\r
  dataList.value = [];\r
  dataList.value.push(date);\r
  for (let index = 0; index < parseInt(props.number / 2); index++) {\r
    dataList.value.push(getNextPreviousDate(date, true, index + 1));\r
  }\r
  for (let index = 0; index < parseInt(props.number / 2); index++) {\r
    dataList.value.unshift(getNextPreviousDate(date, false, index + 1));\r
  }\r
  console.log(dataList.value);\r
};\r
const emitFun = defineEmits(["update:modelValue"]);\r
const changeDate = (value) => {\r
  active.value = value;\r
  emitFun("update:modelValue", value);\r
};\r
const backToToday = () => {\r
  const today = getFormattedCurrentDate();\r
  initDate(today);\r
  active.value = today;\r
  emitFun("update:modelValue", today);\r
};\r
onMounted(() => {\r
  initDate(getFormattedCurrentDate());\r
  active.value = getFormattedCurrentDate();\r
\r
  emitFun("update:modelValue", active.value);\r
});\r
<\/script>\r
\r
<style lang="less" scoped>\r
.timeline {\r
  width: 100%;\r
  position: relative;\r
  margin-top: 50px;\r
  height: 40px;\r
  .line {\r
    position: absolute;\r
    height: 0;\r
    left: 50px;\r
    top: 11px;\r
    border: 2px solid rgb(109, 202, 255);\r
    opacity: 0.4;\r
    width: calc(100% - 100px);\r
  }\r
  .leftBtnA {\r
    cursor: pointer;\r
    position: absolute;\r
    width: 0;\r
    height: 0px;\r
    left: 15px;\r
    top: 3px;\r
    transform: rotate(-90deg);\r
    border-radius: 1px;\r
    border-left: 10px solid transparent;\r
    border-right: 10px solid transparent;\r
    border-bottom: 20px solid rgba(0, 0, 0, 0.4); /* Change color to suit your needs */\r
  }\r
  .rightBtn {\r
    cursor: pointer;\r
    position: absolute;\r
    width: 0;\r
    height: 0px;\r
    right: 15px;\r
    top: 3px;\r
    transform: rotate(-90deg);\r
    border-radius: 1px;\r
    border-left: 10px solid transparent;\r
    border-right: 10px solid transparent;\r
    border-top: 20px solid rgba(0, 0, 0, 0.4); /* Change color to suit your needs */\r
  }\r
  .todayBtn {\r
    position: absolute;\r
    right: 50%;\r
    top: 70px;\r
    transform: translateX(50%);\r
    background: #6dcaff;\r
    color: #fff;\r
    padding: 4px 16px;\r
    border-radius: 16px;\r
    cursor: pointer;\r
    font-size: 14px;\r
    z-index: 2;\r
    transition: background 0.2s;\r
    &:hover {\r
      background: #ffa322;\r
    }\r
  }\r
  .item {\r
    width: calc(100% - 100px);\r
    height: 60px;\r
    position: absolute;\r
    left: 52px;\r
    top: -2px;\r
    display: flex;\r
    justify-content: space-between;\r
    .icon {\r
      width: 10%;\r
      // background-color: blue;\r
      height: 60px;\r
      display: flex;\r
      align-items: end;\r
      justify-content: center;\r
      position: relative;\r
      cursor: pointer;\r
      .title {\r
        position: absolute;\r
        width: 20px;\r
        height: 20px;\r
        left: calc(50% - 10px);\r
        top: 5px;\r
        background: rgba(109, 202, 255, 0.4);\r
        border-radius: 50%;\r
        display: flex;\r
        align-items: center;\r
        justify-content: center;\r
        .titleLittle {\r
          width: 10px;\r
          height: 10px;\r
          background: rgba(109, 202, 255, 1);\r
          border-radius: 50%;\r
        }\r
      }\r
    }\r
    .iconActive {\r
      cursor: pointer;\r
      width: 10%;\r
      // background-color: blue;\r
      height: 60px;\r
      display: flex;\r
      align-items: end;\r
      justify-content: center;\r
      position: relative;\r
      color: rgb(255, 163, 34);\r
      .title {\r
        position: absolute;\r
        width: 20px;\r
        height: 20px;\r
        left: calc(50% - 10px);\r
        top: 5px;\r
        background: rgba(255, 163, 34, 0.4);\r
        border-radius: 50%;\r
        display: flex;\r
        align-items: center;\r
        justify-content: center;\r
        .titleLittle {\r
          width: 10px;\r
          height: 10px;\r
          background: rgba(255, 163, 34, 1);\r
          border-radius: 50%;\r
        }\r
      }\r
    }\r
  }\r
}\r
</style>\r
`;export{r as default};
