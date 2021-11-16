<template>
  <div>
    <div
      v-if="!enableGrading || (grade && !editGrade)"
      class="flex justify-center mt-2"
    >
      <ViewGrade v-if="!enableGrading">{{ this.episode.grade }}</ViewGrade>
      <ViewGrade v-else-if="grade && !editGrade" @grade-click="setEditGrade">{{
        this.grade
      }}</ViewGrade>
    </div>
    <div v-if="isTip" class="text-center">
      <button @click="removeTip" class="btn-gray mx-auto mt-4 mb-4">
        Ta bort från tips
      </button>
    </div>
    <div
      v-if="enableGrading && (!grade || editGrade)"
      class="flex justify-center"
    >
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

    <div class="text-center mt-3">
      <a v-if="enableTip" @click="activateTip" class="tip-link">Tipsa vän</a>
    </div>
    <div v-if="tipAction" class="flex justify-center items-center mt-8">
      <p v-if="!selectionMade" class="inline-block mr-1">Tipsa vän:</p>

      <v-select
        class="friend-select"
        :options="friendsEnabled"
        label="username"
        :value="selectedFriend"
        @input="setSelected"
      ></v-select>
      <button v-if="selectionMade" @click="sendTip" class="btn-black">
        Skicka tips
      </button>
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
  SEND_TIP,
  GET_TIPS,
} from "@/store/actions/user"
export default {
  data() {
    return {
      grade: "",
      gradeStored: "",
      stored: false,
      gradeAction: "Betygsätt",
      editGrade: false,
      tipAction: false,
      selectionMade: false,
      selectedFriend: "",
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
  },
  computed: {
    ...mapGetters({
      allEpisodeIds: "getEpisodeIds",
      episodes: "getEpisodes",
    }),
    enableTip() {
      if (this.expanded && this.friendsEnabled.length && !this.tipAction) {
        return true
      }
      return false
    },
    friendsEnabled() {
      let friendUsers = this.$store.state.user.friends

      let friendsEnabled = friendUsers.filter((friend) => {
        console.log("friend in friendsEnabled", friend)
        console.log("tipsSent in friendsEnabled", this.tipsSent)
        let duplicateTips = this.tipsSent.filter((tip) => {
          if (
            friend.username === tip.anvandare &&
            tip.avsnitt === this.episode.episode_id
          ) {
            console.log("DUplicate found!!!")
            return true
          }
          return false
        })
        if (duplicateTips.length) {
          return false
        }
        return true
      })
      return friendsEnabled
    },
    tipsSent() {
      return this.$store.state.user.tipsSent
    },
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
    activateTip() {
      this.tipAction = true
    },
    setSelected(val) {
      this.selectionMade = true
      this.selectedFriend = val.username
    },
    sendTip() {
      console.log("Episode in sendTip", this.episode)
      this.tipAction = false
      this.$store
        .dispatch(SEND_TIP, {
          episode: this.episode,
          username: this.selectedFriend,
        })
        .then(
          () => {
            this.$store.dispatch(GET_TIPS)
          },
          (err) => {
            console.log("Error in sendTip in EpisodeActions", err)
          }
        )
      this.selectedFriend = ""
    },
    removeTip() {
      console.log("removeTip type", storageCalls.removeTip)
      storageCalls
        .removeTip(this.episode.episode_id, this.episode.tipsare)
        .then(() => {
          this.$store.dispatch(GET_TIPS)
        })
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
        this.tipAction = false
        this.selectionMade = false
      }
    },
  },
}
</script>
<style>
@media screen and (max-width: 370px) {
  .mini-screen {
    display: none;
  }
}

.vs__open-indicator {
  cursor: pointer;
}

.tip-link {
  cursor: pointer;
}
</style>
