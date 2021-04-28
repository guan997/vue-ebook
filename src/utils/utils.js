// 动态添加删除class样式
export function px2rem(px) {
  const ratio = 375 / 10
  return px / ratio
}

export function realPx(px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}

// 添加样式
export function addCss(href) {
  // 创建link标签
  const link = document.createElement('link')
  // 对link设置属性 stylesheet样式表 css文件 href路径
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  // 将link标签添加到head下
  document.getElementsByTagName('head')[0].appendChild(link)
}

// 因为使用的是appendChild追加link标签，所以每点击一下，head标签下都会多出一个css文件，影响渲染效率
// 清除样式
export function removeCss(href) {
  // 获取所有的link标签
  const link = document.getElementsByTagName('link')
  // 通过link倒序遍历
  for (var i = link.length; i >= 0; i--) {
    // 如果link存在同时具有href属性以及 href属性=传入的href
    if (link[i] && link[i].getAttribute('href') != null && link[i].getAttribute('href').indexOf(href) !== -1) {
      // 移除link[i]
      link[i].parentNode.removeChild(link[i])
    }
  }
}

// 清除全部样式
export function removeAllCss() {
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
}

export function os() {
  const ua = navigator.userAgent
  const isWindowsPhone = /(?:Windows Phone)/.test(ua)
  const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
  const isAndroid = /(?:Android)/.test(ua)
  const isFireFox = /(?:Firefox)/.test(ua)
  // isChrome = /(?:Chrome|CriOS)/.test(ua)
  const isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
  const isPhone = /(?:iPhone)/.test(ua) && !isTablet
  const isPc = !isPhone && !isAndroid && !isSymbian
  return {
    isTablet: isTablet,
    isPhone: isPhone,
    isAndroid: isAndroid,
    isPc: isPc
  }
}
