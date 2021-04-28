<template>
<!-- 字体弹窗组件 -->
  <transition name="popup-slide-up">
    <!-- fontFamilyVisible字体弹框显示的条件 -->
    <div class="ebook-popup-list" v-if="fontFamilyVisible">
      <!-- 标题栏 -->
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hideFontFamilySetting">
          <!-- 向下的图标 -->
          <span class="icon-down2"></span>
        </div>
        <!-- ”选择字体“ 文字-->
        <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
      </div>
      <!-- 字体列表 -->
      <div class="ebook-popup-list-wrapper">
        <!-- 字体数组 字体setFontFamily被点击 -->
        <div class="ebook-popup-item" v-for="(item, index) in fontFamily" :key="index"
             @click="setFontFamily(item.font)">
             <!-- 文字 isSelected判断是否被选中  item.font文字的内容-->
          <div class="ebook-popup-item-text" :class="{'selected': isSelected(item)}">{{item.font}}</div>
          <!-- 图标 -->
          <div class="ebook-popup-item-check" v-if="isSelected(item)">
            <!-- 选中图标 -->
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { ebookMixin } from '@/utils/mixin'

  export default {
    mixins: [ebookMixin],
    methods: {
      // isSelected字体是否被选中
      isSelected(item) {
        // 场景对象下是否有font
        return this.defaultFontFamily === item.font
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-popup-list {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 350;
    width: 100%;
    font-size: 0;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .1);
    .ebook-popup-title {
      position: relative;
      text-align: center;
      padding: px2rem(15);
      border-bottom: px2rem(1) solid #b8b9bb;
      box-sizing: border-box;
      @include center;
      // 文本
      .ebook-popup-title-text {
        font-size: px2rem(14);
        font-weight: bold;
      }
      // 图标
      .ebook-popup-title-icon {
        position: absolute;
        left: px2rem(15);
        top: 0;
        height: 100%;
        @include center;
        // 向下的图标 
        .icon-down2 {
          font-size: px2rem(16);
          font-weight: bold;
        }
      }
    }
    .ebook-popup-list-wrapper {
      .ebook-popup-item {
        display: flex;
        padding: px2rem(15);
        // 左侧字体
        .ebook-popup-item-text {
          flex: 1;
          // 字体大小
          font-size: px2rem(14);
          text-align: left;
          // 选中文字
          &.selected {
            color: #346cb9;
            font-weight: bold;
          }
        }
        // 右侧图标
        .ebook-popup-item-check {
          flex: 1;
          text-align: right;
          .icon-check {
            font-size: px2rem(14);
            // 图标加粗蓝色显示
            font-weight: bold;
            color: #346cb9;
          }
        }
      }
    }
  }
</style>
