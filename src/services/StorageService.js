import axios from "axios"
import router from "../router"
import store from "../store"
import { mapGetters } from "vuex"

const storageApi = axios.create({
  baseURL: process.env.VUE_APP_APIURL + `/api`,
  withCredentials: false, // This is the default
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:5000",
  },
  timeout: 10000,
})

storageApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user-token")
    console.log("Intercepting to add user token")
    console.log("Process env", process.env.VUE_APP_APIURL)
    console.log("adding token", token)
    if (token) {
      config.headers.common["x-access-token"] = token
    } else if (router.currentRoute.name !== "Register") {
      console.log("No valid token")
      router.push("login").catch((err) => {
        // Ignore the vuex err regarding  navigating to the page they are already on.
        if (
          err.name !== "NavigationDuplicated" &&
          !err.message.includes(
            "Avoided redundant navigation to current location"
          )
        ) {
          // But print any other errors to the console
          logError(err)
        }
      })
    }
    return config
  },
  (error) => {
    console.log("Min interception gick åt fanders..", error)
    return Promise.reject(error)
  }
)

storageApi.interceptors.response.use(
  (res) => {
    console.log("Interceptor detected a valid response from App.vue")
    return res
  },
  (err) => {
    console.log("Err from interceptor in App.vue", { err })
    console.log("Error message", err.message)
    //console.log("Is this error name??", err.data.name)
    return new Promise(function (resolve, reject) {
      if (
        (err.response &&
          err.response.status === 401 &&
          err.config &&
          !err.config.__isRetryRequest) ||
        (err.response &&
          err.response.hasOwnProperty("data") &&
          err.response.data.name === "JsonWebTokenError")
      ) {
        // if you ever get an unauthorized, logout the user
        console.log("LOGGING OUT USER")
        store.dispatch("AUTH_LOGOUT")
        store.dispatch("CLEAR_USERDATA")
        router.push("/login").catch((err) => {
          // Ignore the vuex err regarding  navigating to the page they are already on.
          if (
            err.name !== "NavigationDuplicated" &&
            !err.message.includes(
              "Avoided redundant navigation to current location"
            )
          ) {
            // But print any other errors to the console
            logError(err)
          }
        })
        // you can also redirect to /login if needed !
      } else if (err.message === "Network Error") {
        console.log("pushing error route")
        router
          .push({
            name: "Error",
            params: { message: "Ingen kontakt fås med servern." },
          })
          .catch((err) => {
            // Ignore the vuex err regarding  navigating to the page they are already on.
            if (
              err.name !== "NavigationDuplicated" &&
              !err.message.includes(
                "Avoided redundant navigation to current location"
              )
            ) {
              // But print any other errors to the console
              logError(err)
            }
          })
      } else {
        console.log("Unidentified error")
      }
      throw err
    })
  }
)

export default storageApi
