<template>
  <div>
    <div>
      <h1 class="text-center">Vänsida</h1>
      <div class="text-center mt-0.5">
        <router-link class="btn" to="/user">Sök användare</router-link>
      </div>
    </div>
    <div class="pb-6 border-b-2 border-gray-300 mx-28 mb-6"></div>

    <h2 v-if="reqUsers.length">Hantera vänförfrågningar</h2>
    <table v-for="user in reqUsers" :key="user.anvandarnamn">
      <tr>
        <td>{{ user.username }}</td>
        <td>{{ user.fornamn }}</td>
        <td>{{ user.efternamn }}</td>
        <td v-if="user.godkann !== null && !reqUsers.includes(user.godkann)">
          <button @click="accept(user.username)">Godkänn</button>
          <button @click="deny(user.username)">Ignorera</button>
        </td>
        <td v-if="user.hemligt !== true">
          <router-link :to="{ name: 'grades', params: { user: user.username } }"
            >Betyg</router-link
          >
        </td>
      </tr>
    </table>

    <div v-if="friends.length">
      <h2 class="text-center">Vänner</h2>
      <div class="mb-3 flex justify-center">
        <table class="friends-table">
          <tr v-for="user in friends" :key="user.anvandarnamn">
            <td class="text-right">{{ user.username }}</td>
            <td>
              <router-link
                :to="{ name: 'UserGrades', params: { user: user.username } }"
                >Betyg</router-link
              >
            </td>
            <td><button @click="remove(user.username)">Ta bort</button></td>
          </tr>
        </table>
      </div>
    </div>

    <h2 v-if="waiting.length" class="text-center mb-1">
      Väntar på godkännande
    </h2>
    <div class="mb-3 flex justify-center">
      <table>
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
    remove(username) {
      this.$confirm("Är du säker på att du vill ta bort denna vän?").then(
        () => this.deny(username),
        () => {
          console.log("NOOOOOT DELEETING")
        }
      )
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
        return rel.godkann !== null && rel.godkann !== rel.username
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
}
</script>
