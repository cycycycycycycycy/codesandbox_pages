const n=`<template>\r
  <div class="box">\r
    <Tooltip\r
      :width="200"\r
      :content="'我是超长的文字你一眼看不到我的尾巴哈哈哈后边还有呢继续看吧我是超长的文字你一眼看不到我的尾巴哈哈哈后边还有呢继续看吧我是超长的文字你一眼看不到我的尾巴哈哈哈后边还有呢继续看吧我是超长的文字你一眼看不到我的尾巴哈哈哈后边还有呢继续看吧'"\r
    ></Tooltip>\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref, onMounted } from "vue";\r
import Tooltip from "./components/tooltip.vue";\r
<\/script>\r
\r
<style lang="less" scoped>\r
.box {\r
  background-color: #fff;\r
  width: 600px;\r
  height: 200px;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
}\r
</style>\r
`;export{n as default};
