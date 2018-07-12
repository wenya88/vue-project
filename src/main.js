import Vue from 'vue';
import iView from 'iview';
import { router } from './router/index';
import store from './store';
import App from './app.vue';
import VueResource from 'vue-resource';
import axios from 'axios'
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
axios.defaults.baseURL = 'http://59.111.95.148';
axios.defaults.withCredentials = false
Vue.prototype.$axios = axios
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

new Vue({
  el: '#app',
  router: router,
  store: store,
  VueResource: VueResource,
  render: h => h(App),
  created() {
  },
  mounted() {
    this.$store.commit('updateMenulist');
  },

});
