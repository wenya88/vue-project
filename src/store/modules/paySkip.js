import Cookies from 'js-cookie';
import api from 'api'
const paystatus={
    state:{
        payData:{},
        projectData:[],
        userData:[],
        enterContractFlag:false,
        // fileUpload:"http://59.111.95.148/index.php?r=file/file/file-upload",
        fileUpload:"http://192.168.2.19/index.php?r=file/file/file-upload",
        contrateCommit:false,
        contrateButton:false,
        contractID:null,
        imgEditorWH:[],
        company:!Cookies.get('company')?{}:JSON.parse(Cookies.get('company')),
        network:null, //电子合同步骤,
        promptInfo:null,
        info:null,
        confirmInfo:null, // 公司认证信息
        isEdit:false, // 能否编辑
        // let {data} =
    },
    mutations:{
        actionPaySkip(state,pData){
            state.payData=pData;
        },
        getProjectData(state,pData){
            state.projectData=pData
        },
        getUserData(state,pData){
            state.userData=pData
        },
        changContractStatus(state,pData){
            state.enterContractFlag=pData;
        },
        getContrateCommit(state,pData){
            state.contrateCommit=pData
        },
        getContractIDCommit(state,pData){
            state.contractID=pData
        },
        getContractServerButton(state,pData){
            state.contrateButton=pData;
        },
        getImgEditorWH(state,pData){
            state.imgEditorWH=pData
        } ,
        // 设置合同类型
        getContractType(state,data){
            console.log(11,data)
            state.network=data
        },
        // 设置合同小助手信息
        setPromptInfo(state,data){
            state.promptInfo = data
        },
        // 设置合同详情
        setInfo(state,data){
            state.info = data
        },
        // 设置认证信息
        setConfirmInfo(state,data){
            state.confirmInfo = data
        },
        //进入详情还是编辑  true为编辑
        setIsEdit(state,data){
            state.isEdit = data
        },
    },
    actions:{
        async getconfirmInfo({commit}){
            let {data} = await api.getconfirmInfo()
            if(data.err_code === 0){
                commit('setConfirmInfo',data.data)
            }
        }
    }

}
export default paystatus