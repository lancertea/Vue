//ES6 实现观察者模式代码：（观察订阅模式）
const queuedObservers = new Set();
const observe = fn => queuedObservers.add(fn); // 依赖收集  Vue中的dep
const observable = obj => new Proxy(obj, {set});// Proxy和Reflect一一对应
function set(target, key, value, receiver){
    const result = Reflect.set(target, key, value, receiver); // 执行set
    queuedObservers.forEach(observe => observe()); // 派发更新
    return result;
}

// 使用 观察者模式实例
const person = observable({
    name: 'Sun',
    age: 30
});

function print(){
    console.log(`name: ${person.name}, age: ${person.age}`);
}
observe(print);

person.age = 31;
// name: Sun, age: 31