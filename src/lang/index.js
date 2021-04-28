import Vue from 'vue'
// 通过插件的形式挂载
import VueI18n from 'vue-i18n'
import en from './en'
import cn from './cn'
import { getLocale, saveLocale } from '../utils/localStorage'

// 加载插件
Vue.use(VueI18n)
// message对象json 方式
const messages = {
  en, cn
}

// 默认语言
let locale = getLocale()
// 判断locale是否存在
if (!locale) {
  // 默认语言cn
  locale = 'cn'
  // 离线存储语言
  saveLocale(locale)
}
// 创建变量i18n 实例化VueI18n
const i18n = new VueI18n({
  // 语言
  locale,
  // 文本
  messages
})

export default i18n
