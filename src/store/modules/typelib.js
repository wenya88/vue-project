/*类型库*/


const typelib = {
    state: {
        defId:null, // 默认id
    },
    mutations: {
        setDefId(state,data){

            state.defId = data
        }
    },
    actions:{
        setDefIdAction({commit},data){
         commit('setDefId',data)
        }
    }
};

export default typelib;
