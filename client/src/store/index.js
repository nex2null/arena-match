import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lastQueueArgs: null,
    onlineUsers: 0,
    connected: false,
    inQueue: false,
    match: null,
    matchEndReason: ''
  },
  mutations: {
    SET_ONLINE_USERS(state, onlineUserCount) {
      state.onlineUsers = onlineUserCount;
    },
    SET_CONNECTED(state, connected) {
      state.connected = connected;
      if (!connected) {
        state.inQueue = false;
        if (state.match) {
          state.matchEndReason = 'Disconnected';
          state.match = null;
        }
      }
    },
    SET_IN_QUEUE(state, inQueue) {
      state.inQueue = inQueue;
      state.matchEndReason = '';
    },
    MATCH_FOUND(state, matchNotes) {
      state.inQueue = false;
      state.match = {
        youAccepted: false,
        opponentAccepted: false,
        opponentMatchNotes: matchNotes,
        opponentUsername: '',
        matchBegun: false
      }
    },
    MATCH_ACCEPTED(state) {
      if (state.match) {
        state.match.youAccepted = true;
      }
    },
    OPPONENT_ACCEPTED(state) {
      if (state.match) {
        state.match.opponentAccepted = true;
      }
    },
    MATCH_BEGIN(state, opponentUsername) {
      if (state.match) {
        state.match.opponentUsername = opponentUsername;
        state.match.matchBegun = true;
      }
    },
    MATCH_REJECTED(state) {
      if (state.match) {
        state.matchEndReason = 'Match rejected';
        state.match = null;
      }
    },
    MATCH_TIMEOUT(state) {
      if (state.match) {
        state.matchEndReason = 'Match timed out waiting for accept';
        state.match = null;
      }
    },
    MATCH_FINISHED(state) {
      if (state.match) {
        state.matchEndReason = 'Match finished successfully';
        state.match = null;
      }
    },
    SET_QUEUE_ARGS(state, args) {
      state.lastQueueArgs = args;
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
    },
    socket_queued(context) {
      context.commit('SET_IN_QUEUE', true);
    },
    socket_dequeued(context) {
      context.commit('SET_IN_QUEUE', false);
    },
    socket_matchFound(context, matchNotes) {
      context.commit('MATCH_FOUND', matchNotes);
      var audio = new Audio("https://soundbible.com/grab.php?id=2158&type=wav");
      audio.play();
    },
    socket_matchAccepted(context) {
      context.commit('MATCH_ACCEPTED');
    },
    socket_opponentAccepted(context) {
      context.commit('OPPONENT_ACCEPTED');
    },
    socket_matchBegin(context, opponentUsername) {
      context.commit('MATCH_BEGIN', opponentUsername);
    },
    socket_matchRejected(context) {
      context.commit('MATCH_REJECTED');
    },
    socket_matchTimeout(context) {
      context.commit('MATCH_TIMEOUT');
    },
    socket_matchFinished(context) {
      context.commit('MATCH_FINISHED');
    },
    queue(context, args) {
      this._vm.$socket.client.emit('queue', args);
      context.commit('SET_QUEUE_ARGS', args);
    },
    dequeue() {
      this._vm.$socket.client.emit('dequeue');
    },
    acceptMatch() {
      this._vm.$socket.client.emit('accept match');
    },
    rejectMatch() {
      this._vm.$socket.client.emit('reject match');
    },
    finishMatch() {
      this._vm.$socket.client.emit('finish match');
    }
  },
  getters: {
    onlineUsers: state => state.onlineUsers,
    connected: state => state.connected,
    inQueue: state => state.inQueue,
    match: state => state.match,
    matchEndReason: state => state.matchEndReason,
    lastQueueArgs: state => state.lastQueueArgs
  }
})
