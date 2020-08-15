# 源码剖析 
【概述】：vue实例化时会把模板(挂载到vue上的el元素对应的DOM节点，或者template属性)转换成一个虚拟的VNode，并在更新DOM时采用diff算法对DOM树进行检测，只更新需要更新的DOM节点，对于一些静态节点则不进行变更，以达到最快的速度。

## 响应式
1. Vue 是怎么知道数据改变？
使用 Object.defineProperty 为对象中的每个属性，设置 get 和 set 方法  
get 值是一个函数，当属性被访问时，会触发 get 函数  
set 值同样是一个函数，当属性被赋值时，会触发 set 函数  
Vue 在属性的 set 方法中做了手脚，因而当数据改变时，触发属性的 set 方法，Vue 就能知道数据有改变  

2. Vue 在数据改变时，怎么知道通知哪些视图更新？  
依赖收集: data 中的声明的每个属性，都拥有一个数组dep{subs...}，保存着谁用了它  
每个 Vue 实例都会拥有一个专属的 watcher，可用于实例更新  
当页面使用到某个属性时，页面的 watcher 就会被放到依赖收集器 subs 中  
【何时收集】 get  
【通知哪些】 依赖收集器 subs中的视图  

3. Vue 在数据改变时，视图怎么知道什么时候更新？  
set时，遍历自己的 依赖收集器 subs，逐个通知 watcher，让 watcher 完成更新  

简单总结  
- Object.defineProperty - get ，用于 依赖收集
- Object.defineProperty - set，用于 依赖更新
- 每个 data 声明的属性，都拥有一个的专属依赖收集器 subs
- 依赖收集器 subs 保存的依赖是 watcher
- watcher 可用于 进行视图更新
