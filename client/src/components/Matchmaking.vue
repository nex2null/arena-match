<template>
  <div>
    <div v-if="matchEndReason">The previous match ended because: {{ matchEndReason }}</div>
    <div v-if="inQueue && !match">
      <div>
        <strong>Finding match...</strong>
      </div>
      <div style="margin-top: 10px;">
        <button @click="dequeue()">Dequeue</button>
      </div>
    </div>
    <div v-if="!inQueue && !match">
      <div style="margin-top: 10px;">
        <strong>Username:</strong>
        <input type="text" v-model="username" style="margin-left: 5px; width: 150px;" />
      </div>
      <div style="margin-top: 10px;">
        <strong>Format:</strong>
        <select v-model="format" style="margin-left: 5px; width: 150px;">
          <option>Artisan</option>
          <option>Brawl</option>
          <option>Pauper</option>
        </select>
      </div>
      <div style="margin-top: 10px;">
        <strong>
          <label for="standard-only-check">Standard Cards Only:</label>
        </strong>
        <input
          type="checkbox"
          id="standard-only-check"
          v-model="standardOnly"
          style="margin-left: 5px;"
        />
      </div>
      <div style="margin-top: 10px;">
        <strong>Match Notes:</strong>
        <input type="text" v-model="matchNotes" style="margin-left: 5px; width: 150px;" />
      </div>
      <div style="margin-top: 10px;">
        <button @click="queue()">Queue</button>
      </div>
    </div>
    <div v-if="match">
      <div v-if="!match.matchBegun">
        <div>
          <strong>Match found!</strong>
        </div>
        <div style="margin-top: 10px">
          <div>Opponent Match Notes: {{ match.opponentMatchNotes }}</div>
          <div>You Accepted: {{ match.youAccepted ? "Yes" : "No" }}</div>
          <div>Opponent Accepted: {{ match.opponentAccepted ? "Yes" : "No" }}</div>
        </div>
        <div style="margin-top: 10px;">
          <button v-if="!match.youAccepted" @click="acceptMatch()">Accept Match</button>
          <button v-if="!match.youAccepted" @click="rejectMatch()">Reject Match</button>
        </div>
      </div>
      <div v-if="match.matchBegun" style="margin-top: 10px;">
        <div>
          <strong>Match Begun!</strong>
        </div>
        <div style="margin-top: 10px">
          <div>Opponent Username: {{ match.opponentUsername }}</div>
        </div>
        <div style="margin-top: 10px">
          <button @click="finishMatch()">Finish Match</button>
        </div>
      </div>
    </div>
    <div style="margin-top:20px;">
      <div>There are {{ onlineUsers }} users currently online</div>
      <div v-if="!connected">Connection lost. Attempting to reconnect...</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Matchmaking",
  data() {
    return {
      username: "",
      format: "Artisan",
      standardOnly: "",
      matchNotes: ""
    };
  },
  computed: {
    ...mapGetters([
      "onlineUsers",
      "connected",
      "inQueue",
      "match",
      "matchEndReason"
    ])
  },
  methods: {
    queue: function() {
      this.$store.dispatch("queue", {
        username: this.username,
        format: this.format,
        standardOnly: this.standardOnly,
        matchNotes: this.matchNotes
      });
    },
    dequeue: function() {
      this.$store.dispatch("dequeue");
    },
    acceptMatch: function() {
      this.$store.dispatch("acceptMatch");
    },
    rejectMatch: function() {
      this.$store.dispatch("rejectMatch");
    },
    finishMatch: function() {
      this.$store.dispatch("finishMatch");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
