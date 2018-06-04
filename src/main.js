import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import store from './store';
import App from './app.vue';
import VueResource from 'vue-resource';
import axios from 'axios'
import 'iview/dist/styles/iview.css';
import './theme/dist/iview.css';
import 'vue-event-calendar/dist/style.css';
import vueEventCalendar from 'vue-event-calendar';
import Bus from './config/bus.js'
import config from './config/config.js' 
import global from './components/Global'//引用全局变量文件
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = 'http://192.168.2.19';
// axios.defaults.baseURL = 'http://plat.yhcgame.com:8080'
axios.defaults.withCredentials = false
Vue.prototype.$axios = axios
Vue.prototype.GLOBAL = global
var token = localStorage.token
if(localStorage.token) {
  axios.defaults.headers.common['token'] = localStorage.token;
}
localStorage.pid = 1
Vue.use(vueEventCalendar, {locale: 'zh'})
Vue.use(iView);
Vue.use(VueResource);
Vue.use(Bus);
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
//   console.log(to.path, from.path);
//   if(to.name == 'Preview' && from.name) {
//     window.location.href = `/cdn/show/preview?id=${to.query.id}`;
//     return;
//   }
  next();
})

new Vue({
    el: '#app',
    router: router,
    store: store,
    VueResource:VueResource,
    render: h => h(App),
    mounted () {
        this.$store.commit('updateMenulist');
    },

});
