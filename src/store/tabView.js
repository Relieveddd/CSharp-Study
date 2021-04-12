import router from "@/router";

const initState = function() {
  return {
    pinTabList: [
      [
        "dashboard",
        {
          path: "",
          name: "dashboard",
          meta: {
            title: "首页",
            isPin: true
          }
        }
      ]
    ],
    tabList: [],
    currentTab: null
  };
};

export default {
  namespaced: true,
  state: initState(),
  mutations: {
    set(state, payload) {
      Object.assign(state, payload);
    },
    reset(state) {
      Object.assign(state, initState());
    },
    addTab(state, payload) {
      let map = new Map(state.tabList);
      let tab = payload.tab;

      map.set(tab.name, tab);
      state.tabList = Array.from(map);
    },
    removeTab(state, payload) {
      let map = new Map(state.tabList);
      let tab = payload.tab;

      map.delete(tab.name);
      state.tabList = Array.from(map);
    },
    activeTab(state, payload) {
      state.currentTab = payload.tab;
    }
  },
  actions: {
    closeTab(
      { state, commit },
      preload = {
        tabName: ""
      }
    ) {
      if (!preload.tabName) return;

      commit("removeTab", {
        tab: {
          name: preload.tabName
        }
      });

      let isActive = state.currentTab
        ? state.currentTab.name === preload.tabName
        : false;

      if (isActive) {
        let tabSize = state.tabList.length;

        if (tabSize >= 1) {
          let lastTab = state.tabList[tabSize - 1];

          router.replace({
            name: lastTab[0]
          });
        } else {
          let firstPinTab = state.pinTabList[0];

          router.replace({
            name: firstPinTab[0]
          });
        }
      }
    },
    reset({ commit }) {
      commit("reset");
    }
  }
};
