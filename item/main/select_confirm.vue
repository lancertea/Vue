<template>
     <section>
        <sf-form ref="form">
            <sf-form-item>
                <sf-radio-group v-model="selectType" 
                                name="select_type"
                                :options="CHECK_MODE_OPTION">
                </sf-radio-group>
            </sf-form-item>
        </sf-form>
    </section>
</template>

<script lang="ts">

/**
 * 批量审核弹窗
 */

import { Component, Vue } from 'vue-property-decorator';
import { CHECK_MODE, CHECK_MODE_OPTION } from 'src/framework/const/mod_risk.js';

@Component
export default class SelectConfirm extends Vue {
    private CHECK_MODE_OPTION = CHECK_MODE_OPTION;
    private selectType = CHECK_MODE.mistakeVal;

    getValue () {
        let form = this.$refs.form as any;

        if (form && form.isValid()) {
            return {
                ...form.value
            };
        }

    }
}
</script>
