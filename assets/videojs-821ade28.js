const r=`<template>\r
  <div>\r
    <div v-if="showVideo">\r
      <video\r
        ref="videoPlayer"\r
        class="video-js vjs-default-skin"\r
        controls\r
        preload="auto"\r
        width="640"\r
      ></video>\r
    </div>\r
    <el-input\r
      v-model="src"\r
      style="width: 640px"\r
      placeholder="请输入视频源"\r
      @change="changeSrc"\r
    ></el-input>\r
  </div>\r
</template>\r
\r
<script setup>\r
import { onMounted, ref, onBeforeUnmount, nextTick } from "vue";\r
import videojs from "video.js";\r
// import "video.js/dist/video-js.css";\r
\r
const videoPlayer = ref(null);\r
const player = ref(null);\r
const src = ref("");\r
const showVideo = ref(false);\r
const changeSrc = () => {\r
  showVideo.value = false;\r
  player.value = null;\r
  setTimeout(() => {\r
    showVideo.value = true;\r
    nextTick(() => {\r
      player.value = videojs(videoPlayer.value, {\r
        autoplay: true,\r
        controls: true,\r
        sources: [\r
          {\r
            // 走代理\r
            src: "/v1/proxy?url=" + src.value,\r
            src: src.value,\r
            // src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",\r
            type: "application/x-mpegURL",\r
          },\r
        ],\r
      });\r
\r
      player.value.on("error", () => {\r
        const error = player.value.error();\r
        console.error("VideoJS Error:", error);\r
        alert("视频加载失败，请检查网络连接或视频源。");\r
      });\r
    });\r
  }, 1000);\r
};\r
onMounted(() => {});\r
\r
onBeforeUnmount(() => {\r
  if (player.value) {\r
    player.value.dispose();\r
  }\r
});\r
<\/script>\r
\r
<style>\r
/* 你可以在这里添加自定义样式 */\r
</style>\r
`;export{r as default};
