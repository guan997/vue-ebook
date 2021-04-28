// 存储数据
import {
  getReadTime,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage
} from './localStorage'
import {
  removeLocalForage
} from './localForage'
import {
  realPx
} from './utils'

// 字号
export const FONT_SIZE_LIST = [{
    fontSize: 12
  },
  {
    fontSize: 14
  },
  {
    fontSize: 16
  },
  {
    fontSize: 18
  },
  {
    fontSize: 20
  },
  {
    fontSize: 22
  },
  {
    fontSize: 24
  }
]
// 字体的数组
export const FONT_FAMILY = [{
    font: 'Default'
  },
  {
    font: 'Cabin'
  },
  {
    font: 'Days One'
  },
  {
    font: 'Montserrat'
  },
  {
    font: 'Tangerine'
  }
]

// 主题的数组 主题的样式 名称 字体大小
export function themeList(vue) {
  return [{
      // 别名 vue.$t :vue实例调用国际化 返回的是第一个样式
      alias: vue.$t('book.themeDefault'),
      // 存入到ebook.js的名称
      name: 'Default',
      // 样式
      style: {
        body: {
          'color': '#4c5059',
          'background': '#cecece',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red',
          'fill-opacity': '0.3',
          'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red',
          'fill-opacity': '0.3',
          'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red',
          'fill-opacity': '0.3',
          'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000000',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red',
          'fill-opacity': '0.3',
          'mix-blend-mode': 'multiply'
        }
      }
    }
  ]
}

// 阅读时间
export function getReadTimeByMinute(fileName) {
  if (!getReadTime(fileName)) {
    return 0
  } else {
    return Math.ceil(getReadTime(fileName) / 60)
  }
}
// 获取分类名称
export function getCategoryName(id) {
  switch (id) {
    case 1:
      return 'ChineseLiterature'
    case 2:
      return 'Classic'
    case 3:
      return 'ComputerScience'
    case 4:
      return 'SocialSciences'
    case 5:
      return 'Engineering'
    case 6:
      return 'Environment'
    case 7:
      return 'Geography'
    case 8:
      return 'History'
    case 9:
      return 'Laws'
    case 10:
      return 'LifeSciences'
    case 11:
      return 'Literature'
    case 12:
      return 'Biomedicine'
    case 13:
      return 'BusinessandManagement'
    case 14:
      return 'EarthSciences'
    case 15:
      return 'MaterialsScience'
    case 16:
      return 'Mathematics'
    case 17:
      return 'MedicineAndPublicHealth'
    case 18:
      return 'Philosophy'
    case 19:
      return 'Physics'
    case 20:
      return 'PoliticalScienceAndInternationalRelations'
    case 21:
      return 'Economics'
    case 22:
      return 'Education'
  }
}
// 分类名称
export function categoryText(category, vue) {
  switch (category) {
    case 1:
      return vue.$t('category.ChineseLiterature')
    case 2:
      return vue.$t('category.Classic')
    case 3:
      return vue.$t('category.computerScience')
    case 4:
      return vue.$t('category.socialSciences')
    case 5:
      return vue.$t('category.engineering')
    case 6:
      return vue.$t('category.environment')
    case 7:
      return vue.$t('category.geography')
    case 8:
      return vue.$t('category.history')
    case 9:
      return vue.$t('category.laws')
    case 10:
      return vue.$t('category.lifeSciences')
    case 11:
      return vue.$t('category.literature')
    case 12:
      return vue.$t('category.biomedicine')
    case 13:
      return vue.$t('category.businessandManagement')
    case 14:
      return vue.$t('category.earthSciences')
    case 15:
      return vue.$t('category.materialsScience')
    case 16:
      return vue.$t('category.mathematics')
    case 17:
      return vue.$t('category.medicineAndPublicHealth')
    case 18:
      return vue.$t('category.philosophy')
    case 19:
      return vue.$t('category.physics')
    case 20:
      return vue.$t('category.politicalScienceAndInternationalRelations')
    case 21:
      return vue.$t('category.economics')
    case 22:
      return vue.$t('category.education')
  }
}
// 书籍详情
export function showBookDetail(vue, book) {
  vue.$router.push({
    path: '/book-store/detail',
    query: {
      fileName: book.fileName,
      category: book.categoryText
    }
  })
}
// 分类列表号
export const categoryList = {
  'ChineseLiterature': 1,
  'Classic': 2,
  'ComputerScience': 3,
  'SocialSciences': 4,
  'Engineering': 5,
  'Environment': 6,
  'Geography': 7,
  'History': 8,
  'Laws': 9,
  'LifeSciences': 10,
  'Literature': 11,
  'Biomedicine': 12,
  'BusinessandManagement': 13,
  'EarthSciences': 14,
  'MaterialsScience': 15,
  'Mathematics': 16,
  'MedicineAndPublicHealth': 17,
  'Philosophy': 18,
  'Physics': 19,
  'PoliticalScienceAndInternationalRelations': 20,
  'Economics': 21,
  'Education': 22
}
// 书架key
const BOOK_SHELF_KEY = 'bookShelf'

// 添加到书架
export function addToShelf(book) {
  // 从书架当中拿出图书
  let bookList = getLocalStorage(BOOK_SHELF_KEY)
  // 把最后一本书去掉
  bookList = clearAddFromBookList(bookList)
  // type = 1
  book.type = 1
  // 添加book
  bookList.push(book)
  // 获得item.id
  bookList.forEach((item, index) => {
    item.id = index + 1
  })
  // 加回去
  appendAddToBookList(bookList)
  // 离线化保存bookList
  setLocalStorage(BOOK_SHELF_KEY, bookList)
}

export function appendAddToBookList(bookList) {
  bookList.push({
    cover: '',
    title: '',
    type: 3,
    id: Number.MAX_SAFE_INTEGER
  })
}

export function clearAddFromBookList(bookList) {
  return bookList.filter(item => {
    return item.type !== 3
  })
}
// 从书架删除
export function removeFromBookShelf(bookItem) {
  // 取到bookList
  let bookList = getLocalStorage(BOOK_SHELF_KEY)
  // 过滤bookList
  bookList = bookList.filter(item => {
    // itemList是否存在
    if (item.itemList) {
      // 过滤item.itemList
      item.itemList = item.itemList.filter(subItem => subItem.fileName !== bookItem.fileName)
    }
    // 判断item.fileName !== bookItem.fileName是否相等  不相等就保留，相等就移除
    return item.fileName !== bookItem.fileName
  })
  // 离线存储bookList
  setLocalStorage(BOOK_SHELF_KEY, bookList)
}
// 书籍列表
export function flatBookList(bookList) {
  if (bookList) {
    let orgBookList = bookList.filter(item => {
      return item.type !== 3
    })
    const categoryList = bookList.filter(item => {
      return item.type === 2
    })
    categoryList.forEach(item => {
      const index = orgBookList.findIndex(v => {
        return v.id === item.id
      })
      if (item.itemList) {
        item.itemList.forEach(subItem => {
          orgBookList.splice(index, 0, subItem)
        })
      }
    })
    orgBookList.forEach((item, index) => {
      item.id = index + 1
    })
    orgBookList = orgBookList.filter(item => item.type !== 2)
    return orgBookList
  } else {
    return []
  }
}
// 寻找图书
export function findBook(fileName) {
  const bookList = getLocalStorage(BOOK_SHELF_KEY)
  return flatBookList(bookList).find(item => item.fileName === fileName)
}
// 删除缓存书籍
export function removeBookCache(fileName) {
  return new Promise((resolve, reject) => {
    removeLocalStorage(fileName)
    removeLocalStorage(`${fileName}-info`)
    removeLocalForage(fileName, () => {
      console.log(`[${fileName}]删除成功...`)
      resolve()
    }, reject)
  })
}
// 切换国际化语言
export function switchLocale(vue) {
  if (vue.$i18n.locale === 'en') {
    vue.$i18n.locale = 'cn'
  } else {
    vue.$i18n.locale = 'en'
  }
  setLocalStorage('locale', vue.$i18n.locale)
}

export function reset(vue) {
  vue.$store.dispatch('setMenuVisible', false)
  vue.$store.dispatch('setSettingVisible', 0)
  vue.$store.dispatch('setFontFamilyVisible', false)
  vue.$store.dispatch('setSpeakingIconBottom', realPx(58))
}