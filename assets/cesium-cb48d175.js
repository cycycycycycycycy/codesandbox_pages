const n=`<template>\r
  <div id="cesiumContainer"></div>\r
</template>\r
\r
<script setup>\r
import dk_png from "./img/dk.jpg";\r
import { ref, onMounted, onUnmounted } from "vue";\r
import * as Cesium from "cesium";\r
import "cesium/Build/Cesium/Widgets/widgets.css";\r
\r
// Cesium访问令牌\r
Cesium.Ion.defaultAccessToken =\r
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTkzNWI1NS1jYWI5LTQ1ZjgtODU3OS00MTYxYmE1M2MwZTYiLCJpZCI6MjIxMzc4LCJpYXQiOjE3MTgwNzE0NzF9.HwAQFfQ7nR65zMSdEbZgplxuK8qXrjZ2XXk5CjmOJWQ";\r
\r
// 地块数据\r
const plots = [\r
  {\r
    coordinates: [\r
      { lon: 116.3974, lat: 39.9093, height: 0 }, // 北京\r
      { lon: 116.4074, lat: 39.9093 },\r
      { lon: 116.4074, lat: 39.9193 },\r
      { lon: 116.3974, lat: 39.9193 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.3974, lat: 39.8993 },\r
      { lon: 116.4074, lat: 39.8993 },\r
      { lon: 116.4074, lat: 39.9093 },\r
      { lon: 116.3974, lat: 39.9093 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.3874, lat: 39.9093 },\r
      { lon: 116.3974, lat: 39.9193 },\r
      { lon: 116.3874, lat: 39.9193 },\r
      { lon: 116.3774, lat: 39.9143 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.4074, lat: 39.8893 },\r
      { lon: 116.4174, lat: 39.8893 },\r
      { lon: 116.4174, lat: 39.8993 },\r
      { lon: 116.4074, lat: 39.8993 },\r
      { lon: 116.4024, lat: 39.8953 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.3874, lat: 39.9193 },\r
      { lon: 116.3974, lat: 39.9293 },\r
      { lon: 116.3874, lat: 39.9293 },\r
      { lon: 116.3774, lat: 39.9243 },\r
      { lon: 116.3874, lat: 39.9193 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.3774, lat: 39.9093 },\r
      { lon: 116.3874, lat: 39.9093 },\r
      { lon: 116.3874, lat: 39.9193 },\r
      { lon: 116.3774, lat: 39.9193 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.3674, lat: 39.8993 },\r
      { lon: 116.3774, lat: 39.8993 },\r
      { lon: 116.3774, lat: 39.9093 },\r
      { lon: 116.3674, lat: 39.9093 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.3574, lat: 39.8893 },\r
      { lon: 116.3674, lat: 39.8893 },\r
      { lon: 116.3674, lat: 39.8993 },\r
      { lon: 116.3574, lat: 39.8993 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.407, lat: 39.889 },\r
      { lon: 116.408, lat: 39.89 },\r
      { lon: 116.409, lat: 39.8895 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.41, lat: 39.891 },\r
      { lon: 116.411, lat: 39.892 },\r
      { lon: 116.412, lat: 39.8915 },\r
      { lon: 116.4105, lat: 39.8905 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.413, lat: 39.893 },\r
      { lon: 116.414, lat: 39.894 },\r
      { lon: 116.415, lat: 39.8935 },\r
      { lon: 116.4135, lat: 39.8925 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.416, lat: 39.895 },\r
      { lon: 116.417, lat: 39.896 },\r
      { lon: 116.418, lat: 39.8955 },\r
      { lon: 116.4165, lat: 39.8945 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.419, lat: 39.897 },\r
      { lon: 116.42, lat: 39.898 },\r
      { lon: 116.421, lat: 39.8975 },\r
      { lon: 116.4195, lat: 39.8965 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.422, lat: 39.899 },\r
      { lon: 116.423, lat: 39.9 },\r
      { lon: 116.424, lat: 39.8995 },\r
      { lon: 116.4225, lat: 39.8985 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.425, lat: 39.901 },\r
      { lon: 116.426, lat: 39.902 },\r
      { lon: 116.427, lat: 39.9015 },\r
      { lon: 116.4255, lat: 39.9005 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.428, lat: 39.903 },\r
      { lon: 116.429, lat: 39.904 },\r
      { lon: 116.43, lat: 39.9035 },\r
      { lon: 116.4285, lat: 39.9025 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.431, lat: 39.905 },\r
      { lon: 116.432, lat: 39.906 },\r
      { lon: 116.433, lat: 39.9055 },\r
      { lon: 116.4315, lat: 39.9045 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.434, lat: 39.907 },\r
      { lon: 116.435, lat: 39.908 },\r
      { lon: 116.436, lat: 39.9075 },\r
      { lon: 116.4345, lat: 39.9065 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.437, lat: 39.909 },\r
      { lon: 116.438, lat: 39.91 },\r
      { lon: 116.439, lat: 39.9095 },\r
      { lon: 116.4375, lat: 39.9085 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.44, lat: 39.911 },\r
      { lon: 116.441, lat: 39.912 },\r
      { lon: 116.442, lat: 39.9115 },\r
      { lon: 116.4405, lat: 39.9105 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.443, lat: 39.913 },\r
      { lon: 116.444, lat: 39.914 },\r
      { lon: 116.445, lat: 39.9135 },\r
      { lon: 116.4435, lat: 39.9125 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.446, lat: 39.915 },\r
      { lon: 116.447, lat: 39.916 },\r
      { lon: 116.448, lat: 39.9155 },\r
      { lon: 116.4465, lat: 39.9145 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.449, lat: 39.917 },\r
      { lon: 116.45, lat: 39.918 },\r
      { lon: 116.451, lat: 39.9175 },\r
      { lon: 116.4495, lat: 39.9165 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.452, lat: 39.919 },\r
      { lon: 116.453, lat: 39.92 },\r
      { lon: 116.454, lat: 39.9195 },\r
      { lon: 116.4525, lat: 39.9185 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.455, lat: 39.921 },\r
      { lon: 116.456, lat: 39.922 },\r
      { lon: 116.457, lat: 39.9215 },\r
      { lon: 116.4555, lat: 39.9205 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.458, lat: 39.923 },\r
      { lon: 116.459, lat: 39.924 },\r
      { lon: 116.46, lat: 39.9235 },\r
      { lon: 116.4585, lat: 39.9225 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
  {\r
    coordinates: [\r
      { lon: 116.461, lat: 39.925 },\r
      { lon: 116.462, lat: 39.926 },\r
      { lon: 116.463, lat: 39.9255 },\r
      { lon: 116.4615, lat: 39.9245 },\r
    ],\r
    textureUrl: dk_png,\r
    height: 100,\r
  },\r
];\r
\r
// 响应式变量\r
const viewer = ref(null);\r
const entities = ref([]);\r
\r
// 计算地块中心点\r
const getPlotCenter = (plot) => {\r
  let lonSum = 0,\r
    latSum = 0;\r
  plot.coordinates.forEach((c) => {\r
    lonSum += c.lon;\r
    latSum += c.lat;\r
  });\r
  return {\r
    lon: lonSum / plot.coordinates.length,\r
    lat: latSum / plot.coordinates.length - 0.07,\r
  };\r
};\r
\r
// 平滑地块高度动画函数\r
const animatePolygonHeight = (\r
  entity,\r
  fromHeight,\r
  toHeight,\r
  fromExtruded,\r
  toExtruded,\r
  duration = 800,\r
  callback\r
) => {\r
  let start = performance.now();\r
  const easeInOutQuad = (t) => {\r
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;\r
  };\r
  const frame = (now) => {\r
    let elapsed = now - start;\r
    let percent = Math.min(elapsed / duration, 1);\r
    let smooth = easeInOutQuad(percent);\r
    entity.polygon.height = fromHeight + (toHeight - fromHeight) * smooth;\r
    entity.polygon.extrudedHeight =\r
      fromExtruded + (toExtruded - fromExtruded) * smooth;\r
    if (percent < 1) {\r
      requestAnimationFrame(frame);\r
    } else {\r
      entity.polygon.height = toHeight;\r
      entity.polygon.extrudedHeight = toExtruded;\r
      if (callback) callback();\r
    }\r
  };\r
  requestAnimationFrame(frame);\r
};\r
\r
// 等待地球加载完成\r
const waitForGlobeReady = (callback) => {\r
  let ready = false;\r
  let checkCount = 0;\r
  const check = () => {\r
    if (\r
      viewer.value.scene.globe.tilesLoaded &&\r
      viewer.value.scene.frameState.frameNumber > 10\r
    ) {\r
      if (!ready) {\r
        ready = true;\r
        callback();\r
      }\r
    } else {\r
      checkCount++;\r
      if (checkCount < 100) {\r
        setTimeout(check, 100);\r
      } else {\r
        callback();\r
      }\r
    }\r
  };\r
  check();\r
};\r
\r
// 初始化Cesium\r
const initCesium = () => {\r
  // 创建viewer实例\r
  viewer.value = new Cesium.Viewer("cesiumContainer", {\r
    // terrainProvider: Cesium.createWorldTerrain(),\r
  });\r
\r
  // 创建地块实体\r
  plots.forEach((plot, index) => {\r
    const positions = plot.coordinates.map((c) =>\r
      Cesium.Cartesian3.fromDegrees(c.lon, c.lat, c.height || 0)\r
    );\r
\r
    const entity = viewer.value.entities.add({\r
      name: \`plot-\${index}\`,\r
      polygon: {\r
        hierarchy: positions,\r
        height: 0,\r
        extrudedHeight: plot.height || 100,\r
        material: plot.textureUrl,\r
        outline: false,\r
        outlineColor: Cesium.Color.WHITE,\r
      },\r
    });\r
    entities.value.push(entity);\r
  });\r
\r
  // 设置初始视角\r
  viewer.value.scene.camera.setView({\r
    destination: Cesium.Cartesian3.fromDegrees(104.0, 35.0, 3000000),\r
    orientation: {\r
      heading: 0,\r
      pitch: Cesium.Math.toRadians(-60),\r
      roll: 0,\r
    },\r
  });\r
\r
  // 等待地球加载完成后飞到第一个地块\r
  waitForGlobeReady(() => {\r
    const center = getPlotCenter(plots[0]);\r
    viewer.value.camera.flyTo({\r
      destination: Cesium.Cartesian3.fromDegrees(center.lon, center.lat, 3000),\r
      orientation: {\r
        heading: 0,\r
        pitch: Cesium.Math.toRadians(-20),\r
        roll: 0,\r
      },\r
      duration: 2,\r
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,\r
    });\r
  });\r
\r
  // 设置点击事件\r
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas);\r
  viewer.value.screenSpaceEventHandler.removeInputAction(\r
    Cesium.ScreenSpaceEventType.LEFT_CLICK\r
  );\r
\r
  handler.setInputAction((movement) => {\r
    const pickedObject = viewer.value.scene.pick(movement.position);\r
    if (Cesium.defined(pickedObject) && pickedObject.id) {\r
      // 复位所有地块高度和材质\r
      entities.value.forEach((e) => {\r
        if (pickedObject.id !== e) {\r
          animatePolygonHeight(\r
            e,\r
            e.polygon.height,\r
            0,\r
            e.polygon.extrudedHeight,\r
            100,\r
            500,\r
            () => {\r
              e.polygon.outline = false;\r
            }\r
          );\r
        }\r
      });\r
\r
      // 抬高被点击的地块\r
      const entity = pickedObject.id;\r
      let fromHeight = entity.polygon.height;\r
      let fromExtruded = entity.polygon.extrudedHeight;\r
      animatePolygonHeight(\r
        entity,\r
        fromHeight,\r
        300,\r
        fromExtruded,\r
        200,\r
        800,\r
        () => {\r
          entity.polygon.outline = true;\r
          entity.polygon.outlineColor = Cesium.Color.CYAN;\r
\r
          const plotIndex = entities.value.indexOf(entity);\r
          const center = getPlotCenter(plots[plotIndex]);\r
\r
          viewer.value.camera.flyTo({\r
            destination: Cesium.Cartesian3.fromDegrees(\r
              center.lon,\r
              center.lat + 0.01,\r
              3000\r
            ),\r
            orientation: {\r
              heading: 0,\r
              pitch: Cesium.Math.toRadians(-20),\r
              roll: 0,\r
            },\r
            duration: 1,\r
          });\r
        }\r
      );\r
    }\r
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);\r
};\r
\r
// 组件挂载时初始化\r
onMounted(() => {\r
  initCesium();\r
});\r
\r
// 组件卸载时销毁\r
onUnmounted(() => {\r
  if (viewer.value) {\r
    viewer.value.destroy();\r
  }\r
});\r
<\/script>\r
\r
<style scoped>\r
#cesiumContainer {\r
  width: 100%;\r
  height: 100%;\r
}\r
\r
/* 隐藏Cesium默认控件 */\r
:deep(.cesium-viewer-toolbar),\r
:deep(.cesium-viewer-animationContainer),\r
:deep(.cesium-viewer-timelineContainer),\r
:deep(.cesium-viewer-bottom),\r
:deep(.cesium-viewer-infoBoxContainer),\r
:deep(.cesium-viewer-selectionIndicatorContainer),\r
:deep(.cesium-viewer-geocoderContainer),\r
:deep(.cesium-viewer-navigationContainer),\r
:deep(.cesium-viewer-fullscreenContainer),\r
:deep(.cesium-viewer-homeButtonContainer),\r
:deep(.cesium-viewer-sceneModePickerContainer),\r
:deep(.cesium-viewer-baseLayerPickerContainer),\r
:deep(.cesium-viewer-vrButtonContainer),\r
:deep(.cesium-viewer-navigationHelpButtonContainer) {\r
  display: none !important;\r
}\r
</style>\r
`;export{n as default};
