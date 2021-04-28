<template>
<!-- 热门推荐 -->
  <div class="recommend">
    <!-- recommend热门推荐 -->
    <title-view :label="$t('home.recommend')"></title-view>
    <div class="recommend-list">
      <!-- 循环遍历 -->
      <div class="recommend-item" v-for="(item, index) in data" :key="index" @click="showBookDetail(item)">
        <!-- 封面 -->
        <div class="img-wrapper">
          <img class="img" v-lazy="item.cover">
        </div>
        <!-- 文字 -->
        <div class="content-wrapper">
          <!-- title -->
          <div class="title title-medium" ref="title">{{item.title}}</div>
          <!-- 阅读人数 -->
          <div class="num sub-title" ref="num">{{$t('home.readers').replace('$1', item.readers)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import TitleView from '@/components/home/title'
  import { ebookHome } from '../../utils/mixin'

  export default {
    mixins: [ebookHome],
    components: {
      TitleView
    },
    props: {
      data: Array
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .recommend {
    .recommend-list {
      width: 100%;
      @include top;
      padding: 0 px2rem(5);
      box-sizing: border-box;
      .recommend-item {
        flex: 0 0 33.33%;
        width: 33.33%;
        padding: 0 px2rem(5);
        box-sizing: border-box;
        .img-wrapper {
          @include center;
          .img {
            width: 80%;
          }
        }
        .content-wrapper {
          width: 100%;
          margin-top: px2rem(10);
          @include columnCenter;
          .title {
            text-align: center;
          }
          .num {
            margin-top: px2rem(5);
          }
        }
      }
    }
  }
</style>
