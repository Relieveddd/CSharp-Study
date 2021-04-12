<template>
  <div
    :class="[[$style['sidebar']], { [$style['noMenu']]: noMenu }]"
    v-show="isShow"
  >
    <div :class="[$style['container']]">
      <c-item v-for="(item, index) in tree" :key="index" :data="item"></c-item>
    </div>
  </div>
</template>

<script>
import cItem from "./item";

export default {
  components: {
    cItem
  },
  props: {
    tree: {
      type: Array,
      default() {
        return [];
      }
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    noMenu() {
      return this.tree.length ? false : true;
    }
  },
  methods: {
    onHide() {
      this.$emit("update:isShow", false);
    }
  },
	mounted() {
		console.log(this.tree)
	}
};
</script>

<style lang="scss" module>
.sidebar {
  position: relative;
  z-index: 2001;
  background: #505b7e;
  min-width: 160px;
  &.noMenu {
    z-index: unset;
  }
  .container {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
