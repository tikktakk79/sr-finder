<template>
  <div>
    <div id="topnav" class="bg-black">
      <div
        v-if="loggedIn"
        @click="logout"
        class="hidden mdplus:block cursor-pointer px-1.5 absolute top-0 right-0"
      >
        <p class="text-right gradient-text font-bold text-sm text-warmgray-400">
          logga ut
        </p>
      </div>
      <router-link
        v-if="!loggedIn && !routeLogin"
        to="/login"
        class="hidden mdplus:block cursor-pointer px-1.5 absolute top-0 right-0"
      >
        <p class="text-right gradient-text font-bold text-sm text-warmgray-400">
          logga in
        </p>
      </router-link>
      <nav
        class="flex mdplus:grid grid-cols-topmenu items-center justify-between flex-wrap mx-auto pt-3 py-4 pb-3 sm:p-4"
      >
        <div
          class="text-left flex items-center flex-shrink-0 text-white mr-6 p-1.5"
        >
          <span
            id="shadow1"
            class="transform text-2xl font-semibold font-radio text-warmgray-100 sm:text-logo sm:h-11 pl-4 -translate-y-2.5"
            >RADIOSKUGGA</span
          >
        </div>
        <label
          for="menu-toggle-2"
          class="pointer-cursor mdplus:hidden self-start text-right py-1.5 px-4"
          ><svg
            id="hamburger"
            class="fill-current text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <title>menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path></svg
        ></label>
        <input class="hidden" type="checkbox" id="menu-toggle-2" />

        <div
          class="hidden px-10 sm:py-0 mdplus:p-0 max-w-view w-full flex-grow mdplus:flex mdplus:items-end mdplus:w-auto"
          id="menu"
        >
          <div
            class="transform -mt-3 sm:mt-0 mdplus:bg-warmgray-500 font-radio mdplus:flex-grow mdplus:translate-y-2.5"
          >
            <router-link
              v-for="item in menuItems"
              :key="item.name"
              class="mdplus:inline-block menu-items mdplus:menu-margin"
              :to="item.link"
              ><div class="inline-block">
                {{ item.name }}
              </div></router-link
            >

            <div
              v-if="loggedIn"
              @click="logout"
              class="mdplus:hidden menu-items"
            >
              <div class="inline-block">{{ "Logga ut" }}</div>
            </div>

            <router-link
              v-if="!loggedIn && !routeLogin"
              class="mdplus:hidden menu-items"
              to="/login"
            >
              <div class="inline-block">{{ "Logga in" }}</div>
            </router-link>
          </div>
        </div>
        <div
          class="hidden waves-short navmedium:block navbig:block navbig:-mr-56 -mt-2 -mr-96 justify-self-end -mb-8 waves"
        >
          <Waves viewBox="0 5 1000 1000" />
        </div>
      </nav>
    </div>

    <!-- <h1 v-if="this.name !== 'GradedEpisodes'">{{ this.name }}</h1> -->
  </div>
</template>

<script>
import { AUTH_LOGOUT } from "@/store/actions/auth"
import Waves from "@/assets/img/svg/waveslong.svg"
import srCalls from "@/services/sr_api/ApiCalls.js"
export default {
  data() {
    return {
      menuItems: [
        {
          name: "Sök",
          link: "/search",
        },
        {
          name: "Sparade avsnitt",
          link: "/episodes",
        },
        {
          name: "Betyg",
          link: "/grades",
        },
        {
          name: "Vänner",
          link: "/friends",
        },
        {
          name: "Inställningar",
          link: "/settings",
        },
      ],
    }
  },
  components: { Waves },
  props: {
    name: {
      type: String,
      required: true,
      default: () => "",
    },
  },
  methods: {
    logout() {
      console.log("logout method in NavBar")
      this.$store.dispatch(AUTH_LOGOUT)
      this.$router.push("/login")
    },
  },
  computed: {
    loggedIn() {
      return this.$store.getters.isAuthenticated
    },

    routeLogin() {
      return this.$route.name === "Login"
    },
  },
}
console.log("Done with navbar")
</script>
<style scoped lang="scss">
a {
  text-decoration: none;
}

.gradient-text {
  background-color: rgb(40, 39, 38);
  background-image: linear-gradient(0deg, #535347, #ffffff);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}

.vertical {
  writing-mode: vertical-rl;
  text-orientation: upright;
}

#hamburger:hover {
  cursor: pointer;
  color: white;
}

#menu-toggle-2:checked + #menu {
  display: block;
}
</style>
