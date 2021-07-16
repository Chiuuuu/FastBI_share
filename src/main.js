// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import VCharts from "v-charts";
import "lib-flexible";
import Echarts from 'echarts'
import highCharts from 'highcharts';
import highcharts3d from 'highcharts/highcharts-3d'

import './font/font.css'
highcharts3d(highCharts);
Vue.use(VCharts);
Vue.config.productionTip = false;
Vue.prototype.$highCharts = highCharts
Vue.prototype.$echarts = Echarts

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});
