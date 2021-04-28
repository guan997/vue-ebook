<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {}
  // rem自适应布局
  document.addEventListener('DOMContentLoaded', () => {
    // window.innerWidth屏幕尺寸
    let fontSize = window.innerWidth / 10
    // 设置上限 最大值
    fontSize = fontSize > 50 ? 50 : fontSize
    const html = document.querySelector('html')
    html.style.fontSize = fontSize + 'px'
  })
</script>

<style scoped>
  #app {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background: #7d8188;
    overflow: hidden;
  }
</style>
