<template>
  <div class="mm-atp">
    <div class="mm-atp-top" v-if="$slots.top">
      <slot name="top"></slot>
    </div>
    <div
      class="mm-atp-action"
      v-if="$slots['action-left'] || $slots['action-right']"
    >
      <div class="mm-atp-action-left">
        <slot name="action-left"></slot>
      </div>
      <div class="mm-atp-action-right">
        <slot name="action-right"></slot>
      </div>
    </div>
    <div class="mm-atp-table" v-if="$slots.table">
      <slot name="table"></slot>
    </div>
    <div
      class="mm-atp-pagination"
      :class="`mm-atp-pagination_${palign}`"
      v-if="$slots.pagination"
    >
      <slot name="pagination"></slot>
    </div>
    <div class="mm-atp-bottom" v-if="$slots.bottom">
      <slot name="bottom"></slot>
    </div>
    <slot name="other"></slot>
  </div>
</template>

<script>
export default {
  name: "MmAtp",
  props: {
    palign: {
      type: String,
      default: "center"
    }
  }
};
</script>
