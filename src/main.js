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
import global from './components/Global'//引用全局变量文件
axios.defaults.baseURL = 'http://106.14.150.55';
axios.defaults.withCredentials = false
Vue.prototype.$axios = axios
Vue.prototype.GLOBAL = global
if (localStorage.token) {
  axios.defaults.headers.common['token'] = localStorage.token;
}
localStorage.pid = 1
Vue.use(vueEventCalendar, { locale: 'zh' })
Vue.use(iView);
Vue.use(VueResource);
Vue.use(Bus);

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
