const r=`<template>\r
  <div>\r
    <video\r
      id="video_player"\r
      preload="auto"\r
      playsinline\r
      autoplay\r
      webkit-playsinline\r
      style="width: 900px; height: 500px"\r
    ></video>\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref, onMounted, onUnmounted, nextTick } from "vue";\r
import TCPlayer from "tcplayer.js";\r
import "tcplayer.js/dist/tcplayer.min.css";\r
const player = ref(null);\r
onMounted(() => {\r
  play("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");\r
});\r
const play = (videoURL) => {\r
  nextTick(() => {\r
    player.value = TCPlayer(\r
      "video_player",\r
      {\r
        autoplay: true, //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的\r
        mute: true,\r
        live: true,\r
        controls: "default",\r
        videoType: "live",\r
        width: "1200px", //视频的显示宽度，请尽量使用视频分辨率宽度\r
        height: "600px", //视频的显示高度，请尽量使用视频分辨率高度\r
        plugins: {\r
          ProgressMarker: true,\r
          ContextMenu: {\r
            statistic: true,\r
            levelSwitch: {\r
              open: true,\r
              switchingText: "Start switching",\r
              switchedText: "Switch success",\r
              switchErrorText: "Switch fail",\r
            },\r
          },\r
        },\r
      },\r
      1000\r
    );\r
    player.value.src(videoURL);\r
    player.value.on("canplay", () => {\r
      // // 做一些处理\r
      // modalHeight.value = player?.videoHeight() + 130;\r
      // modalWidth.value = player?.videoWidth();\r
    });\r
  });\r
};\r
onUnmounted(() => {\r
  if (player.value) {\r
    player.value.dispose();\r
    player.value = null;\r
  }\r
});\r
<\/script>\r
\r
<style lang="less" scoped></style>\r
`;export{r as default};
