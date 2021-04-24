<template>
  <div
    class="border-solid cursor-pointer bg-warmgray-200 border-4 border-warmgray-400 rounded-full"
    @click="$emit('grade-click')"
  >
    <div
      class="w-7 h-7 pt-px text-warmgray-600 text-lg font-bold flex items-center justify-center"
    >
      <p><slot></slot></p>
    </div>
  </div>
</template>

<script>
export default {}
</script>
