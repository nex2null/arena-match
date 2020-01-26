import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    onlineUsers: 0,
    connected: false
  },
  mutations: {
    SET_ONLINE_USERS(state, onlineUserCount) {
      state.onlineUsers = onlineUserCount;
    },
    SET_CONNECTED(state, connected) {
      state.connected = connected;
    }
  },
  actions: {
    socket_onlineUsers(context, onlineUserCount) {
      context.commit('SET_ONLINE_USERS', onlineUserCount);
    },
    socket_connect(context) {
      context.commit('SET_CONNECTED', true);
    },
    socket_disconnect(context) {
      context.commit('SET_CONNECTED', false);
    }
  },
  getters: {
    onlineUsers: state => state.onlineUsers,
    connected: state => state.connected
  }
})
