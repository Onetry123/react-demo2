import vue from 'vue';
import vuex from 'vuex'

vue.use(vuex);
export default new vuex.Store({
  state: {
    msg:0
  },
  mutations: {
    chenge(state,num) {
      state.msg=num
    }
  },
  actions: {
    chenge(state,num) {
      state.commit('',num)
    }
  }
})
