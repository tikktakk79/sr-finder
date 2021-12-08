<template>
  <div>
    <form class="login text-center" @submit.prevent="register">
      <h1>Skapa ny användare</h1>
      <table class="mx-auto input-userdata mt-3">
        <tr>
          <td align="right" class="py-2.5">
            <label for="username">Användarnamn:</label>
          </td>
          <td align="left">
            <input
              required
              v-model="username"
              type="text"
              :class="{ 'border-red-400': badUsername }"
            /><span class="pl-1">*</span>
          </td>
        </tr>

        <tr>
          <td align="right" class="py-2.5">
            <label for="password">Lösenord:</label>
          </td>
          <td align="left">
            <input
              required
              v-model="password"
              type="password"
              autocomplete="off"
              :class="{ 'border-red-400': badPassword }"
            />
            <span class="pl-1">*</span>
          </td>
        </tr>
        <tr>
          <td align="right" class="py-2.5">
            <label for="email">Email</label>
          </td>
          <td align="left">
            <input v-model="email" type="text" />
            <span class="pl-1">*</span>
          </td>
        </tr>
      </table>
      <i class="text-red-700">{{ this.errString }}</i>

      <button v-if="!viewSpinner" type="submit" class="btn-black mx-auto mt-2">
        Registrera
      </button>
    </form>
    <Spinner
      v-if="viewSpinner"
      size="40"
      line-size=6
      line-fg-color="#474747"
      line-bg-color="#cccccc"
      speed=1.1
      message="Vänta lite..."
      class="mt-4"
    ></Spinner>
  </div>
</template>

<script>
import Store from "@/store"
import storageCalls from "@/services/user_storage/StorageCalls.js"
import Spinner from "vue-simple-spinner"
export default {
  name: "Register",
  data() {
    return {
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      email: "",
      error: null,
      badUsername: false,
      badPassword: false,
      errString: "",
      viewSpinner: false,
    }
  },

  components: {
    Spinner,
  },

  methods: {
    register: function () {
      const { username, password, firstname, lastname, email } = this
      console.log("THIS USERNAME", this.username)
      console.log("Är du autencierad?", Store.getters.isAuthenticated)
      let errMessage = []
      let fallOut = false
      this.badUsername = false
      this.badPassword = false
      if (username.trim().length < 2) {
        errMessage.push("Ogiltigt användarnamn")
        this.badUsername = true
        fallOut = true
      }
      if (password.trim().length < 7) {
        console.log("För kort lösenord")
        errMessage.push("Lösenordet måste vara minst 7 tecken långt")
        this.badPassword = true
        fallOut = true
      }
      if (fallOut) {
        this.errString = errMessage.join(", ")
        return
      }
      this.viewSpinner = true
      storageCalls
        .createUser(username, password, firstname, lastname, email)
        .then(
          (response) => {
            console.log("Det gick vägen!")
            localStorage.clear()
            console.log(response)
            this.viewSpinner = false
            this.$router.push("/verify")
          },
          (error) => {
            console.log("Tyvärr, funkante!")
            console.log(error)
            this.viewSpinner = false
          }
        )
    },
  },
}
</script>
