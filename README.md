# vue-captcha
配合仓库 [poster](https://github.com/kkokk/poster) 一起使用的行为验证 vue 版本

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

### Attributes
| 属性名      | 类型      | 默认值                                                       | 说明       |
|----------|---------|-----------------------------------------------------------|----------|
| visible  | Boolean | false                                                     | 开关       |
| options  | Object  | { sliderImg: '背景图', sliderKey: '验证key', sliderY: '滑块高度' } | 参数       |
| loading  | Boolean  | false                                                     | 加载状态     |
| title  | String  | 滑块安全验证                                                  | 标题     |
| tips  | String  | 拖动下方滑块完成拼图                                            | 提示     |
| successText  | String  | 验证成功                                                | 成功提示     |
| errorText  | String  | 是不是太难了，咱换一个                                      | 错误提示     |
| question  | String  | 拖动滑块完成拼图，欢迎提建议！                                | 问题提示     |

### Events
| 事件名称      | 说明          | 回调参数                                                         |
|----------|-------------|--------------------------------------------------------------|
| check  | 检查是否正确的回调函数 | sliderKey, sliderX, done, error （验证需要的key, 移动距离, 完成回调, 错误回调） |
| close  | 弹窗关闭回调函数    | -                                                            |
| refresh  | 刷新回调函数      | -                                                            |
| error  | 错误回调函数      | -                                                            |

### 使用
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
      <!-- vue2 -->
      <view slot="title">自定义标题-安全验证</view>
      <view slot="successText">自定义成功提示-登录中</view>
      <view slot="errorText">自定义错误提示-是不是太难了换一个</view>
      <view slot="tips">自定义提示拖动下方滑块完成拼图</view>
      <!-- <view slot="question">自定义提示</view> -->
      <!-- vue2 -->
        
      <!-- vue3 -->
      <template #title>自定义标题-安全验证</template>
      <template #successText>自定义成功提示-登录中</template>
      <template #errorText>自定义错误提示-是不是太难了换一个</template>
      <template #tips>自定义提示拖动下方滑块完成拼图</template>
      <!-- <template #question>自定义提示</template> -->
      <!-- vue3 -->
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
            xhr.onerror= function () {
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
