<template>
  <div :class="$style['wrap']">
    <mm-icon
      icon="iconmenu"
      :class="$style['toggleSidebar']"
      @click="onToggleSidebar"
    ></mm-icon>
    <div :class="$style['logo']">
      <img src="@/assets/logo.svg" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onToggleSidebar() {
      this.$emit("toggleSidebar");
    }
  }
};
</script>

<style lang="scss" module>
.wrap {
  display: flex;
  align-items: center;
  height: 100%;
  .toggleSidebar {
    cursor: pointer;
    height: 100%;
    font-size: 24px;
    color: #505b7e;
    width: 48px;
  }
  .logo {
    margin-left: 16px;
    font-size: 0;
    img {
      height: 32px;
    }
  }
}
</style>
