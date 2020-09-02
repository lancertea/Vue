/**
 * 普通用户路由
 */

import {ALL_USER_ROLE_ROUTER, PROJECT_NAME} from 'const/text';
import {RouteConfig} from 'vue-router';

export const ROUTER_ORDER: RouteConfig[] = [
    {
        path: '/home',
        component (resolve) {
            require.ensure([], () => resolve(require('module/mod-home/index.vue')), 'home');
        },
        meta: {
            name: '风险管理',
            title: `首页-${PROJECT_NAME}`,
            keepAlive: true,
            roles: ALL_USER_ROLE_ROUTER
        },
        children: [{
            path: '',
            component (resolve) {
                require.ensure([], () => resolve(require('module/mod-home/home/index.vue')), 'home');
            },
            meta: {
                title: `首页-${PROJECT_NAME}`,
                keepAlive: true
            }
        }, {
            path: 'detail',
            component (resolve) {
                require.ensure([], () => resolve(require('module/mod-home/detail/index.vue')), 'detail');
            },
            meta: {
                title: `首页-${PROJECT_NAME}`,
                keepAlive: false
            }
        },
        {
            path: '/home/order-manage/detail/:order_id',
            name: 'order-detail',
            component (resolve) {
                require.ensure([], () => resolve(require('module/mod-home/list/order-detail/order_detail_box.vue')), 'order-detail');
            },
            meta: {
                name: '工作流详情',
                parent: '/home/order-manage',
                keepAlive: false,
                fullScreen: window.location.search.includes('isInAsset')
            }
        },
        {
            path: '/home/order-manage/workflow-detail/:eventId',
            name: 'workflow-detail',
            component (resolve) {
                require.ensure([], () => resolve(require('module/mod-risk-manage/event-manage/work-flow/index.vue')), 'workflow-detail');
            },
            meta: {
                name: '工作流详情'
            }
        },
        {
            path: '/home/fragile',
            name: 'fragile-detail',
            component (resolve) {
                require.ensure([], () => resolve(require('module/mod-risk-manage/fragile-manage/assert-detail/index.vue')), 'fragile-detail');
            },
            meta: {
                name: '资产脆弱性详情',
                parent: '/home',
                keepAlive: false
            }
        }]
    }
];
