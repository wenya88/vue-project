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
       absold: true
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
