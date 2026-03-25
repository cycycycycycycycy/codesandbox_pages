const n=`<template>\r
  <div\r
    style="\r
      width: 70%;\r
      height: 70%;\r
      background-color: #fff;\r
      border-radius: 20px;\r
      display: flex;\r
      flex-direction: column;\r
      align-items: center;\r
      justify-content: center;\r
    "\r
  >\r
    <h1>nowDate: {{ nowDate }}</h1>\r
    <timeLine v-model="nowDate" :number="7" :backToday="true" />\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref, onMounted } from "vue";\r
import timeLine from "./components/timeLine.vue";\r
const nowDate = ref("");\r
<\/script>\r
\r
<style lang="less" scoped></style>\r
`;export{n as default};
