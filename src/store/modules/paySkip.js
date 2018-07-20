
const paystatus={
    state:{
        payData:{},
        projectData:[],
        userData:[],
        enterContractFlag:false,
        // fileUpload:"http://59.111.95.148/index.php?r=file/file/file-upload"
        fileUpload:"http://192.168.2.19/index.php?r=file/file/file-upload",
        contrateCommit:false,
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
        }

    }
}
export default paystatus