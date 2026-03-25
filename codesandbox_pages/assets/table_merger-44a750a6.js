const n=`<template>\r
  <div>\r
    <el-table\r
      :data="tableData"\r
      style="width: 100%"\r
      border\r
      :span-method="\r
        (data) => {\r
          return objectSpanMethod(data, pooledData);\r
        }\r
      "\r
    >\r
      <el-table-column prop="name" label="Name" />\r
      <el-table-column prop="age" label="Age" />\r
      <el-table-column prop="address" label="Address" />\r
      <el-table-column prop="hobby" label="Hobby" />\r
      <el-table-column prop="sex" label="Sex" />\r
      <el-table-column prop="phone" label="Phone" />\r
    </el-table>\r
  </div>\r
</template>\r
\r
<script setup>\r
import { getSpanData, objectSpanMethod } from "./js/formMerger.js";\r
import { ref, onMounted } from "vue";\r
const tableData = ref([\r
  {\r
    name: "John",\r
    age: 18,\r
    address: "123 Main St",\r
    hobby: "Reading",\r
    sex: "Male",\r
    phone: "1234567890",\r
  },\r
  {\r
    name: "John",\r
    age: 18,\r
    address: "123 Main St",\r
    hobby: "Reading",\r
    sex: "Male",\r
    phone: "1234567890",\r
  },\r
  {\r
    name: "Jane",\r
    age: 20,\r
    address: "456 Elm St",\r
    hobby: "Reading",\r
    sex: "Female",\r
    phone: "1234567890",\r
  },\r
  {\r
    name: "Jim",\r
    age: 22,\r
    address: "789 Oak St",\r
    hobby: "Reading",\r
    sex: "Male",\r
    phone: "1234567890",\r
  },\r
  {\r
    name: "Jill",\r
    age: 24,\r
    address: "101 Pine St",\r
    hobby: "Reading",\r
    sex: "Female",\r
    phone: "1234567890",\r
  },\r
]);\r
const pooledData = ref({});\r
onMounted(() => {\r
  pooledData.value = getSpanData(["name"], tableData.value);\r
});\r
<\/script>\r
\r
<style lang="less" scoped></style>\r
`;export{n as default};
