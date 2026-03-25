<template>
  <div class="centerMap">
    <div id="centerMapA"></div>
    <div id="centerMapB"></div>
  </div>
  <Dialog
    v-if="showDialog"
    style="
      position: absolute;
      bottom: 420px;
      right: 50px;
      width: 300px;
      height: fit-content;
      z-index: 99999;
      background-color: #161c43;
      border-radius: 10px;
    "
    :tableData="dialogTableData"
    :year="Parmas.year"
    :name="dialogName"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import china from "@/json/china.json";
import { ElMessage } from "element-plus";
import mapBackgroundImgSrc from "./img/mapBackgroundImg.png";
import mapBackgroundImgSrc2 from "./img/mapback4.png";
import * as echarts from "echarts";
import userInfo from "@/store/userInfo/userInfo.js";
import Dialog from "./components/e_m_l_dialog.vue";
import jdicon from "./img/jidiicon.png";
const UserInfo = userInfo();
const showDialog = ref(false);
const dialogTableData = ref([]);
const dialogName = ref("");
const mapBackgroundImg = new Image();
const Parmas = ref({
  year: "2025",
});
mapBackgroundImg.src = mapBackgroundImgSrc;
const mapBackgroundImg2 = new Image();
mapBackgroundImg2.src = mapBackgroundImgSrc2;

const initEchartMap = (geoCoordMap, BJData, Data, points) => {
  echarts.registerMap("china", china);

  var chartDom = document.getElementById("centerMapA");
  var myChart = echarts.init(chartDom);
  var option;
  console.log(geoCoordMap, BJData);

  // const geoCoordMap = {
  //     '上海': [121.4648, 31.2891],
  //     '东莞': [113.8953, 22.901],
  //     '东营': [118.7073, 37.5513],
  //     '中山': [113.4229, 22.478],
  //     '北京': [116.4551, 40.2539]
  // };

  // const BJData = [
  //     [{ name: '北京' }, { name: '上海', value: 95 }],
  //     [{ name: '北京' }, { name: '东莞', value: 90 }],
  //     [{ name: '北京' }, { name: '东营', value: 80 }],
  //     [{ name: '北京' }, { name: '中山', value: 70 }]
  // ];

  const convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = geoCoordMap[dataItem[0].name];
      var toCoord = geoCoordMap[dataItem[1].name];
      if (fromCoord && toCoord) {
        res.push({
          coords: [fromCoord, toCoord],
          value: dataItem[1].value,
        });
      }
    }
    return res;
  };

  option = {
    tooltip: {
      show: false,
      trigger: "item",
      formatter: function (params) {
        if (params.seriesType === "effectScatter" && params.name !== "奇台县") {
          return `${params.name}: ${params.value[2]} 万吨`;
        }
        return "";
      },
    },
    geo: {
      map: "china",

      roam: true,
      type: "map",
      roam: false,
      selectedMode: false,
      zoom: 1,
      roam: false,
      itemStyle: {
        borderColor: "RGBA(92, 105, 181, 1)",
        borderWidth: 2,
        type: "pattern",

        shadowColor: "RGBA(35, 19, 181, 0.7)",
        shadowOffsetX: 6,
        shadowOffsetY: 12,
      },
      emphasis: {
        disabled: true,
      },
    },
    series: [
      {
        name: "北京 Top10",
        type: "lines",
        zlevel: 1,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.7,

          symbolSize: 3,
        },
        lineStyle: {
          normal: {
            color: "yellow",
            width: 0,
            curveness: 0.2,
          },
        },
        data: convertData(BJData),
      },
      {
        name: "北京 Top10",
        type: "lines",
        zlevel: 2,
        symbol: ["none", "arrow"],
        symbolSize: 10,
        effect: {
          show: false,
          period: 6,
          trailLength: 0,
          symbol: "arrow",
          symbolSize: 15,
        },
        lineStyle: {
          normal: {
            color: "yellow",
            width: 1,
            opacity: 0.6,
            curveness: 0.2,
          },
        },
        data: convertData(BJData),
      },
      {
        name: "北京 Top10",
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 2,
        rippleEffect: {
          brushType: "stroke",
        },
        label: {
          normal: {
            show: true,
            position: "right",
            formatter: "{b}",
            fontSize: 20,
          },
        },
        symbolSize: function (val) {
          return val[2] / 8;
        },
        itemStyle: {
          normal: {
            color: "#70ffc4",
          },
        },
        data: BJData.map(function (dataItem) {
          return {
            name: dataItem[1].name,
            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value]),
          };
        }),
      },
      {
        name: "起始点",
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 2,
        rippleEffect: {
          brushType: "stroke",
        },
        label: {
          normal: {
            show: true,
            position: "right",
            formatter: "{b}",
            fontSize: 20,
          },
        },
        symbolSize: 8,
        itemStyle: {
          normal: {
            color: "#70ffc4",
          },
        },
        data: [
          {
            name: "北京",
            value: geoCoordMap["北京"],
          },
        ],
      },
      {
        selectedMode: false,
        type: "map",
        map: "china",
        zoom: 1,
        roam: false,
        itemStyle: {
          borderColor: "RGBA(92, 105, 181, 1)",
          borderWidth: 1,
          areaColor: {
            image: mapBackgroundImg,
            repeat: "repeat",
          },
        },
        emphasis: {
          disabled: true,
        },
        data: Data,
      },
      {
        name: "Points",
        type: "scatter",
        coordinateSystem: "geo",
        data: points,
        symbol: `image://${jdicon}`,
        symbolSize: 100,
      },
    ],
  };
  myChart.on("click", (params) => {
    console.log(params);
    if (params.seriesType === "scatter") {
      console.log(params.data);

      alert(params.data.name + "经纬度是：" + params.data.value);
    }
    if (params.componentSubType == "effectScatter" && params.name != "奇台县") {
      showDialog.value = true;
      dialogTableData.value = params.data.value[2] ? params.data.value[2] : [];
      dialogName.value = params.name;
    } else {
      showDialog.value = false;
      dialogTableData.value = [];
      dialogName.value = "";
    }
  });

  window.onresize = () => {
    myChart.resize();
  };
  option && myChart.setOption(option);
};
const initEchartMap2 = (geoCoordMap, BJData) => {
  echarts.registerMap("china", china);

  var chartDom = document.getElementById("centerMapB");
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    geo: {
      map: "china",

      roam: true,
      type: "map",
      roam: false,
      selectedMode: false,
      zoom: 1,
      roam: false,
      itemStyle: {
        borderColor: "#000",
        borderWidth: 0,
        type: "pattern",
        areaColor: "#000",
        shadowColor: "#000",
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
      emphasis: {
        disabled: true,
      },
    },
    series: [
      {
        selectedMode: false,
        type: "map",
        map: "china",
        zoom: 1,
        roam: false,
        itemStyle: {
          borderColor: "#000",
          borderWidth: 1,
          areaColor: {
            repeat: "repeat",
          },
        },
        emphasis: {
          disabled: true,
        },
      },
    ],
  };

  window.onresize = () => {
    myChart.resize();
  };
  option && myChart.setOption(option);
};
const apiFun = () => {
  nextTick(() => {
    mapInit(
      [
        {
          DELIVER: "652325",
          RECEIPT: "710500",
          NUM: "外调",
        },
        {
          DELIVER: "710500",
          RECEIPT: "210000",
          NUM: 3,
        },
        {
          DELIVER: "710500",
          RECEIPT: "120000",
          NUM: 20,
        },
        {
          DELIVER: "710500",
          RECEIPT: "520000",
          NUM: 20,
        },
      ],
      [
        {
          name: "新疆维吾尔自治区",
          value: 800,
          itemStyle: {
            normal: {
              areaColor: {
                image: mapBackgroundImg2,
                repeat: "repeat",
              },
              borderColor: "RGBA(235, 226, 129, 1)",
              shadowOffsetX: 2,
              shadowOffsetY: 12,
              type: "pattern",
            },
          },
        },
        {
          name: "河北省",
          value: Math.round(Math.random() * 1000),
          itemStyle: {
            normal: {
              areaColor: "rgba(72, 87, 155, 0.9)",
              borderColor: "#fff",
              borderWidth: 2,
            },
          },
        },
        {
          name: "天津市",
          value: Math.round(Math.random() * 1000),
          itemStyle: {
            normal: {
              areaColor: "rgba(72, 87, 155, 0.9)",
              borderColor: "#fff",
              borderWidth: 2,
            },
          },
        },
        {
          name: "贵州省",
          value: Math.round(Math.random() * 1000),
          itemStyle: {
            normal: {
              areaColor: "rgba(72, 87, 155, 0.9)",
              borderColor: "#fff",
              borderWidth: 2,
            },
          },
        },
      ]
    );
  });
};
const mapInit = (res, Data) => {
  if (UserInfo.mapTrue == "1") {
    let jsonMap = UserInfo.mapObj;
    jsonMap[710000] = {
      properties: {
        name: "新疆建设兵团",
        center: [82.06764799999996, 44.886896],
      },
    };
    jsonMap[710500] = {
      properties: {
        name: "奇台县",
        center: [89.5934299999999, 44.01123000000001],
      },
    };
    jsonMap[710501] = {
      properties: {
        name: "八十一团",
        center: [81.69665336608888, 45.01524131470915],
      },
    };
    jsonMap[710502] = {
      properties: {
        name: "八十三团",
        center: [81.69665336608888, 45.01524131470915],
      },
    };
    jsonMap[710503] = {
      properties: {
        name: "八十四团",
        center: [81.69665336608888, 45.01524131470915],
      },
    };
    jsonMap[710504] = {
      properties: {
        name: "八十六团",
        center: [81.69665336608888, 45.01524131470915],
      },
    };
    jsonMap[710505] = {
      properties: {
        name: "八十七团",
        center: [81.69665336608888, 45.01524131470915],
      },
    };
    jsonMap[710506] = {
      properties: {
        name: "八十八团",
        center: [81.69665336608888, 45.01524131470915],
      },
    };
    jsonMap[710507] = {
      properties: {
        name: "八十九团",
        center: [81.69665336608888, 45.01524131470915],
      },
    };
    jsonMap[710508] = {
      properties: {
        name: "九十团",
        center: [81.69665336608888, 45.01524131470915],
      },
    };
    jsonMap[710509] = {
      properties: {
        name: "九十一团",
        center: [81.69665336608888, 45.01524131470915],
      },
    };
    jsonMap[710510] = {
      properties: {
        name: "双河市",
        center: [81.69665336608888, 45.01524131470915],
      },
    };
    const geoCoordMap = {};
    const BJData = [];
    res.map((item) => {
      if (item.DELIVER) {
        console.log(444444444, item.DELIVER);

        console.log(444444444, jsonMap[item.DELIVER]);

        let obj1 = jsonMap[item.DELIVER].properties;
        geoCoordMap[obj1.name] = obj1.center;
      }
      if (item.RECEIPT) {
        let obj2 = jsonMap[item.RECEIPT].properties;
        geoCoordMap[obj2.name] = obj2.center;
      }
      if (item.NUM && item.RECEIPT && item.DELIVER) {
        BJData.push([
          { name: jsonMap[item.DELIVER].properties.name },
          { name: jsonMap[item.RECEIPT].properties.name, value: item.NUM },
        ]);
      }
    });

    const points = [
      {
        name: "塔塔尔乡制种基地",
        value: [99.51407, 44.0725],
      },
      {
        name: "西地镇制种基地",
        value: [89.73849, 46.07314],
      },
      {
        name: "老奇台镇制种基地",
        value: [89.90408, 47.84216],
      },
      {
        name: "碧流河镇制种基地",
        value: [89.03609, 43.89298],
      },
      {
        name: "东湾镇制种基地",
        value: [89.31677, 40.85966],
      },
      {
        name: "古城乡制种基地",
        value: [89.63286, 43.18679],
      },
      {
        name: "吉布库镇制种基地",
        value: [89.41102, 43.82416],
      },
    ];
    initEchartMap(geoCoordMap, BJData, Data, points);
    initEchartMap2(geoCoordMap, BJData);
  } else {
    setTimeout(() => {
      mapInit(res, Data);
    }, 1000);
  }
};
onMounted(() => {
  setTimeout(() => {
    apiFun();
  }, 200);
});
</script>

<style lang="less" scoped>
.centerMap {
  width: 900px;
  height: 1200px;
  position: relative;
  #centerMapA {
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  #centerMapB {
    position: absolute;
    top: 60px;
    left: -10px;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}
</style>
