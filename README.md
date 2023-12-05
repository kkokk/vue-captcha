# vue-captcha
配合仓库 [poster](https://github.com/kkokk/poster) 一起使用的行为验证 vue 版本，目前版本是 1.0.0

## 使用文档

### 滑块验证

```bash
# 安装
npm install @kkokk/captcha
yarn add @kkokk/captcha
# 卸载
npm uninstall @kkokk/captcha
yarn remove @kkokk/captcha
```
```js
// main.js 引入

import Captcha from '@kkokk/captcha'
Vue.use(Captcha)
```
```vue
<template>
  <div id="app">
    <button @click="open">验证</button>
    <slider-captcha 
      v-model="visible"
      :options="options"
      :loading="loading"
      @check="check"
      @close="close"
      @refresh="getSliderOptions"
      @error="getSliderOptions"
    >
      <span slot="title">自定义标题-安全验证</span>
      <span slot="successText">自定义成功提示-登录中</span>
      <span slot="errorText">自定义错误提示-是不是太难了换一个</span>
      <span slot="tips">自定义提示拖动下方滑块完成拼图</span>
    </slider-captcha> 
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      visible: false,
      loading: false,
      options: {}
    }
  },
  created()
  {
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 1000)
  },
  methods: {
    // 打开触发
    open() {
      this.visible = true
      this.getSliderOptions()
    },
    // 验证
    check(sliderKey, sliderX, done, error)
    {
      // 这里应该是验证是否成功的接口
      if(sliderX > 208 - 5 && sliderX < 208 + 5) {
        // 验证成功
        done()
      } else {
        // 验证错误
        error()
      }
    },
    // 关闭触发
    close() {

    },
    // 获取滑块验证参数
    getSliderOptions()
    {
      this.loading = true
      this.request({
        type: 'get',
        url: 'http://127.0.0.1:8111/',
        success: (res) => {
          this.options = {
            sliderImg: res.img,
            sliderKey: res.key,
            sliderY: res.y
          }
          this.loading = false
        }
      })
    },
    // 封装一个简单请求接口，方便测试
    request(obj) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        switch(obj.type) {
          case 'get':
            xhr.open('GET', obj.url, true);
            xhr.onload = function() {
              resolve(obj.success(JSON.parse(this.responseText)))
            };
            xhr.onError= function () {
                    reject(obj.error({
                        status: this.status,
                        statusText: xhr.statusText
                    }));
                };
            break;
          case 'post':
            xhr.open('POST', obj.url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function() {
              if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                resolve(obj.success(JSON.parse(this.responseText)))
              }
            };
            break;
        }
        
        xhr.send(JSON.stringify(obj.data));
      });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```
