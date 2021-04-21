<template>
  <div class="flex justify-center mt-2">
    <button class="btn-black" v-if="!stored" @click="saveEpisode(null)">
      Spara
    </button>
    <button
      class="btn-black"
      v-if="stored && gradeStored === null"
      @click="removeEpisode"
    >
      Ta bort
    </button>
    <ViewGrade v-if="grade">{{ this.grade }}</ViewGrade>
    <div v-else>
      <select class="btn-black pl-3 pr-1" v-model="grade">
        <option disabled value>{{ this.gradeAction }}</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
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
      gradeStored: "",
      stored: false,
      gradeAction: "Betygsätt",
    }
  },
  components: { ViewGrade },
  created: function () {
    this.updateGrade()
  },
  props: {
    episode: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      allEpisodeIds: "getEpisodeIds",
      episodes: "getEpisodes",
    }),
  },

  methods: {
    updateGrade: function () {
      let currEp = this.episodes.filter(
        (ep) => ep.episode_id === this.episode.episode_id
      )

      if (currEp.length) {
        console.log("has length")
        let epGrade = currEp[0].grade
        this.stored = true
        this.gradeStored = epGrade
        this.grade = epGrade ?? ""
      } else {
        this.stored = false
      }
    },
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
  watch: {
    episodes: function () {
      this.updateGrade()
    },
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
  },
}
</script>
