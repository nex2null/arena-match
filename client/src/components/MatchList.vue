<template>
  <div>
    <div class="divider text-center" data-content="Active Matches"></div>
    <div v-if="!allMatchesButMine.length && !matchCreated">
      <h6>No active matches. You should create one!</h6>
    </div>
    <div v-if="!allMatchesButMine.length && matchCreated">
      <h6>No matches other than yours found.</h6>
    </div>
    <div
      class="card"
      v-for="match in allMatchesButMine"
      v-bind:key="match.id"
      style="margin-top: 10px;"
    >
      <div class="card-body">
        <div class="columns">
          <div
            class="col-10"
            style="font-size: small"
            v-bind:class="{ 'flex-centered': !match.matchNotes }"
          >
            <div>
              <strong>Format:</strong>
              {{ match.format }} - {{ match.standardOnly ? "Standard Only" : "Historic" }}
            </div>
            <div v-if="match.matchNotes">
              <strong>Match Notes:</strong>
              {{ match.matchNotes }}
            </div>
          </div>
          <div class="col-2 flex-centered">
            <button
              class="btn p-centered btn-primary"
              :disabled="!match.joinEnabled || matchCreated"
              @click="joinMatch(match.id)"
            >Join</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MatchList",
  computed: {
    ...mapGetters(["matches", "matchCreated", "yourMatchId"]),
    allMatchesButMine: function() {
      return this.matches.filter(x => x.id != this.yourMatchId);
    }
  },
  methods: {
    joinMatch: function(matchId) {
      this.$store.dispatch("joinMatch", matchId);
    }
  }
};
</script>
