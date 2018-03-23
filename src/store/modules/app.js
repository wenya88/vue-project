import {otherRouter, appRouter} from '@/router/router';
import Cookies from 'js-cookie';
import Vue from 'vue';

const app = {
    state: {
        menuList: [],
        routers: [
            otherRouter,
            ...appRouter
        ],
        menuTheme: 'dark', // 主题
        themeColor: '',
    },
    mutations: {
        updateMenulist (state) {
            state.menuList = appRouter;
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
