<template>
  <div>
    <ul>
      <li v-for="match in matches" v-bind:key="match.id">{{ match.id }}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MatchList",
  computed: {
    ...mapGetters(["matches"])
  },
  methods: {}
};
</script>
