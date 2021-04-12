<template>
  <div :class="$style['header']">
    <c-left @toggleSidebar="onToggleSidebar"></c-left>
    <c-right></c-right>
  </div>
</template>

<script>
import CLeft from "./left";
import CRight from "./right";

export default {
  components: {
    CLeft,
    CRight
  },
  methods: {
    onToggleSidebar() {
      this.$emit("toggleSidebar");
    }
  }
};
</script>

<style lang="scss" module>
.header {
  flex: none;
  height: 48px;
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}
</style>
