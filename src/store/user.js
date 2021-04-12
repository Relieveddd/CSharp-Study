let initState = function() {
  return {
    token: "",
    phone: ""
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
    }
  },
  actions: {
    reset({ commit }) {
      commit("reset");
    }
  }
};
