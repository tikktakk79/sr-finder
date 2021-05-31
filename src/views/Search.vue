<template>
  <div>
    <div class="flex justify-center items-center mb-4">
      <h2
        :class="{
          active: episodeSelected,
        }"
        class="cursor-pointer"
        @click="
          currentView = 'SearchEpisode'
          episodeSelected = true
        "
      >
        Sök avsnitt
      </h2>
      <h1 class="text-gray-500 font-bold px-2">|</h1>
      <h2
        :class="{
          active: !episodeSelected,
        }"
        class="cursor-pointer"
        @click="
          currentView = 'RecentEpisodes'
          episodeSelected = false
        "
      >
        Programsök
      </h2>
    </div>
    <component :is="currentView"></component>
  </div>
</template>

<script>
import SearchEpisode from "@/components/SearchEpisode.vue"
import RecentEpisodes from "@/components/RecentEpisodes.vue"

export default {
  data() {
    return {
      episodeSelected: true,
      currentView: "SearchEpisode",
      testVar: 9,
    }
  },
  components: { SearchEpisode, RecentEpisodes },
}
</script>
<style>
.friend-select {
  width: 150px;
}
</style>
