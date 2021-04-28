import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 动态路由
export default new Router({
  routes: [
    {
      path: '/',
      // 重定向
      redirect: '/book-store'
    },
    {
      path: '/ebook',
      component: resolve => require(['@/views/ebook/index.vue'], resolve),
      children: [{
        path: ':fileName',
        component: resolve => require(['@/components/ebook/EbookReader.vue'], resolve)
      }]
    },
    {
      path: '/book-store',
      component: resolve => require(['@/views/store/index.vue'], resolve),
      // 重定向
      redirect: '/book-store/shelf',
      children: [
        {
          path: '/book-store/shelf',
          component: resolve => require(['@/views/store/bookShelf.vue'], resolve),
          meta: { key: 1 }
        },
        {
          path: '/book-store/category',
          component: resolve => require(['@/views/store/bookCategory.vue'], resolve),
          meta: { key: 2 }
        },
        {
          path: '/book-store/home',
          component: resolve => require(['@/views/store/bookHome.vue'], resolve),
          meta: { key: 3 }
        },
        {
          path: '/book-store/list',
          component: resolve => require(['@/views/store/bookList.vue'], resolve),
          meta: { key: 4 }
        },
        {
          path: '/book-store/detail',
          component: resolve => require(['@/views/store/bookDetail.vue'], resolve),
          meta: { key: 5 }
        },
        {
          path: '/book-store/book-speaking',
          component: resolve => require(['@/views/store/bookSpeaking.vue'], resolve),
          meta: { key: 6 }
        }
      ]
    }
  ]
})
