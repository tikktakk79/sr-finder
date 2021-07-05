<template>
  <div>
    <h1 class="top-header">Sparade avsnitt</h1>
    <div class="top-border"></div>
    <ViewEpisode
      v-for="episode in episodes"
      :episode="episode"
      :hasRemoveButton="true"
      :key="episode.id"
    ></ViewEpisode>
  </div>
</template>

<script>
import ViewEpisode from "@/components/ViewEpisode.vue"
import storageCalls from "@/services/user_storage/StorageCalls.js"
export default {
  name: "StoredEpisodes",
  data() {
    console.log("LAGrade episoder:", this.$store.state.user.episodes)
    return {
      searchstring: "",
    }
  },
  components: {
    ViewEpisode,
  },
  computed: {
    episodes: function () {
      console.log("Nu e ja här..")
      let allEpisodes = this.$store.state.user.episodes
      let episodes = allEpisodes.filter((ep) => ep.grade === null)
      return episodes.reverse()
    },
  },
}
</script>
