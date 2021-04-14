import { GET_EPISODES, GET_FRIENDS, GET_PROGRAMS } from "@/store/actions/user"

const helper = {
  episodeFilter(rawArr) {
    let modEpisodes = []
    rawArr.forEach((episode) => {
      modEpisodes.push({
        id: episode.id,
        episode_id: episode.avsnitt,
        title: episode.titel,
        description: episode.beskrivning,
        program_id: episode.program_id,
        program_name: episode.program_namn,
        url: episode.url,
        pub_datum_utc: episode.pub_datum_utc,
        grade: episode.betyg,
      })
    })

    return modEpisodes
  },
  fetchData(store) {
    {
      if (!store.getters.isAuthenticated) {
        return
      }
      if (!store.state.user.gotEpisodes) {
        store.dispatch(GET_EPISODES).then(
          () => {
            console.log("Det gick bra")
          },
          () => {
            console.log("GICK ej bra")
          }
        )
      }
      if (!store.state.user.gotFriends) {
        store.dispatch(GET_FRIENDS).then(
          () => {
            console.log("Det gick bra att GET FRIENDS")
            let relations = store.state.user.friends
            let usernames = relations.map((rel) => rel.username)
            let unhandled = relations.filter((rel) => {
              if (rel.ny_fraga && !usernames.includes(rel.godkann)) {
                return true
              }
            })
            if (unhandled.length) {
              console.log("ROUTE", router.currentRoute)
              if (router.currentRoute.path !== "/friends") {
                router.push("friends")
              }

              this.$alert("Du har minst en ny vänförfrågan")
              friendCalls.setOld().then((resp) => console.log("resp", resp)),
                (err) => console.log("ERR", { err })
            }
            console.log("Friends from main.js", relations)
          },
          () => {
            console.log("GICK ej bra att GET FRIENDS")
          }
        )
      }
      if (!store.state.user.gotPrograms) {
        store.dispatch(GET_PROGRAMS).then(
          () => {
            console.log("Gick bra att GET_PROGRAMS")
          },
          () => {
            console.log("GICK ej bra")
          }
        )
      }
    }
  },
}

export default helper
