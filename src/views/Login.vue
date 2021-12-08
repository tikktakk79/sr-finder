<template>
  <div>
    <form @submit.prevent="login">
      <div class="text-center">
        <p
          class="sm:w-96 border-t-2 border-warmgray-300 border-b-2 py-2 px-3 mb-10 text-left mx-auto"
        >
          Betygsätt avsnitt och program på Sveriges Radio
        </p>
      </div>
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
      <button
        v-if="!viewSpinner"
        @login="login"
        type="submit"
        class="btn-black mx-auto mt-3"
      >
        Logga in
      </button>
      <Spinner
        v-if="viewSpinner"
        size=40
        line-size=6
        line-fg-color="#474747"
        line-bg-color="#cccccc"
        speed="1.1"
        message="Loggar in..."
        class="mt-4"
      ></Spinner>
      <router-link
        v-if="!viewSpinner"
        class="mt-6 flex justify-center"
        to="/register"
        >Registrera ny användare</router-link
      >
    </form>
  </div>
</template>

<script>
import { AUTH_REQUEST } from "@/store/actions/auth"
import Spinner from "vue-simple-spinner"
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      viewSpinner: false,
    }
  },

  components: {
    Spinner,
  },

  methods: {
    login: function () {
      this.viewSpinner = true
      const { username, password } = this
      this.$store.dispatch(AUTH_REQUEST, { username, password }).then(() => {
        console.log("Going to/grades")
        this.$router.push("/grades")
      })
    },
  },
}
</script>
