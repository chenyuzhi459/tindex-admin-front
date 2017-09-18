import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
import "babel-polyfill";
import  VueResource  from 'vue-resource'
import common from './common'

Vue.use(VueResource) 
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$common = common
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');