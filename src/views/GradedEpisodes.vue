<template>
  <div>
    <h1 class="top-header">Betyg - avsnitt</h1>
    <div class="top-border"></div>
    <ViewEpisode
      v-for="ep in gradedEpisodes"
      :episode="ep"
      :graded="true"
      :key="ep.id"
    ></ViewEpisode>

    <h1 class="top-header mt-24">Betyg - program</h1>
    <div class="top-border"></div>
    <div v-for="prog in programs" :key="prog.id">
      <div class="flex justify-center">
        <p class="mb-2 bg-gray-600 text-white font-bold px-2">
          {{ prog.programnamn }}
        </p>
      </div>
      <ProgramAction
        class="mb-6"
        :currentGrade="prog.betyg"
        :updateGrade="updateGrade"
        :gradeAction="gradeAction"
        :programId="prog.programid"
        :programName="prog.programnamn"
      ></ProgramAction>
      <!-- <div class="flex justify-center">
        <ViewGrade class="mb-6">{{ prog.betyg }}</ViewGrade>
      </div> -->
    </div>
  </div>
</template>

<script>
import ViewEpisode from "@/components/ViewEpisode.vue"
import ProgramAction from "@/components/ProgramAction.vue"
export default {
  name: "GradedEpisodes",
  data() {
    return {
      gradeAction: "Betygsätt",
      updateGrade: false,
    }
  },
  components: {
    ViewEpisode,
    ProgramAction,
  },
  computed: {
    gradedEpisodes() {
      console.log("graded episodes is recalculated")
      let allEpisodes = [...this.$store.state.user.episodes]
      console.log("All stored episodes", allEpisodes)
      let graded = allEpisodes.filter((ep) => ep.grade !== null)
      graded.sort((a, b) => (a.grade < b.grade ? 1 : -1))
      console.log("GRADED", graded)
      return graded
    },
    programs() {
      let programs = [...this.$store.state.user.programs]
      console.log("programmen", programs)
      programs.sort((a, b) => (a.betyg < b.betyg ? 1 : -1))
      return programs
    },
  },
}
</script>
