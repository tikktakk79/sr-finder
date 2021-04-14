<template>
  <div id="app" class="bg-warmgray-50 min-h-screen w-full">
    <NavBar :name="$route.name" />
    <div class="flex justify-center">
      <div class="flex-grow left-gradient min-h-screen"></div>
      <div class="w-full sm:max-w-2xl flex-grow-max">
        <router-view
          class="bg-white w-full min-h-screen px-4 py-12"
          :key="$route.fullPath"
        />
      </div>
      <div class="flex-grow right-gradient min-h-screen"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
console.log("Next import navbar")
import NavBar from "@/components/NavBar.vue"

export default {
  data() {
    return {
      hmm: "I think I dooo...",
    }
  },
  components: {
    NavBar,
  },
}
console.log("Done importing in app.vue")
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
