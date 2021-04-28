<template>
<!-- 标题栏 -->
  <transition name="slide-down">
    <!-- 传递menuVisible值，用来控制显示隐藏 -->
    <div class="title-wrapper" v-show="menuVisible">
      <!-- 左 返回按钮-->
      <div class="left" @click="back">
        <span class="icon-back"></span>
      </div>
      <!-- 右 -->
      <div class="right">
        <div class="icon-wrapper" @click="gotoBookStore">
          <!-- 书架图标 -->
          <span class="icon-shelf"></span>
        </div>
        <!-- <div class="icon-wrapper"> -->
          <!-- 购物车图标 -->
          <!-- <span class="icon-cart"></span> -->
        <!-- </div> -->
        <!-- <div class="icon-wrapper" @click="gotoBookStore"> -->
          <!-- 更多图标 -->
          <!-- <span class="icon-more"></span>
        </div> -->
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { ebookMixin } from '@/utils/mixin'
  export default {
    mixins: [ebookMixin],
    methods: {
      back() {
        this.$router.go(-1)
      },
      gotoBookStore() {
        this.$router.push('/book-store')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 200;
    display: flex;
    width: 100%;
    height: px2rem(48);
    box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, .15);
    // 标题栏大小
    font-size: px2rem(22);
    .left {
      flex: 0 0 px2rem(37);
      @include right;
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .icon-wrapper {
        flex: 0 0 px2rem(37);
        @include left;
      }
    }
  }
</style>
