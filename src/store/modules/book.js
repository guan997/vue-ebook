import {
  realPx
} from '../../utils/utils'

const book = {
  state: {
    fileName: '' ,  // 电子书链接
    menuVisible: false ,  // menuVisible值，用来控制显示隐藏
    settingVisible: -1 , // 菜单栏选项设置 -1: 不显示， 0：字号， 1：主题， 2：进度， 3： 目录
    defaultFontSize: 16 ,  // 默认字号
    defaultFontFamily: 'Default' , // 默认字体
    fontFamilyVisible: false , //字体栏显示
    defaultTheme: 'Default' , // 默认主题
    bookAvailable: false ,  //阅读进度显示
    progress: 0 ,  //进度
    section: 0 , //章节
    isPaginating: true , 
    currentBook: null , 
    navigation: null , 
    cover: null ,
    metadata: null , 
    paginate: '' , 
    pagelist: null ,
    offsetY: 0 ,  
    isBookmark: null ,  
    speakingIconBottom: realPx(58)
  },
  mutations: {
    // 电子书链接
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    },
    // menuVisible值，用来控制显示隐藏
    'SET_MENU_VISIBLE': (state, visible) => {
      state.menuVisible = visible
    },
    // 菜单栏设置 -1: 不显示， 0：字号， 1：主题， 2：进度， 3： 目录
    'SET_SETTING_VISIBLE': (state, visible) => {
      state.settingVisible = visible
    },
    //默认字号
    'SET_DEFAULT_FONT_SIZE': (state, fontSize) => {
      state.defaultFontSize = fontSize
    },
    // 默认字体
    'SET_DEFAULT_FONT_FAMILY': (state, font) => {
      state.defaultFontFamily = font
    },
    // 字体弹出栏显示
    'SET_FONT_FAMILY_VISIBLE': (state, visible) => {
      state.fontFamilyVisible = visible
    },
    // 主题
    'SET_DEFAULT_THEME': (state, theme) => {
      state.defaultTheme = theme
    },
    // 阅读进度显示
    'SET_BOOK_AVAILABLE': (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },
    // 进度
    'SET_PROGRESS': (state, progress) => {
      state.progress = progress
    },
    // 章节
    'SET_SECTION': (state, section) => {
      state.section = section
    },
    'SET_IS_PAGINATING': (state, isPaginating) => {
      state.isPaginating = isPaginating
    },
    'SET_CURRENT_BOOK': (state, currentBook) => {
      state.currentBook = currentBook
    },
    'SET_NAVIGATION': (state, navigation) => {
      state.navigation = navigation
    },
    'SET_COVER': (state, cover) => {
      state.cover = cover
    },
    'SET_METADATA': (state, metadata) => {
      state.metadata = metadata
    },
    'SET_PAGINATE': (state, paginate) => {
      state.paginate = paginate
    },
    'SET_PAGELIST': (state, pagelist) => {
      state.pagelist = pagelist
    },
    'SET_OFFSETY': (state, offsetY) => {
      state.offsetY = offsetY
    },
    'SET_IS_BOOKMARK': (state, isBookmark) => {
      state.isBookmark = isBookmark
    },
    'SET_SPEAKING_ICON_BOTTOM': (state, speakingIconBottom) => {
      state.speakingIconBottom = speakingIconBottom
    }
  }
}

export default book
