<template>
  <div>
    <Select :dataList="dplist" labelProperty="city" @change="onDpChange($event)"></Select>
    <p>其他文本内容</p>
  </div>
</template>
<script>
  import Select from 'select.vue'
  //其他代码略
</script>