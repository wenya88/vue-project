
const ImgVediostatus={
    state:{
        TaskID:null,
        FileURl:''
    },
    mutations:{
        changeComponentTaskID(state,cData){
            state.TaskID=cData;
            console.log(118,cData)
        },
        changeComponentFileURl(state,cData){
            state.FileURl=cData;
            console.log(119,cData)
        }
    }
    
}
export default ImgVediostatus