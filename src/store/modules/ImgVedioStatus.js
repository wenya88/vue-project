
const ImgVediostatus={
    state:{
        TaskID:null,
        stageId:null
    },
    mutations:{
        changeComponentID(state,obj){
            state.TaskID=obj.taskId;
            state.stageId=obj.stageId;
            // console.log(118,cData)
        },
        changeComponentTaskID(state,cData){
            state.TaskID = cData;
        },
        changeComponentFileURl(state,cData){
            state.FileURl=cData;
            // console.log(119,cData)
        }
    }

}
export default ImgVediostatus
