<template>
  <div :class="$style['node']">
    <span :class="$style['expand']">
      <i
        v-if="hasChild"
        :class="isExpand ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
        @click="onChange"
      ></i>
    </span>
    <el-checkbox
      v-model="data.F_IsCheck"
      :true-label="1"
      :false-label="0"
      :label="data"
      >{{ data.F_Name }}</el-checkbox
    >
    <template v-if="isExpand && hasChild">
      <c-node
        v-for="(item, index) in data.Child"
        :key="index"
        :node.sync="item"
      ></c-node>
    </template>
  </div>
</template>

<script>
export default {
  name: "CNode",
  props: {
    node: {}
  },
  data() {
    return {
      isExpand: false
    };
  },
  computed: {
    data: {
      get() {
        return this.node;
      },
      set(n) {
        this.$emit("update:node", n);
      }
    },
    hasChild() {
      return this.data.Child && this.data.Child.length;
    }
  },
  methods: {
    onChange() {
      this.isExpand = !this.isExpand;
    }
  }
};
</script>

<style lang="scss" module>
.node {
  .expand {
    display: inline-block;
    width: 1.5em;
    cursor: pointer;
    :empty {
      cursor: unset;
    }
  }
  .node {
    margin-left: 16px;
  }
}
</style>
