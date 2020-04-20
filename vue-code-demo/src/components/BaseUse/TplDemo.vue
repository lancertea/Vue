<template>
    <div>
        <!-- 通过使用 v-once 指令，你也能执行一次性地插值，当数据改变时，插值处的内容不会更新。
        但请留心这会影响到该节点上的其它数据绑定： -->
        <p>文本插值 {{message}}</p>
        <!-- 表达式只能是单个，流控制（if else）也不会生效，流控制可用三元表达式 -->
        <p>JS 表达式 {{ flag ? 'yes' : 'no' }} （只能是表达式，不能是 js 语句）</p>
        
        <!-- 如果v-bind绑定的属性是个布尔属性，如果属性值为null、undefined 或 false，
        则这个属性本身都不会被包含在渲染出来的元素中 -->
        <p :id="dynamicId">属性 id</p>

        <hr/>
        <!-- 双大括号会将数据解释为普通文本，而非 HTML 代码。为了输出真正的 HTML，
        需要使用 v-html 指令： -->
        <p v-html="rawHtml">
            <span>有 xss 风险</span>
            <span>【注意】使用 v-html 之后，将会覆盖子元素</span>
        </p>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: 'hello vue',
            flag: true,
            rawHtml: '指令 - 原始 html <b>加粗</b> <i>斜体</i>',
            dynamicId: `id-${Date.now()}`
        }
    }
}
</script>
