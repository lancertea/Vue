<template>
  <div>
    <p :class="{ black: isBlack, yellow: isYellow }">使用 class</p>
    <p :class="[black, yellow]">使用 class （数组）</p>
    <!-- 绑定内联样式 v-bind:style
    语法十分直观——看着非常像 CSS，但其实是一个 JavaScript 对象
    下面这个等同于：
    <p v-bind:style="{fontSize:40px,color:red,backgroundColor:#ccc}">使用 style</p> -->
    <p :style="styleData">使用 style</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isBlack: true,
      isYellow: true,

      black: "black",
      yellow: "yellow",

      styleData: {
        fontSize: "40px", // 转换为驼峰式
        color: "red",
        backgroundColor: "#ccc" // 转换为驼峰式
      }
    };
  }
};
</script>

<style scoped>
.black {
  background-color: #999;
}
.yellow {
  color: yellow;
}
</style>