const n=`<template>\r
  <div class="yearCom">\r
    <div class="bg">\r
      <img src="./img/yearBg.png" alt="" />\r
      <img class="centerBg" src="./img/centerBg.png" alt="" />\r
      <img class="centerBottom" src="./img/centerBottom.png" alt="" />\r
    </div>\r
    <div class="yearItem">\r
      <div class="content" style="left: 0px" id="content">\r
        <span\r
          class="item"\r
          :class="[\r
            current == item.index ? 'itemAct' : '',\r
            returnColor(item.index),\r
          ]"\r
          v-for="(item, index) in yearList"\r
          :key="index"\r
          @click="change(item, index)"\r
        >\r
          {{ current == item.index ? item.nameAct : item.name }}\r
        </span>\r
      </div>\r
    </div>\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref, onMounted } from "vue";\r
const emitFun = defineEmits(["yearChange"]);\r
//近五年\r
\r
const lastYear = ref(5);\r
const currentValue = ref("");\r
const returnColor = (index) => {\r
  if (index == "-5" || index == "5") {\r
    return "color3";\r
  }\r
  if (index == "-4" || index == "4") {\r
    return "color5";\r
  }\r
};\r
const change = (item, A) => {\r
  if (item.index == 0) {\r
    return;\r
  }\r
  let left = document.getElementById("content").style.left;\r
  currentValue.value = item.value;\r
  document.getElementById("content").style.left =\r
    Number(left.substring(0, left.indexOf("px"))) - 100 * item.index + "px";\r
  yearList.value[A].index = 0;\r
  for (let index = 1; index < 6; index++) {\r
    if (yearList.value[A - index]) yearList.value[A - index].index = 0 - index;\r
  }\r
  for (let index = 1; index < 6; index++) {\r
    if (yearList.value[A + index]) yearList.value[A + index].index = 0 + index;\r
  }\r
  currentValue.value = item.value;\r
  emitFun("yearChange", currentValue.value);\r
};\r
const current = ref(0);\r
const yearList = ref([]);\r
onMounted(() => {\r
  // let year = new Date().getFullYear();\r
  let year = new Date().getFullYear() + 1;\r
  let month = new Date().getMonth() + 1;\r
  yearList.value.push({\r
    nameAct: \`\${year}年\${month}月\`,\r
    name: \`\${month}月\`,\r
    value: \`\${year}.\${month}\`,\r
    index: 0,\r
  });\r
  currentValue.value = \`\${year}.\${month}\`;\r
  for (let index = 1; index < month; index++) {\r
    yearList.value.unshift({\r
      nameAct: \`\${year}年\${month - index}月\`,\r
      name: \`\${month - index}月\`,\r
      value: \`\${year}.\${month - index}\`,\r
      index: 0 - index,\r
    });\r
  }\r
\r
  for (let y = 1; y <= lastYear.value; y++) {\r
    for (let index = 12; index >= 1; index--) {\r
      yearList.value.unshift({\r
        nameAct: \`\${year - y}年\${index}月\`,\r
        name: \`\${index}月\`,\r
        value: \`\${year - y}.\${index}\`,\r
      });\r
    }\r
  }\r
\r
  // console.log(yearList.value);\r
  //  document.getElementById("content").style.left =\r
  //   -(yearList.value.length * 100 - 620) + "px";\r
  // console.log(-(yearList.value.length * 160));\r
  document.getElementById("content").style.left =\r
    -((yearList.value.length - 12) * 100 - 620) + "px";\r
  console.log(-(yearList.value.length * 160));\r
\r
  change(\r
    yearList.value[yearList.value.length - 13],\r
    yearList.value.length - 13\r
  );\r
});\r
<\/script>\r
\r
<style lang="less" scoped>\r
.yearCom {\r
  height: 110px;\r
  width: 100%;\r
  position: relative;\r
  user-select: none;\r
  overflow: hidden;\r
  .bg {\r
    text-align: center;\r
    position: relative;\r
    overflow: hidden;\r
    .centerBg {\r
      position: absolute;\r
      bottom: -15px;\r
      left: calc(50% - 122px);\r
    }\r
    .centerBottom {\r
      position: absolute;\r
      bottom: 2px;\r
      left: calc(50% - 60px);\r
    }\r
  }\r
  .yearItem {\r
    position: absolute;\r
    top: 35px;\r
    left: calc(50% - 600px);\r
    width: 1200px;\r
    height: 70px;\r
    overflow: hidden;\r
    .content {\r
      position: absolute;\r
      height: 70px;\r
      width: 2000px;\r
      transition: all 1s;\r
      display: flex;\r
      align-items: center;\r
      flex-wrap: nowrap;\r
      width: fit-content;\r
      .color3 {\r
        color: rgba(34, 34, 34, 0.3) !important;\r
      }\r
      .color5 {\r
        color: rgba(34, 34, 34, 0.7) !important;\r
      }\r
      .item {\r
        cursor: pointer;\r
        color: rgb(34, 34, 34);\r
        font-family: PingFang SC;\r
        font-size: 26px;\r
        font-weight: 700;\r
        line-height: 32px;\r
        letter-spacing: 0px;\r
        width: 100px;\r
        user-select: none;\r
      }\r
      .itemAct {\r
        width: 160px;\r
        text-align: center;\r
        margin-right: 50px;\r
      }\r
    }\r
  }\r
}\r
</style>\r
`;export{n as default};
