<template>
    <div class="newContractData autoHeight">
        <div class="confirContract">
            <!-- 合同预览 -->
            <div class="lookContract">
                    <div class="contractIndex">
                        <span v-for="(item,index) in filesList" :key="index" :class="{selet:index==Cindex}" @click="contractImg(index,item.file_url)">
                                <img :src="item.file_url">
                                第{{index+1}}页
                        </span>
                    </div>
                    <div class="contract">
                        <img :src="imgUrl">
                    </div>
                    <div class="clear"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
           filesList:[],
           imgUrl:'',
           Cindex:0,
        }
    },
    props:{
        filesData:{
            type:Array,
            default:[]
        }
    },
    mounted(){
        this.initFileData();
        this.autoHeight();
    },
    methods:{
        // autoH
        autoHeight(){
            $(".newContractData .autoHeight").height($(window).height()-270);
            $(".confirContract .contract,.confirContract .contractIndex").height($(window).height()-295);
        },
         // initFileData
        initFileData(){
            this.filesList=this.filesData;
            this.$nextTick(()=>{
                this.getContractFile();
            })
        },
        // changeImg
        contractImg(index,url){
            this.Cindex=index;
            this.imgUrl=url;
        },
        // defultImg
        getContractFile(){
            this.imgUrl=this.filesList[0].file_url;
        },
    }
}
</script>
<style scoped>

</style>

