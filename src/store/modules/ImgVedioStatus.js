
const ImgVediostatus={
    state:{
        TaskID:null,
        stageId:null,
        FileURl:null,
        toName:null,// 由什么路径进入  区分上传 和 任务详情
    },
    mutations:{
        changeComponentID(state,obj){
            state.TaskID=obj.taskId;
            state.stageId=obj.stageId;
        },
        changeComponentTaskID(state,cData){
            state.TaskID = null;
            state.TaskID = cData;
            // console.log(118,cData)

        },
        changeComponentFileURl(state,cData){
            state.FileURl = null;
            state.FileURl = cData;
            // console.log(119,cData)
        },
        clearComponentFileURl(state){
            state.FileURl = null;

        },
        setToName(state,data){
            state.toName = data;
            // console.log(775,state.toName)
        }
    }

};
export default ImgVediostatus
