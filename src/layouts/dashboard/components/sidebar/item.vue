<template>
  <div :class="$style['item']">
    <div :class="$style['menu']" @click="go">
      <div :class="$style['icon']">
        <mm-icon :icon="data.F_Icon"></mm-icon>
      </div>
      <span :class="$style['title']">{{ data.F_Name }}</span>
      <mm-icon
        v-if="hasChildren"
        :class="$style['more']"
        icon="iconchevron-right"
      ></mm-icon>
    </div>
    <div v-if="hasChildren" :class="$style['children']">
      <c-item
        v-for="(item, index) in data.Child"
        :key="index"
        :data="item"
      ></c-item>
    </div>
  </div>
</template>

<script>
export default {
  name: "cItem",
  props: {
    data: {
      type: Object,
      default() {
        return {
          F_Name: "",
          F_Icon: "",
          F_Url: "",
          Child: []
        };
      }
    }
  },
  computed: {
    hasChildren() {
      return this.data.Child && this.data.Child.length > 0 ? true : false;
    }
  },
  methods: {
    go() {
      if (this.data.F_Url) {
        this.$router.replace({
          name: this.data.F_Url
        });
      }
    }
  }
};
</script>

<style lang="scss" module>
.item {
  .menu {
    color: #fff;
    min-width: 160px;
    height: 50px;
    white-space: nowrap;
    user-select: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-left: solid 2px transparent;

    .icon {
      width: 50px;
      text-align: center;
      font-size: 16px;
      line-height: 1;
      color: currentColor;
    }

    .title {
      flex: 1;
      font-size: 14px;
      margin-right: 12px;
    }

    .more {
      font-size: 18px;
      margin-right: 12px;
    }
  }

  &:hover {
    > .menu {
      background: #409eff;
    }

    > .children {
      visibility: visible;
    }
  }

  .children {
    visibility: hidden;
    position: absolute;
    top: 0;
    right: 10px;
    height: 100%;
    background: #505b7e;
    transform: translateX(100%);
    box-shadow: 1px 0px 4px 0 rgba(0, 0, 0, 0.08);

    &::-webkit-scrollbar-track {
      background: #505b7e;
    }
  }
}
</style>
