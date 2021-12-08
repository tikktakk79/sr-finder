<template>
  <div>

    <h1 class="top-header">Lyssningstips</h1>
    <div
      v-for="user in userTips"
      class="border-2 mt-10 sm:mx-24 rounded-3xl pb-4"
      :key="user.user"
    >
      <h2 class="text-center mb-8 mt-8">Tipsare: {{ user.user }}</h2>

      <ViewEpisode
        v-for="ep in user.episodes"
        :episode="ep"
        :graded="true"
        :key="ep.id"
        :isTip="true"
      ></ViewEpisode>
    </div>
    <div v-if="userTips.length" class="text-center mt-10">
      <button @click="removeAllTips" class="btn-gray mx-auto">
        Rensa alla tips
      </button>
    </div>
  </div>
</template>

<script>
import ViewEpisode from "@/components/ViewEpisode.vue"
import storageCalls from "@/services/user_storage/StorageCalls.js"
import helper from "@/helper/helper.js"
import { GET_TIPS } from "@/store/actions/user"

export default {
  name: "Tips",
  data() {
    return {
      gradeAction: "Betygsätt",
      updateGrade: false,
    }
  },
  components: {
    ViewEpisode,
  },
  computed: {
    userTips() {
      let allTipsDeepCopy = this.$store.state.user.tipsReceived || []
      let allTips = [...allTipsDeepCopy]
      let users = allTips.map((tip) => tip.tipsare)
      users = [...new Set(users)]

      let storedEpisodes = this.$store.state.user.episodes

      let userTips = users.map((user) => {
        let episodes = allTips.filter((ep) => ep.tipsare === user)

        episodes = helper.episodeFilter(episodes)

        console.log("storedEps", storedEpisodes)
        episodes = episodes.map((ep) => {
          console.log("Ep tips", ep)
          let storedDuplicates = storedEpisodes.filter(
            (epStored) => epStored.episode_id === ep.episode_id
          )

          if (storedDuplicates.length) {
            console.log("A duplicate!", ep)
            console.log("And stored version", storedDuplicates[0])
            let modEp = { ...storedDuplicates[0] }
            modEp.tipsare = ep.tipsare
            return modEp
          }
          ep.saved = false
          return ep
        })
        function compare(a, b) {
          // Use toUpperCase() to ignore character casing
          const idA = a.id
          const idB = b.id

          let comparison = 0
          if (idA > idB) {
            comparison = -1
          } else if (idA < idB) {
            comparison = 1
          }
          return comparison
        }

        episodes.sort(compare)
        return { user, episodes }
      })
      return userTips
    },
    programs() {
      let programs = []
      if (this.$store.state.user.programs) {
        programs = [...this.$store.state.user.programs]
      }
      console.log("programmen", programs)
      programs.sort((a, b) => (a.betyg < b.betyg ? 1 : -1))
      return programs
    },
    storedEpisodes() {
      return this.$store.state.user.episodes
    },
  },
  methods: {
    removeAllTips() {
      this.$confirm(
        "Är du säker på att du vill ta bort alla dina lyssningstips?"
      ).then(
        () => {
          storageCalls.removeAllTips().then(
            () => {
              this.$store.dispatch(GET_TIPS)
            },
            (err) => console.log("Error in removeAllTips", err)
          )
        },
        () => {
          console.log("NOOOOOT DELEETING")
        }
      )
    },
  },
  created() {
    helper.fetchTips(this.$store, this.$alert)
  }
}
</script>
