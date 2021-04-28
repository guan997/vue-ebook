<template>
<!-- 书城 -->
  <div class="book-store">
    <keep-alive>
      <transition :name="transitionName">
        <router-view class="child-view"/>
      </transition>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import { os } from '@/utils/utils'

  export default {
    data() {
      return {
        transitionName: ''
      }
    },
    computed: {
      os() {
        return os()
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (to.query.key) {
          vm.menuIndex = parseInt(to.query.key)
        }
      })
    },
    beforeRouteUpdate(to, from, next) {
      if (to.meta.key > from.meta.key) {
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
      next()
    }
  }
  window.onload = function() {
    document.addEventListener('touchstart', function(event) {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    })
    document.addEventListener('gesturestart', function(event) {
      event.preventDefault()
    })
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-store {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;
    overflow: hidden;
    .child-view {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      min-width: 200px;
      max-width: 640px;
      transform: translate3d(0, 0, 0);
      opacity: 1;
      &.slide-left-enter, &.slide-right-leave-to {
        transform: translate3d(100%, 0, 0);
        opacity: 0;
      }
      &.slide-left-leave-to, &.slide-right-enter {
        transform: translate3d(-100%, 0, 0);
        opacity: 0;
      }
      &.slide-left-enter-active, &.slide-left-leave-active {
        transition: all .2s linear;
      }
    }
  }
</style>
