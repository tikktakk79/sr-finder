<template>
  <div>
    <form class="login" @submit.prevent="login">
      <h1>Sign in</h1>
      <label>User name</label>
      <input required v-model="username" type="text" placeholder="Snoopy" />
      <label>Password</label>
      <input
        required
        v-model="password"
        type="password"
        placeholder="Password"
      />
      <hr />
      <button type="submit">Login</button>
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
