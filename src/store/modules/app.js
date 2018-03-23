import {otherRouter, appRouter, thirdRouter} from '@/router/router';
import Cookies from 'js-cookie';
import Vue from 'vue';

const app = {
    state: {
        menuList: [],
        thirdList: [],
        routers: [
            otherRouter,
            ...appRouter,
            ...thirdRouter
        ],
        menuTheme: 'dark', // 主题
        themeColor: '',
    },
    mutations: {
        updateMenulist (state) {
            state.menuList = appRouter;
        },
        updateLeftMenuList(state) {
            state.thirdList = thirdRouter;
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.themeColor = mainTheme;
        },
    }
};

export default app;
