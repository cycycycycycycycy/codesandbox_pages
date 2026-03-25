<template>
  <div class="yearCom">
    <div class="bg">
      <img src="./img/yearBg.png" alt="" />
      <img class="centerBg" src="./img/centerBg.png" alt="" />
      <img class="centerBottom" src="./img/centerBottom.png" alt="" />
    </div>
    <div class="yearItem">
      <div class="content" style="left: 0px" id="content">
        <span
          class="item"
          :class="[
            current == item.index ? 'itemAct' : '',
            returnColor(item.index),
          ]"
          v-for="(item, index) in yearList"
          :key="index"
          @click="change(item, index)"
        >
          {{ current == item.index ? item.nameAct : item.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const emitFun = defineEmits(["yearChange"]);
//近五年

const lastYear = ref(5);
const currentValue = ref("");
const returnColor = (index) => {
  if (index == "-5" || index == "5") {
    return "color3";
  }
  if (index == "-4" || index == "4") {
    return "color5";
  }
};
const change = (item, A) => {
  if (item.index == 0) {
    return;
  }
  let left = document.getElementById("content").style.left;
  currentValue.value = item.value;
  document.getElementById("content").style.left =
    Number(left.substring(0, left.indexOf("px"))) - 100 * item.index + "px";
  yearList.value[A].index = 0;
  for (let index = 1; index < 6; index++) {
    if (yearList.value[A - index]) yearList.value[A - index].index = 0 - index;
  }
  for (let index = 1; index < 6; index++) {
    if (yearList.value[A + index]) yearList.value[A + index].index = 0 + index;
  }
  currentValue.value = item.value;
  emitFun("yearChange", currentValue.value);
};
const current = ref(0);
const yearList = ref([]);
onMounted(() => {
  // let year = new Date().getFullYear();
  let year = new Date().getFullYear() + 1;
  let month = new Date().getMonth() + 1;
  yearList.value.push({
    nameAct: `${year}年${month}月`,
    name: `${month}月`,
    value: `${year}.${month}`,
    index: 0,
  });
  currentValue.value = `${year}.${month}`;
  for (let index = 1; index < month; index++) {
    yearList.value.unshift({
      nameAct: `${year}年${month - index}月`,
      name: `${month - index}月`,
      value: `${year}.${month - index}`,
      index: 0 - index,
    });
  }

  for (let y = 1; y <= lastYear.value; y++) {
    for (let index = 12; index >= 1; index--) {
      yearList.value.unshift({
        nameAct: `${year - y}年${index}月`,
        name: `${index}月`,
        value: `${year - y}.${index}`,
      });
    }
  }

  // console.log(yearList.value);
  //  document.getElementById("content").style.left =
  //   -(yearList.value.length * 100 - 620) + "px";
  // console.log(-(yearList.value.length * 160));
  document.getElementById("content").style.left =
    -((yearList.value.length - 12) * 100 - 620) + "px";
  console.log(-(yearList.value.length * 160));

  change(
    yearList.value[yearList.value.length - 13],
    yearList.value.length - 13
  );
});
</script>

<style lang="less" scoped>
.yearCom {
  height: 110px;
  width: 100%;
  position: relative;
  user-select: none;
  overflow: hidden;
  .bg {
    text-align: center;
    position: relative;
    overflow: hidden;
    .centerBg {
      position: absolute;
      bottom: -15px;
      left: calc(50% - 122px);
    }
    .centerBottom {
      position: absolute;
      bottom: 2px;
      left: calc(50% - 60px);
    }
  }
  .yearItem {
    position: absolute;
    top: 35px;
    left: calc(50% - 600px);
    width: 1200px;
    height: 70px;
    overflow: hidden;
    .content {
      position: absolute;
      height: 70px;
      width: 2000px;
      transition: all 1s;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      width: fit-content;
      .color3 {
        color: rgba(34, 34, 34, 0.3) !important;
      }
      .color5 {
        color: rgba(34, 34, 34, 0.7) !important;
      }
      .item {
        cursor: pointer;
        color: rgb(34, 34, 34);
        font-family: PingFang SC;
        font-size: 26px;
        font-weight: 700;
        line-height: 32px;
        letter-spacing: 0px;
        width: 100px;
        user-select: none;
      }
      .itemAct {
        width: 160px;
        text-align: center;
        margin-right: 50px;
      }
    }
  }
}
</style>
