// eslint-disable promise/param-names
import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
} from "../actions/auth"

import { CLEAR_USERDATA } from "../actions/user"
import storageCalls from "@/services/user_storage/StorageCalls.js"

// import apiCall from "utils/api"

const state = {
  token: localStorage.getItem("user-token") || "",
  status: "",
  hasLoadedOnce: false,
}

const getters = {
  isAuthenticated: (state) => {
    console.log("state from isAuth", state)
    if (state.hasOwnProperty("token") && !!state.token.length) {
      console.log("Is autheticated dumb mf")
    } else {
      console.log("Is NOT authenticated")
    }

    return state.hasOwnProperty("token") && !!state.token.length
  },
  authStatus: (state) => state.status,
}

const actions = {
  [AUTH_REQUEST]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      storageCalls
        .loginUser(user.username, user.password)
        .then((resp) => {
          localStorage.setItem("user-token", resp.token)
          console.log("USERNAME", resp.username)
          // Here set the header of your ajax library to the token value.
          // example with axios
          // axios.defaults.headers.common['Authorization'] = resp.token
          commit(AUTH_SUCCESS, resp)
          // dispatch(USER_REQUEST)
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem("user-token")
          reject(err)
        })
    })
  },
  [AUTH_LOGOUT]: ({ commit, dispatch }) => {
    console.log("LOGGIN OUT IN ACTION")
    console.log("STATE!!!", state)

    commit(CLEAR_USERDATA)
    commit(AUTH_LOGOUT, state)
    localStorage.removeItem("user-token")
  },
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = "loading"
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = "success"
    state.token = resp.token
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: (state) => {
    state.status = "error"
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = ""
    for (const prop of Object.getOwnPropertyNames(state)) {
      delete state[prop]
    }
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
