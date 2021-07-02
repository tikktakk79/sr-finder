import {
  USER_REQUEST,
  USER_ERROR,
  USER_SUCCESS,
  SAVE_EPISODE,
  STORE_EPISODES,
  REMOVE_EPISODE,
  GET_EPISODES,
  STORE_ONE_EPISODE,
  GRADE_PROGRAM,
  UPDATE_PROGRAM,
  DELETE_PROGRAM,
  GET_FRIENDS,
  GET_PROGRAMS,
  REQ_FRIEND,
  CLEAR_USERDATA,
  SEND_TIP,
  GET_TIPS,
  SET_PLAY,
  CLOSE_AUDIO,
} from "../actions/user"
import Vue from "vue"
import { AUTH_LOGOUT } from "../actions/auth"
import storageCalls from "@/services/user_storage/StorageCalls.js"
import friendCalls from "@/services/user_storage/FriendCalls.js"
import helper from "@/helper/helper.js"

const state = {}

baseState()

function baseState() {
  Object.assign(state, {
    status: "",
    friends: [],
    episodes: [],
    programs: [],
    tipsSent: [],
    tipsReceived: [],
    changeTracker: 0,
    gotEpisodes: false,
    gotFriends: false,
    gotPrograms: false,
    audioLink: "",
    audioVisible: true,
  })
}

const getters = {
  gotEpisodes: (state) => !!state.episodes.length,
  getEpisodes: (state) => state.episodes,
  getEpisodeIds: (state) => {
    let Ids = state.episodes.map((ep) => ep.episode_id)
    return Ids
  },
}

const actions = {
  [USER_REQUEST]: ({ commit, dispatch }) => {
    commit(USER_REQUEST)
    apiCall({ url: "user/me" })
      .then((resp) => {
        commit(USER_SUCCESS, resp)
      })
      .catch((err) => {
        commit(USER_ERROR)
        // if resp is unauthorized, logout, to
        dispatch(AUTH_LOGOUT)
      })
  },
  [SAVE_EPISODE]: ({ commit, dispatch }, episode) => {
    storageCalls
      .saveEpisode(
        episode.episode_id,
        episode.title,
        episode.program_name,
        episode.program_id,
        episode.description,
        episode.url,
        episode.pub_datum_utc,
        episode.listen_link,
        episode.grade
      )
      .then(
        (resp) => {
          console.log("Save episodes response", resp)
          console.log(
            "Episode from action SAVE_EPISODE inside then clause",
            episode
          )
          commit(STORE_ONE_EPISODE, episode)
        },
        (err) => {
          console.log("Eländes elände!", { err })
        }
      )
  },
  [GET_EPISODES]: ({ commit, dispatch }) => {
    storageCalls
      .getEpisodes()
      .then((resp) => {
        console.log("Episodes resp.data", resp)
        let modEpisodes = helper.episodeFilter(resp)

        commit(GET_EPISODES, modEpisodes)
      })
      .catch((err) => {
        console.log("FEL I GET EPISODES ACTION")
        console.log("De blev fel", { err })
        // if (err.response && err.response.data.name === "TokenExpiredError") {
        //   dispatch(AUTH_LOGOUT)
        // }
      })
  },
  [REMOVE_EPISODE]: ({ commit, dispatch }, episode_id) => {
    storageCalls
      .removeEpisode(episode_id)
      .then((resp) => {
        console.log("Removed with response:", resp)
        commit(REMOVE_EPISODE, episode_id)
      })
      .catch((err) => {
        console.log("De blev fel med remove", err)
      })
  },
  [GRADE_PROGRAM]: ({ commit }, program) => {
    console.log("program object inside GRADE_PROGRAM", program)
    let programData = {
      id: program.programId,
      name: program.programName,
      grade: program.grade,
    }
    let test = "TESTING"
    console.log("programData inside GRADE_PROGRAM action: ", programData)
    return storageCalls.gradeProgram(programData).then(
      (resp) => {
        console.log("printing test", test)
        console.log("Grade program response", resp)

        commit(GRADE_PROGRAM, programData)
        return resp
      },
      (err) => {
        console.log("Fel vid storageCalls.gradeProgram!", { err })
        throw err
      }
    )
  },
  [UPDATE_PROGRAM]: ({ commit, dispatch }, { programId, grade }) => {
    console.log("Update program action:", programId, grade)
    storageCalls.updateProgram(programId, grade).then(
      (resp) => {
        console.log("Update program response", resp)

        dispatch(GET_PROGRAMS)
      },
      (err) => {
        console.log("Fel vid storageCalls.updateProgram!", { err })
      }
    )
  },
  [DELETE_PROGRAM]: ({ commit, dispatch }, programId) => {
    console.log("Delete program action:", programId)
    storageCalls.deleteProgram(programId).then(
      (resp) => {
        console.log("Delete program response", resp)

        dispatch(GET_PROGRAMS)
      },
      (err) => {
        console.log("Fel vid storageCalls.deleteProgram!", { err })
      }
    )
  },
  [GET_PROGRAMS]: ({ commit }) => {
    storageCalls
      .getPrograms()
      .then((resp) => {
        console.log("Programs resp", resp)
        console.log("Progs resp.data")
        commit(GET_PROGRAMS, resp)
      })
      .catch((err) => {
        console.log("FEL I GET_PROGRAMS ACTION")
        console.log("De blev fel", { err })
        // if (err.response && err.response.data.name === "TokenExpiredError") {
        //   dispatch(AUTH_LOGOUT)
        // }
      })
  },
  [GET_FRIENDS]: ({ commit }) => {
    return friendCalls.getFriends().then(
      (resp) => {
        console.log("Friends inside GET FRIENDS ACTION", resp)
        commit(GET_FRIENDS, resp.friendsMod)
        console.log("Returning resp from inside GET_FRIENDS action")
        return resp
      },
      (err) => console.log("Error", { err })
    )
  },
  [REQ_FRIEND]: ({ commit, dispatch }, receiver) => {
    friendCalls.reqFriend(receiver).then(
      (resp) => {
        if (resp.length > 0) {
          dispatch(GET_FRIENDS)
        }
      },
      (err) => console.log("Error", { err })
    )
  },
  [CLEAR_USERDATA]: ({ commit, dispatch }, receiver) => {
    commit(CLEAR_USERDATA)
  },
  [SET_PLAY]: ({ commit, dispatch }, playerLink) => {
    commit(SET_PLAY, playerLink)
  },
  [CLOSE_AUDIO]: ({ commit, dispatch }) => {
    commit(CLOSE_AUDIO)
  },
  [GET_TIPS]: ({ commit }) => {
    return storageCalls.getTips().then(
      (resp) => {
        console.log("Tips inside GET TIPS ACTION", resp)
        console.log("Returning resp from inside GET_TIPS action")
        // Filter resp and commit received tips and sent tips separately
        let userTips = { tipsSent: resp[0], tipsReceived: resp[1] }
        commit(GET_TIPS, userTips)
        return
      },
      (err) => console.log("Error in getTips", { err })
    )
  },
  [SEND_TIP]: ({ commit, dispatch }, { episode, username }) => {
    commit(SEND_TIP, { episode, username })
    return storageCalls
      .sendTip(
        episode.episode_id,
        episode.title,
        episode.program_name,
        episode.program_id,
        episode.description,
        episode.url,
        episode.pub_datum_utc,
        episode.listen_link,
        username
      )
      .then(
        (resp) => {
          console.log("Send tip resp", resp)
          // dispatch GET_TIPS
        },
        (err) => console.log("Error in sendTip", { err })
      )
  },
}

const mutations = {
  [USER_REQUEST]: (state) => {
    state.status = "loading"
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = "success"
    Vue.set(state, "profile", resp)
  },
  [USER_ERROR]: (state) => {
    state.status = "error"
  },
  [STORE_EPISODES]: (state, episodes) => {
    state.episodes = episodes
  },
  [STORE_ONE_EPISODE]: (state, episode) => {
    state.changeTracker++
    state.episodes.push(episode)
  },
  [GRADE_PROGRAM]: (state, programData) => {
    console.log("State from grade program: ", state)
    state.programs.push({
      programid: programData.id,
      programnamn: programData.name,
      betyg: programData.grade,
    })
  },
  [GET_PROGRAMS]: (state, programs) => {
    state.changeTracker++
    state.programs = programs
    state.gotPrograms = true
  },
  [GET_EPISODES]: (state, episodes) => {
    state.changeTracker++
    state.episodes = episodes
    state.gotEpisodes = true
  },
  [REMOVE_EPISODE]: (state, episode_id) => {
    state.changeTracker++
    console.log("state.episodes före removal", state.episodes)
    let editedEpisodes = state.episodes.filter((episode) => {
      return episode.episode_id !== episode_id
    })
    state.episodes = editedEpisodes
    console.log("state.episodes efter removal", state.episodes)
  },
  [GET_FRIENDS]: (state, friends) => {
    state.friends = friends
    state.gotFriends = true
  },
  [CLEAR_USERDATA]: (state, friends) => {
    console.log("Clearing Userdata")
    baseState()
  },
  [SET_PLAY]: (state, audioLink) => {
    state.audioLink = audioLink
    state.audioVisible = true
  },
  [CLOSE_AUDIO]: (state) => {
    state.audioVisible = false
  },
  [GET_TIPS]: (state, { tipsSent, tipsReceived }) => {
    state.tipsSent = tipsSent
    state.tipsReceived = tipsReceived
  },
  [SEND_TIP]: (state, { episode, username }) => {
    state.tipsSent.push({
      anvandare: username,
      avsnitt: episode.episode_id,
    })
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
