<template>
    <sfPanel :bodyPadding="bodyPadding"
             :panelMarginTop="panelMarginTop"
             class="tab-pannel-brand"
             :style="boxStyle">
        <div slot="title">
            <ul class="nav">
                <li v-for="(item, index) in　finalNavOpt"
                    class="nav-item"
                    :key="index"
                    :class="{active: curActive === index}"
                    @click="changeNav(index, finalNavOpt[index].clickCallback)"
                    :ga-data="item.gaData">{{item.title}}
                    <span v-if="showNumTip(item)"
                          class="nav-tip"
                          :class="{'nav-content__two':getTipLength(item.tip) === TWO_WORDS_LENGTH,
                                   'nav-content__three':getTipLength(item.tip) > TWO_WORDS_LENGTH}">
                          <num-tip :tip-num="item.tip"></num-tip>
                    </span>
                </li>
            </ul>
        </div>
        <slot name="subTitle"
              slot="subTitle"></slot>
        <div slot="content">
            <div v-for="(item, index) in finalNavOpt"
                 :key="index"
                 v-show="curActive === index">
                <!-- _firstRender用来判断是否为第一次加载，
                为防止 tab 选项卡中的内容过多，渲染时卡顿，当点击选项卡去切换内容时，才去加载选项卡相应的内容
                当为 true 表示已经加载过了，则用 v-show 控制显示/隐藏 -->
                <template v-if="item._firstRender">
                    <slot :name="item.bodyName"></slot>
                </template>
            </div>
        </div>
    </sfPanel>
</template>

<script>

    /**
     * @file tab
     * props属性 navOption 传入一个数组：[{
     *      title: 'xxx',
     *      bodyName: 'xxx',
     *      clickCallback () {},
     *      gaData: xxx
     * },{
     *      title: 'xxx',
     *      bodyName: 'xxx',
     *      gaData: xxx
     * }]
     */

    import sfPanel from 'components/common/panel/index.vue';
    import numTip from 'components/common/num-tip/index.vue';
    import Router from 'framework/router/index';
    import Bus from 'util/bus';

    export default {
        data () {
            let vm = this;

            return {
                finalNavOpt: [],
                curActive: vm.activeItem,
                TWO_WORDS_LENGTH: 2
            };
        },
        props: {
            activeItem: {
                type: Number,
                'default': 0
            },
            navOption: {
                type: Array,
                'default': function () {
                    return [{
                        title: '选项一',
                        bodyName: 'option1'
                    }, {
                        title: '选项二',
                        bodyName: 'option2'
                    }];
                }
            },
	        bodyPadding: {
		        type: Number,
		        'default': 20
            },
	        panelMarginTop: {
		        type: Number,
		        'default': 20
            },
	        boxStyle: {
            	type: Object,
                'default' () {
            		return {};
                }
            },
                       activePage: {

                /**
                 * 场景：原来的实现，tab-box嵌套时，因为tab-box会比较激活的tab是哪一项，通过读取的路由的参数名来得到激活tab的索引，
                 * 这个参数名是写死的：activePage
                 * 导致嵌套的子tab-box读取的参数名和父级tab-box一致，于是子tab-box无法匹配到，得不到渲染。
                 *
                 * 解决办法：让原来写死的参数： activePage，变成可配置的，比如父级tab-box用"parent"来存放父级的激活tab名，子级用"child"来存放子级激活的tab名
                 * 兼容tab里面包含子tab的情况，每个tab-box传递的参数会作为该tab-box组件存放激活tab项的名字，
                 * 不同的tab-box配置不同的名字，每个子tab-box就能取到自身激活的tab项，这样每个tab-box就互不影响了.
                 */

                type: String,
                default: 'activePage'
            }
        },
        components: {
            sfPanel,
            numTip
        },
        mounted () {
            let vm = this;
            Bus.$on('set-active-tab', vm.setPageActive);
        },
        watch: {
            navOption: {

                immediate: true,
                deep: true,
                handler (val) {
                    this.finalNavOpt = val;
                    this.setPageActive();
                }
            }
        },
        methods: {
            changeNav (status, callback) {
                let vm = this,
                    currQuery = vm.$route.query,
                    activePage = {};

                // 组件扩展,同步已有的query
                Object.keys(currQuery).map(item => {
                    activePage[item] = currQuery[item];
                });

                vm.$set(vm.finalNavOpt[status], '_firstRender', true);
                activePage[vm.activePage] = vm.finalNavOpt[status].bodyName;
                Router.push({ query: activePage });
                vm.curActive = status;

                vm.$emit('change-nav', { ...vm.finalNavOpt[status] });

	            if ($.isFunction(callback)) {
		            callback();
	            }
            },

            setPageActive () {
                let vm = this,
                    result = vm.$route.query[vm.activePage] || vm.finalNavOpt[0].bodyName;
                vm.finalNavOpt.forEach((item, index) => {
                    if (item.bodyName === result) {
                        vm.$set(item, '_firstRender', true);
                        vm.curActive = index;
                    }
                });
            },

            getTipLength (val) {
                return val.toString().length;
            },
            showNumTip (obj) {
                return obj.hasOwnProperty('tip') && obj.tip > 0;
            }
        },
        destroyed () {
            Bus.$off('set-active-tab', this.setPageActive);
        }
    };
</script>
