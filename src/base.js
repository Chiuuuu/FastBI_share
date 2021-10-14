// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VCharts from "v-charts";
import "lib-flexible";
import Echarts from 'echarts'
// import highCharts from 'highcharts';
// import highcharts3d from 'highcharts/highcharts-3d'
// highcharts3d(highCharts);
// Vue.prototype.$highCharts = highCharts

import './font/font.css'
import './antd'
Vue.use(VCharts);
Vue.config.productionTip = false;
Vue.prototype.$echarts = Echarts
