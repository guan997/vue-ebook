// 组件通用方法
import { mapGetters, mapActions } from 'vuex'
import { FONT_SIZE_LIST, FONT_FAMILY, themeList, getReadTimeByMinute, showBookDetail } from './book'
import { addCss, removeAllCss } from './utils'
import * as Storage from './localStorage'

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize' ,//默认字体
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark',
      'speakingIconBottom'
    ]),
    // 主题列表
    themeList() {
      return themeList(this)
    },
    getSectionName() {
      if (this.section) {
        const section = this.currentBook.section(this.section)
        if (section && section.href && this.currentBook && this.currentBook.navigation) {
          // return this.currentBook.navigation.get(section.href).label
          return this.navigation[this.section].label
        }
      }
    }
  },
  data() {
    return {
      fontSizeList: FONT_SIZE_LIST,
      fontFamily: FONT_FAMILY
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible' ,//字体弹出栏
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark',
      'setSpeakingIconBottom'
    ]),
    // showFontFamilySetting点击字体设置弹出层
    showFontFamilySetting() {
      // 弹出字体弹出栏
      this.setFontFamilyVisible(true)
    },
    showSetting(key) {
      this.setSettingVisible(key)
    },
    // 隐藏菜单栏
    hideMenuVisible() {
      this.setMenuVisible(false)
      // 当我们隐藏的时候设置setSettingVisible为-1
      this.setSettingVisible(-1)
      // 隐藏字体弹出栏
      this.setFontFamilyVisible(false)
    },
    // 控制菜单栏显示隐藏
    toggleMenuVisible() {
      // 如果menuVisible为true
      if (this.menuVisible) {
        // 隐藏菜单栏
        this.setSettingVisible(-1)
        // 隐藏字体弹出栏
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    // 点击隐藏字体弹出栏
    hideFontFamilySetting() {
      // 隐藏字体弹出栏
      this.setFontFamilyVisible(false)
    },

    // 全局样式设置（主题）
    setGlobalTheme(theme) {
      // 清除全部样式
      removeAllCss()
      // 根据主题名称切换class样式表
      switch (theme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          this.setDefaultTheme('Default')
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    // 主题注册
    registerTheme() {
      // 遍历主题
      this.themeList.forEach(theme => {
        // 传入名称，样式
        this.currentBook.rendition.themes.register(theme.name, theme.style)
      })
    },
    // 切换主题
    switchTheme() {
      const rules = this.themeList.filter(theme => theme.name === this.defaultTheme)[0]
      if (this.defaultFontFamily && this.defaultFontFamily !== 'Default') {
        rules.style.body['font-family'] = `${this.defaultFontFamily}!important`
      } else {
        rules.style.body['font-family'] = `Times New Roman!important`
      }
      this.registerTheme()
      this.currentBook.rendition.themes.select(this.defaultTheme)
      this.currentBook.rendition.themes.fontSize(this.defaultFontSize)
      this.setGlobalTheme(this.defaultTheme)
    },
    // 设置字号
    setFontSize(fontSize) {
      // 传入font大小
      this.setDefaultFontSize(fontSize).then(() => {
        // 切换主题
        this.switchTheme()
        // 调用utils->localStorage.js中的saveFontSize方法离线存储
        Storage.saveFontSize(this.fileName, fontSize)
      })
    },

    // 设置主题
    setTheme(theme) {
      // 传入主题
      this.setDefaultTheme(theme).then(() => {
        // 切换主题
        this.switchTheme()
        // 离线存储主题
        Storage.saveTheme(this.fileName, theme)
      })
    },
    // 设置字体 离线存储字体
    setFontFamily(font) {
      // 传入font字体
      this.setDefaultFontFamily(font).then(() => {
        // 切换主题
        this.switchTheme()
        // 调用utils->localStorage.js中的saveFontFamily方法离线存储
        Storage.saveFontFamily(this.fileName, font)
      })
    },
    // 展示章节内容
    displaySection(cb) {
      const section = this.currentBook.section(this.section)
      if (section && section.href) {
        this.currentBook.rendition.display(section.href).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    // 展示当前进度所在的页面
    displayProgress() {
      // 获取定位数据cfiFromPercentage 通过百分比获取cfi   this.progress / 100
      const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
      // console.log(cfi)
      // 渲染cif
      this.currentBook.rendition.display(cfi).then(() => {
        this.refreshLocation()
      })
    },
    // 显示epubcfi
    display(target, highlight = false) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          if (highlight) {
            if (target.startsWith('epubcfi')) {
              this.currentBook.getRange(target).then(range => {
                this.currentBook.rendition.annotations.highlight(target, {}, (e) => {
                })
              })
            }
          }
          this.refreshLocation()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
        })
      }
      this.hideMenuVisible()
    },
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation.start && currentLocation.start.index) {
        this.setSection(currentLocation.start.index)
        const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
        this.setProgress(Math.floor(progress * 100))
        if (this.pagelist) {
          if (currentLocation.start.location <= 0) {
            this.setPaginate('')
          } else {
            this.setPaginate(currentLocation.start.location + ' / ' + this.pagelist.length)
          }
        } else {
          this.setPaginate('')
        }
        const cfistart = currentLocation.start.cfi
        const bookmark = Storage.getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === cfistart)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
        Storage.saveLocation(this.fileName, cfistart)
      }
    },
    getReadTime() {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    }
  }
}

export const ebookHome = {
  methods: {
    showBookDetail(item) {
      showBookDetail(this, item)
    }
  }
}
