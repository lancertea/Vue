<template>
    <div class="hd-nav">
        <ul class="hd-nav-content">
            <li v-for="(nav, index) in menuList"
                v-show="!nav.hidden"
                :key="nav.text"
                class="hd-nav-item"
                :class="{'hd-nav-item-children': nav.children && nav.children.length, 'active': nav.actived}"
                :ga-data="nav.gaData"
                @mouseenter="showNavChildren = index"
                @mouseleave="showNavChildren = -1">
                <router-link v-if="nav.path"
                             class="hd-nav-label"
                             :to="nav.path"
                             :ga-data="nav.gaData">
                    {{ nav.text }}
                </router-link>
                <div v-if="nav.children && nav.children.length">
                    <span class="hd-nav-label">
                        {{ nav.text }}
                        <svg class="icon hd-nav-label__icon"
                             aria-hidden="true">
                            <use xlink:href="#icon-comp-angle-down"></use>
                        </svg>
                    </span>
                    <collapse-transition>
                        <div v-show="showNavChildren === index"
                             class="hd-nav-menu">
                            <template v-for="child in nav.children">
                                <span v-if="child.redirect && !child.hidden"
                                      class="hd-nav-menu_item"
                                      @click="go2otherWeb(child.redirect)">
                                    {{ child.text }}
                                </span>
                                <router-link v-else-if="!child.hidden"
                                             :key="child.text"
                                             :to="child.path"
                                             :class="{'active': child.actived}"
                                             class="hd-nav-menu_item">
                                    {{ child.text }}
                                </router-link>
                            </template>
                        </div>
                    </collapse-transition>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

    /**
     * 导航条
     */

    import CollapseTransition from 'src/module/mod-common/collapse/index';
    import { MWR_COMPANY_ID } from 'const/text';
    import { mapGetters } from 'vuex';

    export default {
        components:{
            CollapseTransition
        },

        props: {
            activeTab: {
                type: String,
                default: ''
            },
            level: {
                type: Number
            }
        },

        data () {

            return {
                showNavChildren: -1
            };
        },
 computed: {
            ...mapGetters('user', ['$_user_isChannel', '$_user_isChannelOrOther', '$_user_isAdmin']),
            menuList () {
                return [
                    {
                        text: '总览',
                        path: '/overview'
                    },
                    {
                        text: '风险管理',
                        path: '/home'
                    },
                    {
                        text: '资产管理',
                        path:  `/customer/${MWR_COMPANY_ID}/asset`
                    },
                    {
                        text: '基础管理',
                        children: [
                            {
                                text: '用户管理',
                                path: '/technocracy',
                                hidden: !this.$_user_isAdmin
                            },
                            {
                                text: '设备管理',
                                path: `/customer/${MWR_COMPANY_ID}/device`
                            },
                            {
                                text: '剧本管理',
                                path: '/customer/playbook'
                            },
                            {
                                text: '黑白名单管理',
                                path: `/customer/${MWR_COMPANY_ID}/other`
                            }
                        ]
                    },
                    {
                        text: '工具中心',
                        hidden: this.$_user_isChannelOrOther,
                        children:[
                            {

                                text: '检索中心',
                                path: '/analysis'
                            },
                            {
                                text: '知识管理',
                                path: '/knowledge/loophole'
                            }

                            // {
                            //     text: '报告中心',
                            //     path: '/report'
                            // }

                            // {
                            //     text: '微信群发',
                            //     path: '/wechat-mass'
                            // }
                        ]
                    },
                    {
                        text: '分析中心',
                        path: '/confrontation'
                    },
                    {
                        text: '系统设置',
                        path: this.$_user_isAdmin ? '/setting' : '/setting/network'
                    }
                ];
            }
        },

        watch: {
            '$route': {
                immediate: true,
                handler (newRoute) {
                    this.handleRouteChange(newRoute);
                }
            },
            activeTab: {
                immediate: true,
                handler () {
                    this.menuList.forEach(item => {
                        if (item.children && item.children.length) {
                            item.children.forEach(child => {
                                child.actived = false;
                            });

                            let activeChild = item.children.find(child => this.activeTab === child.path);

                            item.actived = !!activeChild;

                            if (activeChild) {
                                activeChild.actived = true;
                            }
                        } else {
                            item.actived = this.activeTab === item.path;
                        }
                    });

                    this.$forceUpdate();
                }
            }
        },
        methods: {
            handleRouteChange (curRoute) {

                // 将二级菜单的父菜单激活
                this.activeCurMenu(curRoute);
            },

             activeCurMenu (curRoute) {
                this.menuList.forEach(menu => {
                    let activeItem;
                    if (menu.children && Array.isArray(menu.children)) {
                        activeItem = menu.children.find(item => item.path === curRoute.path);
                    }

                    menu.actived = !!activeItem;
                });
            },

            go2otherWeb (url) {
                window.open(url);
            }
        }
    };
</script>
