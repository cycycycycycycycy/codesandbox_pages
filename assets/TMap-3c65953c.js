const n=`<template>\r
  <div style="width: 80%; height: 80%">\r
    <TMap ref="comTMapRef" :mapOptions="mapOptions" />\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref, onMounted, nextTick } from "vue";\r
//初始化地图\r
const comTMapRef = ref(null); //地图REF\r
const mapOptions = ref({\r
  id: "TMap", //地图 id\r
  zoom: 4, //地图缩放比例\r
  style: { width: "100%", height: "100%", borderRadius: "20px" }, //地图样式\r
  center: [116.385438, 42.9294], //地图中心点\r
  autoPan: true, //弹窗自适应打开\r
  closeButton: true, //弹窗自适应打开\r
  closeOnClick: true, //弹窗关闭按钮\r
  tk: "a125dd9aef36e4cf381a34add119bb01", //天地图token\r
});\r
//区域遮罩\r
onMounted(() => {\r
  //多边形遮罩方法\r
  comTMapRef.value.mapPolygonShadow({\r
    json: "", //json格式，自定义为data，区域编码传空（json格式）\r
    code: "110000", //区域编码\r
    data: [\r
      //自定义\r
      [126.411794, 44.9068],\r
      [126.32969, 42.9294],\r
      [116.385438, 49.9061],\r
      [116.385438, 49.9561],\r
    ],\r
    color: "blue", //线颜色\r
    weight: 3, //线宽\r
    opacity: 1, //透明度\r
    fillColor: "blue", //填充颜色\r
    fillOpacity: 0.2, //填充透明度\r
    outerShadow: false, //外边阴影\r
  });\r
});\r
\r
//标记点\r
import infowinDoc from "./components/dialog.vue"; //弹窗显示组件\r
import icon from "./img/icon.png"; //打点图标\r
onMounted(() => {\r
  //地图打点方法\r
  comTMapRef.value.mapPoint({\r
    iconUrl: icon, //打点图标\r
    point: [116.385438, 39.9294], //打点坐标\r
    click: (val, openWindow) => {\r
      //（返回值、返回打开弹窗方法）\r
      console.log("click", val);\r
      openWindow(infowinDoc, { content: "点击的内容" }); //（弹窗组件、传入参数）\r
    },\r
    mouseover: (val, openWindow) => {\r
      console.log("mouseover", val);\r
      openWindow(infowinDoc, { content: "移入的内容" }); //（弹窗组件、传入参数）\r
    },\r
  });\r
});\r
//标签\r
onMounted(() => {\r
  //文字标签方法\r
  comTMapRef.value.mapLabel({\r
    latlng: [116.420837, 39.952395], //	标签位置\r
    text: \`我是天地图组件\`, //显示文字\r
    offset: [0, 0], //偏移量\r
  });\r
});\r
\r
//多边形区域\r
onMounted(() => {\r
  //多边形方法\r
  comTMapRef.value.mapPolygon({\r
    color: "red", //线颜色\r
    weight: 3, //线宽\r
    opacity: 0.5, //透明度\r
    fillColor: "#FFFFFF", //填充颜色\r
    fillOpacity: 0.5, //填充透明度\r
    data: [\r
      //多边形点数据\r
      [126.411794, 39.9068],\r
      [126.32969, 42.9294],\r
      [116.385438, 39.9061],\r
      [116.385438, 39.9561],\r
    ],\r
    click: (val, openWindow) => {\r
      console.log("click", val);\r
      openWindow(infowinDoc, { content: "点击的内容" });\r
    },\r
    // mouseover: (val, openWindow) => {\r
    //   console.log("mouseover", val);\r
    //   openWindow(infowinDoc, { content: "移入的内容" });\r
    // },\r
  });\r
});\r
<\/script>\r
\r
<style lang="less" scoped></style>\r
`;export{n as default};
