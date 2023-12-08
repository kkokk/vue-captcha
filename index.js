import SliderCaptcha from './libs/SliderCaptcha.vue' // 滑块验证

const Components = {
  SliderCaptcha
}

const KkokkComponents = {
  // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 app 这个类的参数。
  install(app) {
    Object.keys(Components).forEach((key) => {
      app.component(key, Components[key])
    })
  }
}

// 导出
export default KkokkComponents