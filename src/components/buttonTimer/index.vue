<template>
  <el-button @click="onClick" :disabled="countdown > 0 || disabled">
    <template v-if="countdown <= 0">{{ label }}</template>
    <template v-else
      >等待 {{ countdown }} 秒</template
    >
  </el-button>
</template>

<script>
export default {
  name: "buttontimer",
  props: {
    label: {
      type: String,
      default: "按钮"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timer: null,
      countdown: 0
    };
  },
  methods: {
    onClick(e) {
      this.countdown = 60;

      this.timer = setInterval(() => {
        if (this.countdown === 0) {
          clearInterval(this.timer);
        } else {
          this.countdown -= 1;
        }
      }, 1000);

      this.$emit("click", e);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>
