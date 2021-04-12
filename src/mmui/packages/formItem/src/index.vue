<template>
  <div class="mm-form-item" :class="[{ error: error }, size]">
    <div class="mm-form-item-label" :style="{ width: width }" v-if="label">
      {{ label }}
    </div>
    <div class="mm-form-item-container">
      <div class="mm-form-item-content">
        <slot></slot>
      </div>
      <div class="mm-form-item-tip" v-if="!noTip">
        <span v-if="tip">{{ tip }}</span>
        <slot v-else name="tip"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MmFormItem",
  props: {
    label: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: ""
    },
    tip: {
      type: String,
      default: ""
    },
    error: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ""
    },
    noTip: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      elFormItem: {
        elFormItemSize: this.size
      }
    };
  }
};
</script>
