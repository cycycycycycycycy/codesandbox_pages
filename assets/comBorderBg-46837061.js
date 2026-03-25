const n=`<template>\r
  <div class="smallDiv">\r
    <div class="header"></div>\r
    <div style="height: 100%; width: 100%">\r
      <slot></slot>\r
    </div>\r
    <!-- <div class="footer"></div> -->\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref, onMounted } from "vue";\r
\r
const props = defineProps({\r
  title: String,\r
});\r
<\/script>\r
\r
<style lang="less" scoped>\r
.smallDiv {\r
  box-sizing: border-box;\r
  width: 100%;\r
  height: 100%;\r
  .header {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    z-index: -1;\r
    height: 35px;\r
    display: flex;\r
    align-items: center;\r
    justify-content: space-between;\r
    background: url("../img/headerCom.png") no-repeat;\r
    background-size: 100% 100%;\r
    width: 300px;\r
    .title {\r
      display: flex;\r
      align-items: center;\r
      padding-left: 30px;\r
      font-size: 20px;\r
      color: #fff;\r
      font-family: PingFangSC, PingFang SC;\r
      font-weight: 400;\r
      font-size: 16px;\r
      color: #ffffff;\r
    }\r
  }\r
  .footer {\r
    background: url("../img/commonFooterBg.png") no-repeat;\r
    background-size: 100% 100%;\r
    margin-left: 16px;\r
    height: 7px;\r
  }\r
}\r
</style>\r
`;export{n as default};
