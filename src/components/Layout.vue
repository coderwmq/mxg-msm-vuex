<template>
  <div>
    <app-header/>
    <app-navbar/>
    <app-main/>
  </div>
</template>
<script>
import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";
import AppMain from "./AppMain/index.vue";
export default {
  components: {
    AppHeader,
    AppNavbar,
    AppMain,
  },
};
</script>

<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  top: 0;
  left: 0;
  right: 0; /* 全横屏填充 */
  background-color: #2d3a4b;
}
/* 左侧区域 */
.navbar {
  position: absolute;
  width: 230px;
  top: 50px;
  bottom: 0; /* 全竖屏填充 */
  background-color: #545c64;
  overflow-y: auto;
}
/* 主区域 */
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0;
  bottom: 0;
  padding: 10px;
  /* background-color: skyblue; */
  overflow-y: auto;
}
</style>
