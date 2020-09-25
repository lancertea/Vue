<template>
    <div class="app-container">
        <div v-if="!$route.meta.fullScreen">
            <header-bar></header-bar>

            <div class="view-body clearfix" :class="viewBodyClass" :style="viewBodyStyle" ref="viewBody">
                <router-view></router-view>
            </div>
        </div>
        <div v-else>
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">

    /**
     * 主页面
     */

    import Vue from 'vue';
    import './css/common.less';
    import {HEADER_HEIGHT, FOOTER_HEIGHT} from 'const/number';
    import Header from 'module/mod-common/header/index.vue';
    import DOMPurify from 'dompurify';

    export default Vue.extend({

        data () {
            return {
                headerHeight: `${HEADER_HEIGHT}px`,
                footerHeight: `${FOOTER_HEIGHT}px`
            };
        },

        components: {
            'headerBar': Header
        },

        computed: {
            viewBodyStyle (): object {  // 带有this的需要有返回标识符
                let vm = this;

               return {
		            marginTop: vm.headerHeight,
                    paddingBottom: vm.footerHeight
	            };
            },

            viewBodyClass (): object {
                let vm = this;
                return {
                    'view-body-frame': vm.$route.meta.isFrame
                };
            }
        },

        mounted () {
            let vm = this;

            vm.purifyHookAfterAttr();
            vm.setViewBodyMinHeight();

            window.onresize = () => {
                vm.setViewBodyMinHeight();
            };
        },

        methods: {
            purifyHookAfterAttr () {
                DOMPurify.addHook('afterSanitizeAttributes', this.afterSanitizeAttributesCb);
            },

            afterSanitizeAttributesCb (node) {

                // 将所有经过dompurify处理的a标签统一处理为打开新标签页
                if ('target' in node) {
                    node.setAttribute('target', '_blank');
                }

                // 兼容处理
                if (!node.hasAttribute('target') &&
                    (node.hasAttribute('xlink:href') ||
                        node.hasAttribute('href'))) {
                    node.setAttribute('xlink:show', 'new');
                }
            },

            setViewBodyMinHeight () {
                let vm = this,
                    viewBody = vm.$refs.viewBody,
                    minHeight = $(window).height() - HEADER_HEIGHT;

                if (viewBody) {
                    $(viewBody).css('min-height', `${minHeight}px`);
                }
            }
        },
        beforeDestroy () {
            DOMPurify.removeHook('afterSanitizeAttributes');
        }
    });
</script>
