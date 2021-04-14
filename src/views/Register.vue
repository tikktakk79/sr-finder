<template>
  <div>
    <form class="login text-center" @submit.prevent="register">
      <h1>Skapa ny användare</h1>
      <table class="mx-auto input-register mt-3">
        <tr>
          <td align="right" class="py-2.5">
            <label for="username">Användarnamn:</label>
          </td>
          <td align="left">
            <input
              required
              v-model="username"
              type="text"
              placeholder="Snoopy"
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
              placeholder="Password"
              :class="{ 'border-red-400': badPassword }"
            />
            <span class="pl-1">*</span>
          </td>
        </tr>
        <tr>
          <td align="right" class="py-2.5">
            <label for="firstname">Förnamn</label>
          </td>
          <td align="left">
            <input v-model="firstname" type="text" placeholder="Förnamn" />
          </td>
        </tr>
        <tr>
          <td align="right" class="py-2.5">
            <label for="lastname">Efternamn</label>
          </td>
          <td align="left">
            <input v-model="lastname" type="text" placeholder="Efternamn" />
          </td>
        </tr>
        <tr>
          <td align="right" class="py-2.5">
            <label for="email">Email</label>
          </td>
          <td align="left">
            <input v-model="email" type="text" placeholder="Email" />
          </td>
        </tr>
      </table>
      <i class="text-red-700">{{ this.errString }}</i>

      <button type="submit" class="btn-black mx-auto mt-2">Registrera</button>
    </form>
  </div>
</template>

<script>
import { AUTH_REQUEST } from "@/store/actions/auth"
import Store from "@/store"
import { AUTH_LOGOUT } from "@/store"
import User from "@/models/user"
import storageCalls from "@/services/user_storage/StorageCalls.js"
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
    }
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

      storageCalls
        .createUser(username, password, firstname, lastname, email)
        .then(
          (response) => {
            console.log("Det gick vägen!")
            localStorage.clear()
            console.log(response)
            this.$router.push("/login")
          },
          (error) => {
            console.log("Tyvärr, funkante!")
            console.log(error.response.data)
            this.error = error.response.data.message
          }
        )
    },
  },
}
</script>
