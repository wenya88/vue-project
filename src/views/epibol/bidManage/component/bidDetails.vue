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
                         <Select v-model="pesValue" style="width:120px" size="small" :placeholder="appData.executeUserName" @on-change="changeUserName(appData.id)">
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
                 <dd v-for="item in appData.file">
                     <span class="file">{{item.name}}</span>
                     <em><a :href="item.url">下载</a></em>
                     <div class="clear"></div>
                 </dd>
                 <dt>其他说明</dt>
                 <dd class="description">
                    {{appData.description==null||appData.description==""?'暂无说明':appData.description}}
                 </dd>
             </dl>
         </div>
         <!-- 文件 -->
         <div class="detailsComponent">
             <div v-if="fileType=='NULL'" class="notIMG" style="height:400px;">
                暂无文件
            </div>
            <bid-edite ref="bidEditeData" v-if="fileType=='Image'"></bid-edite>
         </div>
         <div class="clear"></div>
    </div>
</template>
<script>
import BidImgEdite from '../../../project/components/BidImgEdit';
var qs=require('querystring')
export default {
    data(){
        return{
            personnel:[],
            pesValue:'',
            fileType:'NULL'
        }
    },
    props:{
        appData:{
            type:Object
        }
    },
    components:{
        bidEdite:BidImgEdite
    },
    methods:{
        //改变实施人员
        changeUserName(id){
            let url=this.GLOBAL.baseRouter+'task/company/set-execute-user';
            let params={
                id:id,
                execute_user:this.pesValue
            }
            this.$Loading.start();
            this.$axios.post(url,qs.stringify(params)).then(msg=>{
                this.$Loading.finish();
                this.$Message.success(msg.data.msg)
                this.$bus.emit('setExecuteUser')
            })
        },

        //筛选文件类型
        filteType(){
            if(this.appData.bidFile==null){
                this.fileType='NULL';
                document.getElementsByClassName('ivu-modal-body')[0].style.height='600px'
            }else{
                if(this.appData.bidFile.type=='image'){
                    this.fileType='Image'
                }else if(this.appData.bidFile.type=='video'){
                    this.fileType='Video'
                }
            }       
        },
       getCont(personnel){
           this.personnel=personnel
       }
    },
    updated(){
        this.filteType();
        this.$nextTick(()=>{
            if(this.appData.bidFile!=null){
                this.$refs.bidEditeData.Editget(this.appData.bidFile);
            }
        })
    }
}
</script>
<style lang="less">
@import '../style/bidManage.less';
</style>
