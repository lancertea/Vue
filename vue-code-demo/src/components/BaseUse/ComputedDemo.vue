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
        double1() {
            return this.num * 2
        },
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