import SliderCaptcha from './libs/SliderCaptcha.vue' // 滑块验证

const Components = [
  SliderCaptcha
]

const KkokkComponents = {
  // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
  install: function(Vue) {
    Components.forEach(element => {
      Vue.component(element.name, element)
    })
  }
}
// 导出
export default KkokkComponents