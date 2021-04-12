<template>
  <div :class="$style['wrap']">
    <div :class="$style['container']">
      <div :class="$style['tip']">未找到页面</div>
      <el-button @click="go">返回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "notFound",
  methods: {
    go() {
      this.$router.replace({
        name: "dashboard"
      });
    }
  }
};
</script>

<style lang="scss" module>
.wrap {
  display: flex;
  height: 100%;
}
.container {
  margin: auto;
  text-align: center;
}
.tip {
  margin: 24px 0;
  font-size: 32px;
}
</style>
