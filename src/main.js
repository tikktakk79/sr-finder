import Vue from "vue"
import router from "./router"
import App from "./App.vue"
import store from "./store"
import VueSimpleAlert from "vue-simple-alert"
import ToggleButton from "vue-js-toggle-button"
import "@/assets/css/tailwind.css"

import friendCalls from "@/services/user_storage/FriendCalls.js"
import axios from "axios"
import { storageApi } from "./services/StorageService"
import helper from "@/helper/helper.js"

Vue.use(VueSimpleAlert)
Vue.use(ToggleButton)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created: function () {
    helper.fetchData(store)
  },
  render: (h) => h(App),
}).$mount("#app")
