<template>
  <div class="border-box">
    <h1 class="text-center">Sök användare</h1>
    <div class="text-center">
      <table class="input-first mx-auto mt-3">
        <tr>
          <td align="right" class="py-2.5">
            <label for="username">Användarnamn:</label>
          </td>
          <td><input id="username" class="px-2 w-36" v-model="username" /></td>
          <td class="hidden sm:invisible sm:block">Användarnamn:x</td>
        </tr>
      </table>
    </div>

    <button @click="fetchUsers()" type="submit" class="btn-black mx-auto mt-2">
      Sök
    </button>

    <ListUsers :userList="userList" :friends="friends" class="pt-5"></ListUsers>
  </div>
</template>

<script>
import storageCalls from "@/services/user_storage/StorageCalls.js"
import friendCalls from "@/services/user_storage/FriendCalls.js"
import ListUsers from "@/components/ListUsers.vue"
import { GET_FRIENDS } from "@/store/actions/user"

export default {
  name: "SearchUser",
  data() {
    return {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      userList: [],
    }
  },
  components: {
    ListUsers,
  },
  computed: {
    friends() {
      return this.$store.state.user.friends
    },
  },
  methods: {
    fetchUsers() {
      storageCalls
        .searchUser(this.username, this.firstname, this.lastname, this.email)
        .then((resp) => {
          console.log("RESP", resp)

          this.userList = resp
          console.log("userlist", this.userList)

          return resp
        })
    },
  },
  created() {
    this.$store.dispatch(GET_FRIENDS).then(
      (resp) => {
        console.log("Got friends", resp)
      },
      (err) => {
        console.log("Eländes elände!", err)
      }
    )
  },
}
</script>
