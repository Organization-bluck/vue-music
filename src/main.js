import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$axios = axios;

import "common/stylus/index.styl"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
