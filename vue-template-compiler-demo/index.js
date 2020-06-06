const compiler = require('vue-template-compiler')

// 插值
const template = `<p>{{message}}</p>`
//this 就是 vue的实例  const vm =new Vue({...})
// with(this){return createElement('p',[createTextVNode(toString(message))])}
// h -> vnode
// _c -> createElement -> vnode

//  表达式  表达式内部就是本身JS代码
// const template = `<p>{{flag ? message : 'no message found'}}</p>`
// // with(this){return _c('p',[_v(_s(flag ? message : 'no message found'))])}

// 属性后面是字符串
//动态属性后面是变量
// const template = `
//     <div id="div1" class="container">
//         <img :src="imgUrl"/>
//     </div>
// `
// with(this){return _c('div',
//      {staticClass:"container",attrs:{"id":"div1"}},
//      [
//          _c('img',{attrs:{"src":imgUrl}})])}
//属性是个字符串，动态属性是个变量

// // 条件
// const template = `
//     <div>
//         <p v-if="flag === 'a'">A</p>
//         <p v-else>B</p>
//     </div>
// `
// with(this){return _c('div',[(flag === 'a')?_c('p',[_v("A")]):_c('p',[_v("B")])])}
//v-if  v-else  被编译成三元表达式

// 循环
// const template = `
//     <ul>
//         <li v-for="item in list" :key="item.id">{{item.title}}</li>
//     </ul>
// `
// with(this){return _c('ul',_l((list),function(item){return _c('li',{key:item.id},[_v(_s(item.title))])}),0)}
//列表：renderList  函数()  （给一个数组给一个函数，用函数遍历数组）

// 事件
// const template = `
//     <button @click="clickHandler">submit</button>
// `
// with(this){return _c('button',{on:{"click":clickHandler}},[_v("submit")])}

// v-model
const template = `<input type="text" v-model="name">`
// 主要看 input 事件
// with(this){return _c('input',{directives:[{name:"model",rawName:"v-model",value:(name),
//expression:"name"}],attrs:{"type":"text"},domProps:{"value":(name)},设置变量
//on:{"input":function($event){if($event.target.composing)return;name=$event.target.value}}})}
// 当值改变，触发该事件，该事件会将当前的值赋值给name

// render 函数
// 返回 vnode
// patch

// 编译
const res = compiler.compile(template)
console.log(res.render)

// ---------------分割线--------------

// // 从 vue 源码中找到缩写函数的含义
// function installRenderHelpers (target) {
//     target._o = markOnce;
//     target._n = toNumber;
//     target._s = toString;
//     target._l = renderList;
//     target._t = renderSlot;
//     target._q = looseEqual;
//     target._i = looseIndexOf;
//     target._m = renderStatic;
//     target._f = resolveFilter;
//     target._k = checkKeyCodes;
//     target._b = bindObjectProps;
//     target._v = createTextVNode;
//     target._e = createEmptyVNode;
//     target._u = resolveScopedSlots;
//     target._g = bindObjectListeners;
//     target._d = bindDynamicKeys;
//     target._p = prependModifier;
// }



// with语法
// const obj={a:100,b:200}
// console.log(obj.a);//100
// console.log(obj.b);//200
// console.log(obj.c);//undefined

// //使用with，能改变{}内自由变量的查找方式
// //将{}内自由变量，当做obj的属性来查找
// with(obj){
//     console.log(a);
//     console.log(b);
//     console.log(c);//会报错！！！   
// }

