import {otherRouter, appRouter} from '@/router/router';
import {menu} from '@/router/menu'
import Util from '@/libs/util';
import Cookies from 'js-cookie';
import Vue from 'vue';
import { cidrSubnet } from 'ip';

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
            let userType = Cookies.get('user_type')
            let menuList = [], childrenList = [];
            menu.forEach((item, index) => {
                // 模拟权限
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
                // 甲方乙方权限配置
                // console.log(item)
                if(item.name == "epibol") {
                    item.children.forEach((child,idx) => {
                        if(child.auth) {
                            if(userType == 1) {
                                if(child.auth == 1){
                                    // 甲方
                                    menuList[1].children.splice(1,1)
                                }
                            } else if(userType != 1 && item.auth != 1) {
                                // 乙方
                                menuList[1].children.splice(2,1)
                            }
                        }
                    })
                }
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
            data.data.name = data.files.name
            state.uploadFile.push(data.data);
            console.log(11,state.uploadFile)
        },
        clearfileUrl(state) {
            state.uploadFile = []; 
        },
    }

};
export default app;
