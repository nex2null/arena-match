<template>
  <div>
    <div v-if="inQueue">
      <form class="form-horizontal" v-on:submit.prevent>
        <div class="form-group">
          <h5 class="p-centered">Finding match...</h5>
        </div>
        <div class="form-group pt-2">
          <button class="btn p-centered btn-lg" @click="dequeue()">Dequeue</button>
        </div>
      </form>
    </div>
    <div v-else>
      <form class="form-horizontal" v-on:submit.prevent>
        <div class="form-group">
          <label class="form-label" for="input-username">
            Username
            <i style="font-size: small">(Format: PlayerName#12345)</i>
          </label>
          <input
            class="form-input"
            type="text"
            id="input-username"
            v-model="username"
            v-bind:class="{ 'is-error': !usernameValid }"
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="input-format">Format</label>
          <select class="form-select" v-model="format">
            <option>Artisan</option>
            <option>Brawl</option>
            <option>Pauper</option>
            <option>Prismatic</option>
            <option>Singleton</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-switch">
            <input type="checkbox" v-model="standardOnly" />
            <i class="form-icon"></i> Standard cards only
          </label>
        </div>
        <div class="form-group">
          <label class="form-label" for="input-match-notes">Match Notes</label>
          <input class="form-input" type="text" id="input-match-notes" v-model="matchNotes" />
        </div>
        <div class="form-group pt-2">
          <button class="btn p-centered btn-lg" @click="queue()">Queue</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const usernameRegex = RegExp("^.*#[0-9]{5}$");

export default {
  name: "Queue",
  data() {
    return {
      username: "",
      format: "Artisan",
      standardOnly: false,
      matchNotes: ""
    };
  },
  computed: {
    ...mapGetters(["inQueue", "lastQueueArgs"]),
    usernameValid: function() {
      return usernameRegex.test(this.username);
    }
  },
  mounted: function() {
    if (this.lastQueueArgs) {
      this.username = this.lastQueueArgs.username;
      this.format = this.lastQueueArgs.format;
      this.standardOnly = this.lastQueueArgs.standardOnly;
      this.matchNotes = this.lastQueueArgs.matchNotes;
    }
  },
  methods: {
    queue: function() {
      if (this.usernameValid) {
        this.$store.dispatch("queue", {
          username: this.username,
          format: this.format,
          standardOnly: this.standardOnly,
          matchNotes: this.matchNotes
        });
      }
    },
    dequeue: function() {
      this.$store.dispatch("dequeue");
    }
  }
};
</script>