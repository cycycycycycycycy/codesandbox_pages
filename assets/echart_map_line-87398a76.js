const r=`<template>\r
  <div class="centerMap">\r
    <div id="centerMapA"></div>\r
    <div id="centerMapB"></div>\r
  </div>\r
  <Dialog\r
    v-if="showDialog"\r
    style="\r
      position: absolute;\r
      bottom: 420px;\r
      right: 50px;\r
      width: 300px;\r
      height: fit-content;\r
      z-index: 99999;\r
      background-color: #161c43;\r
      border-radius: 10px;\r
    "\r
    :tableData="dialogTableData"\r
    :year="Parmas.year"\r
    :name="dialogName"\r
  />\r
</template>\r
\r
<script setup>\r
import { ref, onMounted, onUnmounted, nextTick } from "vue";\r
import china from "@/json/china.json";\r
import { ElMessage } from "element-plus";\r
import mapBackgroundImgSrc from "./img/mapBackgroundImg.png";\r
import mapBackgroundImgSrc2 from "./img/mapback4.png";\r
import * as echarts from "echarts";\r
import userInfo from "@/store/userInfo/userInfo.js";\r
import Dialog from "./components/e_m_l_dialog.vue";\r
import jdicon from "./img/jidiicon.png";\r
const UserInfo = userInfo();\r
const showDialog = ref(false);\r
const dialogTableData = ref([]);\r
const dialogName = ref("");\r
const mapBackgroundImg = new Image();\r
const Parmas = ref({\r
  year: "2025",\r
});\r
mapBackgroundImg.src = mapBackgroundImgSrc;\r
const mapBackgroundImg2 = new Image();\r
mapBackgroundImg2.src = mapBackgroundImgSrc2;\r
\r
const initEchartMap = (geoCoordMap, BJData, Data, points) => {\r
  echarts.registerMap("china", china);\r
\r
  var chartDom = document.getElementById("centerMapA");\r
  var myChart = echarts.init(chartDom);\r
  var option;\r
  console.log(geoCoordMap, BJData);\r
\r
  // const geoCoordMap = {\r
  //     '上海': [121.4648, 31.2891],\r
  //     '东莞': [113.8953, 22.901],\r
  //     '东营': [118.7073, 37.5513],\r
  //     '中山': [113.4229, 22.478],\r
  //     '北京': [116.4551, 40.2539]\r
  // };\r
\r
  // const BJData = [\r
  //     [{ name: '北京' }, { name: '上海', value: 95 }],\r
  //     [{ name: '北京' }, { name: '东莞', value: 90 }],\r
  //     [{ name: '北京' }, { name: '东营', value: 80 }],\r
  //     [{ name: '北京' }, { name: '中山', value: 70 }]\r
  // ];\r
\r
  const convertData = function (data) {\r
    var res = [];\r
    for (var i = 0; i < data.length; i++) {\r
      var dataItem = data[i];\r
      var fromCoord = geoCoordMap[dataItem[0].name];\r
      var toCoord = geoCoordMap[dataItem[1].name];\r
      if (fromCoord && toCoord) {\r
        res.push({\r
          coords: [fromCoord, toCoord],\r
          value: dataItem[1].value,\r
        });\r
      }\r
    }\r
    return res;\r
  };\r
\r
  option = {\r
    tooltip: {\r
      show: false,\r
      trigger: "item",\r
      formatter: function (params) {\r
        if (params.seriesType === "effectScatter" && params.name !== "奇台县") {\r
          return \`\${params.name}: \${params.value[2]} 万吨\`;\r
        }\r
        return "";\r
      },\r
    },\r
    geo: {\r
      map: "china",\r
\r
      roam: true,\r
      type: "map",\r
      roam: false,\r
      selectedMode: false,\r
      zoom: 1,\r
      roam: false,\r
      itemStyle: {\r
        borderColor: "RGBA(92, 105, 181, 1)",\r
        borderWidth: 2,\r
        type: "pattern",\r
\r
        shadowColor: "RGBA(35, 19, 181, 0.7)",\r
        shadowOffsetX: 6,\r
        shadowOffsetY: 12,\r
      },\r
      emphasis: {\r
        disabled: true,\r
      },\r
    },\r
    series: [\r
      {\r
        name: "北京 Top10",\r
        type: "lines",\r
        zlevel: 1,\r
        effect: {\r
          show: true,\r
          period: 6,\r
          trailLength: 0.7,\r
\r
          symbolSize: 3,\r
        },\r
        lineStyle: {\r
          normal: {\r
            color: "yellow",\r
            width: 0,\r
            curveness: 0.2,\r
          },\r
        },\r
        data: convertData(BJData),\r
      },\r
      {\r
        name: "北京 Top10",\r
        type: "lines",\r
        zlevel: 2,\r
        symbol: ["none", "arrow"],\r
        symbolSize: 10,\r
        effect: {\r
          show: false,\r
          period: 6,\r
          trailLength: 0,\r
          symbol: "arrow",\r
          symbolSize: 15,\r
        },\r
        lineStyle: {\r
          normal: {\r
            color: "yellow",\r
            width: 1,\r
            opacity: 0.6,\r
            curveness: 0.2,\r
          },\r
        },\r
        data: convertData(BJData),\r
      },\r
      {\r
        name: "北京 Top10",\r
        type: "effectScatter",\r
        coordinateSystem: "geo",\r
        zlevel: 2,\r
        rippleEffect: {\r
          brushType: "stroke",\r
        },\r
        label: {\r
          normal: {\r
            show: true,\r
            position: "right",\r
            formatter: "{b}",\r
            fontSize: 20,\r
          },\r
        },\r
        symbolSize: function (val) {\r
          return val[2] / 8;\r
        },\r
        itemStyle: {\r
          normal: {\r
            color: "#70ffc4",\r
          },\r
        },\r
        data: BJData.map(function (dataItem) {\r
          return {\r
            name: dataItem[1].name,\r
            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value]),\r
          };\r
        }),\r
      },\r
      {\r
        name: "起始点",\r
        type: "effectScatter",\r
        coordinateSystem: "geo",\r
        zlevel: 2,\r
        rippleEffect: {\r
          brushType: "stroke",\r
        },\r
        label: {\r
          normal: {\r
            show: true,\r
            position: "right",\r
            formatter: "{b}",\r
            fontSize: 20,\r
          },\r
        },\r
        symbolSize: 8,\r
        itemStyle: {\r
          normal: {\r
            color: "#70ffc4",\r
          },\r
        },\r
        data: [\r
          {\r
            name: "北京",\r
            value: geoCoordMap["北京"],\r
          },\r
        ],\r
      },\r
      {\r
        selectedMode: false,\r
        type: "map",\r
        map: "china",\r
        zoom: 1,\r
        roam: false,\r
        itemStyle: {\r
          borderColor: "RGBA(92, 105, 181, 1)",\r
          borderWidth: 1,\r
          areaColor: {\r
            image: mapBackgroundImg,\r
            repeat: "repeat",\r
          },\r
        },\r
        emphasis: {\r
          disabled: true,\r
        },\r
        data: Data,\r
      },\r
      {\r
        name: "Points",\r
        type: "scatter",\r
        coordinateSystem: "geo",\r
        data: points,\r
        symbol: \`image://\${jdicon}\`,\r
        symbolSize: 100,\r
      },\r
    ],\r
  };\r
  myChart.on("click", (params) => {\r
    console.log(params);\r
    if (params.seriesType === "scatter") {\r
      console.log(params.data);\r
\r
      alert(params.data.name + "经纬度是：" + params.data.value);\r
    }\r
    if (params.componentSubType == "effectScatter" && params.name != "奇台县") {\r
      showDialog.value = true;\r
      dialogTableData.value = params.data.value[2] ? params.data.value[2] : [];\r
      dialogName.value = params.name;\r
    } else {\r
      showDialog.value = false;\r
      dialogTableData.value = [];\r
      dialogName.value = "";\r
    }\r
  });\r
\r
  window.onresize = () => {\r
    myChart.resize();\r
  };\r
  option && myChart.setOption(option);\r
};\r
const initEchartMap2 = (geoCoordMap, BJData) => {\r
  echarts.registerMap("china", china);\r
\r
  var chartDom = document.getElementById("centerMapB");\r
  var myChart = echarts.init(chartDom);\r
  var option;\r
\r
  option = {\r
    geo: {\r
      map: "china",\r
\r
      roam: true,\r
      type: "map",\r
      roam: false,\r
      selectedMode: false,\r
      zoom: 1,\r
      roam: false,\r
      itemStyle: {\r
        borderColor: "#000",\r
        borderWidth: 0,\r
        type: "pattern",\r
        areaColor: "#000",\r
        shadowColor: "#000",\r
        shadowOffsetX: 0,\r
        shadowOffsetY: 0,\r
      },\r
      emphasis: {\r
        disabled: true,\r
      },\r
    },\r
    series: [\r
      {\r
        selectedMode: false,\r
        type: "map",\r
        map: "china",\r
        zoom: 1,\r
        roam: false,\r
        itemStyle: {\r
          borderColor: "#000",\r
          borderWidth: 1,\r
          areaColor: {\r
            repeat: "repeat",\r
          },\r
        },\r
        emphasis: {\r
          disabled: true,\r
        },\r
      },\r
    ],\r
  };\r
\r
  window.onresize = () => {\r
    myChart.resize();\r
  };\r
  option && myChart.setOption(option);\r
};\r
const apiFun = () => {\r
  nextTick(() => {\r
    mapInit(\r
      [\r
        {\r
          DELIVER: "652325",\r
          RECEIPT: "710500",\r
          NUM: "外调",\r
        },\r
        {\r
          DELIVER: "710500",\r
          RECEIPT: "210000",\r
          NUM: 3,\r
        },\r
        {\r
          DELIVER: "710500",\r
          RECEIPT: "120000",\r
          NUM: 20,\r
        },\r
        {\r
          DELIVER: "710500",\r
          RECEIPT: "520000",\r
          NUM: 20,\r
        },\r
      ],\r
      [\r
        {\r
          name: "新疆维吾尔自治区",\r
          value: 800,\r
          itemStyle: {\r
            normal: {\r
              areaColor: {\r
                image: mapBackgroundImg2,\r
                repeat: "repeat",\r
              },\r
              borderColor: "RGBA(235, 226, 129, 1)",\r
              shadowOffsetX: 2,\r
              shadowOffsetY: 12,\r
              type: "pattern",\r
            },\r
          },\r
        },\r
        {\r
          name: "河北省",\r
          value: Math.round(Math.random() * 1000),\r
          itemStyle: {\r
            normal: {\r
              areaColor: "rgba(72, 87, 155, 0.9)",\r
              borderColor: "#fff",\r
              borderWidth: 2,\r
            },\r
          },\r
        },\r
        {\r
          name: "天津市",\r
          value: Math.round(Math.random() * 1000),\r
          itemStyle: {\r
            normal: {\r
              areaColor: "rgba(72, 87, 155, 0.9)",\r
              borderColor: "#fff",\r
              borderWidth: 2,\r
            },\r
          },\r
        },\r
        {\r
          name: "贵州省",\r
          value: Math.round(Math.random() * 1000),\r
          itemStyle: {\r
            normal: {\r
              areaColor: "rgba(72, 87, 155, 0.9)",\r
              borderColor: "#fff",\r
              borderWidth: 2,\r
            },\r
          },\r
        },\r
      ]\r
    );\r
  });\r
};\r
const mapInit = (res, Data) => {\r
  if (UserInfo.mapTrue == "1") {\r
    let jsonMap = UserInfo.mapObj;\r
    jsonMap[710000] = {\r
      properties: {\r
        name: "新疆建设兵团",\r
        center: [82.06764799999996, 44.886896],\r
      },\r
    };\r
    jsonMap[710500] = {\r
      properties: {\r
        name: "奇台县",\r
        center: [89.5934299999999, 44.01123000000001],\r
      },\r
    };\r
    jsonMap[710501] = {\r
      properties: {\r
        name: "八十一团",\r
        center: [81.69665336608888, 45.01524131470915],\r
      },\r
    };\r
    jsonMap[710502] = {\r
      properties: {\r
        name: "八十三团",\r
        center: [81.69665336608888, 45.01524131470915],\r
      },\r
    };\r
    jsonMap[710503] = {\r
      properties: {\r
        name: "八十四团",\r
        center: [81.69665336608888, 45.01524131470915],\r
      },\r
    };\r
    jsonMap[710504] = {\r
      properties: {\r
        name: "八十六团",\r
        center: [81.69665336608888, 45.01524131470915],\r
      },\r
    };\r
    jsonMap[710505] = {\r
      properties: {\r
        name: "八十七团",\r
        center: [81.69665336608888, 45.01524131470915],\r
      },\r
    };\r
    jsonMap[710506] = {\r
      properties: {\r
        name: "八十八团",\r
        center: [81.69665336608888, 45.01524131470915],\r
      },\r
    };\r
    jsonMap[710507] = {\r
      properties: {\r
        name: "八十九团",\r
        center: [81.69665336608888, 45.01524131470915],\r
      },\r
    };\r
    jsonMap[710508] = {\r
      properties: {\r
        name: "九十团",\r
        center: [81.69665336608888, 45.01524131470915],\r
      },\r
    };\r
    jsonMap[710509] = {\r
      properties: {\r
        name: "九十一团",\r
        center: [81.69665336608888, 45.01524131470915],\r
      },\r
    };\r
    jsonMap[710510] = {\r
      properties: {\r
        name: "双河市",\r
        center: [81.69665336608888, 45.01524131470915],\r
      },\r
    };\r
    const geoCoordMap = {};\r
    const BJData = [];\r
    res.map((item) => {\r
      if (item.DELIVER) {\r
        console.log(444444444, item.DELIVER);\r
\r
        console.log(444444444, jsonMap[item.DELIVER]);\r
\r
        let obj1 = jsonMap[item.DELIVER].properties;\r
        geoCoordMap[obj1.name] = obj1.center;\r
      }\r
      if (item.RECEIPT) {\r
        let obj2 = jsonMap[item.RECEIPT].properties;\r
        geoCoordMap[obj2.name] = obj2.center;\r
      }\r
      if (item.NUM && item.RECEIPT && item.DELIVER) {\r
        BJData.push([\r
          { name: jsonMap[item.DELIVER].properties.name },\r
          { name: jsonMap[item.RECEIPT].properties.name, value: item.NUM },\r
        ]);\r
      }\r
    });\r
\r
    const points = [\r
      {\r
        name: "塔塔尔乡制种基地",\r
        value: [99.51407, 44.0725],\r
      },\r
      {\r
        name: "西地镇制种基地",\r
        value: [89.73849, 46.07314],\r
      },\r
      {\r
        name: "老奇台镇制种基地",\r
        value: [89.90408, 47.84216],\r
      },\r
      {\r
        name: "碧流河镇制种基地",\r
        value: [89.03609, 43.89298],\r
      },\r
      {\r
        name: "东湾镇制种基地",\r
        value: [89.31677, 40.85966],\r
      },\r
      {\r
        name: "古城乡制种基地",\r
        value: [89.63286, 43.18679],\r
      },\r
      {\r
        name: "吉布库镇制种基地",\r
        value: [89.41102, 43.82416],\r
      },\r
    ];\r
    initEchartMap(geoCoordMap, BJData, Data, points);\r
    initEchartMap2(geoCoordMap, BJData);\r
  } else {\r
    setTimeout(() => {\r
      mapInit(res, Data);\r
    }, 1000);\r
  }\r
};\r
onMounted(() => {\r
  setTimeout(() => {\r
    apiFun();\r
  }, 200);\r
});\r
<\/script>\r
\r
<style lang="less" scoped>\r
.centerMap {\r
  width: 900px;\r
  height: 1200px;\r
  position: relative;\r
  #centerMapA {\r
    width: 100%;\r
    height: 100%;\r
    z-index: 2;\r
  }\r
  #centerMapB {\r
    position: absolute;\r
    top: 60px;\r
    left: -10px;\r
    width: 100%;\r
    height: 100%;\r
    z-index: 1;\r
  }\r
}\r
</style>\r
`;export{r as default};
