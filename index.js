// 引入方法
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// 定义构造函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

// 初始化功能
initMixin(Vue)
// 状态混合
stateMixin(Vue)
// 事件混合
eventsMixin(Vue)
// 生命周期
lifecycleMixin(Vue)
// 渲染
renderMixin(Vue)

export default Vue
