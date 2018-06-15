<template>
    <!-- 招标详情 -->
    <div class="appDetails">
          <!-- 信息 -->
         <div class="detailsList">
             <dl>
                 <dd><span>外包方</span><em>{{appData.demandCompanyName}}</em><div class="clear"></div></dd>
                 <dd><span>测试金额</span><em class="num">￥{{appData.testPrice}}</em><div class="clear"></div></dd>
                 <dd><span>项目预计总额</span><em class="num">￥{{appData.projectMinPrice}} ~ ￥{{appData.projectMaxPrice}}</em><div class="clear"></div></dd>
                 <dd><span>投搞截止</span><em class="num">{{appData.endTime}}</em><div class="clear"></div></dd>
                 <dd><span>实施人员</span>
                     <em>
                         <Select v-model="pesValue" style="width:100px" size="small" :placeholder="appData.executeUserName">
                            <Option v-for="item in personnel" :value="item.id" :key="item.id">{{ item.realname }}</Option>
                         </Select>
                     </em>
                     <div class="clear"></div>
                 </dd>
                 <dt>稿件要求</dt>
                 <dd class="description">
                    {{appData.fileRequire==null?'暂无要求':appData.fileRequire}}
                 </dd>
                 <dt>参考附件</dt>
                 <dd>
                     <span class="file">角色参考文件.jpg</span>
                     <em><Icon type="ios-cloud-download-outline" size="24" @click.native="downFile" class="downFile"></Icon></em>
                     <div class="clear"></div>
                 </dd>
                 <dt>其他说明</dt>
                 <dd class="description">
                    {{appData.description==null?'暂无说明':appData.description}}
                 </dd>
             </dl>
         </div>
         <!-- 文件 -->
         <div class="detailsComponent">
             <div v-if="fileType=='NULL'" class="notIMG" style="height:550px;">
                加载中...
            </div>
            <bid-edite ref="bidEditeData" v-if="fileType=='Image'"></bid-edite>
         </div>
         <div class="clear"></div>
    </div>
</template>
<script>
import BidImgEdite from '../../../project/components/BidImgEdit';
export default {
    data(){
        return{
            personnel:[],
            pesValue:'',
            fileType:'NULL'
        }
    },
    props:[
        'appData'
    ],
    components:{
        bidEdite:BidImgEdite
    },
    methods:{
        //文件下载
        downFile(){
            
        },
        //筛选文件类型
        filteType(){
           if(this.appData.bidFile.type=='image'){
               this.fileType='Image'
           }else if(this.appData.bidFile.type=='video'){
               this.fileType='Video'
           }else{
               this.fileType='NULL'
           }
        },
       getCont(personnel){
           this.personnel=personnel
       }
    },
    mounted(){
        //重置控件
        this.$bus.on('defaultType',()=>{
            this.fileType='NULL'
        })
       
    },
    updated(){
        this.filteType();
        this.$nextTick(()=>{
            this.$refs.bidEditeData.Editget(this.appData.bidFile);
        })
    }
}
</script>
<style lang="less">
@import '../style/bidManage.less';
</style>
