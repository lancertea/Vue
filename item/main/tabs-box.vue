<template>
    <tabs-box :nav-option="list"
              @change-nav="changeNav">
        <div class="tab-title"
             slot="item"
             slot-scope="{data}">
            <span class="title-text">
                {{data.title}}
            </span>
            
            <!-- 数字为0不展示 -->
            <num-tip v-if="data.num"
                     :tip-num="data.num" />
        </div>
    </tabs-box>
</template>

<script>

    /**
     * @file 内容头部
     */

    import TabsBox from 'components/common/tabs/index.vue';
    import DropdownBox from 'components/common/dropdown/index.vue';
    import {ORDER_STATUS, MWR_ORDER_TYPE} from 'const/mod_order';
    import transferMixin from './modal/transfer/index.js';
    import IntervalTask from 'src/util/interval_task';
    import NumTip from 'components/common/num-tip/index.vue';

    export default {
        components: {
            TabsBox,
            DropdownBox,
            NumTip
        },
        mixins: [transferMixin],
        data () {
            return {
                ORDER_STATUS,
                navigationInfo: {
                    menace: 0, // 威胁事件工作流数
                    event: 0, // 事件工作流工作流数
                    vulnerability: 0 // 脆弱性工作流数
                }
            };
        },
        computed: {
            list () {
                let {navigationInfo} = this;

                return [
                    {
                        title: MWR_ORDER_TYPE[1],
                        value: MWR_ORDER_TYPE.event,
                        num: navigationInfo.event,
                        bodyName: String(MWR_ORDER_TYPE.event)
                    },
                    {
                        title: MWR_ORDER_TYPE[4],
                        value: MWR_ORDER_TYPE.threat,
                        num: navigationInfo.menace,
                        bodyName: String(MWR_ORDER_TYPE.threat)
                    },
                    {
                        title: MWR_ORDER_TYPE[2],
                        value: MWR_ORDER_TYPE.vms,
                        num: navigationInfo.vulnerability,
                        bodyName: String(MWR_ORDER_TYPE.vms)
                    }
                ];

            }
        },
        watch:{
            '$route': {
                handler (to) {
                    if (to.path === '/home') {
                        this.initIntervalTask();
                    } else {
                        this.stopIntervalTask();
                    }
                },
                immediate:true
            }
        },
        created () {
            this.getNavigationInfo();
        },

        methods: {
            initIntervalTask () {
                this.intervalTask = new IntervalTask({
                    fn: () => {
                        this.getNavigationInfo().then(() => {
                            this.intervalTask.next();
                        });
                    },
                    autoStart: true,
                    skipFirst: true,
                    interval: 5000
                });
            },
             /**
             * 停止表格定时刷新任务
             */
            stopIntervalTask () {
                if (this.intervalTask) {
                    this.intervalTask.stop();
                }
            },
            changeNav ({value}) {
                this.$emit('change-nav', value);
            },
            getNavigationInfo () {
                let vm = this;

                /*eslint-disable*/
                return new Promise((resolve) => {
                    vm.$ajax({
                        url: '/order/v1/threat_event/navigation',
                        type: 'get',
                        successCallback ({data}) {
                            vm.navigationInfo = data;
                            resolve();
                        }
                    });
                }).catch((e) => {});
                /*eslint-enable*/
            }
        },
        destroyed () {
            this.stopIntervalTask();
        }
    };

</script>
