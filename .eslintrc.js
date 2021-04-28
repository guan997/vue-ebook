module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // es6-link关闭配置
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 关闭缩进
    'indent': 'off',
    'space-before-function-paren': 'off',
    'spaced-comment': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
