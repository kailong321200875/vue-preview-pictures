import Vue from 'vue'
import App from './App.vue'


import PreviewPic from '@/packages/vue-preview-pictures'
Vue.prototype.$PreviewPic = PreviewPic


new Vue({
  el: '#app',
  render: h => h(App)
})
