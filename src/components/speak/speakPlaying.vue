<template>
 <!-- speak-playing当我们点击它的时候出现，目录信息前播放小动画 循环生成'|'竖线-->
  <div class="playing-item-wrapper">
    <!-- 循环生成'|'竖线 -->
    <div class="playing-item" :style="item" v-for="(item, index) in styles" :key="index" ref="playingItem"></div>
  </div>
</template>

<script>
  import { px2rem } from '@/utils/utils'

  export default {
    props: {
      number: Number
    },
    computed: {
      // 样式
      styles() {
        const styles = new Array(this.number)
        for (let i = 0; i < styles.length; i++) {
          // 拿到随机整数+rem就是竖线|的高度
          styles[i] = {
            height: px2rem(this.random()) + 'rem'
          }
        }
        return styles
      }
    },
    methods: {
      // 开始动画
      startAnimation() {
        // 定时器，每200毫秒更新一下高度
        this.task = setInterval(() => {
          this.$refs.playingItem.forEach(item => {
            item.style.height = px2rem(this.random()) + 'rem'
          })
        }, 200)
      },
      // 停止动画 停止task任务
      stopAnimation() {
        if (this.task) {
          clearInterval(this.task)
        }
      },

      // 竖线|随机长度 0-10  ceil向上取整
      random() {
        return Math.ceil(Math.random() * 10)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .playing-item-wrapper {
    @include center;
    .playing-item {
      flex: 0 0 px2rem(2);
      width: px2rem(2);
      height: px2rem(1);
      background: $color-blue;
      margin-left: px2rem(2);
      transition: all .2s ease-in-out;
      &:first-child {
        margin: 0;
      }
    }
  }
</style>
