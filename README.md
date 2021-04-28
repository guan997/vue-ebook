# v-ebook说明文档

EbookSlideContents.vue.js全文搜索框

EbookReader 下拉

EbookBookmark 添加书签

lang文件夹

cn.js中文设置

en.js英文设置

# 本地搭建开发环境

## 1. 安装Node.js、npm和Vue CLI 3.0

### 1.1 nvm安装

nvm是Node.js版本管理工具，可以非常方便的下载和切换Node.js版本，分为两个版本：

- macOS和Linux版本点击[这里](https://github.com/creationix/nvm)
- Windows版本点击[这里](https://github.com/coreybutler/nvm-windows)

macOS和Linux版本指令方法如下：

```shell
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

或

```shell
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

安装时必须在当前用户根路径下存在`.bash_profile`文件（该文件的用途是在当用户登录后，加载相应的环境变量），如果不存在该文件，可以手动创建一个，再重新执行上述安装脚本

```shell
touch ~/.bash_profile
```

安装成功后会在`.bash_profile`文件中写入以下内容，以便我们可以直接使用nvm指令

```shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This l    oads nvm bash_completion
```

我们可以重新打开终端令环境变量生效，或使用如下指令令环境变量立即生效

```shell
source ~/.bash_profile
```

nvm卸载方法很简单，只需要执行如下指令就可以了。我们在`.bash_profile`中定义了环境变量`$NVM_DIR`为`$HOME/.nvm`，`$HOME`指向用户根目录，`$HOME/.nvm`表示nvm的安装路径，所以直接删除即可

```shell
$ rm -rf "$NVM_DIR"
```

执行上述指令后，还要将`.bash_profile`文件中安装nvm时写入的内容删除即可

### 1.2 Node.js和npm安装

安装nvm后我们就可以很方便的管理Node.js版本，安装最新的Node.js版本（安装Node.js的同时会自动安装npm）：

```shell
nvm install node
```

安装指定版本Node.js（如安装10.10.0版本）：

```shell
nvm install 10.10.0
```

查看本地已经安装的Node.js版本

```shell
nvm ls
```

查看所有可用的Node.js版本

```shell
nvm ls-remote
```

切换到最新的Node.js版本

```shell
nvm use node
```

切换到指定版本的Node.js（如切换到10.10.0版本）

```shell
nvm use 10.10.0
```

验证Node.js安装是否成功

```shell
$ node -v

v10.10.0
```

验证npm安装是否成功

```shell
$ npm -v

6.4.1
```

### 1.3 安装Vue CLI 3.0环境

Vue CLI 3.0官网地址点击[这里](https://cli.vuejs.org)，注意安装Vue CLI 3.0必须安装Node.js 8.9.或更高版本，通过以下指令安装：

```shell
npm install -g @vue/cli
```

检查Vue CLI 3.0是否安装成功

```shell
$ vue --version

3.0.5
```

## 2. 下载源码

通过git下载完整源码

```shell
git clone https://git.imooc.com/coding-285/vue-imooc-ebook.git
```

下载后进入源码目录，安装依赖包

```shell
cd vue-imooc-ebook
npm install
```

## 3. 搭建静态资源服务器

### 3.1 安装Nginx

- Windows版Nginx下载地址点击[这里](http://nginx.org/en/download.html)
- macOS版Nginx需要通过brew进行安装

```shell
brew install nginx
```

### 3.2 Nginx配置（以macOS为例）

查看nginx配置文件

```shell
vim /usr/local/etc/nginx/nginx.conf
```

- 修改user，将user修改为当前登录用户名，如：当前登录用户为sam，则修改如下：

```
user  sam owner;
```

- 在http对象下再增加一个server

```
http {
  server {
    listen  80;
    server_name  localhost;
    root  /Users/sam/upload;
    autoindex  on;
    location / {
      add_header  Access-Control-Allow-Origin *;
      index  index.html index.htm;
    }
  }
}
```

这里配置项的具体含义如下：

- listen：监听端口号，最新的macOS系统不允许设置80端口，可以选择8000以上的端口号
- server_name：指定虚拟主机的名称
- root：资源文件的根路径，必须指向一个文件夹，该路径为资源文件存放的位置，例如用户访问：`localhost/book/a.epub`，实际访问的资源路径为：`/Users/sam/upload/book/a.epub`
- autoindex：是否打开目录浏览功能，如果打开，当我们访问`localhost/`时，就可以在网页上查看`/Users/sam/upload`目录下的所有文件
- location：路由规则匹配，`location /`表示匹配所有路由
  - add_header：表示在响应头中添加指定内容，这里添加`Access-Control-Allow-Origin`为`*`是为了解决前端跨域问题，如果不配置这个选项，前端请求资源时会出现跨域错误，希望详细了解跨域原理的同学可以点击[这里](http://www.ruanyifeng.com/blog/2016/04/cors.html)学习
  - index：指定访问根路径时默认访问的资源文件，比如我们访问`localhost/`，实际Nginx会找到`/Users/sam/upload/index.html`或`/Users/sam/upload/index.htm`进行返回

### 3.3 下载资源

- 准备资源文件
- 解压后打开文件夹，将其中的epub和book 2个文件夹拷贝到/upload`（即Nginx配置文件中root指定的文件夹）路径下
  - epub中包含了电子书文件
  - book中包含了资源文件，如封面、字体、主题样式等

### 3.4 Nginx常用命令

```
启动服务：start nginx
退出服务：nginx -s quit
强制关闭服务：nginx -s stop
重载服务：nginx -s reload　　（重载服务配置文件，类似于重启，服务不会中止）
验证配置文件：nginx -t
使用配置文件：nginx -c "配置文件路径"
使用帮助：nginx -h
```



## 4. 运行源码

### 4.1 配置环境变量

进入源码目录，打开`.env.development`

```shell
cd vue-imooc-ebook
vim .env.development
```

`.env.development`配置文件内容如下：

```shell
VUE_APP_EPUB_URL=http://192.168.1.110:8081/epub
VUE_APP_EPUB_OPF_URL=http://192.168.1.110:8081/epub2
VUE_APP_RES_URL=http://192.168.1.110:8081/book/res
VUE_APP_BASE_URL=http://192.168.1.110:3000
VUE_APP_VOICE_URL=http://192.168.1.110:3000
VUE_APP_BOOK_URL=http://192.168.1.110:3000
```

这里另外三个地址`VUE_APP_BASE_URL`、`VUE_APP_VOICE_URL`、`VUE_APP_BOOK_URL`，为服务器提供的API，实现前后端分离

### 4.2 运行项目

通过如下指令运行项目

```
cnpm run dev
```

此时我们就可以通过`http://192.168.1.112:8080`访问站点了

# 主要知识点

- ### ePub电子书解析和渲染

```javascript
// 生成Book对象
this.book = new Epub(DOWNLOAD_URL)
// 通过Book.renderTo生成Rendition对象
this.rendition = this.book.renderTo('read', {
  width: window.innerWidth,
  height: window.innerHeight,
  // 兼容iOS
  method: 'default'
})
// 通过Rendtion.display渲染电子书
this.rendition.display()
```

## ePub电子书翻页

```javascript
// 上一页
function prevPage() {
  if (this.rendition) {
    this.rendition.prev()
  }
}
// 下一页
function nextPage() {
  if (this.rendition) {
    this.rendition.next()
  }
}
```

## 标题栏

```js
<!-- 标题栏 TitleBar.vue-->
  <transition name="slide-down">
      <div class="title-wrapper" v-show="ifTitleAndMenuShow">
        <!-- 左 -->
        <div class="left">
          <span class="icon-back icon"></span>
        </div>
        <!-- 右 -->
        <div class="right">
          <div class="icon-wrapper">
            <!-- 购物车图标 -->
            <span class="icon-cart icon"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-person icon"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-more icon"></span>
          </div>
        </div>
      </div>
    </transition>
</template>
```

```js
data() {
    return {
      // 控制标题栏显示隐藏
      ifTitleAndMenuShow: false,
    }
}
```

## ePub电子书的字号设置和场景切换

```javascript
// 设置主题
function setTheme(index) {
  this.themes.select(this.themeList[index].name)
  this.defaultTheme = index
}
// 注册主题
function registerTheme() {
  this.themeList.forEach(theme => {
    this.themes.register(theme.name, theme.style)
  })
}
// 设置字号大小
function setFontSize(fontSize) {
  this.defaultFontSize = fontSize
  if (this.themes) {
    this.themes.fontSize(fontSize + 'px')
  }
}
```

## ePub电子书生成目录和定位信息

```javascript
// Book对象的钩子函数ready
this.book.ready.then(() => {
  // 生成目录
  this.navigation = this.book.navigation
  // 生成Locations对象
  return this.book.locations.generate()
}).then(result => {
  // 保存locations对象
  this.locations = this.book.locations
  // 标记电子书为解析完毕状态
  this.bookAvailable = true
})
```

## ePub电子书通过百分比进行定位

```javascript
function onProgressChange(progress) {
  const percentage = progress / 100
  const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0
  this.rendition.display(location)
}
```

## HTML5 range控件

```html
<input class="progress" 
       type="range"
       max="100"
       min="0"
       step="1"
       @change="onProgressChange($event.target.value)" 
       @input="onProgressInput($event.target.value)"
       :value="progress"
       :disabled="!bookAvailable"
       ref="progress">
```

## ePub电子书解析

container.xml

- <rootfile full-path="OEBPS/CONTENT.opf">

解析content.opf

- metadata电子书基本信息
- manifest电子书的所有的资源文件及路径
- spine电子书的排列顺序
  - spine toc="ncx"  ncx电子图的目录
- guide指南信息

```xml
<?xml version="1.0"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
  </metadata>
 <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
 </manifest>
  <spine toc="ncx">
    <itemref idref="ACoverHTML"/>
 </spine>
  <guide>
    <reference type="cover" title="Cover" href="ACoverHTML.html"/>
  </guide>
</package>
```

## epubjs阅读器引擎介绍



![img](https://img-blog.csdnimg.cn/20190724180943341.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9jbG92ZXJ3YW5nLmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70)

## Epubjs核心类 

![img](https://img-blog.csdnimg.cn/20190724181048712.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9jbG92ZXJ3YW5nLmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70) 

### epub.js核心类介绍

- Book：完成了阅读器的解析
- Rendition：实现了阅读器的渲染
- Locations：阅读器的定位
- Navigation：存储了目录信息
- View Manager：负责阅读器渲染出来的视图管理
- EpubCFI：利用CFI标准来进行文字级别的定位，可以定位到一个电子书中任意一个字符
- Theme：负责管理场景切换
- Spine：指定阅读顺序和管理Section
- Section：指向了一个具体的章节，全文检索和章节切换需要依赖这个类来实现
- Contents：管理一个章节中的全部资源内容
- Hook：定义了钩子函数，负责管理某个类的生命周期
- Annotations：负责管理标签，如文字高亮显示

## epub.js的使用

### npm安装

```undefined
npm install epubjs
```

## epub阅读器开发

ePub电子书解析和渲染

### 生成Book对象

```cpp
  this.book = new Epub(DOWNLOAD_URL)
```

### 通过Book.renderTo生成Rendition对象

```dart
  this.rendition = this.book.renderTo('read', {
    width: window.innerWidth,
    height: window.innerHeight,
    method: 'default'
  })
```

### 通过Rendtion.display渲染电子书

```css
  this.rendition.display()
```

## ePub电子书翻页

### *上一页*

```jsx
  function prevPage() {
    if (this.rendition) {
      this.rendition.prev()
    }
  }
```

### *下一页*

```jsx
  function nextPage() {
    if (this.rendition) {
      this.rendition.next()
    }
  }
```

## ePub电子书的字号设置和场景切换

### *设置主题*

```jsx
  function setTheme(index) {
    this.themes.select(this.themeList[index].name)
    this.defaultTheme = index
  }
```

### *注册主题*

```jsx
  function registerTheme() {
    this.themeList.forEach(theme => {
      this.themes.register(theme.name, theme.style)
    })
  }
```

### *设置字号大小*

```jsx
  function setFontSize(fontSize) {
    this.defaultFontSize = fontSize
    if (this.themes) {
      this.themes.fontSize(fontSize + 'px')
    }
  }
```

## ePub电子书生成目录和定位信息

### *Book对象的钩子函数ready*

```kotlin
  this.book.ready.then(() => {
    // 生成目录
    this.navigation = this.book.navigation
    // 生成Locations对象
    return this.book.locations.generate()
  }).then(result => {
    // 保存locations对象
    this.locations = this.book.locations
    // 标记电子书为解析完毕状态
    this.bookAvailable = true
  })
```

### *ePub电子书通过百分比进行定位*

```jsx
function onProgressChange(progress) {
  const percentage = progress / 100
  const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0
  this.rendition.display(location)
}
```

## HTML5 range控件

```kotlin
<input class="progress" 
       type="range"
       max="100"
       min="0"
       step="1"
       @change="onProgressChange($event.target.value)" 
       @input="onProgressInput($event.target.value)"
       :value="progress"
       :disabled="!bookAvailable"
       ref="progress">
```

## nvm安装和使用

**1.定义：**

nvm，全称 Node Version Manager ，也就是node版本控制；

使用场景：当你同时进行两个或多个node项目开发，并且这些项目的node版本不一样时，nvm可以很好的帮你管理pc上的node版本切换

**2.下载：**

[nvm下载链接](https://github.com/coreybutler/nvm-windows/releases) 
注：下载文件名为 nvm-setup.zip 的链接

**3.安装：**

**默认安装：**安装nvm时候，全默认即可（如果自定义目录，切记 nvm的安装路径 ：不要有汉字，不要有空格，不然后面会出现乱码问题）；

**自定义安装：**打开安装包，选择nvm的存放路径，以及nodejs的存放路径，这里切记不要选择到c:/program files,这里的两个路径是为了自动在系统中添加环境变量的路径；

**4.设置代理**

打开nvm文件夹下的settings.txt文件，在最后添加以下代码：

```
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

将下载镜像源指向淘宝（这步也很重要，否则在安装node的时候会出现卡死，npm安装不成功的情况）

**5.使用：**

安装指定版本的node，比如：

在cmd上输入 nvm install 6.9.5

![img](https://img-blog.csdnimg.cn/20190612212709893.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTMyOTk2MzU=,size_16,color_FFFFFF,t_70)

 

**6.关于nvm的一些常用指令**

```cpp
nvm version         // 查看nvm版本
    
nvm install 4.6.2   // 安装node4.6.2版本（附带安装npm）

nvm uninstall 4.6.2 // 卸载node4.6.2版本

nvm list            // 查看node版本

nvm use 4.6.2       // 将node版本切换到4.6.2版本

nvm root　　　　     // 查看nvm安装路径 

nvm install latest  //下载最新的node版本和与之对应的npm版本
```

1,nvm nvm list 是查找本电脑上所有的node版本

\- nvm list 查看已经安装的版本
\- nvm list installed 查看已经安装的版本
\- nvm list available 查看网络可以安装的版本

2,nvm install 安装最新版本nvm

3,nvm use <version> ## 切换使用指定的版本node

4,nvm ls 列出所有版本

5,nvm current显示当前版本

6,nvm alias <name> <version> ## 给不同的版本号添加别名

7,nvm unalias <name> ## 删除已定义的别名

8,nvm reinstall-packages <version> ## 在当前版本node环境下，重新全局安装指定版本号的npm包

9,nvm on 打开nodejs控制

10,nvm off 关闭nodejs控制

11,nvm proxy 查看设置与代理

12,nvm node_mirror [url] 设置或者查看setting.txt中的node_mirror，如果不设置的默认是 https://nodejs.org/dist/
　　nvm npm_mirror [url] 设置或者查看setting.txt中的npm_mirror,如果不设置的话默认的是： https://github.com/npm/npm/archive/.

13,nvm uninstall <version> 卸载制定的版本

14,nvm use [version] [arch] 切换制定的node版本和位数

15,nvm root [path] 设置和查看root路径

16,nvm version 查看当前的版本

## 项目技术难点分析

### 1.分页算法的难点：

不同屏幕的尺寸是不一样的，要分出适合屏幕的页码，比较有难度

### 全文搜索算法：

高效的全文搜素算法，在全文中快速的搜索出位置

### 引入Web字体：

允许用户自行引入在互联网下载的字体，

### 主题设计：

主题变化，不仅图文背景间距，还能影响界面，如何高效管理界面

### 2.离线存储机制LocalStorage+IndexedDB

LocalStorage限制是不能大于5M

IndexedDB进行大文件的缓存

而电子书大多大于5M，如果每次都去请求加载电子书，非常耗费流量，先把电子书缓存到本地在阅读

### 3.大量的动画，兼容移动端的手势和鼠标一起操作

![image-20201219191012184](C:\Users\DELL\AppData\Roaming\Typora\typora-user-images\image-20201219191012184.png)

### 4.利用vuex+mixin实现组件解耦+复用，大大精简代码量

### 5.利用es6优雅地实现数据结构变化

数组变对象，对象变数组，如何将二维对象变成一维对象，二维数组变一维数组降维操作

### 6.科大讯飞web在线语音合成API开发

### 使用node.js的Crypto模块Hmac算法对信息进行认证

### 一些加密算法

《密码学》课上，老师讲了主要的信息认证方法

md5消息认证
md5加盐消息认证
sha消息认证

#### 1）md5

md5的认证是不可逆的。一个明文生成的密文是唯一的。只有两个明文相同，他们的密文才能相同。但是，攻击者可以使用彩虹表来攻击（暴力穷举呗）。越来越不安全。

```js
var crypto = require('crypto');
//明文文本
var content = 'password'；
//创建MD5加密方式
var md5 = crypto.createHash('md5');
//加密过程
md5.update(content);
//d为输出的最终密文
var d = md5.digest('hex');
```

既然不再安全，就不推荐使用了。

#### 2）sha1

```js
var crypto = require('crypto');
var content = 'password'；
//创建sha1加密方式
var shasum = crypto.createHash('sha1');
shasum.update(content);
var d = shasum.digest('hex');
```

##### MD5与sha1的不同点

MD5 使用小端排序LITTLE-ENDIAN，sha1 使用大端排序BIG-ENDIAN
MD5最后生成的摘要信息是16个字节，SHA1是20个字节。

#### 3）hmac

算法过程如下：

随机生成16位随机数，作为密钥。
密码加密
密钥对文本进行sha1加密
传输
认证流程

先由客户端向服务器发出一个验证请求。
服务器接到此请求后生成一个随机数并通过网络传输给客户端（此为挑战）。
客户端将收到的随机数。使用该随机数与用户输入的的密钥进行HMAC-MD5运算并得到一个结果作为认证证据传给服务器（此为响应）。
与此同时，服务器也使用该随机数与存储在服务器数据库中的该客户密钥进行HMAC-MD5运算，如果服务器的运算结果与客户端传回的响应结果相同，则认为客户端是一个合法用户。

```js
Signture = require('crypto')
    .createHmac('sha1', SecrectKey)
    .update(content)
    .digest()
    .toString('base64');
//有效防止彩虹表攻击。
```



## 第三章项目准备

完成项目开发前的准备工作，讲解如何引入字体图标、Web字体、rem、样式重置表，详细介绍vuex的基本原理及mapGetters的实现原理，搭建基于Nginx的静态资源服务器。

### 字体图标

.icon-boookmark字体图标

node8和node10中node-sass和sass-loader有兼容性错误

解决方法：卸载sass重新安装，cnpm uninstall node-sass sass-loader

### web字体

1. link引用
2. import引用

### viewport配置和rem设置 

设置缩放比例

rem自适应布局

```js
  //App.vue 
  //rem自适应布局
  document.addEventListener('DOMContentLoaded', () => {
    // window.innerWidth屏幕尺寸
    let fontSize = window.innerWidth / 10
    // 设置上限 最大值
    fontSize = fontSize > 50 ? 50 : fontSize
    const html = document.querySelector('html')
    html.style.fontSize = fontSize + 'px'
  })
```

```js
// rem尺寸
@function px2rem($px) {
  @return $px / $ratio + rem;
}
```

### 样式重置表

```js
// 聚合css文件
global.scss
```

```js
// rem尺寸
mixin.scss
```

```js
// 重置全局样式
reset.scss
```

### vuex

引入vuex+vue-devtools 多个组件共享状态

解决免费课程中参数层层传递的作用

放在共享区里面所有的组件都可以很方便的调用参数

模块化开发 单独见一个文件夹创建单独模块store->moudles->book.js

vuex

使用getters和actions高级特性

[vuex] unkonwn getter: xxxx xxx是不存在的

...扩展运算符 实现将对象展开合并到新的对象

```js
methods: {
    fn () {
        return {
            a: 1,
            b: 2
        }
    }
}
mounted () {
    console.log({
        // this.fn() 报错 无法合并
        // ...扩展运算符 实现将对象展开合并到新的对象
        ...this.fn(),
        c:3,
        d:4
	})
}

const getters = {
    a: () => 1,
    b: () => 2
}
function fn(keys) {
    return {
        a: () => 1,
        b: () => 2
    }
}
export default {
   computed: {//计算属性和上面很像
	...mapGetters(['test']),
	...this.fn(['a', 'b'])
    },
    methods: {
        fn() {
            return{
                a: 1,
                b: 2
            }
        }
    },
    mounted () {
        console.log(this.a, this.b)
    } 
}
```

通过模块化的方式将mutations和actions和getters封装 （原理3.6 28分钟）

vuex的基本原理及mapGetters的实现原理

#### Vue远程调试 vue-remote-devtools 的使用

cnpm install - g @vue/devtools

- 全局安装包 `npm install -g @vue/devtools`
- 执行命令 `vue-devtools`

- 在页面中加入 `<script src="http://localhost:8098"></script>`(在index.html加入)

正常访问页面之后会出现如下的图片

缺点就是所有的运行环境都引入了此调试方法，且如果地址不能访问将影响访问速度。

#### 高级用法

当前项目安装 `npm install --save-dev @vue/devtools`

引入模块 `import devtools from '@vue/devtools'`

引入模块要在引入vue之前 `import Vue from 'vue'`

实际用法

```csharp
if (process.env.NODE_ENV === 'development') {
  devtools.connect(/* host, port */)
}
```

这样就可以只在自己的开发环境使用了，唯一的问题是打包之后的代码包多了200k+，很是头疼，尝试使用webpack解决，当前使用的是webpack4

#### 解决打包过大的问题

使用require 动态引入

```jsx
if (process.env.NODE_ENV === 'development') {
  const devtools = require('@vue/devtools')

  devtools.connect('localhost', '8098')
}
```

### nginx静态资源服务器

俄罗斯 http占用资源少，运行速度快，并发能力强 加载快

反向代理，静态资源代理

windows用nginx访问tomcat项目，一直报错，通过查看日志，找到问题所在 

![nginx访问报错 (123 The filename directory name or volume lab](https://images1.tqwba.com/20200611/vphzbbzjy32.png)

2021/03/05 11:15:56 [crit] 4608#2588: *49 GetFileAttributesEx() "D:\Nginx-1.18/
esource" failed (123: The filename, directory name, or volume label syntax is incorrect), client: 192.168.9.102, server: resource, request: "GET / HTTP/1.1", host: "192.168.9.102:8081"
2021/03/05 11:15:57 [crit] 4608#2588: *50 CreateFile() "D:\Nginx-1.18/
esource/favicon.ico" failed (123: The filename, directory name, or volume label syntax is incorrect), client: 192.168.9.102, server: resource, request: "GET /favicon.ico HTTP/1.1", host: "192.168.9.102:8081", referrer: "http://192.168.9.102:8081/"

将配置的本地路径中“\”改为“/   ”，修改完成之后，nginx.exe -s reload重启nginx，就可以正常访问了

# 第四章 阅读器--标题菜单、字号字体及主题设置功能开发

如何实现阅读器的解析和渲染、手势翻页操作、标题栏和菜单栏组件的解耦，并实现字号字体设置和阅读器全局主题设置功能。

## 主要技术难点

epubjs

vuex+mixin

vue-i18n

动态切换主题+书签手势操作

## 阅读器解析+渲染

### 引用组件

views-》ebook-》index.vue

```js
<template>
<!-- ebook组件 -->
  <div class="ebook" ref="ebookView">
    <ebook-bookmark></ebook-bookmark>
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
    <router-view></router-view>
    <ebook-menu></ebook-menu>
    <ebook-footer></ebook-footer>
  </div>
</template>
```

### 电子书解析第一步 --- 获取链接

根据动态路由展示电子书

router.js动态路由父组件

views->ebook->index.vue引用组件

components->ebook->EbookReader.vue动态路由组件

在srore->modules->book.js组件化 定义filename url

Es-link报错 Missing space before function parent方法名前应该加空格报错

或者 eslint-disable 加禁用的规则

局部/*  eslint-disable space-before-function-paren  */

全局 在.eslintrc.js中的

```js
rules:{
	//忽略方法前没有空格报错
	'space-before-function-paren': 'off'
}
```

Ebook.js

```js
  <!-- 阅读器布局  翻页-->
      <div class="mask">
        <!-- 上一页 -->
        <div class="left" @click="prevPage"></div>
        <!-- 切换标题和菜单的显示状态 -->
        <div class="center" @click="toggleTitleAndMenu"></div>
        <!-- 下一页 -->
        <div class="right" @click="nextPage"></div>
      </div>
```

ebook->EbookReader.vue

```js
// 初始化渲染
      initRendition() {
        // 渲染电子书指定宽高全屏
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight,
          // 微信兼容性配置
          method: 'default'
        })
// 初始化接收url
      initEpub(target) {
        // 通过Epub.js解析和渲染电子书
        this.book = new Epub(target)
        this.setCurrentBook(this.book)
        this.setIsPaginating(true)
        this.setPaginate(this.$t('book.paginating'))
        this.initRendition()
        this.initGuest()
        this.parseBook()
      }
         ...
mounted() {
      // 获取链接
      // const baseUrl = 'http://192.168.1.123:8081/epub';
      // const fileName = this.$route.params.fileName.split('|').join('/');
      // console.log(`${baseUrl}${fileName}.epub`);
      // 动态路由获取电子书的路径
      if (this.$route.params.fileName.indexOf('|') > 0) {
        this.setFileName(
          this.$route.params.fileName.split('|').join('/'))
          .then(() => {
            // 实时下载电子书 路径
            this.initEpub(`${process.env.VUE_APP_EPUB_URL}/${this.fileName}.epub`)
            this.isOnline = false
          })
      } else {
        this.setFileName(this.$route.params.fileName)
          .then(() => {
            getLocalForage(this.fileName, (err, blob) => {
              if (!err) {
                if (blob) {
                  // 离线阅读模式
                  this.isOnline = false
                  this.initEpub(blob)
                } else {
                  // 在线阅读模式
                  this.isOnline = true
                  const opf = this.$route.query.opf
                  if (opf) {
                    this.initEpub(opf)
                  }
                }
              }
            })
          })
      }
```

和actions和getters封装 （原理3.6 28分钟）

## 翻页手势

在屏幕当中从左往右返回上一页，从右往左返回下一页，滑动位置不限制，可以在屏幕的任意位置滑动翻页，当点击屏幕的时候回出现标题页和菜单，点击的位置也不受限制；当标题页和菜单页都显示的时候点击翻页标题页和菜单页会隐藏

**手势**

电子书ebook对象实现原理是使用iframe

通过在iframe绑定自己的事件来

```js
// EbookReader.vue
//  返回上一页
      prevPage() {
        // 判断rendition对象是否存在
        if (this.rendition) {
          // 调用prev()
          this.rendition.prev()
          this.refreshLocation()
        }
        this.hideMenuVisible()
      },
      //  返回下一页
      nextPage() {
        // 判断rendition对象是否存在
        if (this.rendition) {
          // 调用next()
          this.rendition.next()
          this.refreshLocation()
        }
        this.hideMenuVisible()
      },
      initGuest() {
        //changeTouches： 存储几只手指点击的屏幕；一只手指有一条数据，两只手指触碰有两条数据
         // timeStamp：手势操作的时间 设定两次触碰间隔的时间不能超过多久
        //  clientX：当前点击屏幕X轴的位置/坐标
        // 手指滑动屏幕
        this.rendition.on('touchstart', event => {
          this.touchStartX = event.changedTouches[0].clientX
          this.touchStartTime = event.timeStamp
        })
        // 手指离开屏幕
        this.rendition.on('touchend', event => {
          // X轴手指偏移量 =  离开时坐标 - 开始时坐标
          const offsetX = event.changedTouches[0].clientX - this.touchStartX
          // 消耗的时间 = 手势操作的时间 - 手势开始的时间
          const time = event.timeStamp - this.touchStartTime
          // 手指划过的时间要求小于5秒 从左往右划过的距离大于40的时候 返回上一页
          if (time < 500 && offsetX > 40) {//时间小于500毫秒，间隔超过40
            this.prevPage() //返回上一页
          } else if (time < 500 && offsetX < -40) {// 手指划过的时间要求小于5秒 从右往左划过的距离大于40的时候 返回下一页
            this.nextPage()//返回下一页
          } else { // 当不满足以上两个条件的时候
            this.toggleMenuVisible()// 标题栏的显示隐藏
          }
          // 禁用事件默认行为
          event.preventDefault()
          // 禁止默认行为
          event.stopPropagation()
        })
      },
```

## 标题栏和菜单栏

EbookTitle.vue标题栏

EbookMenu.vue菜单栏

```js
// 标题栏过渡动画
// mixin.scss
.slide-down-enter, .slide-down-leave-to {
  transform: translate3d(0, -100%, 0)
}
.slide-down-enter-to, .slide-down-leave, .slide-up-enter-to, .slide-up-leave, .slide-right-enter-to, .slide-right-leave, .opacity-slide-up-enter-to, .opacity-slide-up-leave {
  transform: translate3d(0, 0, 0)
}

.popup-slide-up-enter-to, .popup-slide-up-leave {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}

.slide-down-enter-active, .slide-down-leave-active, .slide-up-enter-active, .slide-up-leave-active, .fade-enter-active, .fade-leave-active, .slide-right-enter-active, .slide-right-leave-active, .popup-slide-up-enter-active, .popup-slide-up-leave-active {
  transition: all .2s linear;
}

.slide-up-enter, .slide-up-leave-to {
  transform: translate3d(0, px2rem(138), 0)
}

.popup-slide-up-enter, .popup-slide-up-leave-to {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}

.slide-right-enter, .slide-right-leave-to {
  transform: translate3d(-100%, 0, 0);
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-enter-to, .fade-leave {
  opacity: 1;
}

$homeAnimationTime: .2s;
.title-enter-active, .title-leave-active, .host-search-enter-active, .host-search-leave-active, .shelf-tab-slide-up-enter-active, .shelf-tab-slide-up-leave-active {
  transition: all $homeAnimationTime linear;
}

```

出错

同名样式覆盖 后一样式覆盖前一样式

```js
// 居中显示
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin top {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
```

### utils-》mixin.js通用方法 复用 21

```js
 // 隐藏菜单栏
    hideMenuVisible() {
      this.setMenuVisible(false)
      // 当我们隐藏的时候设置setSettingVisible为-1
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    // 控制菜单栏显示隐藏
    toggleMenuVisible() {
      // 如果menuVisible为true
      if (this.menuVisible) {
        // 隐藏菜单栏
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
```

```js
// EbookReader.vue引入混用的代码 实现组件间的解耦与复用
mixins: [ebookMixin],
```

actions.js做映射 实现组件间的解耦，重复的代码放弃了

## 字号设置 UI 实现 

设置字体字号

EbookSettingFont.vue

utils->book.js设置字体字号

defaultFontSize

error:菜单栏的阴影会覆盖字体字号面板

```js
//EbookMenu.vue
<!-- 菜单栏 -->
  <div class="ebook-menu">
    <transition name="slide-up">
      <!-- 传递menuVisible值，用来控制菜单栏显示隐藏 -->
      <!-- menuVisible不显示或者settingVisible>=0就隐藏阴影 hide-box-shadow -->
      <div class="menu-wrapper" :class="{'hide-box-shadow': settingVisible >= 0 || !menuVisible}"
           v-show="menuVisible">
        <div class="icon-wrapper" :class="{'selected': settingVisible === 3}">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
```

## 字号设置功能实现 

```js
// EbookSettingFont.vue
// utils->book.js设置字体字号
<!--  showFontFamilySetting点击字体设置弹出层 -->
      <div class="setting-font-family" @click.stop="showFontFamilySetting">
        <!-- 字体图标 -->
        <div class="setting-font-family-text-wrapper">
          <!-- 默认字体 -->
          <span class="setting-font-family-text">{{defaultFontFamily}}</span>
        </div>

        <div class="setting-font-family-icon-wrapper">
          <span class="icon-forward"></span>
        </div>
      </div>
....
 // 设置字体字号
        this.styleLeft = {
          marginLeft: (left + item - leftText) / 2 + 'px',
          fontSize: this.fontSizeList[0].fontSize + 'px'
        }
        this.styleRight = {
          marginRight: (right + item - rightText) / 2 + 'px',
          fontSize: this.fontSizeList[this.fontSizeList.length - 1].fontSize + 'px'
        }
// utils->mixin.js设置字体字号
    // 设置字体大小
    setFontSize(fontSize) {
      this.setDefaultFontSize(fontSize).then(() => {
        this.switchTheme()
        Storage.saveFontSize(this.fileName, fontSize)
      })
    },
```

##  字体设置弹窗UI实现 

点击字体设置弹出层，弹出时向上移动，伴随着向上透明度逐渐提高的动画

消失的时候，向下移动，伴随着透明度逐渐减少

选择的文字要求支持中英文切换，选中一个字体后立即生效，同时生效的文字要求缓存到LocalStorage当中，字号设置也要求缓存，都被保存下来

42：45支持中英文切换

```js
// EbookSettingFontPopup.vue
// 字体弹窗组件
// 上面标题栏 下面字体列表
// 其中EbookSettingFont.vue字体图标点击的时候字体弹框
<template>
<!-- 字体弹窗组件 -->
  <transition name="popup-slide-up">
    <!-- fontFamilyVisible字体弹框显示的条件 -->
    <div class="ebook-popup-list" v-if="fontFamilyVisible">
      <!-- 标题栏 -->
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hideFontFamilySetting">
          <!-- 向下的图标 -->
          <span class="icon-down2"></span>
        </div>
        <!-- ”选择字体“ 文字-->
        <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
      </div>
      <!-- 字体列表 -->
      <div class="ebook-popup-list-wrapper">
        <!-- 字体数组 -->
        <div class="ebook-popup-item" v-for="(item, index) in fontFamily" :key="index"
             @click="setFontFamily(item.font)">
             <!-- 文字 isSelected判断是否被选中  item.font文字的内容-->
          <div class="ebook-popup-item-text" :class="{'selected': isSelected(item)}">{{item.font}}</div>
          <!-- 图标 -->
          <div class="ebook-popup-item-check" v-if="isSelected(item)">
            <!-- 选中图标 -->
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { ebookMixin } from '@/utils/mixin'

  export default {
    mixins: [ebookMixin],
    methods: {
      // isSelected字体是否被选中
      isSelected(item) {
        return this.defaultFontFamily === item.font
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-popup-list {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 350;
    width: 100%;
    font-size: 0;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .1);
    .ebook-popup-title {
      position: relative;
      text-align: center;
      padding: px2rem(15);
      border-bottom: px2rem(1) solid #b8b9bb;
      box-sizing: border-box;
      @include center;
      // 文本
      .ebook-popup-title-text {
        font-size: px2rem(14);
        font-weight: bold;
      }
      // 图标
      .ebook-popup-title-icon {
        position: absolute;
        left: px2rem(15);
        top: 0;
        height: 100%;
        @include center;
        // 向下的图标 
        .icon-down2 {
          font-size: px2rem(16);
          font-weight: bold;
        }
      }
    }
    .ebook-popup-list-wrapper {
      .ebook-popup-item {
        display: flex;
        padding: px2rem(15);
        // 左侧字体
        .ebook-popup-item-text {
          flex: 1;
          // 字体大小
          font-size: px2rem(14);
          text-align: left;
          // 选中文字
          &.selected {
            color: #346cb9;
            font-weight: bold;
          }
        }
        // 右侧图标
        .ebook-popup-item-check {
          flex: 1;
          text-align: right;
          .icon-check {
            font-size: px2rem(14);
            // 图标加粗蓝色显示
            font-weight: bold;
            color: #346cb9;
          }
        }
      }
    }
  }
</style>

```

```JS
// utils->mixin.js
// showFontFamilySetting点击字体设置弹出层
// 2
    showFontFamilySetting() {
      // 弹出字体弹出栏
      this.setFontFamilyVisible(true)
    },
    showSetting(key) {
      this.setSettingVisible(key)
    },
    // 隐藏菜单栏
    hideMenuVisible() {
      this.setMenuVisible(false)
      // 当我们隐藏的时候设置setSettingVisible为-1
      this.setSettingVisible(-1)
      // 隐藏字体弹出栏
      this.setFontFamilyVisible(false)
    },
    // 控制菜单栏显示隐藏
    toggleMenuVisible() {
      // 如果menuVisible为true
      if (this.menuVisible) {
        // 隐藏菜单栏
        this.setSettingVisible(-1)
        // 隐藏字体弹出栏
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    // 点击隐藏字体弹出栏
    hideFontFamilySetting() {
      // 隐藏字体弹出栏
      this.setFontFamilyVisible(false)
    },
```

##  字体设置弹窗功能实现 

1.点击列表其中某一个条目的时候,默认字体（外面的字体选择也会变化）需要产生变化  ，同时阅读器里面的背景字体也要产生变化

​	不需要在组件之间传值就可以实现文字变换，通过vuex

2.点击后菜单栏需要隐藏

```js
 //ebookreader.vue
//将阅读器的dom传入字体文件，通过Epub直接引用
        // hooks钩子函数
        // content当阅读器渲染完毕之后，可以获取资源文件的时候来调用register
        // contents对象主要用于管理资源
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            // addStylesheet表示可以手动的添加样式文件
               // env.VUE_APP_RES_URL规定ip端口号，让本地和服务器端同处于一个ip地址
            // ip问题，本地ip经常会改变，让测试环境和开发环境使用不同的url
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`)
          ]).then(() => {})
        })
```

将阅读器的dom传入字体文件，通过Epub直接引用

## vue报错A space is required after ','**

在，后面要加空格

![elint语法错误](D:\百度云（Plus）\Vue项目\Vue2.5 实战微信读书\报错\elint语法错误.jpg)

这是空格多了，删除多余的空格就可以了 删除空格后，运行正确；![elint语法错误2](D:\百度云（Plus）\Vue项目\Vue2.5 实战微信读书\报错\elint语法错误2.jpg)

处理办法再后面添加一行空白

## 环境变量

你可以在你的项目根目录中放置下列文件来指定环境变量：

```bash
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略

你可以在 vue.config.js 文件中计算环境变量。它们仍然需要以 VUE_APP_ 前缀开头。这可以用于版本信息:
只有 NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中。这是为了避免意外公开机器上可能具有相同名称的私钥。
process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  // config
}
#只可以在 vue.config.js 文件中计算环境变量。它们仍然需要以 VUE_APP_ 前缀开头。这可以用于版本信息:
NODE_ENV - 会是 "development"、"production" 或 "test" 中的一个。具体的值取决于应用运行的模式。
BASE_URL - 会和 vue.config.js 中的 publicPath 选项相符，即你的应用会部署到的基础路径。
```

```js
//.env.development.vue
VUE_APP_EPUB_URL=http://47.99.166.157/epub//
VUE_APP_EPUB_OPF_URL=http://47.99.166.157/epub2
VUE_APP_RES_URL=http://47.99.166.157/book/res//静态资源
VUE_APP_BASE_URL=http://47.99.166.157:3000
VUE_APP_VOICE_URL=http://47.99.166.157:3000//生成科大讯飞语音合成api
VUE_APP_BOOK_URL=http://47.99.166.157:3000
```

error：静态资源url不生效.env.development.vue环境变量在载入的时候需要在整个项目过程中一次性载入，最后其中的变量会载入到内存当中，运行状态环境变量和配置不生效

### error：跨域问题

![image-20210325111243178](C:\Users\DELL\AppData\Roaming\Typora\typora-user-images\image-20210325111243178.png)

## 字号和字体设置离线存储 

没有进行存储之前，页面一旦刷新就会恢复原有的配置，cookies跨域存储4k的数据，Local Storage可以存储，解决cookies存储空间不足的问题

1.每个特定域名下的cookie数量有限：每次HTTP请求都会发送到服务端，影响获取资源的效率；Cookie的最大存储量为4k；需要自己封装获取、设置、删除cookie的方法；。

2.，LocalStorage的最大存储量为5M左右，LocalStorage跟HTTP无关，不会被浏览器带到服务器。localStorage是持久化的本地存储，除非是通过js删除，或者清除浏览器缓存，否则数据是永远不会过期的。

sessionStorage用于本地存储一个会话中的数据，这些数据只有在同一个会话中的页面才能访问，并且当会话结束后，数据也随之销毁。所以sessionStorage仅仅是会话级别的存储，而不是一种持久化的本地存储。

安装local storage库 `npm i --save web-storage-cache`

```js
// utils->localStorage.js
// 封装local storage 离线存储时用到的方法
// 引用local storage库
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
// ...
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

```

```js
// utils->mixin.js 
// 设置字体 离线存储字体
    setFontFamily(font) {
      // 传入font字体
      this.setDefaultFontFamily(font).then(() => {
        this.switchTheme()
        // 调用utils->localStorage.js中的saveFontFamily方法离线存储
        Storage.saveFontFamily(this.fileName, font)
      })
    },
```

解决初始化字体字号没有值的情况

```js
// EbookReader.vue
// 初始化字体大小
      initFontSize() {
        // 获取字号
        let fontSize = getFontSize(this.fileName)
        // 如果fontSize不存在
        if (!fontSize) {
          // 设置字号默认为16
          fontSize = 16
          // 离线化存储字号
          saveFontSize(this.fileName, fontSize)
        }
        return fontSize
      },
      // 初始化getFontFamily
      initFontFamily() {
        // 获取字体
        let font = getFontFamily(this.fileName)
        // 如果font不存在
        if (!font) {
          // 默认字体
          font = 'Default'
          // 离线化存储字体
          saveFontFamily(this.fileName, font)
        }
        return font
      },
        initRendition() {
        // 渲染电子书指定宽高全屏
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight,
          // 微信兼容性配置
          method: 'default'
        })
        Promise.all([
          this.setDefaultTheme(this.initTheme()),
          // 把默认字号的值传到vuex状态管理渲染字号 
          this.setDefaultFontSize(this.initFontSize()),
          // 把默认字体的值传到vuex状态管理渲染字体 
          this.setDefaultFontFamily(this.initFontFamily())
        ]).then(() => {
```

## 字体设置标题国际化 

所有的按钮文字，提示文字都支持国际化，中英文两种语言，可以扩展

使用vue-i18n插件

```js
// lang->index.js
// 使用vue-i18n插件
import Vue from 'vue'
// 通过插件的形式挂载
import VueI18n from 'vue-i18n'
import en from './en'
import cn from './cn'
import { getLocale, saveLocale } from '../utils/localStorage'

加载插件
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

```

## 阅读器主题设置UI实现

```js
// EbookSettingThee.vue
<template>
<!-- 主题面板 -->
  <transition name="slide-up">
    <!-- menuVisible菜单栏显示 -->
    <!-- settingVisible菜单栏选项设置 -1: 不显示， 0：字号， 1：主题， 2：进度， 3： 目录 -->
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 1">
      <div class="setting-theme">
        <!-- 主题的列表themeList -->
        <!-- setTheme设置主题 -->
        <div class="setting-theme-item" v-for="(item, index) in themeList" :key="index"
             @click="setTheme(item.name)">
             <!-- 主题颜色 -->
          <div class="preview"
               :class="{'selected': item.name === defaultTheme}"
               :style="{background: item.style.body.background}"></div>
               <!-- selected选中状态 -->
               <!-- 主题别名 -->
          <div class="text"
               :class="{'selected': item.name === defaultTheme}">{{item.alias}}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { ebookMixin } from '@/utils/mixin'

  export default {
    // 混入
    mixins: [ebookMixin]
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 190;
    width: 100%;
    height: px2rem(90);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-theme {
      height: 100%;
      display: flex;
      .setting-theme-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: px2rem(5);
        box-sizing: border-box;
        .preview {
          flex: 1;
          border: px2rem(1) solid #ccc;
          box-sizing: border-box;
          border: none;
          &.selected {
            box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, .1);
            border: px2rem(2) solid #5e6369;
          }
        }
        .text {
          flex: 0 0 px2rem(20);
          font-size: px2rem(14);
          @include center;
        }
      }
    }
  }
</style>
```

## 阅读器主题设置局部切换功能实现 

主题切换分为全局和部分主题切换

```js
// EbookReader.vue
// 初始化主题
      initTheme() {
        // 获取主题
        let defaultTheme = getTheme(this.fileName)
        // 如果defaultTheme不存在
        if (!defaultTheme) {
          // 设置主题默认为themeList[0]
          defaultTheme = this.themeList[0].name
          // 离线化存储主题
          saveTheme(this.fileName, defaultTheme)
        }
        return defaultTheme
      },
```

```js
// mixin.js    
// 局部
    // 主题注册
    registerTheme() {
      // 遍历主题
      this.themeList.forEach(theme => {
        // 传入名称，样式
        this.currentBook.rendition.themes.register(theme.name, theme.style)
      })
    },
    // 切换主题
    switchTheme() {
      const rules = this.themeList.filter(theme => theme.name === this.defaultTheme)[0]
      if (this.defaultFontFamily && this.defaultFontFamily !== 'Default') {
        rules.style.body['font-family'] = `${this.defaultFontFamily}!important`
      } else {
        rules.style.body['font-family'] = `Times New Roman!important`
      }
      this.registerTheme()
      this.currentBook.rendition.themes.select(this.defaultTheme)
      this.currentBook.rendition.themes.fontSize(this.defaultFontSize)
      this.setGlobalTheme(this.defaultTheme)
    },
    // 设置字号
    setFontSize(fontSize) {
      // 传入font大小
      this.setDefaultFontSize(fontSize).then(() => {
        // 切换主题
        this.switchTheme()
        // 调用utils->localStorage.js中的saveFontSize方法离线存储
        Storage.saveFontSize(this.fileName, fontSize)
      })
    },

    // 设置主题
    setTheme(theme) {
      // 传入主题
      this.setDefaultTheme(theme).then(() => {
        // 切换主题
        this.switchTheme()
        // 离线存储主题
        Storage.saveTheme(this.fileName, theme)
      })
    },
```

## 全局动态添加删除样式

```js
// mixin.js
// 全局样式设置（主题）
    setGlobalTheme(theme) {
      // 清除全部样式
      removeAllCss()
      // 根据主题名称切换class样式表
      switch (theme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          this.setDefaultTheme('Default')
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
```

样式在资源服务器中的theme中

样式表使用!important提高权重，覆盖原有样式

```js
// utils->utils.js

// 添加样式
// 动态添加删除class样式
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
// 因为使用的是appendChild追加link标签，所以每点击一下，head标签下都会多出一个css文件，影响渲染效率
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
```

# 第5章 阅读器--阅读进度、目录、全文搜索功能开发

## 阅读进度功能实现

1.进度百分比，当前章节的名称，当前阅读的时；

2.拖动进度条松开后跳转指定的位置

3.点击左右两边的图标可以快速切换到上一章下一章

4.翻页后查看进度条可以正确的显示当前百分比，当前页在所在书籍的百分比

5.实时保存进度信息

### 进度面板

```js
// 进度面板EbookSettingProgress.vue
<template>
<!-- 进度条 -->
  <transition name="slide-up">
    <!-- menuVisible菜单栏显示 -->
    <!-- settingVisible菜单栏选项设置 -1: 不显示， 0：字号， 1：主题， 2：进度， 3： 目录 -->
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <!-- 已阅读时间 -->
          <span class="read-time-text">{{getReadTime()}}</span>
          <span class="icon-forward"></span>
        </div>
        <!-- 进度 -->
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper">
            <!-- 上一章节图标 -->
            <span class="icon-back" @click="prevSection()"></span>
          </div>
          <!-- 进度线 -->
          <!-- onProgressInput拖动进度条时触发事件
          onProgressChange进度条松开后触发事件，根据进度条数值跳转到指定位置 -->
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 @input="onProgressInput($event.target.value)"
                 @change="onProgressChange($event.target.value)"
                 :value="progress"
                 :disabled="!bookAvailable"
                 ref="progress">
          <!-- 下一章节图标 -->
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          
        <!-- 章节名称 -->
          <span class="progress-section-text">{{getSectionName}}</span>
          <!-- 阅读进度显示 -->
          <!-- bookAvailable进度显示 -->
          <span class="progress-text">({{bookAvailable ? progress + '%' : $t('book.loading')}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
// 混入
  import { ebookMixin } from '../../utils/mixin'
  import { saveProgress } from '../../utils/localStorage'

  export default {
    mixins: [ebookMixin],
    data() {
      return {
        isProgressLoading: false
      }
    },
    methods: {
      // 拖动进度条时触发事件
      onProgressInput(progress) {
        this.setProgress(progress).then(() => {
          this.updateProgressBg()
        })
      },
      // 进度条松开后触发事件，根据进度条数值跳转到指定位置
      onProgressChange(progress) {
        this.setProgress(progress).then(() => {
          this.updateProgressBg()
          this.displayProgress()
        })
        saveProgress(this.fileName, progress)
      },
      // 更新进度条
      updateProgressBg() {
        this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
      }
    },
    // 更新
    updated() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 190;
    width: 100%;
    height: px2rem(90);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      // 阅读时间图标
      .read-time-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: px2rem(40);
        @include center;
        font-size: px2rem(12);
      }
      // 进度条
      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .progress {
          flex: 1;
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          background: -webkit-linear-gradient(#5d6268, #5d6268) no-repeat, #b4b5b7;
          background-size: 0 100%;
          margin: 0 px2rem(10);
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: #ceced0;
            box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, .15);
            border: none;
          }
        }
        .progress-icon-wrapper {
          flex: 0 0 px2rem(22);
          font-size: px2rem(22);
          @include center;
        }
      }

      // 当前章节的名称
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(5);
        width: 100%;
        font-size: px2rem(12);
        text-align: center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        @include center;
        .progress-section-text {
          line-height: px2rem(15);
          @include ellipsis;
        }
        .progress-text {
        }
      }
    }
  }
</style>

```

### 分页逻辑

```js
// EbookReader.vue
// ready在book解析的过程全部结束后调用，
        this.book.ready.then(() => {
          // 当前页
          this.setCurrentBook(this.book)

          // 简单的分页算法
          // 判断当前屏幕的宽度和375对比 ， 如果宽度大于375 比值增加就会大于750，否则减小
          // 字体越大一页显示值就会就小，当前字体大小 / 字体标准值16px，
          // 这个分页最大的问题就是没有考虑资源文件，比如图片的大小 有些图片较大或者有些字体标题较大
          // 使用这个分页算法没有办法做精确的分页，只能用来做进度百分比，做精确分页不太准确
          // 传入需要分页的文字数 750 * 屏幕宽度 / 375 * 字体大小 / 16
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
          
          // 异步获取locations
        }).then(locations => {
          // 分页信息
          // epubcfi可以用来电子书定位，可以定位电子书的任何一个位置
          // console.log(locations);
          locations.forEach(location => {
            const loc = location.match(/\[(.*)\]!/)[1]
            // loc
            console.log(loc)
            this.navigation.forEach(item => {
              if (item.idhref && item.idhref.indexOf(loc) >= 0) {
                item.pagelist.push(location)
              }
            })
            let currentPage = 1
            this.navigation.forEach((item, index) => {
              if (index === 0) {
                item.page = 1
              } else {
                item.page = currentPage
              }
              currentPage += item.pagelist.length + 1
            })
          })
```

### 进度拖动功能

```js
// mixin.js
   // 展示当前进度所在的页面
    displayProgress() {
      // 获取定位数据cfiFromPercentage 通过百分比获取cfi   this.progress / 100
      const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
      // console.log(cfi)
      // 渲染cif
      this.currentBook.rendition.display(cfi).then(() => {
        this.refreshLocation()
      })
    },
```

```js
// EbookSettingProgress.vue
      // 拖动进度条时触发事件
      onProgressInput(progress) {
          // 拖动时进度百分比也随之变化 文字也发生变化
        this.setProgress(progress).then(() => {
          // 更新进度条背景 
          this.updateProgressBg()
        })
      },
      // 进度条松开后触发事件，根据进度条数值跳转到指定位置
      onProgressChange(progress) {
        this.setProgress(progress).then(() => {
          // 更新进度条背景 
          this.updateProgressBg()
          // 展示当前进度所在的页面
          this.displayProgress()
        })
        // 离线保存进度条
        saveProgress(this.fileName, progress)
      },
      // 更新进度条背景 拖动进度条背景色左侧进度条加深表示已经读过
      updateProgressBg() {
        // 设置值进度条背景 0% 100%从左到右
        this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
      }
    },
    // 更新进度条初始状态 对progress初始化
    updated() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    }
```

### 上下章节切换功能

```js
// EbookSettingProgress.vue
 // 上一章节
      prevSection() {
        // 当前章节>0 以及  bookAvailbale书籍解析完毕
        if (this.section > 0 && !this.isProgressLoading) {
          this.isProgressLoading = true
          // 通过setSection将新的值传递给vuex；this.section - 1上一章
          this.setSection(this.section - 1).then(() => {// 修改成功后调用异步方法展示
            // 展示章节的内容
            this.displaySection(() => {
              // 更新进度条背景 
              this.updateProgressBg()
              this.isProgressLoading = false
            })
          })
        }
      },
      // 下一章节
      nextSection() {
        if (this.currentBook.spine.length - 1 > this.section && !this.isProgressLoading) {
          this.isProgressLoading = true
          // 通过setSection将新的值传递给vuex；this.section +1 下一章
          this.setSection(this.section + 1).then(() => {
            // 展示当前章节的内容
            this.displaySection(() => {
              // 更新进度条背景 
              this.updateProgressBg()
              this.isProgressLoading = false
            })
          })
        }
      },
```



### 章节切换和进度同步 

保存阅读进度功能

## 目录

### 目录浮出效果

Tab选项切换和搜索效果

图书内容布局

图书内容样式

 目录数据结构开发

 多级目录功能

```vue
//EbookLoading.vue
<template>
<!-- 目录加载动画 -->
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subItem, subIndex) in item" :key="subIndex">
          <div class="ebook-loading-line" ref="line"></div>
          <div class="ebook-loading-mask" ref="mask"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { px2rem } from '@/utils/utils'

  export default {
    data() {
      return {
        data: [
          [{}, {}, {}],
          [{}, {}, {}]
        ],
        maskWidth: [
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 }
        ],
        lineWidth: [
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 }
        ],
        add: true,
        end: false
      }
    },
    methods: {},
    mounted() {
      this.task = setInterval(() => {
        this.$refs.mask.forEach((item, index) => {
          const mask = this.$refs.mask[index]
          const line = this.$refs.line[index]
          let maskWidth = this.maskWidth[index]
          let lineWidth = this.lineWidth[index]
          if (index === 0) {
            if (this.add && maskWidth.value < 16) {
              maskWidth.value++
              lineWidth.value--
            } else if (!this.add && lineWidth.value < 16) {
              maskWidth.value--
              lineWidth.value++
            }
          } else {
            if (this.add && maskWidth.value < 16) {
              let preMaskWidth = this.maskWidth[index - 1]
              if (preMaskWidth.value >= 8) {
                maskWidth.value++
                lineWidth.value--
              }
            } else if (!this.add && lineWidth.value < 16) {
              let preLineWidth = this.lineWidth[index - 1]
              if (preLineWidth.value >= 8) {
                maskWidth.value--
                lineWidth.value++
              }
            }
          }
          mask.style.width = `${px2rem(maskWidth.value)}rem`
          mask.style.flex = `0 0 ${px2rem(maskWidth.value)}rem`
          line.style.width = `${px2rem(lineWidth.value)}rem`
          line.style.flex = `0 0 ${px2rem(lineWidth.value)}rem`
          if (index === this.maskWidth.length - 1) {
            if (this.add) {
              if (maskWidth.value === 16) {
                this.end = true
              }
            } else {
              if (maskWidth.value === 0) {
                this.end = true
              }
            }
          }
          if (this.end) {
            this.add = !this.add
            this.end = false
          }
        })
      }, 20)
    },
    beforeDestroy() {
      if (this.task) {
        clearInterval(this.task)
      }
    }
  }
</script>

```

```js
      // 获取图书基本信息
      parseBook() {
        // 图书正在加载的状态
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
          saveMetadata(this.fileName, metadata)
        })
        if (this.isOnline) {
          this.book.coverUrl().then(url => {
            this.setCover(url)
          }) 
        } else {
          // 根据封面获取url
          this.book.loaded.cover.then(cover => {
            this.book.archive.createUrl(cover).then(url => {
              this.setCover(url)
            })
          })
        }
        this.book.loaded.navigation.then(nav => {
          // console.log(nav)
          // 目录降维 将树形结构转化为数组  map 遍历 ‘.’扩展运算符 可以将数组内的内容逐层展开
          // concat数组合并 flatten()递归调用可降多维数组
          const navItem = (function flatten(arr) {
            return [].concat(...arr.map(v => [v, ...flatten(v.subitems)]))
          })(nav.toc)

          // find查询第几级 v=0就是第一级
          // 通过parent获取目录级别 parent空就是一级目录 有值就是二级
          // 判断parent是否存在，如果不存在直接返回，否则继续判断parent
          function find(item, v = 0) {
            // 找到上一级
            const parent = navItem.filter(it => it.id === item.parent)[0]
            return !item.parent ? v : (parent ? find(parent, ++v) : v)
          }

          navItem.forEach(item => {
            item.level = find(item)
            item.total = 0
            item.pagelist = []
            if (item.href.match(/^(.*)\.html$/)) {
              item.idhref = item.href.match(/^(.*)\.html$/)[1]
            } else if (item.href.match(/^(.*)\.xhtml$/)) {
              item.idhref = item.href.match(/^(.*)\.xhtml$/)[1]
            }
          })
          this.setNavigation(navItem)
        })
        // ready在book解析的过程全部结束后调用，
        this.book.ready.then(() => {
```

### 目录加载动画

```js
//EbookLoaading.vue

```



## 全文搜索功能实现

搜索算法+数组降维

 搜索关键字高亮+搜索结果高亮显示

 原理分析+布局实现

 动画效果实现

书签手势实现

输出关键字，显示搜索关键字列表，点击结果跳转到关键字所在页面搜索结果高亮显示

```Vue
<template>
  <!-- 阅读器侧边栏组件  阅读进度、目录、全文搜索-->
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <!-- 搜索框 -->
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <!-- 搜索框输入 -->
        <input
          class="slide-contents-search-input"
          type="text"
          :placeholder="$t('book.searchHint')"
          @click="showSearchPage()"
          v-model="searchText"
          @keyup.enter="search()"
          ref="searchInput"
        />
      </div>
      <!-- 搜索框状态 -->
      <div
        class="slide-contents-search-cancel"
        v-if="searchVisible"
        @click="hideSearchPage()"
      >
        {{ $t("book.cancel") }}
      </div>
    </div>
    <!-- 阅读器左边目录 自适应布局优化-->
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <!-- 书籍封面 -->
      <div class="slide-contents-book-img-wrapper">
        <img v-lazy="cover" class="slide-contents-book-img" />
      </div>
      <!-- 封书籍信息 -->
      <div class="slide-contents-book-info-wrapper">
        <!-- 标题 -->
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{
            metadata.title
          }}</span>
        </div>
        <!-- 作者 -->
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">{{
            metadata.creator
          }}</span>
        </div>
      </div>
      <!-- 已读和进度 -->
      <div class="slide-contents-book-progress-wrapper">
        <!-- 阅读进度 -->
        <div class="slide-contents-book-progress">
          <span class="progress">{{ progress + "%" }}</span>
          <span class="progress-text">{{ $t("book.haveRead2") }}</span>
        </div>
        <!-- 已读时间 -->
        <div class="slide-contents-book-time">{{ getReadTime() }}</div>
      </div>
    </div>
    <!-- 搜索的时候，把目录列表隐藏掉，然后把搜索列表展示出来 -->
    <scroll
      class="slide-contents-list"
      :top="156"
      :bottom="48"
      ref="scroll"
      v-show="!searchVisible"
    >
      <!-- 循环遍历出目录 -->
      <div
        class="slide-contents-item"
        v-for="(item, index) in navigation"
        :key="index"
        @click="display(item.href)"
      >
        <!-- 当前所读章节 -->
        <span
          class="slide-contents-item-label"
          :class="{ selected: section === index }"
          >{{ item.label.trim() }}</span
        >
        <span class="slide-contents-item-page">{{ item.page }}</span>
      </div>
    </scroll>
    <!-- 搜索列表 -->
    <scroll
      class="slide-search-list"
      :top="66"
      :bottom="48"
      ref="scroll"
      v-show="searchVisible"
    >
      <div
        class="slide-search-item"
        v-for="(item, index) in searchList"
        :key="index"
        v-html="item.excerpt"
        @click="display(item.cfi, true)"
      ></div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import Scroll from "../Scroll";

export default {
  mixins: [ebookMixin],
  components: {
    Scroll,
  },
  data() {
    return {
      searchText: "",
      searchVisible: false,
      searchList: null,
    };
  },
  methods: {
    showSearchPage() {
      this.searchVisible = true;
    },
    hideSearchPage() {
      this.searchVisible = false;
    },
    // 搜索 搜索关键字高亮+搜索结果高亮显示
    search() {
      this.doSearch(this.searchText).then((result) => {
        this.searchList = result.map((item) => {
          // 搜索内容高亮显示
          item.excerpt = item.excerpt.replace(
            this.searchText,
            `<span class="content-search-text">${this.searchText}</span>`
          );
          return item;
        });
        this.$refs.searchInput.blur();
      });
    },
    // epub.js集成的全文搜索功能实现
    doSearch(q) {
      // 该方法 中，q为输入的关键词，在全篇电子书中，查找关键词，返回关键词所在的位置。
      return Promise.all(
        // spineItems表示section章节 section章节和目录很相似，大体一一对应
        // section用管理当前章节下的所有信息（下方的item就是section）
        this.currentBook.spine.spineItems.map(
          // 调用section.load方法
          // 将book对象作为上下文传进去 这样section就拿到了资源 获取了文本信息
          // 获取信息之后调用find方法传入搜索关键字，这样就可以实现章节全文搜索检索
            //find() 方法就是根据传入的函数遍历数组中每一个元素，返回值为数组中第一个符合条件的值
          // 本质就是map()将全文信息搜索遍历一次，查询完之后使用了Promise.all统一处理获得results
          // finally()表示当异步执行完毕之后执行这个方法item.unload会将资源进行释放
          // 因为加载一个html到内存中会占用几百k甚至1m
          (item) =>
            item
              .load(this.currentBook.load.bind(this.currentBook))
              .then(item.find.bind(item, q))
              .finally(item.unload.bind(item))
        )
        // 得到的是一组多维数组因为得到的是二维数组，所以需要像 目录那样降维。
        // concat() 方法用于连接两个或多个数组。
        // Promise.resolve处理将多维数组转化为一维数组
        // concat()无法连接多维数组，通过apply()把数组当做对象传入参数数组实现数组降维
      ).then((results) => Promise.resolve([].concat.apply([], results)))
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.ebook-slide-contents {
  width: 100%;
  font-size: 0;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      border-radius: px2rem(3);
      @include center;
      .slide-contents-search-icon {
        flex: 0 0 px2rem(28);
        @include center;
        .icon-search {
          font-size: px2rem(12);
        }
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(32);
        font-size: px2rem(14);
        background: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include right;
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(45);
      box-sizing: border-box;
      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      @include columnLeft;
      .slide-contents-book-title {
        font-size: px2rem(14);
        line-height: px2rem(16);
        padding: 0 px2rem(10);
        box-sizing: border-box;
        @include left;
        .slide-contents-book-title-text {
          @include ellipsis2(1);
        }
      }
      .slide-contents-book-author {
        font-size: px2rem(12);
        line-height: px2rem(14);
        padding: 0 px2rem(10);
        box-sizing: border-box;
        margin-top: px2rem(5);
        @include left;
        .slide-contents-book-author-text {
          @include ellipsis2(1);
        }
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      @include columnLeft;
      .slide-contents-book-progress {
        .progress {
          font-size: px2rem(14);
          line-height: px2rem(16);
        }
        .progress-text {
          font-size: px2rem(12);
          line-height: px2rem(14);
          margin-left: px2rem(2);
        }
      }
      .slide-contents-book-time {
        font-size: px2rem(12);
        line-height: px2rem(14);
        margin-top: px2rem(5);
      }
    }
  }
  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      display: flex;
      padding: px2rem(20) 0;
      box-sizing: border-box;
      .slide-contents-item-label {
        flex: 1;
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include ellipsis;
      }
      .slide-contents-item-page {
        flex: 0 0 px2rem(30);
        font-size: px2rem(10);
        @include right;
      }
    }
  }
  .slide-search-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item {
      font-size: px2rem(14);
      line-height: px2rem(16);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>
```

## 页眉+页脚

# 第5章

## 书签手势实现（下拉状态管理）

下拉阶段分为三个阶段
第一阶段：不变。
第二阶段：![在这里插入图片描述](https://img-blog.csdnimg.cn/20191008234001431.png)
第三阶段：![在这里插入图片描述](https://img-blog.csdnimg.cn/20191008234021854.png)

代码实现，通过监听offsetY：

```vue
//EbookBookmark.vue
```



# 第6章 阅读器--书签功能、页眉页脚及兼容性优化



# 第7章 书城首页、搜索页、列表页和详情页开发 

## 复杂交互的实现思路

1.分析：捕捉细节，看懂需求

2.拆分：将复杂问题转化为若干简单问题的集合

3.求解：针对简单问题进行求解

4.优化：对实现过程进行优化

## 搜索页

布局使用top布局

home组件

### 向下滑动屏幕时的交互细节分析

1.标题和推荐图标向下渐隐

2.搜索框在向上的移动到标题位置

3.搜索框逐渐变窄以适应屏幕，逐步变化

4.左侧的返回按钮向下居中

5.标题下方产生阴影

```vue
home->searchBar.vue
```

```js
book.js
// 寻找图书
export function findBook(fileName) {
  const bookList = getLocalStorage(BOOK_SHELF_KEY)
  return flatBookList(bookList).find(item => item.fileName === fileName)
}
```



## 随机推荐动画

### 推荐的交互细节分析

1.弹出卡片

2.卡片翻转动画

3.烟花动画

4.弹出推荐图书

```.vue
//flapCard.vue
```

## 书籍详情页面

```.vue
components/detail/detaiTitle
components/detail/bookInfo
store/bookDetail.vue
```



# 第8章 书架页面开发

## 书架

```bookShlef.vue
bookShlef.vue
```

## 分组

```js
//shelf.vue
//对话框
//shlefGroupDialog.vue
```

## 书架搜索

```js
//shlefSearch.vue
```



# 第9章 听书页面开发

听书页面的开发过程，科大讯飞在线语音合成API的对接方法、播放器面板的布局实现、播放器的实现原理和方法。

## 听书功能介绍

听书功能在入口书的详情界面，点击听书，在听书页面可以选择章节，弹出播放器面板，点击播放器面板会弹出一个详细的播放器，上方会有章节名称，下方会有章节的内容

两个技术难点

1.播放器的实现，使用html5的audio api实现使用科大讯飞在线语音合成api语音播放，不能连续播放的原因是，科大讯飞api有一个限制，每一次只能传入1000字符，超过1000个字符没有办法在线解析，在app中使用的是离线解析，离线解析和在线解析的区别，离线解析是把语音包存储到本地，然后一次性将整本书生成一个音频文件，而在线解析是实时的向科大讯飞平台进行在线解析

2.调用语音合成api

##  听书组件集成 

界面布局，小动画，播放面板

![9-1](D:\百度云（Plus）\Vue项目\Vue2.5 实战微信读书\项目资源图片\9-1.jpg)

```js
// views->store->bookSpeaking.vue
<!-- 听书组件 核心界面-->
```



```js
// views->store->bookDetail.vue      
// 快速解析电子书
      trialListening() {
        // 获取缓存中的电子书     err：是否报错 value：实际的值
        getLocalForage(this.bookItem.fileName, (err, value) => {
          // 没有报错 Blob存在时  value是Blob的子类时 通过离线的方式获取缓存中的电子书
          if (!err && value instanceof Blob) {
            // 跳转到听书页面
            this.$router.push({
              path: '/book-store/book-speaking',
              query: {
                fileName: this.bookItem.fileName
              }
            })//缓存中没有电子书时，通过在线方式获取电子书
          } else {
            // this.showToast(this.$t('shelf.downloadFirst'))
            this.$router.push({
              path: '/book-store/book-speaking',
              query: {
                fileName: this.bookItem.fileName,
                // 通过opf文件来解析
                opf: this.opf
              }
            })
          }
        })
      },
```

## 听书组件布局源码分析

听书组件布局

```js
// views->store->bookSpeaking.vue
<template>
<!-- 听书组件 核心界面-->
  <div class="book-speaking">
    <!-- 最上面的标题 -->
    <detail-title @back="back" ref="title"></detail-title>
    <!-- 上下滚动滚动条 -->
    <scroll class="content-wrapper"
            :top="42"
            :bottom="scrollBottom"
            :ifNoScroll="disableScroll"
            @onScroll="onScroll"
            ref="scroll">
            <!-- 图书信息 -->
      <book-info :cover="cover"
                 :title="title"
                 :author="author"
                 :desc="desc"></book-info>
                 <!-- 语音朗读图标 -->
      <div class="book-speak-title-wrapper">
        <div class="icon-speak-wrapper">
          <!-- 朗读图标 -->
          <span class="icon-speak"></span>
        </div>
        <div class="speak-title-wrapper">
          <span class="speak-title">{{$t('speak.voice')}}</span>
        </div>
        <!-- 折叠功能图标 -->
        <div class="icon-down-wrapper" @click="toggleContent">
          <span :class="{'icon-down2': !ifShowContent, 'icon-up': ifShowContent}"></span>
        </div>
      </div>
      <!-- 电子书内容详情 -->
      <div class="book-detail-content-wrapper" v-show="ifShowContent">
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.navigation">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
          <div class="book-detail-content-item-wrapper">
            <!-- 目录信息 -->
            <!-- flatNavigation将多级目录转化为一级目录 -->
            <div class="book-detail-content-item" v-for="(item, index) in flatNavigation" :key="index"
                 @click="speak(item, index)">
                 <!-- speak-playing当我们点击它的时候出现，目录信息前面的小播放动画 -->
                 <!-- number竖线的长度 -->
              <speak-playing v-if="playingIndex === index"
                             :number="5"
                             ref="speakPlaying"></speak-playing>
                             <!-- item.label目录信息 -->
              <div class="book-detail-content-navigation-text" :class="{'is-playing': playingIndex === index}"
                   v-if="item.label">{{item.label}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 播放器  引入播放器但没有在界面显示-->
      <audio @canplay="onCanPlay"
             @timeupdate="onTimeUpdate"
             @ended="onAudioEnded"
             ref="audio"></audio>
    </scroll>
    <!-- 最下方的底部播放面板 -->
    <bottom :chapter="chapter"
            :currentSectionIndex="currentSectionIndex"
            :currentSectionTotal="currentSectionTotal"
            :showPlay="showPlay"
            :isPlaying.sync="isPlaying"
            :playInfo="playInfo"
            @onPlayingCardClick="onPlayingCardClick"></bottom>
    <!-- 加载虚拟电子书，获取电子书某些信息，让电子书挂载到read下面，分析出电子书的相关信息 -->
    <!-- 设置book-wrapper，但在界面上看不到-->
    <div class="book-wrapper">
      <div id="read"></div>
    </div>
    <!-- 弹出式播放窗口 -->
    <speak-window :title="this.chapter ? this.chapter.label : ''"
                  :book="book"
                  :section="section"
                  :currentSectionIndex.sync="currentSectionIndex"
                  :currentSectionTotal="currentSectionTotal"
                  :isPlaying.sync="isPlaying"
                  :playInfo="playInfo"
                  @updateText="updateText"
                  ref="speakWindow"></speak-window>
                  
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>
```

 speak-playing当我们点击它的时候出现，目录信息前播放小动画 循环生成'|'竖线

```js
// speakPlaying.vue
<template>
 <!-- speak-playing当我们点击它的时候出现，目录信息前播放小动画 -->
  <div class="playing-item-wrapper">
    <!-- 循环生成'|'竖线 -->
    <div class="playing-item" :style="item" v-for="(item, index) in styles" :key="index" ref="playingItem"></div>
  </div>
</template>

<script>
  import { px2rem } from '@/utils/utils'

  export default {
    props: {
      number: Number
    },
    computed: {
      // 样式
      styles() {
        const styles = new Array(this.number)
        for (let i = 0; i < styles.length; i++) {
          // 拿到随机整数+rem就是竖线|的高度
          styles[i] = {
            height: px2rem(this.random()) + 'rem'
          }
        }
        return styles
      }
    },
    methods: {
      // 开始动画
      startAnimation() {
        // 定时器，每200毫秒更新一下高度
        this.task = setInterval(() => {
          this.$refs.playingItem.forEach(item => {
            item.style.height = px2rem(this.random()) + 'rem'
          })
        }, 200)
      },
      // 停止动画 停止task任务
      stopAnimation() {
        if (this.task) {
          clearInterval(this.task)
        }
      },

      // 竖线|随机长度 0-10  ceil向上取整
      random() {
        return Math.ceil(Math.random() * 10)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .playing-item-wrapper {
    @include center;
    .playing-item {
      flex: 0 0 px2rem(2);
      width: px2rem(2);
      height: px2rem(1);
      background: $color-blue;
      margin-left: px2rem(2);
      transition: all .2s ease-in-out;
      &:first-child {
        margin: 0;
      }
    }
  }
</style>
```

## 听书播放器源码分析

### 警告

不赞成在主线程上使用同步XMLHttpRequest，因为它会对最终用户的体验产生不利影响。

![警告](D:\百度云（Plus）\Vue项目\Vue2.5 实战微信读书\报错\警告.jpg)

为了兼容audio，提高audio的兼容性，没有使用异步或者axios全部都是异步，因为audio在苹果的手机或者浏览器必须采用同步的方式调用才能工作

```js
// bookSpeaking.vue 
// 传入文字合成语音 VUE_APP_VOICE_URL生成科大讯飞语音合成api
      createVoice(text) {
        // http请求
        const xmlhttp = new XMLHttpRequest()
        // open方法 GET形式url 传入text文本 lang语种语言，false表示同步，主线程堵塞排调用队
        xmlhttp.open('GET', `${process.env.VUE_APP_VOICE_URL}/voice?text=${text}&lang=${this.lang.toLowerCase()}`, false)
        // 发送请求
        xmlhttp.send()
        // 返回responseText，获取响应请求
        const xmlDoc = xmlhttp.responseText
        // 如果xmlDoc存在，把xmlDoc当做json解析
        if (xmlDoc) {
          const json = JSON.parse(xmlDoc)
          // json数据path是mp3下载地址
          console.log(json)
          // 服务端会把mp3语音文件保存下来  path是mp3下载地址
          if (json.path) {
            this.$refs.audio.src = json.path
            this.continuePlay()
          } else {
            this.showToast('播放失败，未生成链接')
          }
        } else {
          this.showToast('播放失败')
        }
```

```js
// views->store->bookSpeaking.vue
      <!-- 播放器  引入播放器但没有在界面显示-->
      <!-- audio的工作过程，audio在bottom点击播放时开始初始化 -->
      <audio @canplay="onCanPlay"
             @timeupdate="onTimeUpdate"
             @ended="onAudioEnded"
             ref="audio"></audio>
    </scroll>

    <!-- 最下方的底部播放面板 -->
    <!-- chapter章节 -->
    <bottom :chapter="chapter"
            :currentSectionIndex="currentSectionIndex"
            :currentSectionTotal="currentSectionTotal"
            :showPlay="showPlay"
            :isPlaying.sync="isPlaying"
            :playInfo="playInfo"
            @onPlayingCardClick="onPlayingCardClick"></bottom>
    <!-- 加载虚拟电子书，获取电子书某些信息，让电子书挂载到read下面，分析出电子书的相关信息 -->
    <!-- 设置book-wrapper，但在界面上看不到-->
    <div class="book-wrapper">
      <div id="read"></div>
    </div>
...
     // 读方法
      speak(item, index) {
        // resetPlay正在播放时，将整个播放取消掉
        this.resetPlay()
        // 播放目录索引之余index点击的哪一个目录
        this.playingIndex = index
        this.$nextTick(() => {
          // 滚动条
          this.$refs.scroll.refresh()
        })
        // 判断章节是否存在
        if (this.chapter) {
          // 根据chapter.href获取section
          this.section = this.book.spine.get(this.chapter.href)
          // 获取位置信息并且展示出来
          this.rendition.display(this.section.href).then(section => {
            // currentPage位置信息
            const currentPage = this.rendition.currentLocation()
            // 当前要渲染的页面要渲染哪些文本
            const cfibase = section.cfiBase
            const cfistart = currentPage.start.cfi.replace(/.*!/, '').replace(/\)/, '')
            const cfiend = currentPage.end.cfi.replace(/.*!/, '').replace(/\)/, '')
            this.currentSectionIndex = currentPage.start.displayed.page
            this.currentSectionTotal = currentPage.start.displayed.total

            // epubcfi主要目的是获取文本
            const cfi = `epubcfi(${cfibase}!,${cfistart},${cfiend})`
            // console.log(currentPage, cfi, cfibase, cfistart, cfiend)
            // 拿到epubcfi之后通过book.getRange获得对应文本
            this.book.getRange(cfi).then(range => {
              let text = range.toLocaleString()
              // 转义字符替换操作 
              text = text.replace(/\s(2,)/g, '')
              text = text.replace(/\r/g, '')
              text = text.replace(/\n/g, '')
              text = text.replace(/\t/g, '')
              text = text.replace(/\f/g, '')
              // 更新文本
              this.updateText(text)
            })
          })
        }
      },
      showToast(text) {
        this.toastText = text
        this.$refs.toast.show()
      },
      
      // 点击togglePlay切换播放状态
      togglePlay() {
        //如果isPlaying为空 判断是否处于播放状态
        if (!this.isPlaying) {
          // playStatus播放状态码===0
          if (this.playStatus === 0) {
            // 播放
            this.play()
            // playStatus播放状态码===2暂停
          } else if (this.playStatus === 2) {
            // 继续播放
            this.continuePlay()
          }
        } else {// 不为空暂停播放
          this.pausePlay()
        }
      },

      
      // resetPlay正在播放时，将整个播放取消掉
      resetPlay() {
        // 播放播放状态码为1，播放时
        if (this.playStatus === 1) {
          // 暂停播放
          this.pausePlay()
        }
        //播放状态置于未播放
        this.isPlaying = false
        // 播放播放状态码置为0，未播放
        this.playStatus = 0
      },

      // 播放
      play() {

        // 传入paragraph合成语音 ！！！！
        this.createVoice(this.paragraph)
      },

      // 继续播放
      continuePlay() {
        // 调用play()方法
        this.$refs.audio.play().then(() => {
        // 开始正在播放的动画
          this.$refs.speakPlaying[0].startAnimation()
          // 播放状态设置为true
          this.isPlaying = true
        // 播放状态设置为1播放
          this.playStatus = 1
        })
      },
      // 暂停播放
      pausePlay() {
        // pause暂停播放
        this.$refs.audio.pause()
        // 停止正在播放的播放动画
        this.$refs.speakPlayingspeakPlaying[0].stopAnimation()
        // 播放状态设置为false
        this.isPlaying = false
        // 播放状态设置为2暂停
        this.playStatus = 2
      },
      onPlayingCardClick() {
        this.$refs.speakWindow.show()
      },

      // 更新paragraph文字
      updateText(text) {
        this.paragraph = text
      },

      // 传入文字合成语音 VUE_APP_VOICE_URL生成科大讯飞语音合成api
      createVoice(text) {
        // http请求
        const xmlhttp = new XMLHttpRequest()
        // open方法 GET形式url 传入text文本 lang语种语言，false表示同步，主线程堵塞排调用队
        xmlhttp.open('GET', `${process.env.VUE_APP_VOICE_URL}/voice?text=${text}&lang=${this.lang.toLowerCase()}`, false)
        // 发送请求
        xmlhttp.send()
        // 返回responseText，获取响应请求
        const xmlDoc = xmlhttp.responseText
        // 如果xmlDoc存在，把xmlDoc当做json解析
        if (xmlDoc) {
          const json = JSON.parse(xmlDoc)
          // json数据path是mp3下载地址
          console.log(json)
          // 服务端会把mp3语音文件保存下来  path是mp3下载地址
          if (json.path) {
            // 要播放的文件路径 缓冲下载之后然后播放
            this.$refs.audio.src = json.path
            // 继续播放
            this.continuePlay()
          } else {
            this.showToast('播放失败，未生成链接')
          }
        } else {
          this.showToast('播放失败')
        }
```

## 播放器面板源码分析

一大一小两个播放面板源码分析

### 小的最下方的播放面板

```js
  // views->store->bookSpeaking.vue  
  <!-- 播放器  引入播放器但没有在界面显示-->
      <!-- audio的工作过程，audio在bottom点击播放时开始初始化 -->
      <!-- 设置src后就会调用onCanPlay -->
      <!-- onTimeUpdate表示在播放过程中调用的事件 -->
      <audio @canplay="onCanPlay"
             @timeupdate="onTimeUpdate"
             @ended="onAudioEnded"
             ref="audio"></audio>
    </scroll>

    <!-- 最下方的底部播放面板 -->
    <!-- chapter章节 -->
    <!-- playInfo章节信息传入到子组件 -->
    <bottom :chapter="chapter"
            :currentSectionIndex="currentSectionIndex"
            :currentSectionTotal="currentSectionTotal"
            :showPlay="showPlay"
            :isPlaying.sync="isPlaying"
            :playInfo="playInfo"
            @onPlayingCardClick="onPlayingCardClick"></bottom>
...
    computed: {
      //当前要播放的时间（秒）转化为分钟
      currentMinute() {
        // m=秒/60
        const m = Math.floor(this.currentPlayingTime / 60)
        // 小于10前补0
        return m < 10 ? '0' + m : m
      },
      //秒数=当前要播放的时间（秒） - 分钟数
      currentSecond() {
        const s = Math.floor(this.currentPlayingTime - parseInt(this.currentMinute) * 60)
        // 小于10前补0
        return s < 10 ? '0' + s : s
      },
      // 总分钟
      totalMinute() {
        // 总的播放时间/60
        const m = Math.floor(this.totalPlayingTime / 60)
        // 小于10前补0
        return m < 10 ? '0' + m : m
      },
      // 总秒数 = 总播放时长 - 总分钟的秒数
      totalSecond() {
        const s = Math.floor(this.totalPlayingTime - parseInt(this.totalMinute) * 60)
        return s < 10 ? '0' + s : s
      },
      // 剩余分钟 =  总时长-当前播放的时长
      leftMinute() {
        const m = Math.floor((this.totalPlayingTime - this.currentPlayingTime) / 60)
        return m < 10 ? '0' + m : m
      },
      // 剩余秒数 = 总时长-当前播放的时长 - 当前播放的分钟
      leftSecond() {
        const s = Math.floor((this.totalPlayingTime - this.currentPlayingTime) - parseInt(this.leftMinute) * 60)
        return s < 10 ? '0' + s : s
      },

      // 章节信息
      playInfo() {
        // 当audioCanPlay准备好，进入播放状态
        if (this.audioCanPlay) {
          return {
            // 当前播放时间分
            currentMinute: this.currentMinute,
            // 秒
            currentSecond: this.currentSecond,
            // 总时间
            totalMinute: this.totalMinute,
            // 总秒
            totalSecond: this.totalSecond,
            // 剩余分钟
            leftMinute: this.leftMinute,
            // 剩余秒
            leftSecond: this.leftSecond
          }
        } else {
          return null
        }
      },
          ...
      // onTimeUpdate表示在播放过程中浏览器不停地调用 更新播放时间
      onTimeUpdate() {
        // 传入当前播放时间
        this.currentPlayingTime = this.$refs.audio.currentTime
        // 当前播放百分比 = 当前播放时间 / 总时间 * 100
        const percent = Math.floor((this.currentPlayingTime / this.totalPlayingTime) * 100)
        // 大的听书播放面板
        this.$refs.speakWindow.refreshProgress(percent)
      },
```

### 大的播放器面板

```js
//bookSpeaking.vue
// 播放完成后调用 播放结束后自动停下来，并且按钮变成播放状态（重置，更新播放进度条）
      onAudioEnded() {
        // resetPlay正在播放时，将整个播放取消掉
        this.resetPlay()
        // 更新当前播放时间 = 当前时间 （总时间）
        this.currentPlayingTime = this.$refs.audio.currentTime
        // 百分比
        const percent = Math.floor((this.currentPlayingTime / this.totalPlayingTime) * 100)
        // 大的播放器面板刷新进度百分比
        this.$refs.speakWindow.refreshProgress(percent)
      },

      
      // onTimeUpdate表示在播放过程中浏览器不停地调用 更新播放时间
      onTimeUpdate() {
        // 传入当前播放时间
        this.currentPlayingTime = this.$refs.audio.currentTime
        // 当前播放百分比 = 当前播放时间 / 总时间 * 100
        const percent = Math.floor((this.currentPlayingTime / this.totalPlayingTime) * 100)
        // 大的听书播放面板 refreshProgress刷新进度百分比
        this.$refs.speakWindow.refreshProgress(percent)
      },

      // 设置src后就会调用onCanPlay 即使不播放CanPlay也会被设置， 由浏览器进行调用
      onCanPlay() {
        // audioCanPlay = true可以播放
        this.audioCanPlay = true
        // 当前播放到哪里
        this.currentPlayingTime = this.$refs.audio.currentTime
        // 总共要播放的时间
        this.totalPlayingTime = this.$refs.audio.duration
      },
```



```js
// speakMask.vue
<template>
<!-- 大的播放器面板SpeakWindow -->
  <transition name="fade">
    <!-- 隐藏 -->
    <div class="book-speak-mask-wrapper" @click.stop.prevent="hide" v-show="visible">
      <transition name="popup-slide-up">
        <div class="book-speak-mask-card-wrapper" v-show="speakCardVisible" @click.stop.prevent="hide">
          <!-- 下拉隐藏按钮 -->
          <div class="pulldown-icon-wrapper" @click="hide">
            <span class="icon-pull_down"></span>
          </div>
          <div class="card-title-wrapper">
            <div class="icon-speak-wrapper">
              <span class="icon-speak"></span>
            </div>
            <div class="speak-title-wrapper">
            <!-- 语音朗读图标 -->
              <span class="speak-title">{{$t('speak.voice')}}</span>
            </div>
            <div class="read-fulltext-wrapper">
              <span class="read-fulltext">{{$t('speak.read')}}</span>
            </div>
          </div>
          <div class="card-section-title-wrapper">
            <!-- 章节标题 -->
            <div class="card-section-title-text">{{title}}</div>
            <!-- 当前播放时间/剩余时间 -->
            <div class="card-section-sub-title-text" v-if="currentSectionIndex">{{currentSectionIndex}} /
              {{currentSectionTotal}}
            </div>
          </div>
          <div class="setting-progress">
            <!-- 进度条 -->
            <div class="progress-wrapper">
              <!-- 最大100最小0，一步1 -->
              <input class="progress" type="range"
                     max="100"
                     min="0"
                     step="1"
                     @change="onProgressChange($event.target.value)"
                     @input="onProgressInput($event.target.value)"
                     :value="progress"
                     ref="progress">
            </div>
            <div class="progress-text">
              <!-- 左边已播放时间 -->
              <div class="progress-text-current">{{playInfo ? playInfo.currentMinute : '00'}}:{{playInfo ?
                playInfo.currentSecond : '00'}}
              </div>
              <!-- 右边剩余时间 -->
              <div class="progress-text-left">-{{playInfo ? playInfo.leftMinute : '00'}}:{{playInfo ?
                playInfo.leftSecond : '00'}}
              </div>
            </div>
          </div>
          <div class="playing-wrapper">

            <!-- 设置图标 -->
            <!-- <div class="icon-settings-wrapper">
              <span class="icon-settings"></span>
              <div class="settings-text">{{$t('speak.settings')}}</div>
            </div> -->
            <!-- 上一章节按钮 -->
            <span class="icon-play_backward" :class="{'not-use': currentSectionIndex <= 1}" @click.stop.prevent="prev"></span>
            <!-- 切换播放状态 -->
            <div class="icon-play-wrapper" @click.stop.prevent="togglePlay">
              <!-- 继续 -->
              <span class="icon-play_go" v-if="!isPlaying"></span>
              <!-- 暂停 -->
              <span class="icon-play_pause" v-else></span>
            </div>
            <!-- 下一章节 -->
            <span class="icon-play_forward" :class="{'not-use': currentSectionIndex >= currentSectionTotal}"
                  @click.stop.prevent="next"></span>

                  <!-- 定时 -->
            <!-- <div class="icon-clock-wrapper">
              <span class="icon-clock"></span>
              <div class="clock-text">{{$t('speak.timing')}}</div>
            </div> -->
          </div>
          <!-- 语音api提供者 -->
          <div class="read-apply-wrapper">
            {{$t('speak.apply')}}
          </div>
          
          <!-- 电子书内容阅览 -->
          <div class="read-title-wrapper">
            <span class="line"></span>
            <!-- 标题 -->
            <div class="read-title-text">{{$t('speak.current')}}</div>
            <span class="line"></span>
          </div>
          <div class="book-wrapper" ref="bookWrapper">
            <div id="book-read"></div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import { realPx } from '@/utils/utils'

  export default {
    props: {
      title: String,
      book: Object,
      section: Object,
      currentSectionIndex: Number,//当前章节
      currentSectionTotal: Number,//中1章节
      isPlaying: Boolean,//是否播放的状态
      playInfo: Object//播放信息从父组件传入
    },
    data() {
      return {
        visible: false,
        speakCardVisible: false,
        progress: 0,
        readHeight: 0
      }
    },
    methods: {
      // 刷新进度百分比
      refreshProgress(p) {
        // 进度
        this.progress = p
        // 设置背景
        this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
      },

      // 更新文字
      updateText(promise) {
        promise.then(() => {
          const currentPage = this.rendition.currentLocation()
          const cfibase = this.section.cfiBase
          const cfistart = currentPage.start.cfi.replace(/.*!/, '').replace(/\)/, '')
          const cfiend = currentPage.end.cfi.replace(/.*!/, '').replace(/\)/, '')
          this.book.getRange(`epubcfi(${cfibase}!,${cfistart},${cfiend})`).then(range => {
            let text = range.toString()
            text = text.replace(/\s(2,)/g, '')
            text = text.replace(/\r/g, '')
            text = text.replace(/\n/g, '')
            text = text.replace(/\t/g, '')
            text = text.replace(/\f/g, '')
            this.$emit('updateText', text)
          })
        })
      },
      // 切换播放状态
      togglePlay() {
        this.$parent.togglePlay()
      },
      // 上一章节
      prev() {
        if (this.currentSectionIndex > 1) {
          this.updateText(this.rendition.prev())
          this.$emit('update:currentSectionIndex', this.currentSectionIndex - 1)
          this.$parent.resetPlay()
          setTimeout(() => {
            this.$parent.togglePlay()
          }, 500)
        }
      },
      // 下一章节
      next() {
        if (this.currentSectionIndex < this.currentSectionTotal) {
          this.updateText(this.rendition.next())
          this.$emit('update:currentSectionIndex', this.currentSectionIndex + 1)
          this.$parent.resetPlay()
          setTimeout(() => {
            this.$parent.togglePlay()
          }, 500)
        }
      },
      // 展示
      display() {
        if (!this.rendition) {
          this.rendition = this.book.renderTo('book-read', {
            width: window.innerWidth > 640 ? 640 : window.innerWidth,
            height: this.readHeight,
            method: 'default'
          })
          this.displayed = this.rendition.display(this.section.href)
        } else {
          this.displayed = this.rendition.display(this.section.href)
        }
      },
      // 当进度条改变的时候
      onProgressChange(progress) {
      },
      // 当进度条移动的时候
      onProgressInput(progress) {
        // 设置进度
        this.progress = progress
        // 调整进度条左边的背景颜色
        this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
      },
      // 隐藏
      hide() {
        // 听书播放器设置为不显示
        this.speakCardVisible = false
        this.visible = false
      },
      // 显示
      show() {
        this.visible = true
        this.speakCardVisible = true
        this.refresh()
        this.$nextTick(() => {
          this.display()
        })
      },
      refresh() {
        this.readHeight = window.innerHeight * 0.9 - realPx(40) - realPx(54) - realPx(46) - realPx(48) - realPx(60) - realPx(44)
        // console.log(this.readHeight)
        this.$refs.bookWrapper.style.height = this.readHeight + 'px'
      }
    }
  }
</script>
```

# 第10章 项目发布

利用Node.js开发简单的api，并通过阿里云的ESC进行项目发布，在CentOS操作系统上搭建Nginx服务，将代码上传至Git，通过编写自动化更新脚本实现代码的自动更新与发布。

##  Vue项目构建

.env.development在开发过程中使用

.env.production在上线的时候使用

npm run build项目构建，构建完生成dist目录 压缩文件 打包

构建报错：asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets:
  js/chunk-3220a273.a91abfc7.js (309 KiB)

warning:entrypoint size limit:有一些文件超出240kb

error no-console 不允许有console

## 功能优化+构建问题处理

### 加入书架

```js
//views/store/bookDetail.vue
    <div class="bottom-wrapper">
      <!-- 加入书架？ -->
      <div class="bottom-btn" @click.stop.prevent="readBook()">{{$t('detail.read')}}</div>
      <div class="bottom-btn" @click.stop.prevent="trialListening()">{{$t('detail.listen')}}</div>
      <div class="bottom-btn" @click.stop.prevent="addOrRemoveShelf()">
        <span class="icon-check" v-if="inBookShelf"></span>
        {{inBookShelf ? $t('detail.isAddedToShelf') : $t('detail.addOrRemoveShelf')}}
      </div>
    </div>
...
// 当前是否处于书架
      inBookShelf() {
        // bookShelf书架列表是否为空以及图书id  判断图书是否存在
        if (this.bookItem && this.bookShelf) {
          // 把bookShelf拍平 数组拍平也称数组扁平化，就是将数组里面的数组打开，最后合并为一个数组。.扩展运算符一层一层展开
          const flatShelf = (function flatten(arr) {
            return [].concat(...arr.map(v => v.itemList ? [v, ...flatten(v.itemList)] : v))
          })(this.bookShelf).filter(item => item.type === 1)
          const book = flatShelf.filter(item => item.fileName === this.bookItem.fileName)
          return book && book.length > 0
        } else {//不存在返回false
          return false
        }
...
 methods: {
      // 添加到书架
      addOrRemoveShelf() {
        // 判断这本书当前是否在书架当中
        if (this.inBookShelf) {
          // 如果在删除这本书
          removeFromBookShelf(this.bookItem)
        } else {//否则添加
          addToShelf(this.bookItem)
        }
         
        this.bookShelf = getLocalStorage('bookShelf')
      },
```

点击加入书架，再次点击从书架删除

```js
// utils/book.js
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
```

## 数据库环境准备 

数据真实的从数据库中获取，并且向前台返回数据

数据库环境准备
1.建立一个数据库，数据库名book,字符集utf8 排序规则utf8_general_ci
2.导入book.sql数据表
3.还有cover和img主要存储了图书的封面数据，把它拷贝到resoures下载文件夹中。
4.把epub和epub2（是电子书解压以后的路径）也拷贝到resoures
创建Nodejs+express编写api
1.在页面创建一个名为node-imooc-ebook的空项目；
2.创建app.js，然后初始化项目，npm init
3.安装express框架：cnpm i express -S
4.在Node中不能使用e6导入文件，所以导入express
解析：原理express源码中是一个暴露了一个function，返回了一个app，还是一个方法。app里有很多方法get

```js
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send(new Date().toDateString())
})

//项目启动接口，用app.listen
const server = app.listen(3000, () => {
//通过回调函数获取返回值，host 是获取当前的ip地址
  const host = server.address().address
  //监听的端口号
  const port = server.address().port
	//启动成功输出的内容
  console.log('server is listening at http://%s:%s', host, port)
})
```

epub2电子书解压后的路径

fonts：web字体

theme主题css

cover封面路径

title电子书title

author

rootfile：电子书资源文件路径

## Node.js+express编写API

1.在页面创建一个名为node-imooc-ebook的空项目；
2.创建app.js，然后初始化项目，npm init
3.安装express框架：cnpm i express -S
4.在Node中不能使用e6导入文件，所以导入express
解析：原理express源码中是一个暴露了一个function，返回了一个app，还是一个方法。app里有很多方法get

```js
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send(new Date().toDateString())
})

//项目启动接口，用app.listen
const server = app.listen(3000, () => {
//通过回调函数获取返回值，host 是获取当前的ip地址
  const host = server.address().address
  //监听的端口号
  const port = server.address().port
	//启动成功输出的内容
  console.log('server is listening at http://%s:%s', host, port)
})
```

5.启动方法：1.node app.js
2.使用左上add Configuration，点+号，点击Node.js. Name写app,node parameters写app.js
调试直接就可以点击上方的甲虫
6.安装cnpm i mysql -S 然后导入mysql数据库。配置数据库

http://172.20.10.2:3000/book/list

```js
const mysql = require('mysql')

//连接数据库的方法
function connect() {
    return mysql.createConnection({
      // 本地localhost
        // host: constant.dbHost,
        host: 'localhost',
        // root
        // user: constant.dbUser,
        user: 'root',
        // 123456
        // password: '123456',
        database: 'book'
    })
}

//再写一个接口
app.get('/book/list', (req, res) => {
  const conn = connect() //链接
  //调用conn.query返回的对象，调用查询语句
  conn.query('select * from book where cover!=\'\'',
  //err是否错误
    (err, results) => {
      if (err) { //有错误
      	//向前台返回一个json对象
        res.json({
          error_code: 1,
          msg: '获取失败'
        })
      } else { //成功
      
        results.map(item => handleData(item))
        const data = {}
        constant.category.forEach(categoryText => {
          data[categoryText] = results.filter(item => item.categoryText === categoryText)
        })
        //成功了就返回提示
        res.json({
          error_code: 0,
          msg: '获取成功',
          data: data,
          total: results.length
        })
      }
      //一定要把数据库链接关闭
      conn.end()
    })
})
```

### 首页接口

```js
app.get('/book/home', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover != \'\'',
    (err, results) => {
     //获取长度
      const length = results.length
      //返回的类表
      const guessYouLike = []
      //首页封面图片
      const banner = constant.resUrl + '/home_banner2.jpg'
      const recommend = [] //推荐图书
      const featured = []  //精选
      const random = []  //随机图书
      const categoryList = createCategoryData(results) 
      const categories = [ //分类的数据
        {
          category: 1,
          num: 56,
          img1: constant.resUrl + '/cover/cs/A978-3-319-62533-1_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/cs/A978-3-319-89366-2_CoverFigure.jpg'
        },
        {
          category: 2,
          num: 51,
          img1: constant.resUrl + '/cover/ss/A978-3-319-61291-1_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/ss/A978-3-319-69299-9_CoverFigure.jpg'
        },
        {
          category: 3,
          num: 32,
          img1: constant.resUrl + '/cover/eco/A978-3-319-69772-7_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/eco/A978-3-319-76222-7_CoverFigure.jpg'
        },
        {
          category: 4,
          num: 60,
          img1: constant.resUrl + '/cover/edu/A978-981-13-0194-0_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/edu/978-3-319-72170-5_CoverFigure.jpg'
        },
        {
          category: 5,
          num: 23,
          img1: constant.resUrl + '/cover/eng/A978-3-319-39889-1_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/eng/A978-3-319-00026-8_CoverFigure.jpg'
        },
        {
          category: 6,
          num: 42,
          img1: constant.resUrl + '/cover/env/A978-3-319-12039-3_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/env/A978-4-431-54340-4_CoverFigure.jpg'
        },
        {
          category: 7,
          num: 7,
          img1: constant.resUrl + '/cover/geo/A978-3-319-56091-5_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/geo/978-3-319-75593-9_CoverFigure.jpg'
        },
        {
          category: 8,
          num: 18,
          img1: constant.resUrl + '/cover/his/978-3-319-65244-3_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/his/978-3-319-92964-4_CoverFigure.jpg'
        },
        {
          category: 9,
          num: 13,
          img1: constant.resUrl + '/cover/law/2015_Book_ProtectingTheRightsOfPeopleWit.jpeg',
          img2: constant.resUrl + '/cover/law/2016_Book_ReconsideringConstitutionalFor.jpeg'
        },
        {
          category: 10,
          num: 24,
          img1: constant.resUrl + '/cover/ls/A978-3-319-27288-7_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/ls/A978-1-4939-3743-1_CoverFigure.jpg'
        },
        {
          category: 11,
          num: 6,
          img1: constant.resUrl + '/cover/lit/2015_humanities.jpg',
          img2: constant.resUrl + '/cover/lit/A978-3-319-44388-1_CoverFigure_HTML.jpg'
        },
        {
          category: 12,
          num: 14,
          img1: constant.resUrl + '/cover/bio/2016_Book_ATimeForMetabolismAndHormones.jpeg',
          img2: constant.resUrl + '/cover/bio/2017_Book_SnowSportsTraumaAndSafety.jpeg'
        },
        {
          category: 13,
          num: 16,
          img1: constant.resUrl + '/cover/bm/2017_Book_FashionFigures.jpeg',
          img2: constant.resUrl + '/cover/bm/2018_Book_HeterogeneityHighPerformanceCo.jpeg'
        },
        {
          category: 14,
          num: 16,
          img1: constant.resUrl + '/cover/es/2017_Book_AdvancingCultureOfLivingWithLa.jpeg',
          img2: constant.resUrl + '/cover/es/2017_Book_ChinaSGasDevelopmentStrategies.jpeg'
        },
        {
          category: 15,
          num: 2,
          img1: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg',
          img2: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg'
        },
        {
          category: 16,
          num: 9,
          img1: constant.resUrl + '/cover/mat/2016_Book_AdvancesInDiscreteDifferential.jpeg',
          img2: constant.resUrl + '/cover/mat/2016_Book_ComputingCharacterizationsOfDr.jpeg'
        },
        {
          category: 17,
          num: 20,
          img1: constant.resUrl + '/cover/map/2013_Book_TheSouthTexasHealthStatusRevie.jpeg',
          img2: constant.resUrl + '/cover/map/2016_Book_SecondaryAnalysisOfElectronicH.jpeg'
        },
        {
          category: 18,
          num: 16,
          img1: constant.resUrl + '/cover/phi/2015_Book_TheOnlifeManifesto.jpeg',
          img2: constant.resUrl + '/cover/phi/2017_Book_Anti-VivisectionAndTheProfessi.jpeg'
        },
        {
          category: 19,
          num: 10,
          img1: constant.resUrl + '/cover/phy/2016_Book_OpticsInOurTime.jpeg',
          img2: constant.resUrl + '/cover/phy/2017_Book_InterferometryAndSynthesisInRa.jpeg'
        },
        {
          category: 20,
          num: 26,
          img1: constant.resUrl + '/cover/psa/2016_Book_EnvironmentalGovernanceInLatin.jpeg',
          img2: constant.resUrl + '/cover/psa/2017_Book_RisingPowersAndPeacebuilding.jpeg'
        },
        {
          category: 21,
          num: 3,
          img1: constant.resUrl + '/cover/psy/2015_Book_PromotingSocialDialogueInEurop.jpeg',
          img2: constant.resUrl + '/cover/psy/2015_Book_RethinkingInterdisciplinarityA.jpeg'
        },
        {
          category: 22,
          num: 1,
          img1: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg',
          img2: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg'
        }
      ]
      //随机获取9本不同的书，
      randomArray(9, length).forEach(key => { //这个数组通过for来获取全部数组
      //通过createGuessYouLike加工后，把数据再加入到guessYouLike中
        guessYouLike.push(createGuessYouLike(createData(results, key)))
      })
      //推荐图书，拿到三本图书
      randomArray(3, length).forEach(key => {
        recommend.push(createRecommendData(createData(results, key)))
      })
      //获取6本精选图书
      randomArray(6, length).forEach(key => {
      	//书普通图书，直接获取就好了
        featured.push(createData(results, key))
      })
      //随机图书,
      randomArray(1, length).forEach(key => {
      	//随机获取一本就好了
        random.push(createData(results, key))
      })
      //把上面所定义的数据，都返回
      res.json({
        guessYouLike,  
        banner,
        recommend,
        featured,
        categoryList,
        categories,
        random
      })
      //断开链接
      conn.end()
    })
})
```

2.首页api中需要实现随机数，添加一个方法.
测试时localhost:3000/book/home

```js
//n是要几本书，l是一共有几本书
function randomArray(n, l) {
	//保存到rnd的变量中
  let rnd = []
  for (let i = 0; i < n; i++) {
  	//向下取整，获取0到1之间的随机时，再*l,这样最大的数都不会大于l
    rnd.push(Math.floor(Math.random() * l))
  }
  //返回
  return rnd
}
```

3.创建createData

```js
//根据results和key找到对应的书
function createData(results, key) {
  return handleData(results[key])
}
//封装的
function handleData(data) {
	//对封面进行加工，不是http://开头的
  if (!data.cover.startsWith('http://')) {
  	//resUrl地址，
    data['cover'] = `${constant.resUrl}/img${data.cover}`
  }
  //其他的属性
  data['selected'] = false
  data['private'] = false
  data['cache'] = false //是否缓存
  data['haveRead'] = 0  //是否阅读
  //返回
  return data
}

//再创建本地地址resUrl
```

4.创建const.js模块来储存公用数据,然后再到app.js中把const模块引入

```js
 const  resUrl = 'http://192.168.31.243:8081'
 
 module.exports = {
  resUrl,
}

//引入模块
const constant = require('./const')
```

6.创建createGuessYouLike方法给获取到的数据再次加工一下

```js
function createGuessYouLike(data) {
	//随机生成，1-3的数字
  const n = parseInt(randomArray(1, 3)) + 1
  data['type'] = n
  switch (n) {
    case 1:
    	//根据id是否为偶数，显示另外一种形式.简单算法
      data['result'] = data.id % 2 === 0 ? '《Executing Magic》' : '《Elements Of Robotics》'
      break
    case 2:
      data['result'] = data.id % 2 === 0 ? '《Improving Psychiatric Care》' : '《Programming Languages》'
      break
    case 3:
      data['result'] = '《Living with Disfigurement》'
      data['percent'] = data.id % 2 === 0 ? '92%' : '97%'
      break
  }
  //返回数据
  return data
}
```

7.推荐图书加工

```js
function createRecommendData(data) {
	//随机生成
  data['readers'] = Math.floor(data.id / 2 * randomArray(1, 100))
  return data
}
```

8.添加通用数据const.jscategory

```js
const category = [
  'Biomedicine',
  'BusinessandManagement',
  'ComputerScience',
  'EarthSciences',
  'Economics',
  'Engineering',
  'Education',
  'Environment',
  'Geography',
  'History',
  'Laws',
  'LifeSciences',
  'Literature',
  'SocialSciences',
  'MaterialsScience',
  'Mathematics',
  'MedicineAndPublicHealth',
  'Philosophy',
  'Physics',
  'PoliticalScienceAndInternationalRelations',
  'Psychology',
  'Statistics'
]

module.exports = {
  resUrl,
  category,
}

```

9.修改handleData

```js
function handleData(data) {
  if (!data.cover.startsWith('http://')) {
    data['cover'] = `${constant.resUrl}/img${data.cover}`
  }
  data['selected'] = false
  data['private'] = false
  data['cache'] = false
  data['haveRead'] = 0
  return data
}
```

### 到项目中调用首页api

1.把vue.config.js中的devServer都注释掉，和mock函数，和引入 的 4个组件，再去修改.env.development中的api，把BASE 修改成本地接口

```js
VUE_APP_RES_URL=http://192.168.0.174:9000
VUE_APP_EPUB_URL=http://192.168.0.174:9000/epub
VUE_APP_BASE_URL=http://192.168.0.174:3000
VUE_APP_BOOK_URL=http://192.168.0.174:3000
VUE_APP_EPUB_OPF_URL=http://192.168.0.174:9000/epub2
VUE_APP_VOICE_URL=http://192.168.0.174:3000
```

2.报错,到node.js接口中解决跨域问题，引入库cnpm i -S cors
在app.js中引入

```js
const cors = require('cors')
app.use(cors())
```

3.首页bulnn图（轮播图）没有加入进来，到app.js中把图加入

```javascript
const banner = constant.resUrl + '/home_banner2.jpg'
```

4.修改图书少出的问题

```js
function createCategoryData(data) {
  const categoryIds = createCategoryIds(6)
  const result = []
  categoryIds.forEach(categoryId => {
    const subList = data.filter(item => item.category === categoryId).slice(0, 4)
    subList.map(item => {
      return handleData(item)
    })
    result.push({
      category: categoryId,
      list: subList
    })
  })
  //返回时过滤，如果itme.list小于4就不要了
  return result.filter(item => item.list.length === 4)

```

### 电子书详情页api开发

1.添加app.get方法
如果获取失败，第一步就查看查询语句是否有误，输出查看

```js
app.get('/book/detail', (req, res) => {
  const conn = connect() //链接数据库
  //获取图书参数
  const fileName = req.query.fileName
  //查询，把获取到的图书参数传入查询
  const sql = `select * from book where fileName='${fileName}'`
  //通过conn.query，来查询这个语言，然把结果放到results中
  conn.query(sql, (err, results) => {
    if (err) { //失败
      res.json({ //返回
        error_code: 1,
        msg: '电子书详情获取失败'
      })
    } else {
      if (results && results.length === 0) { //还是获取失败
        res.json({
          error_code: 1,
          msg: '电子书详情获取失败'
        })
      } else {//成功
      //获取第一本书，进行封装，加工
        const book = handleData(results[0])
        res.json({ //返回成功
          error_code: 0,
          msg: '获取成功',
          data: book
        })
      }
    }
    //关闭数据库
    conn.end()
  })
})
```

### 电子书列表api

1.主要是用在分类里面的电子书，里面主要是包含了树状结构

```js
app.get('/book/list', (req, res) => {
  const conn = connect()
  //查找封面不为空的电子书
  conn.query('select * from book where cover!=\'\'',
    (err, results) => {
      if (err) {//请求失败
        res.json({
          error_code: 1,
          msg: '获取失败'
        })
      } else {//成功
      //获取到结果，进行遍历
        results.map(item => handleData(item))
        //对象
        const data = {}
        //对分类进行遍历，categoryText文本
        constant.category.forEach(categoryText => {
        //categoryText作为kye，用filter赛选分类名称相同的电子书找出来
          data[categoryText] = results.filter(item => item.categoryText === categoryText)
        })
        res.json({ //成功
          error_code: 0,
          msg: '获取成功',
          data: data,
          total: results.length //把筛选的内容返回
        })
      }
      conn.end()
    })
})
```

### 2.普通结构的list
```js
app.get('/book/flat-list', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover!=\'\'',
    (err, results) => {
      if (err) {
        res.json({
          error_code: 1,
          msg: '获取失败'
        })
      } else {
        results.map(item => handleData(item))
        res.json({
          error_code: 0,
          msg: '获取成功',
          data: results,  //不同的返回results
          total: results.length
        })
      }
      conn.end()
    })
})
```
### 图书在线缓存接口

1.比较简单，直接返回一个数组就行，
因为没有数据，+号（添加书籍）按钮没有出现，所以我们要用json返回一个空的数组

```js
app.get('/book/shelf', (req, res) => {
  res.json({
    bookList: []
  })
})
```

### 科大讯飞在线语音合成API对接

1.到科大讯飞官方注册账号，点击控制台，然后点击右上角的创建新应用。2.需要添加服务，添加在线语音合成
3.ip白名单，在线系统就需要把在线系统的ip输入进去，本地要拿到外网ip,这样才能调用。不然不能调用。
4.可以点击开发文档实现语音对接，语音合成
5.需要授权认证，
6.到node.js中创建voice模块，用来合成语音api。然后给app.js引入voice模块，创建一个api

```js
const voice = require('./voice')
//这个方法很简单，只要把结果和传入，就能在模块中拿到
app.get('/voice', (req, res) => {
  voice(req, res)
})
```

7.到voice创建接口
8.授权认证，x-Appid在我们注册时的id
最会一个需要apikey也在注册中

需要安装cnpm i -S js-base64库
cnpm i -S js-md5加密库
cnpm i -S qs 对字符串进行处理，让post请求称为，键值对形式
以上都是给xParam使用
cnpm i -S http 库给herad请求
```js
const Base64 = require('js-base64').Base64
const md5 = require('js-md5')
const qs = require('qs')
const http = require('http')
const mp3FilePath = require('./const').mp3FilePath
const resUrl = require('./const').resUrl
const fs = require('fs')
```


```js
//接收app传来的请求
function createVoice(req, res) {
 //需要传入两个参数，文本和语音
  const text = req.query.text
  const lang = req.query.lang
  // const text = '测试科大讯飞在线语音合成api的功能，比如说，我们输入一段话，科大讯飞api会在线实时生成语音返回给客户端'
  // const lang = 'cn'  cn代表中文
  //中文
  let engineType = 'intp65'
  //如果传入的是英文
  if (lang.toLowerCase() === 'en') {
  	//就修改引擎为英文
    engineType = 'intp65_en'
  }
  //朗读的速度
  const speed = '30'
  //
  const voiceParam = {
    auf: 'audio/L16;rate=16000', //返回的是语音格式
    aue: 'lame', //音频才采样率
    voice_name: 'xiaoyan', //人语音
    speed,  //速度
    volume: '50', //音量
    pitch: '50', //音高
    engine_type: engineType, //引擎类型
    text_type: 'text' //文本类型
  }

 //认证部分
 //先获取时间utc的时间,/1000就可以了                    
  const currentTime = Math.floor(new Date().getTime() / 1000)
  //获取注册处的appId 
  const appId = '5c04d087'
  //apiKey祖册中有
  const apiKey = 'd42c864c47d91f468a70079aab059be5'
  //调用Base64.encode进行加密，再用stringify把上面的参数传入
  const xParam = Base64.encode(JSON.stringify(voiceParam))
  //封装三个参数进行加密
  const checkSum = md5(apiKey + currentTime + xParam)
  //定义变量
  const headers = {}
  //封装把参数传入变量
  headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'
  headers['X-Param'] = xParam
  headers['X-Appid'] = appId
  headers['X-CurTime'] = currentTime
  headers['X-CheckSum'] = checkSum
  headers['X-Real-Ip'] = '127.0.0.1'
  //定义把文本传入，生成请求参数
  const data = qs.stringify({
    text: text
  })
  //请求参数
  const options = {
    host: 'api.xfyun.cn',
    path: '/v1/service/v1/tts', //科大讯飞地址，到接口地址查看
    method: 'POST',
    headers
  }
  //调用http库请求
  const request = http.request(options, response => { //到这可以测试
  //创建mp3文件
    let mp3 = ''
    //对结果进行处理
    const contentLength = response.headers['content-length']
    //将编码格式为二进制文件
    response.setEncoding('binary')
    //通过response.on回调方法回调结果data
    response.on('data', data => {
    //拿到data是语音播放的文件，把data传换成mp3文件
      mp3 += data
      //进度百分显示，用当前接收到长度/总长度
      const process = data.length / contentLength * 100
      //转化成保留两位小数
      const percent = parseInt(process.toFixed(2))
      // console.log(percent)
    })
    //end的时候所有信息以及获取好了
    response.on('end', () => {
      // console.log(response.headers)
      // console.log(mp3)
      //通过这判断类型
      const contentType = response.headers['content-type']
      //如果不是mp3就失败
      if (contentType === 'text/html') {
        res.send(mp3) //直接显示报错
      } else if (contentType === 'text/plain') { //报错，把结果返回前端
        res.send(mp3)
      } else {
      	//将文件保存，名字用当前时间作为名字
        const fileName = new Date().getTime()
        //创建文件路径，到resource中穿件mp3文件夹,输出路径
        const filePath = `${mp3FilePath}/${fileName}.mp3`
        //实际下载的路径
        const downloadUrl = `${resUrl}/mp3/${fileName}.mp3`
        // console.log(filePath, downloadUrl)
        //通过fs写入，filePath路径，数据，文件类型
        fs.writeFile(filePath, mp3, 'binary', err => { //返回
          if (err) { 
            res.json({
              error: 1,
              msg: '下载失败'
            })
          } else {
            res.json({//返回下载成功
              error: 0,
              msg: '下载成功',
              path: downloadUrl
            })
          }
        })
      }
    })
  })
  //传入data
  request.write(data)
  //断开
  request.end()
}
//返回请求内容
module.exports = createVoice

在const.js中加入mp3文件路径地址

 mp3FilePath = '/root/nginx/upload/mp3'
```
## 搭建服务器

安装node环境

安装cnpm淘宝

### 安装nginx依赖

yum - y inatall  pcre*

 yum -y install openssl*

 wget http://nginx.org/download/nginx-1.18.0.tar.gz

make gcc

打包解压nginx

解压缩
tar -zxvf ./文件名 

进入nginx-1.18执行configure

configuration summary

make -j4对源码进行编译

make install安装

nginx -t能否找到nginx

/usr/local/nginx/sbin/nginx -t

cd  /usr/bin/进入bin

## 配置nginx启动目录和日志目录的软连接

/usr/local/nginx/sbin/nginx

对源文件创建软链接，沿链接方向访问实际路径下文件

前面是实际路径 后面是连接名

ln -s  /usr/local/nginx/sbin/nginx nginx 

删除软连接的方法 rm nginx

bin目录下创建了nginx

nginx启动

nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)问题的解决
当出现这个错误时，意味着80端口被占用。

方法一、使用：

fuser -k 80/tcp

将进程杀死后，启动nginx。

ps命令有一些参数：
-e : 显示所有进程
-f : 全格式
-h : 不显示标题
-l : 长格式
-w : 宽输出
a ：显示终端上的所有进程，包括其他用户的进程。
r ：只显示正在运行的进程。
u ：以用户为主的格式来显示程序状况。
x ：显示所有程序，不以终端机来区分。

查看启动端口

ps 命令的作用是显示进程信息

### ps -ef|grep nginx

停止stop

nginx -s stop

### nginx目录为/usr/local/nginx

server {
        listen 80;
        sdd_header Cache-Control "no-cache, must-revalidate";
        autoindex on;
add_header Cache-Control "no-cache, must-revalidate";
        autoindex on;
erver_name localhost;
        root /root/nginx/upload;
        location / {
                add_header Access-Control-Allow-Origin *;
                index index.html;
        }
}

修改主配置文件

vim /usr/local/nginx/conf/nginx.conf

user指定为root

添加 

include /root/nginx/*.conf会将路径下所有的conf融合在一起到/usr/local/nginx/conf/nginx.conf

vim nginx.conf
[root@iZ0b1agd1szmlcZ nginx]# vim /usr/local/nginx/conf/nginx.conf
[root@iZ0b1agd1szmlcZ nginx]# ll
total 1028

drwxr-xr-x 9 1001 1001    4096 Apr 12 12:05 nginx-1.18.0
-rw-r--r-- 1 root root 1039530 Apr 21  2020 nginx-1.18.0.tar.gz
-rw-r--r-- 1 root root      73 Apr 12 12:07 nginx.conf
drwxr-xr-x 2 root root    4096 Apr 12 12:05 upload

打开http://39.101.210.108/查看nginx是否打开成功

server {
		#自定义nginx访问的资源
		listen 8081;
		server_name resource;
		root   C:/Users/DELL/Desktop/resource/upload;
		location / {
			#支持跨域
			add_header  Access-Control-Allow-Origin *;
			index  index.html index.htm;
        }
		#每次访问都不做缓存 每一次都需要重新验证 （经常变动的时候注释掉，根据业务场景使用）
		add_header Cache-Control "no-cache, must-revalidate";
		#开启浏览resource下面的文件列表
		autoindex on;
	}

检查配置文件 nginx -t

重启nginx -s reload

:set nu显示行号

### nginx重启

更改nginx配置文件后进行语法检测

```undefined
sudo nginx -t
```

结果正确， 进行nginx重启

```undefined
sudo nginx -s reload
```

没有报错，但发现重启后新的配置没有生效

nginx依然指向旧的路径

查看nginx服务状态



```undefined
sudo service nginx status
或
sudo systemctl status nginx
```

查看端口号

### netstat -nlpt

**配置Nginx开机启动**

```shell
systemctl enable nginx
```

杀死nginx进程

### killall -s QUIT nginx

nginx -s reload

### nginx: [error] invalid PID number "" in "/var/run/nginx.pid"

nginx: [error] invalid PID number “” in “/var/run/nginx/nginx.pid”
[root@el6_51 sbin]# ./nginx -s reload
nginx: [error] invalid PID number "" in "/var/run/nginx/nginx.pid"

重新指向配置文件即可

[root@el6_51 sbin]# nginx -c /etc/nginx/nginx.conf
[root@el6_51 sbin]# nginx -s reload

启动nginx 遇上

### Job for nginx.service failed because the control process exited with

error code. See “systemctl status nginx.service” and “journalctl -xe”
for details

说明nginx的80端口被占用
查看指定端口

netstat -ntulp |grep 80
1
直接kill他，在启动就可以了

systemctl start nginx

### 通过find来搜索

如
find / -name nginx.conf

### 检查是否已经安装有nginx及对应目录：

[[email protected] ~]# find /|grep nginx.conf

/etc/nginx/conf.d

/etc/nginx/conf.d/example_ssl.conf

### 第一步：输入以下指令全局查找nginx相关的文件

```
sudo find / -name nginx*
```

![img](https://img-blog.csdnimg.cn/20190924093532544.png)

###  第二步：删除查找出来的所有nginx相关文件

```
sudo rm -rf file 此处跟查找出来的nginx文件
```

### 5.MySQL使用方式

MySQL数据库默认的管理用户名：root，

默认密码：ProphetClouds.com2017，默认端口3306.

MySQL5.7版本以后,默认安装了密码安全检查插件(validate_password),

默认密码策略要求密码必须包含：大小写字母、数字和特殊符号，

并且长度不能少于8位,并且不再有password字段,修改为authentication_string,

Systemctl start mysqld 开启 MySQL

Systemctl stop mysqld 关闭 MySQL

Systemctl  restart mysqld 重启 MySQL

systemctl enable mysqld  设置MySQL开机启动

#### centos中Mysql数据库导入sql文件等基本操作

1、用rz工具将sql文件上传至服务器，在这个目录下登录mysql，创建相应名称的数据库。
以root身份登录mysql

mysql -u root -p

在MySQL命令行中，输入命令

CREATE DATABASE abcd;

将sql文件导入数据库

mysql -u 用户名 -p  数据库名 < 数据库名.sql
mysql -u abc -p abc < abc.sql

使用root用户登陆

mysql -u 用户名 -p

查看当前含有哪些数据库

mysql> SHOW DATABASES;

连接数据库

mysql> USE 数据库名

查看当前数据库中含有哪些表

mysql> SHOW TABLES;
或者
mysql> DESCRIBE 表名;

显示表属性

mysql> SHOW COLUMNS FROM 表名;

退出数据库

mysql> EXIT/QUIT;

新建数据库

mysql> CREATE DATABASE 数据库名;

新建数据表

mysql> CREATE TABLE 数据表名
    -> (
    -> 列名1 数据类型(数据长度) PRIMARY KEY,        --主键
    -> 列名2 数据类型(数据长度) NOT NULL,        --非空约束
    -> 列名3 数据类型(数据长度) DEFAULT '默认值',        --默认值约束
    -> UNIQUE(列名a),        --唯一约束
    -> CONSTRAINT 主键名 PRIMARY KEY (列名a,列名b,...)，        --复合主键
    -> CONSTRAINT 外键名 FOREIGN KEY (列名) REFERENCES 表名(主键名)        --外键
    -> );
注意最后一个列名后面不加逗号”,”。

mysql安装后查找密码

cat /var/log/mysqld.log |grep password

更换初始密码 小大写字符



### 6.Nginx使用方式

Nginx默认端口为80



systemctl start  nginx  开启Nginx

systemctl  stop  nginx  关闭Nginx

systemctl  restart  nginx  重启Nginx

systemctl  enable  nginx  设置Nginx开机启动

### nginx error: CreateFile "E:\nginx\nginx-1.9.3/logs/nginx.pid" failed


版权
nginx: [error] CreateFile() "E:\nginx\nginx-1.9.3/logs/nginx.pid" failed

nginx: [error] Open() "E:\nginx\nginx-1.9.3/logs/nginx.pid" failed

解决方法:

使用命令创建/logs/nginx.pid文件:

nginx -c conf/nginx.conf

### [Windows中Nginx配置nginx.conf不生效解决方法](https://www.cnblogs.com/sheseido/p/14266523.html)

#### 此时关闭所有nginx进程。

通过命令taskkill /IM nginx.exe /F 去关闭所有nginx进程。

## [nginx下js文件修改后访问不更新问题解决](https://www.cnblogs.com/zqifa/p/nginx-9.html)

今天遇到一个问题，nginx下js修改后不更新，加版本号，刷新浏览器缓存都不行，重启服务器才行，修改后又不更新了
而且加载的js文件会有乱码或者文件加载不全的问题。

解决办法：
修改nginx.conf，sendfile off;

http {
sendfile off;
}

重启nginx后问题解决。

### [yum安装git](https://www.cnblogs.com/sunshinekevin/p/13053558.html)

1、安装git：yum install -y git

2、查看yum源仓库Git信息：yum info git

3、安装依赖库：yum install -y curl-devel expat-devel gettext-devel openssl-devel zlib-devel

​              yum install -y gcc-c++ perl-ExtUtils-MakeMaker

4、查看git版本，如果默认安装的版本过低，移除默认安装的git

   4.1、查看版本信息：git --version

   4.2、移除默认安装的git：yum remove git

安装指定版本git

wget https://github.com/git/git/archive/v2.9.2.tar.gz

tar -zxvf v2.9.2.tar.gz解压

### 一键更新通过git push

下载git clone 使用秘钥免登录拉取

### 拷贝

mv dist/ ~/nginx/upload/book

### 服务器后台启用 “&”

每次都要打开3000

node app.js &

查看node服务

 ps -ef|grep node

node.js文件改变后要重新加载

kill -9 19334

### Node搭建后台服务、在linux中一致保持启动状态的方法

安装最新版本的nodejs

sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
//然后根据提示下载安装node即可；
//安装forever
sudo npm install forever -g

### 使用forever启动服务

forever可以看做是一个nodejs的守护进程，能够启动，停止，重启我们的app应用。

A simple CLI tool for ensuring that a given script runs continuously (i.e. forever).
// 一个用来持续（或者说永远）运行一个给定脚本的简单的命令行工具

forever start app.js

//查询并停止
forever list
forever stop [pid]
forever stopall

### [为什么request.on（）在Node.js中不起作用（为什么request.on（）在Node.js中不起作用）](https://www.it1352.com/1821221.html)

我正在尝试使用节点请求模块从第三方服务获取一些数据，然后从函数中以字符串形式返回此数据。我的看法是request（）返回一个可读流，因为您可以执行request（...）。pipe（writeableStream）-我认为-暗示我可以

```
函数getData（）{ 
    var string; 

    request（'someurl'）. 
        on（'data'，function（data）{ 
             string + = data; 
        }）. 
        on（'end'，function（）{ 
            return string; 
        }）; 
}
```

但这确实不起作用。我认为我对request（）或节点流的实际工作方式有一些误解。有人可以在这里消除我的困惑吗？

它确实按照您解释的方式工作。也许您面临的问题是由于node.js的异步特性造成的。我很确定您正在以同步方式调用getData（）。尝试此操作，看看您的请求呼叫是否未返回任何内容：

```
request（'someurl'）. 
  on（'data'，function（data）{ 
    console.log（data.toString（））; 
  .on（'end'，function（）{ 
    console.log（“这就是结尾。 ..“）; 
  }）;
```

在[这里](https://github.com/maxogden/art-of-node#callbacks)看看这篇文章。它并不短，但是它说明了如何编写代码以应对这种情况。

### 听书bug

怀疑是因为voice.js的事件加载事件没有写好

因为没有明确时间

# error

error：播放器无法切换播放暂停![播放器无法切换播放暂停](D:\百度云（Plus）\Vue项目\Vue2.5 实战微信读书\报错\播放器无法切换播放暂停.jpg)

```js
![cfi错误](D:\百度云（Plus）\Vue项目\Vue2.5 实战微信读书\报错\cfi错误.jpg)//bookSpeaking.vue
    // 暂停播放
      pausePlay() {
        // pause暂停播放
        this.$refs.audio.pause()
        // 停止正在播放的播放动画 !!!
           // 发现是speakPlaying写错，后更正解决错误
        this.$refs.speakPlayingspeakPlaying[0].stopAnimation()
        this.$refs.speakPlaying[0].stopAnimation()
        // 播放状态设置为false
        this.isPlaying = false
        // 播放状态设置为2暂停
        this.playStatus = 2
      },
```

error:谷歌浏览器 Unchecked runtime.lastError: The message port closed before a response was received.

原因：扩展程序问题

- 建议：打开`chrome://extensions/`，逐一关闭排查
- 以我的为例，发现扩展程序报错，最后关闭就好。

error:bookSpeaking.vue?d573:415 Uncaught (in promise) TypeError: Cannot read property 'cfi' of undefined
    at eval (bookSpeaking.vue?d573:415)
eval @ bookSpeaking.vue?d573:415
Promise.then (async)
speak @ bookSpeaking.vue?d573:410
click @ bookSpeaking.vue?25cd:89
invokeWithErrorHandling @ vue.runtime.esm.js?2b0e:1854
invoker @ vue.runtime.esm.js?2b0e:2179
original._wrapper @ vue.runtime.esm.js?2b0e:6917

![cfi错误](D:\百度云（Plus）\Vue项目\Vue2.5 实战微信读书\报错\cfi错误.jpg)

![access跨域错误](D:\百度云（Plus）\Vue项目\Vue2.5 实战微信读书\报错\access跨域错误.jpg)

ajax只能接受http，data，chrome的，https替换环境变量时出现问题

.env.production写错成.env.producation

![notfound](D:\百度云（Plus）\Vue项目\Vue2.5 实战微信读书\报错\notfound.jpg)

bookHome中banner通过异步的方式赋值，backgroundImage不接受null会抛出异常

banner初值 ‘ 空的字符串

error：Access to XMLHttpRequest at 'http://47.99.166.157/epub2/2016_Book_StemCellsInNeuroendocrinology/OEBPS/META-INF/com.apple.ibooks.display-options.xml' from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

nginx重新加载配置文件的时候报错
描述：在控制台执行 nginx -s reload 命令时报错，错误如下所示

错误内容：nginx: [error] OpenEvent("Global\ngx_reload_5376") failed (5: Access is denied)

解决方案：在控制台输入nginx的启动命令：start nginx,然后在执行：nginx -s reload 命令即可

error:个别书籍无法预读

error：从阅读器页面无法进入听书页

error：听书功能只能第一次点击的章节有效，再次点击别的章节也只会读第一次点击的章节

error:无法快进