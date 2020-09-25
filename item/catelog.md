### 好用的软件分享
公共翻墙软件：Shadowsocks
快速查找文件、打开应用程序、网址直达、网络搜索...：火萤酱
截图工具：Snipaste
在windows 资源管理器下预览SVG文件：SVG 文件预览
提问的智慧：Copyleft 2001 by D.H.Grand(nOBODY/Ginux)


### 项目目录
-node_modules 依赖包

-mock 前端mock数据的目录 该目录结构是根据php后台的appName来划分的

-dist  生产版本
 ->3parts
 ->static
 ...
 
-src   开发版本(源码目录)
 ->components 公用模块代码
 ->module 业务模块代码
 ->util 工具函数代码，包括校验函数
 ->lib
 ...

-static build时生成的所有静态资源的目录，目录下面会有js, css, img, font等

sfx.config.js 配置文件 扩展内置的webpack配置
.babelrc  babel配置文件
.editorconfig 代码风格控制
.gitignore
.eslintignore  
.eslintrc.js    eslint配置文件
.tslintrc.js
tsconfig.json
tslint.json
.npmrc npm的配置文件所在位置
.yarnclean
.yarnrc
yarn.lock 
package-lock.json  锁定所有模块的版本号
package.json  项目中所需要的所有模块

1，CommonsChunkPlugin 抽取的是公共部分而不是"经常变动的部分";
2,观察了一下，webpack应该是会在最后一个CommonsChunkPlugin产出的chunk注入webpackJsonp的定义,以及异步加载相关的定义,而就是这个会涉及到所有entry及chunk的md5,所以会"经常变动"，同时vue-cli默认的vendor是打包node_module下的所有依赖，会很大，在生产环境，过大的文件要尽量利用缓存来加快载入速度，但“经常变动”不利于缓存，所以为了将entry(这里可认为是app.js)的变动隔离在vendor之外，vue-cli在vendor之后多做了一个manifest的chunk,这样entry只要不引入新的node_modules里的包就不会影响到vendor了.ps:所以其实跟编译次数没什么关系,所有文件每次打包都会再编译一次的,重点是大文件，缓存，变动代码的拆分.


app.js：基本就是你实际编写的那个app.vue(.vue或.js?),没这个页面跑不起来.
vendor.js:vue-cli全家桶默认配置里面这个chunk就是将所有从node_modules/里require(import)的依赖都打包到这里，所以这个就是所有node_modules/下的被require(import)的js文件
manifest.js:最后一个chunk，被注入了webpackJsonp的定义及异步加载相关的定义(webpack调用CommonsChunkPlugin处理后模块管理的核心,因为是核心,所以要第一个进行加载,不然会报错).

