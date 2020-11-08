// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import "normalize.css";
import ElementUI from "element-ui";
import "./style/element-variables.scss";
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
import App from "./App";
import router from "./router";
import store from "./store";
import { http } from "./utils/http";

Vue.config.productionTip = false;
Vue.use(ElementUI, { size: "small" });
Vue.use(MintUI);
Vue.prototype.$http = http;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
