<template>
  <div class="flex justify-center">
    <p
      class="mb-2 cursor-pointer bg-gray-600 text-white font-bold px-2"
      @click="runView"
    >
      {{ prog.name }}
    </p>
  </div>
</template>

<script>
import srCalls from "@/services/sr_api/ApiCalls.js"
export default {
  props: {
    prog: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  methods: {
    runView() {
      srCalls.programEpisodes(this.prog.id).then((resp) => {
        console.log("Dessa avsnitt hittades", resp.data)
        console.log("Format på sesp data episodes", resp.data.episodes[0])
        let prevpage = ""
        let nextpage = ""

        if (resp.data.hasOwnProperty("pagination")) {
          console.log("Pagination exists!")
          prevpage = resp.data.pagination.previouspage || ""
          nextpage = resp.data.pagination.nextpage || ""
        }

        let modEpisodes = resp.data.episodes.map((rawEp) => {
          let mod = {
            episode_id: rawEp.id,
            title: rawEp.title,
            description: rawEp.description,
            url: rawEp.url,
            program_name: rawEp.program.name,
            program_id: rawEp.program.id,
            pub_datum_utc: rawEp.publishdateutc,
            grade: null,
          }

          console.log("Modepisodes", mod)
          return mod
        })

        this.$emit("got-episodes", modEpisodes, prevpage, nextpage)
      })
    },
  },
}
</script>
