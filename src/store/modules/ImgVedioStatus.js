
const ImgVediostatus={
    state:{
        TaskID:null,
        FileURl:''
    },
    mutations:{
        changeComponentTaskID(state,cData){
            state.TaskID=cData;
        },
        changeComponentFileURl(state,cData){
            state.FileURl=cData;
        }
    }
    
}
export default ImgVediostatus