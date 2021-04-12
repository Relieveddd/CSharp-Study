import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// Normalize
import "normalize.css";
// Style
import "@/style/index.scss";
// iconfont
import "@/libs/iconfont.js";

// ElementUi
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI, { size: "small", zIndex: 3000 });

// MmUi
import MmUi from "@/mmui";
import "@/mmui/style/index.scss";
Vue.use(MmUi);

// Component
import Component from "@/components";
Vue.use(Component);

// Vuelidate
import Vuelidate from "vuelidate";
Vue.use(Vuelidate);

// filter
import Filter from "./utils/filter";
Vue.use(Filter);

// Request
import { request } from "./utils/request";
Vue.prototype.$_request = request;

// EventBus
import eventBus from "./utils/eventBus";
Vue.prototype.$_eventBus = eventBus;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");