<template>
  <div>
    <div v-if="!matchCreating && !matchCreated">
      <form class="form-horizontal" v-on:submit.prevent>
        <div class="form-group pt-2">
          <button class="btn p-centered" @click="startCreate()">Create Match</button>
        </div>
      </form>
    </div>
    <div v-if="matchCreating">
      <form class="form-horizontal" v-on:submit.prevent>
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
          <input class="form-input" type="text" id="input-match-notes" v-model="matchNotes" maxlength="50" />
        </div>
        <div class="form-group pt-2">
          <button class="btn p-centered" @click="create()">Create</button>
          <button class="btn p-centered" @click="cancelCreate()">Cancel</button>
        </div>
      </form>
    </div>
    <div v-if="matchCreated">
      <form class="form-horizontal" v-on:submit.prevent>
        <div class="form-group pt-2">
          <button class="btn p-centered" @click="cancelMatch()">Cancel My Match</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CreateMatch",
  data() {
    return {
      format: "Artisan",
      standardOnly: false,
      matchNotes: ""
    };
  },
  computed: {
    ...mapGetters([
      "lastMatchArgs",
      "matchCreated",
      "matchCreating",
      "username"
    ])
  },
  mounted: function() {
    if (this.lastMatchArgs) {
      this.username = this.lastMatchArgs.username;
      this.format = this.lastMatchArgs.format;
      this.standardOnly = this.lastMatchArgs.standardOnly;
      this.matchNotes = this.lastMatchArgs.matchNotes;
    }
  },
  methods: {
    startCreate: function() {
      this.$store.dispatch("startMatchCreate");
    },
    create: function() {
      this.$store.dispatch("createMatch", {
        username: this.username,
        format: this.format,
        standardOnly: this.standardOnly,
        matchNotes: this.matchNotes
      });
    },
    cancelCreate: function() {
      this.$store.dispatch("cancelMatchCreate");
    },
    cancelMatch: function() {
      this.$store.dispatch("cancelMatch");
    }
  }
};
</script>