<style scoped>
a {
  text-decoration: none;
}

#hamburger:hover {
  cursor: pointer;
  color: white;
}

#menu-toggle-2:checked + #menu {
  display: block;
}
</style>
<template>
  <div>
    <div class="bg-black">
      <nav
        class="flex mdplus:grid grid-cols-topmenu items-center justify-between flex-wrap mx-auto pt-3 py-4 pb-1.5 sm:p-4"
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
            class="transform text- font-radio mdplus:flex-grow lg:translate-y-2.5"
          >
            <router-link
              v-for="item in menuItems"
              :key="item.name"
              class="block mt-4 mdplus:inline-block bg-warmgray-200 text-black px-2 lg:mt-0 hover:bg-warmgray-50 mx-1.5"
              :to="item.link"
              >{{ item.name }}</router-link
            >
          </div>
        </div>
      </nav>
    </div>
    <!-- <h1 v-if="this.name !== 'GradedEpisodes'">{{ this.name }}</h1> -->
  </div>
</template>

<script>
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
      ],
    }
  },
  props: {
    name: {
      type: String,
      required: true,
      default: () => "",
    },
  },
}
console.log("Done with navbar")
</script>
