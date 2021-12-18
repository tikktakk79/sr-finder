<template>
  <div id="app" class="bg-warmgray-50 min-h-screen w-full">
    <span v-title data-title="Radioskugga"></span>
    <NavBar :name="$route.name" />
    <div class="flex justify-center">
      <div class="hidden sm:block flex-grow left-gradient min-h-screen"></div>
      <div class="w-full sm:max-w-2xl flex-grow-max">
        <router-view
          class="bg-white w-full min-h-screen px-4 py-12"
          :key="$route.fullPath"
        />

        <div
          v-if="audioLink.length && audioVisible"
          class="w-full leading-none sm:max-w-2xl pb-6 sm:pb-1.5 py-1.5 flex-grow-max bg-warmgray-500 fixed bottom-0"
        >
          <div class="hidden sm:flex w-full mb-1.5 justify-center">
            <div
              @click="skipAudio(-30)"
              class="bg-warmgray-600 rounded-md border flex items-center mr-2 py-1 pl-2 pr-1.5"
            >
              <div class="flip -ml-1.5 mr-1.5">
                <div
                  class="inline-block skipbutton ff -mr-3"
                  id="ffbutton"
                ></div>
                <div
                  class="inline-block skipbutton ff transform -mr-3"
                  id="ffbutton"
                ></div>
                <div class="inline-block skipbutton ff"></div>
              </div>
              <div class="inline-block text-white text-2xl pr-2">
                <span>30</span>
              </div>
            </div>
            <div
              @click="skipAudio(-10)"
              class="bg-warmgray-600 rounded-md border flex items-center mr-2 py-1 pl-2 pr-1.5"
            >
              <div class="flip -ml-1.5 mr-1.5">
                <div
                  class="inline-block skipbutton ff -mr-3"
                  id="ffbutton"
                ></div>
                <div
                  class="inline-block skipbutton ff transform -mr-3"
                  id="ffbutton"
                ></div>
                <div class="inline-block skipbutton ff"></div>
              </div>
              <div class="inline-block text-white text-2xl pr-2">
                <span>10</span>
              </div>
            </div>
            <div
              @click="skipAudio(10)"
              class="bg-warmgray-600 rounded-md border flex items-center mr-2 py-1 pl-2 pr-1.5"
            >
              <div class="inline-block text-white text-2xl pr-2">
                <span>10</span>
              </div>
              <div class="-mr-1">
                <div class="inline-block skipbutton ff -mr-3"></div>
                <div class="inline-block skipbutton ff transform -mr-3"></div>
                <div class="inline-block skipbutton ff"></div>
              </div>
            </div>
            <div
              @click="skipAudio(30)"
              class="bg-warmgray-600 rounded-md border flex items-center py-1 pl-2 pr-1.5"
            >
              <div class="inline-block text-white text-2xl pr-2">
                <span>30</span>
              </div>
              <div class="-mr-1">
                <div class="inline-block skipbutton ff -mr-3"></div>
                <div class="inline-block skipbutton ff transform -mr-3"></div>
                <div class="inline-block skipbutton ff"></div>
              </div>
            </div>
          </div>

          <div class="flex sm:hidden w-full mb-1.5 justify-center">
            <div
              @click="skipAudio(-15)"
              class="bg-warmgray-600 rounded-md border flex items-center mr-2 py-1 pl-2 pr-1.5"
            >
              <div class="flip -ml-1.5 mr-1.5">
                <div
                  class="inline-block skipbutton ff -mr-3"
                  id="ffbutton"
                ></div>
                <div
                  class="inline-block skipbutton ff transform -mr-3"
                  id="ffbutton"
                ></div>
                <div class="inline-block skipbutton ff"></div>
              </div>
              <div class="inline-block text-white text-2xl pr-2">
                <span>15</span>
              </div>
            </div>
            <div
              @click="skipAudio(15)"
              class="bg-warmgray-600 rounded-md border flex items-center mr-2 py-1 pl-2 pr-1.5"
            >
              <div class="inline-block text-white text-2xl pr-2">
                <span>15</span>
              </div>
              <div class="-mr-1">
                <div class="inline-block skipbutton ff -mr-3"></div>
                <div class="inline-block skipbutton ff transform -mr-3"></div>
                <div class="inline-block skipbutton ff"></div>
              </div>
            </div>
          </div>

          <div class="px-8">
            <audio
              id="myaudio"
              ref="player"
              autoplay
              class="mx-auto w-full"
              preload="auto"
              controls="controls"
            >
              <source :src="audioLink" />
            </audio>
          </div>
          <div @click="closeAudio" id="mdiv">
            <div class="mdiv">
              <div class="md"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="hidden sm:block flex-grow right-gradient min-h-screen"></div>
    </div>
  </div>
</template>

<script>
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
      this.$store.dispatch("CLOSE_AUDIO")
      this.$store.state.user.audioVisible = false
    },
    forwardAudio() {
      // Check for audio element support.
      if (window.HTMLAudioElement) {
        try {
          var oAudio = document.getElementById("myaudio")
          oAudio.currentTime += 30.0
        } catch (e) {
          // Fail silently but show in F12 developer tools console
          if (window.console && console.error("Error:" + e));
        }
      }
    },
    skipAudio(seconds) {
      // Check for audio element support.
      if (window.HTMLAudioElement) {
        try {
          var oAudio = document.getElementById("myaudio")
          oAudio.currentTime += seconds
        } catch (e) {
          // Fail silently but show in F12 developer tools console
          if (window.console && console.error("Error:" + e));
        }
      }
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

.skipbutton {
  box-sizing: border-box;
  width: 1.5rem;
  height: 1rem;
}

.ff {
  border-color: transparent transparent transparent white;
  border-width: 0.6rem 0.6rem 0.6rem 0.65rem;
}

.rw {
  border-color: transparent white transparent transparent;
  border-width: 0.6rem 0.6rem 0.6rem 0.65rem;
}

.flip {
  transform: scaleX(-1);
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
