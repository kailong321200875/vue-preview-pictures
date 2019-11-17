import Preview from '@/packages/vue-preview-pictures'

const components = [
  Preview
]

const install = function (Vue, opys = {}) {
  components.map(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  Preview
}