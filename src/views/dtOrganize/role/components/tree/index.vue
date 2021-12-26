<template>
  <div>
    <c-node
      v-for="(item, index) in data"
      :key="index"
      :node.sync="item"
    ></c-node>
  </div>
</template>

<script>
import CNode from "./node";

export default {
  components: {
    CNode
  },
  props: {
    menuTree: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    data: {
      get() {
        return this.menuTree;
      },
      set(n) {
        this.$emit("update:menuTree", n);
      }
    }
  },
  data() {
    return {};
  }
};
</script>
