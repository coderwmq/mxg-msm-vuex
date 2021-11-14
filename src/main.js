import Vue from "vue";
// 注意引入在Vue的下面
// ElementUI组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

import App from "./App.vue";
import router from "./router.js";
import store from './store/index'

// 使用ElementUI
Vue.use(ElementUI)

// 权限拦截
import './permission'

// Vue.config.productionTip = process.env.NODE_ENV==='production';
// console.log(process.env.VUE_APP_SERVICE_URL);
// console.log(process.env.VUE_APP_BASE_API);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
