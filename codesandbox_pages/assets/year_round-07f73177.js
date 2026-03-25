const n=`<template>\r
  <div class="main" ref="main">\r
    <div class="year">\r
      <img src="./img/year.png" alt="" />\r
    </div>\r
    <div\r
      @click="btnClick(item, index)"\r
      :class="['btn', item.index == 0 ? 'active' : '']"\r
      v-for="(item, index) in data"\r
      :key="index"\r
    >\r
      {{ item.name }}\r
    </div>\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref, onMounted, nextTick, defineEmits } from "vue";\r
\r
let emitFun = defineEmits(["yearChange"]);\r
const year = ref("");\r
\r
const main = ref(null);\r
\r
const centerx = ref(""); //圆心X\r
const centery = ref(1240); //圆心Y\r
const r = ref(1200); //半径\r
const oimages = document.getElementsByClassName("btn"); //图片集合\r
const da = ref(360 / 60); //图片间隔角度\r
const a0 = ref(0); //已旋转角度\r
\r
const posimgs = () => {\r
  for (var i = 0; i < oimages.length; i++) {\r
    oimages[i].style.left =\r
      centerx.value +\r
      r.value * Math.cos(((da.value * i + a0.value) / 180) * Math.PI) +\r
      "px";\r
    oimages[i].style.top =\r
      centery.value +\r
      r.value * Math.sin(((da.value * i + a0.value) / 180) * Math.PI) +\r
      "px";\r
  }\r
};\r
const data = ref([]);\r
const btnClick = (val, index) => {\r
  if (val.index == 0 || val.name == "") {\r
    return;\r
  }\r
\r
  let repeat = 10;\r
  let sd = 0.6;\r
  if (val.index == 1) {\r
    sd = -0.6;\r
  }\r
  if (val.index == -2) {\r
    sd = 1.2;\r
  }\r
  if (val.index == 2) {\r
    sd = -1.2;\r
  }\r
\r
  let timer = setInterval(function () {\r
    if (repeat == 0) {\r
      clearInterval(timer);\r
    } else {\r
      repeat--;\r
\r
      a0.value += sd;\r
      posimgs();\r
    }\r
  }, 100);\r
  data.value.map((item) => {\r
    item.index = 999;\r
  });\r
  data.value[index].index = 0;\r
  data.value[index - 1].index = -1;\r
  data.value[index - 2].index = -2;\r
  data.value[index + 1].index = 1;\r
  data.value[index + 2].index = 2;\r
\r
  year.value = val.name;\r
  emitFun("yearChange", year.value);\r
};\r
\r
onMounted(() => {\r
  window.addEventListener("resize", () => {\r
    if (!main.value?.clientWidth) {\r
      return false;\r
    }\r
    centerx.value = (main.value.clientWidth - 50) / 2;\r
    nextTick(() => {\r
      posimgs();\r
    });\r
  });\r
\r
  for (let index = 0; index < 31; index++) {\r
    data.value.push({\r
      name: "",\r
      index: "999",\r
    });\r
  }\r
  for (let index = 0; index < 29; index++) {\r
    let index2 = 999;\r
    if (index == 12) {\r
      index2 = -2;\r
    }\r
    if (index == 13) {\r
      index2 = -1;\r
    }\r
    if (index == 14) {\r
      index2 = 0;\r
    }\r
    if (index == 15) {\r
      index2 = 1;\r
    }\r
    if (index == 16) {\r
      index2 = 2;\r
    }\r
    data.value.push({\r
      name: new Date().getFullYear() - 14 + index,\r
      index: index2,\r
    });\r
  }\r
\r
  console.log(data.value);\r
\r
  centerx.value = (main.value.clientWidth - 50) / 2;\r
  nextTick(() => {\r
    posimgs();\r
  });\r
});\r
<\/script>\r
\r
<style lang="less" scoped>\r
.main {\r
  height: 90px;\r
  // background: red;\r
  width: 100%;\r
  display: flex;\r
  justify-content: center;\r
  position: relative;\r
  overflow: hidden;\r
\r
  .btn {\r
    font-size: 16px;\r
    font-family: DIN;\r
    font-weight: 500;\r
    color: #fff;\r
    position: absolute;\r
    cursor: pointer;\r
  }\r
  .active {\r
    font-size: 26px;\r
    font-family: DIN;\r
    font-weight: bold;\r
    color: #ffc702;\r
    margin-left: -10px;\r
    margin-top: -5px;\r
  }\r
}\r
</style>\r
`;export{n as default};
