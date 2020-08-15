### 开始
先来看下流程图

#### 看下流程
- E:\vue-dev\package.json
    - "dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev",
- scripts/config.js
    - web-full-dev
    - entry: resolve('web/entry-runtime-with-compiler.js')
- E:\vue-dev\scripts\alias.js
    - web: resolve('src/platforms/web')
- src/platforms/web/entry-runtime-with-compiler.js
    - import Vue from './runtime/index'
        - 经过一系列的import然后在Vue上面添加一些列属性方法，最后到E:\vue-dev\src\core\instance\index.js
    - Vue.prototype.$mount
#### 初始化
- src/core/instance/index.js; 
    - 调用了这个方法this._init(options)
- E:\vue-dev\src\core\instance\init.js
    - 看看这个方法this._init(options)
        - 初始化了一堆东西，包括initData(vm)
        - vm.$mount(vm.$options.el)
    - 看看initData(vm)方法
        - 注意这个方法getData() 
        - 搞了一堆操作，最后循环为每个属性执行了observe(data)方法
    - 先看getData()
        - 调用了方法pushTarget()
    - 看看observe(sata)方法
        - 在E:\vue-dev\src\core\observer\index.js
- E:\vue-dev\src\core\observer\index.js
    - 看看obeserve(data)方法
        - 数组执行observeArray方法
            - observeArray 方法为每个元素执行new Observer(value)
        - 对值做判断然后返回new Observer(data)实例
    - 看看Observer(data)构造
        - 构建的时候调用了this.walk(data)方法
    - 看看this.walk(data)方法
        - 调用了defineReactive(obj, key)
    - 看看defineReactive(obj, key)方法
        - get属性
            - dep = new Dep()
            - Dep.target?
            - 运行dep.depend()
        - set属性
            - 调用ob.dep.notify()方法；原型属性链上的方法
- E:\vue-dev\src\core\observer\dep.js
    - 有这个方法pushTarget(target)
        - Dep.target = target
    - 看看Dep
        - this.subs 收集订阅者
        - depend()
            - Dep.target.addDep(this) //this是dep实例
        - notify


#### 渲染页面
- src/platforms/web/entry-runtime-with-compiler.js
    - mount
- E:\vue-dev\src\platforms\web\runtime\index.js
    - mountComponent
- core/instance/lifecycle
    - mountComponent
        - 调用了vm._update(vm._render(), hydrating)
    - new Watcher
- new Watcher
    - E:\vue-dev\src\core\observer\watcher.js
- E:\vue-dev\src\core\observer\watcher.js
    - Watcher
    ```
    new Watcher(vm, updateComponent, noop, {
        before () {
            if (vm._isMounted && !vm._isDestroyed) {
                callHook(vm, 'beforeUpdate')
            }
        }
    }, true /* isRenderWatcher */)
    ```
    - 看下这个this.value = this.lazy ? undefined : this.get()
        - 注意lazy
    - get方法
        - pushTarget(this)
        - value = this.getter.call(vm, vm) 调用一次方法
- E:\vue-dev\src\core\observer\dep.js
    - 看看Dep
        - this.subs 收集订阅者
        - depend()
            - Dep.target.addDep(this) 相当于new Watcher().addDep(this)  // 这个this是dep
        - addDep
            - dep.addSub(this)  // 这个this指向watch
        - addSub(sub)
            - this.subs.push(sub)   //把watch push进subs
        - notify
            - subs[i].update()  // 执行watch的update方法
        - update
            - this.run() 调用方法
            - queueWatcher 队列
- core/instance/lifecycle
    - vm._update(vm._render(), hydrating)
        - 这个方法在lifecycleMixin里面有
    - lifecycleMixin
