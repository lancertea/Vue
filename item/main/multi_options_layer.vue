<template>
    <section class="sf-table-multi-options">
        <el-popover
                placement="bottom"
                :width="multiLayerWidth"
                trigger="click">
            <div slot="reference"
                 class="sf-table-multi-options__btn"
                 :style="btnStyle"
                 ref="multiBtn">
                <svg class="icon" aria-hidden="true" :style="{width: this.btnWidth}">
                    <use xlink:href="#icon-gengduo"></use>
                </svg>
            </div>
            <el-checkbox-group v-model="checkList"
                               @change="_handleChange"
                               class="sf-table-multi-options__checkbox-group">
                <el-checkbox v-for="(item , idx) in toggleColumns"
                             :key="idx"
                             :checked="item.checked"
                             class="sf-table-multi-options__checkbox"
                             :label="item.prop">{{item.name}}</el-checkbox>
            </el-checkbox-group>
        </el-popover>
    </section>
</template>

<script>
    import { CheckboxGroup, Checkbox, Popover } from 'element-ui';

    export default {
        name: 'MultiOptionsLayer',
        props: {
            multiLayerWidth: {
                type: [Number, String],
                default: 130
            },
            toggleColumns: {
                type: Array,
                default: () => []
            }
        },
        components: {
            ElPopover: Popover,
            ElCheckboxGroup: CheckboxGroup,
            ElCheckbox: Checkbox
        },
        data () {
            return {
                checkList: [],
                btnWidth: '40px',
                btnHeight: '40px'
            };
        },

        computed: {
            btnStyle () {
                return {
                    marginLeft: `-${this.btnWidth}`,
                    height: this.btnHeight
                };
            }
        },

        mounted () {
            this._appendToTableHeader();
        },

        methods: {
            _handleChange (val) {
                this.$emit('on-change', val);
            },
            _appendToTableHeader () {
                let $parent = this.$parent,
                    $multiBtn = this.$refs.multiBtn,
                    $table = $parent.$children.filter(item => item.hasOwnProperty('tableId'))[0],
                    $tableHeader = $table.$refs.headerWrapper;

                if (!$tableHeader || !$multiBtn) {
                    return;
                }

                $tableHeader.appendChild($multiBtn);
            }
        }
    };
</script>

<style scoped lang="less">
    .sf-table-multi-options__btn {
        position: absolute;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #ddd;
        cursor: pointer;
        font-size: 16px;
        z-index: 200;
    }
    .sf-table-multi-options__checkbox-group {
        display: flex;
        flex-direction: column;
    }
    .sf-table-multi-options__checkbox {
        margin-left: 0;
        margin-right: 0;
        &:last-child {
            margin-bottom: 0;
        }
    }
</style>
