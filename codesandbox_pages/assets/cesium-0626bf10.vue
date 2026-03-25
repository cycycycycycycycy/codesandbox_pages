<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import dk_png from "./img/dk.jpg";
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Cesium访问令牌
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTkzNWI1NS1jYWI5LTQ1ZjgtODU3OS00MTYxYmE1M2MwZTYiLCJpZCI6MjIxMzc4LCJpYXQiOjE3MTgwNzE0NzF9.HwAQFfQ7nR65zMSdEbZgplxuK8qXrjZ2XXk5CjmOJWQ";

// 地块数据
const plots = [
  {
    coordinates: [
      { lon: 116.3974, lat: 39.9093, height: 0 }, // 北京
      { lon: 116.4074, lat: 39.9093 },
      { lon: 116.4074, lat: 39.9193 },
      { lon: 116.3974, lat: 39.9193 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.3974, lat: 39.8993 },
      { lon: 116.4074, lat: 39.8993 },
      { lon: 116.4074, lat: 39.9093 },
      { lon: 116.3974, lat: 39.9093 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.3874, lat: 39.9093 },
      { lon: 116.3974, lat: 39.9193 },
      { lon: 116.3874, lat: 39.9193 },
      { lon: 116.3774, lat: 39.9143 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.4074, lat: 39.8893 },
      { lon: 116.4174, lat: 39.8893 },
      { lon: 116.4174, lat: 39.8993 },
      { lon: 116.4074, lat: 39.8993 },
      { lon: 116.4024, lat: 39.8953 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.3874, lat: 39.9193 },
      { lon: 116.3974, lat: 39.9293 },
      { lon: 116.3874, lat: 39.9293 },
      { lon: 116.3774, lat: 39.9243 },
      { lon: 116.3874, lat: 39.9193 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.3774, lat: 39.9093 },
      { lon: 116.3874, lat: 39.9093 },
      { lon: 116.3874, lat: 39.9193 },
      { lon: 116.3774, lat: 39.9193 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.3674, lat: 39.8993 },
      { lon: 116.3774, lat: 39.8993 },
      { lon: 116.3774, lat: 39.9093 },
      { lon: 116.3674, lat: 39.9093 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.3574, lat: 39.8893 },
      { lon: 116.3674, lat: 39.8893 },
      { lon: 116.3674, lat: 39.8993 },
      { lon: 116.3574, lat: 39.8993 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.407, lat: 39.889 },
      { lon: 116.408, lat: 39.89 },
      { lon: 116.409, lat: 39.8895 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.41, lat: 39.891 },
      { lon: 116.411, lat: 39.892 },
      { lon: 116.412, lat: 39.8915 },
      { lon: 116.4105, lat: 39.8905 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.413, lat: 39.893 },
      { lon: 116.414, lat: 39.894 },
      { lon: 116.415, lat: 39.8935 },
      { lon: 116.4135, lat: 39.8925 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.416, lat: 39.895 },
      { lon: 116.417, lat: 39.896 },
      { lon: 116.418, lat: 39.8955 },
      { lon: 116.4165, lat: 39.8945 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.419, lat: 39.897 },
      { lon: 116.42, lat: 39.898 },
      { lon: 116.421, lat: 39.8975 },
      { lon: 116.4195, lat: 39.8965 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.422, lat: 39.899 },
      { lon: 116.423, lat: 39.9 },
      { lon: 116.424, lat: 39.8995 },
      { lon: 116.4225, lat: 39.8985 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.425, lat: 39.901 },
      { lon: 116.426, lat: 39.902 },
      { lon: 116.427, lat: 39.9015 },
      { lon: 116.4255, lat: 39.9005 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.428, lat: 39.903 },
      { lon: 116.429, lat: 39.904 },
      { lon: 116.43, lat: 39.9035 },
      { lon: 116.4285, lat: 39.9025 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.431, lat: 39.905 },
      { lon: 116.432, lat: 39.906 },
      { lon: 116.433, lat: 39.9055 },
      { lon: 116.4315, lat: 39.9045 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.434, lat: 39.907 },
      { lon: 116.435, lat: 39.908 },
      { lon: 116.436, lat: 39.9075 },
      { lon: 116.4345, lat: 39.9065 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.437, lat: 39.909 },
      { lon: 116.438, lat: 39.91 },
      { lon: 116.439, lat: 39.9095 },
      { lon: 116.4375, lat: 39.9085 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.44, lat: 39.911 },
      { lon: 116.441, lat: 39.912 },
      { lon: 116.442, lat: 39.9115 },
      { lon: 116.4405, lat: 39.9105 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.443, lat: 39.913 },
      { lon: 116.444, lat: 39.914 },
      { lon: 116.445, lat: 39.9135 },
      { lon: 116.4435, lat: 39.9125 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.446, lat: 39.915 },
      { lon: 116.447, lat: 39.916 },
      { lon: 116.448, lat: 39.9155 },
      { lon: 116.4465, lat: 39.9145 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.449, lat: 39.917 },
      { lon: 116.45, lat: 39.918 },
      { lon: 116.451, lat: 39.9175 },
      { lon: 116.4495, lat: 39.9165 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.452, lat: 39.919 },
      { lon: 116.453, lat: 39.92 },
      { lon: 116.454, lat: 39.9195 },
      { lon: 116.4525, lat: 39.9185 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.455, lat: 39.921 },
      { lon: 116.456, lat: 39.922 },
      { lon: 116.457, lat: 39.9215 },
      { lon: 116.4555, lat: 39.9205 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.458, lat: 39.923 },
      { lon: 116.459, lat: 39.924 },
      { lon: 116.46, lat: 39.9235 },
      { lon: 116.4585, lat: 39.9225 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
  {
    coordinates: [
      { lon: 116.461, lat: 39.925 },
      { lon: 116.462, lat: 39.926 },
      { lon: 116.463, lat: 39.9255 },
      { lon: 116.4615, lat: 39.9245 },
    ],
    textureUrl: dk_png,
    height: 100,
  },
];

// 响应式变量
const viewer = ref(null);
const entities = ref([]);

// 计算地块中心点
const getPlotCenter = (plot) => {
  let lonSum = 0,
    latSum = 0;
  plot.coordinates.forEach((c) => {
    lonSum += c.lon;
    latSum += c.lat;
  });
  return {
    lon: lonSum / plot.coordinates.length,
    lat: latSum / plot.coordinates.length - 0.07,
  };
};

// 平滑地块高度动画函数
const animatePolygonHeight = (
  entity,
  fromHeight,
  toHeight,
  fromExtruded,
  toExtruded,
  duration = 800,
  callback
) => {
  let start = performance.now();
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };
  const frame = (now) => {
    let elapsed = now - start;
    let percent = Math.min(elapsed / duration, 1);
    let smooth = easeInOutQuad(percent);
    entity.polygon.height = fromHeight + (toHeight - fromHeight) * smooth;
    entity.polygon.extrudedHeight =
      fromExtruded + (toExtruded - fromExtruded) * smooth;
    if (percent < 1) {
      requestAnimationFrame(frame);
    } else {
      entity.polygon.height = toHeight;
      entity.polygon.extrudedHeight = toExtruded;
      if (callback) callback();
    }
  };
  requestAnimationFrame(frame);
};

// 等待地球加载完成
const waitForGlobeReady = (callback) => {
  let ready = false;
  let checkCount = 0;
  const check = () => {
    if (
      viewer.value.scene.globe.tilesLoaded &&
      viewer.value.scene.frameState.frameNumber > 10
    ) {
      if (!ready) {
        ready = true;
        callback();
      }
    } else {
      checkCount++;
      if (checkCount < 100) {
        setTimeout(check, 100);
      } else {
        callback();
      }
    }
  };
  check();
};

// 初始化Cesium
const initCesium = () => {
  // 创建viewer实例
  viewer.value = new Cesium.Viewer("cesiumContainer", {
    // terrainProvider: Cesium.createWorldTerrain(),
  });

  // 创建地块实体
  plots.forEach((plot, index) => {
    const positions = plot.coordinates.map((c) =>
      Cesium.Cartesian3.fromDegrees(c.lon, c.lat, c.height || 0)
    );

    const entity = viewer.value.entities.add({
      name: `plot-${index}`,
      polygon: {
        hierarchy: positions,
        height: 0,
        extrudedHeight: plot.height || 100,
        material: plot.textureUrl,
        outline: false,
        outlineColor: Cesium.Color.WHITE,
      },
    });
    entities.value.push(entity);
  });

  // 设置初始视角
  viewer.value.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(104.0, 35.0, 3000000),
    orientation: {
      heading: 0,
      pitch: Cesium.Math.toRadians(-60),
      roll: 0,
    },
  });

  // 等待地球加载完成后飞到第一个地块
  waitForGlobeReady(() => {
    const center = getPlotCenter(plots[0]);
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(center.lon, center.lat, 3000),
      orientation: {
        heading: 0,
        pitch: Cesium.Math.toRadians(-20),
        roll: 0,
      },
      duration: 2,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    });
  });

  // 设置点击事件
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas);
  viewer.value.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  );

  handler.setInputAction((movement) => {
    const pickedObject = viewer.value.scene.pick(movement.position);
    if (Cesium.defined(pickedObject) && pickedObject.id) {
      // 复位所有地块高度和材质
      entities.value.forEach((e) => {
        if (pickedObject.id !== e) {
          animatePolygonHeight(
            e,
            e.polygon.height,
            0,
            e.polygon.extrudedHeight,
            100,
            500,
            () => {
              e.polygon.outline = false;
            }
          );
        }
      });

      // 抬高被点击的地块
      const entity = pickedObject.id;
      let fromHeight = entity.polygon.height;
      let fromExtruded = entity.polygon.extrudedHeight;
      animatePolygonHeight(
        entity,
        fromHeight,
        300,
        fromExtruded,
        200,
        800,
        () => {
          entity.polygon.outline = true;
          entity.polygon.outlineColor = Cesium.Color.CYAN;

          const plotIndex = entities.value.indexOf(entity);
          const center = getPlotCenter(plots[plotIndex]);

          viewer.value.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              center.lon,
              center.lat + 0.01,
              3000
            ),
            orientation: {
              heading: 0,
              pitch: Cesium.Math.toRadians(-20),
              roll: 0,
            },
            duration: 1,
          });
        }
      );
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

// 组件挂载时初始化
onMounted(() => {
  initCesium();
});

// 组件卸载时销毁
onUnmounted(() => {
  if (viewer.value) {
    viewer.value.destroy();
  }
});
</script>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}

/* 隐藏Cesium默认控件 */
:deep(.cesium-viewer-toolbar),
:deep(.cesium-viewer-animationContainer),
:deep(.cesium-viewer-timelineContainer),
:deep(.cesium-viewer-bottom),
:deep(.cesium-viewer-infoBoxContainer),
:deep(.cesium-viewer-selectionIndicatorContainer),
:deep(.cesium-viewer-geocoderContainer),
:deep(.cesium-viewer-navigationContainer),
:deep(.cesium-viewer-fullscreenContainer),
:deep(.cesium-viewer-homeButtonContainer),
:deep(.cesium-viewer-sceneModePickerContainer),
:deep(.cesium-viewer-baseLayerPickerContainer),
:deep(.cesium-viewer-vrButtonContainer),
:deep(.cesium-viewer-navigationHelpButtonContainer) {
  display: none !important;
}
</style>
