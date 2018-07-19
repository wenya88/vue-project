<template>
    <div class="newContractData">
        <div class="confirContract">
            <!-- 合同预览 -->
            <div v-if="contrateCommit" class="lookContract">
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

            <!-- 合同上传 -->
            <div v-if="!contrateCommit">
                <!-- 线下合同 -->
                <div class="offlineContract">
                    <div class="title">
                        <em class="iconfont icon-hetong"></em>签定线下合同
                        <p>如双方已已签定纸质合同，请上传合同</p>
                    </div>
                    <div class="offineUpLoad" @click="uploadContractFile">
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
export default {
    data(){
        return{
            imgUrl:'',
            Cindex:0,
            filesList:[
                {   
                    url:'http://e.hiphotos.baidu.com/image/pic/item/8c1001e93901213fe4c06e3958e736d12e2e9567.jpg',
                    name:'美女1号'
                },
                {
                    url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532589805&di=c8ffe778d37a7d64006538e7bb5bb6e5&imgtype=jpg&er=1&src=http%3A%2F%2Fs7.sinaimg.cn%2Fmw690%2F006LDoUHzy7auXtxWOG16%26amp%3B690',
                    name:'我的小可爱啊'
                }
            ]
        }
    },
    mounted(){
        this.autoHeight();
        this.getContractFile();
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
            // })

        },
        // changeImg
        contractImg(index,url){
            this.Cindex=index;
            this.imgUrl=url;
        },
        // defultImg
        getContractFile(){
            this.imgUrl=this.filesList[0].url;
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
