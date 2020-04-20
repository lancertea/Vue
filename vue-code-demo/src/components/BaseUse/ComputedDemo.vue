<template>
    <div>
        <p>num {{num}}</p>
        <p>double1 {{double1}}</p>
        <!-- 有v-model,双向数据绑定，必须要有get()  set() -->
        <input v-model="double2"/>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            num: 20
        }
    },
    computed: {
    //提供的函数用作该属性的getter函数(默认)
        double1() {
            return this.num * 2
        },
    //计算属性默认只有 getter，不过在需要时你也可以提供一个 setter。
        double2: {
            get() {
                return this.num * 2
            },
            set(val) {
                this.num = val/2
            }
        }
    }
}
</script>