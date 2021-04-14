<template>
  <div>
    <div class="hidden sm:flex border-box justify-center flex-row">
      <div class="overflow-x-auto">
        <table v-for="user in userList" :key="user.username">
          <th class="px-2">Användarnamn</th>
          <th class="px-2">Förnamn</th>
          <th class="px-2">Efternamn</th>
          <th v-if="showEmail">Epost-adress</th>
          <tr>
            <td class="px-2">{{ user.anvandarnamn }}</td>
            <td class="px-2">{{ user.fornamn }}</td>
            <td class="px-2">{{ user.efternamn }}</td>
            <td v-if="showEmail" class="px-2">{{ user.email }}</td>
            <td v-if="!friendUsers.includes(user.anvandarnamn)" class="px-2">
              <button
                @click="reqFriend(user.anvandarnamn)"
                class="btn-black mx-auto"
              >
                Skicka vänförfrågan
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="sm:hidden flex justify-center">
      <div class="pt-2">
        <div
          class="border-2 py-1 px-2 border-gray-200"
          v-for="user in userList"
          :key="user.username"
        >
          <div class="pb-1">
            <p class="inline-block pr-1"><b>Användarnamn:</b></p>
            <p class="inline-block">{{ user.anvandarnamn }}</p>
          </div>
          <div class="pb-1">
            <p class="inline-block pr-1"><b>Förnamn:</b></p>
            <p class="inline-block">{{ user.fornamn }}</p>
          </div>
          <div class="pb-1">
            <p class="inline-block pr-1"><b>Efternamn:</b></p>
            <p class="inline-block">{{ user.efternamn }}</p>
          </div>
          <div v-if="!friendUsers.includes(user.anvandarnamn)" class="px-2">
            SANT!
            <button
              @click="reqFriend(user.anvandarnamn)"
              class="btn-black mx-auto mb-1.5 mt-1"
            >
              Skicka vänförfrågan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { REQ_FRIEND } from "@/store/actions/user"
export default {
  props: {
    userList: {
      type: Array,
      required: false,
      default: () => [],
    },
    friends: {
      type: Array,
      required: false,
      default: () => [],
    },
    showEmail: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    friendUsers() {
      // let myUser = this.$store.state.user.username
      console.log("friends from friend users", this.friends)
      let users = this.friends.map((val) => val.username)
      console.log("friendUsers", users)
      return users
    },
  },
  methods: {
    reqFriend(receiver) {
      this.$store.dispatch(REQ_FRIEND, receiver).then(
        (resp) => console.log("req friend resp", resp),
        (err) => console.log("req friend ERR", resp)
      )
    },
  },
}
</script>
