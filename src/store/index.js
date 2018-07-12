import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import project from './modules/project';
import member from './modules/member';
import paySkip from './modules/paySkip';
import ImgVedioStatus from './modules/ImgVedioStatus';

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
    },
    mutations: {
        //
    },
    actions: {

    },
    modules: {
        app,
        user,
        project,
        member,
        paySkip,
        ImgVedioStatus
    }
});

export default store;
