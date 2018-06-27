
const paystatus={
    state:{
        payData:{},
        projectData:[],
        userData:[],
        enterContractFlag:false
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