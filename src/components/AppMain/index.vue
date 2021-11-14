<template>
  <div class="main">
    <!-- 注意link不能使用，因为他是内置的标签 ，需要重命名 一般加上一个前缀 -->
    <app-link v-show="$route.path !== '/home'"></app-link>
    <router-view></router-view>
  </div>
</template>
<script>
import AppLink from './link.vue'
export default {
  components:{
    AppLink
  }
}
</script>