import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './lib/store'
import http from './lib/http'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './assets/css/style.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = process.env.NODE_ENV == 'production'
Vue.config.debug = process.env.NODE_ENV == 'production'
Vue.use(Antd)

Vue.prototype.$http = http

NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
})

router.beforeEach((to, from, next) => {
  // 每次切换页面时，调用进度条
  NProgress.start()

  // 这个一定要加，没有next()页面不会跳转的。这部分还不清楚的去翻一下官网就明白了
  next()
})

router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
