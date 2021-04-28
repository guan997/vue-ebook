<template>
<!-- 进度条 -->
  <transition name="slide-up">
    <!-- menuVisible菜单栏显示 -->
    <!-- settingVisible菜单栏选项设置 -1: 不显示， 0：字号， 1：主题， 2：进度， 3： 目录 -->
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <!-- 已阅读时间 -->
          <span class="read-time-text">{{getReadTime()}}</span>
          <span class="icon-forward"></span>
        </div>
        <!-- 进度 -->
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper">
            <!-- 上一章节图标  prevSection-->
            <span class="icon-back" @click="prevSection()"></span>
          </div>
          <!-- 进度线 -->
          <!-- onProgressInput拖动进度条时触发事件
          onProgressChange进度条松开后触发事件，根据进度条数值跳转到指定位置 -->
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 @input="onProgressInput($event.target.value)"
                 @change="onProgressChange($event.target.value)"
                 :value="progress"
                 :disabled="!bookAvailable"
                 ref="progress">
                 <!-- 获取进度条的dom progress -->
          <!-- 下一章节图标 -->
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
        <!-- 章节名称 -->
          <span class="progress-section-text">{{getSectionName}}</span>
          <!-- 阅读进度显示 -->
          <!-- bookAvailable进度显示 -->
          <span class="progress-text">({{bookAvailable ? progress + '%' : $t('book.loading')}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
// 混入
  import { ebookMixin } from '../../utils/mixin'
  import { saveProgress } from '../../utils/localStorage'

  export default {
    mixins: [ebookMixin],
    data() {
      return {
        isProgressLoading: false
      }
    },
    methods: {
      // 上一章节
      prevSection() {
        // 当前章节>0 以及  bookAvailbale书籍解析完毕
        if (this.section > 0 && !this.isProgressLoading) {
          this.isProgressLoading = true
          // 通过setSection将新的值传递给vuex；this.section - 1上一章
          this.setSection(this.section - 1).then(() => {// 修改成功后调用异步方法展示
            // 展示章节的内容
            this.displaySection(() => {
              // 更新进度条背景 
              this.updateProgressBg()
              this.isProgressLoading = false
            })
          })
        }
      },
      // 下一章节
      nextSection() {
        if (this.currentBook.spine.length - 1 > this.section && !this.isProgressLoading) {
          this.isProgressLoading = true
          // 通过setSection将新的值传递给vuex；this.section +1 下一章
          this.setSection(this.section + 1).then(() => {
            // 展示当前章节的内容
            this.displaySection(() => {
              // 更新进度条背景 
              this.updateProgressBg()
              this.isProgressLoading = false
            })
          })
        }
      },
      // 拖动进度条时触发事件
      onProgressInput(progress) {
          // 拖动时进度百分比也随之变化 文字也发生变化
        this.setProgress(progress).then(() => {
          // 更新进度条背景 
          this.updateProgressBg()
        })
      },
      // 进度条松开后触发事件，根据进度条数值跳转到指定位置
      onProgressChange(progress) {
        this.setProgress(progress).then(() => {
          // 更新进度条背景 
          this.updateProgressBg()
          // 展示当前进度所在的页面
          this.displayProgress()
        })
        // 离线保存进度条
        saveProgress(this.fileName, progress)
      },
      // 更新进度条背景 拖动进度条背景色左侧进度条加深表示已经读过
      updateProgressBg() {
        // 设置值进度条背景 0% 100%从左到右
        this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
      }
    },
    // 更新进度条初始状态 对progress初始化
    updated() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 190;
    width: 100%;
    height: px2rem(90);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      // 阅读时间图标
      .read-time-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: px2rem(40);
        @include center;
        font-size: px2rem(12);
      }
      // 进度条
      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .progress {
          flex: 1;
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          // 进度条从左到右渐变色 左边的背景加深 具体css交给js控制
          background: -webkit-linear-gradient(#5d6268, #5d6268) no-repeat, #b4b5b7;
          background-size: 0 100%;
          margin: 0 px2rem(10);
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: #ceced0;
            box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, .15);
            border: none;
          }
        }
        .progress-icon-wrapper {
          flex: 0 0 px2rem(22);
          font-size: px2rem(22);
          @include center;
        }
      }

      // 当前章节的名称
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(5);
        width: 100%;
        font-size: px2rem(12);
        text-align: center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        @include center;
        .progress-section-text {
          line-height: px2rem(15);
          @include ellipsis;
        }
        .progress-text {
        }
      }
    }
  }
</style>
