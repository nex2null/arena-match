<template>
  <div v-if="!username">
    <form class="form-horizontal" v-on:submit.prevent>
      <div class="form-group">
        <label class="form-label" for="input-username">
          Enter your MTGA Display Name
          <i style="font-size: small">(Format: PlayerName#12345)</i>
        </label>
        <input
          class="form-input"
          type="text"
          id="input-username"
          v-model="attemptedUsername"
          v-bind:class="{ 'is-error': !usernameValid }"
        />
      </div>
      <div class="form-group pt-2">
        <button class="btn p-centered btn-lg" @click="set()">Set</button>
      </div>
    </form>
  </div>
  <div v-else>
    <h6>Your username: {{ username }}</h6>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const usernameRegex = RegExp("^.*#[0-9]{5}$");

export default {
  name: "CreateMatch",
  data() {
    return {
      attemptedUsername: ""
    };
  },
  computed: {
    ...mapGetters(["username"]),
    usernameValid: function() {
      return usernameRegex.test(this.attemptedUsername);
    }
  },
  methods: {
    set: function() {
      if (this.usernameValid) {
        this.$store.dispatch("setUsername", this.attemptedUsername);
      }
    }
  }
};
</script>