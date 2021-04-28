import Vue from 'vue'
import lazyload from 'vue-lazyload'
// 图片懒加载
Vue.use(lazyload, {
  error: require('@/assets/images/loading.jpg'),
  loading: require('@/assets/images/loading2.jpg')
})
