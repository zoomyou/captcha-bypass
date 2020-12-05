// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// import global_variable from '@/components/global.vue' // 全局变量
// Vue.prototype.$GLOBAL = global_variable

// 导入全局样式表
import '@/assets/css/global.css'


Vue.config.productionTip = false

// 引入并使用element-UI
import ElementUI, { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$Message = Message


// 引入axios
import axios from 'axios'
// 设定 请求根路径
// axios.defaults.baseURL = "http://47.97.74.223:80/"
axios.defaults.baseURL = "http://localhost:80/"
// axios.defaults.baseURL = "http://10.10.11.161:80/"

// 为 axios 添加请求预处理，即token拦截器
axios.interceptors.request.use( config => {
  console.log(config);
  config.headers.token = window.sessionStorage.getItem('token');

  return config
})

Vue.prototype.$http = axios

Vue.use(ElementUI);

// fake token just for test
// window.sessionStorage.setItem("token", '123')
// window.sessionStorage.setItem("user_id", 1)
// window.sessionStorage.setItem("role", "人工打码客户端")


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
