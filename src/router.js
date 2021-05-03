import Vue from "vue"
import Router from "vue-router"
import HelloWorld from "./views/HelloWorld.vue"
import OtherView from "./views/OtherView.vue"
// import SearchEpisode from "./views/SearchEpisode.vue"
import Register from "./views/Register.vue"
import Login from "./views/Login.vue"
import StoredEpisodes from "./views/StoredEpisodes.vue"
import GradedEpisodes from "./views/GradedEpisodes.vue"
import Testing from "./views/Testing.vue"
import Search from "./views/Search.vue"
import SearchUser from "./views/SearchUser.vue"
import Friends from "./views/Friends.vue"
import Settings from "./views/Settings.vue"
import Error from "./views/Error.vue"
//import UserGrades from "./views/UserGrades.vue"
import Store from "./store"
import Helper from "@/helper/helper.js"

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  console.log("Authenticated?", Store.getters.isAuthenticated)
  if (!Store.getters.isAuthenticated) {
    next()
  } else {
    next("/grades")
  }
}

const ifAuthenticated = (to, from, next) => {
  if (Store.getters.isAuthenticated) {
    console.log("Token is", Store.state.token)
    console.log("value from isAUTH", Store.getters.isAuthenticated)
    console.log("Is authenticated from rotuer.js")
    if (to.name === "GradedEpisodes") {
      console.log("Fetching data inside ifAuth")
      Helper.fetchData(Store)
    } else if (to.name === "Login") {
      console.log("Going to episodes route")
      next("/episodes")
    }
    next()
  } else if (to.name === "Login") {
    next()
  } else {
    console.log("Going to login in ifauth")
    next("/login")
  }
}

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/login",
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/other",
      name: "OtherView",
      component: OtherView,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/episodes",
      name: "StoredEpisodes",
      component: StoredEpisodes,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/grades",
      name: "GradedEpisodes",
      component: GradedEpisodes,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/user",
      name: "SearchUser",
      component: SearchUser,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/friends",
      name: "Friends",
      component: Friends,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/settings",
      name: "Settings",
      component: Settings,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/testing",
      name: "Testing",
      component: Testing,
    },
    {
      path: "/search",
      name: "Search",
      component: Search,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/error",
      name: "Error",
      component: Error,
    },
  ],
})

export default router
