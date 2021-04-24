<template>
  <div>
    <div class="border my-3 mx-36"></div>
    <div class="p-4 border-gray-200">
      <div class="flex justify-center">
        <p class="mb-2 bg-gray-600 text-white font-bold px-2">
          {{ episode.program_name }}
        </p>
      </div>
      <h2 class="text-center mb-2 mx-6 px-4">
        {{ episode.title }}
      </h2>
      <p class="text-gray-900 px-2">{{ episode.description }}</p>
      <p class="text-center text-sm pt-2">Publicerat: {{ date }}</p>

      <EpisodeActions
        :episode="episode"
        :key="episode.episode_id"
      ></EpisodeActions>
    </div>
  </div>
</template>

<script>
import storageCalls from "@/services/user_storage/StorageCalls.js"
import EpisodeActions from "@/components/EpisodeActions.vue"
import {
  SAVE_EPISODE,
  REMOVE_EPISODE,
  GET_EPISODES,
} from "@/store/actions/user"
export default {
  data() {
    return {
      grade: "",
    }
  },
  props: {
    episode: {
      type: Object,
      required: true,
    },
    hasAddButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasRemoveButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    graded: {
      type: Boolean,
      required: false,
      default: false,
    },
    enableGrading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: { EpisodeActions },
  computed: {
    date: function () {
      let dateRaw = this.episode.pub_datum_utc
      let modDate = null

      if (dateRaw) {
        dateRaw = dateRaw.slice(dateRaw.indexOf("(") + 1, dateRaw.indexOf(")"))
        let date = new Date(parseInt(dateRaw))

        modDate = date.toISOString().substring(0, 10)
      }
      return modDate
    },
  },
}
</script>
