<template>
    <section>
        <sf-panel :panel-margin-top="0"
                  :body-padding="0"
                  :class="{'panel-in-asset': isInAsset}"
                  :no-header="true">
            <section slot="content">
            <!-- 表格 -->
                <sf-table ref="table"
                          api="/order/v1/threat_event/list"
                          :toggle-columns="toggleColumns"
                          :params="tableParams"
                          @selection-change="$_threatEventMixin_tableSelectChange"
                          fit="true">
                          <sf-table-column type="selection"
                                     width="40"></sf-table-column>

                    <sf-table-column label="序号"
                                     fixed="left"
                                     min-width="40"
                                     align="center"
                                     prop="index">
                    </sf-table-column>

                    <sf-table-column label="威胁名称"
                                     fixed="left"
                                     min-width="150"
                                     prop="name">
                        <template slot="header"
                                  slot-scope="{ row }">
                            <header-statistics :field="FIELD_COUNT_TYPE.name"
                                               :is-threat="true"
                                               :params="$_threatEventMixin_getTableParams()">
                                威胁名称
                            </header-statistics>
                        </template>
                        <template slot-scope="{ row }">
                            <span class="common-ellipsis common-link"
                                  @click="showEventDetail(row)">
                                {{row.name}}
                            </span>
                        </template>
                    </sf-table-column>

                    <sf-table-column label="威胁等级"
                                     min-width="100"
                                     prop="risk_level">
                        <template slot="header"
                                  slot-scope="{ row }">
                            <header-statistics :field="FIELD_COUNT_TYPE.riskLevel"
                                               :is-threat="true"
                                               :params="$_threatEventMixin_getTableParams()">
                                威胁等级
                            </header-statistics>
                        </template>
                        <template slot-scope="{ row }">
                            <risk-level :level="row.risk_level"></risk-level>
                        </template>
                    </sf-table-column>

                    <sf-table-column label="威胁类型"
                                     min-width="150"
                                     prop="type">
                        <template slot="header"
                                  slot-scope="{ row }">
                            <header-statistics :field="FIELD_COUNT_TYPE.type"
                                               :is-threat="true"
                                               :params="$_threatEventMixin_getTableParams()">
                                威胁类型
                            </header-statistics>
                        </template>
                    </sf-table-column>
                    <sf-table-column label="源IP"
                                     min-width="180"
                                     :show-overflow-tooltip="false"
                                     prop="src_ip">
                        <template slot="header"
                                  slot-scope="{ row }">
                            <header-statistics :field="FIELD_COUNT_TYPE.srcIp"
                                               :is-threat="true"
                                               :params="$_threatEventMixin_getTableParams()">
                                源IP
                            </header-statistics>
                        </template>
                        <template slot-scope="{ row }">
                            <template v-if="row.src_ip.length">
                                <el-tooltip effect="light">
                                    <div slot="content" class="dst-ip-wrap">
                                        <div class="ip-flow-wrap"
                                             v-for="(item, index) in row.src_ip"
                                             :key="index">
                                            <search-pover device-type="attacker"
                                                        :is-threat="1"
                                                        :show-direct="true"
                                                        :hide-pover="true"
                                                        :row-data="row"
                                                        :opt-data="item"
                                                        class="inner-pover"
                                                        :btn-list="$_attackMixin_srcipBtnList(false, 'src_ip', 1)"
                                                        @refresh-table="refreshTable"
                                                        id-key="ip"/>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="ip-flow-wrap"
                                             v-for="(item, index) in row.src_ip.slice(0,2)"
                                             :key="index">
                                            <search-pover device-type="attacker"
                                                        :is-threat="1"
                                                        :hadTip="false"
                                                        :hide-pover="true"
                                                        :row-data="row"
                                                        :opt-data="item"
                                                        class="inner-pover"
                                                        :btn-list="$_attackMixin_srcipBtnList(false, 'src_ip', 1)"
                                                        @refresh-table="refreshTable"
                                                        id-key="ip"/>
                                        </div>

                                        <span v-if="row.src_ip.length > 2">等{{row.src_ip.length}}个</span>

                                    </div>
                                </el-tooltip>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </sf-table-column>
                    <sf-table-column label="源端口"
                                     min-width="70"
                                     :show-overflow-tooltip="false"
                                     prop="src_port">
                        <template slot-scope="{ row }">
                            <sf-table-cell-mult-text :list="row.src_port"
                                                     :max-num="2"></sf-table-cell-mult-text>
                        </template>
                    </sf-table-column>

                    <sf-table-column label="目的IP"
                                     min-width="115"
                                     :show-overflow-tooltip="false"
                                     prop="dst_ip">
                        <template slot="header"
                                  slot-scope="{ row }">
                            <header-statistics :field="FIELD_COUNT_TYPE.dstIp"
                                               :is-threat="true"
                                               :params="$_threatEventMixin_getTableParams()">
                                目的IP
                            </header-statistics>
                        </template>
                        <template slot-scope="{ row }">
                            <template v-if="row.dst_ip.length">
                                <el-tooltip effect="light">
                                    <div slot="content" class="dst-ip-wrap">
                                        <div class="ip-flow-wrap"
                                             v-for="(item, index) in row.dst_ip"
                                             :key="index">
                                            <search-pover :show-direct="true"
                                                          device-type="suffer"
                                                          :is-threat="1"
                                                          :row-data="row"
                                                          :opt-data="item"
                                                          class="inner-pover"
                                                          :btn-list="$_attackMixin_srcipBtnList(false, 'dst_ip')"
                                                          @refresh-table="refreshTable"
                                                          id-key="ip"/>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="ip-flow-wrap"
                                             v-for="(item, index) in row.dst_ip.slice(0,2)"
                                             :key="index">
                                            <search-pover :had-tip="false"
                                                          device-type="suffer"
                                                          :is-threat="1"
                                                          :hide-pover="true"
                                                          :row-data="row"
                                                          :opt-data="item"
                                                          class="inner-pover"
                                                          id-key="ip"/>
                                        </div>

                                        <span v-if="row.dst_ip.length > 2">等{{row.dst_ip.length}}个</span>

                                    </div>
                                </el-tooltip>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </sf-table-column>
<sf-table-column label="目的端口"
                                     min-width="70"
                                     :show-overflow-tooltip="false"
                                     prop="dst_port">
                        <template slot-scope="{ row }">
                            <sf-table-cell-mult-text :list="row.dst_port"
                                                     :max-num="2"></sf-table-cell-mult-text>
                        </template>
                    </sf-table-column>

                    <sf-table-column label="URL"
                                     min-width="180"
                                     :show-overflow-tooltip="false"
                                     prop="url">
                        <template slot="header"
                                  slot-scope="{ row }">
                            <header-statistics :field="FIELD_COUNT_TYPE.url"
                                               :is-threat="true"
                                               :params="$_threatEventMixin_getTableParams()">
                                URL
                            </header-statistics>
                        </template>
                        <template slot-scope="{ row }">
                            <template v-if="row.url.length">
                                <el-tooltip effect="light" popper-class="long-url">
                                    <div slot="content" class="url-wrap">
                                        <div class="ip-flow-wrap"
                                             v-for="(item, index) in row.url"
                                             :key="index">
                                            <search-pover device-type="url"
                                                        :is-threat="1"
                                                        :show-direct="true"
                                                        :row-data="row"
                                                        :opt-data="item"
                                                        class="inner-pover"
                                                        :btn-list="$_attackMixin_srcipBtnList(false, 'url')"
                                                        @refresh-table="refreshTable"
                                                        id-key="url"/>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="ip-flow-wrap"
                                             v-for="(item, index) in row.url.slice(0,2)"
                                             :key="index">
                                            <search-pover device-type="url"
                                                        :is-threat="1"
                                                        :had-tip="false"
                                                        :hide-pover="true"
                                                        :row-data="row"
                                                        :opt-data="transUrlItem(item)"
                                                        class="inner-pover"
                                                        :btn-list="$_attackMixin_srcipBtnList(false, 'url')"
                                                        @refresh-table="refreshTable"
                                                        id-key="url"/>
                                        </div>

                                        <span v-if="row.url.length > 2">等{{row.url.length}}个</span>

                                    </div>
                                </el-tooltip>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </sf-table-column>
                    <sf-table-column label="账户"
                                     min-width="200"
                                     prop="account"></sf-table-column>

                    <sf-table-column label="发件人"
                                     min-width="110"
                                     prop="email_sender"></sf-table-column>

                    <sf-table-column label="MD5"
                                     min-width="200"
                                     :show-overflow-tooltip="false"
                                     prop="md5">
                        <template slot-scope="{ row }">
                            <sf-table-cell-mult-text :list="row.md5"></sf-table-cell-mult-text>
                        </template>
                    </sf-table-column>

                    <sf-table-column label="威胁标签"
                                     min-width="150"
                                     prop="tag">
                        <template slot-scope="{ row }">
                            <sf-table-cell-mult-text :list="row.tag"
                                                     :max-num="2"
                                                     effect="light"
                                                     :show-total-num="false">
                                <div slot="content">
                                    <p class="event-tip__title">威胁标签</p>
                                    <sfsaas-tag v-for="(item, index) in row.tag"
                                                :key="index"
                                                class="risk-label"
                                                type="gray"
                                                effect="light">
                                        {{item}}
                                    </sfsaas-tag>
                                </div>
                                <template slot-scope="{ item }">
                                    <sfsaas-tag class="risk-label" type="gray" effect="light">
                                        {{ item }}
                                    </sfsaas-tag>
                                </template>
                            </sf-table-cell-mult-text>
                        </template>
                    </sf-table-column>
                    <sf-table-column label="威胁来源"
                                     min-width="100"
                                     prop="source">
                        <template slot-scope="{ row }">
                            <span>{{SOURCE_MODE[row.source]}}</span>
                        </template>
                    </sf-table-column>

                    <sf-table-column label="首次发生时间"
                                     min-width="115"
                                     prop="first_time"></sf-table-column>

                    <sf-table-column label="最近发生时间"
                                     min-width="115"
                                     prop="latest_time"></sf-table-column>

                    <sf-table-column label="责任人"
                                     min-width="100"
                                     prop="owner"></sf-table-column>

                    <sf-table-column label="主机IP"
                                     min-width="150"
                                     prop="ips"></sf-table-column>

                    <sf-table-column label="威胁ID"
                                     min-width="150"
                                     prop="event_id"></sf-table-column>
                    
                    <sf-table-column label="威胁状态"
                                     fixed="right"
                                     min-width="80"
                                     :show-overflow-tooltip="false"
                                     prop="event_status">
                        <template slot-scope="{ row }">
                            <risk-status :status="row.event_status" :type="TYPE_OF_DEAL_STATUS.threat"></risk-status>
                        </template>
                    </sf-table-column>
                     <sf-table-column label="操作"
                                     fixed="right"
                                     prop="opr"
                                     width="180px">
                        <template slot-scope="{ row }">
                            <el-button v-if="row.event_status === RISK_STATUS_MAP.initedValue ||
                                         row.event_status === RISK_STATUS_MAP.finishedValue"
                                       type="text"
                                       size="small"
                                       @click="$_threatEventMixin_Opr({ opr_status: OPR_TYPE.handing,
                                                                    event_ids: [row.event_id],
                                                                    is_threat: 1 })">
                                升级为事件
                            </el-button>
                            <template v-if="row.event_status === RISK_STATUS_MAP.initedValue">
                                <el-button type="text"
                                           size="small"
                                           @click="$_threatEventMixin_Opr({ opr_status: OPR_TYPE.misjudgement,
                                                                        event_ids: [row.event_id],
                                                                        is_threat: 1 })">
                                    误报
                                </el-button>
                                <el-button type="text"
                                           size="small"
                                           @click="$_threatEventMixin_Opr({ opr_status: OPR_TYPE.ignored,
                                                                        event_ids: [row.event_id],
                                                                        is_threat: 1 })">
                                    忽略
                                </el-button>
                            </template>
                            <span v-if="row.event_status !== RISK_STATUS_MAP.initedValue &&
                                    row.event_status !== RISK_STATUS_MAP.finishedValue">-</span>
                        </template>
                    </sf-table-column>
                     <!-- 分页条 -->
                    <sf-pagination slot="pagination"></sf-pagination>
                </sf-table>
            </section>
        </sf-panel>

        <!--威胁详情-->
        <sfsaas-drawer :visible.sync="drawerMixin_drawerState"
                       :mask="false"
                       class="detail-drawer"
                       ref="drawer"
                       title="威胁详情"
                       size="50%"
                       :z-index="1010">
            <threat-detail :data="threatEventMixin_detailData"
                           @lock-success="lockSuccess"
                           :event-id="threatEventMixin_currentOrderId"/>

            <!--底部操作-->
            <footer-operate slot="footer">
                <template slot="left">
                    <sfsaas-button-primary v-if="operationBtnItem.is_handling_show"
                                           @click="updateEvent">
                        升级为事件
                    </sfsaas-button-primary>
                    <sfsaas-button v-if="operationBtnItem.is_misjudgement_show"
                                   @click="misjudgeClick">
                        误报
                    </sfsaas-button>
                    <sfsaas-button v-if="operationBtnItem.is_ignore_show"
                                   @click="ignoreClick">
                        忽略
                    </sfsaas-button>
                </template>
                <template slot="right">
                    <el-tooltip :disabled="threatEventMixin_detailData.next_event_id" content="已是本页最后一条">
                        <sfsaas-button  :default-disabled="!threatEventMixin_detailData.next_event_id"
                                        @click="$_threatEventMixin_nextOrderClick">下一条
                        </sfsaas-button>
                    </el-tooltip>
                </template>
            </footer-operate>
        </sfsaas-drawer>
    </section>
</template>
<script lang="ts">

    // todo 修改文件为 risk》threat

    /**
     * 威胁管理
     */

    import {Component, Mixins} from 'vue-property-decorator';
    import {
        ASSET_TYPE_OPTIONS,
        FIELD_COUNT_TYPE,
        MENU_TYPE,
        OPR_TYPE,
        RISK_LEVEL_OPT,
        RISK_STATUS_MAP,
        RISK_STATUS_OPT,
        RISK_TYPE_TEXT,
        SOURCE_MODE,
        SOURCE_MODE_OPTION,
        TYPE_OF_DEAL_STATUS
    } from 'src/framework/const/mod_risk.js';
    import {REFRESH_TIME_VALUE} from 'const/mod_defend.js';
    import {toggleColumns} from './toggle_columns';
    import oprMixin from '../common/mixin/index';
    import threatEventMixin from '../common/mixin/index';
    import tableMixin from 'module/mod-common/table-mixin/index';
    import attackMixin from 'src/module/mod-defend/right/detail/attack/attack-list/attack_mixin';
    import bloackIpMixin from 'module/mod-defend/right/detail/attack/modal/black-list/modal/index.ts';
    import {intervalTaskMixin} from 'module/mod-common/interval-task-mixin/interval_task_mixin';
    import ToolbarCollapse from 'components/common/table/toolbar/toolbar_collapse.vue';
    import RiskLevel from '../common/components/risk-level/index.vue';
    import RiskStatus from '../common/components/risk-status/index.vue';
    import SearchPover from 'src/module/mod-defend/right/detail/attack/attack-list/modal/search_pover.vue';
    import ChartBar from 'components/business/chart-bar/index.vue';
    import TopToolbar from 'module/mod-risk-manage/common/components/top-toolbar/index.vue';
    import ThreatDetail from './detail/index.vue';
    import FooterOperate from 'module/mod-common/risk-manage-common/detail/footer-operate/index.vue';
    import drawerMixin from 'module/mod-common/risk-manage-common/drawer-common/index';
    import HeaderStatistics from '../common/components/table-header-statistics/index.vue';
    import {Tooltip} from 'element-ui';
    import {BTN_SHOW_TYPE, THREAT_EVENT_TYPE} from 'const/mod_risk';
    import get from 'lodash/get';
    import Bus from 'util/bus';

    interface OperationBtn {
        is_judgement_show: number;
        is_misjudgement_show: number;
        is_ignore_show: number;
        is_handling_show: number;
        is_view_show: number;
    }
      @Component({
        components: {
            ToolbarCollapse,
            RiskLevel,
            RiskStatus,
            SearchPover,
            ChartBar,
            TopToolbar,
            ThreatDetail,
            HeaderStatistics,
            ElTooltip: Tooltip,
            FooterOperate
        },
        mixins: [tableMixin, intervalTaskMixin]
    })
    export default class Attack extends Mixins(oprMixin, attackMixin, drawerMixin, threatEventMixin, bloackIpMixin) {
        private FIELD_COUNT_TYPE = FIELD_COUNT_TYPE;
        private SOURCE_MODE_OPTION = SOURCE_MODE_OPTION;
        private SOURCE_MODE = SOURCE_MODE;
        private menuType = MENU_TYPE.riskManagement;
        private activeAssert = 0;
        private toolbarItemLabelWidth = 84;

        private toolbarItemWidth = 260;
        private allThreatType = [];
        private toggleColumns = toggleColumns;
        private autoTime = 0; // 自动刷新时间间隔

        private tableParams = {
            is_threat: 1
        };

        private TYPE_OF_DEAL_STATUS = TYPE_OF_DEAL_STATUS;
        private RISK_STATUS_OPT = RISK_STATUS_OPT;
        private RISK_LEVEL_OPT = RISK_LEVEL_OPT;
        private RISK_STATUS_MAP = RISK_STATUS_MAP;
        private OPR_TYPE = OPR_TYPE;
        private ASSET_TYPE_OPTIONS = ASSET_TYPE_OPTIONS;
        private THREAT_EVENT_TYPE = THREAT_EVENT_TYPE;

        mounted () {
            let vm = this as any;

            Bus.$on('refresh-events', vm.refreshEvent); // 事件触发源在工具条的刷新按钮
            this.loadSummary();
            this.getAllThreatType();
        }
        private getAllThreatType () {
            let vm = this;
            vm.$ajax({
                url: '/order/v1/threat_event/type_list',
                data: {
                    type: 'threat'
                },
                successCallback ({data}) {
                    vm.allThreatType = data;
                }
            });
        }

        // 重写定时任务的参数
        $_intervalTaskMixin_getIntervalTaskOptions (): any {
            let vm = this;
            const INTERVAL = vm.autoTime * 1000; // 5秒轮询一次
            return {
                fn: (next) => {
                    vm.refreshTable(next);
                },
                interval: INTERVAL,
                autoStart: false,
                skipFirst: true
            };
        }

        refreshEvent (time?: any) {
            let vm = this as any;
            vm.$_intervalTaskMixin_stopIntervalTask(); // 刷新前需要停止定时任务
            if (time > 0) { // 时间大于零，为设置定时器刷新时间操作
                vm.autoTime = REFRESH_TIME_VALUE[time];
                vm.$_intervalTaskMixin_createdRefreshTask(); // 需要使用新的时间初始化定时任务
                vm.$_intervalTaskMixin_startIntervalTask(); // 重新启动
            }
        }

        private loadSummary (): void {
            let vm = this as any;
            let params = vm.$_threatEventMixin_getSummaryParams();

            vm.$ajax({
                url: '/order/v1/threat_event/summary',
                data: params,
                successCallback: function ({ data = {} }) {
                    vm.summaryInfo = data as any;
                    vm.formatBasicInfo();
                    vm.initPieChart();
                }
            });
        }
        private formatBasicInfo () {
            let vm = this as any;

            // 基本信息
            vm.basicInfo = [
                {
                    title : RISK_TYPE_TEXT.allRisk,
                    icon: 'weixie',
                    number: vm.summaryInfo.all_event_total
                },
                {
                    title : RISK_TYPE_TEXT.serverRisk,
                    number: vm.summaryInfo.server_event_total
                },
                {
                    title : RISK_TYPE_TEXT.terminalRisk,
                    number: vm.summaryInfo.terminal_event_total
                },
                {
                    title : RISK_TYPE_TEXT.otherRisk,
                    number: vm.summaryInfo.other
                }
            ];
        }

        private initPieChart () {
            let vm = this as any;

            // 为了规范顺序
            let {event_status_count, risk_level_count, type_count} = vm.summaryInfo;
            let pieList = [{
                key: 'event_status_count',
                data: event_status_count,
                instance: null
            }, {
                key: 'risk_level_count',
                data: risk_level_count,
                instance: null
            }, {
                key: 'type_count',
                data: type_count,
                instance: null
            }];

            vm.$_threatEventMixin_initPieList(pieList);
        }

        showEventDetail (row) {
            (this as any).$_threatEventMixin_getDetail(row.event_id);
            this.drawerMixin_showDrawer();
        }

        refreshTable (next?: any): void {
            let vm = this as any;
            vm.$_sfTableMixin_refresh();
            vm.loadSummary();
            if (next) { // 处理轮询
                next();
            }
        }

        lockSuccess () {
            this.refreshTable();
            this.$_threatEventMixin_getDetail(
                (this as any).threatEventMixin_currentOrderId
            );
        }
         get operationBtnItem (): OperationBtn {
            let vm = this as any;

            return vm.threatEventMixin_detailData.operation_btn || {
                is_judgement_show: BTN_SHOW_TYPE.hide,
                is_misjudgement_show: BTN_SHOW_TYPE.hide,
                is_ignore_show: BTN_SHOW_TYPE.hide,
                is_handling_show: BTN_SHOW_TYPE.hide,
                is_view_show: BTN_SHOW_TYPE.hide
            };
        }

        updateEvent () { // 非误报
            this.drawerCommonClick(OPR_TYPE.handing);
        }

        misjudgeClick () { // 误报
            this.drawerCommonClick(OPR_TYPE.misjudgement);
        }

        ignoreClick () { // 忽略
            this.drawerCommonClick(OPR_TYPE.ignored);
        }

        drawerCommonClick (status) {
            let vm = this as any,
                { threatEventMixin_currentOrderId: currentOrderId } = vm,
                tableParams = vm.$_threatEventMixin_getTableParams();

            let next = vm.$_threatEventMixin_nextOrderClick;

            vm.$_threatEventMixin_Opr({
                opr_status: status,
                event_ids: [currentOrderId],
                is_threat: THREAT_EVENT_TYPE.threat,
                ...tableParams
            }, next);
            vm.$_sfTableMixin_refresh();
        }

        $_threatEventMixin_getDetail (id: string) { // ajax获取详情 - 改写
            let vm = this as any,
                drawer = vm.$refs.drawer,
                tableParams = vm.$_threatEventMixin_getTableParams();

            vm.$ajax({
                url: '/order/v1/threat_event/detail',
                data: {
                    ...tableParams,
                    event_id: id,
                    is_threat: THREAT_EVENT_TYPE.threat
                },
                showLoadingDom: get(drawer, '$refs.drawer', null),
                successCallback ({ data }) {
                    vm.$_threatEventMixin_setCurId(id);
                    vm.$_threatEventMixin_setDetailData(data);
                }
            });
        }
          private formatThreatTypes (cascaderValue = []) {
            return {
                type: cascaderValue
            };
        }

        private transUrlItem (item) { // 转换url数据  新加一个region字段提供给内部进行展示悬浮提示
            item.region = item.url;
            return item;
        }

        beforeDestroy () {
            let vm = this as any;
            Bus.$off('refresh-events', vm.refreshEvent);
            vm.$_threatEventMixin_disposePieList();
        }
    }
</script>
