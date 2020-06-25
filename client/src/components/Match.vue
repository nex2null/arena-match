<template>
  <div>
    <div v-if="!activeMatch.matchBegun">
      <form class="form-horizontal" v-on:submit.prevent>
        <div class="form-group">
          <h5 class="p-centered">Match Joined!</h5>
        </div>
        <div class="form-group">
          <h6 class="p-centered">You Accepted: {{ activeMatch.youAccepted ? "Yes" : "No" }}</h6>
        </div>
        <div class="form-group">
          <h6
            class="p-centered"
          >Opponent Accepted: {{ activeMatch.opponentAccepted ? "Yes" : "No" }}</h6>
        </div>
        <div class="form-group pt-2">
          <button
            class="btn p-centered btn-lg"
            v-if="!activeMatch.youAccepted"
            @click="acceptMatch()"
          >Accept Match</button>
          <button
            class="btn p-centered btn-lg"
            v-if="!activeMatch.youAccepted"
            @click="rejectMatch()"
          >Reject Match</button>
        </div>
      </form>
    </div>
    <div v-else>
      <form v-on:submit.prevent>
        <div class="form-group">
          <h5 class="p-centered">Match Begun!</h5>
        </div>
        <div class="form-group">
          <label class="form-label" for="input-opp-username">Opponent Username:</label>
          <div class="input-group">
            <input
              class="form-input"
              type="text"
              id="input-opp-username"
              v-model="activeMatch.opponentUsername"
            />
            <button class="btn input-group-btn" @click="copyUsername()">Copy</button>
          </div>
        </div>
        <div class="form-group pt-2">
          <button class="btn p-centered btn-lg" @click="finishMatch()">Finish Match</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Match",
  computed: {
    ...mapGetters(["activeMatch"])
  },
  methods: {
    acceptMatch: function() {
      this.$store.dispatch("acceptMatch");
    },
    rejectMatch: function() {
      this.$store.dispatch("rejectMatch");
    },
    finishMatch: function() {
      this.$store.dispatch("finishMatch");
    },
    copyUsername() {
      try {
        let input = document.querySelector("#input-opp-username");
        input.select();
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
      } catch (err) {
        alert("Unable to copy. Please copy manually.");
      }
    }
  }
};
</script>
