<template>
  <div :class="$style['wrap']">
    <div :class="$style['tabList']">
      <c-tab
        v-for="(item, index) in pinTabList"
        :key="'pin' + index"
        :tab="item"
        @contextmenu="onContextmenu"
      ></c-tab>
      <c-tab
        v-for="(item, index) in tabList"
        :key="index"
        :tab="item"
        @contextmenu="onContextmenu"
      ></c-tab>
    </div>
    <c-menu
      v-if="ui.menu"
      :x="menu.x"
      :y="menu.y"
      :isShow.sync="ui.menu"
      @refresh="onRefresh"
      @close="onClose"
      @closeOther="onCloseOther"
    ></c-menu>
  </div>
</template>

<script>
import CTab from "./tab";
import CMenu from "./menu";

export default {
  components: {
    CTab,
    CMenu
  },
  data() {
    return {
      menu: {
        x: null,
        y: null,
        tab: null,
        instance: null
      },
      ui: {
        menu: false
      }
    };
  },
  computed: {
    pinTabList() {
      return this.$store.state.tabView.pinTabList;
    },
    tabList() {
      return this.$store.state.tabView.tabList;
    }
  },
  watch: {
    $route() {
      this.activeTab();
    }
  },
  methods: {
    activeTab() {
      this.$store.commit("tabView/activeTab", {
        tab: this.$route
      });
    },
    onContextmenu(e) {
      this.menu = e;
      this.ui.menu = true;
    },
    onRefresh() {
      this.$emit("refresh", {
        tab: this.menu.tab
      });
    },
    onClose() {
      if (this.menu.instance) {
        this.menu.instance.onClose();
      }
    },
    onCloseOther() {
      if (this.menu.instance) {
        this.menu.instance.onCloseOther();
      }
    }
  },
  created() {
    this.activeTab();
  }
};
</script>

<style lang="scss" module>
.wrap {
  position: relative;
  .tabList {
    overflow-x: scroll;
    overflow-y: hidden;
    height: 40px;
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-end;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-track {
      background: #fff;
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
  }
}
</style>
