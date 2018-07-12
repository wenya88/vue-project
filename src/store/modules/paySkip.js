
const paystatus={
    state:{
        payData:{},
        projectData:[],
        userData:[],
        enterContractFlag:false,
        fileUpload:"http://106.14.150.55/index.php?r=file/file/file-upload"
        // fileUpload:"http://192.168.2.19/index.php?r=file/file/file-upload"
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
        }

    }
}
export default paystatus