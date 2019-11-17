import Vue from 'vue'
import App from './App.vue'

import '@/assets/iconfont/iconfont.css'

import Preview from '@/packages/vue-preview-pictures'
Vue.prototype.$Preview = Preview

new Vue({
  el: '#app',
  render: h => h(App)
})
