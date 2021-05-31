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
        <div
          v-if="audioLink.length && audioVisible"
          class="w-full sm:max-w-2xl py-1 flex-grow-max bg-warmgray-500 fixed bottom-0"
        >
          <audio
            ref="player"
            autoplay
            class="mx-auto"
            preload="auto"
            controls="controls"
          >
            <source :src="audioLink" />
          </audio>
          <div @click="closeAudio" id="mdiv">
            <div class="mdiv">
              <div class="md"></div>
            </div>
          </div>
        </div>
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
  computed: {
    audioLink() {
      return this.$store.state.user.audioLink
    },
    audioVisible() {
      return this.$store.state.user.audioVisible
    },
  },
  watch: {
    audioLink() {
      if (this.$refs.player) {
        this.$refs.player.load()
      }
    },
  },
  methods: {
    closeAudio() {
      this.$store.state.user.audioVisible = false
    },
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

#mdiv {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0px;
  width: 25px;
  height: 25px;
  background-color: rgb(232, 232, 232);
}

.mdiv {
  height: 20px;
  width: 2px;
  margin-top: 3px;
  margin-left: 12px;
  background-color: rgb(96, 96, 96);
  transform: rotate(45deg);
  z-index: 1;
}

.md {
  height: 20px;
  width: 2px;
  background-color: rgb(96, 96, 96);
  transform: rotate(90deg);
  z-index: 2;
}
</style>
