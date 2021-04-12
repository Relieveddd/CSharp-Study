<template>
  <c-box :title="title">
    <div :class="$style['list']">
      <div v-for="(item, index) in data" :key="index" :class="$style['item']">
        <div :class="$style['type']">{{ item.type }}</div>
        <div :class="[$style['value'], { [$style['valid']]: item.value > 0 }]">
          {{ item.value }}
        </div>
      </div>
    </div>
  </c-box>
</template>

<script>
import CBox from "./box";

export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    CBox
  }
};
</script>

<style lang="scss" module>
.list {
  display: flex;
  justify-content: space-between;
}
.item {
  display: flex;
  align-items: flex-end;
  line-height: 1;
}
.type {
  font-size: 14px;
}
.value {
  font-size: 56px;
  margin: 0 8px;
  color: #cccccc;
  &.valid {
    color: #ff696b;
  }
}
</style>
