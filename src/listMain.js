import './base'
import Vue from "vue";
import List from "./List";

/* eslint-disable no-new */
new Vue({
  el: "#list",
  components: { List },
  template: "<List/>"
});
