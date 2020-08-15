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

## props
props使用场景： 比如定义一个公共组件作为子组件，其他组件复用这个组件作为父组件  
1. 父组件怎么传值给子组件的props  
props传值前，父组件的模板会被解析成一个模板渲染函数，with绑定this  
props 开始赋值，模板函数会被执行，执行时会绑定父组件为作用域。所以渲染函数内部所有的变量，都会从父组件对象上去获取  

2. 子组件如何读取props  
子组件筛选出props，保存起来。props会被保存到实例的_props 中，逐一复制到实例上，并且每个属性会被设置为响应式的  
每个实例都会有一个 _props 的同时，也会把属性直接放在实例上  
访问 props 其中一个值 vm.attrName，其实访问的是 vm._props.attrName  

3. 父组件 data 更新，子组件的 props 如何更新  
响应式  
但是父组件 data 的值 和 子组件的 props 一般是没有任何联系的，更改 props 不影响父组件 data，但是如果传入的是对象，是会影响父组件的  
