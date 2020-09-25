<template>
    <article class="mod-header" :style="{height: headerHeight}">
        <div class="header-bg"></div>
        <div class="header-bg-second"></div>
        <div class="header-content">
            <div class="header-left-bg">
                <i :class="'header-annimate-element'+ (i+12)" v-for="i in 4"></i>
            </div>
            <div class="header-right-bg">
                <i :class="'header-annimate-element'+ i" v-for="i in 11"></i>
            </div>

            <server-entry></server-entry>

            <left-menu v-if="!hideMenu" :level="userInfo.level"></left-menu>

            <div class="info-menu" v-if="!hideMenu || !hideInfo">
                <right-menu :name="userInfo.name"></right-menu>
            </div>
        </div>
    </article>
</template>

<script>

    /**
     * 公共头部
     */

    import leftMenu from './left-menu/index.vue';
    import rightMenu from './right-menu/info.vue';
    import {HEADER_HEIGHT} from 'const/number';
    import serverEntry from './server-entry/index.vue';
    import {mapState} from 'vuex';

    export default {

        data () {
            return {
                hideMenu: false,
	            hideInfo: false,
                headerHeight: `${HEADER_HEIGHT}px`
            };
        },

        components: {
	        leftMenu,
            rightMenu,
            serverEntry
        },

        computed:{
            ...mapState({
                userInfo: state => state.user.userInfo
            })
        },

	    watch: {
            '$route': 'checkRoutes'
	    },

	    methods: {
		    checkRoutes () {
			    let vm = this;

			    vm.hideMenu = vm.$route.meta.hideMenu;
			    vm.hideInfo = vm.$route.meta.hideInfo;
            }
        }
    };

</script>

<style scoped lang="less">
    @import './css/index.less';
    @import './css/bg_animate.less';

    .btn-box{
        float: left;
    }
</style>
