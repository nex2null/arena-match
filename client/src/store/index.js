import Vue from 'vue'
import Vuex from 'vuex'
var _ = require('lodash');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    onlineUsers: 0,
    connected: false,
    matches: [],
    matchCreating: false,
    matchCreated: false,
    yourMatchId: null,
    activeMatch: null,
    lastMatchArgs: null,
    matchEndReason: ''
  },
  mutations: {
    SET_ONLINE_USERS(state, onlineUserCount) {
      state.onlineUsers = onlineUserCount;
    },
    SET_CONNECTED(state, connected) {
      state.connected = connected;
      if (!connected) {
        state.matchCreated = false;
        state.matches = [];
        if (state.activeMatch) {
          state.matchEndReason = 'Match ended due to disconnect';
          state.activeMatch = null;
        }
      }
    },
    MATCH_CREATED(state, matchId) {
      state.matchCreated = true;
      state.matchCreating = false;
      state.yourMatchId = matchId;
    },
    MATCH_CANCELLED(state) {
      state.matchCreated = false;
    },
    MATCH_JOINED(state) {
      state.activeMatch = {
        youAccepted: false,
        opponentAccepted: false,
        opponentUsername: '',
        matchBegun: false
      }
    },
    MATCH_ACCEPTED(state) {
      if (state.activeMatch) {
        state.activeMatch.youAccepted = true;
      }
    },
    OPPONENT_ACCEPTED(state) {
      if (state.activeMatch) {
        state.activeMatch.opponentAccepted = true;
      }
    },
    MATCH_BEGIN(state, opponentUsername) {
      state.matchCreated = false;
      state.yourMatchId = null;
      if (state.activeMatch) {
        state.activeMatch.opponentUsername = opponentUsername;
        state.activeMatch.matchBegun = true;
      }
    },
    MATCH_REJECTED(state) {
      if (state.activeMatch) {
        state.matchEndReason = 'Match rejected';
        state.activeMatch = null;
      }
    },
    MATCH_TIMEOUT(state) {
      if (state.activeMatch) {
        state.activeMatch = null;
        state.matchEndReason = 'Match timed out waiting for accept';
      }
    },
    MATCH_FINISHED(state) {
      if (state.activeMatch) {
        state.activeMatch = null;
        state.matchEndReason = 'Match finished successfully';
      }
    },
    SET_MATCH_ARGS(state, matchArgs) {
      state.lastMatchArgs = matchArgs;
    },
    SET_MATCH_CREATING(state, matchCreating) {
      state.matchCreating = matchCreating;
      if (matchCreating) {
        state.matchEndReason = '';
      }
    },
    SET_MATCH_JOIN_ENABLED(state, matchId, enabled) {
      var match = state.matches.find(x => x.id == matchId);
      if (match) {
        match.joinEnabled = enabled;
      }
    },
    REMOVE_MATCH(state, matchId) {
      state.matches = _.reject(state.matches, {
        'id': matchId
      });
    },
    ADD_MATCH(state, match) {
      state.matches.push(match);
    },
    SET_USERNAME(state, username) {
      state.username = username;
    },
    SET_MATCHES(state, matches) {
      state.matches = matches;
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
    socket_matchCreated(context, matchId) {
      context.commit('MATCH_CREATED', matchId);
    },
    socket_matchCancelled(context) {
      context.commit('MATCH_CANCELLED');
    },
    socket_matchJoined(context) {
      context.commit('MATCH_JOINED');
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
    socket_removeMatch(context, matchId) {
      context.commit('REMOVE_MATCH', matchId)
    },
    socket_addMatch(context, match) {
      context.commit('ADD_MATCH', match);
    },
    socket_disableMatchJoin(context, matchId) {
      context.commit('SET_MATCH_JOIN_ENABLED', matchId, false);
    },
    socket_enableMatchJoin(context, matchId) {
      context.commit('SET_MATCH_JOIN_ENABLED', matchId, true);
    },
    socket_syncAllMatches(context, matches) {
      context.commit('SET_MATCHES', matches);
    },
    startMatchCreate(context) {
      context.commit('SET_MATCH_CREATING', true);
    },
    cancelMatchCreate(context) {
      context.commit('SET_MATCH_CREATING', false);
    },
    createMatch(context, args) {
      this._vm.$socket.client.emit('create match', args);
      context.commit('SET_MATCH_ARGS', args);
    },
    cancelMatch() {
      this._vm.$socket.client.emit('cancel match');
    },
    joinMatch(matchId) {
      this._vm.$socket.client.emit('join match', matchId)
    },
    acceptMatch() {
      this._vm.$socket.client.emit('accept match');
    },
    rejectMatch() {
      this._vm.$socket.client.emit('reject match');
    },
    finishMatch() {
      this._vm.$socket.client.emit('finish match');
    },
    setUsername(context, username) {
      context.commit('SET_USERNAME', username)
    }
  },
  getters: {
    onlineUsers: state => state.onlineUsers,
    connected: state => state.connected,
    activeMatch: state => state.activeMatch,
    matchEndReason: state => state.matchEndReason,
    lastMatchArgs: state => state.lastMatchArgs,
    matchCreating: state => state.matchCreating,
    matchCreated: state => state.matchCreated,
    matches: state => state.matches,
    username: state => state.username
  }
})
