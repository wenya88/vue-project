import Vue from 'vue'
import qs from 'querystring'

const url = 'index.php?r=';

export default {

    /*公司类型库*/

    taskCateList: (data) => {
        return Vue.$axios.post(url + 'task/task-type/cate-list', qs.stringify(data))           // 树状图list
    },
    taskCateAdd: (data) => {
        return Vue.$axios.post(url + 'task/task-type/cate-add', qs.stringify(data))            // 分类增加
    },
    taskCateinfo: (data) => {
        return Vue.$axios.post(url + 'task/task-type/info', qs.stringify(data))                // 类型详情
    },
    taskprojectCateUpdate: (data) => {
        return Vue.$axios.post(url + 'task/project-tasktype/update', qs.stringify(data))       // 项目更新
    },
    taskCateUpdate: (data) => {
        return Vue.$axios.post(url + 'task/task-type/cate-update', qs.stringify(data))         // 分类更新
    },
    getNorms: (data) => {
        return Vue.$axios.post(url + 'task/task-type/norms', qs.stringify(data))               // 获取规范
    },
    addNorm: (data) => {
        return Vue.$axios.post(url + 'task/task-type/add-norm', qs.stringify(data))            // 添加规范
    },
    deleteNorm: (data) => {
        return Vue.$axios.post(url + 'task/task-type/delete-norm', qs.stringify(data))         // 删除规范
    },
    getIconList: (data) => {
        return Vue.$axios.post(url + 'task/task-type/icon-list', qs.stringify(data))           // 获取图标库
    },
    taskTypeAdd: (data, changeUrl) => {
        return Vue.$axios.post(url + changeUrl, qs.stringify(data))                            // 新增类型
    },
    insideAudit: (data) => {
        return Vue.$axios.post(url + 'task/task/inside-audit', qs.stringify(data))   // 内部审核                          // 任务详情里面的阶段详情
    },

    /*项目级类型库*/
    projectTaskList: (data) => {
        return Vue.$axios.post(url + 'task/project-tasktype/list', qs.stringify(data))                            // 新增类型
    },
    projectTaskInfo: (data) => {
        return Vue.$axios.post(url + 'task/project-tasktype/info', qs.stringify(data))                            // 新增类型
    },
    taskStageInfo: (data) => {
        return Vue.$axios.post(url + 'task/task/stage-info', qs.stringify(data))                            // 任务详情里面的阶段详情
    },
    // 项目列表
    taskProjectPage: (data) => {
        return Vue.$axios.post(url + 'task/project/page', qs.stringify(data))
    },
    taskTaskList: (data) => {
        return Vue.$axios.post(url + 'task/task/list', qs.stringify(data))
    },
    //项目概况
    getProjectInfo: (data) => {
        return Vue.$axios.post(url + 'task/project/project-info', qs.stringify(data))
    },
    // 任务详情反馈信息
    getStageInfo: (data) => {
        return Vue.$axios.post(url + 'task/task/stage-info', qs.stringify(data))
    },
    accessoryUpload: (data) => {
        return Vue.$axios.post(url + 'task/task/update', qs.stringify(data))
    },




    // 之前的上传
    imageUpload: (data) => {
        return Vue.$axios.post(url + 'file/file/file-upload', qs.stringify(data))                             // 任务详情里面的阶段详情
    },


    // 权限
    getInfoRole: (data) => {
        return Vue.$axios.post(url + 'system/login/info', qs.stringify(data))                             // 权限
    },


    //乙方测试任务详情-----详情基本信息
    getTestTaskInfo:(id) =>{
        return Vue.$axios.get(url + `task/company/bid-info&bid_id=${id}`)
    },
    //乙方测试任务详情-----实施人员列表
    // getExecuteUserList:(data) =>{
    //     return Vue.$axios.post(url + 'task/test/set-work-user', qs.stringify(data))
    // }
    //测试任务详情-----上传后的信息
    getTestTaskBidinfos:(data)=>{
        return Vue.$axios.post(url + 'task/test/bid-info', qs.stringify(data))
    },
    //companyUserList
    getcompanyUserList:(project_id)=>{
        return Vue.$axios.post(url + 'task/company/member-page', qs.stringify(project_id))
    },
    //测试任务详情-------设置实施/负责人员接口
    setRelatedUser:(data)=>{
        return Vue.$axios.post(url + 'task/test/set-work-user', qs.stringify(data))
    },
    //上传测试任务
    uploadTestHttp:(data)=>{
        return Vue.$axios.post(url + 'task/test/test-upload', qs.stringify(data))
    },
    //获取负责人测试任务列表
    AuditTestTaskList:()=>{
        return Vue.$axios.get(url + 'task/test/audit-list')
    },
    //获取测试任务日志接口
    getTestTaskLog:(data)=>{
        return Vue.$axios.post(url + 'task/test/bid-log', qs.stringify(data))
    },
    //测试任务上传审核接口
    testTaskUpLoad:(data)=>{
        return Vue.$axios.post(url + 'task/test/inside-audit', qs.stringify(data))
    },
    //乙方获取招标列表
    getBidList:(data)=>{
        return Vue.$axios.post(url + 'task/test/bid-list', qs.stringify(data))
    },
    //乙方报价
    postBaojia:(data)=>{
        return Vue.$axios.post(url + 'task/test/join-test', qs.stringify(data))
    },
    //甲方获取测试任务详情
    getTaskDetail:(data)=>{
        return Vue.$axios.post(url + 'task/test/test-info', qs.stringify(data))
    },
    //项目大厅
    getTaskHall:(data)=>{
        return Vue.$axios.post(url + 'task/test/test-hall', qs.stringify(data))
    },
    //甲方选择(确认)报价
    choiceBidPrice:(data)=>{
        return Vue.$axios.post(url + 'task/test/choice-bid-price', qs.stringify(data))
    },
    //甲方选择乙方中标流程
    getWinBid:(data)=>{
        return Vue.$axios.post(url + 'task/test/win-bid', qs.stringify(data))
    },
    //甲方付款接口
    paytoyi:(data)=>{
        return Vue.$axios.post(url + 'task/test/pay', qs.stringify(data))
    },
    collect:(data)=>{
        return Vue.$axios.post(url + 'task/test/collect', qs.stringify(data))
    },
    // ---------------------------------公司级认证----------------------------------

    getconfirmInfo: (data) => {
        return Vue.$axios.post(url + 'system/tsign/confirm-info', qs.stringify(data))    // 公司认证

    },   getCompanyConfirm: (data) => {
        return Vue.$axios.post(url + 'system/tsign/company-confirm', qs.stringify(data))    // 公司认证

    },
    getCompanyCodeConfirm: (data) => {
        return Vue.$axios.post(url + 'system/tsign/company-code-confirm', qs.stringify(data))     // 金额验证

    },
    getBankInfo: (data) => {
        return Vue.$axios.post(url + 'system/tsign/bank-info', qs.stringify(data))                  //  银行支行查询接口

    },

    getCompanyAccount: (data) => {
        return Vue.$axios.post(url + 'system/tsign/company-account', qs.stringify(data))                  //  电子签名

    },

    getTsignSigner: (data) => {
        return Vue.$axios.post(url + 'system/tsign/signer', qs.stringify(data))                      //  修改签章人

    },
    getSignerList: (data) => {
        return Vue.$axios.post(url + 'system/tsign/signer-list', qs.stringify(data))                      //  签章人列表

    },
    setOperator: (data) => {
        return Vue.$axios.post(url + 'system/tsign/operator', qs.stringify(data))                      //  设置经办人

    },
    getOperatorList: (data) => {
        return Vue.$axios.post(url + 'system/tsign/operator-list', qs.stringify(data))                      //  获取选择后的经办人列表

    },
    delOperator: (data) => {
        return Vue.$axios.post(url + 'system/tsign/operator-del', qs.stringify(data))                      // 删除经办人

    },

    /*---------------------------------合同----------------------------------*/

    getConfirmContract: (data) => {
        return Vue.$axios.post(url + 'task/contract/confirm-contract', qs.stringify(data))                      //  签章页面乙确认合同

    },
    getTsignCode: (data) => {
        return Vue.$axios.post(url + 'system/tsign/send-code', qs.stringify(data))                                  //  签章页面获取验证码

    },
    getTsignPdf: (data) => {
        return Vue.$axios.post(url + 'system/tsign/get-pdf', qs.stringify(data))                                  //  签章页面获取PDF

    },
  getCreateCertificate: (data) => {
        return Vue.$axios.post(url + 'system/tsign/create-certificate', qs.stringify(data))                                  //  确认签章

    },
    getValid: (data) => {
        return Vue.$axios.post(url + 'system/tsign/get-valid', qs.stringify(data))                                  //  获取通知

    },


}
