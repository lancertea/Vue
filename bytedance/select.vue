<template>
    <div  @mouseover="onDplOver($event)" @mouseout="onDplOut($event)">
        <span>{{dplLable}}<i></i></span>
        <ul v-dpl>
            <li v-for="(item, index) in dataList" :key="index" @click="onLiClick(index, $event)">{{item[labelProperty]}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    data(){
        return {
            activeIndex:0
        }
    },
    props:{
        dataList:{
            type:Array,
            default(){
                return [
                    {name: "选项一"},
                    {name: "选项二"}
                ]
            }
        },
        labelProperty:{
            type:String,
            default(){ return "name" }
        }
    },
    directives:{
        dpl:{
            bind(el){
                el.style.display = "none";
            }
        }
    },
    methods:{
        onDplOver(event){
            let ul = event.currentTarget.childNodes[1];
            ul.style.display = "block";
        },
        onDplOut(event){
            let ul = event.currentTarget.childNodes[1];
            ul.style.display = "none";
        },
        onLiClick(index){
            let path = event.path || (event.composedPath && event.composedPath()) //兼容火狐和safari
            path[1].style.display = "none";
            this.activeIndex = index;
            this.$emit("change", {
                index:index,
                value:this.dataList[index]
            })
        }
    },
    computed:{
        dplLable(){
            return this.dataList[this.activeIndex][this.labelProperty]
        }
    }
}
</script>
<style>
    
</style>