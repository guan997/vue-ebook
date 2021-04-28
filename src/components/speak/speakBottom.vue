<template>
    <!-- 最下方的底部播放面板 -->
  <div class="bottom-wrapper" :class="{'hide-play': !showPlay}">
    <div class="bottom-playing-wrapper" @click.stop.prevent="onPlayingCardClick" v-if="showPlay">
      <div class="bottom-playing-left">
        <!-- 点击togglePlay切换播放状态 -->
        <div class="icon-play-wrapper" @click.stop.prevent="togglePlay">
          <!-- 播放 -->
          <span class="icon-play_go" v-if="!isPlaying"></span>
          <!-- 暂停 -->
          <span class="icon-play_pause" v-else></span>
        </div>
      </div>
      <div class="bottom-playing-right">
        <div class="bottom-playing-chapter-text">
          <span class="chapter-label">{{chapter ? chapter.label : ''}}</span>
          <span class="bottom-playing-page-text" v-if="currentSectionIndex && currentSectionTotal">( {{currentSectionIndex}} / {{currentSectionTotal}} )</span>
        </div>
        <div class="bottom-playing-page-text">{{playInfo ? playInfo.currentMinute : '00'}}:{{playInfo ? playInfo.currentSecond : '00'}} / {{playInfo ? playInfo.totalMinute : '00'}}:{{playInfo ? playInfo.totalSecond : '00'}}</div>
      </div>
    </div>
    <div class="bottom-btn-wrapper">
      <span class="bottom-btn-text">{{$t('detail.addOrRemoveShelf')}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      chapter: Object,//章节
      currentSectionIndex: Number,//当前章节
      currentSectionTotal: Number,//总章节
      showPlay: Boolean,//是否显示
      isPlaying: Boolean,//是否正在播放
      playInfo: Object//播放信息从父组件传入
    },
    methods: {
      // 切换播放状态
      togglePlay() {
        // 调用父组件的togglePlay()方法
        this.$parent.togglePlay()
      },
      onPlayingCardClick() {
        this.$emit('onPlayingCardClick')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .bottom-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 110;
    width: 100%;
    height: px2rem(116);
    background: white;
    box-shadow: 0 px2rem(-2) px2rem(2) 0 rgba(0, 0, 0, .1);
    &.hide-play {
      height: px2rem(52);
    }
    .bottom-playing-wrapper {
      display: flex;
      width: 100%;
      height: px2rem(64);
      .bottom-playing-left {
        flex: 0 0 px2rem(70);
        width: px2rem(70);
        @include center;
        .icon-play-wrapper {
          flex: 0 0 px2rem(100);
          @include center;
          &:active {
            opacity: .5;
          }
          .icon-play_go {
            font-size: px2rem(40);
            color: $color-blue;
          }
          .icon-play_pause {
            font-size: px2rem(40);
            color: $color-blue;
          }
        }
      }
      .bottom-playing-right {
        flex: 1;
        padding-right: px2rem(15);
        box-sizing: border-box;
        @include columnLeft;
        .bottom-playing-chapter-text {
          max-width: px2rem(305);
          color: #333;
          font-size: px2rem(16);
          line-height: px2rem(19);
          @include ellipsis;
        }
        .bottom-playing-page-text {
          color: #666;
          font-size: px2rem(10);
          margin-top: px2rem(5);
        }
      }
    }
    .bottom-btn-wrapper {
      width: 100%;
      height: px2rem(52);
      border-top: px2rem(1) solid #eee;
      box-sizing: border-box;
      @include center;
      .bottom-btn-text {
        font-size: px2rem(14);
        color: $color-blue;
        font-weight: bold;
      }
    }
  }
</style>
