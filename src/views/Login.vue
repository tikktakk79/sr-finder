<template>
  <div>
    <form @submit.prevent="login">
      <h1 class="text-center">Logga in</h1>

      <table class="mx-auto input-userdata mt-3">
        <tr>
          <td align="right" class="py-2.5">
            <label for="username">Användarnamn:</label>
          </td>
          <td align="left">
            <input class="w-28" required v-model="username" type="text" />
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
              autocomplete="on"
              class="w-28"
            />
          </td>
        </tr>
      </table>
      <button @login="login" type="submit" class="btn-black mx-auto mt-3">
        Logga in
      </button>
      <router-link class="mt-6 flex justify-center" to="/register"
        >Registrera ny användare</router-link
      >
    </form>
  </div>
</template>

<script>
import { AUTH_REQUEST } from "@/store/actions/auth"
import User from "@/models/user"
import storageCalls from "@/services/user_storage/StorageCalls.js"
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    }
  },

  methods: {
    login: function () {
      const { username, password } = this
      this.$store.dispatch(AUTH_REQUEST, { username, password }).then(() => {
        console.log("Going to/grades")
        this.$router.push("/grades")
      })
    },
  },
}
</script>
