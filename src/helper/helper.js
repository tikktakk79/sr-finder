import {
  GET_EPISODES,
  GET_FRIENDS,
  GET_PROGRAMS,
  GET_TIPS,
} from "@/store/actions/user"
import friendCalls from "@/services/user_storage/FriendCalls.js"
import storageCalls from "@/services/user_storage/StorageCalls.js"
import router from "@/router.js"

const helper = {
  episodeFilter(rawArr) {
    let modEpisodes = []
    rawArr.forEach((episode) => {
      let modEp = {
        id: episode.id,
        episode_id: episode.avsnitt,
        title: episode.titel,
        description: episode.beskrivning,
        program_id: episode.program_id,
        program_name: episode.program_namn,
        url: episode.url,
        listen_link: episode.lyssningslank,
        pub_datum_utc: episode.pub_datum_utc,
        grade: episode.betyg,
      }

      if ("tipsare" in episode) {
        modEp.tipsare = episode.tipsare
      }
      modEpisodes.push(modEp)
    })

    return modEpisodes
  },
  fetchTips(store, vueAlert) {
    store.dispatch(GET_TIPS).then(
      () => {
        console.log("Gick bra att GET_TIPS")
        let tips = store.state.user.tipsReceived
        let unhandledTips = tips.filter((tip) => tip.nytt_tips)

        if (unhandledTips.length) {
          if (
            router.currentRoute.path !== "/friends" &&
            router.currentRoute.path !== "/tips"
          ) {
            router.push("tips")
          }

          vueAlert("Du har fått nya lyssningstips!")
          storageCalls.setOldTips().then((resp) => console.log("resp", resp)),
            (err) => console.log("ERR", { err })
        }
      },
      (err) => {
        console.log("GICK ej bra att GET_TIPS", err)
      }
    )
  },
  fetchData(store, vueAlert) {
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
            console.log("relations from fetchData", relations)
            let usernames = relations.map((rel) => rel.username)
            let unhandled = relations.filter((rel) => {
              if (rel.ny_fraga && rel.godkann === "you") {
                return true
              }
            })

            if (unhandled.length) {
              console.log("ROUTE", router.currentRoute)
              if (router.currentRoute.path !== "/friends") {
                router.push("friends")
              }

              vueAlert("Du har minst en ny vänförfrågan")
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
      this.fetchTips(store, vueAlert)
    }
  },
}

export default helper
