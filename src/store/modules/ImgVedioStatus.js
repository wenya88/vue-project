
const ImgVediostatus={
    state:{
        TaskID:null,
        stageId:null
    },
    mutations:{
        changeComponentID(state,obj){
            state.TaskID=obj.taskId;
            state.stageId=obj.stageId;
        },
        changeComponentTaskID(state,cData){
            state.TaskID = cData;
            console.log(118,cData)
        },
        changeComponentFileURl(state,cData){
            state.FileURl=cData;
            console.log(119,cData)

        }
    }

}
export default ImgVediostatus
