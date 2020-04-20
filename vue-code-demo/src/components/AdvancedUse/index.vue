<template>
  <div>
    <p>vue 高级特性</p>
    <hr />

    <!-- 自定义 v-model -->
    <p>{{name}}</p>
    <!-- <input v-model="name"/> -->
    <CustomVModel v-model="name"/> 

    <!-- nextTick -->
    <!-- <NextTick/> -->

    <!-- slot -->
    <!-- <SlotDemo :url="website.url">
            {{website.title}}
    </SlotDemo>-->
    <!-- <ScopedSlotDemo :url="website.url">
      <template v-slot="slotProps">{{slotProps.slotData.title}}</template>
    </ScopedSlotDemo> -->

    <!-- 动态组件 -->
    <!-- <component :is="NextTickName"/> -->
    <!-- <div v-for="(val,key) in newsData" :key="key">
      <component :is="val.type" />
    </div> -->

    <!-- 异步组件 -->
    <!-- <FormDemo v-if="showFormDemo"/>
    <button @click="showFormDemo = true">show form demo</button> -->

    <!-- keep-alive -->
    <!-- <KeepAlive/> -->

    <!-- mixin -->
    <!-- <MixinDemo/> -->
  </div>
</template>

<script>
//同步引入
import CustomVModel from './CustomVModel'
// import NextTick from './NextTick'
// import SlotDemo from './SlotDemo'
// import ScopedSlotDemo from "./ScopedSlotDemo";
// import KeepAlive from './KeepAlive'
// import MixinDemo from './MixinDemo'

export default {
  components: {
    CustomVModel
    // NextTick
    // SlotDemo,
    // ScopedSlotDemo,
    //异步引入
    // FormDemo: () => import('../BaseUse/FormDemo'),
    // KeepAlive
    // MixinDemo
  },
  data() {
    return {
      name: "双越",
      website: {
        url: "http://imooc.com/",
        title: "imooc",
        subTitle: "程序员的梦工厂"
      },
      // NextTickName: "NextTick",
      showFormDemo: false,
      newsData: {
        1: { type: "text" },
        2: { type: "text" },
        3: { type: "img" }
      }
    };
  }
};
</script>