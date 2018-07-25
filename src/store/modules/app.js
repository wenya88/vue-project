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
        uploadFile: [],
    },
    mutations: {
        updateMenulist(state) {
            let accessCode = parseInt(Cookies.get('post_id'));
            let menuList = [];
            menu.forEach((item, index) => {
            //     if (item.access) {
            //         if(accessCode == 3) {
            //             if(item.access == 3){
            //                 menuList.push(item);
            //             }
            //         } else if(accessCode != 3 && item.access != 3) {
            //             menuList.push(item);
            //         }
            //     } else {
                    menuList.push(item);
                // }
            });
            state.menuList = menuList;
        },
        // updateMenulist (state) {
        //     let accessCode = parseInt(Cookies.get('access'));
        //     let menuList = [];
        //     appRouter.forEach((item, index) => {
        //         if (item.access !== undefined) {
        //             if (Util.showThisRoute(item.access, accessCode)) {
        //                 if (item.children.length === 1) {
        //                     menuList.push(item);
        //                 } else {
        //                     let len = menuList.push(item);
        //                     let childrenArr = [];
        //                     childrenArr = item.children.filter(child => {
        //                         if (child.access !== undefined) {
        //                             if (child.access === accessCode) {
        //                                 return child;
        //                             }
        //                         } else {
        //                             return child;
        //                         }
        //                     });
        //                     menuList[len - 1].children = childrenArr;
        //                 }
        //             }
        //         } else {
        //             if (item.children.length === 1) {
        //                 menuList.push(item);
        //             } else {
        //                 let len = menuList.push(item);
        //                 let childrenArr = [];
        //                 childrenArr = item.children.filter(child => {
        //                     if (child.access !== undefined) {
        //                         if (Util.showThisRoute(child.access, accessCode)) {
        //                             return child;
        //                         }
        //                     } else {
        //                         return child;
        //                     }
        //                 });
        //                 if (childrenArr === undefined || childrenArr.length === 0) {
        //                     menuList.splice(len - 1, 1);
        //                 } else {
        //                     let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
        //                     handledItem.children = childrenArr;
        //                     menuList.splice(len - 1, 1, handledItem);
        //                 }
        //             }
        //         }
        //     });
        //     state.menuList = menuList;
        // },
        changeMenuTheme(state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme(state, mainTheme) {
            state.themeColor = mainTheme;
        },
        setMessageCount(state, count) {
            state.messageCount = count;
        },
        setfileUrl(state, data) {
            state.uploadFile.push(data.data);
        },
        clearfileUrl(state) {
            state.uploadFile = [];
        },
    }

};
export default app;
