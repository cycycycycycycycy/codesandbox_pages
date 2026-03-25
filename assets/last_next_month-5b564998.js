const t=`<template>\r
  <div style="width: 50%; height: 40%; padding: 50px; background-color: #fff">\r
    <last_next_month v-model="selectedMonth" />\r
    <div style="margin-top: 20px">已选择月份：{{ selectedMonth }}</div>\r
  </div>\r
</template>\r
\r
<script setup>\r
import last_next_month from "./components/index.vue";\r
import { ref, onMounted } from "vue";\r
\r
const selectedMonth = ref("");\r
<\/script>\r
\r
<style lang="less" scoped></style>\r
`;export{t as default};
