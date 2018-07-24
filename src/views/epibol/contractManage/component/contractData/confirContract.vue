<template>
    <div class="newContractData">
        <div class="confirContract">
            <!-- 合同预览 -->
            <div v-if="contrateCommit" class="lookContract">
                    <div class="contractIndex">
                        <file-upload>
                            <span class="ageUpload" id="browse" slot="upload">
                                <p>
                                    <Icon type="android-upload" size="35"></Icon><br/>
                                    点击上传合同
                                </p>
                            </span>
                        </file-upload>
                        <span v-for="(item,index) in filesList" :key="index" :class="{selet:index==Cindex}" @click="contractImg(index,item.file_url)">
                                <em class="delete" @click.stop="deleteImg(index)"><Icon type="trash-a" size="16"></Icon></em>
                                <img :src="item.file_url">
                                第{{index+1}}页
                        </span>
                    </div>
                    <div class="contract">
                        <div class="restContractStyle" @click="restContract"><Icon type="arrow-return-left" size="16"></Icon>&nbsp;&nbsp;重选合同类型</div>
                        <img :src="imgUrl" id="bigImg">
                    </div>
                    <div class="clear"></div>
            </div>

            <!-- 合同上传 -->
            <div v-if="!contrateCommit">
                <!-- 线下合同 -->
                <div class="offlineContract">
                    <div class="title">
                        <em class="iconfont icon-hetong"></em>签定线下合同
                        <p>如双方已已签定纸质合同，请上传合同</p>
                    </div>
                        <file-upload>
                            <div slot="upload">
                                <div class="offineUpLoad" id="browse">
                                    <Icon type="android-upload" size="45"></Icon>
                                    <p>
                                        点击上传合同扫描件<br/>
                                        <em>限JPG,PNG,PDF格式</em>
                                    </p>
                                </div>
                            </div>
                        </file-upload>
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
import {AutoResizeImage} from '../../../../project/components/imgEditorTwo/autoResizeImage.js';
var qs=require('querystring');
export default {
    data(){
        return{
            imgUrl:'',
            Cindex:0,
            filesList:[],
            configure:{},
        }
    },
    mounted(){
        this.autoHeight();
        this.getContractFile();
        this.$bus.on("FileUploaded",(val)=>{
            this.uploadCallBack();
        })
    },
    components:{
        fileUpload:fileUpload
    },
    computed:{
        contrateCommit(){
            return this.$store.state.paySkip.contrateCommit;
        },
        uploadFile(){
            return this.$store.state.app.uploadFile;
        }
    },
    methods:{
        // uploadCallBack
        uploadCallBack(){
           this.uploadFile.forEach(val => {
              this.filesList.push(JSON.parse(val.response));
           });
           this.filesList.forEach(val=>{
               delete val.Status;
           })
           this.$store.commit('getContrateCommit',true);
           this.$nextTick(()=>{
                this.getContractFile();
                this.contractRow();
           })
           this.$bus.emit("ContractUploadFile",this.filesList)
        },
        // autoH
        autoHeight(){
            $(".newContractData>.confirContract,.newContractData .confirContract .offlineContract,.newContractData>.confirContract .lineContract").height($(window).height()-252);
        },
        contractRow(){
            $(".lookContract .contract,.lookContract .contractIndex").css("height",$(window).height()-252);
            let cw=($(".lookContract .contract").width()/2)-70;
            $(".restContractStyle").css("margin-left",cw)
        },
        // changeImg
        contractImg(index,url){
            this.Cindex=index;
            this.imgUrl=url;
        },
        // deleteImg
        deleteImg(index){
            this.filesList.splice(index,1);
            if(this.filesList.length==0){
                this.restContract();
            }
        },
        // defultImg
        getContractFile(){
            if(this.filesList.length!=0){
                this.imgUrl=this.filesList[0].file_url;
            }
        },
        // restContract
        restContract(){
            this.$store.commit('getContrateCommit',false);
            this.filesList=[];
            this.$nextTick(()=>{
                this.autoHeight();
            })
        }
    }
}
</script>
<style>

</style>
