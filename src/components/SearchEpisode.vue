<template>
  <div>
    <div>
      <div class="flex justify-center py-1.5 mb-12">
        <input
          class="border rounded-xl px-3 py-1"
          v-model="searchstring"
          @keyup.enter="fetchEpisodes(searchstring)"
        />

        <button
          class="btn-black my-0.5"
          @click="fetchEpisodes(searchstring)"
          type="submit"
        >
          Sök
        </button>
      </div>
    </div>

    <ViewEpisode
      v-for="episode in episodes"
      :episode="episode"
      :hasAddButton="true"
      :key="episode.id"
      :enableGrading="true"
    ></ViewEpisode>

    <div class="flex justify-center my-4">
      <PageLink
        v-if="prevPage"
        :pageLink="prevPage"
        @change-page="changePage"
        class="mx-2"
        >Föregående sida</PageLink
      >
      <PageLink
        v-if="nextPage"
        :pageLink="nextPage"
        @change-page="changePage"
        class="mx-2"
        >Nästa sida</PageLink
      >
    </div>
  </div>
</template>

<script>
import srCalls from "@/services/sr_api/ApiCalls.js"
import ViewEpisode from "@/components/ViewEpisode.vue"
import PageLink from "@/components/PageLink.vue"
export default {
  name: "SearchEpisode",
  data() {
    return {
      searchstring: "tennis",
      rawEpisodes: [],
      nextPage: "",
      prevPage: "",
    }
  },
  components: {
    ViewEpisode,
    PageLink,
  },
  methods: {
    fetchEpisodes(query) {
      srCalls.searchEpisodes(query).then((response) => {
        this.rawEpisodes = response.data.episodes
        this.prevPage = response.data.pagination.previouspage || ""
        this.nextPage = response.data.pagination.nextpage || ""
        console.log("prevpage", this.prevPage)
        console.log("nextpage", this.nextPage)
        console.log(this.rawEpisodes)
        return response
      })
    },
    changePage(episodeData) {
      console.log("EP data from changePage: ", episodeData)
      this.rawEpisodes = episodeData.rawEpisodes
      this.prevPage = episodeData.prevPage || ""
      this.nextPage = episodeData.nextPage || ""
    },
  },
  computed: {
    episodes: function () {
      let modEpisodes = this.rawEpisodes.map((rawEp) => {
        let mod = {
          episode_id: rawEp.id,
          title: rawEp.title,
          description: rawEp.description,
          url: rawEp.url,
          program_name: rawEp.program.name,
          program_id: rawEp.program.id,
          pub_datum_utc: rawEp.publishdateutc,
          grade: null,
        }
        return mod
      })
      console.log("Modepisodes", modEpisodes)
      return modEpisodes
    },
  },
}
</script>
