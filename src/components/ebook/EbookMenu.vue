<template>
<!-- 菜单栏 -->
  <div class="ebook-menu">
    <transition name="slide-up">
      <!-- 菜单栏选项设置 -1: 不显示， 0：字号， 1：主题， 2：进度， 3： 目录 -->
      <!-- 传递menuVisible值，用来控制菜单栏显示隐藏 -->
      <!-- menuVisible不显示或者settingVisible>=0就隐藏阴影 hide-box-shadow -->
      <div class="menu-wrapper" :class="{'hide-box-shadow': settingVisible >= 0 || !menuVisible}"
           v-show="menuVisible">
           <!-- 目录 -->
        <div class="icon-wrapper" :class="{'selected': settingVisible === 3}">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <!-- 进度 -->
        <div class="icon-wrapper" :class="{'selected': settingVisible === 2}">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <!-- 主题 -->
        <div class="icon-wrapper" :class="{'selected': settingVisible === 1}">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <!-- 字号 -->
        <div class="icon-wrapper" :class="{'selected': settingVisible === 0}">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <!-- 引用字号设置面板 -->
    <ebook-setting-font></ebook-setting-font>
    <!-- 引用字体设置面板 -->
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <!-- 引用主题设置面板 -->
    <ebook-setting-theme></ebook-setting-theme>
    <!-- 引用进度面板 -->
    <ebook-setting-progress></ebook-setting-progress>
    <!-- 引用目录面板 -->
    <ebook-slide></ebook-slide>
    <!-- 引用听书图标 -->
    <ebook-speaking-icon></ebook-speaking-icon>
  </div>
</template>

<script type="text/ecmascript-6">
  import EbookSettingFont from './EbookSettingFont'
  import EbookSettingFontPopup from './EbookSettingFontPopup'
  import EbookSettingTheme from './EbookSettingTheme'
  import EbookSettingProgress from './EbookSettingProgress'
  import EbookSpeakingIcon from './EbookSpeakingIcon'

  import EbookSlide from './EbookSlide'
  import { ebookMixin } from '@/utils/mixin'

  export default {
    mixins: [ebookMixin],
    components: {
      EbookSettingFontPopup,
      EbookSlide,
      EbookSettingProgress,
      EbookSettingFont,
      EbookSettingTheme,
      EbookSpeakingIcon
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 200;
    display: flex;
    width: 100%;
    height: px2rem(48);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    // 图标大小
    font-size: px2rem(22);
    &.hide-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-progress {
        font-size: px2rem(24);
      }
      .icon-A {
        font-size: px2rem(20);
      }
    }
  }
</style>
