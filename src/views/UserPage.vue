<template>
  <div>
    <h1 class="text-center">Användare: {{ user }}</h1>
    <div class="pb-6 border-b-2 border-gray-300 mx-28 mb-6"></div>
    <h2 class="mt-3 mb-6 text-center">Betygsatta avsnitt</h2>

    <ViewEpisode
      v-for="ep in gradedEpisodes"
      :episode="ep"
      :graded="true"
      :key="ep.id"
      :enableGrading="false"
      :gradeExt="ep.grade"
    ></ViewEpisode>
    <h2 class="mt-6 mb-6 text-center">Programbetyg</h2>
    <div v-for="prog in sortedPrograms" :key="prog.id">
      <div class="flex justify-center mt-3">
        <p class="mb-2 bg-gray-600 text-white font-bold px-2">
          {{ prog.programnamn }}
        </p>
      </div>
      <div class="flex justify-center mb-4">
        <ViewGrade>{{ prog.betyg }}</ViewGrade>
      </div>
    </div>
    <div class="mt-12 text-center">
      <div class="inline-block pl-1.5 pr-3 py-3 bg-gray-100">
        <button
          v-if="friendStatus"
          class="inline-block btn-black"
          @click="remove(user)"
        >
          Ta bort vän
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import storageCalls from "@/services/user_storage/StorageCalls.js"
import ViewEpisode from "@/components/ViewEpisode.vue"
import helper from "@/helper/helper.js"
import ViewGrade from "@/components/ViewGrade.vue"
import friendCalls from "@/services/user_storage/FriendCalls.js"
import { GET_FRIENDS } from "@/store/actions/user"
export default {
  name: "UserPage",
  data() {
    return {
      storedEpisodes: [],
      gradedPrograms: [],
    }
  },
  components: { ViewEpisode, ViewGrade },
  props: {
    user: {
      type: String,
      required: true,
    },
    friendStatus: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  created() {
    console.log("this.user", this.user)
    storageCalls.getUserEpisodes(this.user).then(
      (resp) => {
        console.log("RESP getUserEpisodes", resp)
        this.storedEpisodes = resp
      },
      (err) => {
        console.log("Error in getUserEpisodes", err)
      }
    )
    storageCalls.getUserPrograms(this.user).then(
      (resp) => {
        console.log("RESP getUserPrograms", resp)
        this.gradedPrograms = resp
      },
      (err) => {
        console.log("Error in getUserPrograms", err)
      }
    )
  },
  methods: {
    remove(username) {
      console.log("running remove")
      this.$confirm("Är du säker på att du vill ta bort denna vän?").then(
        () => {
          this.deny(username).then(this.$router.push({ path: "/friends" }))
        },
        () => {
          console.log("NOOOOOT DELEETING")
        }
      )
    },
    deny(username) {
      return (
        friendCalls.deleteFriend(username).then((resp) => {
          console.log("Friend relation deleted", resp)
          this.$store.dispatch(GET_FRIENDS)
        }),
        (err) => console.log("Could not delete friend", { err })
      )
    },
  },
  computed: {
    gradedEpisodes() {
      let allEpisodes = this.storedEpisodes
      console.log("allEpisodes", allEpisodes)
      let episodes = allEpisodes.filter((ep) => ![null, ""].includes(ep.betyg))
      episodes = helper.episodeFilter(episodes)
      episodes.sort((a, b) => (a.grade < b.grade ? 1 : -1))
      return episodes
    },
    sortedPrograms() {
      let programs = this.gradedPrograms
      programs.sort((a, b) => (a.betyg < b.betyg ? 1 : -1))
      return programs
    },
  },
}
</script>
