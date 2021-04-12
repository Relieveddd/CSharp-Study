<template>
  <div
    :class="$style['wrap']"
    :style="{
      left: x + 'px',
      top: y + 'px'
    }"
    ref="self"
    tabindex="-1"
    @blur="onBlur"
  >
    <div :class="$style['item']" @click="onRefresh">刷新</div>
    <div :class="$style['item']" @click="onClose">关闭</div>
    <div :class="$style['item']" @click="onCloseOther">关闭其他</div>
  </div>
</template>

<script>
export default {
  props: {
    x: {},
    y: {},
    isShow: {}
  },
  methods: {
    onBlur() {
      this.closeSelf();
    },
    onRefresh() {
      this.$emit("refresh");
      this.closeSelf();
    },
    onClose() {
      this.$emit("close");
      this.closeSelf();
    },
    onCloseOther() {
      this.$emit("closeOther");
      this.closeSelf();
    },
    closeSelf() {
      this.$emit("update:isShow", false);
    }
  },
  mounted() {
    this.$refs.self.focus();
  }
};
</script>

<style lang="scss" module>
.wrap {
  background: #fff;
  position: fixed;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  outline: none;
  z-index: 2001;
  font-size: 12px;
  min-width: 100px;
  border-radius: 2px;
  color: #606266;
  .item {
    padding: 8px 16px;
    cursor: pointer;
    background: transparent;
    transition: all 0.3s;
    &:hover {
      background: #e2e2e2;
    }
  }
}
</style>
