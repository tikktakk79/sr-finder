import Vue from "vue"
import router from "./router"
import store from "./store"
import App from "./App.vue"

import VueSimpleAlert from "vue-simple-alert"
import ToggleButton from "vue-js-toggle-button"
import "@/assets/css/tailwind.css"

import friendCalls from "@/services/user_storage/FriendCalls.js"
import axios from "axios"
import { storageApi } from "./services/StorageService"
import helper from "@/helper/helper.js"
import vSelect from "vue-select"
import "vue-select/dist/vue-select.css"

Vue.component("v-select", vSelect)

Vue.use(VueSimpleAlert)
Vue.use(ToggleButton)

Vue.config.productionTip = false

Vue.directive("title", {
  inserted: function (el) {
    document.title = el.dataset.title
  },
})

new Vue({
  router,
  store,
  created: function () {
    helper.fetchData(store, Vue.alert)
  },
  render: (h) => h(App),
}).$mount("#app")
