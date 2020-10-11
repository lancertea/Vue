<template>
    <div>
        <input v-model="name"/>
        <input v-model="info.city"/>
    </div>
</template>

<script>
/*当 watch.getter 执行，而读取了 vm.name 的时候，name的依赖收集器就会收集到watch的watcher
监听的数据变化的时候，就能通知 watch-watcher 更新，所谓通知更新，就是手动调用 watch.update*/
export default {
    data() {
        return {
            name: '双越',
            info: {
                city: '北京'
            }
        }
    },
    watch: {
        name(oldVal, val) {
            // eslint-disable-next-line
            // 值类型，可正常拿到 oldVal 和 val
            console.log('watch name', oldVal, val) 
        },
        info: {
            handler(oldVal, val) {
                // eslint-disable-next-line
                // 引用类型，拿不到 oldVal 。因为指针相同，此时已经指向了新的 val
                console.log('watch info', oldVal, val) 
            },
            deep: true // 深度监听
        }
    }
}
</script>
