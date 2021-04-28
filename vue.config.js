// function mock(app, url, data) {
//   app.get(url, (request, response) => {
//     response.json(data)
//   })
// }
// const mockBookHomeData = require('./src/mock/bookHome')
// const mockBookShelfData = require('./src/mock/bookShelf')
// const mockBookList = require('./src/mock/bookCategoryList')
// const mockBookFlatList = require('./src/mock/bookFlatList')

module.exports = {
  //开发模式或者生产模式
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    // before(app) {
    //   mock(app, '/book/home', mockBookHomeData)
    //   mock(app, '/book/shelf', mockBookShelfData)
    //   mock(app, '/book/list', mockBookList)
    //   mock(app, '/book/flat-list', mockBookFlatList)
    // }
  },
  // 解决构建警告
  configureWebpack: { 
    performance: {
      // false关闭警告错误
      hints: 'warning',
      // 文件大小限制
      maxAssetSize: 524288 * 10,
      maxEntrypointSize: 524288
    }
  }
}
