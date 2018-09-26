import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import project from './modules/project';
import member from './modules/member';
import paySkip from './modules/paySkip';
import ImgVedioStatus from './modules/ImgVedioStatus';
import typelib from './modules/typelib';
import contract from './modules/contract';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
       msgShow: !localStorage.msgShow ? false : true,
       useList: [],
       noticeList: [],
       absold: true,
       nums: 0,
       tabNum: 2,
       img: '',
       blob: false,
       file: {},
       msgNum: !localStorage.msgNum ? "0" : localStorage.msgNum,
        downloadStatus:false,
        downComplateArr:[]
    },
    mutations: {
        resetArr(state,falg){
            state.downComplateArr.splice(0,1);
        }
    },
    actions: {

    },
    modules: {
        app,
        user,
        project,
        member,
        paySkip,
        ImgVedioStatus,
        typelib,
        contract
    }
});

export default store;
