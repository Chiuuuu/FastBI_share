import Vue from 'vue'
import 'ant-design-vue/dist/antd.css';
import { message, Result, Button, Modal, Input, Icon, Spin } from 'ant-design-vue';
Vue.prototype.$message = message;
Vue.use(Result)
Vue.use(Button)
Vue.use(Modal)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Spin)