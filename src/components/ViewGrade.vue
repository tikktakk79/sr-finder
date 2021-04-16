<template>
  <div
    class="border-solid cursor-pointer bg-warmgray-200 border-4 border-warmgray-400 rounded-full"
  >
    <div
      class="w-6 h-6 text-warmgray-600 font-bold flex items-center justify-center"
    >
      <p class="pl-px">{{ this.grade }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    grade: {
      type: Number,
      required: true,
    },
  },
}
</script>
