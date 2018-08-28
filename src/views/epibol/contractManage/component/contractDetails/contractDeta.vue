<template>
    <div class="contractDeta">
        <!-- 合同列表 -->
        <div class="contractList">
            <p v-for="(item,index) in filesData">
                <img :src="item.file_url" :class="[nIndex==index?'showImg':'']" @click="showIMG(index)"/>
                第 {{index+1}} 页
            </p>
        </div>
        <!-- 合同 -->
        <div class="contract">
            <img :src="Csrc" />
        </div>
        <!-- //END -->
        <div class="clear"></div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            filesData:Array,
            Csrc:"",
            nIndex:0
        }
    },
    mounted(){
        this.autoH();
    },
    methods:{
         autoH(){
             let H=document.documentElement.clientHeight;
             document.getElementsByClassName('contractList')[0].style.height=H-250+'px';
             document.getElementsByClassName('contract')[0].style.height=H-250+'px';
         },
         // 组件数据
         moduleData(data){
             this.filesData=data;
             this.Csrc=data[0].file_url;
         },
         showIMG(index){
            this.nIndex=index;
            this.Csrc=this.filesData[index].file_url;
         }
    }
}
</script>
