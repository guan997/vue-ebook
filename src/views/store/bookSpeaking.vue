<template>
<!-- 听书组件 核心界面-->
  <div class="book-speaking">
    <!-- 最上面的标题 -->
    <detail-title @back="back" ref="title"></detail-title>

    <!-- 上下滚动滚动条 -->
    <scroll class="content-wrapper"
            :top="42"
            :bottom="scrollBottom"
            :ifNoScroll="disableScroll"
            @onScroll="onScroll"
            ref="scroll">

      <!-- 图书信息 -->
      <book-info :cover="cover"
                 :title="title"
                 :author="author"
                 :desc="desc"></book-info>

      <!-- 语音朗读图标 -->
      <div class="book-speak-title-wrapper">
        <div class="icon-speak-wrapper">
          <!-- 朗读图标 -->
          <span class="icon-speak"></span>
        </div>
        <div class="speak-title-wrapper">
          <span class="speak-title">{{$t('speak.voice')}}</span>
        </div>
        <!-- 折叠功能图标 -->
        <div class="icon-down-wrapper" @click="toggleContent">
          <span :class="{'icon-down2': !ifShowContent, 'icon-up': ifShowContent}"></span>
        </div>
      </div>

      <!-- 电子书内容详情 -->
      <div class="book-detail-content-wrapper" v-show="ifShowContent">
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.navigation">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
          <div class="book-detail-content-item-wrapper">

            <!-- 目录信息 -->
            <!-- flatNavigation将多级目录转化为一级目录 -->
            <!-- 点击目录的时候调用speak方法 -->
            <div class="book-detail-content-item" v-for="(item, index) in flatNavigation" :key="index"
                 @click="speak(item, index)">
                 <!-- speakPlaying当我们点击它的时候出现，目录信息前面的小播放动画  循环生成'|'竖线-->
                 <!-- number竖线的长度 -->
              <speak-playing v-if="playingIndex === index"
                             :number="5"
                             ref="speakPlaying"></speak-playing>
                             <!-- item.label目录信息 -->
              <div class="book-detail-content-navigation-text" :class="{'is-playing': playingIndex === index}"
                   v-if="item.label">{{item.label}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 播放器  引入播放器但没有在界面显示-->
      <!-- audio的工作过程，audio在bottom点击播放时开始初始化 -->
      <!-- 设置src后就会调用onCanPlay -->
      <!-- onTimeUpdate表示在播放过程中调用的事件 更新时间 -->
      <!-- ended播放完成的时候调用 （重置，更新播放进度条） -->
      <audio @canplay="onCanPlay"
             @timeupdate="onTimeUpdate"
             @ended="onAudioEnded"
             ref="audio"></audio>
    </scroll>

    <!-- 最下方的底部播放面板 -->
    <!-- chapter章节 -->
    <!-- playInfo章节信息传入到子组件 -->
    <bottom :chapter="chapter"
            :currentSectionIndex="currentSectionIndex"
            :currentSectionTotal="currentSectionTotal"
            :showPlay="showPlay"
            :isPlaying.sync="isPlaying"
            :playInfo="playInfo"
            @onPlayingCardClick="onPlayingCardClick"></bottom>
    <!-- 加载虚拟电子书，获取电子书某些信息，让电子书挂载到read下面，分析出电子书的相关信息 -->
    <!-- 设置book-wrapper，但在界面上看不到-->
    <div class="book-wrapper">
      <div id="read"></div>
    </div>
    <!-- 弹出式播放窗口 -->
    <!-- @updateText -->
    <!-- chapter章节 -->
    <speak-window :title="this.chapter ? this.chapter.label : ''"
                  :book="book"
                  :section="section"
                  :currentSectionIndex.sync="currentSectionIndex"
                  :currentSectionTotal="currentSectionTotal"
                  :isPlaying.sync="isPlaying"
                  :playInfo="playInfo"
                  @updateText="updateText"
                  ref="speakWindow"></speak-window>

    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import DetailTitle from '../../components/detail/detaiTitle'
  import BookInfo from '../../components/detail/bookInfo'
  import Scroll from '../../components/Scroll'
  import SpeakPlaying from '../../components/speak/speakPlaying'
  import Bottom from '../../components/speak/speakBottom'
  import SpeakWindow from '../../components/speak/speakMask'
  import Toast from '../../components/shelf/toast'
  import { findBook, getCategoryName } from '../../utils/book'
  import { download, flatList } from '../../api/book'
  import { getLocalForage } from '../../utils/localForage'
  import { realPx } from '../../utils/utils'
  import Epub from 'epubjs'

  global.ePub = Epub

  export default {
    components: {
      DetailTitle,
      BookInfo,
      Scroll,
      SpeakPlaying,
      Bottom,
      SpeakWindow,
      Toast
    },
    computed: {
      //当前要播放的时间（秒）转化为分钟
      currentMinute() {
        // m=秒/60
        const m = Math.floor(this.currentPlayingTime / 60)
        // 小于10前补0
        return m < 10 ? '0' + m : m
      },
      //秒数=当前要播放的时间（秒） - 分钟数
      currentSecond() {
        const s = Math.floor(this.currentPlayingTime - parseInt(this.currentMinute) * 60)
        // 小于10前补0
        return s < 10 ? '0' + s : s
      },
      // 总分钟
      totalMinute() {
        // 总的播放时间/60
        const m = Math.floor(this.totalPlayingTime / 60)
        // 小于10前补0
        return m < 10 ? '0' + m : m
      },
      // 总秒数 = 总播放时长 - 总分钟的秒数
      totalSecond() {
        const s = Math.floor(this.totalPlayingTime - parseInt(this.totalMinute) * 60)
        return s < 10 ? '0' + s : s
      },
      // 剩余分钟 =  总时长-当前播放的时长
      leftMinute() {
        const m = Math.floor((this.totalPlayingTime - this.currentPlayingTime) / 60)
        return m < 10 ? '0' + m : m
      },
      // 剩余秒数 = 总时长-当前播放的时长 - 当前播放的分钟
      leftSecond() {
        const s = Math.floor((this.totalPlayingTime - this.currentPlayingTime) - parseInt(this.leftMinute) * 60)
        return s < 10 ? '0' + s : s
      },

      // 章节信息
      playInfo() {
        // 当audioCanPlay准备好，进入播放状态
        if (this.audioCanPlay) {
          return {
            // 当前播放时间分
            currentMinute: this.currentMinute,
            // 秒
            currentSecond: this.currentSecond,
            // 总时间
            totalMinute: this.totalMinute,
            // 总秒
            totalSecond: this.totalSecond,
            // 剩余分钟
            leftMinute: this.leftMinute,
            // 剩余秒
            leftSecond: this.leftSecond
          }
        } else {
          return null
        }
      },
      lang() {
        return this.metadata ? this.metadata.language : ''
      },
      disableScroll() {
        if (this.$refs.speakWindow) {
          return this.$refs.speakWindow.visible
        } else {
          return false
        }
      },
      showPlay() {
        return this.playingIndex >= 0
      },
      scrollBottom() {
        return this.showPlay ? 116 : 52
      },
      // 章节
      chapter() {
        return this.flatNavigation[this.playingIndex]
      },
      desc() {
        if (this.description) {
          return this.description.substring(0, 100)
        } else {
          return ''
        }
      },
      flatNavigation() {
        if (this.navigation) {
          return Array.prototype.concat.apply([], Array.prototype.concat.apply([], this.doFlatNavigation(this.navigation.toc)))
        } else {
          return []
        }
      },
      category() {
        return this.bookItem ? getCategoryName(this.bookItem.category) : ''
      },
      title() {
        return this.metadata ? this.metadata.title : ''
      },
      author() {
        return this.metadata ? this.metadata.creator : ''
      }
    },
    data() {
      return {
        bookItem: null,
        book: null,
        rendition: null,
        metadata: null,
        cover: null,
        navigation: null,
        description: null,
        ifShowContent: true,
        playingIndex: -1,
        paragraph: null, //文字
        currentSectionIndex: null, //当前章节
        currentSectionTotal: null, //总章节
        section: null, //章节
        isPlaying: false, //是否正在播放
        audio: null,
        audioCanPlay: false, //是否准备好了play
        currentPlayingTime: 0, //当前播放到哪里
        totalPlayingTime: 0, // 总共要播放的时间
        playStatus: 0, //播放状态 0 - 未播放，1 - 播放中，2 - 暂停中
        toastText: '',
        isOnline: false
      }
    },
    methods: {
      // 播放完成后调用 播放结束后自动停下来，并且按钮变成播放状态（重置，更新播放进度条）
      onAudioEnded() {
        // resetPlay正在播放时，将整个播放取消掉
        this.resetPlay()
        // 更新当前播放时间 = 当前时间 （总时间）
        this.currentPlayingTime = this.$refs.audio.currentTime
        // 百分比
        const percent = Math.floor((this.currentPlayingTime / this.totalPlayingTime) * 100)
        // 大的播放器面板刷新进度百分比
        this.$refs.speakWindow.refreshProgress(percent)
      },
      // onTimeUpdate表示在播放过程中浏览器不停地调用 更新播放时间
      onTimeUpdate() {
        // 传入当前播放时间
        this.currentPlayingTime = this.$refs.audio.currentTime
        // 当前播放百分比 = 当前播放时间 / 总时间 * 100
        const percent = Math.floor((this.currentPlayingTime / this.totalPlayingTime) * 100)
        // 大的听书播放面板 refreshProgress刷新进度百分比
        this.$refs.speakWindow.refreshProgress(percent)
      },

      // 设置src后就会调用onCanPlay 即使不播放CanPlay也会被设置， 由浏览器进行调用
      onCanPlay() {
        // audioCanPlay = true可以播放
        this.audioCanPlay = true
        // 当前播放到哪里
        this.currentPlayingTime = this.$refs.audio.currentTime
        // 总共要播放的时间
        this.totalPlayingTime = this.$refs.audio.duration
      },
      findBookFromList(fileName) {
        flatList().then(response => {
          if (response.status === 200) {
            const bookList = response.data.data.filter(item => item.fileName === fileName)
            if (bookList && bookList.length > 0) {
              this.bookItem = bookList[0]
              this.init()
            }
          }
        })
      },
      init() {
        const fileName = this.$route.query.fileName
        if (!this.bookItem) {
          this.bookItem = findBook(fileName)
        }
        if (this.bookItem) {
          getLocalForage(fileName, (err, blob) => {
            if (err || !blob) {
              // this.downloadBook(fileName)
              this.isOnline = true
              const opf = this.$route.query.opf
              if (opf) {
                this.parseBook(opf)
              }
            } else {
              this.isOnline = false
              this.parseBook(blob)
            }
          })
        } else {
          this.findBookFromList(fileName)
        }
      },
      downloadBook(fileName) {
        download(
          this.bookItem,
          () => {
            getLocalForage(fileName, (err, blob) => {
              if (err) {
                return
              }
              this.parseBook(blob)
            })
          })
      },
      parseBook(blob) {
        this.book = new Epub(blob)
        this.book.loaded.metadata.then(metadata => {
          this.metadata = metadata
        })
        if (this.isOnline) {
          this.book.coverUrl().then(url => {
            this.cover = url
          })
        } else {
          this.book.loaded.cover.then(cover => {
            this.book.archive.createUrl(cover).then(url => {
              this.cover = url
            })
          })
        }
        this.book.loaded.navigation.then(nav => {
          this.navigation = nav
        })
        this.display()
      },
      back() {
        this.$router.go(-1)
      },
      onScroll(offsetY) {
        if (offsetY > realPx(42)) {
          this.$refs.title.showShadow()
        } else {
          this.$refs.title.hideShadow()
        }
      },
      toggleContent() {
        this.ifShowContent = !this.ifShowContent
      },
      display() {
        const height = window.innerHeight * 0.9 - realPx(40) - realPx(54) - realPx(46) - realPx(48) - realPx(60) - realPx(44)
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: height,
          method: 'default'
        })
        this.rendition.display()
      },
      doFlatNavigation(content, deep = 1) {
        const arr = []
        content.forEach(item => {
          item.deep = deep
          arr.push(item)
          if (item.subitems && item.subitems.length > 0) {
            arr.push(this.doFlatNavigation(item.subitems, deep + 1))
          }
        })
        return arr
      },

      // 读方法
      speak(item, index) {
        // resetPlay正在播放时，将整个播放取消掉
        this.resetPlay()
        // 播放目录索引之余index点击的哪一个目录
        this.playingIndex = index
        this.$nextTick(() => {
          // 滚动条
          this.$refs.scroll.refresh()
        })
        // 判断章节是否存在
        if (this.chapter) {
          // 根据chapter.href获取section
          this.section = this.book.spine.get(this.chapter.href)
          // 获取位置信息并且展示出来
          this.rendition.display(this.section.href).then(section => {
            // 获取currentPage位置信息
            const currentPage = this.rendition.currentLocation()
            // 当前要渲染的页面要渲染哪些文本
            const cfibase = section.cfiBase
            const cfistart = currentPage.start.cfi.replace(/.*!/, '').replace(/\)/, '')
            const cfiend = currentPage.end.cfi.replace(/.*!/, '').replace(/\)/, '')
            this.currentSectionIndex = currentPage.start.displayed.page
            this.currentSectionTotal = currentPage.start.displayed.total

            // epubcfi主要目的是获取文本
            const cfi = `epubcfi(${cfibase}!,${cfistart},${cfiend})`
            console.log(currentPage, cfi, cfibase, cfistart, cfiend)
            // 拿到epubcfi之后通过book.getRange获得对应文本
            this.book.getRange(cfi).then(range => {
              let text = range.toLocaleString()
              // 转义字符替换操作
              text = text.replace(/\s(2,)/g, '')
              text = text.replace(/\r/g, '')
              text = text.replace(/\n/g, '')
              text = text.replace(/\t/g, '')
              text = text.replace(/\f/g, '')
              // 更新文本
              this.updateText(text)
            })
          })
        }
      },
      showToast(text) {
        this.toastText = text
        this.$refs.toast.show()
      },
      // 点击togglePlay切换播放状态
      togglePlay() {
        //如果isPlaying为空 判断是否处于播放状态
        if (!this.isPlaying) {
          // playStatus播放状态码===0
          if (this.playStatus === 0) {
            // 播放
            this.play()
            // playStatus播放状态码===2暂停
          } else if (this.playStatus === 2) {
            // 继续播放
            this.continuePlay()
          }
        } else { // 不为空暂停播放
          this.pausePlay()
        }
      },
      // resetPlay正在播放时，将整个播放取消掉
      resetPlay() {
        // 播放播放状态码为1，播放时
        if (this.playStatus === 1) {
          // 暂停播放
          this.pausePlay()
        }
        //播放状态置于未播放
        this.isPlaying = false
        // 播放播放状态码置为0，未播放
        this.playStatus = 0
      },
      // 播放
      play() {
        // 传入paragraph合成语音 ！！！！
        this.createVoice(this.paragraph)
      },
      // 继续播放
      continuePlay() {
        // 调用play()方法
        this.$refs.audio.play().then(() => {
        // 开始正在播放的动画
          this.$refs.speakPlaying[0].startAnimation()
          // 播放状态设置为true
          this.isPlaying = true
        // 播放状态设置为1播放
          this.playStatus = 1
        })
      },
      // 暂停播放
      pausePlay() {
        // pause暂停播放
        this.$refs.audio.pause()
        // 停止正在播放的播放动画!!!
        this.$refs.speakPlaying[0].stopAnimation()
        // 播放状态设置为false
        this.isPlaying = false
        // 播放状态设置为2暂停
        this.playStatus = 2
      },
      onPlayingCardClick() {
        this.$refs.speakWindow.show()
      },

      // 更新paragraph文字
      updateText(text) {
        this.paragraph = text
      },

      // 传入文字合成语音 VUE_APP_VOICE_URL生成科大讯飞语音合成api
      createVoice(text) {
        // http请求
        const xmlhttp = new XMLHttpRequest()
        // open方法 GET形式url 传入text文本 lang语种语言，false表示同步，主线程堵塞排调用队
        xmlhttp.open('GET', `${process.env.VUE_APP_VOICE_URL}/voice?text=${text}&lang=${this.lang.toLowerCase()}`, false)
        // 发送请求
        xmlhttp.send()
        // 返回responseText，获取响应请求
        const xmlDoc = xmlhttp.responseText
        // 如果xmlDoc存在，把xmlDoc当做json解析
        if (xmlDoc) {
          const json = JSON.parse(xmlDoc)
          // json数据path是mp3下载地址
          // console.log('json',json)
          // 服务端会把mp3语音文件保存下来  path是mp3下载地址
          if (json.path) {
            // console.log("this is json.path", json.path)
            // 要播放的文件路径 缓冲下载之后然后播放
            this.$refs.audio.src = json.path
            // 继续播放
            this.continuePlay()
          } else {
            this.showToast('播放失败，未生成链接')
          }
        } else {
          this.showToast('播放失败')
        }
        /*axios.create({
          baseURL: process.env.VUE_APP_VOICE_URL + '/voice'
        })({
          method: 'get',
          params: {
            text: text,
            lang: this.lang.toLowerCase()
          }
        }).then(response => {
          if (response.status === 200) {
            if (response.data.error === 0) {
              const downloadUrl = response.data.path
              console.log('开始下载...%s', downloadUrl)
              downloadMp3(downloadUrl, blob => {
                const url = window.URL.createObjectURL(blob)
                console.log(blob, url)
                this.$refs.audio.src = url
                this.continuePlay()
              })
            } else {
              this.showToast(response.data.msg)
            }
          } else {
            this.showToast('请求失败')
          }
        }).catch(err => {
          console.log(err)
          this.showToast('播放失败')
        })*/
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-speaking {
    font-size: px2rem(16);
    width: 100%;
    background: white;
    .content-wrapper {
      width: 100%;
      .book-speak-title-wrapper {
        display: flex;
        padding: px2rem(15);
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #eee;
        .icon-speak-wrapper {
          flex: 0 0 px2rem(40);
          @include left;
          .icon-speak {
            font-size: px2rem(24);
            color: #999;
          }
        }
        .speak-title-wrapper {
          flex: 1;
          @include left;
          .speak-title {
            font-size: px2rem(16);
            font-weight: bold;
            color: #666;
          }
        }
        .icon-down-wrapper {
          flex: 0 0 px2rem(40);
          @include right;
          .icon-up {
            font-size: px2rem(12);
            color: #999;
          }
          .icon-down2 {
            font-size: px2rem(12);
            color: #999;
          }
        }
      }
      .book-detail-content-wrapper {
        width: 100%;
        border-bottom: px2rem(1) solid #eee;
        box-sizing: border-box;
        .book-detail-content-list-wrapper {
          padding: px2rem(10) px2rem(15);
          .loading-text-wrapper {
            width: 100%;
            .loading-text {
              font-size: px2rem(14);
              color: #999;
            }
          }
          .book-detail-content-item-wrapper {
            .book-detail-content-item {
              display: flex;
              padding: px2rem(15) 0;
              font-size: px2rem(14);
              line-height: px2rem(16);
              color: #333;
              border-bottom: px2rem(1) solid #eee;
              &:last-child {
                border-bottom: none;
              }
              .book-detail-content-navigation-text {
                flex: 1;
                width: 100%;
                @include ellipsis;
                &.is-playing {
                  color: $color-blue;
                  font-weight: bold;
                  margin-left: px2rem(10);
                }
              }
            }
          }
        }
      }
    }
    // 不在界面上显示
    .book-wrapper {
      position: absolute;
      bottom: -100%;
      z-index: 100;
    }
  }
</style>
