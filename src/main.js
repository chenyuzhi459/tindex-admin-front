import Vue from 'vue';
import App from './App';
import router from './router';
// import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    
import "babel-polyfill";
import  VueResource  from 'vue-resource';
import common from './common';
import VueI18n from 'vue-i18n'
import enTindex from './locale/lang/en';
import zhTindex from './locale/lang/zh-CN';
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'

Vue.use(VueI18n)
Vue.use(VueResource) 
Vue.use(ElementUI)

const i18n = new VueI18n({
  locale: 'zh', // set locale
  messages: {   // set locale messages
    en: {
      ...enTindex,
      ...enLocale
    },
    zh: {
      ...zhTindex,
      ...zhLocale
    }
  }
})

ElementLocale.i18n((key, value) => i18n.t(key, value))
Vue.prototype.$t = ElementLocale.t
Vue.prototype._i18n = i18n
// Vue.prototype.$axios = axios
Vue.prototype.$common = common
Vue.http.interceptors.push((request, next) => {
    let timeout;
    // 這裡改用 _timeout
    if (request._timeout) {
        timeout = setTimeout(() => {
　　　　　　　　//自定义响应体 status:408,statustext:"请求超时"，并返回给下下边的next
            next(request.respondWith(request.body, {
                 status: 408,
                 statusText: ElementLocale.t('message.common.requestTimeout')
            }));
            
        }, request._timeout);
    }
    next((response) => {
　　　　return response;
    })
}) 

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');