
const paystatus={
    state:{
        payData:{},
        projectData:[],
        userData:[],
        enterContractFlag:false,
<<<<<<< HEAD
        fileUpload:"http://106.14.150.55/index.php?r=file/file/file-upload"
=======
        fileUpload:"http://59.111.95.148/index.php?r=file/file/file-upload"
>>>>>>> 92c348b677eee0c78b806a0ea67803f9114b020d
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