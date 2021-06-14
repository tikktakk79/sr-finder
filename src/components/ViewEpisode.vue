<template>
  <div>
    <div v-if="includeProgram" class="flex justify-center">
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
      <p v-if="expanded" class="sm:w-2/3 px-2.5 text-gray-900">
        {{ episode.description }}
      </p>
    </div>
    <div class="flex justify-center items-center">
      <div v-if="expanded" class="mt-3 mb-2">
        <figure class="play">
          <button @click="setPlay" name="play"></button>
        </figure>
      </div>

      <a v-if="expanded" class="ml-2" :href="episode.url" target="_blank"
        >SR-sida</a
      >
    </div>
    <p v-if="expanded" class="text-center text-sm pt-2 mb-4">
      Publicerat: {{ date }}
    </p>

    <EpisodeActions
      :episode="episode"
      :key="episode.episode_id"
      :expanded="expanded"
      :grade="episode.grade"
      :enableGrading="enableGrading"
      :isTip="isTip"
    ></EpisodeActions>
    <div v.if="expanded" class="p-1"></div>
    <div class="border mt-3 mb-4 mx-32"></div>
  </div>
</template>

<script>
import storageCalls from "@/services/user_storage/StorageCalls.js"
import Expand from "@/assets/img/svg/expanded.svg"
import Shrink from "@/assets/img/svg/shrink.svg"

import EpisodeActions from "@/components/EpisodeActions.vue"
import { GET_EPISODES, SET_PLAY } from "@/store/actions/user"
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
    includeProgram: {
      type: Boolean,
      required: false,
      default: true,
    },
    graded: {
      type: Boolean,
      required: false,
      default: false,
    },
    enableGrading: {
      type: Boolean,
      required: false,
      default: true,
    },
    isTip: {
      type: Boolean,
      required: false,
      default: false,
    },
    gradeExt: {
      type: Number,
      required: false,
      default: null,
    },
  },
  components: {
    EpisodeActions,
    Expand,
    Shrink,
  },
  methods: {
    setPlay() {
      this.$store.dispatch(SET_PLAY, this.episode.listen_link)
    },
  },
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
  watch: {
    episode: function () {
      this.expanded = false
    },
  },
}
</script>
<style lang="scss" scoped>
.play {
  display: -ms-flex;
  display: -webkit-flex;
  display: flex;
}

.play button[name="play"] {
  width: 33px;
  height: 33px;
  background: rgb(130, 128, 122);
  border: none;
  border-radius: 100%;
  margin: auto;
  cursor: pointer;

  &:hover {
    background: rgb(165, 163, 156);
  }
}

.play button[name="play"]::after {
  content: "";
  display: inline-block;
  position: relative;
  top: 1px;
  left: 2px;
  border-style: solid;
  border-width: 7px 0 7px 14px;
  border-color: transparent transparent transparent white;
}
</style>
