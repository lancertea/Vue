export const ASSET_TAB_TYPE = {
    vul: 'vul',
    weakPwd: 'weakPwd',
    configRisk: 'configRisk'
};

// 脆弱性-漏洞-处置状态
export const VUL_DEAL_STATUS_MAP = {
    0: '待审核',
    1: '待处理',
    2: '已修复',
    3: '已防护',
    4: '已接受风险',
    initedValue: 0,
    handingValue: 1,
    finishedValue: 2,
    protectedValue: 3,
    acceptedValue: 4
};

export const VUL_DEAL_STATUS_OPT = [{
    value: VUL_DEAL_STATUS_MAP.initedValue,
    name: VUL_DEAL_STATUS_MAP[0]
}, {
    value: VUL_DEAL_STATUS_MAP.handingValue,
    name: VUL_DEAL_STATUS_MAP[1]
}, {
    value: VUL_DEAL_STATUS_MAP.finishedValue,
    name: VUL_DEAL_STATUS_MAP[2]
}, {
    value: VUL_DEAL_STATUS_MAP.protectedValue,
    name: VUL_DEAL_STATUS_MAP[3]
}, {
    value: VUL_DEAL_STATUS_MAP.acceptedValue,
    name: VUL_DEAL_STATUS_MAP[4]
}];

// 脆弱性-弱密码-处置状态（=脆弱性-漏洞-处置状态 去掉已防护）
let pritectedValueIndex = VUL_DEAL_STATUS_OPT.findIndex(item => item.value === VUL_DEAL_STATUS_MAP.protectedValue);
let weakPwdDealStatusOpt = cloneDeep(VUL_DEAL_STATUS_OPT);
weakPwdDealStatusOpt.splice(pritectedValueIndex, 1);
export const WEAK_PWD_DEAL_STATUS_OPT = weakPwdDealStatusOpt;

// 脆弱性-配置风险-处置状态（=脆弱性-漏洞-处置状态 其中3个值）
export const CONFIG_RISK_DEAL_STATUS_OPT = [{
    value: VUL_DEAL_STATUS_MAP.handingValue,
    name: VUL_DEAL_STATUS_MAP[1]
}, {
    value: VUL_DEAL_STATUS_MAP.finishedValue,
    name: VUL_DEAL_STATUS_MAP[2]
}, {
    value: VUL_DEAL_STATUS_MAP.acceptedValue,
    name: VUL_DEAL_STATUS_MAP[4]
}];

// 风险类型
export const RISK_TYPE_MAP = {
    loophole: 'loophole',
    loopholeText: '漏洞',
    weakPwd: 'weak_pwd',
    weakPwdText: '弱密码',
    baseline: 'baseline',
    baselineText: '配置风险'
};
export const RISK_TYPE_OPTIONS = [
    { value: RISK_TYPE_MAP.loophole, name: RISK_TYPE_MAP.loopholeText },
    { value: RISK_TYPE_MAP.weakPwd, name: RISK_TYPE_MAP.weakPwdText },
    { value: RISK_TYPE_MAP.baseline, name: RISK_TYPE_MAP.baselineText }
];

/**
 * @description: 资产详情的操作
 * @author: cxs
 * @date: 2020/07/07
 */

import {Component, Vue, Watch} from 'vue-property-decorator';
import { ASSET_TAB_TYPE, ERR_OPR_CODE, VUL_DEAL_STATUS_MAP, RISK_TYPE_MAP} from 'src/framework/const/mod_risk.js';
import SelectConfirm from '../select_confirm.vue';

const OPR_TYPE = {
        acceptRisk: 'acceptRisk',
        hadProtected: 'hadProtected',
        retest: 'retest',
        notMistake: 'notMistake',
        mistake: 'mistake',
        hadDeal: 'hadDeal',
        fix: 'fix'
    },
    VERIFY_RISK_TYPE = {
        notMistake: 1,
        mistake: 2
    },
    SRC_TYPE = {
        mirror: 'mirror',
        SIP: 'SIP'
    };



interface OprParams {
    oprType: string;
    tabType: string;
    ids: string[];
    successCallback?: Function;
    otherParams?: any;
}

@Component
export default class OprMixin extends Vue {

    private multipleSelection = [];

    private ASSET_TAB_TYPE = ASSET_TAB_TYPE;
    private OPR_TYPE = OPR_TYPE;
    private OPR_TEXT = {
        [ASSET_TAB_TYPE.vul]: '漏洞',
        [ASSET_TAB_TYPE.weakPwd]: '弱密码',
        [ASSET_TAB_TYPE.configRisk]: '风险',
        [RISK_TYPE_MAP.loophole]: '漏洞',
        [RISK_TYPE_MAP.weakPwd]: '弱密码',
        [RISK_TYPE_MAP.baseline]: '风险'
    };

    get asset () {
        return this.$route.query.asset || '';
    }

    private dealStatusVal = ''; // 缓存跳转过来指定的处理状态
    private dealStatus: any[] = []; // 给工具栏筛选条件提供默认值（就是通过路由带过来的参数）

    @Watch('$route.path', {
        immediate:true
    })
    loadSyatus () {
        this.dealStatusVal = this.$route.query.dealStatus || '';
        delete this.$route.query.dealStatus; // 使用一次后就删除，放置切换路由还保留带着走

        let isConfigRisk = this.$route.query.activePage === ASSET_TAB_TYPE.configRisk;

        if (this.dealStatusVal) { // 路由跳转带参数打开指定tab
            if (!isConfigRisk) { // 除了配置风险，其余需要指定状态为待审核，待处置
                this.dealStatus = [parseInt(this.dealStatusVal), VUL_DEAL_STATUS_MAP.initedValue]; // 漏洞，弱密码默认状态为两项
            } else {
                this.dealStatus = [parseInt(this.dealStatusVal)]; // 配置风险默认状态为一项
            }
        }
    }

    private $_assertMixin_getTableParams () {
        let $table = this.$refs.table as any;

        if ($table) {
            return $table.getParams();
        }
        return {};
    }

    private $_assertMixin_tableSelectChange (val) {
        this.multipleSelection = val;
    }

    private $_assertMixin_moreOpts (tabType: string) {
        let vm = this,
            hadNotSelect = !vm.multipleSelection.length,
            ids: string[] = vm.multipleSelection.map((item: any) => item._id || item.vul_ids),
            oprBtns: any[] = [],
            oprObj = {
                [OPR_TYPE.acceptRisk]: {
                    text: '批量接受风险',
                    bind: {
                        disabled: hadNotSelect
                    },
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.acceptRisk, tabType, ids });
                        }
                    }
                },
                [OPR_TYPE.hadProtected]: {
                    text: '批量标为已防护',
                    bind: {
                        disabled: hadNotSelect
                    },
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.hadProtected, tabType, ids });
                        }
                    }
                },
                [OPR_TYPE.retest]: {
                    text: '批量复测',
                    bind: {
                        disabled: hadNotSelect
                    },
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.retest, tabType, ids });
                        }
                    }
                },
                [OPR_TYPE.notMistake]: {
                    text: '批量标为非误报',
                    bind: {
                        disabled: hadNotSelect
                    },
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.notMistake, tabType, ids });
                        }
                    }
                },
                [OPR_TYPE.mistake]: {
                    text: '批量标为误报',
                    bind: {
                        disabled: hadNotSelect
                    },
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.mistake, tabType, ids });
                        }
                    }
                },
                [OPR_TYPE.hadDeal]: {
                    text: '批量标为已处置',
                    bind: {
                        disabled: hadNotSelect
                    },
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.hadDeal, tabType, ids });
                        }
                    }
                },
                [OPR_TYPE.fix]: {
                    text: '批量标为已修复',
                    bind: {
                        disabled: hadNotSelect
                    },
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.fix, tabType, ids });
                        }
                    }
                }
            };

        switch (tabType) {
            case ASSET_TAB_TYPE.vul:
                oprBtns = [oprObj.acceptRisk, oprObj.hadProtected, oprObj.retest];
                break;

            case ASSET_TAB_TYPE.weakPwd:
                oprBtns = [oprObj.notMistake, oprObj.mistake, oprObj.acceptRisk, oprObj.retest, oprObj.fix];
                break;

            case ASSET_TAB_TYPE.configRisk:
                oprBtns = [oprObj.hadDeal, oprObj.acceptRisk];
                break;

            default:
                break;
        }

        return oprBtns;
    }

    // todo 修改方法名
    private $_assertMixin_opr (params: OprParams) {
        let {oprType, tabType, ids} = params,
            vm = this,
            num = ids.length,
            title,
            msg,
            oprObjText = vm.OPR_TEXT[tabType];

        switch (oprType) {

            case OPR_TYPE.acceptRisk:
                title = '接受风险';
                msg = num > 1 ? `确定接受已选的${num}个风险吗？` : '确定接受该风险吗？';
                break;

            case OPR_TYPE.hadProtected:
                title = '标为已防护';
                msg = num > 1 ? `确定将已选的${num}个${oprObjText}标为已防护吗？` : `确定将该${oprObjText}标为已防护吗？`;
                break;

            case OPR_TYPE.retest:
                title = '复测';
                msg = num > 1 ? `确定复测已选的${num}个${oprObjText}吗？` : `确定复测该${oprObjText}吗？`;
                break;

            case OPR_TYPE.notMistake:
                title = '标为非误报';
                msg = num > 1 ? `确定将已选的${num}个${oprObjText}标为非误报吗？` : `确定将该${oprObjText}标为非误报吗？`;
                break;

            case OPR_TYPE.mistake:
                title = '标为误报';
                msg = num > 1 ? `确定将已选的${num}个${oprObjText}标为误报吗？` : `确定将该${oprObjText}标为误报吗？`;
                break;

            case OPR_TYPE.fix:
                title = '标为已修复';
                msg = num > 1 ? `确定将已选的${num}个${oprObjText}标为已修复吗？` : `确定将该${oprObjText}标为已修复吗？`;
                break;

            default:
                break;

        }

        vm.$showConfirm({
            title,
            msg,
            callback (dialog) {
                vm.submitAssertAjax(dialog, params);
            }
        });
    }

     private submitAssertAjax (dialog, params: OprParams) {
        let {oprType, ids, successCallback, otherParams = {}} = params,
            vm = this,
            urlObj = {
                [OPR_TYPE.retest]: '/order/v1/vul_manage/retest',
                [OPR_TYPE.acceptRisk]: '/order/v1/vul_manage/accept_risk',
                [OPR_TYPE.notMistake]: '/order/v1/vul_manage/verify_risk',
                [OPR_TYPE.mistake]: '/order/v1/vul_manage/verify_risk',
                [OPR_TYPE.hadDeal]: '/order/v1/vul_manage/deal_risk',
                [OPR_TYPE.hadProtected]: '/order/v1/vul_manage/protect_risk',
                [OPR_TYPE.fix]: '/order/v1/vul_manage/repair_risk'
            },
            data: any = { id_list: ids, ...otherParams };

        // 误判和非误判要了同个接口，要多加个参数来做区分
        if (oprType === OPR_TYPE.mistake) {
            data.verify_type = VERIFY_RISK_TYPE.mistake;
        } else if (oprType === OPR_TYPE.notMistake) {
            data.verify_type = VERIFY_RISK_TYPE.notMistake;
        }

        vm.$ajax({
            url: urlObj[oprType],
            showLoadingDom: dialog.$modalDialog[0],
            data,
            successCallback ({data}) {
                vm.$_ok('操作成功');
                (vm as any).refreshTable();
                dialog.close();
                successCallback && successCallback(data); // 支持组件定义handleRefresh, 处理请求后的刷新
            },
            failCallback ({code}) {
                if (code === ERR_OPR_CODE) {
                    (vm as any).refreshTable();
                    dialog.close();
                }
            }
        });
    }
    
    //批量审核调用方法
    private $_assertMixin_select () {
        let vm = this as any,
            ids: string[] = vm.multipleSelection.map((item: any) => item.vul_ids);

        vm.$showConfirm({
            title: '批量审核',
            msg: '请选择批量审核结果',

            callback (dialog, $button, textareaVal, vNode) {
                let $select = vNode.$refs.selectS;
                if ($select) {
                    let oprType = ($select.getValue() || {}).select_type,
                    params = {oprType, ids};
                    vm.submitAssertAjax(dialog, params);
                }
                    
            },
            vueOptions:{
                template: '<select-confirm ref="selectS"/>',
                components: {
                    SelectConfirm
                }
            }
        });
    }

    //风险视角：根据不同处置状态判断相应 操作
    //该函数只处理不同类待审核，待处理两种状态下的操作，其他均可均通过后端返回字段可直接判断
    /*
    风险类型分为三大类：漏洞、弱密码、配置风险，每类相应操作如下：
    普通漏洞/紧急漏洞
            待审核 审核
            待处理 复测 接受风险 标记已防护
            已修复 - 
            已防护 -
            已接受风险  -

    弱密码（分来源）
        云镜
            待审核 审核
            待处理   复测 接受风险
            已修复 - 
            已接受风险  -

         SIP 
            待审核   非误报 误报 接受风险
            待处理  标为已修复   接受风险
            已修复 - 
            已接受风险  -

    配置风险
            待处理 标为已处置 接受风险
            已修复 - 
            已接受风险  -
    */
     private $_riskMixin_moreOpts (tabType, dealStatus, ids, srcType) {
        let vm = this,
            oprlists: any[] = [],
            oprObj = {
                [OPR_TYPE.acceptRisk]: {
                    text: '接受风险',
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.acceptRisk, tabType, ids });
                        }
                    }
                },
                [OPR_TYPE.hadProtected]: {
                    text: '标记已防护',
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.hadProtected, tabType, ids });
                        }
                    }
                },
                [OPR_TYPE.retest]: {
                    text: '复测',
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.retest, tabType, ids });
                        }
                    }
                },
                [OPR_TYPE.notMistake]: {
                    text: '非误报',
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.notMistake, tabType, ids });
                        }
                    }
                },
                [OPR_TYPE.mistake]: {
                    text: '误报',
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.mistake, tabType, ids });
                        }
                    }
                },
                [OPR_TYPE.hadDeal]: {
                    text: '标为已处置',
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.hadDeal, tabType, ids });
                        }
                    }
                },
                [OPR_TYPE.fix]: {
                    text: '标为已修复',
                    on: {
                        click () {
                            vm.$_assertMixin_opr({ oprType: OPR_TYPE.fix, tabType, ids });
                        }
                    }
                }
            };
            switch (tabType) {
                case RISK_TYPE_MAP.loophole:
                    switch (dealStatus) {
                        case VUL_DEAL_STATUS_MAP.handingValue:
                            oprlists = [oprObj.retest, oprObj.acceptRisk, oprObj.hadProtected];
                            break;

                        default:
                            break;
                    }
                    break;
                    
                case RISK_TYPE_MAP.weakPwd:
                    switch (srcType) {
                        case SRC_TYPE.mirror:
                            switch (dealStatus) {
                                case VUL_DEAL_STATUS_MAP.handingValue:
                                    oprlists = [oprObj.retest, oprObj.acceptRisk];
                                    break;
                                
                                default:
                                    break;
                            }
                            break;

                        case SRC_TYPE.SIP:
                            switch (dealStatus) {
                                case VUL_DEAL_STATUS_MAP.initedValue:
                                    oprlists = [oprObj.notMistake, oprObj.mistake, oprObj.acceptRisk];
                                    break;

                                case VUL_DEAL_STATUS_MAP.handingValue:
                                    oprlists = [oprObj.fix, oprObj.acceptRisk];
                                    break;
                                
                                default:
                                    break;
                            }
                            break;
                        
                           default:
                            break;
                        
                    }
                    break;
                    
                case RISK_TYPE_MAP.baseline:
                    switch (dealStatus) {
                        case VUL_DEAL_STATUS_MAP.handingValue:
                            oprlists = [oprObj.hadDeal, oprObj.acceptRisk];
                            break;
                        
                        default:
                            break;
                    }
                    break;
    
                default:
                    break;
            }

            return oprlists;

    }




}
