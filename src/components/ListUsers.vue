<template>
  <div>
    <div class="hidden sm:flex border-box justify-center flex-row">
      <div class="overflow-x-auto">
        <table v-for="user in modUserList" :key="user.anvandarnamn">
          <th class="px-2 text-left">Användarnamn</th>
          <th class="px-2 text-left">Status</th>
          <tr>
            <td class="px-2">{{ user.anvandarnamn }}</td>
            <td v-if="!friendUsers.includes(user.anvandarnamn)" class="px-2">
              <button
                @click="reqFriend(user.anvandarnamn)"
                class="btn-black mx-auto"
              >
                {{ user.message }}
              </button>
            </td>
            <td v-else-if="user.friendStatus === 'waiting'" class="px-2">
              {{ user.message }}
            </td>
            <td v-else-if="user.friendStatus === 'you'" class="px-2">
              {{ user.message }}
            </td>
            <td v-else-if="user.friendStatus === 'friend'" class="px-2">
              {{ user.message }}
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="sm:hidden flex justify-center">
      <div class="pt-2">
        <div
          class="border-2 py-1 px-2 border-gray-200"
          v-for="user in modUserList"
          :key="user.username"
        >
          <div class="pb-1">
            <p class="inline-block pr-1"><b>Användarnamn:</b></p>
            <p class="inline-block">{{ user.anvandarnamn }}</p>
          </div>
          <div v-if="user.friendStatus === 'none'" class="px-2">
            <button
              @click="reqFriend(user.anvandarnamn)"
              class="btn-black mx-auto mb-1.5 mt-1"
            >
              {{ user.message }}
            </button>
          </div>
          <div v-if="user.friendStatus === 'waiting'" class="px-2">
            <p>{{ user.message }}</p>
          </div>
          <div v-if="user.friendStatus === 'you'" class="px-2">
            <p>{{ user.message }}</p>
          </div>
          <div v-if="user.friendStatus === 'friend'" class="px-2">
            <p>{{ user.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { REQ_FRIEND } from "@/store/actions/user"
import { GET_FRIENDS } from "@/store/actions/user"
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
    friendData() {
      // let myUser = this.$store.state.user.username
      console.log("friends from friend users", this.friends)
      let users = this.friends.map((val) => {
        return { username: val.username, accept: val.godkann }
      })
      console.log("friendUsers", users)
      console.log("vannerna", this.friends)
      return users
    },
    friendUsers() {
      let friendUsers = []
      friendUsers = this.friendData.map((val) => val.username)
      return friendUsers
    },
    modUserList() {
      let arr = this.userList.map((curr) => {
        let newObj = { ...curr }
        let message = ""
        let userStatus = null
        let isFriend = false

        if (!this.friendUsers.includes(curr.anvandarnamn)) {
          message = "Skicka vänförfrågan"
        } else {
          isFriend = true
          let friendProps = this.friendData.filter((user) => {
            console.log("CURR", curr)
            return user.username === curr.anvandarnamn
          })
          console.log("friendProps inside modUserList", friendProps)
          userStatus = friendProps[0].accept
        }

        if (userStatus === "waiting") {
          message = "Väntar på godkännande"
        } else if (userStatus === "you") {
          message = "Väntar på ditt godkännande"
        } else if (userStatus === "friend") {
          message = "Vän"
        }

        newObj.message = message

        return newObj
      })

      return arr
    },
  },
  methods: {
    reqFriend(receiver) {
      this.$store.dispatch(REQ_FRIEND, receiver).then(
        (resp) => {
          console.log("req friend resp", resp)
          this.$store.dispatch(GET_FRIENDS)
        },
        (err) => console.log("req friend ERR", err)
      )
    },
  },
}
</script>
