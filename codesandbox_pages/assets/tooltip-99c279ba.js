const r=`\r
 <!-- /**\r
 * @File 文字超出toolTip组件\r
 * @Type components\r
 * @Author chen_yu\r
 * @Date 2023-08-05 16:48:39\r
 * @Version 1.0\r
 * \r
 * @Params \r
 * \r
 * @Description\r
 * 使用页面基础配置\r
 * 1.页面中引入 \r
   import Tooltip from "此文件地址";\r
 * 2.页面中使用  \r
    <Tooltip\r
      :width="内容显示的宽度"\r
      :content="显示的内容"\r
    ></Tooltip>\r
 * \r
 * \r
 * @returns \r
 */ -->\r
<template>\r
  <div class="text-tooltip">\r
    <el-tooltip\r
      class="item"\r
      effect="dark"\r
      :disabled="isShowTooltip"\r
      :content="content"\r
      placement="top"\r
      :open-delay="300"\r
    >\r
      <p class="over-flow" :class="className" @mouseover="onMouseOver()">\r
        <span ref="refName">{{ content || "-" }}</span>\r
      </p>\r
    </el-tooltip>\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref } from "vue";\r
const props = defineProps({\r
  //宽度\r
  width: {\r
    type: String,\r
    default: () => {\r
      return "200";\r
    },\r
  },\r
  // 显示的文字内容\r
  content: {\r
    type: String,\r
    default: () => {\r
      return "";\r
    },\r
  },\r
  // 外层框的样式，在传入的这个类名中设置文字显示的宽度\r
  className: {\r
    type: String,\r
    default: () => {\r
      return "";\r
    },\r
  },\r
  // 为页面文字标识（如在同一页面中调用多次组件，此参数不可重复）\r
  refName: {\r
    type: String,\r
    default: () => {\r
      return "";\r
    },\r
  },\r
});\r
const width = props.width + "px";\r
const isShowTooltip = ref(true);\r
\r
const refName = ref(null);\r
const onMouseOver = () => {\r
  let parentWidth = refName.value.parentNode.offsetWidth;\r
  let contentWidth = refName.value.offsetWidth;\r
  // 判断是否开启tooltip功能\r
  if (contentWidth > parentWidth) {\r
    isShowTooltip.value = false;\r
  } else {\r
    isShowTooltip.value = true;\r
  }\r
};\r
<\/script>\r
\r
<style lang="less" scoped>\r
.over-flow {\r
  overflow: hidden;\r
  white-space: nowrap;\r
  text-overflow: ellipsis;\r
}\r
.text-tooltip {\r
  overflow: hidden;\r
  white-space: nowrap;\r
  text-overflow: ellipsis;\r
  max-width: v-bind(width);\r
}\r
p {\r
  margin: 0;\r
}\r
</style>\r
<style lang="less">\r
.el-popper.is-dark {\r
  max-width: 500px !important;\r
}\r
</style>\r
`;export{r as default};
