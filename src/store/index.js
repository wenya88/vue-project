import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import project from './modules/project';
import member from './modules/member';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
        //
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
        member
    }
});

export default store;
