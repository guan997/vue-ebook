<template>
<!-- 阅读器页面  分页逻辑-->
  <div class="ebook-reader">
    <div class="ebook-reader-mask"
         @touchmove="move"
         @touchend="moveEnd"
         @mousedown.left="onMouseEnter"
         @mousemove.left="onMouseMove"
         @mouseup.left="onMouseEnd" @click="onMaskClick"></div>
    <div class="read-wrapper">
      <div id="read"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Epub from 'epubjs'
  import { ebookMixin } from '@/utils/mixin'
  import { getLocalForage } from '../../utils/localForage'
  import {
    getTheme,
    getFontFamily,
    saveFontFamily,
    saveTheme,
    getFontSize,
    saveFontSize,
    saveMetadata,
    getLocation
  } from '../../utils/localStorage'
import { ready } from 'localforage'

  global.ePub = Epub
  export default {
    mixins: [ebookMixin],
    data() {
      return {
        havePaginate: false,
        isOnline: false
      }
    },
    methods: {
      move(e) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.changedTouches[0].clientY - this.firstOffsetY
          this.$store.commit('SET_OFFSETY', offsetY)
        } else {
          this.firstOffsetY = e.changedTouches[0].clientY
        }
        e.preventDefault()
        e.stopPropagation()
      },
      onMouseEnter(e) {
        this.mouseMove = 1
        this.mouseStartTime = e.timeStamp
        e.preventDefault()
        e.stopPropagation()
      },
      onMouseMove(e) {
        if (this.mouseMove === 1) {
          this.mouseMove = 2
        } else if (this.mouseMove === 2) {
          let offsetY = 0
          if (this.firstOffsetY) {
            offsetY = e.clientY - this.firstOffsetY
            this.$store.commit('SET_OFFSETY', offsetY)
          } else {
            this.firstOffsetY = e.clientY
          }
        }
        e.preventDefault()
        e.stopPropagation()
      },
      onMouseEnd(e) {
        if (this.mouseMove === 2) {
          this.$store.dispatch('setOffsetY', 0)
          this.firstOffsetY = 0
          this.mouseMove = 3
        }
        this.mouseEndTime = e.timeStamp
        const time = this.mouseEndTime - this.mouseStartTime
        if (time < 200) {
          this.mouseMove = 1
        }
        e.preventDefault()
        e.stopPropagation()
      },
      moveEnd(e) {
        this.$store.dispatch('setOffsetY', 0)
        this.firstOffsetY = 0
      },
      onMaskClick(e) {
        if (this.mouseMove === 2) {
        } else if (this.mouseMove === 1 || this.mouseMove === 4) {
          const offsetX = e.offsetX
          const width = window.innerWidth
          if (offsetX > 0 && offsetX < width * 0.3) {
            this.prevPage()
          } else if (offsetX > 0 && offsetX > width * 0.7) {
            this.nextPage()
          } else {
            this.toggleMenuVisible()
          }
        }
        this.mouseMove = 4
      },
      //  返回上一页
      prevPage() {
        // 判断rendition对象是否存在
        if (this.rendition) {
          // 调用prev()
          this.rendition.prev()
          this.refreshLocation()
        }
        // 控制菜单栏显示隐藏
        this.hideMenuVisible()
      },
      //  返回下一页
      nextPage() {
        // 判断rendition对象是否存在
        if (this.rendition) {
          // 调用next()
          this.rendition.next()
          this.refreshLocation()
        }
        // 控制菜单栏显示隐藏
        this.hideMenuVisible()
      },

      // 初始化手势
      initGuest() {
        // changeTouches： 存储几只手指点击的屏幕；一只手指有一条数据，两只手指触碰有两条数据
        // timeStamp：手势操作的时间 设定两次触碰间隔的时间不能超过多久
        //  clientX：当前点击屏幕X轴的位置/坐标
        // 手指滑动屏幕
        this.rendition.on('touchstart', event => {
          this.touchStartX = event.changedTouches[0].clientX
          this.touchStartTime = event.timeStamp
        })
        // 手指离开屏幕
        this.rendition.on('touchend', event => {
          // X轴手指偏移量 =  离开时坐标 - 开始时坐标
          const offsetX = event.changedTouches[0].clientX - this.touchStartX
          // 消耗的时间 = 手势操作的时间 - 手势开始的时间
          const time = event.timeStamp - this.touchStartTime
          // 手指划过的时间要求小于5秒 从左往右划过的距离大于40的时候 返回上一页
          if (time < 500 && offsetX > 40) {//时间小于500毫秒，间隔超过40
            this.prevPage() //返回上一页
          } else if (time < 500 && offsetX < -40) { // 手指划过的时间要求小于5秒 从右往左划过的距离大于40的时候 返回上一页
            this.nextPage()//返回下一页
          } else { // 当不满足以上两个条件的时候
            this.toggleMenuVisible()// 标题栏的显示隐藏
          }
          // 禁用事件默认行为
          event.preventDefault()
          // 禁止默认行为
          event.stopPropagation()
        })
      },

      // 初始化主题
      initTheme() {
        // 获取主题
        let defaultTheme = getTheme(this.fileName)
        // 如果defaultTheme不存在
        if (!defaultTheme) {
          // 设置主题默认为themeList[0]
          defaultTheme = this.themeList[0].name
          // 离线化存储主题
          saveTheme(this.fileName, defaultTheme)
        }
        return defaultTheme
      },

      // 初始化字体大小
      initFontSize() {
        // 获取字号
        let fontSize = getFontSize(this.fileName)
        // 如果fontSize不存在
        if (!fontSize) {
          // 设置字号默认为16
          fontSize = 16
          // 离线化存储字号
          saveFontSize(this.fileName, fontSize)
        }
        return fontSize
      },

      // 初始化getFontFamily
      initFontFamily() {
        // 获取字体
        let font = getFontFamily(this.fileName)
        // 如果font不存在
        if (!font) {
          // 默认字体
          font = 'Default'
          // 离线化存储字体
          saveFontFamily(this.fileName, font)
        }
        return font
      },
      // 渲染的初始化过程
      initRendition() {
        // 渲染电子书指定宽高全屏
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight,
          // 微信兼容性配置
          method: 'default'
        })
        Promise.all([
          this.setDefaultTheme(this.initTheme()),
          // 把默认字号的值传到vuex状态管理渲染字号 
          this.setDefaultFontSize(this.initFontSize()),
          // 把默认字体的值传到vuex状态管理渲染字体 
          this.setDefaultFontFamily(this.initFontFamily())
        ]).then(() => {
          this.switchTheme()
          if (this.$route.query.navigation) {
            this.display(this.$route.query.navigation)
          } else {
            const location = getLocation(this.fileName)
            if (location) {
              this.display(location)
            } else {
              this.display()
            }
          }
        })

        // 加载字体
        // 将阅读器的dom传入字体文件，通过Epub直接引用
        // hooks钩子函数
        // content当阅读器渲染完毕之后，可以获取资源文件的时候来调用register
        // contents对象主要用于管理资源
        this.rendition.hooks.content.register(contents => {
          Promise.all([ // 当我们字体加载完之后，执行then（（） =》{}）
            // addStylesheet表示可以手动的添加样式文件

            // env.VUE_APP_RES_URL规定ip端口号，让本地和服务器端同处于一个ip地址
            // ip问题，本地ip经常会改变，让测试环境和开发环境使用不同的url
            // 只有 NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中。这是为了避免意外公开机器上可能具有相同名称的私钥。?
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`)
          ]).then(() => {})
        })
      },
      // 获取图书基本信息
      parseBook() {
        // 图书正在加载的状态
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
          saveMetadata(this.fileName, metadata)
        })
        if (this.isOnline) {
          this.book.coverUrl().then(url => {
            this.setCover(url)
          }) 
        } else {
          // 根据封面获取url
          this.book.loaded.cover.then(cover => {
            this.book.archive.createUrl(cover).then(url => {
              this.setCover(url)
            })
          })
        }
        this.book.loaded.navigation.then(nav => {
          // console.log(nav)
          // 目录降维 将树形结构转化为数组  map 遍历 ‘.’扩展运算符 可以将数组内的内容逐层展开
          // concat数组合并 flatten()递归调用可降多维数组
          const navItem = (function flatten(arr) {
            return [].concat(...arr.map(v => [v, ...flatten(v.subitems)]))
          })(nav.toc)

          // find查询第几级 v=0就是第一级
          // 通过parent获取目录级别 parent空就是一级目录 有值就是二级
          // 判断parent是否存在，如果不存在直接返回，否则继续判断parent
          function find(item, v = 0) {
            // 找到上一级
            const parent = navItem.filter(it => it.id === item.parent)[0]
            return !item.parent ? v : (parent ? find(parent, ++v) : v)
          }

          navItem.forEach(item => {
            item.level = find(item)
            item.total = 0
            item.pagelist = []
            if (item.href.match(/^(.*)\.html$/)) {
              item.idhref = item.href.match(/^(.*)\.html$/)[1]
            } else if (item.href.match(/^(.*)\.xhtml$/)) {
              item.idhref = item.href.match(/^(.*)\.xhtml$/)[1]
            }
          })
          this.setNavigation(navItem)
        })
        // ready在book解析的过程全部结束后调用，
        this.book.ready.then(() => {
          // 当前页
          this.setCurrentBook(this.book)

          // 简单的分页算法
          // 判断当前屏幕的宽度和375对比 ， 如果宽度大于375 比值增加就会大于750，否则减小
          // 字体越大一页显示值就会就小，当前字体大小 / 字体标准值16px，
          // 这个分页最大的问题就是没有考虑资源文件，比如图片的大小 有些图片较大或者有些字体标题较大
          // 使用这个分页算法没有办法做精确的分页，只能用来做进度百分比，做精确分页不太准确
          // 传入需要分页的文字数 750 * 屏幕宽度 / 375 * 字体大小 / 16
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))

          // 异步获取locations
        }).then(locations => {
          // 分页信息
          // epubcfi可以用来电子书定位，可以定位电子书的任何一个位置
          // console.log(locations);
          locations.forEach(location => {
            const loc = location.match(/\[(.*)\]!/)[1]
            // loc
            // console.log(loc)
            this.navigation.forEach(item => {
              if (item.idhref && item.idhref.indexOf(loc) >= 0) {
                item.pagelist.push(location)
              }
            })
            let currentPage = 1
            this.navigation.forEach((item, index) => {
              if (index === 0) {
                item.page = 1
              } else {
                item.page = currentPage
              }
              currentPage += item.pagelist.length + 1
            })
          })
          // saveNavigation(this.fileName, this.navigation)
          this.setPagelist(locations)
          // 设置setBookAvailable为true进度显示
          this.setBookAvailable(true)
          this.setIsPaginating(false)
          this.refreshLocation()
        })
      },
      // 初始化接收url
      initEpub(target) {
        // 通过Epub.js解析和渲染电子书
        this.book = new Epub(target)
        this.setCurrentBook(this.book)
        this.setIsPaginating(true)
        this.setPaginate(this.$t('book.paginating'))
        // 渲染的初始化过程
        this.initRendition()
        // 手势
        this.initGuest()
        // 获取图书基本信息
        this.parseBook()
      }
    },
    mounted() {
      // 获取链接
      // const baseUrl = 'http://192.168.1.123:8081/epub';
      // const fileName = this.$route.params.fileName.split('|').join('/');
      // console.log(`${baseUrl}${fileName}.epub`);
      // 动态路由获取电子书的路径
      if (this.$route.params.fileName.indexOf('|') > 0) {
        this.setFileName(
          this.$route.params.fileName.split('|').join('/'))
          .then(() => {
            // 实时下载电子书 路径VUE_APP_EPUB_URL
            this.initEpub(`${process.env.VUE_APP_EPUB_URL}/${this.fileName}.epub`)
            this.isOnline = false
          })
      } else {
        this.setFileName(this.$route.params.fileName)
          .then(() => {
            getLocalForage(this.fileName, (err, blob) => {
              if (!err) {
                if (blob) {
                  // 离线阅读模式
                  this.isOnline = false
                  this.initEpub(blob)
                } else {
                  // 在线阅读模式
                  this.isOnline = true
                  const opf = this.$route.query.opf
                  if (opf) {
                    this.initEpub(opf)
                  }
                }
              }
            })
          })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      z-index: 150;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
