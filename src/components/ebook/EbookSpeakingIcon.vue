<template>
    <!-- 菜单栏听书图标 -->
  <transition name="fade">
    <!-- <div class="ebook-speaking-icon" :style="style" v-show="menuVisible" @click="onClick"> -->
      <!-- <span class="icon-headphone"></span> -->
    <!-- </div> -->
  </transition>
</template>

<script type="text/ecmascript-6">
  import { realPx } from '../../utils/utils'
  import { reset } from '@/utils/book'
  import { ebookMixin } from '../../utils/mixin'

  export default {
    mixins: [ebookMixin],
    watch: {
      settingVisible(v) {
        if (v >= 0) {
          this.setSpeakingIconBottom(realPx(148))
        } else {
          this.setSpeakingIconBottom(realPx(58))
        }
      }
    },
    computed: {
      style() {
        return {
          bottom: this.speakingIconBottom + 'px'
        }
      }
    },
    methods: {
      onClick() {
        this.$router.push({
          path: '/book-store/book-speaking',
          query: {
            fileName: this.fileName
          }
        })
        reset(this)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-speaking-icon {
    position: absolute;
    bottom: 0;
    right: px2rem(15);
    z-index: 160;
    width: px2rem(50);
    height: px2rem(50);
    background: #3c4049;
    border-radius: 50%;
    transition: bottom .2s linear, opacity .2s linear;
    @include center;
    .icon-headphone {
      font-size: px2rem(20);
      color: #cfcfcf;
    }
  }
</style>
