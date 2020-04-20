// 触发更新视图
function updateView() {
    console.log('视图更新')
}
// 重新定义属性，监听起来
function defineReactive(target, key, value) {
    // 核心 API
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                // 设置新值
                // 注意，value 一直在闭包中，此处设置完之后，再 get 时也是会获取最新的值
                value = newValue
                // 触发更新视图
                updateView()
            }
        }
    })
}

// 监听对象属性
function observer(target) {
    if (typeof target !== 'object' || target === null) {
        // 不是对象或数组
        return target
    }
    // 重新定义各个属性（for in 也可以遍历数组）
    for (let key in target) {
        defineReactive(target, key, target[key])
    }
}

// 准备数据
const data = {
    name: 'zhangsan',
    age: 20
}

// 监听数据
observer(data)

// 测试
//监听简单属性
data.name = 'lisi'//'视图更新'
data.age = 21//'视图更新'

