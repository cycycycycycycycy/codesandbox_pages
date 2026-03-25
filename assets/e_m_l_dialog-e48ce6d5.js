const n=`<template>\r
  <div class="comClass222">\r
    <comBorderBg>\r
      <div class="header">{{ props.year }}年-{{ props.name }}</div>\r
      <el-table\r
        :data="AAAA"\r
        max-height="250px"\r
        style="width: 100%"\r
        :header-cell-style="{ textAlign: 'center', height: '42px' }"\r
        :cell-style="{ textAlign: 'center', height: '42px' }"\r
      >\r
        <el-table-column prop="breedsName" label="品种名称" width="width">\r
        </el-table-column>\r
        <el-table-column\r
          prop="deliverAmount"\r
          label="调运量（万吨）"\r
          width="width"\r
        >\r
        </el-table-column>\r
      </el-table>\r
    </comBorderBg>\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref, onMounted, nextTick, watch } from "vue";\r
import comBorderBg from "./comBorderBg";\r
const props = defineProps({\r
  name: {\r
    type: String,\r
    default: "",\r
  },\r
  year: {\r
    type: String,\r
    default: "",\r
  },\r
  tableData: {\r
    type: Array,\r
    default: [],\r
  },\r
});\r
const AAAA = ref([]);\r
const lxdATA = (data) => {\r
  AAAA.value = JSON.parse(data);\r
};\r
onMounted(() => {\r
  console.log(props.tableData);\r
  lxdATA(props.tableData);\r
});\r
watch(\r
  props,\r
  (newValue, oldValue) => {\r
    console.log("newValue", newValue, "oldValue", oldValue);\r
    lxdATA(props.tableData);\r
  },\r
  {\r
    deep: true,\r
  }\r
);\r
<\/script>\r
\r
<style lang="less" scoped>\r
.comClass222 {\r
  width: 100%;\r
  height: 100%;\r
  position: relative;\r
  .btn {\r
    position: absolute;\r
    right: 0;\r
    top: 0px;\r
    z-index: 500;\r
  }\r
  .header {\r
    height: 35px;\r
    padding-left: 40px;\r
    color: #fff;\r
    width: 100%;\r
    display: flex;\r
    align-items: center;\r
    font-family: PingFangSC, PingFang SC;\r
    font-weight: 400;\r
    font-size: 16px;\r
    color: #ffffff;\r
    text-align: left;\r
    font-style: normal;\r
    text-transform: none;\r
  }\r
  .btnChange {\r
    display: flex;\r
    width: calc(100% - 40px);\r
    margin-top: 10px;\r
    margin-bottom: 10px;\r
    margin: 0 20px;\r
    z-index: 9999;\r
    position: absolute;\r
    top: 35px;\r
    left: 0;\r
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);\r
    .btnChangeItem {\r
      padding: 5px 0;\r
      margin: 0 20px;\r
      font-size: 14px;\r
      cursor: pointer;\r
      color: rgba(141, 153, 195, 1);\r
    }\r
    .btnChangeItem_c {\r
      padding: 5px 0;\r
      margin: 0 20px;\r
      font-size: 14px;\r
      color: #fff;\r
      cursor: pointer;\r
    }\r
    .btnChangeItem_c {\r
      position: relative; /* 添加相对定位 */\r
    }\r
    .btnChangeItem_c::after {\r
      width: 30px;\r
      content: ""; /* 创建伪元素 */\r
      position: absolute; /* 绝对定位 */\r
      left: 0px; /* 左对齐 */\r
      right: 0; /* 右对齐 */\r
      bottom: -2px; /* 下移2px */\r
      height: 2px; /* 高度为2px */\r
      background-color: rgba(254, 134, 16, 1); /* 下划线颜色 */\r
    }\r
  }\r
  #ndzzjhjlsqk {\r
    position: absolute;\r
    top: 40px;\r
    left: 0;\r
    width: 100%;\r
    height: calc(100% - 50px);\r
    z-index: 2;\r
  }\r
  #ndzzjhjlsqk2 {\r
    position: absolute;\r
    top: 40px;\r
    z-index: 1;\r
    left: 0;\r
    width: 100%;\r
    height: calc(100% - 50px);\r
  }\r
  .danwei {\r
    position: absolute;\r
    top: 20px;\r
    right: 20px;\r
    font-size: 12px;\r
    color: rgba(141, 153, 195, 1);\r
  }\r
}\r
</style>\r
<style lang="less">\r
.comClass222 {\r
  .el-table {\r
    background: rgba(0, 0, 0, 0.4);\r
    --el-table-border-color: transparent !important;\r
    tr {\r
      background: transparent;\r
    }\r
\r
    .cell {\r
      padding: 0 5px;\r
    }\r
  }\r
\r
  .el-table__header {\r
    .el-table__cell {\r
      background: rgba(93, 150, 255, 0);\r
      font-family: PingFangSC, PingFang SC;\r
      font-weight: 400;\r
      font-size: 14px;\r
      color: #ffffff;\r
    }\r
  }\r
\r
  .el-table__body {\r
    .el-table__cell {\r
      font-family: PingFangSC, PingFang SC;\r
      font-weight: 400;\r
      font-size: 14px;\r
      color: #c2d2e4;\r
    }\r
  }\r
\r
  // .firstrow {\r
  //   background: rgba(29, 38, 71, 1) !important;\r
\r
  //   & > td:first-child::before {\r
  //     content: ""; /* 伪元素必须设置 content 属性，即使它是空的 */\r
  //     position: absolute; /* 绝对定位相对于最近的已定位祖先元素 */\r
  //     top: 0; /* 线条位于 .firstrow 的顶部 */\r
  //     left: 0; /* 线条从左侧开始 */\r
  //     width: 2px; /* 线条宽度与 .firstrow 相同 */\r
  //     height: 100%; /* 线条高度，根据需要调整 */\r
  //     background-color: #5dc0ff; /* 线条颜色为蓝色 */\r
  //   }\r
\r
  //   .el-table__cell {\r
  //     color: #5dc0ff !important;\r
  //   }\r
  // }\r
\r
  .rowbg {\r
    background: rgba(29, 38, 71, 0.3) !important;\r
  }\r
\r
  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {\r
    background: #375a99;\r
  }\r
\r
  .el-table td.el-table__cell,\r
  .el-table th.el-table__cell.is-leaf {\r
    border-bottom: unset;\r
  }\r
  .el-table__row:nth-child(2n) {\r
    background: rgba(93, 150, 255, 0.2) !important;\r
    .el-table__cell {\r
      color: #fff !important;\r
    }\r
  }\r
}\r
</style>\r
`;export{n as default};
