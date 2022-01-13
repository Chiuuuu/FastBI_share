import './base'
import Vue from "vue";
import List from "./List";
import service from "./api"
import router from './router'

Vue.prototype.$api = service

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(List)
}).$mount('#list');

