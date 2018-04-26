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

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.baseURL = 'http://192.168.2.19/index.php';
axios.defaults.withCredentials = false
Vue.prototype.$axios = axios
var token = localStorage.token
if(localStorage.token) {
  axios.defaults.headers.common['token'] = localStorage.token;
}
localStorage.pid = 1
Vue.use(vueEventCalendar, {locale: 'zh'})
Vue.use(iView);
Vue.use(VueResource);

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
