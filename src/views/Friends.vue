<template>
  <div>
    <div>
      <h1 class="text-center">Vänsida</h1>
      <div class="text-center mt-1.5">
        <router-link class="btn" to="/tips">Visa lyssningstips</router-link>
      </div>
      <div class="text-center mt-1.5">
        <router-link class="btn" to="/user">Sök användare</router-link>
      </div>
    </div>
    <div class="pb-6 border-b-2 border-gray-300 mx-28 mb-6"></div>

    <h2 v-if="reqUsers.length" class="text-center">Hantera vänförfrågningar</h2>
    <div v-if="reqUsers.length" class="mb-3 mt-3 flex justify-center">
      <table class="hidden sm:block bg-gray-50 table-auto">
        <tr
          v-for="user in reqUsers"
          :key="user.anvandarnamn"
          class="border-2 border-r-0 border-l-0 bg-gray-50"
        >
          <td v-if="user.hemligt">
            <h2 class="text-center pl-3">{{ user.username }}</h2>
          </td>
          <td v-if="!user.hemligt" class="pl-3 pr-3">
            <router-link
              :to="{ name: 'UserPage', params: { user: user.username } }"
              ><h2>{{ user.username }}</h2></router-link
            >
          </td>
          <td class="px-1.5 py-4 pr-3" v-if="friendButton(user)">
            <button class="btn-black mx-auto" @click="accept(user.username)">
              Godkänn
            </button>
          </td>
          <td>
            <button class="btn-black mx-auto mr-3" @click="deny(user.username)">
              Ignorera
            </button>
          </td>
        </tr>
      </table>
    </div>
    <div
      class="block sm:hidden pt-1 mb-1 border-2 border-r-0 border-l-0 bg-gray-50"
      v-for="user in reqUsers"
      :key="user.anvandarnamn"
    >
      <div v-if="user.hemligt">
        <h2 class="flex justify-center pl-3">{{ user.username }}</h2>
      </div>
      <div v-if="!user.hemligt" class="flex justify-center pl-3 pr-3">
        <router-link :to="{ name: 'UserPage', params: { user: user.username } }"
          ><h2>{{ user.username }}</h2></router-link
        >
      </div>
      <div
        class="flex justify-center px-1.5 pt-2 pb-3 pr-3"
        v-if="friendButton(user)"
      >
        <button class="inline-block btn-black" @click="accept(user.username)">
          Godkänn
        </button>

        <button class="inline-block btn-black" @click="deny(user.username)">
          Ignorera
        </button>
      </div>
    </div>

    <div v-if="friends.length">
      <h2 class="text-center mb-1 mt-8">Vänner</h2>
      <div
        class="mb-2 flex justify-center"
        v-for="user in friends"
        :key="user.anvandarnamn"
      >
        <div class="mt-1">
          <router-link
            :to="{
              name: 'UserPage',
              params: { user: user.username, friendStatus: true },
            }"
            ><h2>{{ user.username }}</h2></router-link
          >
        </div>
      </div>
    </div>

    <h2 v-if="waiting.length" class="text-center mb-1">
      Väntar på godkännande
    </h2>
    <div class="mb-3 flex justify-center">
      <table class="mt-5">
        <tr class="pb-1" v-for="user in waiting" :key="user.anvandarnamn">
          <td>{{ user.username }}</td>
          <td>{{ user.fornamn }}</td>
          <td>{{ user.efternamn }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import friendCalls from "@/services/user_storage/FriendCalls.js"
import { GET_FRIENDS } from "@/store/actions/user"

export default {
  name: "Friends",
  methods: {
    accept(username) {
      console.log("Accepting friend", username)
      friendCalls.acceptFriend(username).then((resp) => {
        console.log("Friend accepted", resp)
        this.$store.dispatch(GET_FRIENDS)
      }),
        (err) => console.log("Could not accept friend", { err })
    },
    deny(username) {
      friendCalls.deleteFriend(username).then((resp) => {
        console.log("Friend relation deleted", resp)
        this.$store.dispatch(GET_FRIENDS)
      }),
        (err) => console.log("Could not delete friend", { err })
    },

    friendButton(user) {
      if (user.godkann !== null && !this.reqUsers.includes(user.godkann)) {
        return true
      }
      return false
    },
  },
  computed: {
    relations() {
      console.log(
        "this.$store.state.user.friends",
        this.$store.state.user.friends
      )
      return this.$store.state.user.friends
    },
    reqUsers() {
      let users = this.relations.filter((rel) => {
        return rel.godkann !== null && rel.godkann === "you"
      })
      console.log("users from reqUsers prop", users)
      console.log("reqUsers length", users.length)
      return users
    },
    friends() {
      let users = this.relations.filter((rel) => !rel.godkann)
      console.log("users from friends prop", users)
      return users
    },
    waiting() {
      let users = this.relations.filter((rel) => {
        return rel.godkann !== null && rel.godkann === rel.username
      })
      console.log("users from frineds prop", users)
      return users
    },
  },
  created() {
    this.$store.dispatch(GET_FRIENDS)
  },
}
</script>
