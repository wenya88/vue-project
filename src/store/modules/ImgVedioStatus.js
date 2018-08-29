
const ImgVediostatus={
    state:{
        TaskID:null,
        stageId:null,
        FileURl:null
    },
    mutations:{
        changeComponentID(state,obj){
            state.TaskID=obj.taskId;
            state.stageId=obj.stageId;
        },
        changeComponentTaskID(state,cData){
            state.TaskID = cData;
        },
        changeComponentFileURl(state,cData){
            state.FileURl=cData;

        }
    }

}
export default ImgVediostatus
