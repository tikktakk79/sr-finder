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
      <div class="flex justify-center mt-2">
        <button
          class="btn-black"
          v-if="hasAddButton && !isStored"
          @click="saveEpisode(null)"
        >
          Spara
        </button>
        <button class="btn-black" v-if="hasRemoveButton" @click="removeEpisode">
          Ta bort
        </button>

        <ViewGrade v-if="graded" :grade="episode.grade"></ViewGrade>
        <div v-if="enableGrading && !currentGrade">
          <select class="btn-black pl-3 pr-1" v-model="grade">
            <option disabled value>Betygsätt</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import storageCalls from "@/services/user_storage/StorageCalls.js"
import ViewGrade from "@/components/ViewGrade.vue"
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
  components: { ViewGrade },
  methods: {
    saveEpisode(grade = null) {
      console.log("modEp", this.episode)
      let modEpisode = this.episode
      if (grade) {
        console.log("Setting GRADE", grade)

        modEpisode.grade = grade
      }
      this.$store
        .dispatch(SAVE_EPISODE, modEpisode)

        .then(
          (resp) => {
            console.log("Save episodes response", resp)
          },
          (err) => {
            console.log("Eländes elände!", err)
          }
        )
    },
    removeEpisode() {
      this.$store
        .dispatch(REMOVE_EPISODE, this.episode.episode_id)

        .then(
          (resp) => {
            console.log("Remove episodes response", resp)
          },
          (err) => {
            console.log("Eländes elände!", err)
          }
        )
    },
  },
  computed: {
    isStored: function () {
      let stored = this.$store.state.user.episodes
      let episodeIds = stored.map((ep) => ep.episode_id)
      console.log("Typeof currEPId", typeof this.episode.episode_id)
      console.log("Typeof epId[0]", typeof episodeIds[0])
      let inStorage = episodeIds.includes(this.episode.episode_id)

      console.log("This ep from isStored", this.episode)
      console.log(
        "$store.state.user.episodes isStored",
        this.$store.state.user.episodes
      )

      return inStorage
    },
    currentGrade: function () {
      let graded = false
      let storedEpisodes = []

      if (this.isStored) {
        storedEpisodes = this.$store.state.user.episodes.filter(
          (ep) => ep.episode_id === this.episode.episode_id
        )
      }

      console.log("storedEps", storedEpisodes)

      graded = !!(storedEpisodes.length > 0 && !!storedEpisodes[0].grade)

      if (graded) {
        console.log("This ep is graded!", storedEpisodes[0])
        return storedEpisodes[0].grade
      }

      return undefined
    },
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
    grade: function (val) {
      console.log("VAL for grade", val)
      this.grade = val
      val = parseInt(val)
      console.log("Betyg satt till:", val)
      let episode_id = parseInt(this.episode.episode_id)
      if (!this.isStored) {
        console.log("Ej lagrat, så lagrar med betyg")
        this.saveEpisode(val)
        return
      }
      storageCalls.setGrade(episode_id, val).then(
        (resp) => {
          console.log("Betyg tillades", resp)
          this.$store.dispatch(GET_EPISODES)
        },
        (err) => console.log("Fel vid betygsättningen", err)
      )
    },
    episode: function () {
      this.grade = ""
    },
  },
}
</script>
