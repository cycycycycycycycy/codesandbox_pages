const n=`<template>\r
  <div>{{ content }}</div>\r
</template>\r
\r
<script setup>\r
import { ref, onMounted } from "vue";\r
const props = defineProps({\r
  content: {\r
    type: String,\r
    default: "",\r
  },\r
});\r
<\/script>\r
\r
<style lang="less" scoped></style>\r
`;export{n as default};
