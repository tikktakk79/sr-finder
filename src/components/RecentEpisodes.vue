<template>
  <div>
    <div class="flex justify-center py-1.5">
      <input
        class="border rounded-xl px-3 py-1"
        v-model="searchString"
        list="prg"
      />
    </div>
    <div v-if="searchString" class="pt-4">
      <ProgramName
        @got-episodes="renderEpisodes"
        v-for="prog in filteredList"
        :prog="prog"
        :key="prog.id"
      ></ProgramName>
    </div>
    <div class="pt-6 pb-4" v-if="episodes.length">
      <h1 class="text-center mb-2">
        {{ episodes[0].program_name }} - senaste avsnitten
      </h1>
      <div class="flex justify-center">
        <p
          class="mini-screen font-bold bg-warmgray-500 px-1 text-white"
          v-if="false"
        >
          Ändra betyg:
        </p>
        <div v-if="!currentGrade || updateGrade">
          <select class="btn-black pl-3 pr-1" v-model="programGrade">
            <option v-if="true" disabled value>
              {{ this.gradeAction }}
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div v-else>
          <ViewGrade @grade-click="setUpdate">{{ currentGrade }}</ViewGrade>
        </div>
        <button
          class="btn-black"
          v-if="updateGrade"
          @click="removeGrade(currentProgram.id)"
        >
          Ta bort
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
    <PageLink v-if="prevPage" :pageLink="prevPage" @change-page="changePage"
      >Föregående sida</PageLink
    >
    <PageLink v-if="nextPage" :pageLink="nextPage" @change-page="changePage"
      >Nästa sida</PageLink
    >
  </div>
</template>

<script>
import srCalls from "@/services/sr_api/ApiCalls.js"
import ViewEpisode from "@/components/ViewEpisode.vue"
import PageLink from "@/components/PageLink.vue"
import ProgramName from "@/components/ProgramName.vue"
import ViewGrade from "@/components/ViewGrade.vue"
import storageCalls from "@/services/user_storage/StorageCalls.js"
import {
  GRADE_PROGRAM,
  UPDATE_PROGRAM,
  DELETE_PROGRAM,
} from "@/store/actions/user"
export default {
  name: "RecentEpisodes",
  data() {
    return {
      searchString: "",
      programs: [],
      episodes: [],
      nextPage: "",
      prevPage: "",
      programGrade: "",
      updateGrade: false,
      allowGradeUpdate: true,
      gradeAction: "Betygsätt",
    }
  },
  components: { ProgramName, ViewEpisode, ViewGrade, PageLink },
  methods: {
    renderEpisodes(episodes, prevpage, nextpage) {
      console.log("EPS", episodes)
      this.episodes = episodes
      this.prevPage = prevpage || ""
      this.nextPage = nextpage || ""
      console.log("GOT This far in renderEpisodes in RecentEpisodes")
      this.searchString = ""
      this.programGrade = ""
      this.updateGrade = false
    },
    changePage(episodeData) {
      console.log("Change page in recent episodes")
      console.log("ep data", episodeData)
      this.episodes = episodeData.rawEpisodes
      this.prevPage = episodeData.prevPage || ""
      this.nextPage = episodeData.nextPage || ""
    },
    gradeProgram(grade, programId, programName) {
      let gradedProgram = { grade, programId, programName }
      console.log("programGrade from gradeProgram", this.programGrade)
      console.log("currentGrade from gradeProgram", this.currentGrade)
      if (grade && this.currentGrade === "") {
        console.log("this.gradedProgram from gradeProgram()", gradedProgram)
        this.$store
          .dispatch(GRADE_PROGRAM, gradedProgram)

          .then(
            (resp) => {
              console.log("Save program response", resp)
            },
            (err) => {
              console.log("Eländes elände!", err)
            }
          )
      } else if (grade && this.currentGrade !== grade) {
        console.log("Running update program")
        this.$store
          .dispatch(UPDATE_PROGRAM, { programId, grade })

          .then(
            (resp) => {
              console.log("Update program response", resp)
              this.updateGrade = false
            },
            (err) => {
              console.log("Eländes elände!", err)
            }
          )
      }
    },
    setUpdate() {
      this.updateGrade = true
    },
    removeGrade(programId) {
      console.log("Running remove grade")
      this.$store
        .dispatch(DELETE_PROGRAM, programId)

        .then(
          (resp) => {
            console.log("Delete program response", resp)
            this.updateGrade = false
          },
          (err) => {
            console.log("Eländes elände från deleteProgram!", err)
          }
        )
    },
  },
  watch: {
    programGrade(oldVal, newVal) {
      console.log("ProgramGrade changed")
      this.gradeProgram(
        this.programGrade,
        this.currentProgram.id,
        this.currentProgram.name
      )
    },
    currentGrade() {
      this.programGrade = this.currentGrade
    },
  },

  computed: {
    filteredList() {
      let result = []
      if (this.searchString.length > 1) {
        result = this.programs.filter((prog) => {
          return prog.name
            .toLowerCase()
            .includes(this.searchString.toLowerCase())
        })
      }
      return result.slice(0, 10)
    },
    currentProgram() {
      console.log("currentProgram UPDATE!!")
      console.log("episode 1 from currentProgram()", this.episodes[0])
      if (this.episodes.length) {
        return {
          id: String(this.episodes[0].program_id),
          name: this.episodes[0].program_name,
        }
      } else {
        console.log("Returning undefined from currentProgram")
        return undefined
      }
    },

    storedPrograms() {
      console.log("stored programs is recalculated")
      let allPrograms = this.$store.state.user.programs
      console.log("All stored programs", allPrograms)
      return allPrograms
    },
    currentGrade() {
      console.log("programIds UPDATE!!")
      console.log("Running programIds")
      if (this.storedPrograms.length && this.currentProgram) {
        console.log("Stored progs from progIds", this.storedPrograms)
        console.log("currentProg id", this.currentProgram.id)
        console.log("currentProg type", typeof this.currentProgram.id)

        let storedProg = this.storedPrograms.filter((prog) => {
          return parseInt(prog.programid) === parseInt(this.currentProgram.id)
        })
        console.log("storedProg", storedProg)
        if (storedProg.length) {
          return storedProg[0].betyg
        }
      }
      return ""
    },
  },

  created() {
    srCalls.getPrograms().then((resp) => {
      console.log("PROGRAM", resp.data)
      this.programs = resp.data.programs
      console.log("CG in created", this.currentGrade)
    })
  },
}
</script>
