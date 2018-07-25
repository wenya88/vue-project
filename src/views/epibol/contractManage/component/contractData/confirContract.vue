<template>
    <div class="newContractData">
        <div class="confirContract">
            <!-- 合同预览 -->
            <div v-if="contrateCommit" class="lookContract">
                <div v-if="filesList.length!=0">
                    <div class="contractIndex">
                        <span v-for="(item,index) in filesList" :key="item.name" :class="{selet:index==Cindex}" @click="contractImg(index,item.url)">
                                <img :src="item.url" :title="item.name">
                                第{{index+1}}页
                        </span>
                    </div>
                    <div class="contract">
                        <div class="restContractStyle" @click="restContract"><Icon type="arrow-return-left" size="16"></Icon> 重选合同类型</div>
                        <img :src="imgUrl">
                    </div>
                    <div class="clear"></div>
                </div>
                <div v-else>暂无图片</div>
            </div>

            <!-- 合同上传 -->
            <div v-if="!contrateCommit">
                <!-- 线下合同 -->
                <div class="offlineContract">
                    <div class="title">
                        <em class="iconfont icon-hetong"></em>签定线下合同
                        <p>如双方已已签定纸质合同，请上传合同</p>
                    </div>
                    <div class="offineUpLoad">
                        <file-upload></file-upload>
                        <Icon type="android-upload" size="45"></Icon>
                        <p>
                            点击上传合同扫描件<br/>
                            <em>限JPG,PNG,PDF格式</em>
                        </p>
                    </div>
                   
                </div>
                <!-- 在线合同 -->
                <div class="lineContract">
                    <div class="title">
                        <em class="iconfont icon-renwu1"></em>签定在线电子合同
                        <p>电子合同具有便捷高效的特点，同样也具体纸质合同的法律效应</p>
                    </div>
                    <Button type="success" class="success">立即成生合同</Button>
                </div>
                <div class="clear"></div>
            </div>
        </div>      

    </div>
</template>
<script>
import fileUpload from '../../../../../components/upload';
var qs=require('querystring');
export default {
    data(){
        return{
            imgUrl:'',
            Cindex:0,
            filesList:[],
            configure:{}
        }
    },
    mounted(){
        this.autoHeight();
        this.getContractFile();
        this.uploadContractFile();
    },
    components:{
        fileUpload:fileUpload
    },
    computed:{
        contrateCommit(){
            return this.$store.state.paySkip.contrateCommit;
        },
    },
    methods:{
        // autoH
        autoHeight(){
            $(".newContractData>.confirContract,.newContractData .confirContract .offlineContract,.newContractData>.confirContract .lineContract").height($(window).height()-252);
        },
        contractRow(){
            $(".lookContract>.contract").height($(window).height()-252)
        },
        // uploadContractFile
        uploadContractFile(){
            // this.$store.commit('getContrateCommit',true);
            // this.$nextTick(()=>{
            //     this.contractRow();
            // }
        },
        // changeImg
        contractImg(index,url){
            this.Cindex=index;
            this.imgUrl=url;
        },
        // defultImg
        getContractFile(){
            if(this.filesList.length!=0){
                this.imgUrl=this.filesList[0].url;
            }
        },
        // restContract
        restContract(){
            this.$store.commit('getContrateCommit',false);
            this.$nextTick(()=>{
                this.autoHeight();
            })
        }
    }
}
</script>
<style>

</style>
