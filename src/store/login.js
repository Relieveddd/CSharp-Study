export default{
  namespaced: true,
  state: {
    logonInvalidation: false
  },
  mutations: {
    set(state, payload){
      Object.assign(state,payload)
    }
  }
}