import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    messages: [],
    onlineUsers: 0
  },
  mutations: {
    NEW_MESSAGE(state, message) {
      state.messages.push(message);
    },
    UPDATE_ONLINE_USERS(state, onlineUserCount) {
      state.onlineUsers = onlineUserCount;
    }
  },
  actions: {
    socket_chatMessage(context, message) {
      context.commit('NEW_MESSAGE', message);
    },
    socket_onlineUsers(context, onlineUserCount) {
      context.commit('UPDATE_ONLINE_USERS', onlineUserCount);
    },
    sendMessage(context, message) {
      this._vm.$socket.client.emit('chat message', message);
    },
    login(context, username) {
      this._vm.$socket.client.emit('login', username);
    }
  },
  getters: {
    messages: state => state.messages,
    onlineUsers: state => state.onlineUsers
  }
})
