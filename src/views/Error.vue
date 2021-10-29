<template>
  <div class="text-center">
    <h3 class="mx-auto text-left w-96 italic">{{ outMessage }}</h3>
  </div>
</template>

<script>
export default {
  props: ["message"],
  computed: {
    outMessage() {
      let outMessage = this.message
        ? this.message
        : "Något gick dessvärre fel..."
      return outMessage
    },
  },
}
</script>

<style lang="stylus" scoped></style>
