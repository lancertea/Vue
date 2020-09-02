<template>
    <section class="order-manage-box">
        <content-head class="home-head"
                      ref="head"
                      @change-nav="changeNav"/>
        <div class="content-body">
            <div class="order-content">
                <template v-if="isEventManage">
                    <event-manage></event-manage>
                </template>
                <template v-if="isThreatOrder">
                    <risk-manage></risk-manage>
                </template>
                <template v-if="isVms">
                    <fragile-manage></fragile-manage>
                </template>
            </div>


        </div>
    </section>
</template>

<script>

    /**
     * @file 首页-内容
     */

    import ContentHead from './head/index.vue';
    import EventManage from 'module/mod-risk-manage/event-manage/index.vue';
    import RiskManage from 'module/mod-risk-manage/risk-manage/index.vue';
    import FragileManage from 'module/mod-risk-manage/fragile-manage/index.vue';
    import { MWR_ORDER_TYPE } from 'const/mod_order';
    import directivesMixin from 'util/directives';

    export default {
        components: {
            ContentHead,
            EventManage,
            RiskManage,
            FragileManage
        },
        mixins: [directivesMixin],
        data () {
            let {activePage} = this.$route.query;

            return {
                MWR_ORDER_TYPE,
                currTab: activePage || String(MWR_ORDER_TYPE.event)
            };
        },

        computed: {
            isEventManage () { // 事件管理
                return Number(this.currTab) === MWR_ORDER_TYPE.event;
            },
            isThreatOrder () { // 威胁管理
                return Number(this.currTab) === MWR_ORDER_TYPE.threat;
            },
            isVms () {  // 脆弱性管理
                return Number(this.currTab) === MWR_ORDER_TYPE.vms;
            }
        },
        methods: {

            changeNav (value) {
                this.currTab = value;
            },

            needRefresh () { // 重置状态后刷新头部信息
                let vm = this,
                    $head = vm.$refs.head;

                if ($head) {
                    $head.getNavigationInfo();
                }
            }
        }
    };

</script>
