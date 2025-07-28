<template>
  <div class="lang-dialog__wrapper" v-if="dialogVisible">
    <div class="lang-dialog">
      <div class="lang-dialog__header">
        <div class="lang-dialog__title"><slot name="title">{{title}}</slot></div>
        <button type="button" class="lang-dialog-header-btn" @click="close"> <i class="lang-icon-close"></i> </button>
      </div>
      <div class="lang-dialog__body">
        <div class="tips" v-show="failed"><slot name="errorText">{{ errorText }}</slot></div>
        <div class="tips" v-show="success"><slot name="successText">{{ successText }}</slot></div>
        <div class="tips" v-show="!failed && !success"><slot name="tips">{{ tips }}</slot></div>

        <div class="rotate-body">
          <div class="rotate-bg">
            <img v-show="rotateImg" :src="rotateImg" alt="" :style="{'transform': 'rotate(' + rotateX + 'deg)'}"  :class="{'slider-shock':shock}">
            <div v-show="isMove" class="rotate-correcting" />
            <div v-show="loading || success || failed" class="rotate-mask" />
            <div
              class="rotate-icon"
              :class="[
                loading ? 'rotate-icon-loading':'',
                failed ? 'rotate-icon-error' : '',
                success ? 'rotate-icon-success' : ''
              ]"
            />
          </div>
          <div class="rotate-progress">
            <div class="rotate-progress-bottom" :class="{'slider-shock':shock}">
              <p v-show="!isSlider || rotateX === 0">拖动滑块使图片角度为正</p>
            </div>
            <div
              class="rotate-progress-btn"
              :style="{'left': rotateMoveLeft}"
              :class="[(!isSlider || rotateX === 0) ? 'rotate-btn-slider-up' :
                (loading ? 'rotate-btn-slider-loading' : (failed ? 'rotate-btn-slider-error' : 'rotate-btn-slider-active')),{'slider-shock':shock}, {'slider-start-shock': btnShock}]"
              @touchstart.passive="rotateTouchStart"
              @touchmove.passive="rotateTouchMove"
              @touchend.passive="rotateEnd"
              @mousedown="rotateStart"
            >
              <p :class="[(!isSlider || rotateX === 0) ? 'rotate-black' : 'rotate-white']" />
            </div>
          </div>
        </div>
        <div style="position:relative;">
          <div class="slider-refresh" style="font-size: 29px;" @click.stop="" @mouseenter="questionMessage = true" @mouseleave="questionMessage = false">
            <div class="slider-tools-btn lang-tips">
              <div class="lang-tips-item lang-tips-bottom" v-show="questionMessage">
                <slot name="question">
									<div v-if="question">{{question}}</div>
									<div v-else>
										拖动滑块使图片角度为正，欢迎提建议！
											<a href="https://gitee.com/langlanglang/poster" target="_blank">gitee</a>
											<a href="https://github.com/kkokk/poster" target="_blank">github</a>
									</div>
								</slot>
              </div>
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAVgSURBVHgBzVrZUdxMEG7EcjzuH8EvIvA6Ai8ZmAhgqziLByACRASGB4qzChwBZOAlgl1HYDmDfaIoTn/ferQlNSNpRpJd/qrG8s7ZPdPT1zAlDeDq6qr98PDweWpqqoPyP6o6KG1TEsRoi19fX7/jO8D3bmtrK5aamJKKINHPz887b29vXRapADAyxNjDOsx4M5AQjkV3JbvDtQBmrl9eXg58GfFi4OLiYr9pwjWCIIjW1tYOXPs7MXBychJOT0/f4Lg7eX3Q1seH8t0Hk8P5+flRr9cbsY2ndn9/H7ZarRBtvCefULoFS/KuLLqcRikDl5eXyzjaQ7Hv+ggLHYHYw4RYV3BT8Olix/fxDW1zo/Q2NjZui+YpZMCITJQz+QEmP5QGAGZW8hgpE6lcBvKIh6gczc3NRb47XgZzIhEIXtZtRUxYGTg7O/uMz42laa+pXc8D1qaS+KLrcQdXVldXv+r6dwxwJ8DxQLIyT1lfwqXqy1/A8fFxBxf+m4WGj/pit/RgEK8HCvT+4vb29lAcQa3z9PQU4vInWiv2YZ5rYSOXDC0J2tSE+H5M982cQI7cO4tNiZEbQXXe+hgrmzhhbo6PRDNgROdHujOt4/r6ek8cYI6dOxSWdKVPtIR5nU709PT0EP13UlWj2dnZhUSJBKmGSC/E3RIHkHkjs6FD9xCa7Nv5+XnHoa9Q48lvtZ2AjuNu8iNICLCor8j1qG33houC0GsUGqJYtbVRfyMOMDt9oNbbobiO/2/qumpcDLn/Kg6gERK187QVGP/f5uZmD2UJ/1+g7KqhIWR82WUNcwetpzBmgBypMZE4ApohQwTvDYje1f148ciY6rsijqDLotb9xG9gLGBHdb4TR1gcvKO8vtio65KxuaC/pcZ2KUY8ga5q6Hv65BnZL9IuljZnt5x3gZ5uuo5RYMAwMF0JBpx3n1CTFqpGc9ppePlTDEfV2h2cavBBVQ7EA1C1Pco2C92Nor5QtZn7gjHO1t3Q1ldVYQuThOkaMPRTPGDEbbesH3a/q608L7x4gIES6EuP/0BfKEx3mpmZiaUhkGjOT01lCfxjH2VBMMp7fHxMV7UD3akpPx86/gsNHMpVTtYi8g3gLbS9Z6BB5IoVjZqroSwDGchwlZjoPwGqaBOsR1IBNtp4B8jApAG6tS2e6s0FhvC+1ABjDFUV8wQyqow3W/4AmojmtMbE7zjAP1ptLso/CuaUVNX3QBsTbdiqwsdCuyJx4FJrDALo1tt0ZeIkSU34WGgX0A3R6ph2pEXdiuion240vnYkNeBqoT3QVb+HXGOclcBu3UF0Jh1MfBBJDSRvBphrVJYedIHJ3KUxdq/Hhsz42pmIx2QEKoHEw+QPaIXx8wZz/agjlraoL3FDxgxQjHTEA+xXXZQ7rxYMwdCKVICJ1zO7TycwcUMmroTtFLDovlQA7lOT1jwStfvpbMmEgZxT2K0iSkxgSXYzOLf3PYBy2dHZEpPYiidr6UEgmAGNjpG93QAePRgZM893MF/P0yTKdHDFbMlCusI5uQtiFl2zaXXBOAI03IhDcvedO80O6LinqpmIGtTRTK4wYmNLlPVsp5j7wIFdiCy6t/JrYhmM6uV67zZJJ3Qz9EgB8piQ36nCqKmghLuOE47EkmYpIp4ofeQzrzVXYs/hxChRlYdqh/dmyvwe5r0umsf5mdXIZZg7EbxP45IM+ScFTA6kn1kZKKGtQ5+LHm/R6z5f8DHXUiPPrIqRPJFqCmNb5BNyev+pQdFrYg1Ufm+u/MceqYdqeq4dqQAG+UxlViE8QWUG0kiYMXlWRnS0wmGqCx87SCAN4U9GgQykmshB/QKLND1fMNqj0gAAAABJRU5ErkJggg==">
            </div>
          </div>
          <div class="slider-refresh" style="left: 35px;" @click.stop="refresh" @mouseenter="refreshMessage = true" @mouseleave="refreshMessage = false">
            <div class="slider-tools-btn lang-tips" style="width:24px;height: 24px;"> <!-- 刷新 -->
              <div class="lang-tips-item lang-tips-bottom" v-show="refreshMessage"> 刷新</div>
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPZSURBVHgB7VpLTuNAEC2b8NlNboDnBJgbJCdgOAFkAQixGDgB9gkIC4T4SIETTOYEhBOQOcF4buAVQojPvGfZGbv9iWMbE0vzpMam3e7Uq66u7q6yJhXh/PzcwKWjaZqJsop7E6XtF8JlwTPn7e3tF64jXMf7+/uOlIAmJTAYDNovLy/f39/fOyxSACSCd29A5r4ImUIEfG1buq5vyD8NlwbI3Ly+vtp5iFAGtpuJQKBxaOtQKhRcgQvF9Hd2duy0BldXV8eQQwMBKzeBs7Mzs9Vq/cCtkdYGpkBzuIcAY9r3ysqK2+v1aPse+cfHRwN9GL65rUHjnYyf5FzpqqNB4VFvodi5CVxeXtLOLUnWuoNn/eXl5dtA2LwIJj4IH0uyYthfb29vbxgWnve5CYRfUgVHsdD5rVQAkNnOIHKEZ1/CcgQE9KxO04SHxk+XlpbWqxKegDD0RF2UpD5PUpQoLUkBzSbhJRd1R/wx+QD49r6N0XD80ZiKxBGgbdKulWoXM7/7UcKHQdOAonp52sYI0FuA/Z1S7Ql/cHAwlpoAb7Wap12MAP28xCeSXafwGY4jhggBmo76IicsJmtfasIswhPqCFjK/w78uyU1YVbhiYkXovZh+1vKc2vWxako+PvcHuDWzvnKiH+0UAeW4rocmM5XmXNMTChJ+9IAeASwaPHwYYQfYKX9KQ2ARwB7cDNcyV1lXbZfFh4B/2AyAba5jdA+4RGAwJFtMvfy0hB4BGAyplLvSEMQeKHICJSNFNQJXRqO/wQ+GwGBiM/3D9uNQEDAUeoNaQg8AoxVRip13ZSGIFgHIgsXFrYNaQiClXgYruTCxrOxNAAeAX/hckL17efn521pACZuVA0oNcWMJgQQiI0c3BmAvbi4+CZzjgkB7v8Twnon8z4XpkUlDMyFXCG+z0KEACczo75Km8Pr6+stmVPEwus0GWj9QaKrMZNz3d3d3VoPOkyq+IvqKG2LH9vMcS4gPrMp0f1RG5P6zj/81wKOOuKjDyAwQPmN/VknqV3ibtSPg6qm5JGAZzqUDwZD+wg03CjVnaS2mRmahGBXgD7CLnbVkQvffAe4jblvmPB6kglPTTFlkHCkohRTjuznUVqAOVeSzzebk5THDopVJFGdQ/BIki8JudOsfvCXiQ8jtTNk3WG797gdLSwsuIuLi044zfr09MTkiclVHte1rOw++hqjr81pSpk5U59hUlWBhO28OYmynxpUucBxK3PKPdkszqHUxx6hRDXTUoXWCMZhcRkWSZQTpQiEEf7cBtc1FAP3RqiJC2EpIF3hH54Coe1hWVf8FxUNF4vY5AiIAAAAAElFTkSuQmCC">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RotateCaptcha',
    props:
    {
      value: {
        type: Boolean,
        default: false
      },
      modelValue: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '安全验证'
      },
      tips: {
        type: String,
        default: '请完成下方验证'
      },
      successText: {
        type: String,
        default: '验证成功'
      },
      errorText:{
        type: String,
        default: '是不是太难了，咱换一个'
      },
      question: {
        type: String,
        default: ''
      },
      options: {
        type: Object,
        default() {
          return {
            rotateImg:'',
            rotateKey: ''
          }
        }
      }
    },
    watch: {
      value: {
        handler: function(val) {
          this.init(val)
        },
        immediate: true
      },
      modelValue: {
        handler: function(val) {
          this.init(val)
        },
        immediate: true
      },
      options: {
        handler: function(option) {
          this.clear()
          this.rotateImg = option.rotateImg
          this.rotateKey = option.rotateKey
        },
        deep:true,
        immediate: true
      }
    },
    data() {
      return {
        dialogVisible: false,
        btnShock: false,
        success: false,
        failed: false,
        rotateImg: '',
        rotateKey: '',
        rotateX: 0,
        rotateRate: 1.7,
        rotateWdtih: 212,
        isSlider: false,
        rotateMoveLeft: '0px',
        isMove: false,
        shock: false,
        tipEvents: {},
        rotateMoveX: 0,
        questionMessage: false,
        refreshMessage: false,
      }
    },
    methods: {
      init(open) {
        this.dialogVisible = open
        if(open) {
          this.btnShock = open
          setTimeout(() => {
            this.btnShock = false
          }, 1000)
          this.clear()
        }
      },
      clear() {
        this.success = false
        this.failed = false
        this.rotateImg = ''
        this.rotateKey = ''
        this.rotateX = 0
        this.rotateMoveLeft = '0px'
      },
      check(rotateKey, rotateX)
      {
        this.$emit('check', rotateKey, rotateX, this.done, this.error)
      },
      done()
      {
        this.success = true
      },
      error() {
        this.failed = true
        this.shock = true
        setTimeout(() => {
          this.shock = false
          this.isSlider = false
          this.rotateMoveLeft = '0px'
          this.$emit('error')
        }, 1000)
      },
      close() {
        this.dialogVisible = false
        this.$emit('input', this.dialogVisible)
        this.$emit('update:modelValue', this.dialogVisible)
        this.$emit('close')
      },
      refresh()
      {
        this.$emit('refresh')
      },
      rotateTouchStart(e) {
        // 移动触摸移动
        const that = this
        if(that.loading || that.failed || that.success) return
        const rotate = e.target
        that.rotateMoveX = e.touches[0].clientX - rotate.offsetLeft
        that.isSlider = true
        that.isMove = true
      },
      rotateTouchMove(e) {
        const that = this
        if(that.loading || that.failed || that.success) return
        let left = e.touches[0].clientX - that.rotateMoveX
        if (left >= 0 && left <= that.rotateWdtih) {
          if (left < 5) left = 0
          that.rotateMoveLeft = left + 'px'
          that.rotateX = left * that.rotateRate
        }
      },
      rotateEnd() {
        if(this.loading || this.failed || this.success) return
        this.isMove = false
        this.check(this.rotateKey, this.rotateX)
      },
      rotateStart(e) {
        var that = this
        if(that.loading || that.failed || that.success) return
        const rotate = e.target // 获取目标元素
        // 算出鼠标相对元素的位置
        const rotateX = e.clientX - rotate.offsetLeft

        that.isSlider = true
        that.isMove = true
        document.onmousemove = (e) => {
          let left = e.clientX - rotateX
          if (left >= 0 && left <= that.rotateWdtih) {
            if (left < 5) left = 0
            that.rotateMoveLeft = left + 'px'
            that.rotateX = left * that.rotateRate
            // console.log(that.rotateX)
          }
        }

        document.onmouseup = () => {
          // console.log('放开了我')
          that.isMove = false
          document.onmousemove = null
          document.onmouseup = null
          this.check(this.rotateKey, this.rotateX)
        }
      }
    }
  }
</script>

<style scoped>
a + a {
	margin-left: 10px;
}
/* 弹窗开始  */
.lang-dialog__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  text-align: left;
  z-index: 88888888;
}

.lang-dialog {
  position: relative;
  margin: 0 auto 50px;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 30%);
  box-sizing: border-box;
  background: #FFF;
  width: 50%;
  margin-top: calc(50vh - 185px);
  width: 305px;
}

.lang-dialog__header {
  padding: 20px 10px 10px;
}

.lang-dialog__title {
  line-height: 20px;
  font-size: 18px;
  color: #525252;
}

.lang-dialog-header-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 0;
  background: 0 0;
  border: none;
  outline: 0;
  cursor: pointer;
  font-size: 16px
}

.lang-icon-close {
  color: rgba(0, 0, 0, 0.68);
  font-size: 20px;
}

.lang-icon-close:before {
  content: '×';
}

.lang-icon-close:hover {
  color: rgba(0, 0, 0, 0.88);
}

.lang-dialog__body {
  padding: 0 10px;
  color: #828282;
  font-size: 14px;
  word-break: break-all;
  height: 355px;
}

.loading-transparent-mask{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 999;
}

/* 弹窗结束  */
/* loading start */
.loading-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  z-index: 999;
}

.loading {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
  border-left: 2px solid #409eff;
  border-right: 2px solid #409eff;
  animation: loading 1s infinite linear;
}

@keyframes loading {
  to {
    transform: rotate(360deg);
  }
}

.slider-loading {
  position: absolute;
  top: calc(50% - 15px);
  left: calc(50% - 15px);
  z-index: 999;
}

/* loading end */

.tips {
  color: #525252;
  line-height: 36px;
  font-size: 18px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rotate-body{
  position: relative;
  width: 100%;
  height: 255px;
}
.rotate-bg {
  position: relative;
  overflow: hidden;
  width: 152px;
  height: 152px;
  margin: 28px auto 24px;
  border: 0;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
}
.rotate-bg img {
  position: relative;
  z-index: 9;
  width: 100%;
  height: 100%;
  pointer-events: none;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
.rotate-bg .rotate-correcting {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcoAAAHLBAMAAAC67sVKAAAAG1BMVEUAAAD////////////////////////////////rTT7CAAAACXRSTlMAzWYMwfVatRptVV/8AAAACXBIWXMAAA7EAAAOxAGVKw4bAAACoklEQVR4nO3ZMW5TURRF0SiZAA8xAMwIUngCwAgo0qNMgYaSoWP7OoklkCjMf886d63Gpf9WcnKd5O4OgBy/Vj/ADA8/Vj/BDPfvVz/BDPsPj6sfYYLd+Lj6Ebb38Hl8Xf0M27sfo8Ew92M0GOZujPxhHmY58od5mGWDYe6PlfHDPM4yfpinWcYP8zTL+GHuqzJ8mDXL8GGeZxk+zPMsw4e5f6mMHubLLKOH+TrL6GG+zjJ6mPu3yuBhvs0yeJgXswwe5sUsg4e5v6yMHeblLHOH+fzp6PDNenr9vvpxNjXGu9WPMEGPSgC4To97qTKHyhwqAYDS416qzKEyh0oAoPS4lypzqMyhEgAoPe6lyhwqc6gEAEqPe6kyh8ocKgGA0uNeqsyhModKAKD0uJcqc6jMoRIAKD3upcocKnOoBABKj3upMofKHCoBgNLjXqrMoTKHSgCg9LiXKnOozKESACg97qXKHCpzqAQASo97qTKHyv/k+XHrd/inCZW7L8szZ1SO9Znb240OmYfKBpnHyvzMU2V8ZlWmZ54rwzNfKhdmTrmXyzOnVr5mjnrbaS9PT9+2f6M/MsMrz5npleNnh8oWX8vcm/mXn7GBbuBeTnADn30maPU5Njuy0++XayPrpm3qBv7uM6dy9bfrlMrVkVMql0fOqOzxf5Ib0KMSAK7T416qzKEyh0oAoPS4lypzqMyhEgAoPe6lyhwqc6gEAEqPe6kyh8ocKgGA0uNeqsyhModKAKD0uJcqc6jMoRIAKD3upcocKnOoBABKj3upMofKHCoBgNLjXqrMoTKHSgCg9LiXKnOozKESACg97qXKHCpzqAQASo97qTKHyhwqAYDS416qzKEyh0oAoPS4lypzqMyhEgAoPe6lyhwqc6jkKr8BG9iGwPT5344AAAAASUVORK5CYII=');
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.rotate-bg .rotate-mask{
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: .5;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  background: #000;
}
.rotate-bg .rotate-icon{
  position: absolute;
  z-index: 11;
  top: 50%;
  left: 50%;
}
.rotate-progress{
  position: relative;
  width: 260px;
  height: 50px;
  margin: 0 auto;
}
.rotate-progress .rotate-progress-bottom{
  position: absolute;
  top: 0;
  left: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  -webkit-border-radius: 100px;
  border-radius: 100px;
  background: #f5f5f5;
  overflow: hidden;
}
.rotate-progress-bottom p{
  position: absolute;
  top: 50%;
  left: 50%;
  height: 22px;
  text-align: center;
  letter-spacing: -.36px;
  color: #4A4A4A;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  line-height: 21px;
  background: #b8b8b8 linear-gradient(to left, transparent, #111 90%, transparent) no-repeat 0 0;
  background-size: 20% 100%;
  background-clip: text;
  text-decoration: none;
  -webkit-text-fill-color: transparent;
  transform: translate(-40%,-50%)!important;
  width: 174px;
  margin: 0!important;
  opacity: 1!important;
  font-size: 14px!important;
  animation: slideShine 2s linear infinite;
}
.rotate-progress-btn {
  position: absolute;
  left: 0;
  top: 0;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background: #fff;
  box-shadow: 0 21px 52px 0 rgba(82, 82, 82, 20%);
  cursor: pointer;
  -moz-user-select: none;
  -o-user-select:none;
  -khtml-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
  -moz-user-drag: none;
  -webkit-user-drag: none;
}
.rotate-progress-btn p{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 22px;
  height: 22px;
  margin-left: -11px;
  margin-top: -11px;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  -moz-user-select: none;
  -o-user-select:none;
  -khtml-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
  -moz-user-drag: none;
  -webkit-user-drag: none;
  pointer-events: none;
  display: inline-block;
  vertical-align: middle;
}
.rotate-black {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAAAbFBMVEUAAAAjIyMfHx8fHx8fHx8gICAhISEfHx8hISEfHx8gICAjIyMfHx8kJCQfHx8gICAgICAgICAfHx8gICAgICAiIiIfHx8gICAgICAgICAfHx8gICAfHx8jIyMmJiYfHx8fHx8tLS0fHx8fHx+BW8KyAAAAI3RSTlMAIqHHsTZAzzDVSBbdGqVgUCi9qVo858G5VOHbyywQ9e8Kg7Z+diwAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAECSURBVFiF7dXbDoIwDAZgQMXDGIgKylQ88P7vaGDcrOlIFwpKpJd/mi/LLv563jyjTRFFSqn83YNIqmaCmXAj0qCeGH79SRMxiLNmOU6MMNS7ZxqBPo6ByHS4wIljD6LACfRxq+kSZtwSN7C71/GSIm/YiDWNQOPfIO44sXMntjQCjdOhiYsDcXUizNhnIyKwG7IRB0rMR6jvErKTgMWOxi2R04jMgUB3LX0vOglYqWjTDkdYip2PMMu61OFzNAJt2m4CnpehiJcOH5RdFgLt+9EJvO91WPETliOH9/1ghOXI4WXNQEgphRAljbBso2O5ky7DR8AjNz3C8+uRog/xV/MBdSiE7loN5hcAAAAASUVORK5CYII=');
}

.rotate-white {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAAAe1BMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////NgkbwAAAAKHRSTlMAIqPTPMmxSMOpQhbXXFA2Mi4oHN/Nn9u39+O/u1QsWBTv6WIQBgyDEGCvjwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAStJREFUWIXt1dluwkAMBVAYaFlS1kDaplACYfv/LyTCeRnrehQXTyrU+vHKOhrNw3Wn8z+tzXZVTZ5fHiDK632y3yUmRLjnIZZZljnn+NcLRP++7Eo/pN2vZgT85ZoYst0dJqAcJkYtETMKX9juNhoBH2dAzDExpfi1iVwT69aIKSIWFPZUhB8bEN+YGEQjYLwMEh8K4k1F+LEB0TUj3tnumOJNk9iOWEUjeCvDOKUwtyeE2wCbNkzwVoZxYkYcVIRfkzoClnWBCaHYDQjY90cK9yrCL+t4hHChFog4Bwl+XmDf18SnPQFfLPT9KUjwYjcgYFnHI4Qjh/uewquKYGWNCeFO/oDgFwqXdZomSVIUzYh6+8hjNMKd1Ixw5J6W4HdSZ1RTff8jxJ+aG9o8l8YcAhW6AAAAAElFTkSuQmCC');
}

.rotate-btn-slider-up{
  background: #fff;
  border: 1px solid #fff;
}

.rotate-btn-slider-active{
  background: #4E6EF2!important;
  border: 1px solid #4E6EF2;
}

.rotate-btn-slider-loading {
  background: #b8b8b8!important;
  border: 1px solid #b8b8b8;
}

.rotate-btn-slider-error{
  background: rgb(230, 65, 65)!important;
  border: 1px solid rgb(230, 65, 65);
}

.rotate-success {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  background: hsla(0,0%,100%,.8);
}
.rotate-success-icon {
  width: 64px;
  height: 64px;
  margin: 15% auto 0;
  
}
.rotate-success-icon img {
  width: 100%;
}
.rotate-success-icon .rotate-success-text {
  color: #1bc300;
  text-align: center;
  margin-top: 16px;
  font-size: 18px;
}
.rotate-icon-success{
  width:66px;
  height:66px;
  margin-left:-33px;
  margin-top:-33px;
  background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAADGCAMAAAC+RQ9vAAAAflBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////vroaSAAAAKXRSTlMA+QIQCOcqPNmjDO+z8+NG69PBrXBMMCQgGhaH3bt4zcd+aGBaNpNUmaTS11cAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAKvSURBVHic7dzZVioxEEZhFBlEVHBiUJxF8v4vePQgQqVBQzqVqor/vlW661u66LkbDYQQQgghhBBCCCGEEEIIIYQQQgghhBD6O11LD5CkubuVHiFBc+cKcCzcZ0/SY9RsqTDuODx2q+6lZ4lvQ2HYQRTOnUvPE5enmEvPE1chikuiMLrlgEJPnsLotu+oD4WWPIXRrXchihlRXEnPExcUeupdFKh4lp4nLij01HskihfpeeJqQqGm5gNRvErPExcUemoOieJdep64ylBMieKgDIXRK0vTbgmKSYkKo+fMJ3dQaGlcoqKTfAWT2Tj5MiuNzzYVpwyKrjsbJV+q14hb8X+DxO3Io3CuxeoYtfIoPhzt5Mv+rk0Vb8lXsLHTzOegihNWBZ+DXdG4OXHsDk9xw7EO6hgwONoDfsWHg6xlkHwt3Mtf1WZdj6fg/DZk/Kvz/8+u4/smecvwDbKOy5FXweXIreDZ5+mcEgX7PvRn6fdAqYL/SGBZaoeMIvXRmafIcHS5ijrqHSt3DqQUKc9cnBPFXVZFOoesItX5ME8xSTtjSCnOsVJFV0CR4oz3tQJF/esPnmLKMWNI9RxaFPWualHFUFBR50rpO/ngsMk3Y0ixDl2K2LsIXsmHHsQVcQ59ihiHRsX+9zu9kF9/VKLY16FVsd+9gJ6il2vGkMLvzHwmv3ihShHu0K0IdWhXhN1DfqVeEXJHP1XMjvLPGNJvDhuK3xxWFD8/e3RPftRXrPjJYUmx22FLsev5widjiu3PrFLF5aH0jCFVnyC+NaioOmwqKg6jisq7DjY6NqTY7bCl2OWwptjusKfY5rCoaKzfWPTVQnqe2BZFKJZv8/rK6Atmls2LUHzvThl9Ncu6Tr/V6qe/tRkhhBBCCCGEEEIIIYQQQgghhBBCCCGEsvQPGVhLJnH2HkwAAAAASUVORK5CYII=');
  -webkit-background-size:100% 100%;
  background-size:100% 100%;
  background-repeat:no-repeat
 }
.rotate-icon-error{
  width:66px;
  height:66px;
  margin-left:-33px;
  margin-top:-33px;
  background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAADGBAMAAAB7teJuAAAAHlBMVEUAAAD///////////////////////////////////8kfJuVAAAACXRSTlMAk6t0BGRKgSwr/eubAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAC3klEQVR4nO3bO04DQQwG4I2UEEpElyPQwRX2BLTp0uYI6bgCQiDmtuS17xmP7d+u8F9bu/qEovVDNE0kEolEIpFIJMLIA/qA9aFacnoC39F+1yq26RN7xfolvVdKTilhkDalCmSbEgY5M1IFcmZgkPbyABJyYUCQK4OGHK8VAKS9PeCXKFklDHJnpFeqaIdB7owvsgiDsBgghMXAIEwGBGEyEAibAUDYDD1EwFBDBAwtRMRQQkQMHUTIUEGEDA1EzFBAxAw5RMEQQxQMKUTFEEJUDBlEyRBBlAwJRM0QQNQMPgRgsCEAgwuBGEwIxOBBQAYLAjI4EJjBgMCMOsSAUYUYMGoQE0YFYsKgIUYMEmLEoCBmDAJixihDDBlFiCGjBDFlFCCmjDzEmJGFGDNyEHNGBmLOWEIcGAuIA2MOcWHMIC6MKcSJMYE4McYQN8YI4sYYII6MHvLsx+ghyZHRQxwZU4gTYwzxYowhbowB4scYII6M7icOnt7IdD9x9IZIpe3/5m6QnuEIGRhukBHDDTJmOEE6xpsjpP/87dwgw+cPPYaWM/qKe0HGX3EvyKQZ8YFMmxEfyKyn8oDMeyoPyKI1tIcsW0N7SKbDtYbkOlxrSLZRt4XkG3VbSGHesISU5g1LSHFssoOUxyY7CDH9WUGo6c8KQg6xNhB6iLWBVGZxC0htFreAVFcKOKS+UsAhjM0ICuFsRlAIa8GDQXgLHgzC3FMhEO6eCoGw1216CH/dpocItoZaiGRrqIWIlp86iGz5qYMId7gaiHSHq4GIV9FyiHwVLYcoNupSiGajLoWoDgMyiO4wIIMo7xsSiPa+IYGozzR8iP5Mw4cA1yYuBLk2cSHQ0YwHwY5mPAh4++NA0NsfBwKfMBmQI8boIdT/ymxARgc5UCV7jHGH/JAlG5Bxgxzokj16NFvVGBcIevvb1RhnCHr7W9UYTfMIvqJpPuAnRCKRSCQSiUT+Rf4Av71JnH03V4sAAAAASUVORK5CYII=');
  -webkit-background-size:100% 100%;
  background-size:100% 100%;
  background-repeat:no-repeat
 }
.rotate-icon-loading{
  width:75px;
  height:41px;
  margin-left:-38px;
  margin-top:-20px;
  background-image:url('data:image/gif;base64,R0lGODlhlgBRAIABAP///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE4MkE3QzA3NDAwQjExRThBNEM0QTI0QTJBOEY0MTM4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE4MkE3QzA4NDAwQjExRThBNEM0QTI0QTJBOEY0MTM4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTgyQTdDMDU0MDBCMTFFOEE0QzRBMjRBMkE4RjQxMzgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTgyQTdDMDY0MDBCMTFFOEE0QzRBMjRBMkE4RjQxMzgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++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');
  -webkit-background-size:100% 100%;
  background-size:100% 100%;
  background-repeat:no-repeat
 }

/* tips */
.slider-refresh {
  position: absolute;
  cursor: pointer;
  left: 0px;
  top: 0px;
  z-index: 2;
  font-size: 30px;
  height: 30px;
  line-height: 30px;
}
.slider-tools-btn {
  position: relative;
  width: 25px;
  height: 25px;
}

.lang-tips a {
  text-decoration: none;
  color: #409eff;
}

.lang-tips-item {
  position: fixed;
  font-size: 14px;
  color: #525252;
  max-width: 285px;
  margin-top: 40px;
  margin-left: 0;
  background: white;
  padding: 7px 10px;
  border-radius: 4px;
	margin-left: -8px;
}

.lang-tips-left {
  margin-top: -10px;
  margin-left: -140px;
}

.lang-tips-left:after {
  content: "";
  position: absolute;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #000;
  border-right: 10px solid transparent;
  right: -18px;
  top: 12px;
}

.lang-tips-bottom {
  margin-top: 50px;
}

.lang-tips-bottom:after {
  content: "";
  position: absolute;
  border-top: 10px solid transparent;
  border-bottom: 10px solid #fff;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  /* right: calc(50% - 10px); */
  left: 10px;
  top: -20px;
}
.slider-tools-btn img {
  width: 100%;
  height: 100%;
}
/* tips */

.rotate-shock {
    animation-delay: 0s;
    animation-name: shock;
    animation-duration: .1s;
    animation-iteration-count: 5;
    animation-direction: normal;
    animation-timing-function: linear;
}

.slider-shock {
  animation-delay: 0s;
  animation-name: shock;
  animation-duration: .1s;
  animation-iteration-count: 5;
  animation-direction: normal;
  animation-timing-function: linear;
}
.slider-start-shock{
  animation-delay: 0s;
  animation-name: startShock;
  animation-duration: .8s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-timing-function: ease-in-out;
}
@keyframes shock {
    0% {
        margin-left: 2px;
    }
    100% {
        margin-left: -2px;
    }
}
@keyframes startShock {
    0% {
        margin-left: 18px;
    }
    20% {
        margin-left: 0px;
    }
    40% {
        margin-left: 8px;
    }
    60% {
      margin-left: 0px;
    }
    80% {
      margin-left: 4px;
    }
    100% {
        margin-left: 0px;
    }
}
@keyframes slideShine{
  0%{
      background-position:0 0
  }
  100%{
      background-position:100% 100%
  }
}
</style>