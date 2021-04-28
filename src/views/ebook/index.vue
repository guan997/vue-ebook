<template>
<!-- ebook组件 -->
  <div class="ebook" ref="ebookView">
    <ebook-bookmark></ebook-bookmark>
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
    <router-view></router-view>
    <ebook-menu></ebook-menu>
    <ebook-footer></ebook-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引用组件
  import EbookTitle from '@/components/ebook/EbookTitle'
  import EbookMenu from '@/components/ebook/EbookMenu'
  import { ebookMixin } from '@/utils/mixin'
  import { getReadTime, saveReadTime } from '../../utils/localStorage'
  import EbookHeader from '../../components/ebook/EbookHeader'
  import EbookFooter from '../../components/ebook/EbookFooter'
  import EbookBookmark from '../../components/ebook/EbookBookmark'

  export default {
    mixins: [ebookMixin],
    // 注册组件
    components: {
      EbookBookmark,
      EbookFooter,
      EbookHeader,
      EbookTitle,
      EbookMenu
    },
    watch: {
      offsetY(v) {
        if (this.isPaginating !== null && this.isPaginating === false && !this.menuVisible) {
          if (v === 0) {
            this.restore()
          } else if (v > 0) {
            this.move(v)
          }
        }
      }
    },
    methods: {
      restore() {
        this.$refs.ebookView.style.top = 0
        this.$refs.ebookView.style.transition = 'all .2s linear'
        setTimeout(() => {
          this.$refs.ebookView.style.transition = ''
        }, 200)
      },
      move(offsetY) {
        this.$refs.ebookView.style.top = offsetY + 'px'
      },
      startLoopReadTime() {
        let readTime = getReadTime(name)
        if (!readTime) {
          readTime = 0
        }
        this.task = setInterval(() => {
          readTime++
          if (readTime % 30 === 0) {
            saveReadTime(this.fileName, readTime)
          }
        }, 1000)
      }
    },
    created() {
      this.setGlobalTheme()
    },
    mounted() {
      this.startLoopReadTime()
    },
    beforeDestroy() {
      if (this.task) {
        clearInterval(this.task)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
</style>
