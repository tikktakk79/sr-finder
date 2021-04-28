<template>
  <div class="flex justify-center mt-2">
    <ViewGrade v-if="grade && !editGrade" @grade-click="setEditGrade">{{
      this.grade
    }}</ViewGrade>

    <div v-else class="flex justify-center">
      <p
        class="mini-screen font-bold bg-warmgray-500 px-1 text-white"
        v-if="!this.gradeAction.length"
      >
        Ändra betyg:
      </p>
      <select
        v-if="expanded || editGrade"
        class="btn-black pl-3 pr-1"
        v-model="grade"
      >
        <option v-if="this.gradeAction.length" disabled value>
          {{ this.gradeAction }}
        </option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
    <button
      class="btn-black"
      v-if="!stored && (expanded || editGrade)"
      @click="saveEpisode(null)"
    >
      Spara
    </button>
    <button
      class="btn-black"
      v-if="(expanded && stored && gradeStored === null) || editGrade"
      @click="removeEpisode"
    >
      Ta bort
    </button>
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
      editGrade: false,
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
    expanded: {
      type: Boolean,
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
      // console.log("Runs update grade")
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
        // console.log("no length")
        this.stored = false
        this.gradeStored = ""
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
            this.editGrade = false
            this.grade = ""
          },
          (err) => {
            console.log("Eländes elände!", err)
          }
        )
    },
    setEditGrade() {
      console.log("Setting editGrade")
      if (this.grade) {
        this.editGrade = true
        this.gradeAction = ""
      }
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
      if (!this.stored) {
        console.log("Ej lagrat, så lagrar med betyg")
        this.saveEpisode(val)
        return
      }
      storageCalls.setGrade(episode_id, val).then(
        (resp) => {
          console.log("Betyg tillades", resp)
          this.$store.dispatch(GET_EPISODES)
          this.stored = true
        },
        (err) => console.log("Fel vid betygsättningen", err)
      )
      this.editGrade = false
    },
    stored: function () {
      if (!this.stored) {
        this.grade = ""
        this.gradeAction = "Betygsätt"
      }
    },
    expanded: function (newVal) {
      if (!newVal) {
        this.editGrade = false
      }
    },
  },
}
</script>
<style scoped>
@media screen and (max-width: 370px) {
  .mini-screen {
    display: none;
  }
}
</style>
