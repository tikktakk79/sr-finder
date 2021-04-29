<template>
  <div>
    <div class="border my-3 mx-32"></div>
    <div class="p-4 border-gray-200">
      <div class="flex justify-center">
        <p class="mb-2 bg-gray-600 text-white font-bold px-2">
          {{ episode.program_name }}
        </p>
      </div>

      <div class="flex justify-center mb-2">
        <div class="mt-0.5 h-6 w-6">
          <Expand v-if="!expanded" @click="expanded = true" />
          <Shrink v-if="expanded" @click="expanded = false" />
        </div>
        <h2 class="px-2 w-5/6 sm:w-3/5">
          {{ episode.title }}
        </h2>
      </div>
      <div class="flex justify-center">
        <p v-if="expanded" class="sm:w-3/4 text-gray-900">
          {{ episode.description }}
        </p>
      </div>
      <p v-if="expanded" class="text-center text-sm pt-2 mb-4">
        Publicerat: {{ date }}
      </p>

      <EpisodeActions
        :episode="episode"
        :key="episode.episode_id"
        :expanded="expanded"
      ></EpisodeActions>
    </div>
  </div>
</template>

<script>
import storageCalls from "@/services/user_storage/StorageCalls.js"
import Expand from "@/assets/img/svg/expand.svg"
import Shrink from "@/assets/img/svg/shrink.svg"

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
      expanded: false,
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
  components: { EpisodeActions, Expand, Shrink },
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
