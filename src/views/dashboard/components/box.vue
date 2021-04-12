<template>
  <div :class="$style['wrap']">
    <div :class="$style['header']">
      <div :class="$style['title']">{{ title }}</div>
      <div :class="$style['right']">
        <slot name="header"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" module>
.wrap {
  padding: 16px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0px 1px 5px 0px rgba(80, 91, 126, 0.3);
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    .title {
      font-size: 13px;
      margin-bottom: 16px;
    }
  }
}
</style>
