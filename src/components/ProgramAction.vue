<template>
  <div>
    <div class="flex justify-center">
      <p
        class="mini-screen font-bold bg-warmgray-500 px-1 text-white"
        v-if="updateGrade"
      >
        Ändra betyg:
      </p>
      <div v-if="!currentGrade || updateGrade">
        <select class="btn-black pl-3 pr-1" v-model="programGrade">
          <option v-if="!updateGrade" disabled value>
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
        @click="removeGrade(programId)"
      >
        Ta bort
      </button>
    </div>
  </div>
</template>

<script>
import ViewGrade from "@/components/ViewGrade.vue"
import {
  GRADE_PROGRAM,
  UPDATE_PROGRAM,
  DELETE_PROGRAM,
} from "@/store/actions/user"
export default {
  data() {
    return {
      programGrade: "",
      updateGrade: false,
    }
  },
  components: { ViewGrade },
  props: {
    currentGrade: {
      type: [String, Number],
      default: "",
    },
    programId: {
      type: String,
    },
    programName: {
      type: String,
    },
    gradeAction: {
      type: String,
      default: "",
    },
  },
  methods: {
    changeProgramGrade(newGrade) {
      this.gradeProgram(newGrade, this.programId, this.programName)
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
    setUpdate() {
      this.updateGrade = true
    },
  },

  watch: {
    programGrade(newGrade) {
      this.changeProgramGrade(newGrade)
    },
    currentGrade() {
      this.programGrade = this.currentGrade
    },
  },
  created() {
    this.programGrade = this.currentGrade ?? ""
  },
}
</script>
