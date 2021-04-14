<template>
  <div>
    <h1>Feck it I'm in the other view?!</h1>
    <h3>{{ feckit }}</h3>
    <p>Do I know??? - {{ dunno }}</p>
    <button v-on:click="logout">Logga ut</button>
  </div>
</template>

<script>
//import Vuex from "vuex"
import storageCalls from "@/services/user_storage/StorageCalls.js"
// storageCalls.loginUser("rrr", "sss")
import { mapActions } from "vuex"
import store from "@/store"
export default {
  name: "OtherView",
  props: ["feckit", "dunno"],
  methods: {
    ...mapActions(["AUTH_LOGOUT"]),
    logout: function() {
      console.log("Autencierad? före utloggning", store.getters.isAuthenticated)
      this.$store.dispatch("AUTH_LOGOUT")
      console.log("Autencierad? efter", store.getters.isAuthenticated)
      this.$router.push("/login")
    }
  }
}
</script>
