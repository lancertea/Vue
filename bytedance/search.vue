<template>
    <div>
        <!-- $event是实参，表示event对象 -->
        <!--
            输入搜索内容即时搜索，所以有一个keyup事件。
            按回车键有一个进入搜索内容页面，所以有一个keydown.enter事件
            按上下键可以选择列表条目
        -->
        <input type="text" v-model="keyword" @keyup="get($event)" @keydown.enter="search()" @keydown.down="selectDown()" @keydown.up.prevent="selectUp()">
        <span  @click="clearInput()">&times;</span>
        <button  @click="search()">搜一下</button>
        <ul>
            <li v-for="(value,index) in myData"  @mouseover="selectHover(index)" @click="selectClick(index)" :key="value">
                {{value}}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            myData: [],//用来接收ajax得到的数据
            keyword: '',//v-model绑定的输入框的value
            now: -1,
            searchIndex: 0,
            searchSrc: 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd='
        }
    },
    methods: {
        // &event是实参，表示event对象
        get: function(ev) {
            // 如果按得键是上或者下，就不进行ajax
            if (ev.keyCode == 38 || ev.keyCode == 40) {
                return;
            }
            this.$http.jsonp('https://sug.so.360.cn/suggest?word=' + this.keyword + '&encodein=utf-8&encodeout=utf-8').then(function(res) {
                this.myData = res.data.s;
            });
        },
        search: function() {
            //打开对应的搜索界面
            window.open(this.searchSrc + this.keyword);
        },
        selectHover: function(index) {
            this.now = index
        },
        selectClick: function(index) {
            this.keyword = this.myData[index];
            this.search();
        },
        clearInput: function() {
            this.keyword = '';
            this.$http.jsonp('https://sug.so.360.cn/suggest?word=' + this.keyword + '&encodein=utf-8&encodeout=utf-8').then(function(res) {
                this.myData = res.data.s;
            });
        },
        selectDown: function() {
            this.now++;
            //到达最后一个时，再按下就回到第一个
            if (this.now == this.myData.length) {
                this.now = 0;
            }
            this.keyword = this.myData[this.now];
        },
        selectUp: function() {
            this.now--;
            //同上
            if (this.now == -1) {
                this.now = this.myData.length - 1;
            }
            this.keyword = this.myData[this.now];
        }
       
    }
}
</script>


