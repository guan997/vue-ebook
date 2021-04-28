// 封装local storage 离线存储时用到的方法
// 将传入的字符串或者对象变为json存储，读取的时候还可以将json再转化为对象
// 引用local storage库
import Storage from 'web-storage-cache'

// 创建Storage对象
const localStorage = new Storage()

// 获取key 数据
export function getLocalStorage(key) {
  return localStorage.get(key)
}

// 写入key value
export function setLocalStorage(key, value, expire = 30 * 24 * 3600) {
  return localStorage.set(key, value, { exp: expire })
}

// 删除localStorage的值，可以用来清除缓存
export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

// 清空local storage的值
export function clearLocalStorage() {
  return localStorage.clear()
}

export function getHome() {
  return getLocalStorage('home')
}

export function saveHome(home) {
  return setLocalStorage('home', home, 1800)
}

// 保存字体设置国际化
export function getLocale() {
  return getLocalStorage('locale')
}
// 设置字体设置国际化
export function saveLocale(locale) {
  return setLocalStorage('locale', locale)
}

export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}

export function saveLocation(fileName, location) {
  setBookObject(fileName, 'location', location)
}

export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark')
}

export function saveBookmark(fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark)
}

// 获取阅读时间
export function getReadTime(fileName) {
  return getBookObject(fileName, 'time')
}

// 保存阅读时间
export function saveReadTime(fileName, theme) {
  setBookObject(fileName, 'time', theme)
}

// 获取进度
export function getProgress(fileName) {
  return getBookObject(fileName, 'progress')
}

// 设置进度
export function saveProgress(fileName, progress) {
  setBookObject(fileName, 'progress', progress)
}

export function getNavigation(fileName) {
  return getBookObject(fileName, 'navigation')
}

export function saveNavigation(fileName, navigation) {
  setBookObject(fileName, 'navigation', navigation)
}

export function getMetadata(fileName) {
  return getBookObject(fileName, 'metadata')
}

export function saveMetadata(fileName, metadata) {
  setBookObject(fileName, 'metadata', metadata)
}

export function getCover(fileName) {
  return getBookObject(fileName, 'cover')
}

export function saveCover(fileName, cover) {
  setBookObject(fileName, 'cover', cover)
}

// 存储字体
export function getFontFamily(fileName) {
  // 获取filename 设置fontFamily
  return getBookObject(fileName, 'fontFamily')
}

// 保存字体 这里的fontFamily就是defaultFamily这里把它离线存储下来
export function saveFontFamily(fileName, fontFamily) {
  // 通过setBookObject存储字体
  setBookObject(fileName, 'fontFamily', fontFamily)
}

// 获取主题
export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}

// 设置主题
export function saveTheme(fileName, theme) {
  setBookObject(fileName, 'theme', theme)
}

// 获取字号
export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}

// 设置字号
export function saveFontSize(fileName, fontSize) {
  setBookObject(fileName, 'fontSize', fontSize)
}

// 用来获取filename key
export function getBookObject(fileName, key) {
  // 如果能够取到getLocalStorage的值 返回 getLocalStorage(`${fileName}-info`)[key]
  if (getLocalStorage(`${fileName}-info`)) {
    return getLocalStorage(`${fileName}-info`)[key]
  } else {
    return null
  }
}

// 用来存储filename key value
export function setBookObject(fileName, key, value) {
  let book = {}
  // 如果能够取到getLocalStorage的值
  if (getLocalStorage(`${fileName}-info`)) {
    // book=取到的图书数据
    book = getLocalStorage(`${fileName}-info`)
  }
  book[key] = value
  // 存储book信息，包括字体 主题信息
  setLocalStorage(`${fileName}-info`, book)
}
