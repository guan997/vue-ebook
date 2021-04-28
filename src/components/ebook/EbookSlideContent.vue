<template>
  <!-- 阅读器侧边栏组件  阅读进度、目录、全文搜索-->
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <!-- 搜索框 -->
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <!-- 搜索框输入 -->
        <input
          class="slide-contents-search-input"
          type="text"
          :placeholder="$t('book.searchHint')"
          @click="showSearchPage()"
          v-model="searchText"
          @keyup.enter="search()"
          ref="searchInput"
        />
      </div>
      <!-- 搜索框状态 -->
      <div
        class="slide-contents-search-cancel"
        v-if="searchVisible"
        @click="hideSearchPage()"
      >
        {{ $t("book.cancel") }}
      </div>
    </div>
    <!-- 阅读器左边目录 自适应布局优化-->
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <!-- 书籍封面 -->
      <div class="slide-contents-book-img-wrapper">
        <img v-lazy="cover" class="slide-contents-book-img" />
      </div>
      <!-- 封书籍信息 -->
      <div class="slide-contents-book-info-wrapper">
        <!-- 标题 -->
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{
            metadata.title
          }}</span>
        </div>
        <!-- 作者 -->
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">{{
            metadata.creator
          }}</span>
        </div>
      </div>
      <!-- 已读和进度 -->
      <div class="slide-contents-book-progress-wrapper">
        <!-- 阅读进度 -->
        <div class="slide-contents-book-progress">
          <span class="progress">{{ progress + "%" }}</span>
          <span class="progress-text">{{ $t("book.haveRead2") }}</span>
        </div>
        <!-- 已读时间 -->
        <div class="slide-contents-book-time">{{ getReadTime() }}</div>
      </div>
    </div>
    <!-- 搜索的时候，把目录列表隐藏掉，然后把搜索列表展示出来 -->
    <scroll
      class="slide-contents-list"
      :top="156"
      :bottom="48"
      ref="scroll"
      v-show="!searchVisible"
    >
      <!-- 循环遍历出目录 -->
      <div
        class="slide-contents-item"
        v-for="(item, index) in navigation"
        :key="index"
        @click="display(item.href)"
      >
        <!-- 当前所读章节 -->
        <span
          class="slide-contents-item-label"
          :class="{ selected: section === index }"
          >{{ item.label.trim() }}</span
        >
        <span class="slide-contents-item-page">{{ item.page }}</span>
      </div>
    </scroll>
    <!-- 搜索列表 -->
    <scroll
      class="slide-search-list"
      :top="66"
      :bottom="48"
      ref="scroll"
      v-show="searchVisible"
    >
      <div
        class="slide-search-item"
        v-for="(item, index) in searchList"
        :key="index"
        v-html="item.excerpt"
        @click="display(item.cfi, true)"
      ></div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import Scroll from "../Scroll";

export default {
  mixins: [ebookMixin],
  components: {
    Scroll,
  },
  data() {
    return {
      searchText: "",
      searchVisible: false,
      searchList: null,
    };
  },
  methods: {
    showSearchPage() {
      this.searchVisible = true;
    },
    hideSearchPage() {
      this.searchVisible = false;
    },
    // 搜索 搜索关键字高亮+搜索结果高亮显示
    search() {
      this.doSearch(this.searchText).then((result) => {
        this.searchList = result.map((item) => {
          // 搜索内容高亮显示
          item.excerpt = item.excerpt.replace(
            this.searchText,
            `<span class="content-search-text">${this.searchText}</span>`
          );
          return item;
        });
        this.$refs.searchInput.blur();
      });
    },
    // epub.js集成的全文搜索功能实现
    doSearch(q) {
      // 该方法 中，q为输入的关键词，在全篇电子书中，查找关键词，返回关键词所在的位置。
      return Promise.all(
        // spineItems表示section章节 section章节和目录很相似，大体一一对应
        // section用管理当前章节下的所有信息（下方的item就是section）
        this.currentBook.spine.spineItems.map(
          // 调用section.load方法
          // 将book对象作为上下文传进去 这样section就拿到了资源 获取了文本信息
          // 获取信息之后调用find方法传入搜索关键字，这样就可以实现章节全文搜索检索
          // 本质就是map()将全文信息搜索遍历一次，查询完之后使用了Promise.all统一处理获得results
          // finally()表示当异步执行完毕之后执行这个方法item.unload会将资源进行释放
          // 因为加载一个html到内存中会占用几百k甚至1m
          (item) =>item.load(this.currentBook.load.bind(this.currentBook)).then(item.find.bind(item, q)).finally(item.unload.bind(item))
        )
        // 得到的是一组多维数组因为得到的是二维数组，所以需要像 目录那样降维。
        // concat() 方法用于连接两个或多个数组。
        // Promise.resolve处理将多维数组转化为一维数组
        // concat()无法连接多维数组，通过apply()把数组当做对象传入参数数组实现数组降维
      ).then((results) => Promise.resolve([].concat.apply([], results)))
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.ebook-slide-contents {
  width: 100%;
  font-size: 0;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      border-radius: px2rem(3);
      @include center;
      .slide-contents-search-icon {
        flex: 0 0 px2rem(28);
        @include center;
        .icon-search {
          font-size: px2rem(12);
        }
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(32);
        font-size: px2rem(14);
        background: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include right;
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(45);
      box-sizing: border-box;
      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      @include columnLeft;
      .slide-contents-book-title {
        font-size: px2rem(14);
        line-height: px2rem(16);
        padding: 0 px2rem(10);
        box-sizing: border-box;
        @include left;
        .slide-contents-book-title-text {
          @include ellipsis2(1);
        }
      }
      .slide-contents-book-author {
        font-size: px2rem(12);
        line-height: px2rem(14);
        padding: 0 px2rem(10);
        box-sizing: border-box;
        margin-top: px2rem(5);
        @include left;
        .slide-contents-book-author-text {
          @include ellipsis2(1);
        }
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      @include columnLeft;
      .slide-contents-book-progress {
        .progress {
          font-size: px2rem(14);
          line-height: px2rem(16);
        }
        .progress-text {
          font-size: px2rem(12);
          line-height: px2rem(14);
          margin-left: px2rem(2);
        }
      }
      .slide-contents-book-time {
        font-size: px2rem(12);
        line-height: px2rem(14);
        margin-top: px2rem(5);
      }
    }
  }
  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      display: flex;
      padding: px2rem(20) 0;
      box-sizing: border-box;
      .slide-contents-item-label {
        flex: 1;
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include ellipsis;
      }
      .slide-contents-item-page {
        flex: 0 0 px2rem(30);
        font-size: px2rem(10);
        @include right;
      }
    }
  }
  .slide-search-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item {
      font-size: px2rem(14);
      line-height: px2rem(16);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>
