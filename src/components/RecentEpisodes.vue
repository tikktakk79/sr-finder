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
        <div v-if="!gradedProgram">
          <select class="btn-black pl-3 pr-1" v-model="programGrade">
            <option disabled value>
              Betygsätt {{ episodes[0].program_name }}
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div v-else>
          <p>Betyg: {{ programGrade }}</p>
        </div>
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
import storageCalls from "@/services/user_storage/StorageCalls.js"
import { GRADE_PROGRAM } from "@/store/actions/user"
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
      gradedProgram: undefined,
    }
  },
  components: { ProgramName, ViewEpisode, PageLink },
  methods: {
    renderEpisodes(episodes, prevpage, nextpage) {
      console.log("EPS", episodes)
      this.episodes = episodes
      this.prevPage = prevpage || ""
      this.nextPage = nextpage || ""
      console.log("GOT This far in renderEpisodes in RecentEpisodes")
      this.searchString = ""
    },
    changePage(episodeData) {
      console.log("Change page in recent episodes")
      console.log("ep data", episodeData)
      this.episodes = episodeData.rawEpisodes
      this.prevPage = episodeData.prevPage || ""
      this.nextPage = episodeData.nextPage || ""
    },
    gradeProgram(grade, programId, programName) {
      if (grade) {
        this.gradedProgram = { grade, programId, programName }
      }
      console.log("this.gradedProgram from gradeProgram()", this.gradedProgram)
      this.$store
        .dispatch(GRADE_PROGRAM, this.gradedProgram)

        .then(
          (resp) => {
            console.log("Save episodes response", resp)
          },
          (err) => {
            console.log("Eländes elände!", err)
          }
        )
    },
  },
  watch: {
    programGrade() {
      this.gradeProgram(
        this.programGrade,
        this.currentProgram.id,
        this.currentProgram.name
      )
      this.gradedProgram = true
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
      console.log("episode 1 from currentProgram()", this.episodes[0])
      if (this.episodes.length) {
        return {
          id: this.episodes[0].program_id,
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
    programIds() {
      if (this.storedPrograms.length) {
        let Ids = this.storedPrograms.filter((prog) => prog.grade)
        console.log("prog Ids: ", Ids)
        return Ids
      }
      return undefined
    },
  },
  created() {
    srCalls.getPrograms().then((resp) => {
      console.log("PROGRAM", resp.data)
      this.programs = resp.data.programs
    })
  },
}
</script>
