<template>
  <div class="mm-icon" @click="click" :style="{ fontSize: size, color: color }">
    <svg class="mm-icon-svg" aria-hidden="true">
      <use v-bind:xlink:href="`#${icon}`"></use>
    </svg>
  </div>
</template>

<script>
export default {
  name: "MmIcon",
  props: {
    icon: String,
    size: String,
    color: String
  },
  methods: {
    click(event) {
      this.$emit("click", event);
    }
  }
};
</script>
