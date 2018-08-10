import Vue from 'vue';
import iView from 'iview';
import { router } from './router/index';
import store from './store';
import App from './app.vue';
import VueResource from 'vue-resource';
import axios from './store/request';
import 'iview/dist/styles/iview.css';
import './theme/dist/iview.css';
import vueEventCalendar from '../src/views/main-components/calend/vue-event-calendar/dist/index'
import Bus from './config/bus.js'
import 'babel-polyfill'  //处理IE11打开空白问题
import notice from './notice/index.js' // 通知类
import './notice/style.css' // 全局通知样式
import './views/chatInterface/jquery-sina-emotion.min.js' // 新浪表情js
import 'jquery-sina-emotion/dist/jquery-sina-emotion.min.css' // 新浪表情css
import GeminiScrollbar from 'vue-gemini-scrollbar' // 美化滚动条
import 'jquery.caret/dist/jquery.caret.min.js' // caret插件
import 'plupload/js/plupload.full.min.js' // plupload 上传
import plupload from './plupload/plupload.js' // 上传样式
import './views/chatInterface/realTime.css' // 聊天框样式
import soket from './views/chatInterface/websoket.js'
import config from './config/config.js'
import global from './components/Global'//引用全局变量文件
// axios.defaults.baseURL = 'http://106.14.150.55';
// axios.defaults.baseURL = 'http://59.111.95.148';
// axios.defaults.withCredentials = false
Vue.prototype.$axios = axios
Vue.$axios = axios;  // Vue.$axios 调用
Vue.prototype.GLOBAL = global
Vue.prototype.$connectSoket = soket
if (localStorage.token) {
  axios.defaults.headers.common['token'] = localStorage.token;
}
localStorage.pid = 1
Vue.use(vueEventCalendar, { locale: 'zh' })
Vue.use(iView);
Vue.use(VueResource);
Vue.use(Bus);
Vue.use(notice);
Vue.use(plupload);
Vue.use(GeminiScrollbar);
Vue.directive('scroll', {
    bind: function(el, binding) {
        window.addEventListener('scroll', function() {
            if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
                let loadData = binding.value
                loadData()
            }
        })
    }
})
// 导航守卫
router.beforeEach((to, from, next) => {
  next();
})
// http response 拦截器
// axios.interceptors.response.use(
// response => {
//   return response;
// },
// error => {
//   if (error.response) {
//     switch (error.response.status) {
//       case 600:
//         // 返回 600 清除token信息并跳转到登录页面
//         store.commit(types.LOGOUT);
//         router.replace({
//           path: '/login',
//           query: {redirect: router.currentRoute.fullPath}
//         })
//     }
//   }
//   return Promise.reject(error.response.data)   // 返回接口返回的错误信息
// });

new Vue({
  el: '#app',
  router: router,
  store: store,
  VueResource: VueResource,
  render: h => h(App),
  created() {
  },
  mounted() {
    this.$store.dispatch('getMenulistRole');

  },

});
