<template>
  <div>
    <p>Betyg: {{ this.grade }}</p>
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
