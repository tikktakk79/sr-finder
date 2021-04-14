import axios from "axios"
import router from "../router"
import store from "../store"
import { mapGetters } from "vuex"

const storageApi = axios.create({
  baseURL: `http://localhost:3000/api`,
  withCredentials: false, // This is the default
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

storageApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user-token")
    console.log("Intercepting to add user token")
    console.log("adding token", token)
    if (token) {
      config.headers.common["x-access-token"] = token
    } else {
      console.log("No valid token")
      router.push("login")
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
    //console.log("Is this error name??", err.data.name)
    return new Promise(function (resolve, reject) {
      if (
        (err.response.status === 401 &&
          err.config &&
          !err.config.__isRetryRequest) ||
        (err.hasOwnProperty("response") &&
          err.response.hasOwnProperty("data") &&
          err.response.data.name === "JsonWebTokenError")
      ) {
        // if you ever get an unauthorized, logout the user
        console.log("LOGGING OUT USER")
        store.dispatch("AUTH_LOGOUT")
        store.dispatch("CLEAR_USERDATA")
        router.push("/login")
        // you can also redirect to /login if needed !
      }
      throw err
    })
  }
)

export default storageApi
