const getters = {
  // 电子书链接
  fileName: state => state.book.fileName,
  // 菜单显示隐藏
  menuVisible: state => state.book.menuVisible,
  // 字体字号
  settingVisible: state => state.book.settingVisible,
  // 默认字号
  defaultFontSize: state => state.book.defaultFontSize,
  // 默认字体
  defaultFontFamily: state => state.book.defaultFontFamily,

  fontFamilyVisible: state => state.book.fontFamilyVisible,
  // 默认主题
  defaultTheme: state => state.book.defaultTheme,
  // bookAvailable进度显示
  bookAvailable: state => state.book.bookAvailable,
  // 进度
  progress: state => state.book.progress,
  section: state => state.book.section,
  isPaginating: state => state.book.isPaginating,
  currentBook: state => state.book.currentBook,
  navigation: state => state.book.navigation,
  cover: state => state.book.cover,
  metadata: state => state.book.metadata,
  paginate: state => state.book.paginate,
  pagelist: state => state.book.pagelist,
  offsetY: state => state.book.offsetY,
  isBookmark: state => state.book.isBookmark,
  speakingIconBottom: state => state.book.speakingIconBottom
}

export default getters
