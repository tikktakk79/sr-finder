<template>
  <router-link class="page-nav" to="" @click.native="changePage(pageLink)"
    ><slot></slot
  ></router-link>
</template>

<script>
import srCalls from "@/services/sr_api/ApiCalls.js"
export default {
  props: {
    pageLink: {
      type: String,
      required: true,
      default: () => "",
    },
  },

  methods: {
    changePage(fullAddress) {
      console.log("FULL ADDRESS", fullAddress)
      console.log("Clickked next page")
      srCalls.freeQuery(fullAddress).then((response) => {
        console.log("srcall went well")
        let episodeData = {}
        episodeData.rawEpisodes = response.data.episodes
        episodeData.prevPage = response.data.pagination.previouspage || ""
        episodeData.nextPage = response.data.pagination.nextpage || ""
        this.$emit("change-page", episodeData)
        return
      })
    },
  },
}
</script>
