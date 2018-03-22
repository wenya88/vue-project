import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import store from './store';
import App from './app.vue';
import VueResource from 'vue-resource';
import 'iview/dist/styles/iview.css';
import './theme/dist/iview.css';
import 'vue-event-calendar/dist/style.css';
import vueEventCalendar from 'vue-event-calendar';
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
