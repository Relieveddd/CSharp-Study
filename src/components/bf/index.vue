<template>
  <div :class="$style['wrap']">
    <div :class="$style['action']">
      <div :class="$style['bar']"></div>
      <div :class="$style['close']" @click="onClose">收起</div>
      <div :class="$style['bar']"></div>
    </div>
    <div :class="$style['content']" v-if="visible">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "bf",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  methods: {
    onClose() {
      this.$emit("close");
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="scss" module>
.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .action {
    flex: none;
    display: flex;
    justify-content: center;
    .bar {
      flex: 1;
      border-bottom: solid 1px #cacaca;
    }
    .close {
      font-size: 14px;
      border: solid 1px #cacaca;
      border-bottom: none;
      padding: 8px 32px;
      border-radius: 3px 3px 0 0;
      cursor: pointer;
    }
  }
  .content {
    flex: 1;
    margin-top: 8px;
  }
}
</style>
