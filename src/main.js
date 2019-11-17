import Vue from 'vue'
import App from './App.vue'


import PreviewPic from 'vue-preview-pictures'
Vue.prototype.$PreviewPic = PreviewPic


new Vue({
  el: '#app',
  render: h => h(App)
})
