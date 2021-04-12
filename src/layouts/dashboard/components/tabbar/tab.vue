<template>
  <div
    :class="[$style['wrap'], isActive ? $style['active'] : '']"
    @click="onClick"
    @contextmenu.prevent="onContextmenu"
  >
    <span> {{ tabTitle }} </span>
    <span :class="$style['close']" @click.stop="onClose" v-if="!isPin">
      <mm-icon icon="iconguanbi" color="black"></mm-icon>
    </span>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    tab: {}
  },
  data() {
    return {
      menuX: null,
      menuY: null,
      isShowMenu: false
    };
  },
  computed: {
    isActive() {
      return this.$store.state.tabView.currentTab
        ? this.$store.state.tabView.currentTab.name === this.tab[0]
        : false;
    },
    tabTitle() {
      return this.tab[1].meta.title || this.tab[0];
    },
    isPin() {
      return this.tab[1].meta.isPin;
    }
  },
  methods: {
    async onContextmenu(e) {
      this.$emit("contextmenu", {
        x: e.x,
        y: e.y,
        tab: this.tab,
        instance: this
      });
    },
    onClick() {
      this.$router.replace({
        name: this.tab[0]
      });
    },
    onClose() {
      this.$store.commit("tabView/removeTab", {
        tab: this.tab[1]
      });

      if (this.isActive) {
        let tabSize = this.$store.state.tabView.tabList.length;

        if (tabSize >= 1) {
          let lastTab = this.$store.state.tabView.tabList[tabSize - 1];

          this.$router.replace({
            name: lastTab[0]
          });
        } else {
          let firstPinTab = this.$store.state.tabView.pinTabList[0];

          this.$router.replace({
            name: firstPinTab[0]
          });
        }
      }
    },
    onCloseOther() {
      if (this.isPin) {
        this.$store.state.tabView.tabList = [];
      } else {
        this.$store.state.tabView.tabList = [this.tab];
      }

      this.$router.replace({
        name: this.tab[0]
      });
    }
  }
};
</script>

<style lang="scss" module>
.wrap {
  flex: none;
  background: #dde3ec;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  position: relative;
  box-sizing: border-box;
  &.active {
    height: 100%;
    background: #fff;
    color: #409eff;
    border-top: solid 2px #409eff;
  }
  .close {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 8px;
    border-radius: 50%;
    font-size: 0.8em;
    padding: 2px;
    background: transparent;
    will-change: background;
    transition: all 0.3s;
    &:hover {
      background: #dddddd;
    }
  }
}
</style>
