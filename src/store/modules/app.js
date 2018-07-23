import {otherRouter, appRouter} from '@/router/router';
import {menu} from '@/router/menu'
import Util from '@/libs/util';
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
        messageCount: 0,
        fileUrl:[],
    },
    mutations: {
        updateMenulist (state) {
            let accessCode = parseInt(Cookies.get('post_id'));
            let menuList = [];
            menu.forEach((item, index) => {
                // if (item.access) {
                //     if(accessCode == 3) {
                //         if(item.access == 3){
                //             menuList.push(item);
                //         }
                //     } else if(accessCode != 3 && item.access != 3) {
                //         menuList.push(item);
                //     }
                // } else {
                    menuList.push(item);
                // }
            });
            state.menuList = menuList;
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.themeColor = mainTheme;
        },
        setMessageCount (state, count) {
            state.messageCount = count;
        },
        setfileUrl(state,data){
            state.fileUrl.push(data);
        },
        clearfileUrl(state){
            state.fileUrl = [];
            console.log()
        },
    }
};

export default app;
