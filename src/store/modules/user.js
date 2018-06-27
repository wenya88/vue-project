import Cookies from 'js-cookie';

const user = {
    state: {
        secretKey:null
    },
    mutations: {
        logout (state, vm) {
            Cookies.remove('user');
            localStorage.clear();
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
     		// 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        },
        getSecretKey(state,data){
            state.secretKey = data
        }
    },
    actions:{

    }
};

export default user;
