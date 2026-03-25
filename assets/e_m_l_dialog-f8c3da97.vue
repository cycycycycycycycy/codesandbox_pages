<template>
  <div class="comClass222">
    <comBorderBg>
      <div class="header">{{ props.year }}年-{{ props.name }}</div>
      <el-table
        :data="AAAA"
        max-height="250px"
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center', height: '42px' }"
        :cell-style="{ textAlign: 'center', height: '42px' }"
      >
        <el-table-column prop="breedsName" label="品种名称" width="width">
        </el-table-column>
        <el-table-column
          prop="deliverAmount"
          label="调运量（万吨）"
          width="width"
        >
        </el-table-column>
      </el-table>
    </comBorderBg>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import comBorderBg from "./comBorderBg";
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  year: {
    type: String,
    default: "",
  },
  tableData: {
    type: Array,
    default: [],
  },
});
const AAAA = ref([]);
const lxdATA = (data) => {
  AAAA.value = JSON.parse(data);
};
onMounted(() => {
  console.log(props.tableData);
  lxdATA(props.tableData);
});
watch(
  props,
  (newValue, oldValue) => {
    console.log("newValue", newValue, "oldValue", oldValue);
    lxdATA(props.tableData);
  },
  {
    deep: true,
  }
);
</script>

<style lang="less" scoped>
.comClass222 {
  width: 100%;
  height: 100%;
  position: relative;
  .btn {
    position: absolute;
    right: 0;
    top: 0px;
    z-index: 500;
  }
  .header {
    height: 35px;
    padding-left: 40px;
    color: #fff;
    width: 100%;
    display: flex;
    align-items: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #ffffff;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  .btnChange {
    display: flex;
    width: calc(100% - 40px);
    margin-top: 10px;
    margin-bottom: 10px;
    margin: 0 20px;
    z-index: 9999;
    position: absolute;
    top: 35px;
    left: 0;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    .btnChangeItem {
      padding: 5px 0;
      margin: 0 20px;
      font-size: 14px;
      cursor: pointer;
      color: rgba(141, 153, 195, 1);
    }
    .btnChangeItem_c {
      padding: 5px 0;
      margin: 0 20px;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
    }
    .btnChangeItem_c {
      position: relative; /* 添加相对定位 */
    }
    .btnChangeItem_c::after {
      width: 30px;
      content: ""; /* 创建伪元素 */
      position: absolute; /* 绝对定位 */
      left: 0px; /* 左对齐 */
      right: 0; /* 右对齐 */
      bottom: -2px; /* 下移2px */
      height: 2px; /* 高度为2px */
      background-color: rgba(254, 134, 16, 1); /* 下划线颜色 */
    }
  }
  #ndzzjhjlsqk {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    height: calc(100% - 50px);
    z-index: 2;
  }
  #ndzzjhjlsqk2 {
    position: absolute;
    top: 40px;
    z-index: 1;
    left: 0;
    width: 100%;
    height: calc(100% - 50px);
  }
  .danwei {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 12px;
    color: rgba(141, 153, 195, 1);
  }
}
</style>
<style lang="less">
.comClass222 {
  .el-table {
    background: rgba(0, 0, 0, 0.4);
    --el-table-border-color: transparent !important;
    tr {
      background: transparent;
    }

    .cell {
      padding: 0 5px;
    }
  }

  .el-table__header {
    .el-table__cell {
      background: rgba(93, 150, 255, 0);
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #ffffff;
    }
  }

  .el-table__body {
    .el-table__cell {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #c2d2e4;
    }
  }

  // .firstrow {
  //   background: rgba(29, 38, 71, 1) !important;

  //   & > td:first-child::before {
  //     content: ""; /* 伪元素必须设置 content 属性，即使它是空的 */
  //     position: absolute; /* 绝对定位相对于最近的已定位祖先元素 */
  //     top: 0; /* 线条位于 .firstrow 的顶部 */
  //     left: 0; /* 线条从左侧开始 */
  //     width: 2px; /* 线条宽度与 .firstrow 相同 */
  //     height: 100%; /* 线条高度，根据需要调整 */
  //     background-color: #5dc0ff; /* 线条颜色为蓝色 */
  //   }

  //   .el-table__cell {
  //     color: #5dc0ff !important;
  //   }
  // }

  .rowbg {
    background: rgba(29, 38, 71, 0.3) !important;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background: #375a99;
  }

  .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border-bottom: unset;
  }
  .el-table__row:nth-child(2n) {
    background: rgba(93, 150, 255, 0.2) !important;
    .el-table__cell {
      color: #fff !important;
    }
  }
}
</style>
