<template>
  <div :class="$style['wrap']">
    <template v-if="isArray">
      <div v-for="(item, index) in data" :key="index" :class="$style['item']">
        {{ item[label] }}:{{ item[value] }}
      </div>
    </template>
    <template v-else>
      <div v-for="(value, key) in data" :key="key" :class="$style['item']">
        {{ key }}:{{ value }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "bottominfo",
  props: {
    data: {
      type: [Object, Array],
      default() {
        return {};
      }
    },
    label: {
      type: String,
      default: "label"
    },
    value: {
      type: String,
      default: "value"
    }
  },
  data() {
    return {};
  },
  computed: {
    isArray() {
      return Array.isArray(this.data);
    }
  }
};
</script>

<style lang="scss" module>
.wrap {
  display: flex;
  align-items: center;
  overflow: auto;
  background: #f4f4f5;
  overflow-x: scroll;
  overflow-y: hidden;
  border-top: solid 6px #f4f4f5;
  border-radius: 6px;
  height: 32px;
  font-size: 12px;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      background: #888;
      &:hover {
        background: #555;
      }
    }
  }
  .item {
    margin: 0px 16px;
    white-space: nowrap;
  }
}
</style>
