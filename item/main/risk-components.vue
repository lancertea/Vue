<template>
    <sf-panel :panel-margin-top="0"
            :body-padding="0"
            :no-header="true">
        <section slot="content">

            <!-- 顶部操作栏 -->
            <top-toolbar ref="topToolbar" :type="menuType" :view="viewType" @refresh-table="refreshTable" />

            <sfsaas-alert v-if="TASK_SCAN_STATUS_MAP[taskStatus]"
                          ref="scanTaskTip"
                          :title="TASK_SCAN_STATUS_MAP[taskStatus].title"
                          :center="false"
                          :closable="TASK_SCAN_STATUS_MAP[taskStatus].closable"
                          :opr-text="TASK_SCAN_STATUS_MAP[taskStatus].btnName"
                          :show-default-opr="taskStatus !== TASK_SCAN_STATUS.success"
                          :class="`scan-task-tip--${TASK_SCAN_STATUS_MAP[taskStatus].cls}`"
                          @opr-click="operate()"
                          @close="closeAlert()">
                <i slot="icon" class="iconfont" :class="TASK_SCAN_STATUS_MAP[taskStatus].icon"></i>
            </sfsaas-alert>

            <!-- 表格 -->
            <sf-table ref="table"
                      api="/order/v1/vul_manage/risk/list"
                      :row-key="_setRowKey"
                      @selection-change="$_assertMixin_tableSelectChange">
                <sf-toolbar slot="toolbar"
                            @toolbar-change="loadSummary">
                    <toolbar-collapse ref="filterWarp"
                                      default-collapse
                                      :default-line-height="44">
                        <sf-toolbar-radio-group label="资产类型"
                                                class="filter__asset-type"
                                                param-key="asset_type"
                                                :default="ASSET_TYPE_OPTIONS[0].value"
                                                :options="ASSET_TYPE_OPTIONS"
                                                :label-width="toolbarItemLabelWidth"
                                                :width="toolbarItemWidth"/>
                        <sf-toolbar-radio-group label="脆弱性类型"
                                                class="filter__week-type"
                                                param-key="type"
                                                :default="WEEK_TYPE_OPTIONS[0].value"
                                                :options="WEEK_TYPE_OPTIONS"
                                                :label-width="toolbarItemLabelWidth"
                                                :width="toolbarItemWidth"/>
                        <sf-toolbar-select label="处置状态"
                                           param-key="deal_status"
                                           multiple
                                           clearable
                                           collapse-tags
                                           :default="dealStatus"
                                           :options="ASSERT_DEAL_STATUS_OPT"
                                           :label-width="toolbarItemLabelWidth"
                                           :width="toolbarItemWidth"></sf-toolbar-select>
                        <sf-toolbar-select label="脆弱性等级"
                                           param-key="risk_level"
                                           multiple
                                           clearable
                                           collapse-tags
                                           :default="[]"
                                           :options="THREAT_LEVEL_OPT"
                                           :label-width="toolbarItemLabelWidth"
                                           :width="toolbarItemWidth" />
                          <sf-toolbar-search label="脆弱性名称"
                                           param-key="name"
                                           placeholder="脆弱性名称"
                                           default=""
                                           :label-width="toolbarItemLabelWidth"
                                           :width="toolbarItemWidth"/>
                        <sf-toolbar-date-picker label="首次发现时间"
                                                param-key="found_time_range"
                                                type="daterange"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期"
                                                value-format="timestamp"
                                                :default="[]"
                                                :more-param="false"
                                                :readonly="false"
                                                :editable="false"
                                                :label-width="toolbarItemLabelWidth"
                                                :width="toolbarItemWidth"></sf-toolbar-date-picker>
                        <sf-toolbar-date-picker label="最近发现时间"
                                                param-key="latest_time_range"
                                                type="daterange"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期"
                                                value-format="timestamp"
                                                :default="[]"
                                                :more-param="false"
                                                :readonly="false"
                                                :editable="false"
                                                :label-width="toolbarItemLabelWidth"
                                                :width="toolbarItemWidth"></sf-toolbar-date-picker>
                        <sf-toolbar-search label="更多搜索"
                                           param-key="keyword"
                                           placeholder="IP/资产负责人"
                                           default=""
                                           :label-width="toolbarItemLabelWidth"
                                           :width="toolbarItemWidth"/>
                    </toolbar-collapse>

                    <sf-toolbar-filter-result :filter-warp="$refs.filterWarp"></sf-toolbar-filter-result>

                    <!-- 图表栏 -->
                    <chart-bar title="数据统计" :basic-info="basicInfo" :pie-list="pieList" :menu-type="menuType" />

                    <sfsaas-button icon-cls="icon-start-audit"
                               :default-disabled="!multipleSelection.length"
                               @click="$_assertMixin_select()">
                        批量审核
                    </sfsaas-button>
                    <sf-table-more-operation :limit="1" :buttons="$_assertMixin_moreOpts(ASSET_TAB_TYPE.vul)">
                        <sfsaas-button slot="more">
                            <svg class="icon svg-icon more-icon" aria-hidden="true">
                                <use xlink:href="#icon-gengduo"></use>
                            </svg>
                            更多操作
                        </sfsaas-button>
                    </sf-table-more-operation>
                </sf-toolbar>
                              <sf-table-column type="selection"
                                 reserve-selection
                                 width="40">
                </sf-table-column>

                <sf-table-column label="序号"
                                 align="center"
                                 width="40"
                                 prop="index">
                </sf-table-column>

                <sf-table-column label="脆弱性名称"
                                 prop="name">
                    <template slot-scope="{ row }">
                        <p class="common-ellipsis sim-link" @click="showRiskDetail(row)">
                            {{ row.name }}
                        </p>
                    </template>
                </sf-table-column>

                <sf-table-column label="脆弱性类型"
                                 prop="type">
                    <template slot-scope="{ row }">
                        <week-type :type="row.type" />
                    </template>
                </sf-table-column>

                <sf-table-column label="IP"
                                 width="150"
                                 prop="ip">
                    <template slot-scope="{ row }">
                        <template v-if="row.asset || row.host_name">
                            <p class="common-ellipsis cursor-pointer"
                            :style="`color: ${RISK_LEVEL_COLOR_MAP[row.risk_level]}`"
                            @click="go2detail(row)">
                                {{ row.asset }}
                            </p>
                            <p class="common-ellipsis"
                            v-if="row.host_name">
                                {{ row.host_name }}
                            </p>
                        </template>
                        <span v-else>-</span>
                    </template>
                </sf-table-column>
                               <sf-table-column label="来源"
                                 width="80"
                                 prop="src_type">
                    <template slot-scope="{ row }">
                        <p>{{ SRC_TYPE[row.src_type] }}</p>
                    </template>
                </sf-table-column>

                <sf-table-column label="脆弱性等级"
                                 width="80"
                                 prop="level">
                </sf-table-column>

                <sf-table-column label="资产类型"
                                 width="70"
                                 prop="asset_type">
                </sf-table-column>

                <sf-table-column label="资产负责人"
                                 :formatter="formatterManager"
                                 prop="manager"></sf-table-column>

                <sf-table-column label="首次发现时间"
                                 width="160"
                                 prop="found_time"></sf-table-column>

                <sf-table-column label="最近发现时间"
                                 width="160"
                                 prop="last_time"></sf-table-column>


                <sf-table-column label="脆弱性数量"
                                 prop="count">
                </sf-table-column>

                <sf-table-column label="处置状态"
                                 prop="deal_status">
                    <template slot-scope="{ row }">
                        <risk-status :status="row.deal_status"
                                     :num="row.deal_status ? row.undisposed : row.unverify"
                                     :type="TYPE_OF_DEAL_STATUS.fragile" />
                    </template>
                </sf-table-column>
                              <sf-table-column label="操作">
                    <template slot-scope="{ row }">
                        <span v-if="!row.can_retest" class="retesting-text">
                                复测中<span class="dot-animation"></span>
                        </span>
                        <template v-else>
                            <!-- 待审核状态下 :漏洞、来源为云镜的弱密码有审核操作 -->
                            <el-button v-if="isInited (row.deal_status) && !isBaseline (row.type) && !isSIP(row.src_type)"
                                           type="text"
                                           size="small"
                                           @click="showEventDetail(row)">
                                    审核
                            </el-button>
                            <span v-else-if="row.deal_status === VUL_DEAL_STATUS_MAP.protectedValue ||
                                        row.deal_status === VUL_DEAL_STATUS_MAP.finishedValue ||
                                        row.deal_status === VUL_DEAL_STATUS_MAP.acceptedValue">
                                        -
                            </span>
                            <sf-table-more-operation v-else :limit="3"
                            :buttons="$_riskMixin_moreOpts (row.data_type, row.deal_status, row.vul_ids, row.src_type)">
                                <sfsaas-button>
                                </sfsaas-button>
                            </sf-table-more-operation>
                        </template>
                    </template>
                </sf-table-column>

                <!-- 分页条 -->
                <sf-pagination slot="pagination"></sf-pagination>
            </sf-table>

            <!--详情-->
            <sfsaas-drawer :visible.sync="drawerMixin_drawerState"
                           :mask="false"
                           class="detail-drawer"
                           ref="drawer"
                           :title="drawerTitle"
                           size="50%"
                           :z-index="1010">
                <component :is="drawerComp"
                           :data="detailHandleMixin_detailData"
                            ref="detailDrawer"
                            @refreshTable="refreshTable"
                            v-if="drawerMixin_drawerState"
                            :params="currentParams"/>
                                           <footer-operate slot="footer">
                    <template slot="left">
                        <sfsaas-button-primary v-if="operationBtnItem.is_retest_show"
                                               :default-disabled="isDisabled(operationBtnItem.is_retest_show)"
                                               @click="tableOpr(OPR_TYPE.retest, currentRow.vul_ids, () => showEventDetail(currentRow))">
                            {{retestText}}
                        </sfsaas-button-primary>
                        <sfsaas-button v-if="operationBtnItem.is_fix_show"
                                       :default-disabled="isDisabled(operationBtnItem.is_fix_show)"
                                       @click="tableOpr(OPR_TYPE.fix, currentRow.vul_ids, () => showEventDetail(currentRow))">
                            标为已修复
                        </sfsaas-button>
                        <sfsaas-button v-if="operationBtnItem.is_handling_show"
                                       :default-disabled="isDisabled(operationBtnItem.is_handling_show)"
                                       @click="tableOpr(OPR_TYPE.hadDeal, currentRow.vul_ids, () => showEventDetail(currentRow))">
                            标为已处置
                        </sfsaas-button>
                        <sfsaas-button v-if="operationBtnItem.is_receive_show"
                                       :default-disabled="isDisabled(operationBtnItem.is_receive_show)"
                                       @click="tableOpr(OPR_TYPE.acceptRisk, currentRow.vul_ids, () => showEventDetail(currentRow))">
                            接受风险
                        </sfsaas-button>
                        <sfsaas-button v-if="operationBtnItem.is_protect_show"
                                       :default-disabled="isDisabled(operationBtnItem.is_protect_show)"
                                       @click="tableOpr(OPR_TYPE.hadProtected, currentRow.vul_ids, () => showEventDetail(currentRow))">
                            标记已防护
                        </sfsaas-button>
                    </template>
                </footer-operate>
            </sfsaas-drawer>

        </section>
    </sf-panel>
</template>

<script lang="ts">
    /**
     * 脆弱性管理
     */

    import {Component, Mixins} from 'vue-property-decorator';
    import FooterOperate from 'module/mod-common/risk-manage-common/detail/footer-operate/index.vue';
    import {MWR_COMPANY_ID} from 'const/text';
    import {
        ASSERT_DEAL_STATUS_OPT,
        ASSET_TAB_TYPE,
        ASSET_TYPE_MAP,
        ASSET_TYPE_OPTIONS,
        BTN_SHOW_TYPE,
        EVENT_SUMMARY_VIEW_TYPE,
        FRAGILE_TYPE_TEXT,
        MENU_TYPE,
        RISK_LEVEL_COLOR_MAP,
        RISK_LEVEL_MAP,
        RISK_TYPE_MAP,
        RISK_TYPE_OPTIONS,
        SRC_TYPE,
        TASK_SCAN_STATUS,
        TASK_SCAN_STATUS_MAP,
        THREAT_LEVEL_OPT,
        TYPE_OF_DEAL_STATUS,
        VUL_DEAL_STATUS_MAP,
        WEEK_TYPE_OPTIONS
    } from 'src/framework/const/mod_risk.js';
    import ToolbarCollapse from 'components/common/table/toolbar/toolbar_collapse.vue';
    import RiskLevel from '../../common/components/risk-level/index.vue';
    import RiskStatus from '../../common/components/risk-status/index.vue';
    import WeekType from '../../common/components/week-type/index.vue';
    import threatEventMixin from '../../common/mixin/index';
    import tableMixin from 'module/mod-common/table-mixin/index';
    import drawerMixin from 'module/mod-common/risk-manage-common/drawer-common/index';
    import detailHandleMixin from 'module/mod-risk-manage/common/mixin/detail_handle';
    import logMixin from 'module/mod-defend/right/detail/attack/log_mixin.ts';
    import oprMixin from 'module/mod-risk-manage/fragile-manage/assert-detail/mixin/opr_mixin.ts';
    import get from 'lodash/get';
    import VulDrawer from 'module/mod-risk-manage/fragile-manage/assert-detail/detail-drawer/vul_drawer.vue';
    import BaselineDrawer from 'module/mod-risk-manage/fragile-manage/assert-detail/detail-drawer/baseline_drawer.vue';
    import PwdDrawer from 'module/mod-risk-manage/fragile-manage/assert-detail/detail-drawer/pwd_drawer.vue';
  @Component({
        components: {
            ToolbarCollapse,
            RiskLevel,
            RiskStatus,
            WeekType,
            FooterOperate
        },
        mixins: [tableMixin]
    })

    export default class Risk extends Mixins(threatEventMixin, drawerMixin, detailHandleMixin, logMixin, oprMixin) {
        private menuType = MENU_TYPE.fragileManagement;
        private viewType = EVENT_SUMMARY_VIEW_TYPE.risk;

        private activeAssert = 0;
        private taskStatus = 0;
        private toolbarItemLabelWidth = 84;
        private toolbarItemWidth = 260;
        private currentParams = {}; // 当前参数

        private ASSERT_DEAL_STATUS_OPT = ASSERT_DEAL_STATUS_OPT;
        private THREAT_LEVEL_OPT = THREAT_LEVEL_OPT;
        private ASSET_TYPE_OPTIONS = ASSET_TYPE_OPTIONS;
        private WEEK_TYPE_OPTIONS = WEEK_TYPE_OPTIONS;
        private ASSET_TYPE_MAP = ASSET_TYPE_MAP;
        private RISK_LEVEL_COLOR_MAP = RISK_LEVEL_COLOR_MAP;
        private RISK_LEVEL_MAP = RISK_LEVEL_MAP;
        private ASSET_TAB_TYPE = ASSET_TAB_TYPE;
        private VUL_DEAL_STATUS_MAP = VUL_DEAL_STATUS_MAP;
        private TASK_SCAN_STATUS_MAP = TASK_SCAN_STATUS_MAP;
        private TASK_SCAN_STATUS = TASK_SCAN_STATUS;
        private RISK_TYPE_OPTIONS = RISK_TYPE_OPTIONS;
        private RISK_TYPE_MAP = RISK_TYPE_MAP;
        private TYPE_OF_DEAL_STATUS = TYPE_OF_DEAL_STATUS;
        private SRC_TYPE = SRC_TYPE;

        private currentRow = {}; // 当前行数据

        mounted () {
            this.loadTaskStatus();
            this.loadSummary();
        }
           get drawerComp () {
            let vm = this,
                comp = null;
            switch (vm.currentRow.type) {

                case RISK_TYPE_MAP.weakPwd:
                    comp = PwdDrawer;
                    break;

                case RISK_TYPE_MAP.baseline:
                    comp = BaselineDrawer;
                    break;

                default:
                    comp = VulDrawer; // 默认是漏洞详情
                    break;
            }
            return comp;
        }

        get drawerTitle () {
            let vm = this,
                text = '';
            switch (vm.currentRow.type) {

                case RISK_TYPE_MAP.weakPwd:
                    text = '弱密码风险详情';
                    break;

                case RISK_TYPE_MAP.baseline:
                    text = '配置风险详情';
                    break;

                default:
                    text = '漏洞风险详情';
                    break;
            }
            return text;
        }

        /* 抽屉详情 */
        get operationBtnItem () {
            let vm = this as any;

            return vm.detailHandleMixin_detailData.operation_btn || {
                is_retest_show: BTN_SHOW_TYPE.hide,
                is_handling_show: BTN_SHOW_TYPE.hide,
                is_protect_show: BTN_SHOW_TYPE.hide,
                is_receive_show: BTN_SHOW_TYPE.hide,
                is_fix_show: BTN_SHOW_TYPE.hide
            };
        }

        get retestText () {
            let {is_retest_show: status} = this.operationBtnItem as any;

            return {
                [BTN_SHOW_TYPE.show]: '复测',
                [BTN_SHOW_TYPE.disabled]: '复测中...'
            }[status];
        }

        private detailHandleMixin_getDetail (id, params = {}) { // 改写获取详情信息
            this.currentParams = params;
            this.getHoleDetailCommon(id, params);
        }

        private tableOpr (oprType, id, successCallback?: Function) {
            this.$_assertMixin_opr({ oprType, tabType: ASSET_TAB_TYPE.vul, ids: [id], successCallback });
        }
        private getHoleDetailCommon (id, params) { // 获取公共信息
            let vm = this,
                url = params.type === RISK_TYPE_MAP.baseline ?
                '/order/v1/vul_manage/asset_baseline_detail' :
                '/order/v1/vul_manage/asset_hole_detail?info=common';

            vm.$ajax({
                url,
                showLoadingDom: get(vm, '$refs.detailDrawer.$el', null),
                data: params,
                successCallback ({data}) {
                    vm.detailHandleMixin_setCurId(id);
                    vm.detailHandleMixin_setDetailData(data);
                }
            });
        }

        isDisabled (status) {
            return status === BTN_SHOW_TYPE.disabled;
        }

        //处置状态是否为待审核
        isInited (status) {
            return status === VUL_DEAL_STATUS_MAP.initedValue;
        }

        //来源是否为SIP
        isSIP (type) {
            return type === 'SIP';
        }

        //判断类型是否为配置风险
        isBaseline (type) {
            return type === RISK_TYPE_MAP.baseline;
        }

        private showEventDetail (row = {}) {
            this.currentRow = row;

            this.detailHandleMixin_reqOrderInfo(row.asset_id, {
                id: row.id
            });
            this.drawerMixin_showDrawer();
        }

        private loadDetailSummary (): void {
            let vm = this as any;
            let params = vm.$_threatEventMixin_getSummaryParams();

            vm.$ajax({
                url: '/order/v1/vul_manage/asset_vul',
                data: params,
                successCallback: function ({ data = {} }) {
                    vm.summaryInfo = data as any;
                    vm.formatBasicInfo();
                    vm.initPieChart();
                }
            });
        }
          refreshDetailTable (): void {
            let vm = this as any;
            vm.$_sfTableMixin_refresh();
            vm.loadDetailSummary();
        }

        /* 详情 - end */

        private loadSummary (): void {
            let vm = this as any;
            let params = vm.$_threatEventMixin_getSummaryParams();

            vm.$ajax({
                url: '/order/v1/vul_manage/risk/overview',
                data: params,
                successCallback: function ({ data = {} }) {
                    vm.summaryInfo = data as any;
                    vm.formatBasicInfo();
                    vm.initPieChart();
                }
            });
        }

        private loadTaskStatus (): void {
            let vm = this as any;

            vm.$ajax({
                method: 'get',
                url: '/order/v1/vul_manage/task/status',
                successCallback: function ({ data = {} }) {
                    vm.taskStatus = (data as any).status;
                }
            });
        }

        private formatBasicInfo () {
            let vm = this as any;

            // 基本信息
            vm.basicInfo = [
                {
                    title : FRAGILE_TYPE_TEXT.riskAllFragile,
                    icon: 'backups',
                    number: vm.summaryInfo.asset_count.asset_sum
                },
                {
                    title : FRAGILE_TYPE_TEXT.serverFragile,
                    number: vm.summaryInfo.asset_count.service_count
                },
                {
                    title : FRAGILE_TYPE_TEXT.terminalFragile,
                    number: vm.summaryInfo.asset_count.terminal_count
                },
                {
                    title : FRAGILE_TYPE_TEXT.otherFragile,
                    number: vm.summaryInfo.asset_count.other_count
                }
            ];

        }
          private initPieChart () {
            let vm = this as any;

            // 为了规范顺序
            let {status_count, level_count, type_count} = vm.summaryInfo;
            let pieList = [{
                key: 'status_count',
                data: status_count,
                instance: null
            }, {
                key: 'level_count',
                data: level_count,
                instance: null
            }, {
                key: 'type_count',
                data: type_count,
                instance: null
            }];

            vm.$_threatEventMixin_initPieList(pieList);
        }

        refreshTable (): void {
            let vm = this as any;
            vm.$_sfTableMixin_refresh();
            vm.loadSummary();
        }

        private go2detail (row, activePage, dealStatus) {
            this.$router.push({
                path: '/home/fragile',
                query: {
                    asset: row.asset,
                    activePage: activePage,
                    dealStatus
                }
            });
        }

        private showRiskDetail (row = {}) {
            this.currentRow = row;


            this.detailHandleMixin_reqOrderInfo(row.asset_id, {
                id: row.id,
                type: row.type
            });
            this.drawerMixin_showDrawer();
        }

        private operate () {
            let vm = this as any;

            // 正在评估跳转
            if (vm.taskStatus === TASK_SCAN_STATUS.analysing) {
                vm.go2Evaluation();
            } else if (vm.taskStatus === TASK_SCAN_STATUS.failed) {
                vm.closeScanTaskTip();
                vm.go2Evaluation(vm.taskStatus); // 失败情况下传个status过去筛选
            } else {
                vm.closeScanTaskTip();
            }
        }
         private closeAlert () {
            let vm = this as any;

            if ([TASK_SCAN_STATUS.failed, TASK_SCAN_STATUS.success].includes(vm.taskStatus)) {
                vm.resetTaskStatus();
            }
        }

        // 跳转到评价管理页面
        private go2Evaluation (status): void {
            let vm = this as any;

            let routerURL = vm.$router.resolve({
                path: '/customer/tss-allocation/evaluation',
                query: {
                    company_id: MWR_COMPANY_ID,
                    status
                }
            });
            window.open(routerURL.href, '_blank');

        }

        private formatterManager (row) {
            return row.manager || '暂无';
        }

        // 关闭扫描任务提示条
        private closeScanTaskTip (): void {
            let vm = this as any;
            let $scanTaskTip = vm.$refs.scanTaskTip;
            if ($scanTaskTip) {
                $scanTaskTip.closeAlert();
            }
            vm.resetTaskStatus();
        }

        private resetTaskStatus (): void {
            let vm = this as any;

            // 重置任务状态 以 下次不再打开提示条
            vm.$ajax({
                method: 'post',
                url: '/order/v1/vul_manage/task/status'
            });
        }

        private _setRowKey (row) {
            return row.id;
        }
    }
</script>
