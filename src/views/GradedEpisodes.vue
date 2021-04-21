<template>
  <div>
    <h1 class="top-header">Betyg</h1>
    <ViewEpisode
      v-for="ep in gradedEpisodes"
      :episode="ep"
      :graded="true"
      :key="ep.id"
    ></ViewEpisode>
  </div>
</template>

<script>
import ViewEpisode from "@/components/ViewEpisode.vue"
import storageCalls from "@/services/user_storage/StorageCalls.js"
export default {
  name: "GradedEpisodes",
  components: {
    ViewEpisode,
  },
  computed: {
    gradedEpisodes: function () {
      console.log("graded episodes is recalculated")
      let allEpisodes = this.$store.state.user.episodes
      console.log("All stored episodes", allEpisodes)
      let graded = allEpisodes.filter((ep) => ep.grade !== null)
      console.log("GRADED", graded)
      return graded
    },
  },
}
</script>
